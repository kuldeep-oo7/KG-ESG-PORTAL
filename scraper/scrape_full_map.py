"""
ESGTech Scraper — FOCUSED VERSION
Skips /sites page entirely (causes browser crash).
Goes directly to assessment URLs to map forms + cascading dropdowns.
Also visits Dashboard, Reports, Organization, Help, Settings.
"""
import asyncio, json, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LOGIN_URL = "https://app.esgtech.ai/login"
EMAIL     = "compliance.mfg@kgirdharlal.com"
PASSWORD  = "PXJNAEBasj"
BASE_URL  = "https://app.esgtech.ai"

# IMPORTANT: /sites is excluded — it crashes the browser
TOP_PAGES = [
    ("Dashboard",    "/dashboard"),
    ("GHG Reports",  "/report"),
    ("Organization", "/organization"),
    ("Help",         "/help"),
    ("Settings",     "/settings"),
]

SITES = [
    (192, "Mumbai"),
    (193, "Surat"),
    (194, "Facets_Surat"),
    (195, "Dubai"),
    (196, "Botswana"),
]

SCOPES = [
    ("Q1",  "Stationary Combustion"),
    ("Q2",  "Mobile Combustion"),
    ("Q3",  "Fugitive Emissions"),
    ("Q4",  "Electricity Scope2"),
    ("Q16", "Scope3"),
]

OUT  = Path(__file__).parent / "output"
SHOT = OUT / "screenshots_full"
OUT.mkdir(exist_ok=True)
SHOT.mkdir(exist_ok=True)

result    = {"top_pages": {}, "assessment_forms": {}}
api_log   = {}
nav_lines = []
N = [0]
PG = [None]   # page reference


def slug(t):
    return re.sub(r"[^a-z0-9]+", "_", (t or "").lower()).strip("_")[:50]

async def ss(label):
    N[0] += 1
    p = SHOT / f"{N[0]:04d}_{slug(label)}.png"
    try: await PG[0].screenshot(path=str(p), full_page=True)
    except: pass
    return str(p)

async def go(url):
    try:
        await PG[0].goto(url, wait_until="domcontentloaded", timeout=20000)
        await PG[0].wait_for_timeout(2500)
        try: await PG[0].wait_for_load_state("networkidle", timeout=6000)
        except: pass
        return True
    except Exception as e:
        print(f"  [nav err] {e}")
        return False

async def gtxt(el):
    try: return (await el.inner_text()).strip()
    except: return ""

async def gattr(el, a):
    try: return (await el.get_attribute(a) or "").strip()
    except: return ""

async def has_modal():
    for s in ["[role='dialog']:visible","[class*='Modal']:visible","[class*='modal']:visible","[class*='Drawer']:visible"]:
        try:
            if await PG[0].locator(s).count(): return True
        except: pass
    return False

async def close_modal():
    for s in ["button:has-text('Cancel'):visible","button:has-text('Close'):visible","[aria-label='Close']:visible"]:
        try:
            loc = PG[0].locator(s).first
            if await loc.count():
                await loc.click(); await PG[0].wait_for_timeout(600); return
        except: pass
    try: await PG[0].keyboard.press("Escape"); await PG[0].wait_for_timeout(500)
    except: pass

# ── Network listener (attach once) ────────────────────────────────────────────
def attach_net():
    SKIP = [".js",".css",".png",".jpg",".ico",".woff",".svg",".gif","blob:","monitoring","analytics","hotjar","sentry","intercom","crisp"]
    async def on_resp(resp):
        try:
            url = resp.url
            if any(p in url for p in SKIP): return
            path = url.replace(BASE_URL,"").split("?")[0]
            key  = f"{resp.request.method}:{path}"
            if key in api_log: return
            req_body = None
            try: req_body = resp.request.post_data
            except: pass
            resp_data = None
            try:
                if "json" in resp.headers.get("content-type",""):
                    resp_data = (await resp.text())[:4000]
            except: pass
            api_log[key] = {"method":resp.request.method,"url":url,"path":path,"status":resp.status,"request_body":req_body,"response_preview":resp_data}
            print(f"  [API] {resp.request.method:6s} {path[-65:]}  {resp.status}")
        except: pass
    PG[0].on("response", on_resp)

# ── Page structure ─────────────────────────────────────────────────────────────
async def page_struct(ctx):
    pg = PG[0]
    d = {"context":ctx, "url":pg.url, "headings":[], "buttons":[], "table_cols":[], "tabs":[], "nav_links":[]}
    try:
        for el in await pg.locator("h1,h2,h3,h4").all():
            t = await gtxt(el)
            if t and len(t)<150 and t not in d["headings"]: d["headings"].append(t)
        for el in await pg.locator("[role='tab']:visible").all():
            t = await gtxt(el)
            if t and t not in d["tabs"]: d["tabs"].append(t)
        for el in await pg.locator("button:visible,[role='button']:visible").all():
            t = await gtxt(el)
            if t and 0<len(t)<80 and t not in d["buttons"]: d["buttons"].append(t)
        for el in await pg.locator("th:visible,[role='columnheader']:visible").all():
            t = await gtxt(el)
            if t and t not in d["table_cols"]: d["table_cols"].append(t)
        for el in await pg.locator("nav a:visible,aside a:visible,[class*='sidebar'] a:visible").all():
            t = await gtxt(el); href = await gattr(el,"href")
            if t and len(t)<80:
                e = {"text":t,"href":href}
                if e not in d["nav_links"]: d["nav_links"].append(e)
    except Exception as ex: d["error"]=str(ex)
    return d

# ── Form fields ────────────────────────────────────────────────────────────────
async def get_fields():
    pg = PG[0]; fields = []
    for inp in await pg.locator("input:visible,textarea:visible,select:visible").all():
        try:
            tag = (await inp.evaluate("el=>el.tagName")).lower()
            itype = await gattr(inp,"type") or "text"
            if itype in ("hidden","submit","button","image","reset"): continue
            name = await gattr(inp,"name"); iid = await gattr(inp,"id"); ph = await gattr(inp,"placeholder")
            req = await inp.evaluate("el=>el.required")
            lbl=""
            if iid:
                l=pg.locator(f"label[for='{iid}']")
                if await l.count(): lbl=await gtxt(l.first)
            if not lbl:
                try: lbl=(await inp.evaluate("""el=>{
                    const g=el.closest('[class*=Field],[class*=formGroup],[class*=group],[class*=wrapper],[class*=form-item],[class*=Form],[class*=row]');
                    if(g){const l=g.querySelector('label,[class*=label],[class*=Label]');return l?l.innerText.trim():'';}
                    const c=el.closest('label');if(c)return c.innerText.trim();return '';
                }""")or"").strip()
                except: pass
            unit=""
            try: unit=(await inp.evaluate("""el=>{
                const p=el.parentElement;const u=p&&p.querySelector('[class*=unit],[class*=Unit],[class*=suffix]');return u?u.innerText.trim():'';
            }""")or"").strip()
            except: pass
            fields.append({"label":lbl or name or iid or ph or f"f_{itype}","type":itype,"tag":tag,"name":name,"placeholder":ph,"required":req,"unit":unit})
        except: pass
    return fields

# ── Dropdown snapshot ──────────────────────────────────────────────────────────
async def get_dd_label(el, i):
    try:
        lbl=await el.evaluate("""el=>{
            const g=el.closest('[class*=Field],[class*=formGroup],[class*=group],[class*=wrapper],[class*=form-item],[class*=item],[class*=Form]');
            if(g){const l=g.querySelector('label,[class*=label],[class*=Label]');if(l)return l.innerText.trim();}
            let p=el.previousElementSibling;
            while(p){const t=p.innerText.trim();if(t&&t.length<60)return t;p=p.previousElementSibling;}
            return '';
        }""")
        return (lbl or f"dd_{i}").strip()
    except: return f"dd_{i}"

async def open_dd_read_opts(el):
    pg = PG[0]; opts=[]
    try:
        await el.scroll_into_view_if_needed(); await el.click(timeout=3000); await pg.wait_for_timeout(800)
        for sel in ["[role='option']:visible","[class*='option']:visible:not([class*='control']):not([class*='indicator'])","ul[role='listbox'] li:visible"]:
            for o in await pg.locator(sel).all():
                t=(await gtxt(o)).strip()
                if t and 0<len(t)<200 and t not in opts: opts.append(t)
            if opts: break
        await pg.keyboard.press("Escape"); await pg.wait_for_timeout(400)
    except:
        try: await pg.keyboard.press("Escape")
        except: pass
    return opts

async def snapshot_dds():
    pg = PG[0]; r={}
    for sel_el in await pg.locator("select:visible").all():
        try:
            name=await gattr(sel_el,"name") or await gattr(sel_el,"id") or "select"
            opts=await sel_el.evaluate("el=>Array.from(el.options).map(o=>o.text.trim()).filter(t=>t)")
            if opts: r[name]=opts
        except: pass
    for i,cs in enumerate(await pg.locator("[class*='select__control']:visible,[role='combobox']:visible").all()):
        try:
            lbl=await get_dd_label(cs,i)
            opts=await open_dd_read_opts(cs)
            if opts: r[lbl]=opts
        except: pass
    return r

# ── CASCADE MAPPER — the core feature ─────────────────────────────────────────
async def map_cascades(ctx):
    """
    For every dropdown on screen:
      → read all its options
      → select each option
      → record which OTHER dropdowns changed (and to what new options)
    This builds the complete dependency tree.
    """
    pg = PG[0]
    print(f"    [cascade] {ctx[:60]}")
    initial = await snapshot_dds()
    out = {"_initial": initial}
    if not initial:
        print(f"      no dropdowns"); return out
    print(f"      dds: {list(initial.keys())}")
    nav_lines.append(f"  DROPDOWNS FOUND: {list(initial.keys())}")
    for k,v in initial.items():
        nav_lines.append(f"    {k}: {v}")

    dds = await pg.locator("[class*='select__control']:visible,[role='combobox']:visible").all()
    for i in range(min(len(dds), 8)):
        try:
            fresh = await pg.locator("[class*='select__control']:visible,[role='combobox']:visible").all()
            if i >= len(fresh): break
            dd = fresh[i]
            lbl  = await get_dd_label(dd, i)
            opts = await open_dd_read_opts(dd)
            if not opts: continue
            print(f"      [{lbl}]  {len(opts)} options")
            nav_lines.append(f"  DD[{lbl}] options: {opts}")
            out[lbl] = {"options": opts, "cascades": {}}

            for opt in opts[:15]:
                try:
                    fresh2 = await pg.locator("[class*='select__control']:visible,[role='combobox']:visible").all()
                    if i >= len(fresh2): break
                    target = fresh2[i]
                    await target.scroll_into_view_if_needed()
                    await target.click(timeout=3000)
                    await pg.wait_for_timeout(700)
                    clicked = False
                    for sel in ["[role='option']:visible","[class*='option']:visible:not([class*='control'])"]:
                        for o in await pg.locator(sel).all():
                            if (await gtxt(o)).strip() == opt.strip():
                                await o.click(); clicked=True; break
                        if clicked: break
                    if not clicked:
                        try: await pg.keyboard.press("Escape")
                        except: pass
                        continue
                    await pg.wait_for_timeout(1200)
                    after = await snapshot_dds()
                    changes = {k:v for k,v in after.items() if k!=lbl and (k not in initial or initial[k]!=v)}
                    if changes:
                        out[lbl]["cascades"][opt] = changes
                        print(f"        '{opt[:25]}' → {list(changes.keys())}")
                        nav_lines.append(f"    CASCADE: '{opt}' → {changes}")
                except:
                    try: await pg.keyboard.press("Escape")
                    except: pass
        except Exception as e:
            print(f"      [err] {e}")
    return out

# ── Login ──────────────────────────────────────────────────────────────────────
async def login():
    print("Logging in...")
    await go(LOGIN_URL)
    await ss("01_login")
    pg = PG[0]
    for s in ["input[name='email']","input[id='email']","input[placeholder*='Email' i]"]:
        if await pg.locator(s).count(): await pg.locator(s).first.fill(EMAIL); break
    await pg.wait_for_timeout(400)
    for s in ["input[type='password']","input[name='password']"]:
        if await pg.locator(s).count(): await pg.locator(s).first.fill(PASSWORD); break
    await pg.wait_for_timeout(400)
    await ss("02_login_filled")
    for s in ["button[type='submit']","button:has-text('Submit')"]:
        if await pg.locator(s).count(): await pg.locator(s).first.click(); break
    await pg.wait_for_url(lambda u:"login" not in u, timeout=25000)
    await pg.wait_for_timeout(3000)
    await ss("03_dashboard")
    print(f"  Logged in → {pg.url}")

# ── Top pages (no Sites) ───────────────────────────────────────────────────────
async def scrape_top_pages():
    print("\n=== TOP PAGES (no /sites) ===")
    nav_lines.append("=== TOP PAGES ===\n")
    for pname, path in TOP_PAGES:
        url = BASE_URL + path
        print(f"\n  [{pname}]")
        nav_lines.append(f"\n## PAGE: {pname}  ({url})")
        pd = {"url":url,"tabs":{},"modals":{}}
        if not await go(url):
            pd["error"]="nav failed"; result["top_pages"][pname]=pd; continue
        await ss(f"page_{slug(pname)}")
        c = await page_struct(f"PAGE:{pname}")
        pd.update(c)
        nav_lines.append(f"  headings:   {c['headings']}")
        nav_lines.append(f"  table_cols: {c['table_cols']}")
        nav_lines.append(f"  buttons:    {c['buttons']}")
        nav_lines.append(f"  tabs:       {c['tabs']}")
        print(f"    headings: {c['headings']}")
        print(f"    cols: {c['table_cols']}")

        # tabs
        for tab in await PG[0].locator("[role='tab']:visible").all():
            tlbl = await gtxt(tab)
            if not tlbl: continue
            try:
                await tab.click(); await PG[0].wait_for_timeout(1000)
                await ss(f"page_{slug(pname)}_tab_{slug(tlbl)}")
                tc = await page_struct(f"{pname}>{tlbl}")
                tc["dropdowns"] = await snapshot_dds()
                tc["fields"]    = await get_fields()
                pd["tabs"][tlbl] = tc
                nav_lines.append(f"  TAB[{tlbl}]: cols={tc['table_cols']} fields={[f['label'] for f in tc['fields']]}")
                print(f"    Tab '{tlbl}'")
            except: pass

        # buttons that open modals
        seen=set()
        for btn in await PG[0].locator("button:visible,[role='button']:visible").all():
            blbl=(await gtxt(btn) or await gattr(btn,"title") or await gattr(btn,"aria-label") or "").strip()
            if not blbl or blbl in seen: continue
            if any(w in blbl.lower() for w in ["delete","trash","remove","logout","sign out","cancel"]): continue
            seen.add(blbl)
            cur = PG[0].url
            try:
                for fb in await PG[0].locator("button:visible,[role='button']:visible").all():
                    if (await gtxt(fb) or await gattr(fb,"title") or "").strip()==blbl:
                        await fb.scroll_into_view_if_needed(); await fb.click(timeout=3000)
                        await PG[0].wait_for_timeout(1500); break
                if await has_modal():
                    await ss(f"page_{slug(pname)}_modal_{slug(blbl)}")
                    mf=await get_fields(); md=await snapshot_dds(); mc=await map_cascades(f"{pname}|{blbl}")
                    pd["modals"][blbl]={"fields":mf,"dropdowns":md,"cascades":mc}
                    nav_lines.append(f"  BTN[{blbl}] → MODAL: fields={[f['label'] for f in mf]} dds={list(md.keys())}")
                    print(f"    Modal '{blbl}': {len(mf)} fields")
                    await close_modal()
                elif PG[0].url != cur:
                    nav_lines.append(f"  BTN[{blbl}] → NAV: {PG[0].url}")
                    print(f"    '{blbl}' → nav {PG[0].url}")
                    await go(url)
            except:
                try: await close_modal()
                except: pass
                if PG[0].url != url and "login" not in PG[0].url:
                    await go(url)

        pd["page_dds"] = await snapshot_dds()
        result["top_pages"][pname] = pd
        print(f"    Done: {pname}")

# ── Assessment forms — direct URL, no Sites page ───────────────────────────────
async def scrape_assessment(site_id, site_name, scope_code, scope_name):
    url = f"{BASE_URL}/sites/{site_id}/assessment/{scope_code}/2026/5"
    key = f"{site_name}_{scope_code}"
    print(f"    [{site_name}] {scope_name} ({scope_code})")
    nav_lines.append(f"\n### {site_name} | {scope_name} ({scope_code})  →  {url}")

    fd = {"site_id":site_id,"site_name":site_name,"scope_code":scope_code,"scope_name":scope_name,
          "url":url,"landing":{},"add_form":{},"sub_categories":{}}

    if not await go(url):
        fd["error"]="nav failed"; result["assessment_forms"][key]=fd; return

    await ss(f"assess_{slug(site_name)}_{scope_code}_land")
    land = await page_struct(f"ASSESS:{site_name}:{scope_code}")
    land["dropdowns"] = await snapshot_dds()
    fd["landing"] = land
    nav_lines.append(f"  landing cols: {land['table_cols']}")
    nav_lines.append(f"  landing btns: {land['buttons']}")

    # existing data rows
    rows=await PG[0].locator("tbody tr:visible").all()
    existing=[]
    for row in rows[:5]:
        cells=await row.locator("td").all()
        existing.append([(await gtxt(c))[:80] for c in cells])
    fd["existing_rows"]=existing
    if existing: nav_lines.append(f"  existing rows: {existing}")

    # sub-nav links (Scope 3 has sidebar categories)
    sub_links = await PG[0].evaluate("""()=>{
        const s=new Set();
        return Array.from(document.querySelectorAll('a[href*="assessment"]'))
            .map(a=>({text:a.innerText.trim(),href:a.getAttribute('href')}))
            .filter(x=>x.text&&x.href&&!s.has(x.href)&&s.add(x.href));
    }""")
    fd["sub_navigation"]=sub_links
    if sub_links: nav_lines.append(f"  sub-nav: {[x['text'] for x in sub_links]}")

    # find Add button
    add_btn=None
    for sel in ["button:has-text('Add'):visible","button:has-text('+ Add'):visible",
                "button:has-text('Add Entry'):visible","button:has-text('New Entry'):visible","button:has-text('Create'):visible"]:
        loc=PG[0].locator(sel).first
        if await loc.count():
            blbl=(await gtxt(loc)).strip()
            if not any(w in blbl.lower() for w in ["site","org","user","organization"]):
                add_btn=loc; print(f"      Add: '{blbl}'"); break

    if add_btn:
        try:
            await add_btn.scroll_into_view_if_needed(); await add_btn.click(timeout=5000)
            await PG[0].wait_for_timeout(3000)
            await ss(f"assess_{slug(site_name)}_{scope_code}_form")
            fields=await get_fields(); dds=await snapshot_dds(); cascades=await map_cascades(f"{site_name}_{scope_name}")
            fd["add_form"]={"fields":fields,"dropdowns":dds,"cascading_dropdowns":cascades}
            nav_lines.append(f"  ADD FORM fields: {[f['label'] for f in fields]}")
            nav_lines.append(f"  ADD FORM dds:    {list(dds.keys())}")
            for dd_lbl,dd_d in cascades.items():
                if dd_lbl=="_initial" or not isinstance(dd_d,dict): continue
                for opt,chg in dd_d.get("cascades",{}).items():
                    nav_lines.append(f"  CASCADE: {dd_lbl}['{opt[:20]}'] → {list(chg.keys())}")
            print(f"      fields:{len(fields)}  dds:{len(dds)}")
            await close_modal(); await PG[0].wait_for_timeout(800)
        except Exception as e:
            print(f"      form err: {e}"); fd["add_form"]["error"]=str(e)
            try: await close_modal()
            except: pass
    else:
        print(f"      no Add btn — inline form")
        fields=await get_fields(); dds=await snapshot_dds(); cascades=await map_cascades(f"{site_name}_{scope_name}_inline")
        fd["add_form"]={"fields":fields,"dropdowns":dds,"cascading_dropdowns":cascades}

    # Scope 3 sub-categories
    if scope_code=="Q16" and sub_links:
        print(f"      Scope 3: {len(sub_links)} sub-cats")
        visited=set()
        for lk in sub_links[:30]:
            href=lk["href"]
            if href in visited: continue
            visited.add(href)
            full_url=BASE_URL+href if href.startswith("/") else href
            if not await go(full_url): continue
            await ss(f"S3_{slug(lk['text'])}")
            sub=await page_struct(f"S3|{lk['text']}")
            nav_lines.append(f"\n  S3: {lk['text']}  cols:{sub['table_cols']} btns:{sub['buttons']}")
            for sel in ["button:has-text('Add'):visible","button:has-text('New'):visible","button:has-text('Create'):visible"]:
                if await PG[0].locator(sel).count():
                    try:
                        await PG[0].locator(sel).first.click(); await PG[0].wait_for_timeout(2000)
                        await ss(f"S3_{slug(lk['text'])}_form")
                        sf=await get_fields(); sd=await snapshot_dds(); sc=await map_cascades(f"S3|{lk['text']}")
                        sub["fields"]=sf; sub["dropdowns"]=sd; sub["cascading_dropdowns"]=sc
                        nav_lines.append(f"    S3 fields: {[f['label'] for f in sf]}")
                        nav_lines.append(f"    S3 dds:    {list(sd.keys())}")
                        await close_modal()
                    except Exception as e:
                        sub["form_error"]=str(e)
                        try: await close_modal()
                        except: pass
                    break
            fd["sub_categories"][lk["text"]]=sub

    result["assessment_forms"][key]=fd

# ── Main ───────────────────────────────────────────────────────────────────────
async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False, slow_mo=60)
        ctx  = await browser.new_context(viewport={"width":1440,"height":900})
        page = await ctx.new_page()
        PG[0] = page
        attach_net()   # single listener

        await login()
        await scrape_top_pages()

        print("\n=== ASSESSMENT FORMS (direct URL navigation) ===")
        nav_lines.append("\n\n=== ASSESSMENT FORMS ===")

        # Surat first — most complete data
        print("\n  [Surat — primary site]")
        for code, name in SCOPES:
            await scrape_assessment(193, "Surat", code, name)

        # Other sites
        for site_id, site_name in SITES:
            if site_id == 193: continue
            print(f"\n  [{site_name}]")
            for code, name in SCOPES:
                await scrape_assessment(site_id, site_name, code, name)

        # Save
        map_f = OUT / "full_map.json"
        api_f = OUT / "api_calls.json"
        nav_f = OUT / "nav_tree.txt"

        with open(map_f,"w",encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        with open(api_f,"w",encoding="utf-8") as f:
            json.dump(sorted(api_log.values(), key=lambda x:x["path"]), f, indent=2, ensure_ascii=False)
        with open(nav_f,"w",encoding="utf-8") as f:
            f.write("ESGTech Portal — Navigation Flowchart & Field Map\n"+"="*70+"\n\n")
            for l in nav_lines: f.write(str(l)+"\n")

        # summary
        print(f"\n{'='*55}\nCASCADES\n{'='*55}")
        for fkey,fdata in result["assessment_forms"].items():
            cas=fdata.get("add_form",{}).get("cascading_dropdowns",{})
            for lbl,dd in cas.items():
                if lbl=="_initial" or not isinstance(dd,dict): continue
                for opt,chg in dd.get("cascades",{}).items():
                    print(f"  [{fkey}] {lbl}: '{opt[:20]}' → {list(chg.keys())}")

        print(f"\n{'='*55}\nAPI ({len(api_log)} endpoints)\n{'='*55}")
        for ep in sorted(api_log.keys()): print(f"  {ep}")

        print(f"\nFiles: {map_f}  |  {api_f}  |  {nav_f}")
        print(f"Screenshots: {N[0]} in {SHOT}/")

        await browser.close()

        # tell Codex
        chat = Path(__file__).parent.parent / "COORDINATION_CHAT.md"
        if chat.exists():
            with open(chat,"a",encoding="utf-8") as f:
                f.write(f"\n2026-05-24 - Claude: SCRAPE COMPLETE. {N[0]} screenshots, "
                        f"{len(api_log)} API endpoints. Codex: read scraper/output/nav_tree.txt "
                        f"for full flowchart + field map, full_map.json for React component spec, "
                        f"api_calls.json for backend. Ready to handoff AssessmentForm.jsx + SiteLayout.jsx.\n")

if __name__ == "__main__":
    asyncio.run(main())

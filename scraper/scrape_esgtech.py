"""
ESGTech Portal – Targeted Read-Only Scraper
Approach:
  1. Inspect DOM to find the actual href/click target on each site row action icon
  2. Navigate into each site's ESG data entry URL directly
  3. Probe every scope section, category row, and modal — depth-limited
  4. Never submit forms, never create/modify data
"""

import asyncio
import json
import re
import sys
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LOGIN_URL = "https://app.esgtech.ai/login"
EMAIL     = "compliance.mfg@kgirdharlal.com"
PASSWORD  = "PXJNAEBasj"
BASE_URL  = "https://app.esgtech.ai"

BASE_OUT = Path(__file__).parent / "output"
SHOT_DIR = BASE_OUT / "screenshots"
BASE_OUT.mkdir(parents=True, exist_ok=True)
SHOT_DIR.mkdir(parents=True, exist_ok=True)
SCHEMA_FILE = BASE_OUT / "schema_map.json"
NAV_FILE    = BASE_OUT / "nav_tree.txt"

all_schemas  = []
nav_lines    = []
N = [0]   # screenshot counter


def slug(t):
    return re.sub(r"[^a-z0-9]+", "_", (t or "").lower()).strip("_")[:50]

async def ss(page, label):
    N[0] += 1
    path = SHOT_DIR / f"{N[0]:04d}_{slug(label)}.png"
    try: await page.screenshot(path=str(path), full_page=True)
    except Exception: pass

async def gtxt(el):
    try:    return (await el.inner_text()).strip()
    except: return ""

async def gattr(el, a):
    try:    return (await el.get_attribute(a) or "").strip()
    except: return ""

async def idle(page, ms=1000):
    await page.wait_for_timeout(ms)
    try: await page.wait_for_load_state("networkidle", timeout=5000)
    except: pass

async def has_overlay(page):
    for s in ["[role='dialog']:visible","[class*='Modal']:visible",
              "[class*='modal']:visible","[class*='Drawer']:visible",
              "#headlessui-portal-root [class]:visible"]:
        if await page.locator(s).count(): return True
    return False

async def close_overlay(page):
    for s in ["button:has-text('Close')","button:has-text('Cancel')",
              "[aria-label='Close']","button[class*='close']",
              "[class*='closeBtn']","[class*='CloseIcon']"]:
        try:
            b = page.locator(s).first
            if await b.is_visible(timeout=300):
                await b.click()
                await page.wait_for_timeout(500)
                return
        except: pass
    await page.keyboard.press("Escape")
    await page.wait_for_timeout(400)


# ── field extractor scoped to a container (modal or full page) ─────────────────

async def extract(page, ctx, scope_sel="body"):
    """Extract form fields, table headers, and buttons from scope_sel container."""
    rec = {
        "context": ctx, "url": page.url,
        "fields": [], "table_columns": [],
        "select_options": {}, "buttons": [], "headings": [],
    }
    scope = page.locator(scope_sel)
    if not await scope.count():
        scope = page.locator("body")

    for inp in await scope.locator("input:visible,textarea:visible,select:visible").all():
        try:
            tag   = (await inp.evaluate("el=>el.tagName")).lower()
            itype = await gattr(inp,"type") or "text"
            if itype in ("hidden","submit","button","image","reset","file"): continue
            name  = await gattr(inp,"name")
            iid   = await gattr(inp,"id")
            ph    = await gattr(inp,"placeholder")
            req   = await inp.evaluate("el=>el.required")
            lbl   = ""
            if iid:
                l = scope.locator(f"label[for='{iid}']")
                if await l.count(): lbl = await gtxt(l.first)
            if not lbl:
                try:
                    lbl = (await inp.evaluate("""el=>{
                        const c=el.closest('label'); if(c) return c.innerText;
                        const g=el.closest('.form-group,.form-field,.input-wrapper,.field-wrap,[class*=Field],[class*=formGroup],[class*=FormGroup],[class*=inputGroup],[class*=InputGroup]');
                        if(g){const l=g.querySelector('label,.label,[class*=label],[class*=Label]');return l?l.innerText:'';}
                        return '';
                    }""") or "").strip()
                except: pass
            unit = ""
            try:
                unit = (await inp.evaluate("""el=>{
                    const p=el.parentElement;
                    const u=p&&p.querySelector('.unit,.suffix,[class*=unit],[class*=Unit],[class*=suffix]');
                    return u?u.innerText.trim():'';
                }""") or "").strip()
            except: pass
            opts = []
            if tag=="select":
                try:
                    opts = await inp.evaluate("el=>Array.from(el.options).map(o=>({value:o.value,text:o.text.trim()}))")
                    if lbl and opts: rec["select_options"][lbl]=opts
                except: pass
            key = lbl or name or iid or ph or f"field_{itype}"
            rec["fields"].append({"label":key,"type":itype if tag!="select" else "select",
                "tag":tag,"name":name,"id":iid,"placeholder":ph,"required":req,"unit":unit,"options":opts})
        except: pass

    for h in await scope.locator("th:visible,[role='columnheader']:visible").all():
        t = await gtxt(h)
        if t and t not in rec["table_columns"]: rec["table_columns"].append(t)

    for b in await scope.locator("button:visible,[role='button']:visible").all():
        t = await gtxt(b)
        if t and 0<len(t)<80 and t not in rec["buttons"]: rec["buttons"].append(t)

    for h in await scope.locator("h1:visible,h2:visible,h3:visible,h4:visible").all():
        t = await gtxt(h)
        if t and len(t)<120 and t not in rec["headings"]: rec["headings"].append(t)

    return rec


# ── login ──────────────────────────────────────────────────────────────────────

async def login(page):
    print("Logging in...")
    await page.goto(LOGIN_URL, wait_until="domcontentloaded", timeout=30000)
    await idle(page, 1500)
    await ss(page,"login")
    for s in ["input[placeholder*='Email' i]","input[type='email']","input[name='email']"]:
        if await page.locator(s).count(): await page.locator(s).first.fill(EMAIL); break
    await page.wait_for_timeout(300)
    for s in ["input[placeholder*='password' i]","input[type='password']","input[name='password']"]:
        if await page.locator(s).count(): await page.locator(s).first.fill(PASSWORD); break
    await page.wait_for_timeout(300)
    for s in ["button[type='submit']","button:has-text('Submit')","button:has-text('Sign In')"]:
        if await page.locator(s).count(): await page.locator(s).first.click(); break
    try: await page.wait_for_url(lambda u:"login" not in u, timeout=15000)
    except PWTimeout: print("  WARNING: URL did not change")
    await idle(page,2000)
    await ss(page,"after_login")
    print(f"  URL: {page.url}")


# ── inspect what action buttons actually link to ───────────────────────────────

async def inspect_action_buttons(page):
    """Read the DOM to find hrefs/data attributes on action icons before clicking."""
    await page.goto(f"{BASE_URL}/sites", wait_until="domcontentloaded", timeout=15000)
    await idle(page, 2000)

    info = await page.evaluate("""() => {
        const rows = Array.from(document.querySelectorAll('tbody tr'));
        return rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const lastCell = cells[cells.length-1] || row;
            const btns = Array.from(lastCell.querySelectorAll('button,a,[role=button]'));
            return {
                rowText: row.innerText.substring(0,80).replace(/\\n/g,' '),
                actions: btns.map((b,i) => ({
                    idx: i,
                    tag: b.tagName,
                    text: b.innerText.trim().substring(0,30),
                    href: b.getAttribute('href') || '',
                    title: b.getAttribute('title') || '',
                    ariaLabel: b.getAttribute('aria-label') || '',
                    dataAttrs: Object.fromEntries(
                        Array.from(b.attributes)
                             .filter(a=>a.name.startsWith('data-'))
                             .map(a=>[a.name,a.value])
                    ),
                    classes: b.className.substring(0,80),
                    onClick: b.onclick ? b.onclick.toString().substring(0,100) : '',
                }))
            };
        });
    }""")

    print("\nAction button inspection:")
    for row_info in info:
        print(f"  Row: {row_info['rowText'][:60]}")
        for act in row_info['actions']:
            print(f"    [{act['idx']}] tag:{act['tag']} text:'{act['text']}' href:'{act['href']}' title:'{act['title']}' aria:'{act['ariaLabel']}'")

    return info


# ── probe modal content only (depth limited) ───────────────────────────────────

async def probe_modal(page, ctx, depth=0):
    """Probe the currently open modal. depth prevents infinite recursion."""
    if depth > 2: return

    # find the overlay element to scope to
    overlay_sel = "#headlessui-portal-root,[role='dialog'],.modal-content,[class*='Modal']"
    overlay = page.locator(overlay_sel).first
    scope   = overlay_sel if await overlay.count() else "body"

    rec = await extract(page, ctx, scope)
    if rec["fields"] or rec["table_columns"] or rec["headings"]:
        all_schemas.append(rec)
        nav_lines.append(f"  {'  '*depth}[MODAL] {ctx}: {len(rec['fields'])} fields | cols:{rec['table_columns'][:3]}")
        print(f"{'  '*depth}    [modal:{depth}] {ctx[:60]}: {len(rec['fields'])} fields, {len(rec['table_columns'])} cols")

    # probe tabs INSIDE the modal only
    tabs = await page.locator(f"{overlay_sel} [role='tab']:visible").all() if await overlay.count() else []
    for tab in tabs[:8]:
        tlbl = await gtxt(tab)
        if not tlbl: continue
        try:
            await tab.click()
            await page.wait_for_timeout(600)
            await ss(page, f"{ctx}_tab_{slug(tlbl)}")
            trec = await extract(page, f"{ctx} > {tlbl}", scope)
            if trec["fields"] or trec["table_columns"]:
                all_schemas.append(trec)
                print(f"{'  '*depth}      [tab] {tlbl}: {len(trec['fields'])} fields")

            # look for add buttons inside this tab's content
            if depth < 1:
                for btn in await page.locator(f"{overlay_sel} button:visible").all():
                    blbl = await gtxt(btn)
                    if any(w in blbl.lower() for w in ["add","new","enter","create","+"]):
                        try:
                            await btn.click()
                            await idle(page, 800)
                            if await has_overlay(page):
                                await ss(page, f"{ctx}_{slug(tlbl)}_{slug(blbl)}")
                                await probe_modal(page, f"{ctx}>{tlbl}>{blbl}", depth+1)
                                await close_overlay(page)
                                await page.wait_for_timeout(400)
                        except: pass
        except: pass

    # probe rows INSIDE the modal only (not background)
    modal_rows = await page.locator(f"{overlay_sel} tbody tr:visible").all() if await overlay.count() else []
    seen = set()
    for row in modal_rows[:15]:
        rlbl = (await gtxt(row)).replace("\n"," ")[:60]
        if rlbl in seen or not rlbl: continue
        seen.add(rlbl)
        row_btns = await row.locator("button:visible,a:visible").all()
        for rb in row_btns[:3]:
            rblbl = await gtxt(rb) or await gattr(rb,"title") or "icon"
            if any(w in rblbl.lower() for w in ["delete","trash","remove"]): continue
            try:
                await rb.click()
                await idle(page, 800)
                if await has_overlay(page):
                    await ss(page, f"{ctx}_row_{slug(rlbl)}_{slug(rblbl)}")
                    await probe_modal(page, f"{ctx}>{rlbl}>{rblbl}", depth+1)
                    await close_overlay(page)
                    await page.wait_for_timeout(400)
            except: pass


# ── navigate into ESG data for one site ───────────────────────────────────────

async def explore_site_data(page, site_name, site_idx):
    """
    Try every approach to get into the actual ESG data entry for a site.
    The portal likely has a URL like /sites/{id} or opens a data drawer.
    """
    prefix = f"site{site_idx:02d}"
    print(f"\n=== Site {site_idx}: {site_name[:50]} ===")
    nav_lines.append(f"\nSITE {site_idx}: {site_name}")

    await page.goto(f"{BASE_URL}/sites", wait_until="domcontentloaded", timeout=15000)
    await idle(page, 1500)

    rows = await page.locator("tbody tr:visible").all()
    if site_idx - 1 >= len(rows):
        print("  Row not found")
        return

    row = rows[site_idx - 1]
    cells = await row.locator("td").all()
    action_cell = cells[-1] if cells else row

    # get all buttons in the action cell
    btns = await action_cell.locator("button:visible, a:visible").all()
    print(f"  Action buttons: {len(btns)}")

    for bi, btn in enumerate(btns):
        btn_lbl = (
            await gattr(btn,"title") or
            await gattr(btn,"aria-label") or
            await gtxt(btn) or
            f"btn_{bi}"
        )
        # skip delete/trash
        if any(w in btn_lbl.lower() for w in ["delete","trash","delet"]): continue

        try:
            # re-locate the button fresh (DOM may change)
            await page.goto(f"{BASE_URL}/sites", wait_until="domcontentloaded", timeout=12000)
            await idle(page, 1200)
            rows2  = await page.locator("tbody tr:visible").all()
            row2   = rows2[site_idx - 1]
            cells2 = await row2.locator("td").all()
            ac2    = cells2[-1] if cells2 else row2
            btns2  = await ac2.locator("button:visible,a:visible").all()
            if bi >= len(btns2): continue

            await btns2[bi].click()
            await idle(page, 2000)
            new_url = page.url

            await ss(page, f"{prefix}_action{bi}_{slug(btn_lbl)}")
            print(f"  [btn-{bi}] '{btn_lbl}' -> {new_url}")
            nav_lines.append(f"  [action-{bi}:{btn_lbl}] -> {new_url}")

            if await has_overlay(page):
                # a modal/drawer opened
                modal_title = ""
                for ts in ["[role='dialog'] h2","[role='dialog'] h3",
                           "[class*='Modal'] h2","[class*='Drawer'] h2"]:
                    t = page.locator(ts).first
                    if await t.count(): modal_title = await gtxt(t); break

                print(f"    Modal: '{modal_title}'")
                await probe_modal(page, f"{site_name}|{btn_lbl}|{modal_title}", depth=0)
                await close_overlay(page)
                await idle(page, 600)

            elif new_url != f"{BASE_URL}/sites" and BASE_URL in new_url:
                # navigated to a real page — this is the data entry page!
                print(f"    -> Navigated! Scraping {new_url}")
                nav_lines.append(f"    NAVIGATED TO: {new_url}")
                await explore_site_page(page, f"{site_name}", prefix)

        except Exception as e:
            print(f"  [btn-{bi} error] {e}")
            try: await close_overlay(page)
            except: pass


async def explore_site_page(page, ctx, prefix):
    """Scrape a dedicated site data page (if one exists)."""
    rec = await extract(page, f"{ctx} | DataPage")
    all_schemas.append(rec)
    nav_lines.append(f"  [datapage] {len(rec['fields'])} fields | {len(rec['table_columns'])} cols | {rec['headings']}")
    print(f"  DataPage: {len(rec['fields'])} fields, {len(rec['table_columns'])} cols")
    await ss(page, f"{prefix}_datapage")

    # probe scope tabs
    for tab in await page.locator("[role='tab']:visible,[class*='Tab']:visible").all():
        tlbl = await gtxt(tab)
        if not tlbl: continue
        try:
            await tab.click()
            await idle(page, 800)
            await ss(page, f"{prefix}_{slug(ctx)}_{slug(tlbl)}")
            trec = await extract(page, f"{ctx} | Tab:{tlbl}")
            if trec["fields"] or trec["table_columns"]:
                all_schemas.append(trec)
                nav_lines.append(f"    [TAB:{tlbl}] {len(trec['fields'])} fields")
                print(f"    [tab] {tlbl}: {len(trec['fields'])} fields")
        except: pass

    # probe add/enter buttons
    seen = set()
    for sel in ["button:has-text('Add'):visible","button:has-text('Enter Data'):visible",
                "button:has-text('New Entry'):visible","button:has-text('+'):visible"]:
        for btn in await page.locator(sel).all():
            blbl = await gtxt(btn)
            if blbl in seen: continue
            seen.add(blbl)
            try:
                await btn.click()
                await idle(page, 800)
                if await has_overlay(page):
                    await ss(page, f"{prefix}_{slug(blbl)}_modal")
                    await probe_modal(page, f"{ctx}|AddBtn:{blbl}", depth=0)
                    await close_overlay(page)
                    await idle(page, 500)
            except: pass

    # probe category rows (emission categories)
    seen_rows = set()
    for row in await page.locator("tbody tr:visible,[class*='category-row']:visible").all():
        rlbl = (await gtxt(row)).replace("\n"," ")[:60]
        if rlbl in seen_rows or not rlbl: continue
        seen_rows.add(rlbl)
        row_btns = await row.locator("button:visible,a:visible,[role='button']:visible").all()
        for rb in row_btns[:3]:
            rblbl = await gtxt(rb) or await gattr(rb,"title") or "icon"
            if any(w in rblbl.lower() for w in ["delete","trash"]): continue
            try:
                await rb.click()
                await idle(page, 900)
                if await has_overlay(page):
                    await ss(page, f"{prefix}_row_{slug(rlbl)}_{slug(rblbl)}")
                    await probe_modal(page, f"{ctx}|Row:{rlbl}|{rblbl}", depth=0)
                    await close_overlay(page)
                    await idle(page, 400)
            except: pass


# ── top-level pages ────────────────────────────────────────────────────────────

async def scrape_top_pages(page):
    print("\n=== Top-Level Pages ===")
    nav_lines.append("\n--- TOP-LEVEL PAGES ---")
    pages = [
        ("Dashboard",    f"{BASE_URL}/dashboard"),
        ("GHG Reports",  f"{BASE_URL}/report"),
        ("Organization", f"{BASE_URL}/organization"),
        ("Help",         f"{BASE_URL}/help"),
        ("Settings",     f"{BASE_URL}/settings"),
    ]
    for pname, url in pages:
        print(f"  {pname}")
        nav_lines.append(f"\n{pname}: {url}")
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=15000)
            await idle(page, 1500)
            await ss(page, f"top_{slug(pname)}")
            rec = await extract(page, f"TOP:{pname}")
            all_schemas.append(rec)
            nav_lines.append(f"  [page] fields:{len(rec['fields'])} cols:{rec['table_columns'][:5]} btns:{rec['buttons'][:5]} headings:{rec['headings'][:3]}")
            print(f"    fields:{len(rec['fields'])} cols:{len(rec['table_columns'])} btns:{len(rec['buttons'])}")

            # probe tabs
            for tab in await page.locator("[role='tab']:visible").all():
                tlbl = await gtxt(tab)
                if not tlbl: continue
                try:
                    await tab.click(); await idle(page,700)
                    await ss(page, f"top_{slug(pname)}_tab_{slug(tlbl)}")
                    trec = await extract(page, f"TOP:{pname}>{tlbl}")
                    if trec["fields"] or trec["table_columns"]:
                        all_schemas.append(trec)
                        nav_lines.append(f"    [TAB:{tlbl}] fields:{len(trec['fields'])} cols:{trec['table_columns'][:5]}")
                        print(f"    [tab] {tlbl}: {len(trec['fields'])} fields, {len(trec['table_columns'])} cols")
                except: pass

            # probe modals from add buttons (read-only — just open to see form)
            seen = set()
            for sel in ["button:has-text('Add')","button:has-text('Create')","button:has-text('New')"]:
                for btn in await page.locator(f"{sel}:visible").all():
                    blbl = await gtxt(btn)
                    if blbl in seen or not blbl: continue
                    seen.add(blbl)
                    try:
                        await btn.click(); await idle(page,800)
                        if await has_overlay(page):
                            await ss(page, f"top_{slug(pname)}_modal_{slug(blbl)}")
                            await probe_modal(page, f"TOP:{pname}|Modal:{blbl}", depth=0)
                            await close_overlay(page); await idle(page,500)
                    except:
                        try: await close_overlay(page)
                        except: pass
        except Exception as e:
            print(f"  Error: {e}")


# ── main ───────────────────────────────────────────────────────────────────────

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False, slow_mo=80)
        ctx  = await browser.new_context(viewport={"width":1440,"height":900})
        page = await ctx.new_page()

        await login(page)
        await scrape_top_pages(page)

        # inspect action buttons to understand navigation
        print("\n=== Inspecting Action Buttons ===")
        btn_info = await inspect_action_buttons(page)

        # scrape each site
        print("\n=== Scraping Sites ===")
        nav_lines.append("\n--- SITES ---")
        await page.goto(f"{BASE_URL}/sites", wait_until="domcontentloaded", timeout=15000)
        await idle(page, 2000)
        rows = await page.locator("tbody tr:visible").all()
        print(f"Found {len(rows)} sites")

        site_names = []
        for row in rows:
            cells = await row.locator("td").all()
            name = ""
            for c in cells[:2]:
                t = await gtxt(c)
                if t: name = t.replace("\n"," ").strip()[:80]; break
            site_names.append(name)

        for si, sname in enumerate(site_names):
            await explore_site_data(page, sname, si + 1)

        # save
        print(f"\nSaving {len(all_schemas)} sections...")
        with open(SCHEMA_FILE,"w",encoding="utf-8") as f:
            json.dump(all_schemas, f, indent=2, ensure_ascii=False)
        with open(NAV_FILE,"w",encoding="utf-8") as f:
            f.write("ESGTech Portal – Full Navigation & Field Map\n")
            f.write("="*70+"\n")
            for l in nav_lines: f.write(str(l)+"\n")

        print(f"\nDone! {N[0]} screenshots, {len(all_schemas)} sections")
        print(f"  -> {SCHEMA_FILE}")
        print(f"  -> {NAV_FILE}")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())

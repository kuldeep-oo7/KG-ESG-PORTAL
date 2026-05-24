"""
ESGTech Assessment Page Scraper - v3
Strategy:
1. Navigate to /sites/{id}/assessment/Q1/2026/5
2. Dump ALL links/clickable items via evaluate() to understand sidebar structure
3. Click through each unique nav item, extract form fields + dropdown options
4. Read-only: never submit, never modify data.
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

SITES = {
    192: "KGIPL-01_Mumbai",
    193: "KGIPL-02_Surat_Branch",
    194: "KGIPL-03_Facets_Surat",
    195: "KGIPL-04_Dubai",
    196: "KGIPL-05_Botswana",
}

BASE_OUT = Path(__file__).parent / "output"
SHOT_DIR = BASE_OUT / "screenshots_assessment"
BASE_OUT.mkdir(parents=True, exist_ok=True)
SHOT_DIR.mkdir(parents=True, exist_ok=True)

OUT_FILE = BASE_OUT / "assessment_schema.json"
NAV_FILE = BASE_OUT / "assessment_nav.txt"

results = []
nav_log = []
N = [0]


def slug(t):
    return re.sub(r"[^a-z0-9]+", "_", (t or "").lower()).strip("_")[:50]

async def ss(page, label):
    N[0] += 1
    p = SHOT_DIR / f"{N[0]:04d}_{slug(label)}.png"
    try: await page.screenshot(path=str(p), full_page=True)
    except: pass
    return p.name

async def gtxt(el):
    try: return (await el.inner_text()).strip()
    except: return ""

async def gattr(el, a):
    try: return (await el.get_attribute(a) or "").strip()
    except: return ""

async def idle(page, ms=1500):
    await page.wait_for_timeout(ms)
    try: await page.wait_for_load_state("networkidle", timeout=6000)
    except: pass

async def safe_click(el):
    try:
        await el.scroll_into_view_if_needed()
        await el.click(timeout=5000)
        return True
    except: return False


# ── login ──────────────────────────────────────────────────────────────────────

async def login(page):
    print("Logging in...")
    await page.goto(LOGIN_URL, wait_until="domcontentloaded", timeout=30000)
    await idle(page, 1200)
    for s in ["input[type='email']", "input[placeholder*='Email' i]", "input[name='email']"]:
        if await page.locator(s).count():
            await page.locator(s).first.fill(EMAIL); break
    await page.wait_for_timeout(300)
    for s in ["input[type='password']", "input[placeholder*='password' i]"]:
        if await page.locator(s).count():
            await page.locator(s).first.fill(PASSWORD); break
    await page.wait_for_timeout(300)
    for s in ["button[type='submit']", "button:has-text('Submit')", "button:has-text('Sign In')"]:
        if await page.locator(s).count():
            await page.locator(s).first.click(); break
    try:
        await page.wait_for_url(lambda u: "login" not in u, timeout=15000)
    except PWTimeout:
        print("  WARNING: still on login page")
    await idle(page, 2000)
    print(f"  URL: {page.url}")


# ── dump all nav links from current page ───────────────────────────────────────

async def dump_nav_links(page):
    """Use JS to collect all links and buttons from sidebar/nav areas."""
    return await page.evaluate("""() => {
        const results = [];
        const seen = new Set();

        // Collect from sidebar / aside / nav areas first, then all
        const containers = [
            document.querySelector('aside'),
            document.querySelector('nav'),
            document.querySelector('[class*="sidebar"]'),
            document.querySelector('[class*="Sidebar"]'),
            document.querySelector('[class*="side-nav"]'),
            document.body,
        ].filter(Boolean);

        for (const container of containers) {
            const els = container.querySelectorAll('a, button, [role="button"], [role="tab"], li[class*="item"], li[class*="nav"]');
            for (const el of els) {
                const text = el.innerText.trim();
                const href = el.getAttribute('href') || '';
                const key = text + '|' + href;
                if (!text || text.length > 100 || seen.has(key)) continue;
                seen.add(key);
                const rect = el.getBoundingClientRect();
                if (rect.width === 0 && rect.height === 0) continue;
                results.push({
                    text,
                    href,
                    tag: el.tagName,
                    role: el.getAttribute('role') || '',
                    classes: el.className.toString().slice(0, 100),
                    x: Math.round(rect.x),
                    y: Math.round(rect.y),
                    w: Math.round(rect.width),
                    h: Math.round(rect.height),
                });
            }
        }
        return results;
    }""")


# ── open a custom dropdown and read all options ────────────────────────────────

async def read_dropdown_options(page, el):
    """Click a dropdown element, read all options, close it."""
    options = []
    try:
        await el.scroll_into_view_if_needed()
        await el.click(timeout=4000)
        await page.wait_for_timeout(600)

        for sel in [
            "[role='option']:visible",
            "[class*='option']:visible:not([class*='control']):not([class*='indicator'])",
            "[class*='Option']:visible",
            "ul[role='listbox'] li:visible",
            "[class*='menu'] [class*='item']:visible",
            "[class*='dropdown-item']:visible",
        ]:
            opt_els = await page.locator(sel).all()
            for o in opt_els:
                t = await gtxt(o)
                if t and 0 < len(t) < 120 and t not in options:
                    options.append(t)
            if options: break

        await page.keyboard.press("Escape")
        await page.wait_for_timeout(400)
    except:
        try: await page.keyboard.press("Escape")
        except: pass
    return options


# ── extract the full form on the current view ──────────────────────────────────

async def extract_form(page, ctx):
    await page.wait_for_timeout(400)
    rec = {
        "context": ctx,
        "url": page.url,
        "fields": [],
        "dropdowns": {},
        "table_columns": [],
        "existing_data_rows": [],
        "buttons": [],
        "emission_shown": "",
    }

    # emission value displayed
    for sel in ["[class*='emission']:visible", "[class*='Emission']:visible",
                "text=TCO2Eq", "text=tCO2", "[class*='total']:visible"]:
        el = page.locator(sel).first
        if await el.count():
            t = await gtxt(el)
            if t and "co2" in t.lower() or "tco" in t.lower() or "emission" in t.lower():
                rec["emission_shown"] = t; break

    # ── standard HTML inputs ─────────────────────────────────────────────────
    for inp in await page.locator("input:visible, textarea:visible, select:visible").all():
        try:
            tag   = (await inp.evaluate("el=>el.tagName")).lower()
            itype = await gattr(inp, "type") or "text"
            if itype in ("hidden","submit","button","image","reset","file","checkbox","radio"):
                # still capture checkboxes / radios for completeness
                if itype not in ("checkbox","radio"): continue
            name  = await gattr(inp, "name")
            iid   = await gattr(inp, "id")
            ph    = await gattr(inp, "placeholder")
            val   = await inp.evaluate("el=>el.value") if itype not in ("checkbox","radio") else ""
            checked = await inp.evaluate("el=>el.checked") if itype in ("checkbox","radio") else None
            req   = await inp.evaluate("el=>el.required")

            # find label
            lbl = ""
            if iid:
                l = page.locator(f"label[for='{iid}']")
                if await l.count(): lbl = await gtxt(l.first)
            if not lbl:
                lbl = (await inp.evaluate("""el=>{
                    const c = el.closest('label');
                    if (c) return c.innerText.trim();
                    const g = el.closest(
                        '.form-group,.form-field,.input-wrapper,.field-wrap,' +
                        '[class*=Field],[class*=formGroup],[class*=FormGroup],' +
                        '[class*=inputGroup],[class*=InputGroup],[class*=form_item],' +
                        '[class*=form-item]'
                    );
                    if (g) {
                        const l = g.querySelector('label,.label,[class*=label],[class*=Label]');
                        return l ? l.innerText.trim() : '';
                    }
                    const p = el.previousElementSibling;
                    return p ? p.innerText.trim() : '';
                }""") or "").strip()

            opts = []
            if tag == "select":
                opts = await inp.evaluate(
                    "el=>Array.from(el.options).map(o=>({value:o.value,text:o.text.trim()}))"
                )

            key = lbl or ph or name or iid or f"input_{itype}"
            rec["fields"].append({
                "label": key, "tag": tag, "type": itype,
                "name": name, "id": iid, "placeholder": ph,
                "value": str(val)[:200], "checked": checked,
                "required": req, "options": opts,
            })
        except: pass

    # ── custom (React/Headless-UI) dropdowns ─────────────────────────────────
    custom_sel = (
        "[class*='select__control']:visible, "
        "[role='combobox']:visible, "
        "div[class*='Select']:visible:not(script), "
        "div[class*='dropdown-toggle']:visible"
    )
    for cs in await page.locator(custom_sel).all():
        try:
            # find label for this dropdown
            label = (await cs.evaluate("""el=>{
                const g = el.closest(
                    '[class*=Field],[class*=formGroup],[class*=group],[class*=wrapper],' +
                    '[class*=container],[class*=form-item],[class*=FormItem]'
                );
                if (g) {
                    const l = g.querySelector('label,[class*=label],[class*=Label]');
                    return l ? l.innerText.trim() : '';
                }
                // try sibling before
                const p = el.parentElement;
                if (p) {
                    const l = p.querySelector('label,[class*=label]');
                    return l ? l.innerText.trim() : '';
                }
                return '';
            }""") or "").strip() or await gtxt(cs) or "dropdown"

            current_val = (await cs.evaluate(
                "el => el.querySelector('[class*=\"single\"]') ? el.querySelector('[class*=\"single\"]').innerText.trim() : ''"
            ) or "").strip()

            opts = await read_dropdown_options(page, cs)
            rec["fields"].append({
                "label": label, "tag": "custom-select", "type": "custom-select",
                "name": "", "id": "", "placeholder": current_val,
                "value": current_val, "checked": None,
                "required": False, "options": opts,
            })
            if opts:
                rec["dropdowns"][label] = opts
        except:
            try: await page.keyboard.press("Escape")
            except: pass

    # ── table ─────────────────────────────────────────────────────────────────
    for h in await page.locator("th:visible, [role='columnheader']:visible").all():
        t = await gtxt(h)
        if t and t not in rec["table_columns"]:
            rec["table_columns"].append(t)

    for row in await page.locator("tbody tr:visible").all():
        t = (await gtxt(row)).replace("\n", " | ").strip()
        if t and t not in rec["existing_data_rows"]:
            rec["existing_data_rows"].append(t)

    # ── buttons ───────────────────────────────────────────────────────────────
    for b in await page.locator("button:visible").all():
        t = await gtxt(b)
        if t and 0 < len(t) < 80 and t not in rec["buttons"]:
            rec["buttons"].append(t)

    return rec


# ── scrape one assessment page ─────────────────────────────────────────────────

async def scrape_assessment_page(page, site_id, site_name):
    base_url = f"{BASE_URL}/sites/{site_id}/assessment/Q1/2026/5"
    print(f"\n{'='*60}")
    print(f"SITE: {site_name}  |  {base_url}")
    print(f"{'='*60}")
    nav_log.append(f"\n\nSITE: {site_name} (id={site_id})\nURL: {base_url}")

    await page.goto(base_url, wait_until="domcontentloaded", timeout=25000)
    await idle(page, 3000)
    await ss(page, f"s{site_id}_landing")

    # ── dump all nav links ────────────────────────────────────────────────────
    all_links = await dump_nav_links(page)
    print(f"  Total visible nav items: {len(all_links)}")
    for lk in all_links:
        nav_log.append(f"  NAV: [{lk['tag']}] '{lk['text']}' href='{lk['href']}' x={lk['x']} y={lk['y']}")

    # separate LEFT sidebar (x < 300) from main content
    left_items  = [lk for lk in all_links if lk['x'] < 300 and lk['text']]
    right_items = [lk for lk in all_links if lk['x'] >= 300 and lk['text']]
    print(f"  Left sidebar items ({len(left_items)}): {[l['text'][:30] for l in left_items]}")
    print(f"  Right area items ({len(right_items)}): {[r['text'][:30] for r in right_items[:8]]}")

    # ── also collect hrefs from the page that look like assessment sub-pages ──
    all_hrefs = await page.evaluate("""() => {
        return Array.from(document.querySelectorAll('a[href]'))
            .map(a => ({text: a.innerText.trim(), href: a.getAttribute('href')}))
            .filter(x => x.href && x.href.includes('assessment'));
    }""")
    print(f"  Assessment hrefs: {all_hrefs}")
    nav_log.append(f"  Assessment hrefs: {all_hrefs}")

    visited_urls = {base_url, page.url}
    visited_labels = set()

    async def visit_and_extract(url_or_el, label, is_url=False):
        if label in visited_labels: return
        visited_labels.add(label)
        try:
            if is_url:
                if url_or_el in visited_urls: return
                visited_urls.add(url_or_el)
                await page.goto(url_or_el, wait_until="domcontentloaded", timeout=15000)
                await idle(page, 2000)
            else:
                ok = await safe_click(url_or_el)
                if not ok: return
                await idle(page, 2000)
                cur = page.url
                if cur in visited_urls and cur != base_url: return
                visited_urls.add(cur)

            cur_url = page.url
            print(f"    [{label}] -> {cur_url.replace(BASE_URL,'')}")
            await ss(page, f"s{site_id}_{slug(label)}")
            rec = await extract_form(page, f"{site_name} | {label}")
            results.append(rec)

            f_count = len(rec['fields'])
            nav_log.append(f"    {label} | {cur_url} | fields:{f_count} | cols:{rec['table_columns'][:5]}")
            for dk, dv in rec['dropdowns'].items():
                print(f"      [{dk}] options({len(dv)}): {dv[:8]}")
                nav_log.append(f"      DROPDOWN [{dk}]: {dv}")
            if rec['table_columns']:
                print(f"      table cols: {rec['table_columns']}")
            if rec['existing_data_rows']:
                print(f"      rows({len(rec['existing_data_rows'])}): {rec['existing_data_rows'][:3]}")
            if rec['emission_shown']:
                print(f"      emission: {rec['emission_shown']}")
        except Exception as e:
            print(f"    [{label}] ERROR: {e}")

    # ── 1. click left sidebar items ───────────────────────────────────────────
    print("\n  --- Sidebar navigation ---")
    # re-fetch locators by position (left side of screen, x < 300)
    # We click them by text match to be safe
    sidebar_texts = [lk['text'] for lk in left_items]
    for txt in sidebar_texts:
        if not txt or len(txt) > 80: continue
        # find the element on current page
        el = page.locator(f"text='{txt}'").first
        if not await el.count():
            el = page.locator(f":text('{txt}')").first
        if not await el.count(): continue
        bb = await el.bounding_box()
        if not bb or bb['x'] > 400: continue  # must be on left side
        await visit_and_extract(el, txt)
        # after each click, if we navigated away, go back and re-land
        if base_url not in page.url and "assessment" not in page.url:
            await page.goto(base_url, wait_until="domcontentloaded", timeout=15000)
            await idle(page, 2000)

    # ── 2. try known sub-URL patterns for assessment wizard ───────────────────
    # The wizard may use URL like /assessment/Q1/2026/5/scope-1 etc
    print("\n  --- Probing known URL sub-paths ---")
    sub_paths = [
        # scope wizard
        f"/sites/{site_id}/assessment/Q1/2026/5",
        # sometimes assessment has a numeric suffix for scope
        f"/sites/{site_id}/assessment/scope1/Q1/2026/5",
        f"/sites/{site_id}/assessment/scope2/Q1/2026/5",
        f"/sites/{site_id}/assessment/scope3/Q1/2026/5",
        # summary / overview pages
        f"/sites/{site_id}/assessment/summary/2026/5",
        f"/sites/{site_id}/assessment/intensity",
        f"/sites/{site_id}/assessment/energy",
        f"/sites/{site_id}/assessment/water",
        f"/sites/{site_id}/assessment/waste",
        # other possible patterns
        f"/sites/{site_id}/assessment/Q1/2026/1",
        f"/sites/{site_id}/assessment/Q1/2026/2",
        f"/sites/{site_id}/assessment/Q1/2026/3",
        f"/sites/{site_id}/assessment/Q1/2026/4",
    ]
    for sp in sub_paths:
        full = BASE_URL + sp if sp.startswith("/") else sp
        if full in visited_urls: continue
        try:
            await page.goto(full, wait_until="domcontentloaded", timeout=12000)
            await idle(page, 1500)
            if page.url == full or page.url.startswith(full):
                await visit_and_extract(full, sp.replace(f"/sites/{site_id}/", ""), is_url=True)
                # grab any NEW nav links discovered from this sub-page
                new_links = await dump_nav_links(page)
                for nl in new_links:
                    if "assessment" in nl['href'] and nl['href'] not in visited_urls:
                        await visit_and_extract(
                            BASE_URL + nl['href'] if nl['href'].startswith("/") else nl['href'],
                            nl['text'] or nl['href'],
                            is_url=True,
                        )
        except PWTimeout:
            pass
        except Exception as e:
            print(f"    [{sp}] skip: {type(e).__name__}")

    # ── 3. navigate back to base and do deep sidebar click ────────────────────
    # Use page.evaluate() click to hit each sidebar item we know about
    print("\n  --- Deep sidebar click via evaluate ---")
    await page.goto(base_url, wait_until="domcontentloaded", timeout=20000)
    await idle(page, 2500)

    sidebar_state = await page.evaluate("""() => {
        // Get all text nodes in left portion of page (x < 350)
        const results = [];
        const all = document.querySelectorAll('a, button, li, [role="button"], [role="tab"]');
        for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.x < 350 && rect.width > 0 && rect.height > 0) {
                const txt = el.innerText.trim();
                if (txt && txt.length < 80) {
                    results.push({
                        text: txt,
                        tag: el.tagName,
                        href: el.getAttribute('href') || '',
                        classes: el.className.toString().slice(0, 80),
                    });
                }
            }
        }
        return results;
    }""")
    print(f"  Deep sidebar items: {sidebar_state}")
    nav_log.append(f"  Deep sidebar items: {sidebar_state}")

    # click each one individually
    for item in sidebar_state:
        lbl = item['text']
        if not lbl or lbl in visited_labels: continue
        # if it has href, navigate directly
        if item['href'] and item['href'] != '#':
            href = item['href']
            full = BASE_URL + href if href.startswith('/') else href
            await visit_and_extract(full, lbl, is_url=True)
        else:
            # click by text
            el_loc = page.locator(f"text='{lbl}'").first
            if await el_loc.count():
                bb = await el_loc.bounding_box()
                if bb and bb['x'] < 400:
                    await visit_and_extract(el_loc, lbl)


# ── scrape the GHG report page ─────────────────────────────────────────────────

async def scrape_site_report(page, site_id, site_name):
    url = f"{BASE_URL}/report?year=2026&site={site_id}"
    print(f"\n  --- Report page: {url} ---")
    nav_log.append(f"\n  REPORT: {url}")

    await page.goto(url, wait_until="domcontentloaded", timeout=20000)
    await idle(page, 2500)
    await ss(page, f"report_s{site_id}_{slug(site_name)}")

    rec = await extract_form(page, f"REPORT: {site_name}")
    results.append(rec)
    print(f"  fields:{len(rec['fields'])} cols:{len(rec['table_columns'])} rows:{len(rec['existing_data_rows'])}")
    if rec['table_columns']:
        print(f"  Columns: {rec['table_columns']}")
    for dk, dv in rec['dropdowns'].items():
        print(f"  [{dk}] options: {dv[:6]}")
    for r in rec['existing_data_rows'][:6]:
        print(f"    Row: {r[:120]}")
    nav_log.append(f"  fields:{len(rec['fields'])} | cols:{rec['table_columns']} | rows:{len(rec['existing_data_rows'])}")

    # probe tabs
    for tab in await page.locator("[role='tab']:visible").all():
        tlbl = await gtxt(tab)
        if not tlbl: continue
        try:
            await tab.click()
            await idle(page, 900)
            await ss(page, f"report_s{site_id}_tab_{slug(tlbl)}")
            trec = await extract_form(page, f"REPORT:{site_name}>{tlbl}")
            if trec["fields"] or trec["table_columns"]:
                results.append(trec)
                nav_log.append(f"    TAB:{tlbl} | cols:{trec['table_columns'][:6]}")
                print(f"  [tab] {tlbl}: cols={trec['table_columns'][:5]}")
        except: pass


# ── main ───────────────────────────────────────────────────────────────────────

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False, slow_mo=60)
        ctx  = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await ctx.new_page()

        await login(page)

        for site_id, site_name in SITES.items():
            await scrape_assessment_page(page, site_id, site_name)
            await scrape_site_report(page, site_id, site_name)

        # ── save outputs ──────────────────────────────────────────────────────
        print(f"\n\nSaving {len(results)} sections, {N[0]} screenshots...")
        with open(OUT_FILE, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        with open(NAV_FILE, "w", encoding="utf-8") as f:
            f.write("ESGTech – Assessment Field Map\n")
            f.write("=" * 70 + "\n")
            for l in nav_log:
                f.write(str(l) + "\n")

        print(f"\nDone!")
        print(f"  -> {OUT_FILE}")
        print(f"  -> {NAV_FILE}")
        print(f"  -> {SHOT_DIR}/ ({N[0]} screenshots)")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())

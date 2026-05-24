"""
Targeted dropdown scraper — opens the Add Entry form on each assessment
category page and reads every dropdown option.
Read-only: clicks Add to open the form, reads options, hits Escape/Cancel.
Never submits.
"""

import asyncio, json, re, sys
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LOGIN_URL = "https://app.esgtech.ai/login"
EMAIL     = "compliance.mfg@kgirdharlal.com"
PASSWORD  = "PXJNAEBasj"
BASE_URL  = "https://app.esgtech.ai"

# Site 193 = Surat (most data, best for discovering all options)
SITE_ID = 193

# Portal category codes confirmed from scraper
CATEGORIES = [
    {"code": "Q1",  "name": "Stationary Combustion",  "scope": 1},
    {"code": "Q2",  "name": "Mobile Combustion",       "scope": 1},
    {"code": "Q3",  "name": "Fugitive Emissions",       "scope": 1},
    {"code": "Q4",  "name": "Scope 2 - Electricity",   "scope": 2},
    {"code": "Q16", "name": "Scope 3",                 "scope": 3},
]

OUT = Path(__file__).parent / "output"
OUT.mkdir(exist_ok=True)
SHOT = OUT / "screenshots_dropdowns"
SHOT.mkdir(exist_ok=True)
N = [0]

dropdowns_found = {}


def slug(t):
    return re.sub(r"[^a-z0-9]+", "_", (t or "").lower()).strip("_")[:50]

async def ss(page, label):
    N[0] += 1
    p = SHOT / f"{N[0]:04d}_{slug(label)}.png"
    try: await page.screenshot(path=str(p), full_page=True)
    except: pass

async def idle(page, ms=1500):
    await page.wait_for_timeout(ms)
    try: await page.wait_for_load_state("networkidle", timeout=6000)
    except: pass


async def login(page):
    print("Logging in...")
    await page.goto(LOGIN_URL, wait_until="domcontentloaded")
    await idle(page, 1200)
    for s in ["input[type='email']", "input[placeholder*='Email' i]"]:
        if await page.locator(s).count():
            await page.locator(s).first.fill(EMAIL); break
    await page.wait_for_timeout(300)
    for s in ["input[type='password']"]:
        if await page.locator(s).count():
            await page.locator(s).first.fill(PASSWORD); break
    await page.wait_for_timeout(300)
    for s in ["button[type='submit']", "button:has-text('Submit')"]:
        if await page.locator(s).count():
            await page.locator(s).first.click(); break
    try:
        await page.wait_for_url(lambda u: "login" not in u, timeout=15000)
    except: pass
    await idle(page, 2000)
    print(f"  Logged in: {page.url}")


async def read_all_dropdowns(page, context_name):
    """Read every visible dropdown/select on the current page."""
    found = {}

    # ── standard <select> ────────────────────────────────────────────────────
    for sel_el in await page.locator("select:visible").all():
        try:
            name = await sel_el.get_attribute("name") or await sel_el.get_attribute("id") or "select"
            opts = await sel_el.evaluate(
                "el => Array.from(el.options).map(o => o.text.trim()).filter(t => t)"
            )
            if opts:
                found[name] = opts
                print(f"    <select> [{name}]: {opts}")
        except: pass

    # ── React custom selects ─────────────────────────────────────────────────
    custom_sels = await page.locator(
        "[class*='select__control']:visible, "
        "[role='combobox']:visible, "
        "div[class*='Select'][class*='container']:visible"
    ).all()

    for i, cs in enumerate(custom_sels):
        try:
            # get label
            label = (await cs.evaluate("""el => {
                const g = el.closest('[class*=Field],[class*=formGroup],[class*=group],[class*=wrapper],[class*=form-item],[class*=item]');
                if (g) {
                    const l = g.querySelector('label,[class*=label]');
                    if (l) return l.innerText.trim();
                }
                // try previous sibling
                let p = el.previousElementSibling;
                while(p) {
                    const t = p.innerText.trim();
                    if (t && t.length < 60) return t;
                    p = p.previousElementSibling;
                }
                return '';
            }""") or "").strip() or f"dropdown_{i}"

            current = (await cs.evaluate(
                "el => { const s = el.querySelector('[class*=singleValue],[class*=single-value],[class*=placeholder]'); return s ? s.innerText.trim() : ''; }"
            ) or "").strip()

            print(f"    Clicking dropdown [{label}] (current: '{current}')...")
            await cs.scroll_into_view_if_needed()
            await cs.click(timeout=4000)
            await page.wait_for_timeout(800)

            opts = []
            for opt_sel in [
                "[role='option']:visible",
                "[class*='option']:visible:not([class*='control']):not([class*='indicator']):not([class*='menu'])",
                "[class*='menu'] [class*='item']:visible",
                "ul li:visible",
            ]:
                opt_els = await page.locator(opt_sel).all()
                for o in opt_els:
                    t = (await o.inner_text()).strip()
                    if t and 0 < len(t) < 150 and t not in opts:
                        opts.append(t)
                if opts: break

            await page.keyboard.press("Escape")
            await page.wait_for_timeout(500)

            if opts:
                found[label] = opts
                print(f"      → {opts}")
            else:
                print(f"      → (no options visible)")
        except Exception as e:
            try: await page.keyboard.press("Escape")
            except: pass

    return found


async def scrape_category(page, cat):
    url = f"{BASE_URL}/sites/{SITE_ID}/assessment/{cat['code']}/2026/5"
    print(f"\n{'='*60}")
    print(f"Category: {cat['name']} ({cat['code']})  |  {url}")
    print(f"{'='*60}")

    await page.goto(url, wait_until="domcontentloaded", timeout=20000)
    await idle(page, 2500)
    await ss(page, f"{cat['code']}_landing")

    all_dropdowns = {}

    # ── Step 1: read dropdowns visible on landing ─────────────────────────────
    print("  Step 1: Dropdowns on landing page")
    d = await read_all_dropdowns(page, f"{cat['name']} landing")
    all_dropdowns.update(d)

    # ── Step 2: find and click Add / New / + button ───────────────────────────
    print("  Step 2: Looking for Add Entry button...")
    add_btn = None
    for sel in [
        "button:has-text('Add'):visible",
        "button:has-text('New'):visible",
        "button:has-text('+ Add'):visible",
        "button:has-text('Create'):visible",
        "[class*='add']:visible:not(input)",
        "button[class*='primary']:visible",
        "button[class*='btn-primary']:visible",
    ]:
        loc = page.locator(sel).first
        if await loc.count():
            txt = (await loc.inner_text()).strip()
            print(f"    Found: '{txt}' ({sel})")
            add_btn = loc
            break

    if add_btn:
        try:
            await add_btn.scroll_into_view_if_needed()
            await add_btn.click(timeout=5000)
            await idle(page, 2000)
            await ss(page, f"{cat['code']}_add_form")
            print("  Step 3: Dropdowns in Add form")
            d2 = await read_all_dropdowns(page, f"{cat['name']} form")
            all_dropdowns.update(d2)

            # close the form/modal
            for close_sel in [
                "button:has-text('Cancel'):visible",
                "button:has-text('Close'):visible",
                "[aria-label='Close']:visible",
                "button[class*='cancel']:visible",
            ]:
                cl = page.locator(close_sel).first
                if await cl.count():
                    await cl.click()
                    await page.wait_for_timeout(500)
                    break
            else:
                await page.keyboard.press("Escape")
                await page.wait_for_timeout(500)
        except Exception as e:
            print(f"    Add button error: {e}")
            await page.keyboard.press("Escape")
    else:
        print("    No Add button found — checking for inline form...")
        # Some pages show the form directly (no Add button)
        d3 = await read_all_dropdowns(page, f"{cat['name']} inline")
        all_dropdowns.update(d3)

    # ── Step 3: also try sub-pages (Q1→Q2→Q3 for Scope 1) ───────────────────
    # Scope 3 (Q16) has many sub-categories — find them
    if cat["code"] == "Q16":
        print("  Step 4: Probing Scope 3 sub-categories...")
        scope3_links = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('a[href*="assessment"]'))
                .map(a => ({text: a.innerText.trim(), href: a.getAttribute('href')}))
                .filter(x => x.href && x.text);
        }""")
        print(f"    Scope 3 links: {scope3_links}")

        visited_s3 = set()
        for lk in scope3_links:
            href = lk['href']
            if href in visited_s3: continue
            visited_s3.add(href)
            full = BASE_URL + href if href.startswith('/') else href
            try:
                await page.goto(full, wait_until="domcontentloaded", timeout=12000)
                await idle(page, 2000)
                await ss(page, f"S3_{slug(lk['text'])}")

                # try add button
                for sel in ["button:has-text('Add'):visible","button:has-text('New'):visible","button[class*='primary']:visible"]:
                    loc = page.locator(sel).first
                    if await loc.count():
                        await loc.click()
                        await idle(page, 1500)
                        d_s3 = await read_all_dropdowns(page, lk['text'])
                        for k,v in d_s3.items():
                            all_dropdowns[f"S3_{lk['text']}_{k}"] = v
                        await page.keyboard.press("Escape")
                        break
            except: pass

    return all_dropdowns


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False, slow_mo=80)
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await ctx.new_page()

        await login(page)

        for cat in CATEGORIES:
            d = await scrape_category(page, cat)
            dropdowns_found[cat['name']] = d

        # save
        out_file = OUT / "dropdown_options.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(dropdowns_found, f, indent=2, ensure_ascii=False)

        print(f"\n\n{'='*60}")
        print("COMPLETE DROPDOWN MAP")
        print(f"{'='*60}")
        for cat_name, cat_dropdowns in dropdowns_found.items():
            if cat_dropdowns:
                print(f"\n[{cat_name}]")
                for field, options in cat_dropdowns.items():
                    print(f"  {field}: {options}")

        print(f"\nSaved to {out_file}")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())

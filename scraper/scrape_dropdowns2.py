"""
Inline dropdown scraper — reads every dropdown directly from the inline
assessment forms on esgtech.ai. No Add/modal button needed.
Captures: all options for each dropdown + cascade: when you pick option X
in dropdown A, what new options appear in dropdown B.

Read-only: never submits, never modifies data.
"""

import asyncio, json, re, sys
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LOGIN_URL = "https://app.esgtech.ai/login"
EMAIL     = "compliance.mfg@kgirdharlal.com"
PASSWORD  = "PXJNAEBasj"
BASE_URL  = "https://app.esgtech.ai"

SITE_ID = 193  # Surat — most data

# All 19 Q-codes
CATEGORIES = [
    {"code": "Q1",  "name": "Stationary Combustion",        "scope": 1},
    {"code": "Q2",  "name": "Mobile Combustion",            "scope": 1},
    {"code": "Q3",  "name": "Fugitive Emissions",           "scope": 1},
    {"code": "Q4",  "name": "Electricity",                  "scope": 2},
    {"code": "Q5",  "name": "Heat/Steam",                   "scope": 2},
    {"code": "Q19", "name": "Renewable Electricity",        "scope": 2},
    {"code": "Q6",  "name": "Water Supply",                 "scope": 3},
    {"code": "Q7",  "name": "Water Treatment",              "scope": 3},
    {"code": "Q8",  "name": "Purchased Goods",              "scope": 3},
    {"code": "Q9",  "name": "Waste Disposal",               "scope": 3},
    {"code": "Q10", "name": "Business Travel (Air)",        "scope": 3},
    {"code": "Q11", "name": "Business Travel (Sea)",        "scope": 3},
    {"code": "Q12", "name": "Business Travel (Land)",       "scope": 3},
    {"code": "Q13", "name": "Upstream Activities",          "scope": 3},
    {"code": "Q14", "name": "Hotel Stay",                   "scope": 3},
    {"code": "Q15", "name": "Food Consumption",             "scope": 3},
    {"code": "Q16", "name": "Employee Commute",             "scope": 3},
    {"code": "Q17", "name": "T&D Loss",                    "scope": 3},
    {"code": "Q18", "name": "Downstream Activities",        "scope": 3},
]

OUT = Path(__file__).parent / "output"
OUT.mkdir(exist_ok=True)
SHOT = OUT / "screenshots_dd2"
SHOT.mkdir(exist_ok=True)
N = [0]

def slug(t):
    return re.sub(r"[^a-z0-9]+", "_", (t or "").lower()).strip("_")[:50]

async def ss(page, label):
    N[0] += 1
    p = SHOT / f"{N[0]:04d}_{slug(label)}.png"
    try:
        await page.screenshot(path=str(p), full_page=False)
    except:
        pass

async def wait(page, ms=1000):
    await page.wait_for_timeout(ms)
    try:
        await page.wait_for_load_state("networkidle", timeout=4000)
    except:
        pass

async def login(page):
    print("Logging in...")
    await page.goto(LOGIN_URL, wait_until="domcontentloaded")
    await wait(page, 1500)

    # Use name='email' — the field type is text, not email
    for sel in ["input[name='email']", "input[type='email']", "input[placeholder*='mail' i]", "input[placeholder*='user' i]"]:
        if await page.locator(sel).count():
            await page.locator(sel).first.fill(EMAIL)
            print(f"  Filled email with: {sel}")
            break

    await page.wait_for_timeout(400)

    for sel in ["input[type='password']", "input[name='password']"]:
        if await page.locator(sel).count():
            await page.locator(sel).first.fill(PASSWORD)
            print(f"  Filled password with: {sel}")
            break

    await page.wait_for_timeout(400)

    # Press Enter to submit (button[type='submit'] count() is unreliable here)
    await page.keyboard.press("Enter")
    print("  Pressed Enter to submit")

    try:
        await page.wait_for_url(lambda u: "login" not in u, timeout=20000)
    except:
        pass
    await wait(page, 2000)
    print(f"  After login: {page.url}")


async def get_dropdown_label(cs, page, i):
    """Try to find a human-readable label for this dropdown control."""
    label = ""
    try:
        label = await cs.evaluate("""el => {
            // 1. Placeholder text inside the control
            const ph = el.querySelector('[class*="placeholder"]');
            if (ph) { const t = ph.innerText.trim(); if (t && !t.startsWith('Select')) return t; }
            // 2. Label in a wrapping form group
            const ancestors = [el.parentElement, el.parentElement?.parentElement, el.parentElement?.parentElement?.parentElement];
            for (const g of ancestors) {
                if (!g) continue;
                const lbl = g.querySelector('label');
                if (lbl) { const t = lbl.innerText.trim(); if (t) return t; }
            }
            // 3. Placeholder "Select XYZ"
            const ph2 = el.querySelector('[class*="placeholder"]');
            if (ph2) return ph2.innerText.trim();
            return '';
        }""")
    except:
        pass
    return (label or f"dropdown_{i}").strip()


async def click_and_read_options(page, cs, label):
    """Click a React select control, collect all visible options, then close."""
    options = []
    try:
        await cs.scroll_into_view_if_needed()
        await cs.click(timeout=5000)
        await page.wait_for_timeout(600)

        # Collect from multiple possible selectors
        for sel in [
            "[class*='option']:not([class*='control']):not([class*='indicators']):not([class*='menu-']):not([class*='Input']):not([class*='Placeholder'])",
            "[role='option']",
            "[class*='menu'] div[class*='item']",
        ]:
            els = await page.locator(sel).all()
            for el in els:
                try:
                    t = (await el.inner_text()).strip()
                    if t and 0 < len(t) < 120 and t not in options and t.lower() not in ("no options", "loading..."):
                        options.append(t)
                except:
                    pass
            if options:
                break

    except Exception as e:
        print(f"      click error on [{label}]: {e}")

    # Always close the dropdown
    try:
        await page.keyboard.press("Escape")
    except:
        pass
    await page.wait_for_timeout(400)

    return options


async def snapshot_dropdowns(page):
    """Return list of all visible React select controls on the page."""
    controls = await page.locator(
        "[class*='select__control']:visible, [class*='Select-control']:visible"
    ).all()
    return controls


async def read_page_dropdowns(page, context_name):
    """Read all dropdowns currently visible on the page. Returns dict label->options."""
    result = {}
    controls = await snapshot_dropdowns(page)
    print(f"  Found {len(controls)} dropdown controls on page ({context_name})")

    for i, cs in enumerate(controls):
        try:
            label = await get_dropdown_label(cs, page, i)
            print(f"    [{i+1}/{len(controls)}] Dropdown: '{label}'")
            opts = await click_and_read_options(page, cs, label)
            if opts:
                result[label] = opts
                print(f"      Options ({len(opts)}): {opts[:8]}{'...' if len(opts)>8 else ''}")
            else:
                print(f"      (no options captured)")
        except Exception as e:
            print(f"      Error on dropdown {i}: {e}")

    return result


async def map_cascades(page, cat_name):
    """
    For each dropdown, select each option and record what changes in the other dropdowns.
    This reveals cascade dependencies.
    Returns: { "TypeDropdown": { "OptionA": { "UnitDropdown": ["opt1","opt2"] } } }
    """
    cascades = {}

    # Get initial state
    controls = await snapshot_dropdowns(page)
    if len(controls) < 2:
        return cascades  # Need at least 2 dropdowns to detect cascades

    # Focus on first dropdown (usually "Type")
    first = controls[0]
    first_label = await get_dropdown_label(first, page, 0)

    # Get all options of first dropdown
    first_opts = await click_and_read_options(page, first, first_label)
    if not first_opts:
        return cascades

    print(f"  Cascade mapping: '{first_label}' has {len(first_opts)} options")

    cascades[first_label] = {}

    for opt in first_opts[:12]:  # Limit to 12 options to avoid taking too long
        try:
            print(f"    Selecting '{opt}' in '{first_label}'...")

            # Re-get the first control (page may have re-rendered)
            ctrls = await snapshot_dropdowns(page)
            if not ctrls:
                continue
            fc = ctrls[0]

            await fc.scroll_into_view_if_needed()
            await fc.click(timeout=5000)
            await page.wait_for_timeout(500)

            # Find and click the option
            clicked = False
            for opt_sel in ["[class*='option']:visible", "[role='option']:visible"]:
                opt_els = await page.locator(opt_sel).all()
                for oel in opt_els:
                    try:
                        t = (await oel.inner_text()).strip()
                        if t == opt:
                            await oel.click(timeout=3000)
                            clicked = True
                            break
                    except:
                        pass
                if clicked:
                    break

            if not clicked:
                await page.keyboard.press("Escape")
                continue

            await page.wait_for_timeout(800)

            # Now read all OTHER dropdowns to see what changed
            after_ctrls = await snapshot_dropdowns(page)
            cascade_result = {}

            for j, oc in enumerate(after_ctrls[1:], 1):  # Skip first dropdown
                try:
                    ol = await get_dropdown_label(oc, page, j)
                    o_opts = await click_and_read_options(page, oc, ol)
                    if o_opts:
                        cascade_result[ol] = o_opts
                except:
                    pass

            cascades[first_label][opt] = cascade_result

        except Exception as e:
            print(f"    Error on option '{opt}': {e}")
            try:
                await page.keyboard.press("Escape")
            except:
                pass

    return cascades


async def scrape_category(page, cat):
    url = f"{BASE_URL}/sites/{SITE_ID}/assessment/{cat['code']}/2026/5"
    print(f"\n{'='*60}")
    print(f"[{cat['code']}] {cat['name']} (Scope {cat['scope']})")
    print(f"URL: {url}")
    print(f"{'='*60}")

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=25000)
    except Exception as e:
        print(f"  Navigation error: {e}")
        return {}

    await wait(page, 2500)
    await ss(page, f"{cat['code']}_landing")

    result = {
        "url": url,
        "dropdowns": {},
        "cascades": {},
    }

    # Read all dropdowns directly from inline form
    print("  Reading inline form dropdowns...")
    result["dropdowns"] = await read_page_dropdowns(page, cat["name"])

    # Map cascades if we have multiple dropdowns
    if len(result["dropdowns"]) >= 2:
        print("  Mapping cascade dependencies...")
        result["cascades"] = await map_cascades(page, cat["name"])
        await ss(page, f"{cat['code']}_after_cascade")

    # Check for sub-navigation tabs (especially Q16 Employee Commute has many)
    sub_tabs = await page.evaluate("""() => {
        const tabs = [];
        // nav links, sidebar links, tab buttons
        const sels = ['nav a', '[role="tab"]', '[class*="tab"] a', '[class*="sidebar"] a', '[class*="nav"] a'];
        for (const s of sels) {
            document.querySelectorAll(s).forEach(el => {
                const t = el.innerText.trim();
                const h = el.getAttribute('href') || '';
                if (t && h.includes('assessment')) tabs.push({text: t, href: h});
            });
        }
        return [...new Map(tabs.map(t => [t.href, t])).values()];
    }""")

    if sub_tabs:
        print(f"  Found {len(sub_tabs)} sub-tabs, scraping each...")
        for tab in sub_tabs[:15]:
            href = tab["href"]
            full_url = BASE_URL + href if href.startswith("/") else href
            if full_url == url:
                continue
            try:
                print(f"    Sub-tab: {tab['text']} → {full_url}")
                await page.goto(full_url, wait_until="domcontentloaded", timeout=20000)
                await wait(page, 2000)
                await ss(page, f"{cat['code']}_{slug(tab['text'])}")
                sub_dds = await read_page_dropdowns(page, f"{cat['name']} / {tab['text']}")
                if sub_dds:
                    key = f"{tab['text']}"
                    result["dropdowns"][key] = sub_dds
            except Exception as e:
                print(f"    Error on sub-tab {tab['text']}: {e}")

    return result


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False, slow_mo=60)
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await ctx.new_page()

        await login(page)

        all_results = {}

        for cat in CATEGORIES:
            try:
                data = await scrape_category(page, cat)
                all_results[cat["code"]] = {
                    "name": cat["name"],
                    "scope": cat["scope"],
                    **data,
                }
            except Exception as e:
                print(f"\nFATAL ERROR on {cat['code']}: {e}")
                all_results[cat["code"]] = {"name": cat["name"], "error": str(e)}

        # Save full results
        out_file = OUT / "dropdown_options.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(all_results, f, indent=2, ensure_ascii=False)

        # Print summary
        print(f"\n\n{'='*60}")
        print("DROPDOWN CAPTURE SUMMARY")
        print(f"{'='*60}")
        for code, data in all_results.items():
            dds = data.get("dropdowns", {})
            cas = data.get("cascades", {})
            print(f"\n[{code}] {data.get('name','')}")
            if dds:
                for field, opts in dds.items():
                    if isinstance(opts, list):
                        print(f"  {field}: {opts}")
                    elif isinstance(opts, dict):  # sub-tab structure
                        for sf, so in opts.items():
                            print(f"  {field} / {sf}: {so}")
            if cas:
                for src_dd, opt_map in cas.items():
                    for opt, affected in opt_map.items():
                        if affected:
                            print(f"  CASCADE [{src_dd}='{opt}'] → {affected}")

        print(f"\nSaved to: {out_file}")
        print(f"Screenshots: {SHOT}")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())

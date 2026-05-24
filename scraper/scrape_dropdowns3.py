"""
Final dropdown scraper — correctly handles esgtech.ai's custom button dropdowns.
Dropdowns are buttons that open an absolutely-positioned div with options.
Captures all options + cascade behavior.
Read-only: never submits.
"""

import asyncio, json, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LOGIN_URL = "https://app.esgtech.ai/login"
EMAIL     = "compliance.mfg@kgirdharlal.com"
PASSWORD  = "PXJNAEBasj"
BASE_URL  = "https://app.esgtech.ai"

SITE_ID = 193  # Surat

CATEGORIES = [
    {"code": "Q1",  "name": "Stationary Combustion",   "scope": 1},
    {"code": "Q2",  "name": "Mobile Combustion",        "scope": 1},
    {"code": "Q3",  "name": "Fugitive Emissions",        "scope": 1},
    {"code": "Q4",  "name": "Electricity",              "scope": 2},
    {"code": "Q5",  "name": "Heat/Steam",               "scope": 2},
    {"code": "Q19", "name": "Renewable Electricity",    "scope": 2},
    {"code": "Q6",  "name": "Water Supply",             "scope": 3},
    {"code": "Q7",  "name": "Water Treatment",          "scope": 3},
    {"code": "Q8",  "name": "Purchased Goods",          "scope": 3},
    {"code": "Q9",  "name": "Waste Disposal",           "scope": 3},
    {"code": "Q10", "name": "Business Travel (Air)",    "scope": 3},
    {"code": "Q11", "name": "Business Travel (Sea)",    "scope": 3},
    {"code": "Q12", "name": "Business Travel (Land)",   "scope": 3},
    {"code": "Q13", "name": "Upstream Activities",      "scope": 3},
    {"code": "Q14", "name": "Hotel Stay",               "scope": 3},
    {"code": "Q15", "name": "Food Consumption",         "scope": 3},
    {"code": "Q16", "name": "Employee Commute",         "scope": 3},
    {"code": "Q17", "name": "T&D Loss",                "scope": 3},
    {"code": "Q18", "name": "Downstream Activities",    "scope": 3},
]

OUT = Path(__file__).parent / "output"
OUT.mkdir(exist_ok=True)
SHOT = OUT / "screenshots_dd3"
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


async def login(page):
    print("Logging in...")
    await page.goto(LOGIN_URL, wait_until="domcontentloaded")
    await page.wait_for_timeout(2500)
    await page.locator("input[name='email']").fill(EMAIL)
    await page.wait_for_timeout(400)
    await page.locator("input[type='password']").fill(PASSWORD)
    await page.wait_for_timeout(400)
    await page.keyboard.press("Enter")
    await page.wait_for_url(lambda u: "login" not in u, timeout=20000)
    await page.wait_for_timeout(2000)
    print(f"  Logged in: {page.url}")


async def get_open_dropdown_options(page):
    """After clicking a dropdown button, read the options from the absolute div."""
    try:
        # Wait for the dropdown div to appear
        await page.wait_for_selector(
            "div[class*='absolute'][class*='bg-white']",
            timeout=3000, state="visible"
        )
    except:
        pass

    await page.wait_for_timeout(500)

    # Read all text from the absolute dropdown div
    options = await page.evaluate("""() => {
        const dropdowns = document.querySelectorAll("div[class*='absolute']");
        const visible = Array.from(dropdowns).filter(d =>
            d.offsetParent && d.innerText.trim().length > 0 &&
            (d.className.includes('bg-white') || d.className.includes('rounded'))
        );
        if (!visible.length) return [];

        // Find the one with most content (likely the options list)
        visible.sort((a,b) => b.innerText.length - a.innerText.length);
        const container = visible[0];

        // Get all clickable items inside
        const items = [];
        container.querySelectorAll('button, li, [class*="item"], [class*="option"], p, span, div').forEach(el => {
            if (!el.children.length || el.tagName === 'BUTTON') {
                const t = el.innerText.trim();
                if (t && t.length > 0 && t.length < 100 && !items.includes(t)) {
                    items.push(t);
                }
            }
        });

        // If no items, just split the text by newlines
        if (!items.length) {
            container.innerText.split('\\n').forEach(line => {
                const t = line.trim();
                if (t && t.length > 0 && t.length < 100 && !items.includes(t)) {
                    items.push(t);
                }
            });
        }

        return items;
    }""")

    return options


async def close_dropdown(page):
    """Close any open dropdown by pressing Escape."""
    try:
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(400)
    except:
        pass


async def get_select_buttons(page):
    """Get all visible 'Select *' buttons on the page."""
    btns = []
    all_btns = await page.locator("button").all()
    for btn in all_btns:
        try:
            txt = (await btn.inner_text()).strip()
            if txt.startswith("Select ") or txt == "Select":
                visible = await btn.is_visible()
                if visible:
                    btns.append((txt, btn))
        except:
            pass
    return btns


async def click_option_in_dropdown(page, option_text):
    """Click a specific option in an open dropdown."""
    try:
        # Look for buttons or list items with this text
        for sel in [
            f"button:has-text('{option_text}')",
            f"li:has-text('{option_text}')",
            f"[class*='absolute'] *:has-text('{option_text}')",
        ]:
            loc = page.locator(sel)
            cnt = await loc.count()
            if cnt:
                await loc.first.click(timeout=3000)
                await page.wait_for_timeout(600)
                return True
    except:
        pass
    return False


async def scrape_category(page, cat):
    url = f"{BASE_URL}/sites/{SITE_ID}/assessment/{cat['code']}/2026/5"
    print(f"\n{'='*60}")
    print(f"[{cat['code']}] {cat['name']} (Scope {cat['scope']})")
    print(f"{'='*60}")

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=25000)
    except Exception as e:
        print(f"  Nav error: {e}")
        return {}

    await page.wait_for_timeout(3000)
    await ss(page, f"{cat['code']}_landing")

    result = {"url": url, "dropdowns": {}, "cascades": {}}

    # Get all Select buttons
    select_btns = await get_select_buttons(page)
    print(f"  Found {len(select_btns)} Select buttons: {[t for t,_ in select_btns]}")

    if not select_btns:
        print("  No select buttons found, skipping.")
        return result

    # ── Step 1: Read options from each dropdown ────────────────────────────────
    for btn_label, btn in select_btns:
        print(f"  Reading dropdown: [{btn_label}]")
        try:
            await btn.scroll_into_view_if_needed()
            await btn.click(timeout=4000)
            await page.wait_for_timeout(1000)

            options = await get_open_dropdown_options(page)
            if options:
                result["dropdowns"][btn_label] = options
                print(f"    → {len(options)} options: {options[:5]}{'...' if len(options)>5 else ''}")
            else:
                print(f"    → no options found")

            await close_dropdown(page)
            await page.wait_for_timeout(500)
        except Exception as e:
            print(f"    Error: {e}")
            await close_dropdown(page)

    # ── Step 2: Cascade mapping (Type → Units change) ──────────────────────────
    if len(select_btns) >= 2:
        type_label, type_btn = select_btns[0]  # First = Type
        unit_label, unit_btn = select_btns[1]  # Second = Unit

        type_options = result["dropdowns"].get(type_label, [])
        cascade = {}

        # Filter out category headers (usually uppercase or short all-caps)
        actual_options = [o for o in type_options if o and not o.isupper() and len(o) > 1]

        print(f"\n  Cascade: testing {min(len(actual_options), 8)} options in [{type_label}]")
        for opt in actual_options[:8]:  # Test first 8 options
            try:
                # Re-navigate to reset form state
                await page.goto(url, wait_until="domcontentloaded", timeout=20000)
                await page.wait_for_timeout(2500)

                # Click Type dropdown and select this option
                btns_fresh = await get_select_buttons(page)
                if not btns_fresh:
                    continue

                await btns_fresh[0][1].click(timeout=4000)
                await page.wait_for_timeout(800)

                clicked = await click_option_in_dropdown(page, opt)
                if not clicked:
                    print(f"    Couldn't click option: '{opt}'")
                    await close_dropdown(page)
                    continue

                await page.wait_for_timeout(800)
                await ss(page, f"{cat['code']}_type_{slug(opt)}")

                # Now read Unit dropdown options
                btns_after = await get_select_buttons(page)
                unit_opts = []
                for bl, bb in btns_after:
                    if 'unit' in bl.lower() or 'Unit' in bl:
                        await bb.click(timeout=4000)
                        await page.wait_for_timeout(800)
                        unit_opts = await get_open_dropdown_options(page)
                        await close_dropdown(page)
                        break

                cascade[opt] = unit_opts
                print(f"    [{opt}] → units: {unit_opts}")

            except Exception as e:
                print(f"    Error cascade [{opt}]: {e}")
                try:
                    await close_dropdown(page)
                except:
                    pass

        if cascade:
            result["cascades"][f"{type_label}→{unit_label}"] = cascade

    # ── Step 3: Sub-tabs (Scope 3 categories have sub-tabs) ───────────────────
    await page.goto(url, wait_until="domcontentloaded", timeout=20000)
    await page.wait_for_timeout(2500)

    sub_links = await page.evaluate("""() => {
        return Array.from(document.querySelectorAll('a[href*="assessment"]'))
            .map(a => ({text: a.innerText.trim(), href: a.getAttribute('href')}))
            .filter(x => x.href && x.text && !x.href.endsWith('/assessment/'));
    }""")

    current_path = f"/sites/{SITE_ID}/assessment/{cat['code']}/2026/5"
    other_links = [l for l in sub_links if l['href'] != current_path and cat['code'] not in l['href']]

    if other_links and cat['scope'] == 3:
        print(f"\n  Sub-tabs found: {[l['text'] for l in other_links[:6]]}")
        for link in other_links[:6]:
            full_url = BASE_URL + link['href'] if link['href'].startswith('/') else link['href']
            try:
                await page.goto(full_url, wait_until="domcontentloaded", timeout=20000)
                await page.wait_for_timeout(2500)

                sub_btns = await get_select_buttons(page)
                sub_dropdowns = {}
                for bl, bb in sub_btns:
                    await bb.scroll_into_view_if_needed()
                    await bb.click(timeout=4000)
                    await page.wait_for_timeout(800)
                    opts = await get_open_dropdown_options(page)
                    if opts:
                        sub_dropdowns[bl] = opts
                    await close_dropdown(page)
                    await page.wait_for_timeout(400)

                if sub_dropdowns:
                    result["dropdowns"][link['text']] = sub_dropdowns
                    print(f"    {link['text']}: {list(sub_dropdowns.keys())}")
            except Exception as e:
                print(f"    Sub-tab error [{link['text']}]: {e}")

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
                print(f"\nFATAL on {cat['code']}: {e}")
                all_results[cat["code"]] = {"name": cat["name"], "error": str(e)}

        # Save
        out_file = OUT / "dropdown_options.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(all_results, f, indent=2, ensure_ascii=False)

        # Summary
        print(f"\n\n{'='*60}")
        print("FINAL DROPDOWN MAP")
        print(f"{'='*60}")
        for code, data in all_results.items():
            dds = data.get("dropdowns", {})
            cas = data.get("cascades", {})
            print(f"\n[{code}] {data.get('name','')}")
            for field, opts in dds.items():
                if isinstance(opts, list):
                    print(f"  {field}: {opts[:6]}{'...' if len(opts)>6 else ''}")
                elif isinstance(opts, dict):
                    for sf, so in opts.items():
                        print(f"  {field}/{sf}: {so[:4]}{'...' if len(so)>4 else ''}")
            for cascade_name, cascade_map in cas.items():
                print(f"  CASCADE [{cascade_name}]:")
                for opt, units in cascade_map.items():
                    print(f"    '{opt}' → {units}")

        print(f"\nSaved: {out_file}")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())

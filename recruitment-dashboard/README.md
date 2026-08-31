# Zeronorth Recruitment Intelligence Dashboard

A fully dynamic Excel analytics layer built on top of the existing Zeronorth recruiting
workbook. Every number, ranking, chart and narrative sentence is a formula. Update the
source data and the whole thing follows — no chart ranges to re-point, no numbers to retype.

## Important note on scope

The brief that accompanied this build described a **data-engineering candidate assessment
workbook**: overall scores, a scoring rubric, dimensions such as Platform Stack, CDC /
Incremental, Lakehouse / Medallion, Scale, Optimization and Leadership, and decision values
like *Strong Submit* / *Do Not Prioritize*.

`Zeronorth_.xlsx` contains none of that. It is an **ATS / pipeline tracker**. A scan of the
raw workbook XML (not just the visible cells) found no score column, no rubric, no scoring
dimensions, no candidate named Abhinandan and no Pune candidates.

Rather than invent scores, this dashboard was built on the fields that actually exist. The
requested components were mapped onto real data:

| Asked for | Built as | Source field |
|---|---|---|
| Overall score ranking | Pipeline progression ranking | `Screening Status` → funnel order |
| Decision distribution | Stage distribution | `Screening Status` |
| Technical capability heatmap | Candidate comparison matrix | experience, CTC, hike, notice, stage, location |
| Avg score by dimension | Avg by experience band / recruiter / requisition | derived |
| Location distribution | Location distribution | `Current Location`, normalised |
| Experience vs score scatter | Experience vs expected CTC scatter | `Total Exp` × `ECTC` |
| Skill strength comparison | Recruiter throughput + requisition mix | derived |
| Strengths / risks / recommended screen | Eight rule-based checks + next step | derived from recorded fields |

**There are no invented scores anywhere.** The eight checks on *Candidate Detail* are
transparent rules applied to recorded data (e.g. "experience ≥ the bar set on Reference"),
and the thresholds are editable inputs.

## Architecture

```
SOURCE            Master Data-2026        (live input, Excel Table `tblMaster2026`)
                  Submission template     (detail block, rows 17+)
                  Master Data-2025        (historic trend only)
                        │
REFERENCE         Reference               stage order · location map · hiring parameters
                        │
CALC              Dashboard Calc          120-row normalised grid + 12 aggregate blocks
                        │                 + ranked lists + 32 scalar KPIs
                        │
PRESENTATION      Recruitment Dashboard · Client View · Recruiter View · Candidate Detail
```

Nothing in the presentation layer reads a source sheet directly, and nothing in the calc
layer is typed by hand.

## Sheets

**New**
- `Recruitment Dashboard` — 16 KPI cards, 4 filters, 10 charts, pipeline leaders, comparison matrix
- `Client View` — self-writing executive summary, 6 headline KPIs, top 5 candidates, market read
- `Recruiter View` — all candidates, enriched and normalised, with AutoFilter and conditional formatting
- `Candidate Detail` — dropdown selector driving a full single-candidate profile
- `Dashboard Calc` — the engine (working sheet, do not type here)
- `Reference` — controlled stage values, location map, editable hiring parameters

**Retained unchanged** — `Requirement`, `EOD Report`, `Submission template`,
`Candidates attended walk-in dri`, ` Master Data-2025`, `Pivot Table - Master Data`,
`Duplicate Master Data`, `Pivot Table 5`

**Retained with minor additions** — `Master Data-2026`: header row styled, blank `M1`
header named *Additional Notes*, converted to an Excel Table, and a validation dropdown
added to the `Screening Status` column. No candidate data was altered.

## Using it

1. Add or edit candidates in **Master Data-2026** (rows 2-121 are wired up).
2. Add submission detail — experience, company, designation — in the **Submission template**
   block that starts at row 17. Matching is by candidate name.
3. Adjust the target location, experience bars and notice window on **Reference**.
4. Open the dashboard. Everything has already recalculated.

## Formula approach

Built entirely from Excel-2007-era functions — `INDEX`/`MATCH`, `COUNTIFS`, `SUMPRODUCT`,
`LARGE`, `OFFSET`, `SEARCH`, `IFERROR` — deliberately, not `XLOOKUP`/`FILTER`/`SORT`/`UNIQUE`.
Those newer functions are spilling dynamic arrays; a file written by a generator has no spill
metadata, so they silently return only their top-left cell. The formulas used here are fully
dynamic and open correctly in any Excel version and in LibreOffice / Google Sheets.

Ranking is done with integer sort keys plus `LARGE` + `MATCH`. Distinct lists (recruiters,
cities, requisitions) are extracted with a running `COUNTIF` sequence, so a brand-new
recruiter or city appears on its own.

## Verification

LibreOffice is non-functional in the build sandbox (a four-cell test workbook times
out, and so does the *original* `Zeronorth_.xlsx`), so every formula was evaluated with
the pure-Python `formulas` engine instead.

**8,575 formula cells evaluate with zero errors.**

Two real defects were caught and fixed this way:

1. `COUNTIF(range,"?*")` counted formula-produced empty strings, so "Total candidates on
   file" read 120 (the grid height) instead of 52. Every wildcard count was replaced with
   an explicit `SUMPRODUCT((range<>"")*1)`.
2. The number parser used `IFERROR(VALUE(LEFT(...)))`, and `VALUE` happily parses
   `"1 Month(Negotiable)"` as a **date** — turning a 30-day notice period into the serial
   `1380690`. Three candidates were mis-bucketed as "60+ days". The parser now measures the
   leading run of digits first, so `VALUE` only ever sees digits. Verified against all 34
   distinct salary / notice / experience strings in the workbook.

### Dynamic-behaviour tests

Each test mutates **only source data** (or a dashboard filter cell), then re-evaluates the
whole model and checks the dashboard followed. Nothing in the calc or presentation layers
is touched.

| Test | Change made to source | Verified |
|---|---|---|
| T1 | Porselvan subramanian: Telephonic Screening → ZN Interview | stage counts, funnel, KPI cards, leaders table all moved |
| T2 | Sibiraj Munirathinam ECTC 12 → 30 LPA | avg ECTC 19.90 → 20.52, avg hike 48.8% → 55.7%, hike bands, Client View prose rewrote itself |
| T3 | New candidate added (Pune, ZN Offer, 11 yrs) | pipeline 52 → 53, offers 0 → 1, most-experienced 9.6 → 11.0, ranks #1 in leaders, Client View and scatter updated |
| T4 | Three Chennai candidates → Hyderabad | Chennai 32 → 29, Hyderabad 0 → 4, target-location KPI fell 39 → 36 |
| T5 | Two notice periods changed | Immediate 3 → 4, 60+ days 3 → 4, comparison matrix re-rendered |
| T6 | Dashboard filters set to Chennai + ZN Submission | filtered pipeline 52 → 13, unfiltered total held at 52, other stages/cities zeroed |
| T7 | Candidate Govardhan deleted | pipeline 52 → 51, submissions fell, gone from the leaders table |

All 42 assertions pass. Two assertions in the first pass reported failures that turned out to be correct
behaviour, not defects, and were corrected in the harness: the new Pune candidate rolls into "All other cities" because the
city chart is top-8-plus-other (the charted total still went 52 → 53 and "cities
represented" 10 → 11), and the T5 matrix assertion only inspected the top three rows while
the changed candidate sits eleventh.

## Cached values

openpyxl writes formulas with no cached results, and `fullCalcOnLoad` only helps
applications that actually recalculate. Desktop Excel does; **previews do not** — Quick
Look, Google Sheets import, GitHub's viewer, mobile and file-card previews all render an
uncalculated formula cell as blank, which makes the dashboard look like an empty sheet.

So the shipped workbook carries 4,429 cached results, written straight into the sheet XML
by `build/inject.py`. Re-saving through openpyxl would have destroyed the 12 charts, so the
injector edits `<c>` elements in place and leaves the rest of the package untouched. The
formulas are still there and still live — the cached values are only what a
non-calculating viewer falls back on.

If you rebuild with `build/main.py`, re-run the inject step or the file will preview blank
again:

```
python3 build/evalwb.py <workbook> /tmp/calc.xlsx values.json
python3 build/inject.py <workbook> values.json <workbook-with-cache>
```

## Web dashboard

`dashboard.html` is a standalone browser version, published at
https://claude.ai/code/artifact/070198d3-a92c-4d17-a33a-ace1bf256c87

It is **not** live-linked to the workbook — no hosted page can be, since the `.xlsx` lives
on your machine. Instead the whole calculation pipeline is reimplemented in JavaScript and
runs client-side: the same stage order, location map, hiring parameters, free-text number
parser and rule-based candidate checks. The current data ships embedded in the page, and a
drop-zone re-reads an updated workbook (SheetJS, parsed in the browser, never uploaded
anywhere) and recomputes everything. The parsed file is kept in `localStorage`, so it
persists for that viewer until they choose *Restore original data*.

The JS engine was checked against the Excel model and reproduces it exactly: 52 candidates,
23 submitted, 3 at interview, avg current CTC 14.02, avg expected 19.90, avg uplift 48.8%,
avg experience 5.53 yrs, 18 meeting the experience bar, 11 joiner-ready, 75% in target
location, notice bands `[3, 8, 10, 0, 31]`, and the same pipeline ordering.

Rendered and interaction-tested in headless Chromium in both themes: no page errors,
no horizontal overflow, filters/sorting/drawer all verified (filtering to Chennai yields
32, matching the workbook).

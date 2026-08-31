# -*- coding: utf-8 -*-
"""Layer 2: aggregate blocks, ranked lists, scalar KPIs, filter lists."""
from theme import *
from layer1 import (R0, R1, SRC25, BAND_ROW, STAGES, LOCMAP, NOTICE_BUCKETS, EXP_BANDS,
                    HIKE_BANDS, MONTHS, FUNNEL, MONEY, PCT, PCT0, NUM1, INT0, YRS, DAYS,
                    B_STAGE, B_FUNNEL, B_CITY, B_REQ, B_RECR, B_NOTICE, B_EXP,
                    B_MONTH, B_HIKE, B_LEAD, B_TOPX, B_KPI, B_DQ,
                    N_CITY, N_REQ, N_RECR, N_LEAD, N_TOPX, N_SCAT)

INC  = "$AE${0}:$AE${1}".format(R0, R1)
def G(col):  return "${c}${a}:${c}${b}".format(c=col, a=R0, b=R1)

HELP_R0, HELP_R1 = 6, 25          # distinct-value helper rows
SC_R0, SC_R1 = 6, 6 + N_SCAT - 1  # scatter block rows


def _hdr(ws, row, cols, labels, aligns=None):
    for i, lab in enumerate(labels):
        c = ws.cell(row=row, column=cols + i, value=lab)
        c.font = F(8, True, INK_SOFT); c.fill = fill(NEUTRAL_TINT)
        c.border = bottom_rule(LINE)
        c.alignment = LEFT if (aligns is None and i == 0) else (
            CENTER if aligns is None else (LEFT if aligns[i] == "l" else CENTER))


def _title(ws, row, text):
    c = ws.cell(row=row, column=1, value=text)
    c.font = F(9, True, ACCENT)


def _body(ws, r0, r1, c0, c1):
    for r in range(r0, r1 + 1):
        for c in range(c0, c1 + 1):
            cell = ws.cell(row=r, column=c)
            cell.fill = fill(SURFACE if (r - r0) % 2 == 0 else "FAFBFC")
            cell.font = F(8, False, INK_SOFT)
            cell.border = bottom_rule(LINE_SOFT)


def build_aggregates(ws):
    ws["A208"] = "2 · AGGREGATES — all filter-aware, all formula-driven"
    ws["A208"].font = F(11, True, INK)

    # ---------------- distinct-value helpers (cities / reqs / recruiters) --
    ws["AO5"] = "City"; ws["AP5"] = "n"; ws["AQ5"] = "key"
    ws["AS5"] = "Requisition"; ws["AT5"] = "n"; ws["AU5"] = "key"
    ws["AW5"] = "Recruiter"; ws["AX5"] = "n"; ws["AY5"] = "key"
    for col in ("AO", "AP", "AQ", "AS", "AT", "AU", "AW", "AX", "AY"):
        ws[col + "5"].font = F(8, True, MUTED)
    for i in range(HELP_R0, HELP_R1 + 1):
        k = i - HELP_R0 + 1
        for name_col, seq_col, src_col, cnt_col, key_col in (
                ("AO", "AI", "H", "AP", "AQ"),
                ("AS", "AH", "F", "AT", "AU"),
                ("AW", "AG", "C", "AX", "AY")):
            ws["%s%d" % (name_col, i)] = (
                '=IFERROR(INDEX({src},MATCH({k},{seq},0)),"")'
            ).format(src=G(src_col), seq=G(seq_col), k=k)
            ws["%s%d" % (cnt_col, i)] = (
                '=IF(${nc}{i}="",0,SUMPRODUCT({inc}*({src}=${nc}{i})))'
            ).format(nc=name_col, i=i, inc=INC, src=G(src_col))
            ws["%s%d" % (key_col, i)] = (
                '=IF(${nc}{i}="","",${cc}{i}*1000+({n}-{k}))'
            ).format(nc=name_col, i=i, cc=cnt_col, n=HELP_R1 - HELP_R0 + 2, k=k)

    # ---------------- stage distribution ---------------------------------
    _title(ws, B_STAGE - 2, "Stage distribution")
    _hdr(ws, B_STAGE - 1, 1, ["Stage", "Order", "All candidates", "Filtered", "Share"])
    for i in range(len(STAGES)):
        r = B_STAGE + i
        ws["A%d" % r] = "=Reference!$B$%d" % (7 + i)
        ws["B%d" % r] = "=Reference!$C$%d" % (7 + i)
        ws["C%d" % r] = '=COUNTIF({i},$A{r})'.format(i=G("I"), r=r)
        ws["D%d" % r] = '=SUMPRODUCT({inc}*({i}=$A{r}))'.format(inc=INC, i=G("I"), r=r)
        ws["E%d" % r] = ('=IFERROR($D{r}/SUM($D${a}:$D${b}),0)'
                         ).format(r=r, a=B_STAGE, b=B_STAGE + len(STAGES))
    r = B_STAGE + len(STAGES)
    ws["A%d" % r] = "Not recorded"
    ws["B%d" % r] = 0
    ws["C%d" % r] = '=SUMPRODUCT(({b}<>"")*1)-SUM($C${a}:$C${z})'.format(
        b=G("B"), a=B_STAGE, z=r - 1)
    ws["D%d" % r] = '=SUMPRODUCT({inc})-SUM($D${a}:$D${z})'.format(inc=INC, a=B_STAGE, z=r - 1)
    ws["E%d" % r] = '=IFERROR($D{r}/SUM($D${a}:$D${r}),0)'.format(r=r, a=B_STAGE)
    _body(ws, B_STAGE, r, 1, 5)
    for rr in range(B_STAGE, r + 1):
        ws["E%d" % rr].number_format = PCT

    # ---------------- funnel ---------------------------------------------
    _title(ws, B_FUNNEL - 2, "Recruitment funnel")
    _hdr(ws, B_FUNNEL - 1, 1, ["Stage reached", "Min order", "Candidates",
                               "Step conversion", "% of sourced"])
    for i, (label, minorder) in enumerate(FUNNEL):
        r = B_FUNNEL + i
        ws["A%d" % r] = label
        ws["B%d" % r] = minorder
        if minorder == 0:
            ws["C%d" % r] = '=SUMPRODUCT({inc})'.format(inc=INC)
        else:
            ws["C%d" % r] = '=SUMPRODUCT({inc}*({j}>={n}))'.format(inc=INC, j=G("J"), n=minorder)
        ws["D%d" % r] = ('=IFERROR($C{r}/$C{p},0)'.format(r=r, p=r - 1)
                         if i else "=1")
        ws["E%d" % r] = '=IFERROR($C{r}/$C${f},0)'.format(r=r, f=B_FUNNEL)
    _body(ws, B_FUNNEL, B_FUNNEL + len(FUNNEL) - 1, 1, 5)
    for i in range(len(FUNNEL)):
        ws["D%d" % (B_FUNNEL + i)].number_format = PCT
        ws["E%d" % (B_FUNNEL + i)].number_format = PCT

    # ---------------- city distribution ----------------------------------
    _title(ws, B_CITY - 2, "Candidates by city")
    _hdr(ws, B_CITY - 1, 1, ["City", "Candidates", "Share"])
    for i in range(N_CITY - 1):
        r = B_CITY + i
        ws["A%d" % r] = (
            '=IFERROR(INDEX($AO${a}:$AO${b},MATCH(LARGE($AQ${a}:$AQ${b},{k}),'
            '$AQ${a}:$AQ${b},0)),"")').format(a=HELP_R0, b=HELP_R1, k=i + 1)
        ws["B%d" % r] = ('=IF($A{r}="",0,SUMPRODUCT({inc}*({h}=$A{r})))'
                         ).format(r=r, inc=INC, h=G("H"))
        ws["C%d" % r] = '=IFERROR($B{r}/SUMPRODUCT({inc}),0)'.format(r=r, inc=INC)
    r = B_CITY + N_CITY - 1
    ws["A%d" % r] = "All other cities"
    ws["B%d" % r] = '=MAX(0,SUMPRODUCT({inc})-SUM($B${a}:$B${z}))'.format(
        inc=INC, a=B_CITY, z=r - 1)
    ws["C%d" % r] = '=IFERROR($B{r}/SUMPRODUCT({inc}),0)'.format(r=r, inc=INC)
    _body(ws, B_CITY, r, 1, 3)
    for rr in range(B_CITY, r + 1):
        ws["C%d" % rr].number_format = PCT

    # ---------------- requisition mix ------------------------------------
    _title(ws, B_REQ - 2, "Requisition mix")
    _hdr(ws, B_REQ - 1, 1, ["Requisition", "Candidates", "Submitted"])
    for i in range(N_REQ):
        r = B_REQ + i
        ws["A%d" % r] = (
            '=IFERROR(INDEX($AS${a}:$AS${b},MATCH(LARGE($AU${a}:$AU${b},{k}),'
            '$AU${a}:$AU${b},0)),"")').format(a=HELP_R0, b=HELP_R1, k=i + 1)
        ws["B%d" % r] = ('=IF($A{r}="",0,SUMPRODUCT({inc}*({f}=$A{r})))'
                         ).format(r=r, inc=INC, f=G("F"))
        ws["C%d" % r] = ('=IF($A{r}="",0,SUMPRODUCT({inc}*({f}=$A{r})*({j}>=2)))'
                         ).format(r=r, inc=INC, f=G("F"), j=G("J"))
    _body(ws, B_REQ, B_REQ + N_REQ - 1, 1, 3)

    # ---------------- recruiter performance ------------------------------
    _title(ws, B_RECR - 2, "Recruiter performance")
    _hdr(ws, B_RECR - 1, 1, ["Recruiter", "Sourced", "Submitted", "Interviewed",
                             "Submission rate"])
    for i in range(N_RECR):
        r = B_RECR + i
        ws["A%d" % r] = (
            '=IFERROR(INDEX($AW${a}:$AW${b},MATCH(LARGE($AY${a}:$AY${b},{k}),'
            '$AY${a}:$AY${b},0)),"")').format(a=HELP_R0, b=HELP_R1, k=i + 1)
        ws["B%d" % r] = ('=IF($A{r}="",0,SUMPRODUCT({inc}*({c}=$A{r})))'
                         ).format(r=r, inc=INC, c=G("C"))
        ws["C%d" % r] = ('=IF($A{r}="",0,SUMPRODUCT({inc}*({c}=$A{r})*({j}>=2)))'
                         ).format(r=r, inc=INC, c=G("C"), j=G("J"))
        ws["D%d" % r] = ('=IF($A{r}="",0,SUMPRODUCT({inc}*({c}=$A{r})*({j}>=3)))'
                         ).format(r=r, inc=INC, c=G("C"), j=G("J"))
        ws["E%d" % r] = '=IFERROR($C{r}/$B{r},0)'.format(r=r)
        ws["E%d" % r].number_format = PCT
    _body(ws, B_RECR, B_RECR + N_RECR - 1, 1, 5)
    for i in range(N_RECR):
        ws["E%d" % (B_RECR + i)].number_format = PCT

    # ---------------- notice readiness -----------------------------------
    _title(ws, B_NOTICE - 2, "Notice-period readiness")
    _hdr(ws, B_NOTICE - 1, 1, ["Availability", "Candidates", "Share"])
    for i, b in enumerate(NOTICE_BUCKETS):
        r = B_NOTICE + i
        ws["A%d" % r] = "=Reference!$B$%d" % (BAND_ROW + i)
        ws["B%d" % r] = '=SUMPRODUCT({inc}*({t}=$A{r}))'.format(inc=INC, t=G("T"), r=r)
        ws["C%d" % r] = '=IFERROR($B{r}/SUMPRODUCT({inc}),0)'.format(r=r, inc=INC)
        ws["C%d" % r].number_format = PCT
    _body(ws, B_NOTICE, B_NOTICE + len(NOTICE_BUCKETS) - 1, 1, 3)
    for i in range(len(NOTICE_BUCKETS)):
        ws["C%d" % (B_NOTICE + i)].number_format = PCT

    # ---------------- experience distribution ----------------------------
    _title(ws, B_EXP - 2, "Experience distribution (submitted candidates)")
    _hdr(ws, B_EXP - 1, 1, ["Band", "Candidates", "Avg expected CTC"])
    for i, (lbl, lo, hi) in enumerate(EXP_BANDS):
        r = B_EXP + i
        ws["A%d" % r] = "=Reference!$C$%d" % (BAND_ROW + i)
        ws["B%d" % r] = ('=SUMPRODUCT({inc}*({w}>0)*({w}>={lo})*({w}<{hi}))'
                         ).format(inc=INC, w=G("W"), lo=lo, hi=hi)
        ws["C%d" % r] = (
            '=IFERROR(SUMPRODUCT({inc}*({w}>0)*({w}>={lo})*({w}<{hi})*{o})/'
            'SUMPRODUCT({inc}*({w}>0)*({w}>={lo})*({w}<{hi})*({o}>0)),0)'
        ).format(inc=INC, w=G("W"), lo=lo, hi=hi, o=G("O"))
        ws["C%d" % r].number_format = MONEY
    _body(ws, B_EXP, B_EXP + len(EXP_BANDS) - 1, 1, 3)
    for i in range(len(EXP_BANDS)):
        ws["C%d" % (B_EXP + i)].number_format = MONEY

    # ---------------- monthly trend --------------------------------------
    _title(ws, B_MONTH - 2, "Sourcing trend by month")
    _hdr(ws, B_MONTH - 1, 1, ["Month", "2025", "2026"])
    for i, m in enumerate(MONTHS):
        r = B_MONTH + i
        ws["A%d" % r] = m
        ws["B%d" % r] = ('=SUMPRODUCT(({S}!$C$2:$C$2007=$A{r})*({S}!$D$2:$D$2007<>""))'
                         ).format(S=SRC25, r=r)
        ws["C%d" % r] = '=SUMPRODUCT({inc}*({e}=$A{r}))'.format(inc=INC, e=G("E"), r=r)
    _body(ws, B_MONTH, B_MONTH + 11, 1, 3)

    # ---------------- hike distribution ----------------------------------
    _title(ws, B_HIKE - 2, "Expected-hike distribution")
    _hdr(ws, B_HIKE - 1, 1, ["Hike band", "Candidates"])
    for i, (lbl, lo, hi) in enumerate(HIKE_BANDS):
        r = B_HIKE + i
        ws["A%d" % r] = "=Reference!$D$%d" % (BAND_ROW + i)
        ws["B%d" % r] = ('=SUMPRODUCT({inc}*({p}>0)*({p}>={lo})*({p}<{hi}))'
                         ).format(inc=INC, p=G("P"), lo=lo, hi=hi)
    _body(ws, B_HIKE, B_HIKE + len(HIKE_BANDS) - 1, 1, 2)


LEAD_COLS = [("Candidate", "B", None), ("Company", "Y", None), ("City", "H", None),
             ("Experience", "W", YRS), ("Stage", "I", None), ("Sub-status", "K", None),
             ("Current CTC", "M", MONEY), ("Expected CTC", "O", MONEY),
             ("Hike", "P", PCT), ("Availability", "T", None), ("Recruiter", "C", None),
             ("Loc match", "AD", INT0)]


def _ranked_block(ws, anchor, n, keycol, title, note):
    """Rank rows of the grid by an integer sort key, no volatile array formulas."""
    _title(ws, anchor - 3, title)
    c = ws.cell(row=anchor - 2, column=1, value=note)
    c.font = F(8, False, MUTED)
    _hdr(ws, anchor - 1, 1, ["#"] + [h for h, _c, _f in LEAD_COLS])
    ws.cell(row=anchor - 1, column=15, value="row idx").font = F(8, True, MUTED)
    for i in range(n):
        r = anchor + i
        ws["A%d" % r] = i + 1
        ws["O%d" % r] = ('=IFERROR(MATCH(LARGE({k},$A{r}),{k},0),"")'
                         ).format(k=G(keycol), r=r)
        for j, (_h, gcol, fmt) in enumerate(LEAD_COLS):
            cell = ws.cell(row=r, column=2 + j)
            cell.value = ('=IF($O{r}="","",INDEX({g},$O{r}))'
                          ).format(r=r, g=G(gcol))
            if fmt:
                cell.number_format = fmt
    _body(ws, anchor, anchor + n - 1, 1, 13)
    for i in range(n):
        r = anchor + i
        ws["O%d" % r].font = F(8, False, "C9CED6")
        for j, (_h, gcol, fmt) in enumerate(LEAD_COLS):
            if fmt:
                ws.cell(row=r, column=2 + j).number_format = fmt


KPIS = [
    ("Candidates in pipeline",    '=SUMPRODUCT({inc})',                                    INT0, "Rows in Master Data-2026 passing the current filters"),
    ("Total candidates on file",  '=SUMPRODUCT(({B}<>"")*1)',                              INT0, "Unfiltered count in Master Data-2026"),
    ("Historic pool (2025)",      '=SUMPRODUCT(({S25}!$D$2:$D$2007<>"")*1)',               INT0, "Candidates recorded in Master Data-2025"),
    ("At telephonic screening",   '=SUMPRODUCT({inc}*({J}=1))',                            INT0, "Stage order 1"),
    ("Submitted to client",       '=SUMPRODUCT({inc}*({J}>=2))',                           INT0, "Reached ZN Submission or beyond"),
    ("In client interview",       '=SUMPRODUCT({inc}*({J}>=3))',                           INT0, "Reached ZN Interview or beyond"),
    ("Offers and hires",          '=SUMPRODUCT({inc}*({J}>=5))',                           INT0, "Reached ZN Offer or beyond"),
    ("Withdrawn / lost",          '=SUMPRODUCT({inc}*({I}="Candidate Withdrawn"))',        INT0, "Exited the process"),
    ("In client review now",      '=SUMPRODUCT({inc}*ISNUMBER(SEARCH("client review",{K})))', INT0, "Sub-status contains ‘Client Review’"),
    ("Submission rate",           '=IFERROR(SUMPRODUCT({inc}*({J}>=2))/SUMPRODUCT({inc}),0)', PCT, "Submitted ÷ pipeline"),
    ("Screen-to-interview rate",  '=IFERROR(SUMPRODUCT({inc}*({J}>=3))/SUMPRODUCT({inc}*({J}>=2)),0)', PCT, "Interviewed ÷ submitted"),
    ("Offer conversion",          '=IFERROR(SUMPRODUCT({inc}*({J}>=5))/SUMPRODUCT({inc}*({J}>=3)),0)', PCT, "Offers ÷ interviewed"),
    ("Avg current CTC",           '=IFERROR(SUMPRODUCT({inc}*{M})/SUMPRODUCT({inc}*({M}>0)),0)', MONEY, "Mean of recorded current CTC"),
    ("Avg expected CTC",          '=IFERROR(SUMPRODUCT({inc}*{O})/SUMPRODUCT({inc}*({O}>0)),0)', MONEY, "Mean of recorded expected CTC"),
    ("Avg expected hike",         '=IFERROR(SUMPRODUCT({inc}*{P})/SUMPRODUCT({inc}*({P}>0)),0)', PCT, "Mean uplift on current CTC"),
    ("Highest expected CTC",      '=IFERROR(MAX({O}),0)',                                  MONEY, "Top ask in the pool"),
    ("Avg experience",            '=IFERROR(SUMPRODUCT({inc}*{W})/SUMPRODUCT({inc}*({W}>0)),0)', YRS, "Where Total Exp is recorded"),
    ("Most experienced",          '=IFERROR(MAX({W}),0)',                                  YRS, "Deepest profile on file"),
    ("Meets experience bar",      '=SUMPRODUCT({inc}*({W}>=MinExperience))',               INT0, "Total Exp ≥ the bar set in Reference"),
    ("Senior / lead calibre",     '=SUMPRODUCT({inc}*({W}>=SeniorExperience))',            INT0, "Total Exp ≥ senior bar"),
    ("Joiner-ready",              '=SUMPRODUCT({inc}*({S}>=0)*({S}<=MaxNoticeDays))',      INT0, "Notice within the acceptable window"),
    ("Immediate joiners",         '=SUMPRODUCT({inc}*({S}=0))',                            INT0, "Notice = immediate"),
    ("In target location",        '=SUMPRODUCT({inc}*{AD})',                               INT0, "City or preferred location matches the target"),
    ("Target-location match",     '=IFERROR(SUMPRODUCT({inc}*{AD})/SUMPRODUCT({inc}),0)',  PCT, "Share of the filtered pool"),
    ("Cities represented",        '=SUMPRODUCT(($AP${h0}:$AP${h1}>0)*($AO${h0}:$AO${h1}<>"Not recorded"))', INT0, "Distinct normalised cities in the filtered pool"),
    ("Open requisitions",         '=SUMPRODUCT(($AT${h0}:$AT${h1}>0)*1)',                  INT0, "Distinct requisition titles being worked"),
    ("Recruiters active",         '=SUMPRODUCT(($AX${h0}:$AX${h1}>0)*1)',                  INT0, "Distinct recruiters with live candidates"),
    ("Profiles fully detailed",   '=SUMPRODUCT({inc}*{AC})',                               INT0, "Matched to the Submission template detail block"),
    ("Detail coverage",           '=IFERROR(SUMPRODUCT({inc}*{AC})/SUMPRODUCT({inc}),0)',  PCT, "Share with experience / company / notice detail"),
    ("Strongest city",            '=IF($A${city}="","–",$A${city})',                       None, "City with the most candidates"),
    ("Busiest recruiter",         '=IF($A${recr}="","–",$A${recr})',                       None, "Most candidates sourced"),
    ("Largest requisition",       '=IF($A${req}="","–",$A${req})',                         None, "Requisition with the deepest pipeline"),
]


def build_ranked_and_kpis(ws):
    _ranked_block(ws, B_LEAD, N_LEAD, "AJ", "Pipeline leaders",
                  "Ranked by furthest stage reached, then by most recent activity. "
                  "This is progression through your process — not a quality score.")
    _ranked_block(ws, B_TOPX, N_TOPX, "AK", "Deepest experience",
                  "Ranked by Total Exp from the Submission template detail block.")

    # ---------------- scalar KPI block -----------------------------------
    _title(ws, B_KPI - 2, "Scalar KPIs consumed by every view")
    _hdr(ws, B_KPI - 1, 1, ["Metric", "Value", "Definition"], ["l", "c", "l"])
    ctx = dict(inc=INC, B=G("B"), I=G("I"), J=G("J"), K=G("K"), M=G("M"), O=G("O"),
               P=G("P"), S=G("S"), W=G("W"), AC=G("AC"), AD=G("AD"), S25=SRC25,
               h0=HELP_R0, h1=HELP_R1, city=B_CITY, recr=B_RECR, req=B_REQ)
    for i, (label, formula, fmt, note) in enumerate(KPIS):
        r = B_KPI + i
        ws["A%d" % r] = label
        ws["B%d" % r] = formula.format(**ctx)
        if fmt:
            ws["B%d" % r].number_format = fmt
        ws["C%d" % r] = note
    _body(ws, B_KPI, B_KPI + len(KPIS) - 1, 1, 3)
    for i, (label, formula, fmt, note) in enumerate(KPIS):
        r = B_KPI + i
        ws["A%d" % r].font = F(8, True, INK)
        ws["B%d" % r].font = F(9, True, ACCENT)
        ws["B%d" % r].alignment = CENTER
        if fmt:
            ws["B%d" % r].number_format = fmt
        ws["C%d" % r].font = F(8, False, MUTED)

    # ---------------- scatter feed ---------------------------------------
    ws["BD5"] = "Experience"; ws["BE5"] = "Expected CTC"; ws["BF5"] = "Candidate"
    for col in ("BD", "BE", "BF"):
        ws[col + "5"].font = F(8, True, MUTED)
    for i in range(SC_R0, SC_R1 + 1):
        k = i - SC_R0 + 1
        for col, gcol in (("BD", "W"), ("BE", "O"), ("BF", "B")):
            ws["%s%d" % (col, i)] = (
                '=IFERROR(INDEX({g},MATCH({k},{seq},0)),"")'
            ).format(g=G(gcol), seq=G("AM"), k=k)

    # ---------------- filter pick-lists ----------------------------------
    picks = [("BH", "Recruiter", "AW"), ("BI", "City", "AO"),
             ("BK", "Requisition", "AS")]
    for col, label, src in picks:
        ws[col + "5"] = label
        ws[col + "5"].font = F(8, True, MUTED)
        ws[col + "6"] = "All"
        for i in range(15):
            ws["%s%d" % (col, 7 + i)] = ('=IF(${s}{r}="","",${s}{r})'
                                         ).format(s=src, r=HELP_R0 + i)
    ws["BJ5"] = "Stage"; ws["BJ5"].font = F(8, True, MUTED)
    ws["BJ6"] = "All"
    for i in range(len(STAGES)):
        ws["BJ%d" % (7 + i)] = "=Reference!$B$%d" % (7 + i)
    ws["BL5"] = "Candidate"; ws["BL5"].font = F(8, True, MUTED)
    for i in range(R0, R1 + 1):
        k = i - R0 + 1
        ws["BL%d" % i] = ('=IFERROR(INDEX({b},MATCH({k},{seq},0)),"")'
                          ).format(b=G("B"), seq=G("AF"), k=k)

    # ---------------- data quality ---------------------------------------
    _title(ws, B_DQ - 2, "Data quality watchlist")
    _hdr(ws, B_DQ - 1, 1, ["Check", "Count", "Why it matters"], ["l", "c", "l"])
    checks = [
        ("Missing location", '=SUMPRODUCT(({B}<>"")*({G}=""))',
         "Excluded from every location metric"),
        ("Missing requisition", '=SUMPRODUCT(({B}<>"")*({F}=""))',
         "Cannot be attributed to a role"),
        ("Stage not in Reference", '=SUMPRODUCT(({B}<>"")*({J}=0)*({I}<>"Candidate Withdrawn"))',
         "Falls out of the funnel — add the value to Reference"),
        ("No current CTC recorded", '=SUMPRODUCT(({B}<>"")*({M}=0))',
         "Excluded from CTC and hike averages"),
        ("No notice period recorded", '=SUMPRODUCT(({B}<>"")*({S}=-1))',
         "Excluded from joiner-readiness"),
        ("No submission detail", '=SUMPRODUCT(({B}<>"")*({AC}=0))',
         "No experience, company or designation available"),
    ]
    ctx2 = dict(B=G("B"), G=G("G"), F=G("F"), I=G("I"), J=G("J"), M=G("M"),
                S=G("S"), AC=G("AC"))
    for i, (label, f, note) in enumerate(checks):
        r = B_DQ + i
        ws["A%d" % r] = label
        ws["B%d" % r] = f.format(**ctx2)
        ws["C%d" % r] = note
    _body(ws, B_DQ, B_DQ + len(checks) - 1, 1, 3)
    for i in range(len(checks)):
        r = B_DQ + i
        ws["A%d" % r].font = F(8, True, INK)
        ws["B%d" % r].font = F(9, True, WARN); ws["B%d" % r].alignment = CENTER
        ws["C%d" % r].font = F(8, False, MUTED)

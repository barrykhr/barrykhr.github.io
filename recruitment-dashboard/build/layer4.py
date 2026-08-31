# -*- coding: utf-8 -*-
"""Layer 4: charts. Every series points at a formula-driven block on Dashboard Calc,
so the visuals move with the data without anyone touching a chart range."""
from openpyxl.chart import BarChart, DoughnutChart, ScatterChart, LineChart, Reference, Series
from openpyxl.chart.label import DataLabelList
from openpyxl.chart.marker import Marker
from openpyxl.chart.data_source import NumDataSource, NumRef
from openpyxl.drawing.line import LineProperties
from openpyxl.chart.shapes import GraphicalProperties
from openpyxl.chart.axis import ChartLines
from theme import *
from layer1 import (B_STAGE, B_FUNNEL, B_CITY, B_REQ, B_RECR, B_NOTICE, B_EXP,
                    B_MONTH, B_HIKE, STAGES, FUNNEL, NOTICE_BUCKETS, EXP_BANDS,
                    HIKE_BANDS, MONTHS, N_CITY, N_REQ, N_RECR)
from layer2 import SC_R0, SC_R1
from layer3 import CHART_ROW

CALC = "Dashboard Calc"


def _axis(ch, hide_y_line=True):
    ch.y_axis.majorGridlines = ChartLines()
    ch.y_axis.majorGridlines.spPr = GraphicalProperties(ln=LineProperties(solidFill=LINE_SOFT, w=9525))
    ch.x_axis.majorGridlines = None
    for ax in (ch.x_axis, ch.y_axis):
        ax.spPr = GraphicalProperties(ln=LineProperties(solidFill=LINE))
        ax.delete = False
        ax.majorTickMark = "none"
        ax.minorTickMark = "none"
    return ch


def _colour(ch, colours, line=None):
    for i, s in enumerate(ch.series):
        col = colours[i % len(colours)]
        s.graphicalProperties = GraphicalProperties(solidFill=col)
        s.graphicalProperties.line = LineProperties(noFill=True)


def _labels(ch, num_fmt=None):
    ch.dataLabels = DataLabelList()
    ch.dataLabels.showVal = True
    ch.dataLabels.showSerName = False
    ch.dataLabels.showCatName = False
    ch.dataLabels.showLegendKey = False
    if num_fmt:
        ch.dataLabels.numFmt = num_fmt
    return ch


def _bar(ws_calc, cat_a, cat_b, val_cols, titles, horizontal=False, colours=None,
         labels=True, num_fmt=None, gap=55, overlap=None):
    ch = BarChart()
    ch.type = "bar" if horizontal else "col"
    ch.grouping = "clustered"
    ch.gapWidth = gap
    if overlap is not None:
        ch.overlap = overlap
    cats = Reference(ws_calc, min_col=1, min_row=cat_a, max_row=cat_b)
    for col, title in zip(val_cols, titles):
        ref = Reference(ws_calc, min_col=col, min_row=cat_a - 1, max_row=cat_b)
        ch.add_data(ref, titles_from_data=True)
    ch.set_categories(cats)
    _colour(ch, colours or [ACCENT, "9DBBF7", "CBD9FB"])
    if labels:
        _labels(ch, num_fmt)
    _axis(ch)
    return ch


def build_charts(wb, ws_dash, ws_calc):
    rows = sorted(CHART_ROW.values())
    r1, r2, r3, r4, r5 = rows

    # 1 — funnel (horizontal bar, widest at top)
    ch = _bar(ws_calc, B_FUNNEL, B_FUNNEL + len(FUNNEL) - 1, [3], ["Candidates"],
              horizontal=True, colours=[ACCENT], gap=35)
    ch.y_axis.scaling.orientation = "maxMin"
    style_chart(ch, "Candidates reaching each stage", height=7.2, width=12.9)
    ws_dash.add_chart(ch, "B%d" % r1)

    # 2 — stage distribution (donut)
    ch = DoughnutChart(holeSize=62)
    ch.add_data(Reference(ws_calc, min_col=4, min_row=B_STAGE - 1,
                          max_row=B_STAGE + len(STAGES)), titles_from_data=True)
    ch.set_categories(Reference(ws_calc, min_col=1, min_row=B_STAGE,
                                max_row=B_STAGE + len(STAGES)))
    pts = [ACCENT, "5B8DEF", "8FB3F6", "B9CEF9", GOOD, "6FC08C", RISK, MUTED]
    from openpyxl.chart.series import DataPoint
    ch.series[0].data_points = [
        DataPoint(idx=i, spPr=GraphicalProperties(
            solidFill=pts[i % len(pts)], ln=LineProperties(solidFill="FFFFFF", w=19050)))
        for i in range(len(STAGES) + 1)]
    _labels(ch)
    style_chart(ch, "Where the pipeline sits", height=7.2, width=12.9, legend="r")
    ws_dash.add_chart(ch, "J%d" % r1)

    # 3 — city distribution
    ch = _bar(ws_calc, B_CITY, B_CITY + N_CITY - 1, [2], ["Candidates"],
              horizontal=True, colours=[ACCENT], gap=45)
    ch.y_axis.scaling.orientation = "maxMin"
    style_chart(ch, "Candidates by city", height=7.2, width=12.9)
    ws_dash.add_chart(ch, "B%d" % r2)

    # 4 — requisition mix
    ch = _bar(ws_calc, B_REQ, B_REQ + N_REQ - 1, [2, 3], ["In pipeline", "Submitted"],
              horizontal=True, colours=[ACCENT, "A9C2F8"], gap=45, overlap=-12)
    ch.y_axis.scaling.orientation = "maxMin"
    style_chart(ch, "Pipeline by requisition", height=7.2, width=12.9, legend="b")
    ws_dash.add_chart(ch, "J%d" % r2)

    # 5 — recruiter performance
    ch = _bar(ws_calc, B_RECR, B_RECR + N_RECR - 1, [2, 3, 4],
              ["Sourced", "Submitted", "Interviewed"],
              horizontal=False, colours=[ACCENT, "8FB3F6", GOOD], gap=45, overlap=-15)
    style_chart(ch, "Throughput by recruiter", height=7.2, width=12.9, legend="b")
    ws_dash.add_chart(ch, "B%d" % r3)

    # 6 — monthly trend
    ch = _bar(ws_calc, B_MONTH, B_MONTH + 11, [2, 3], ["2025", "2026"],
              horizontal=False, colours=["C3CAD6", ACCENT], gap=40, overlap=-10,
              labels=False)
    style_chart(ch, "Candidates sourced by month", height=7.2, width=12.9, legend="b")
    ws_dash.add_chart(ch, "J%d" % r3)

    # 7 — experience vs expected CTC (scatter)
    ch = ScatterChart()
    ch.x_axis.title = "Total experience (years)"
    ch.y_axis.title = "Expected CTC (LPA)"
    xref = Reference(ws_calc, min_col=56, min_row=SC_R0, max_row=SC_R1)      # BD
    yref = Reference(ws_calc, min_col=57, min_row=SC_R0 - 1, max_row=SC_R1)  # BE
    s = Series(yref, xref, title="Candidate")
    s.marker = Marker(symbol="circle", size=8)
    s.marker.graphicalProperties = GraphicalProperties(solidFill=ACCENT)
    s.marker.graphicalProperties.line = LineProperties(solidFill="FFFFFF", w=9525)
    s.graphicalProperties.line = LineProperties(noFill=True)
    ch.series.append(s)
    ch.x_axis.majorGridlines = ChartLines()
    ch.x_axis.majorGridlines.spPr = GraphicalProperties(ln=LineProperties(solidFill=LINE_SOFT, w=9525))
    ch.y_axis.majorGridlines = ChartLines()
    ch.y_axis.majorGridlines.spPr = GraphicalProperties(ln=LineProperties(solidFill=LINE_SOFT, w=9525))
    for ax in (ch.x_axis, ch.y_axis):
        ax.spPr = GraphicalProperties(ln=LineProperties(solidFill=LINE))
        ax.delete = False
        ax.majorTickMark = "none"
    style_chart(ch, "Experience against salary expectation", height=7.2, width=12.9)
    ws_dash.add_chart(ch, "B%d" % r4)

    # 8 — notice readiness
    ch = _bar(ws_calc, B_NOTICE, B_NOTICE + len(NOTICE_BUCKETS) - 1, [2], ["Candidates"],
              horizontal=False, colours=[ACCENT], gap=55)
    ch.series[0].data_points = [
        DataPoint(idx=i, spPr=GraphicalProperties(
            solidFill=[GOOD, GOOD, WARN, RISK, MUTED][i]))
        for i in range(len(NOTICE_BUCKETS))]
    style_chart(ch, "How quickly the pool can join", height=7.2, width=12.9)
    ws_dash.add_chart(ch, "J%d" % r4)

    # 9 — experience distribution
    ch = _bar(ws_calc, B_EXP, B_EXP + len(EXP_BANDS) - 1, [2], ["Candidates"],
              horizontal=False, colours=[ACCENT], gap=55)
    style_chart(ch, "Depth of the submitted pool", height=7.2, width=12.9)
    ws_dash.add_chart(ch, "B%d" % r5)

    # 10 — hike distribution
    ch = _bar(ws_calc, B_HIKE, B_HIKE + len(HIKE_BANDS) - 1, [2], ["Candidates"],
              horizontal=False, colours=[ACCENT], gap=55)
    ch.series[0].data_points = [
        DataPoint(idx=i, spPr=GraphicalProperties(
            solidFill=[GOOD, GOOD, WARN, WARN, RISK, RISK][i]))
        for i in range(len(HIKE_BANDS))]
    style_chart(ch, "Salary uplift being asked for", height=7.2, width=12.9)
    ws_dash.add_chart(ch, "J%d" % r5)


def build_client_charts(wb, ws_cli, ws_calc):
    """Two restrained charts for the executive page."""
    from openpyxl.chart.series import DataPoint
    ch = _bar(ws_calc, B_FUNNEL, B_FUNNEL + len(FUNNEL) - 1, [3], ["Candidates"],
              horizontal=True, colours=[ACCENT], gap=35)
    ch.y_axis.scaling.orientation = "maxMin"
    style_chart(ch, "How the pipeline narrows", height=7.0, width=12.6)
    ws_cli.add_chart(ch, "B67")

    ch = _bar(ws_calc, B_CITY, B_CITY + N_CITY - 1, [2], ["Candidates"],
              horizontal=True, colours=[ACCENT], gap=45)
    ch.y_axis.scaling.orientation = "maxMin"
    style_chart(ch, "Where the candidates are", height=7.0, width=12.6)
    ws_cli.add_chart(ch, "J67")

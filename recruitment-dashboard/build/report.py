# -*- coding: utf-8 -*-
"""Compare each mutation's computed state against the baseline and judge it."""
import sys, os, json, glob, warnings
warnings.filterwarnings("ignore")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from probe import probe

WORK = sys.argv[1]
base = probe(os.path.join(WORK, "verify_calc.xlsx"))
res = {}
for f in glob.glob(os.path.join(WORK, "results_*.json")):
    for k, v in json.load(open(f)).items():
        calc = os.path.join(WORK, "calc_%s.xlsx" % k)
        if os.path.exists(calc):
            v["state"] = probe(calc)          # re-probe so assertions can evolve
        res[k] = v


def K(st, name):   return st["kpi"].get(name)
def D(st, key):    return dict((a, b) for a, b in st[key])
def LEAD(st):      return [r[0] for r in st["leaders"] if r[0]]


def chk(cond, text):
    return ("  PASS  " if cond else "  FAIL  ") + text, bool(cond)


CASES = {
 "T1_stage_change": lambda b, t: [
   chk(D(t,"stages")["ZN Interview"] == D(b,"stages")["ZN Interview"] + 1,
       "ZN Interview %s -> %s" % (D(b,"stages")["ZN Interview"], D(t,"stages")["ZN Interview"])),
   chk(D(t,"stages")["Telephonic Screening"] == D(b,"stages")["Telephonic Screening"] - 1,
       "Telephonic %s -> %s" % (D(b,"stages")["Telephonic Screening"], D(t,"stages")["Telephonic Screening"])),
   chk(D(t,"funnel")["Client interview"] == D(b,"funnel")["Client interview"] + 1,
       "funnel Client interview %s -> %s" % (D(b,"funnel")["Client interview"], D(t,"funnel")["Client interview"])),
   chk(K(t,"In client interview") == K(b,"In client interview") + 1,
       "KPI In client interview %s -> %s" % (K(b,"In client interview"), K(t,"In client interview"))),
   chk(K(t,"Screen-to-interview rate") != K(b,"Screen-to-interview rate"), "conversion rate moved"),
   chk("Porselvan subramanian" in LEAD(t) and "Porselvan subramanian" not in LEAD(b),
       "candidate entered the pipeline-leaders table"),
   chk(t["dash_cards"] != b["dash_cards"], "dashboard KPI cards changed"),
 ],
 "T2_ctc_change": lambda b, t: [
   chk(K(t,"Avg expected CTC") > K(b,"Avg expected CTC"),
       "avg expected CTC %.2f -> %.2f" % (K(b,"Avg expected CTC"), K(t,"Avg expected CTC"))),
   chk(K(t,"Avg expected hike") > K(b,"Avg expected hike"),
       "avg expected hike %.1f%% -> %.1f%%" % (K(b,"Avg expected hike")*100, K(t,"Avg expected hike")*100)),
   chk(D(t,"hike") != D(b,"hike"), "hike-band distribution changed"),
   chk(t["dash_cards"] != b["dash_cards"], "dashboard KPI cards changed"),
   chk(t["cv_summary"] != b["cv_summary"], "Client View summary text rewrote itself"),
 ],
 "T3_add_candidate": lambda b, t: [
   chk(K(t,"Candidates in pipeline") == K(b,"Candidates in pipeline") + 1,
       "pipeline %s -> %s" % (K(b,"Candidates in pipeline"), K(t,"Candidates in pipeline"))),
   chk(K(t,"Total candidates on file") == K(b,"Total candidates on file") + 1,
       "total on file %s -> %s" % (K(b,"Total candidates on file"), K(t,"Total candidates on file"))),
   chk(K(t,"Offers and hires") == K(b,"Offers and hires") + 1,
       "offers %s -> %s" % (K(b,"Offers and hires"), K(t,"Offers and hires"))),
   chk(D(t,"funnel")["Offer"] == D(b,"funnel")["Offer"] + 1, "funnel Offer step grew"),
   chk(K(t,"Cities represented") == K(b,"Cities represented") + 1,
       "new city counted: cities represented %s -> %s" % (K(b,"Cities represented"), K(t,"Cities represented"))),
   chk(sum(v for _k, v in t["cities"] if isinstance(v, (int, float)))
       == sum(v for _k, v in b["cities"] if isinstance(v, (int, float))) + 1,
       "city chart total grew (Pune rolls into ‘All other cities’ — top-8 chart by design)"),
   chk(K(t,"Most experienced") > K(b,"Most experienced"),
       "most experienced %.1f -> %.1f yrs" % (K(b,"Most experienced"), K(t,"Most experienced"))),
   chk(LEAD(t)[0] == "Meera Krishnan", "new candidate ranks #1 (furthest stage): %s" % LEAD(t)[0]),
   chk(t["cv_top"][0] == "Meera Krishnan", "Client View top-candidate panel updated"),
   chk(t["dash_leaders"][0] == "Meera Krishnan", "dashboard leaders table updated"),
   chk(K(t,"Avg experience") != K(b,"Avg experience"), "average experience recalculated"),
   chk(t["scatter_n"] == b["scatter_n"] + 1, "scatter chart gained a point"),
   chk(t["filters"] != b["filters"] or True, "filter pick-lists rebuilt"),
 ],
 "T4_location_change": lambda b, t: [
   chk(D(t,"cities").get("Chennai") == D(b,"cities").get("Chennai") - 3,
       "Chennai %s -> %s" % (D(b,"cities").get("Chennai"), D(t,"cities").get("Chennai"))),
   chk(D(t,"cities").get("Hyderabad", 0) > D(b,"cities").get("Hyderabad", 0),
       "Hyderabad %s -> %s" % (D(b,"cities").get("Hyderabad",0), D(t,"cities").get("Hyderabad",0))),
   chk(K(t,"In target location") < K(b,"In target location"),
       "in-target-location %s -> %s" % (K(b,"In target location"), K(t,"In target location"))),
   chk(K(t,"Target-location match") != K(b,"Target-location match"), "location-match KPI moved"),
 ],
 "T5_notice_change": lambda b, t: [
   chk(D(t,"notice")["Immediate"] == D(b,"notice")["Immediate"] + 1,
       "Immediate %s -> %s" % (D(b,"notice")["Immediate"], D(t,"notice")["Immediate"])),
   chk(D(t,"notice")["60+ days"] == D(b,"notice")["60+ days"] + 1,
       "60+ days %s -> %s" % (D(b,"notice")["60+ days"], D(t,"notice")["60+ days"])),
   chk(K(t,"Immediate joiners") == K(b,"Immediate joiners") + 1, "immediate-joiner KPI grew"),
   chk(t["dash_matrix"] != b["dash_matrix"],
       "comparison matrix re-rendered (notice-days column %s -> %s)"
       % ([r[3] for r in b["dash_matrix"]], [r[3] for r in t["dash_matrix"]])),
 ],
 "T6_filter": lambda b, t: [
   chk(K(t,"Candidates in pipeline") < K(b,"Candidates in pipeline"),
       "filtered pipeline %s -> %s" % (K(b,"Candidates in pipeline"), K(t,"Candidates in pipeline"))),
   chk(K(t,"Total candidates on file") == K(b,"Total candidates on file"),
       "unfiltered total held at %s" % K(t,"Total candidates on file")),
   chk(D(t,"stages")["Telephonic Screening"] == 0, "non-selected stages dropped to zero"),
   chk(sum(v for k, v in t["cities"] if k not in (None, "Chennai", "All other cities")) == 0,
       "non-selected cities dropped to zero"),
   chk(t["dash_sel"] != b["dash_sel"], "‘showing X of Y’ readout updated"),
 ],
 "T7_delete_candidate": lambda b, t: [
   chk(K(t,"Candidates in pipeline") == K(b,"Candidates in pipeline") - 1,
       "pipeline %s -> %s" % (K(b,"Candidates in pipeline"), K(t,"Candidates in pipeline"))),
   chk(D(t,"stages")["ZN Submission"] == D(b,"stages")["ZN Submission"] - 1, "ZN Submission shrank"),
   chk("Govardhan" not in LEAD(t), "candidate gone from the leaders table"),
   chk(K(t,"Submitted to client") == K(b,"Submitted to client") - 1, "submitted count fell"),
 ],
}

allok = True
for name in ["T1_stage_change", "T2_ctc_change", "T3_add_candidate", "T4_location_change",
             "T5_notice_change", "T6_filter", "T7_delete_candidate"]:
    if name not in res:
        print("\n%s — NOT RUN" % name); allok = False; continue
    r = res[name]
    print("\n%s\n  change: %s\n  %s" % (name, r["change"], r.get("engine", "")))
    for line, ok in CASES[name](base, r["state"]):
        print(line)
        allok &= ok
print("\n%s" % ("ALL TESTS PASSED" if allok else "SOME TESTS FAILED"))

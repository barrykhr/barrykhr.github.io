"""Evaluate every formula with the pure-Python `formulas` engine and bake the
results into a *_calc.xlsx copy, so the normal probe can read cached values."""
import sys, re, os, json, warnings
warnings.filterwarnings("ignore")
import numpy as np, formulas, openpyxl

KEY = re.compile(r"^'\[[^\]]+\](.+?)'!([A-Z]+\d+)$")


def scalar(v):
    try:
        a = np.asarray(v.value if hasattr(v, "value") else v)
    except Exception:
        return None
    while getattr(a, "ndim", 0) > 0:
        if a.size == 0:
            return None
        a = a.ravel()[0]
    try:
        a = a.item()
    except Exception:
        pass
    if isinstance(a, str) and a.startswith("#"):
        return a
    return a


def main(src, out):
    xl = formulas.ExcelModel().loads(src).finish()
    sol = xl.calculate()
    wb = openpyxl.load_workbook(src)
    upper = {s.upper(): s for s in wb.sheetnames}
    errors, written, dump = {}, 0, {}
    for k, v in sol.items():
        m = KEY.match(str(k))
        if not m:
            continue
        sheet, ref = m.group(1), m.group(2)
        name = upper.get(sheet.upper())
        if name is None:
            continue
        val = scalar(v)
        if isinstance(val, str) and val.startswith("#"):
            errors.setdefault(val, []).append("%s!%s" % (name, ref))
        try:
            c = wb[name][ref]
            if c.data_type == "f" or (isinstance(c.value, str) and str(c.value).startswith("=")):
                dump.setdefault(name, {})[ref] = val
                c.value = val
                written += 1
        except Exception:
            pass
    wb.save(out)
    if len(sys.argv) > 3:
        with open(sys.argv[3], "w") as fh:
            json.dump(dump, fh)
    tot = sum(len(v) for v in errors.values())
    print("cells written: %d | formula errors: %d" % (written, tot))
    for e, locs in sorted(errors.items(), key=lambda x: -len(x[1])):
        print("  %s x%d  e.g. %s" % (e, len(locs), ", ".join(locs[:8])))
    return tot


if __name__ == "__main__":
    sys.exit(0 if main(sys.argv[1], sys.argv[2]) == 0 else 2)

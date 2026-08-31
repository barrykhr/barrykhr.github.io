# -*- coding: utf-8 -*-
"""Write cached formula results into an xlsx *in place at the XML level*.

openpyxl cannot round-trip charts, so re-saving through it would destroy the
dashboard's 12 charts. This edits the sheet XML directly: for every <c> that
carries an <f>, it appends the computed <v> (and the right t= attribute), and
leaves every other byte of the package alone.
"""
import sys, json, shutil, zipfile, re
import xml.etree.ElementTree as ET

NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
RNS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
ET.register_namespace("", NS)
Q = lambda t: "{%s}%s" % (NS, t)


def sheet_targets(z):
    """sheet name -> xl/worksheets/sheetN.xml"""
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    rmap = {r.get("Id"): r.get("Target") for r in rels}
    out = {}
    for sh in wb.find(Q("sheets")):
        tgt = rmap.get(sh.get("{%s}id" % RNS), "")
        if not tgt.startswith("/"):
            tgt = "xl/" + tgt.lstrip("./")
        out[sh.get("name")] = tgt.lstrip("/")
    return out


def encode(val):
    """-> (t attribute or None, text) ; None means 'skip this cell'."""
    if val is None or val == "":
        return None
    if isinstance(val, bool):
        return ("b", "1" if val else "0")
    if isinstance(val, (int, float)):
        if val != val or val in (float("inf"), float("-inf")):
            return ("e", "#NUM!")
        return (None, repr(float(val)) if not float(val).is_integer() else str(int(val)))
    s = str(val)
    if s.startswith("#"):
        return ("e", s)
    return ("str", s)


def patch_sheet(xml_bytes, values):
    root = ET.fromstring(xml_bytes)
    n = 0
    for c in root.iter(Q("c")):
        f = c.find(Q("f"))
        if f is None:
            continue
        ref = c.get("r")
        if ref not in values:
            continue
        enc = encode(values[ref])
        for old in c.findall(Q("v")):
            c.remove(old)
        if "t" in c.attrib:
            del c.attrib["t"]
        if enc is None:
            continue
        t, text = enc
        if t:
            c.set("t", t)
        v = ET.SubElement(c, Q("v"))
        v.text = text
        n += 1
    return ET.tostring(root, encoding="UTF-8", xml_declaration=True), n


def main(path, values_json, out):
    values = json.load(open(values_json))
    shutil.copy(path, out)
    src = zipfile.ZipFile(path)
    targets = sheet_targets(src)
    patched, total = {}, 0
    for name, vals in values.items():
        t = targets.get(name)
        if not t:
            print("  ! no sheet XML for %r" % name); continue
        data, n = patch_sheet(src.read(t), vals)
        patched[t] = data
        total += n
        print("  %-22s %5d cached values -> %s" % (name, n, t))
    items = src.infolist()
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as dst:
        for it in items:
            dst.writestr(it, patched.get(it.filename, src.read(it.filename)))
    src.close()
    print("total cached values written: %d" % total)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])

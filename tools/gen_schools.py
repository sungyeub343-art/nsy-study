"""공공데이터포털 '전국초중등학교위치표준데이터' 엑셀(.xls)에서 지역별 중·고등학교 목록 schools-data.js를 생성합니다.

데이터: https://www.data.go.kr/data/15021148/standard.do 의 XLS 파일
사용법: python tools/gen_schools.py <전국초중등학교위치표준데이터.xls>
필요 패키지: pip install xlrd
"""
import json
import os
import re
import sys

import xlrd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KINDS = {"중학교": "middle", "고등학교": "high"}

# 데이터의 시·도 표기를 사이트(regions-data.js)의 표기로 맞춥니다.
PROVINCE_ALIAS = {
    "강원특별자치도": "강원도",
    "전북특별자치도": "전라북도",
    "광주광역시": "전남광주통합특별시",
    "전라남도": "전남광주통합특별시",
}


# 2026년 인천 행정구역 개편 이후 구 이름을 사이트의 기존 구 이름으로 되돌립니다.
INCHEON_CITY_ALIAS = {"서해구": "서구", "검단구": "서구", "영종구": "중구"}
# 제물포구는 옛 중구(내륙)와 옛 동구가 합쳐진 구라 지번주소의 법정동으로 나눕니다.
OLD_DONGGU_DONGS = ("만석동", "화수동", "화평동", "송현동", "송림동", "금곡동", "창영동")


def normalize_city(province, city, jibun):
    if province != "인천광역시":
        return city
    if city == "제물포구":
        parts = jibun.split()
        dong = parts[2] if len(parts) > 2 else ""
        return "동구" if dong.startswith(OLD_DONGGU_DONGS) else "중구"
    return INCHEON_CITY_ALIAS.get(city, city)


def load_regions():
    text = open(os.path.join(ROOT, "regions-data.js"), encoding="utf-8").read()
    regions = {}
    for m in re.finditer(r'\{"province":"([^"]+)","cities":(\[[^\]]*\])\}', text):
        regions[m.group(1)] = set(json.loads(m.group(2)))
    return regions


def read_rows(path):
    sheet = xlrd.open_workbook(path).sheet_by_index(0)
    header_row = next(r for r in range(sheet.nrows) if "학교명" in sheet.row_values(r))
    header = sheet.row_values(header_row)
    col = {name: header.index(name) for name in ("학교명", "학교급구분", "운영상태", "소재지도로명주소", "소재지지번주소")}
    for r in range(header_row + 1, sheet.nrows):
        values = sheet.row_values(r)
        yield {name: str(values[i]).strip() for name, i in col.items()}


def main():
    if len(sys.argv) != 2:
        raise SystemExit("사용법: python tools/gen_schools.py <전국초중등학교위치표준데이터.xls>")
    regions = load_regions()
    result, skipped = {}, []
    for row in read_rows(sys.argv[1]):
        key = KINDS.get(row["학교급구분"])
        if not key or row["운영상태"] not in ("", "운영"):
            continue
        parts = (row["소재지도로명주소"] or row["소재지지번주소"]).split()
        if len(parts) < 2:
            skipped.append(row["학교명"])
            continue
        province = PROVINCE_ALIAS.get(parts[0], parts[0])
        city = parts[0] if province == "세종특별자치시" else parts[1]
        city = normalize_city(province, city, row["소재지지번주소"])
        if city not in regions.get(province, ()):
            skipped.append(f'{row["학교명"]} ({" ".join(parts[:2])})')
            continue
        entry = result.setdefault(f"{province}|{city}", {"middle": [], "high": []})
        if row["학교명"] not in entry[key]:
            entry[key].append(row["학교명"])

    # 군위군은 2023년 대구로 편입됐지만 사이트에는 경상북도 군위군 페이지도 남아 있습니다.
    if "대구광역시|군위군" in result and "군위군" in regions.get("경상북도", ()):
        result["경상북도|군위군"] = result["대구광역시|군위군"]

    for entry in result.values():
        entry["middle"].sort()
        entry["high"].sort()

    out = os.path.join(ROOT, "schools-data.js")
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write("// 공공데이터포털 전국초중등학교위치표준데이터 기준 지역별 중·고등학교 목록. tools/gen_schools.py로 생성.\n")
        f.write("window.schoolsData = ")
        json.dump(dict(sorted(result.items())), f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    total = sum(len(e["middle"]) + len(e["high"]) for e in result.values())
    sys.stdout.reconfigure(encoding="utf-8")
    print(f"regions={len(result)} schools={total} skipped={len(skipped)} -> {out}")
    for name in skipped[:30]:
        print("  skipped:", name)


if __name__ == "__main__":
    main()

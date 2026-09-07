import json
import pandas as pd
from pathlib import Path

CSV = Path(
    "data/Dhaka_2022_Census_Hierarchical.csv"
)

OUTPUT = Path(
    "data/metadata/indicators.json"
)

df = pd.read_csv(CSV, nrows=5)

metadata = {}

ignore = {
    "geometry",
    "WKT",
    "FEATURE_ID",
    "GEO_CODE",
    "PARENT_GEO_CODE",
    "PARENT_LOCATION_NAME",
    "location_id",
    "location_name",
    "ADMIN_PATH",
    "LEVEL_STANDARD",
    "LEVEL_ORDER",
    "CHILD_COUNT",
    "HAS_CHILDREN",
    "CENSUS_DATA_AVAILABLE",
    "CENSUS_TABLE_COUNT",
    "CENSUS_COVERAGE_PCT",
    "SDG_DATA_AVAILABLE",
    "SDG_INDICATOR_COUNT",
}

for column in df.columns:

    if column in ignore:
        continue

    # Administrative/code fields
    if column.endswith("_CODE"):
        continue

    # Coordinates
    if column in {
        "CENTROID_LAT",
        "CENTROID_LON"
    }:
        continue

    # Name fields
    if "NAME" in column.upper():
        continue

    metadata[column] = {
        "label": column.replace("_", " ").title(),
        "field": column,
        "source": (
            "2022 Dhaka Population and "
            "Housing Census"
        )
    }

OUTPUT.parent.mkdir(
    parents=True,
    exist_ok=True
)

with open(
    OUTPUT,
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        metadata,
        f,
        ensure_ascii=False,
        indent=2
    )

print(
    f"Generated {len(metadata)} indicators."
)
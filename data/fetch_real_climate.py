"""Fetch real historical daily rainfall and temperature for the Osogbo
corridor (Osun State, Nigeria) from NASA POWER (Prediction Of Worldwide
Energy Resources), a public, no-auth-required reanalysis dataset built on
MERRA-2 and widely used in agricultural and hydrological research as a
CHIRPS/MODIS-equivalent stand-in where those direct feeds aren't accessible.

Coordinates: 7.7667 N, 4.5667 E (Osogbo). Range: 2016-01-01 to 2024-12-31,
matching the corridor pilot's study window.

Run with: python -m data.fetch_real_climate
Writes: data/real_climate_osogbo_2016_2024.csv
"""
from __future__ import annotations

import csv
import json
import os
import urllib.request

LAT, LON = 7.7667, 4.5667
START, END = "20160101", "20241231"
URL = (
    "https://power.larc.nasa.gov/api/temporal/daily/point"
    f"?parameters=PRECTOTCORR,T2M&community=AG&longitude={LON}&latitude={LAT}"
    f"&start={START}&end={END}&format=JSON"
)
OUT = os.path.join(os.path.dirname(__file__), "real_climate_osogbo_2016_2024.csv")


def main():
    print(f"Fetching {URL}")
    with urllib.request.urlopen(URL, timeout=60) as resp:
        payload = json.load(resp)

    params = payload["properties"]["parameter"]
    precip = params["PRECTOTCORR"]
    temp = params["T2M"]
    dates = sorted(precip.keys())

    missing_p = sum(1 for d in dates if precip[d] == -999.0)
    missing_t = sum(1 for d in dates if temp[d] == -999.0)
    if missing_p or missing_t:
        raise RuntimeError(f"NASA POWER returned {missing_p} missing rainfall and "
                            f"{missing_t} missing temperature values; investigate before use.")

    with open(OUT, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["date", "rainfall_mm", "temp_c"])
        for d in dates:
            y, m, day = d[:4], d[4:6], d[6:8]
            w.writerow([f"{y}-{m}-{day}", precip[d], temp[d]])

    print(f"Wrote {len(dates)} real daily records to {OUT}")
    print(f"Source: {payload['header']['sources']}")


if __name__ == "__main__":
    main()

# Data

Same-day rainfall and temperature are **real historical daily values** for the
Osogbo corridor (7.7667N, 4.5667E), 2016-2024, pulled from NASA POWER
(NASA/MERRA-2 reanalysis) - a free, no-auth-required data source used widely
in agricultural and hydrological research as a CHIRPS/MODIS-equivalent stand-in
where those direct feeds aren't accessible. Fetch it with:

```bash
python -m data.fetch_real_climate
```

This writes `real_climate_osogbo_2016_2024.csv` (3,288 real daily records,
2016-2024, source MERRA-2, zero missing values).

Direct NIHSA river-gauge and CliNode field-sensor feeds were not accessible in
the development environment, so three variables are **derived** from that real
rainfall rather than measured directly:

- **River discharge (m3/s)** - a rainfall-runoff transfer function (seasonal
  baseflow + a share of real cumulative rainfall + day-to-day persistence),
  calibrated to the corridor's published Aug-Sep discharge peak of ~150 m3/s
  (Ogundolie et al., 2024).
- **Soil moisture** and **vegetation index** - proxies coupled to real 30-day
  rainfall, standing in for direct satellite or CliNode measurement.

Regenerate the full feature CSV (real rainfall/temperature + derived
discharge/soil-moisture/vegetation-index) with:

```bash
python -m data.generate_osun_dataset
```

This writes `osun_corridor_2016_2024.csv` (~3,282 daily records after dropping
rows without full lag/target context).

**Provenance summary:** rainfall and temperature are real; discharge, soil
moisture and vegetation index are disclosed derived quantities, not raw
sensor telemetry. See `app/model_core.py` for the full methodology.

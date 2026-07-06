"""
Generate the Clisense synthetic Nigeria climate dataset and write it to CSV.

Usage:
    python data/generate_nigeria_climate_data.py [--n 18530] [--out data/nigeria_climate_2015_2024.csv]

This script is a thin CLI wrapper around app/model_core.generate_synthetic_dataset,
so the exact same generation logic used to train the deployed model is what
produces the CSV shipped in this repo. Re-running it with the same seed is
fully reproducible.
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "app"))

import model_core as mc


def main():
    parser = argparse.ArgumentParser(description="Generate Clisense synthetic climate data")
    parser.add_argument("--n", type=int, default=18530, help="Number of records to generate")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    parser.add_argument(
        "--out", type=str,
        default=str(Path(__file__).resolve().parent / "nigeria_climate_2015_2024.csv"),
        help="Output CSV path",
    )
    args = parser.parse_args()

    df = mc.generate_synthetic_dataset(n=args.n, seed=args.seed)
    df.to_csv(args.out, index=False)
    print(f"Wrote {len(df):,} rows to {args.out}")
    print(df["threat_label"].value_counts())


if __name__ == "__main__":
    main()

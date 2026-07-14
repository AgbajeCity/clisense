"""Export the disclosed synthetic Osun River corridor dataset to CSV.

Usage:  python -m data.generate_osun_dataset
"""
import os

from app import model_core as mc

if __name__ == "__main__":
    df = mc.generate_dataset()
    out = os.path.join(os.path.dirname(__file__), "osun_corridor_2016_2024.csv")
    df.to_csv(out, index=False)
    print(f"Wrote {len(df)} records to {out} | flood rate {df['flood'].mean():.3f}")

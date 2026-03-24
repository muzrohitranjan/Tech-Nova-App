"""Seed data from database/seed.sql

Revision ID: 0002_seed_data
Revises: 0001_init_schema
Create Date: 2026-03-24
"""

from pathlib import Path

from alembic import op

revision = "0002_seed_data"
down_revision = "0001_init_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    root = Path(__file__).resolve().parents[3]
    seed_path = root / "database" / "seed.sql"
    sql = seed_path.read_text(encoding="utf-8")
    op.execute(sql)


def downgrade() -> None:
    raise RuntimeError("Downgrade not supported for seed data")

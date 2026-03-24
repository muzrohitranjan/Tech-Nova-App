"""Initial schema from database/schema.sql

Revision ID: 0001_init_schema
Revises: 
Create Date: 2026-03-24
"""

from pathlib import Path

from alembic import op

# revision identifiers, used by Alembic.
revision = "0001_init_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    root = Path(__file__).resolve().parents[3]
    schema_path = root / "database" / "schema.sql"
    sql = schema_path.read_text(encoding="utf-8")
    op.execute(sql)


def downgrade() -> None:
    # Downgrade intentionally unsupported to avoid data loss.
    raise RuntimeError("Downgrade not supported for initial schema")

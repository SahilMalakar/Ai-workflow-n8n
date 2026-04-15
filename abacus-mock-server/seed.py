"""
Seed script — populates the database with 100 fake records per table.

Usage:
  python seed.py

For PostgreSQL (Render.com), update DATABASE_URL in your .env or pass it directly.
"""

import random
import sys
import os

# Allow running from the abacus-mock-server directory
sys.path.insert(0, os.path.dirname(__file__))

from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.core.database import Base
from app.models import AddressModel, CustomerModel, ProjectModel, InvoiceModel, OrderModel

fake = Faker()


def get_engine():
    if "sqlite" in settings.DATABASE_URL:
        return create_engine(
            settings.DATABASE_URL,
            connect_args={"check_same_thread": False},
        )
    # PostgreSQL — Render.com requires SSL
    return create_engine(
        settings.DATABASE_URL,
        connect_args={"sslmode": "require"},
    )


def seed():
    engine = get_engine()
    Base.metadata.create_all(bind=engine)

    Session = sessionmaker(bind=engine)
    db = Session()

    try:
        # ---------- ADDRESSES ----------
        print("Seeding 100 addresses...")
        addresses = []
        for _ in range(100):
            addr = AddressModel(
                firstName=fake.first_name(),
                lastName=fake.last_name(),
                street=fake.street_address(),
                zip=fake.postcode(),
                city=fake.city(),
            )
            db.add(addr)
            addresses.append(addr)
        db.commit()
        for a in addresses:
            db.refresh(a)
        print(f"  ✓ {len(addresses)} addresses created")

        # ---------- CUSTOMERS ----------
        print("Seeding 100 customers...")
        customers = []
        for _ in range(100):
            cust = CustomerModel(
                name=fake.company(),
                email=fake.unique.email(),
                addressId=random.choice(addresses).id,
            )
            db.add(cust)
            customers.append(cust)
        db.commit()
        for c in customers:
            db.refresh(c)
        print(f"  ✓ {len(customers)} customers created")

        # ---------- PROJECTS ----------
        print("Seeding 100 projects...")
        for _ in range(100):
            proj = ProjectModel(
                projectName=fake.bs().title(),
                status=random.choice(["active", "completed", "on-hold"]),
                customerId=random.choice(customers).id,
            )
            db.add(proj)
        db.commit()
        print("  ✓ 100 projects created")

        # ---------- ORDERS ----------
        print("Seeding 100 orders...")
        for _ in range(100):
            order = OrderModel(
                customerId=random.choice(customers).id,
                totalAmount=round(random.uniform(100, 5000), 2),
            )
            db.add(order)
        db.commit()
        print("  ✓ 100 orders created")

        # ---------- INVOICES ----------
        print("Seeding 100 invoices...")
        for _ in range(100):
            inv = InvoiceModel(
                customerId=random.choice(customers).id,
                amount=round(random.uniform(100, 10000), 2),
                currency="CHF",
                status=random.choice(["open", "paid", "cancelled"]),
            )
            db.add(inv)
        db.commit()
        print("  ✓ 100 invoices created")

        print("\n✅ Seeding complete!")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()

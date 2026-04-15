from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
import uuid


def generate_prefixed_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:6].upper()}"


# ---------- ADDRESS ----------
class AddressModel(Base):
    __tablename__ = "addresses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    firstName = Column(String, nullable=False)
    lastName = Column(String, nullable=False)
    street = Column(String, nullable=True)
    zip = Column(String, nullable=True)
    city = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)

    # Relationships
    customers = relationship("CustomerModel", back_populates="address")


# ---------- CUSTOMER ----------
class CustomerModel(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, default=lambda: generate_prefixed_id("CUST"))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=True)
    addressId = Column(String, ForeignKey("addresses.id"), nullable=True)

    # Relationships
    address = relationship("AddressModel", back_populates="customers")
    projects = relationship("ProjectModel", back_populates="customer")
    invoices = relationship("InvoiceModel", back_populates="customer")
    orders = relationship("OrderModel", back_populates="customer")


# ---------- PROJECT ----------
class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: generate_prefixed_id("PROJ"))
    projectName = Column(String, nullable=False)
    status = Column(String, default="active")
    customerId = Column(String, ForeignKey("customers.id"), nullable=True)

    # Relationships
    customer = relationship("CustomerModel", back_populates="projects")


# ---------- INVOICE ----------
class InvoiceModel(Base):
    __tablename__ = "invoices"

    id = Column(String, primary_key=True, default=lambda: generate_prefixed_id("INV"))
    customerId = Column(String, ForeignKey("customers.id"), nullable=False)
    amount = Column(Float, nullable=True)
    currency = Column(String, default="CHF")
    status = Column(String, default="open")

    # Relationships
    customer = relationship("CustomerModel", back_populates="invoices")


# ---------- ORDER ----------
class OrderModel(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=lambda: generate_prefixed_id("ORD"))
    customerId = Column(String, ForeignKey("customers.id"), nullable=False)
    totalAmount = Column(Float, nullable=True)

    # Relationships
    customer = relationship("CustomerModel", back_populates="orders")

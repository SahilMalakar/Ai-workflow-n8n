from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ---------- ADDRESS ----------
class AddressBase(BaseModel):
    firstName: str
    lastName: str
    street: Optional[str] = None
    zip: Optional[str] = None
    city: Optional[str] = None


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    street: Optional[str] = None
    zip: Optional[str] = None
    city: Optional[str] = None


class AddressResponse(AddressBase):
    id: str
    createdAt: datetime

    class Config:
        from_attributes = True


# ---------- CUSTOMER ----------
class CustomerBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    addressId: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    addressId: Optional[str] = None


class CustomerResponse(CustomerBase):
    id: str

    class Config:
        from_attributes = True


# ---------- PROJECT ----------
class ProjectBase(BaseModel):
    projectName: str
    status: str = "active"
    customerId: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    projectName: Optional[str] = None
    status: Optional[str] = None
    customerId: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: str

    class Config:
        from_attributes = True


# ---------- INVOICE ----------
class InvoiceBase(BaseModel):
    customerId: str
    amount: float = Field(gt=0)
    currency: str = "CHF"


class InvoiceCreate(InvoiceBase):
    pass


class InvoiceUpdate(BaseModel):
    amount: Optional[float] = Field(default=None, gt=0)
    currency: Optional[str] = None
    status: Optional[str] = None


class InvoiceResponse(InvoiceBase):
    id: str
    status: str

    class Config:
        from_attributes = True


# ---------- ORDER ----------
class OrderBase(BaseModel):
    customerId: str
    totalAmount: float = Field(gt=0)


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    totalAmount: Optional[float] = Field(default=None, gt=0)


class OrderResponse(OrderBase):
    id: str

    class Config:
        from_attributes = True


# ---------- AUTH ----------
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

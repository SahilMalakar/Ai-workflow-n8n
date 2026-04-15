from fastapi import FastAPI, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings
from app.core.lifecycle import lifespan
from app.schemas import TokenResponse

# Routers
from app.routers import (
    addresses,
    customers,
    projects,
    invoices,
    orders,
    system,
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# =========================
# 🌐 CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🔐 SECURITY
# =========================

security = HTTPBearer()


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token != settings.ABACUS_MOCK_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid token")


BASE_PATH = settings.api_base_path


# =========================
# 🔐 AUTH ROUTES
# =========================

@app.get("/.well-known/openid-configuration", tags=["Auth"])
def openid_config():
    """n8n hits this first to auto-discover token and API endpoints."""
    return {
        "issuer": settings.INSTANCE_URL,
        "token_endpoint": settings.token_endpoint_url,
        "api_endpoint": f"{settings.INSTANCE_URL}{settings.API_BASE_PATH}",
    }


@app.post("/oauth/token", response_model=TokenResponse, tags=["Auth"])
def get_token(
    grant_type: str = Form(...),
    client_id: str = Form(...),
    client_secret: str = Form(...),
):
    """OAuth2 Client Credentials — accepts form data (required by n8n)."""
    if client_id != settings.ABACUS_CLIENT_ID or client_secret != settings.ABACUS_CLIENT_SECRET:
        raise HTTPException(status_code=401, detail="Invalid client credentials")

    return {
        "access_token": settings.ABACUS_MOCK_TOKEN,
        "token_type": "bearer",
        "expires_in": settings.TOKEN_EXPIRY_SECONDS,
    }


# =========================
# 📦 SYSTEM ROUTES
# =========================

app.include_router(system.router)


# =========================
# 📊 RESOURCE ROUTES (PROTECTED 🔐)
# =========================

app.include_router(
    addresses.router,
    prefix=f"{BASE_PATH}/addresses",
    tags=["Addresses"],
    dependencies=[Depends(verify_token)],
)

app.include_router(
    customers.router,
    prefix=f"{BASE_PATH}/customers",
    tags=["Customers"],
    dependencies=[Depends(verify_token)],
)

app.include_router(
    projects.router,
    prefix=f"{BASE_PATH}/projects",
    tags=["Projects"],
    dependencies=[Depends(verify_token)],
)

app.include_router(
    invoices.router,
    prefix=f"{BASE_PATH}/invoices",
    tags=["Invoices"],
    dependencies=[Depends(verify_token)],
)

app.include_router(
    orders.router,
    prefix=f"{BASE_PATH}/orders",
    tags=["Orders"],
    dependencies=[Depends(verify_token)],
)

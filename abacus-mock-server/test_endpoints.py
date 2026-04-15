"""
Quick smoke test for all endpoints.
Run: python test_endpoints.py
"""
import requests
import uuid

BASE = "http://localhost:8000"
_RUN_ID = uuid.uuid4().hex[:6]  # unique per test run
API = f"{BASE}/rest/v1"
TOKEN = "mock_token_123"
H = {"Authorization": f"Bearer {TOKEN}"}
JSON = {"Content-Type": "application/json"}

passed = 0
failed = 0


def check(label, response, expected_status, check_fn=None):
    global passed, failed
    ok = response.status_code == expected_status
    if ok and check_fn:
        ok = check_fn(response.json())
    status = "✅" if ok else "❌"
    print(f"  {status} [{response.status_code}] {label}")
    if not ok:
        print(f"       expected {expected_status}, got {response.status_code}")
        try:
            print(f"       body: {response.json()}")
        except Exception:
            print(f"       body: {response.text}")
        failed += 1
    else:
        passed += 1
    return response


# ── AUTH & SYSTEM ──────────────────────────────────────────────────────────────
print("\n── AUTH & SYSTEM ──")

check("GET /.well-known/openid-configuration",
      requests.get(f"{BASE}/.well-known/openid-configuration"), 200,
      lambda j: "token_endpoint" in j and "api_endpoint" in j)

r = check("POST /oauth/token (valid form data)",
          requests.post(f"{BASE}/oauth/token", data={
              "grant_type": "client_credentials",
              "client_id": "demo_client",
              "client_secret": "demo_secret",
          }), 200, lambda j: j.get("access_token") == TOKEN)

check("POST /oauth/token (invalid creds → 401)",
      requests.post(f"{BASE}/oauth/token", data={
          "grant_type": "client_credentials",
          "client_id": "wrong", "client_secret": "wrong",
      }), 401)

check("GET /rest/v1/info (with token)",
      requests.get(f"{API}/info", headers=H), 200,
      lambda j: j.get("erp") == "Abacus" and j.get("mock_server_status") == "Active")

check("GET /rest/v1/info (no token → 403)",
      requests.get(f"{API}/info"), 403)

# ── ADDRESSES ─────────────────────────────────────────────────────────────────
print("\n── ADDRESSES ──")

r = check("POST /addresses (create → 201)",
          requests.post(f"{API}/addresses/", headers={**H, **JSON}, json={
              "firstName": "Jane", "lastName": "Smith",
              "street": "Bahnhofstr 5", "zip": "8001", "city": "Zurich"
          }), 201, lambda j: j["success"] and "createdAt" in j["data"])
addr_id = r.json()["data"]["id"]

check("GET /addresses (list)",
      requests.get(f"{API}/addresses/", headers=H), 200,
      lambda j: j["success"] and isinstance(j["data"]["items"], list))

check("GET /addresses/:id",
      requests.get(f"{API}/addresses/{addr_id}", headers=H), 200,
      lambda j: j["data"]["id"] == addr_id)

check("PATCH /addresses/:id",
      requests.patch(f"{API}/addresses/{addr_id}", headers={**H, **JSON},
                     json={"city": "Basel"}), 200,
      lambda j: j["data"]["city"] == "Basel")

check("GET /addresses/nonexistent → 404",
      requests.get(f"{API}/addresses/nonexistent", headers=H), 404)

check("DELETE /addresses/:id → 204",
      requests.delete(f"{API}/addresses/{addr_id}", headers=H), 204)

# ── CUSTOMERS ─────────────────────────────────────────────────────────────────
print("\n── CUSTOMERS ──")

r = check("POST /customers (create → 201)",
          requests.post(f"{API}/customers/", headers={**H, **JSON}, json={
              "name": "Acme AG", "email": f"acme-{_RUN_ID}@example.com"
          }), 201, lambda j: j["success"] and j["data"]["id"].startswith("CUST-"))
cust_id = r.json()["data"]["id"]

check("GET /customers (list)",
      requests.get(f"{API}/customers/", headers=H), 200)

check("GET /customers (search)",
      requests.get(f"{API}/customers/?search=Acme", headers=H), 200,
      lambda j: len(j["data"]["items"]) >= 1)

check("GET /customers/:id",
      requests.get(f"{API}/customers/{cust_id}", headers=H), 200)

check("PATCH /customers/:id",
      requests.patch(f"{API}/customers/{cust_id}", headers={**H, **JSON},
                     json={"name": "Acme GmbH"}), 200,
      lambda j: j["data"]["name"] == "Acme GmbH")

check("POST /customers (duplicate email → 409)",
      requests.post(f"{API}/customers/", headers={**H, **JSON}, json={
          "name": "Dup", "email": f"acme-{_RUN_ID}@example.com"
      }), 409)

check("DELETE /customers/:id → 405 (no delete endpoint)",
      requests.delete(f"{API}/customers/{cust_id}", headers=H), 405)

# ── PROJECTS ──────────────────────────────────────────────────────────────────
print("\n── PROJECTS ──")

r = check("POST /projects (create → 201)",
          requests.post(f"{API}/projects/", headers={**H, **JSON}, json={
              "projectName": "ERP Migration", "customerId": cust_id
          }), 201, lambda j: j["data"]["id"].startswith("PROJ-"))
proj_id = r.json()["data"]["id"]

check("GET /projects (list)",
      requests.get(f"{API}/projects/", headers=H), 200)

check("GET /projects/:id",
      requests.get(f"{API}/projects/{proj_id}", headers=H), 200)

check("PATCH /projects/:id",
      requests.patch(f"{API}/projects/{proj_id}", headers={**H, **JSON},
                     json={"status": "completed"}), 200,
      lambda j: j["data"]["status"] == "completed")

check("DELETE /projects/:id → 204",
      requests.delete(f"{API}/projects/{proj_id}", headers=H), 204)

# ── INVOICES ──────────────────────────────────────────────────────────────────
print("\n── INVOICES ──")

r = check("POST /invoices (create → 201)",
          requests.post(f"{API}/invoices/", headers={**H, **JSON}, json={
              "customerId": cust_id, "amount": 1500.00, "currency": "CHF"
          }), 201, lambda j: j["data"]["currency"] == "CHF" and j["data"]["status"] == "open")
inv_id = r.json()["data"]["id"]

check("GET /invoices (list)",
      requests.get(f"{API}/invoices/", headers=H), 200)

check("GET /invoices/:id",
      requests.get(f"{API}/invoices/{inv_id}", headers=H), 200)

check("PATCH /invoices/:id (status → paid)",
      requests.patch(f"{API}/invoices/{inv_id}", headers={**H, **JSON},
                     json={"status": "paid"}), 200,
      lambda j: j["data"]["status"] == "paid")

check("DELETE /invoices/:id → 204",
      requests.delete(f"{API}/invoices/{inv_id}", headers=H), 204)

check("POST /invoices (bad customer → 404)",
      requests.post(f"{API}/invoices/", headers={**H, **JSON}, json={
          "customerId": "CUST-INVALID", "amount": 100.0
      }), 404)

# ── ORDERS ────────────────────────────────────────────────────────────────────
print("\n── ORDERS ──")

r = check("POST /orders (create → 201)",
          requests.post(f"{API}/orders/", headers={**H, **JSON}, json={
              "customerId": cust_id, "totalAmount": 999.50
          }), 201, lambda j: j["data"]["id"].startswith("ORD-"))
ord_id = r.json()["data"]["id"]

check("GET /orders (list)",
      requests.get(f"{API}/orders/", headers=H), 200)

check("GET /orders/:id",
      requests.get(f"{API}/orders/{ord_id}", headers=H), 200)

check("PATCH /orders/:id",
      requests.patch(f"{API}/orders/{ord_id}", headers={**H, **JSON},
                     json={"totalAmount": 1200.00}), 200,
      lambda j: j["data"]["totalAmount"] == 1200.00)

check("DELETE /orders/:id → 204",
      requests.delete(f"{API}/orders/{ord_id}", headers=H), 204)

check("POST /orders (bad customer → 404)",
      requests.post(f"{API}/orders/", headers={**H, **JSON}, json={
          "customerId": "CUST-INVALID", "totalAmount": 100.0
      }), 404)

# ── SUMMARY ───────────────────────────────────────────────────────────────────
total = passed + failed
print(f"\n{'='*40}")
print(f"  {passed}/{total} passed  |  {failed} failed")
print(f"{'='*40}\n")

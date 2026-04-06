#!/usr/bin/env python
"""
Test script for Phase 1 & 2 Integration
Tests: Authentication -> Dashboard Data Load
"""

import requests
import json
from typing import Optional

API_URL = "http://localhost:8000"

class TestResults:
    def __init__(self):
        self.results = []
    
    def add(self, test_name: str, passed: bool, details: str = ""):
        status = "✅ PASS" if passed else "❌ FAIL"
        self.results.append(f"{status} | {test_name}: {details}")
    
    def print_summary(self):
        print("\n" + "="*80)
        print("TEST RESULTS SUMMARY")
        print("="*80)
        for result in self.results:
            print(result)
        print("="*80 + "\n")

results = TestResults()

# Test 1: Backend health check
print("Testing backend connectivity...")
try:
    response = requests.get(f"{API_URL}/docs", timeout=3)
    results.add("Backend Health Check", response.status_code == 200, f"Status: {response.status_code}")
except Exception as e:
    results.add("Backend Health Check", False, f"Connection failed: {str(e)}")
    print("❌ Backend is not running. Please start it with:")
    print("   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    results.print_summary()
    exit(1)

# Test 2: Register new user
print("\nTesting user registration...")
test_email = "testuser@example.com"
test_password = "TestPassword123"
register_payload = {
    "email": test_email,
    "password": test_password,
    "nombre": "Test",
    "apellido": "User"
}

try:
    response = requests.post(f"{API_URL}/auth/register", json=register_payload, timeout=5)
    register_success = response.status_code in [201, 200]
    results.add("User Registration", register_success, f"Status: {response.status_code}")
    if register_success:
        user_data = response.json()
        user_id = user_data.get("id")
        print(f"   Created user ID: {user_id}")
    else:
        print(f"   Response: {response.text}")
except Exception as e:
    results.add("User Registration", False, f"Error: {str(e)}")
    user_id = None

# Test 3: Login with registered user
print("\nTesting user login...")
login_payload = {
    "username": test_email,
    "password": test_password
}

token = None
user_id_from_login = None

try:
    response = requests.post(f"{API_URL}/auth/login", data=login_payload, timeout=5)
    login_success = response.status_code == 200
    results.add("User Login", login_success, f"Status: {response.status_code}")
    
    if login_success:
        token_data = response.json()
        token = token_data.get("access_token")
        print(f"   Got token: {token[:20]}...")
        
        # Parse JWT to get user_id
        try:
            import base64
            parts = token.split(".")
            payload = json.loads(base64.urlsafe_b64decode(parts[1] + "=="))
            user_id_from_login = int(payload.get("sub"))
            print(f"   User ID from JWT: {user_id_from_login}")
        except Exception as e:
            print(f"   Could not parse JWT: {e}")
    else:
        print(f"   Response: {response.text}")
except Exception as e:
    results.add("User Login", False, f"Error: {str(e)}")

# Test 4: Get medical summary (Dashboard data)
print("\nTesting GET /users/me/medical endpoint...")
if token:
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(f"{API_URL}/users/me/medical", headers=headers, timeout=5)
        medical_success = response.status_code == 200
        results.add("Get Medical Summary", medical_success, f"Status: {response.status_code}")
        
        if medical_success:
            medical_data = response.json()
            print(f"   Medical data: {json.dumps(medical_data, indent=2)}")
        else:
            print(f"   Response: {response.text}")
    except Exception as e:
        results.add("Get Medical Summary", False, f"Error: {str(e)}")
else:
    results.add("Get Medical Summary", False, "No token available")

# Test 5: Create personal data
print("\nTesting POST /users/personal-data endpoint...")
if token and user_id_from_login:
    headers = {"Authorization": f"Bearer {token}"}
    personal_data_payload = {
        "telefono": "+1-809-555-1234",
        "direccion": "Calle Principal 123",
        "ciudad": "Santo Domingo",
        "pais": "República Dominicana"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/users/personal-data/{user_id_from_login}",
            json=personal_data_payload,
            headers=headers,
            timeout=5
        )
        personal_success = response.status_code in [201, 200]
        results.add("Create Personal Data", personal_success, f"Status: {response.status_code}")
        
        if personal_success:
            print(f"   Response: {response.json()}")
        else:
            print(f"   Response: {response.text}")
    except Exception as e:
        results.add("Create Personal Data", False, f"Error: {str(e)}")
else:
    results.add("Create Personal Data", False, "No token or user_id available")

# Test 6: Get personal data
print("\nTesting GET /users/personal-data endpoint...")
if token and user_id_from_login:
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(
            f"{API_URL}/users/personal-data/{user_id_from_login}",
            headers=headers,
            timeout=5
        )
        get_personal_success = response.status_code == 200
        results.add("Get Personal Data", get_personal_success, f"Status: {response.status_code}")
        
        if get_personal_success:
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"   Response: {response.text}")
    except Exception as e:
        results.add("Get Personal Data", False, f"Error: {str(e)}")
else:
    results.add("Get Personal Data", False, "No token or user_id available")

# Test 7: Create medical history
print("\nTesting POST /users/medical-history endpoint...")
if token and user_id_from_login:
    headers = {"Authorization": f"Bearer {token}"}
    medical_history_payload = {
        "tipo_sangre": "O+",
        "alergias": "Penicilina",
        "enfermedades_cronicas": "Ninguna"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/users/medical-history/{user_id_from_login}",
            json=medical_history_payload,
            headers=headers,
            timeout=5
        )
        medical_history_success = response.status_code in [201, 200]
        results.add("Create Medical History", medical_history_success, f"Status: {response.status_code}")
        
        if medical_history_success:
            print(f"   Response: {response.json()}")
        else:
            print(f"   Response: {response.text}")
    except Exception as e:
        results.add("Create Medical History", False, f"Error: {str(e)}")
else:
    results.add("Create Medical History", False, "No token or user_id available")

# Test 8: Get medical history
print("\nTesting GET /users/medical-history endpoint...")
if token and user_id_from_login:
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(
            f"{API_URL}/users/medical-history/{user_id_from_login}",
            headers=headers,
            timeout=5
        )
        get_medical_history_success = response.status_code == 200
        results.add("Get Medical History", get_medical_history_success, f"Status: {response.status_code}")
        
        if get_medical_history_success:
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"   Response: {response.text}")
    except Exception as e:
        results.add("Get Medical History", False, f"Error: {str(e)}")
else:
    results.add("Get Medical History", False, "No token or user_id available")

# Print summary
results.print_summary()

# Print test completion message
print("\n🎉 Phase 1 & 2 Testing Complete!")
print("\nTo test the full flow in the browser:")
print("1. Start backend: python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
print("2. Start frontend: npm run dev")
print("3. Navigate to http://localhost:3000")
print("4. Register with email: testuser@example.com, password: TestPassword123")
print("5. View dashboard to see medical data")

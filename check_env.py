import sys
import subprocess

print("Python version:", sys.version)
print("Python executable:", sys.executable)

# Try to import requests
try:
    import requests
    print("✅ requests module available")
except ImportError:
    print("❌ requests module NOT available - installing...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "-q"])
    import requests
    print("✅ requests installed successfully")

# Now run a simple connectivity test
print("\nTesting connectivity to http://localhost:8000...")
try:
    response = requests.get("http://localhost:8000/docs", timeout=2)
    print(f"✅ Backend is running (status: {response.status_code})")
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend on port 8000")
    print("\nPlease start the backend with:")
    print("cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
except Exception as e:
    print(f"❌ Error: {e}")

#!/usr/bin/env python3
"""
Plan de testing para verificar que todo funciona
"""
import os

print("=" * 80)
print("PLAN DE TESTING - FASE 3 & 5")
print("=" * 80)

base_path = r"C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud"

# Verificar que todos los archivos existen
print("\n[1] Verificando que todas las rutas están creadas...")
routes = [
    "frontend/app/add-medication",
    "frontend/app/edit-medication",
    "frontend/app/add-vaccine",
    "frontend/app/edit-vaccine",
    "frontend/app/add-surgery",
    "frontend/app/edit-surgery",
    "frontend/app/add-emergency-contact",
    "frontend/app/edit-emergency-contact",
    "frontend/app/add-habits",
    "frontend/app/generate-qr",
]

for route in routes:
    full_path = os.path.join(base_path, route)
    exists = os.path.exists(full_path)
    status = "✓" if exists else "✗"
    print(f"  {status} {route}")

# Verificar que los page.tsx existen
print("\n[2] Verificando archivos page.tsx...")
pages = [
    "frontend/app/add-medication/page.tsx",
    "frontend/app/edit-medication/page.tsx",
    "frontend/app/add-vaccine/page.tsx",
    "frontend/app/edit-vaccine/page.tsx",
    "frontend/app/add-surgery/page.tsx",
    "frontend/app/edit-surgery/page.tsx",
    "frontend/app/add-emergency-contact/page.tsx",
    "frontend/app/edit-emergency-contact/page.tsx",
    "frontend/app/add-habits/page.tsx",
]

for page in pages:
    full_path = os.path.join(base_path, page)
    exists = os.path.isfile(full_path)
    status = "✓" if exists else "✗"
    print(f"  {status} {page}")

# Verificar componentes
print("\n[3] Verificando componentes...")
components = [
    "frontend/components/AddMedicationPage.tsx",
    "frontend/components/EditMedicationPage.tsx",
    "frontend/components/AddVaccinePage.tsx",
    "frontend/components/EditVaccinePage.tsx",
    "frontend/components/AddSurgeryPage.tsx",
    "frontend/components/EditSurgeryPage.tsx",
    "frontend/components/AddEmergencyContactPage.tsx",
    "frontend/components/EditEmergencyContactPage.tsx",
    "frontend/components/AddHabitsPage.tsx",
    "frontend/components/MedicalItemCard.tsx",
    "frontend/components/ConfirmDeleteModal.tsx",
    "frontend/components/MedicalHistoryPage.tsx",
    "frontend/components/GenerateQRPage.tsx",
]

for comp in components:
    full_path = os.path.join(base_path, comp)
    exists = os.path.isfile(full_path)
    status = "✓" if exists else "✗"
    print(f"  {status} {comp}")

# Verificar que MedicalHistoryPage tiene las rutas actualizadas
print("\n[4] Verificando navegación en MedicalHistoryPage...")
med_history_path = os.path.join(base_path, "frontend/components/MedicalHistoryPage.tsx")
with open(med_history_path, 'r', encoding='utf-8') as f:
    content = f.read()
    checks = [
        ("edit-medication?id=", "Rutas medicamentos con query params"),
        ("edit-vaccine?id=", "Rutas vacunas con query params"),
        ("edit-surgery?id=", "Rutas cirugías con query params"),
        ("edit-emergency-contact?id=", "Rutas contactos con query params"),
    ]
    
    for check_str, desc in checks:
        found = check_str in content
        status = "✓" if found else "✗"
        print(f"  {status} {desc}")

print("\n" + "=" * 80)
print("PRÓXIMOS PASOS:")
print("=" * 80)
print("""
1. Iniciar Backend:
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

2. Iniciar Frontend:
   cd frontend
   npm run dev

3. Verificar en navegador:
   - http://localhost:3000/dashboard
   - Ir a Historial Médico
   - Hacer clic en "Agregar Medicamento"
   - Verificar que navega a /add-medication
   - Llenar formulario y guardar
   - Verificar que regresa a /medical-history y aparece el medicamento
   - Hacer clic en editar medicamento
   - Verificar que navega a /edit-medication?id=X
   - Guardar cambios y verificar actualización

4. Repetir para otras rutas:
   - Vacunas (/add-vaccine, /edit-vaccine?id=X)
   - Cirugías (/add-surgery, /edit-surgery?id=X)
   - Contactos (/add-emergency-contact, /edit-emergency-contact?id=X)
   - Hábitos (/add-habits)
   - QR (/generate-qr)
""")

print("=" * 80)

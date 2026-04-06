# Phase 3: Medical Records CRUD - Complete Implementation Guide

## ✅ Status: READY TO IMPLEMENT

---

## Overview

Phase 3 integrates all medical records management:
- ✅ Medications (create, read, update, delete)
- ✅ Vaccines (create, read, update, delete)  
- ✅ Surgeries (create, read, update, delete)
- ✅ Emergency Contacts (create, read, update, delete)
- ✅ Habits (create/view/update - 1:1 relationship)

**Backend**: All endpoints already implemented and ready ✅
**Frontend**: Need to build UI components

---

## Backend Endpoints Ready

### Medications
```
POST   /users/medications/{user_id}                    → Create
GET    /users/medications/{user_id}                    → List all
GET    /users/medications/{user_id}/{medication_id}   → Get one
PUT    /users/medications/{user_id}/{medication_id}   → Update
DELETE /users/medications/{user_id}/{medication_id}   → Delete
```

### Vaccines  
```
POST   /users/vaccines/{user_id}                       → Create
GET    /users/vaccines/{user_id}                       → List all
GET    /users/vaccines/{user_id}/{vaccine_id}         → Get one
PUT    /users/vaccines/{user_id}/{vaccine_id}         → Update
DELETE /users/vaccines/{user_id}/{vaccine_id}         → Delete
```

### Surgeries
```
POST   /users/surgeries/{user_id}                      → Create
GET    /users/surgeries/{user_id}                      → List all
GET    /users/surgeries/{user_id}/{surgery_id}        → Get one
PUT    /users/surgeries/{user_id}/{surgery_id}        → Update
DELETE /users/surgeries/{user_id}/{surgery_id}        → Delete
```

### Emergency Contacts
```
POST   /users/emergency-contacts/{user_id}            → Create
GET    /users/emergency-contacts/{user_id}            → List all
GET    /users/emergency-contacts/{user_id}/{id}       → Get one
PUT    /users/emergency-contacts/{user_id}/{id}       → Update
DELETE /users/emergency-contacts/{user_id}/{id}       → Delete
```

### Habits (1:1 relationship)
```
POST   /users/habits/{user_id}                         → Create (409 if exists)
GET    /users/habits/{user_id}                         → Get
PUT    /users/habits/{user_id}                         → Update
```

---

## Request/Response Schemas

### Medication
**POST/PUT Request:**
```json
{
  "nombre": "Aspirina",           // Required, 2-200 chars
  "dosis": "500mg",               // Optional
  "frecuencia": "2 veces al día", // Optional
  "motivo": "Dolor de cabeza",    // Optional
  "activo": true                  // Optional, default: true
}
```

**Response (GET/POST/PUT):**
```json
{
  "id": 1,
  "nombre": "Aspirina",
  "dosis": "500mg",
  "frecuencia": "2 veces al día",
  "motivo": "Dolor de cabeza",
  "activo": true,
  "medical_record_id": 1,
  "created_at": "2026-04-01T...",
  "updated_at": "2026-04-01T..."
}
```

### Vaccine
**POST/PUT Request:**
```json
{
  "nombre": "COVID-19",                    // Required, 2-200 chars
  "fecha_aplicacion": "2026-03-15",       // Optional, YYYY-MM-DD
  "numero_dosis": 2,                      // Optional, >= 1
  "lote": "LOTE123",                      // Optional
  "observaciones": "Sin reacciones"       // Optional
}
```

### Surgery
**POST/PUT Request:**
```json
{
  "nombre_procedimiento": "Apendicitis",  // Required, 2-255 chars
  "fecha": "2025-06-10",                  // Optional
  "motivo": "Inflamación",                // Optional
  "hospital": "Hospital Central",         // Optional
  "complicaciones": "Ninguna"             // Optional
}
```

### Emergency Contact
**POST/PUT Request:**
```json
{
  "nombre": "Juan Pérez",                 // Required, 2-200 chars
  "telefono": "+1-809-555-1234",         // Required, 7-20 chars
  "relacion": "Hermano"                   // Required, 2-100 chars
}
```

### Habits
**POST/PUT Request:**
```json
{
  "fuma": false,                          // Optional, default: false
  "consume_alcohol": "ocasional",         // "nunca" | "ocasional" | "frecuente"
  "nivel_ejercicio": "moderado",          // "sedentario" | "leve" | "moderado" | "intenso"
  "tipo_dieta": "Balanceada",            // Optional
  "consume_drogas": false,                // Optional, default: false
  "observaciones": ""                     // Optional
}
```

---

## Frontend Components to Build

### 1. MedicalHistoryPage.tsx (UPDATE)
```typescript
- List all medications, vaccines, surgeries, emergency contacts
- Show habits summary
- Add/Edit/Delete buttons for each item
- Call: GET /users/{userId}/medications/vaccines/surgeries/emergency-contacts/habits
```

### 2. Medication Components (NEW)
- `AddMedicationPage.tsx` - Form to add medication
- `EditMedicationPage.tsx` - Form to edit + delete

### 3. Vaccine Components (NEW)
- `AddVaccinePage.tsx` - Form to add vaccine
- `EditVaccinePage.tsx` - Form to edit + delete

### 4. Surgery Components (NEW)
- `AddSurgeryPage.tsx` - Form to add surgery
- `EditSurgeryPage.tsx` - Form to edit + delete

### 5. Emergency Contact Components (NEW)
- `AddEmergencyContactPage.tsx` - Form to add contact
- `EditEmergencyContactPage.tsx` - Form to edit + delete

### 6. Habits Page (NEW)
- `HabitsPage.tsx` - View/edit habits (only one per user)

### 7. Shared Components (NEW)
- `ConfirmDeleteModal.tsx` - Delete confirmation dialog
- `MedicalItemCard.tsx` - Reusable card component

---

## Implementation Steps

### Step 1: Update api-client.ts with Helper Methods

Add these convenience methods:

```typescript
// Medications
async addMedication(userId: number, data: any)
async getMedications(userId: number)
async updateMedication(userId: number, medId: number, data: any)
async deleteMedication(userId: number, medId: number)

// Vaccines
async addVaccine(userId: number, data: any)
async getVaccines(userId: number)
async updateVaccine(userId: number, vacId: number, data: any)
async deleteVaccine(userId: number, vacId: number)

// Surgeries
async addSurgery(userId: number, data: any)
async getSurgeries(userId: number)
async updateSurgery(userId: number, surgId: number, data: any)
async deleteSurgery(userId: number, surgId: number)

// Emergency Contacts
async addEmergencyContact(userId: number, data: any)
async getEmergencyContacts(userId: number)
async updateEmergencyContact(userId: number, contactId: number, data: any)
async deleteEmergencyContact(userId: number, contactId: number)

// Habits
async getHabits(userId: number)
async saveHabits(userId: number, data: any)
```

### Step 2: Update MedicalHistoryPage.tsx

1. Load all medication/vaccine/surgery/contact data on mount
2. Display in organized tabs or sections
3. Add delete buttons for each item
4. Add "Edit" buttons linking to detail pages
5. Add "Add +" buttons for each category

### Step 3: Build Add/Edit Pages

Start with medications:
1. Create `AddMedicationPage.tsx`
2. Form with: nombre, dosis, frecuencia, motivo, activo
3. Submit via ApiClient.addMedication()
4. On success, redirect to /medical-history

Then edit page:
1. Create `EditMedicationPage.tsx`
2. Load medication data on mount
3. Pre-populate form
4. Submit via ApiClient.updateMedication()
5. Add delete button

Repeat for: Vaccines, Surgeries, Emergency Contacts

### Step 4: Build Habits Page

1. Load habits on mount (may be empty)
2. Show form with all fields
3. If habits exist: Pre-populate and PUT
4. If no habits: Create first time then PUT after

### Step 5: Update Dashboard

1. Show summary of all items
2. Link items to detail pages
3. Show counts in stats

### Step 6: Add Routes

Update routing to include all new pages

---

## Priority Implementation Order

### 🔴 HIGH PRIORITY (Must Have)

1. **MedicalHistoryPage** - List all items
2. **AddMedicationPage** + **EditMedicationPage** - Full medication CRUD
3. **ConfirmDeleteModal** - Delete confirmation
4. **Routing** - Setup all page routes

### 🟡 MEDIUM PRIORITY (Should Have)

5. **AddVaccinePage** + **EditVaccinePage** - Vaccine CRUD
6. **AddSurgeryPage** + **EditSurgeryPage** - Surgery CRUD
7. **AddEmergencyContactPage** + **EditEmergencyContactPage** - Contact CRUD
8. **HabitsPage** - Habits management

### 🟢 LOW PRIORITY (Nice to Have)

9. Dashboard integration with all items
10. Advanced filtering/sorting
11. Batch operations
12. Export/import functionality

---

## Form Validation Rules

### Medications
- ✅ nombre: Required, 2-200 chars
- ⚠️ dosis: Optional, max 100 chars
- ⚠️ frecuencia: Optional, max 100 chars
- ⚠️ motivo: Optional, max 255 chars

### Vaccines
- ✅ nombre: Required, 2-200 chars
- ⚠️ fecha_aplicacion: Optional, valid date
- ⚠️ numero_dosis: Optional, must be >= 1
- ⚠️ lote: Optional, max 100 chars

### Surgeries
- ✅ nombre_procedimiento: Required, 2-255 chars
- ⚠️ fecha: Optional, valid date
- ⚠️ hospital: Optional, max 255 chars
- ⚠️ complicaciones: Optional

### Emergency Contacts
- ✅ nombre: Required, 2-200 chars
- ✅ telefono: Required, 7-20 chars, phone format
- ✅ relacion: Required, 2-100 chars

### Habits
- ⚠️ All optional with sensible defaults
- ⚠️ consume_alcohol: one of "nunca", "ocasional", "frecuente"
- ⚠️ nivel_ejercicio: one of "sedentario", "leve", "moderado", "intenso"

---

## Error Handling

### Expect These HTTP Status Codes:
- **201 Created** - Successful POST
- **200 OK** - Successful GET/PUT
- **204 No Content** - Successful DELETE
- **404 Not Found** - Item/user doesn't exist
- **409 Conflict** - Habits already registered
- **422 Unprocessable Entity** - Validation error
- **500 Internal Server Error** - Server error

### User Feedback:
- Show error alert for 4xx/5xx
- Show loading spinner while saving
- Show success toast on completion
- Show confirmation before delete

---

## Testing Checklist

After implementation, test these flows:

### Medications
- [ ] Create medication - save successfully
- [ ] List medications - shows all items
- [ ] Edit medication - updates in DB
- [ ] Delete medication - removed from list
- [ ] Form validation - error messages show
- [ ] Navigate back - data persists

### Vaccines
- [ ] Create vaccine with date picker
- [ ] Edit vaccine
- [ ] Delete vaccine

### Surgeries
- [ ] Create surgery with date picker
- [ ] Edit surgery  
- [ ] Delete surgery

### Emergency Contacts
- [ ] Create contact with phone validation
- [ ] Edit contact
- [ ] Delete contact

### Habits
- [ ] Create habits first time
- [ ] 409 conflict shows appropriate message
- [ ] Edit habits updates in DB
- [ ] Dropdown values work correctly

### Dashboard
- [ ] Shows summary of all items
- [ ] Links to detail pages work
- [ ] Counts are accurate

---

## File Structure

```
frontend/components/
├── MedicalHistoryPage.tsx              ← UPDATE
├── medications/
│   ├── AddMedicationPage.tsx           ← NEW
│   └── EditMedicationPage.tsx          ← NEW
├── vaccines/
│   ├── AddVaccinePage.tsx              ← NEW
│   └── EditVaccinePage.tsx             ← NEW
├── surgeries/
│   ├── AddSurgeryPage.tsx              ← NEW
│   └── EditSurgeryPage.tsx             ← NEW
├── emergency-contacts/
│   ├── AddEmergencyContactPage.tsx     ← NEW
│   └── EditEmergencyContactPage.tsx    ← NEW
├── habits/
│   └── HabitsPage.tsx                  ← NEW
└── shared/
    ├── ConfirmDeleteModal.tsx          ← NEW
    └── MedicalItemCard.tsx             ← NEW

frontend/
├── api-client.ts                       ← UPDATE with helper methods
```

---

## Estimated Timeline

- **MedicalHistoryPage**: 2 hours
- **Medication pages**: 2 hours
- **Vaccine pages**: 2 hours
- **Surgery pages**: 2 hours
- **Emergency contact pages**: 2 hours
- **Habits page**: 1.5 hours
- **Shared components**: 1 hour
- **Dashboard integration**: 1 hour
- **Testing**: 2 hours

**Total: ~15.5 hours**

---

## Success Criteria

✅ All CRUD operations work for each item type
✅ Forms validate input correctly
✅ Error messages display appropriately
✅ Delete confirmation prevents accidental deletion
✅ Data persists after page refresh
✅ Dashboard shows accurate summary
✅ Navigation between pages works smoothly
✅ API endpoints are called correctly
✅ Loading states show during operations
✅ No unhandled errors in console

---

## Next Actions

1. Update plan.md with task assignments
2. Start with MedicalHistoryPage update
3. Build medication pages
4. Continue with other item types
5. Integrate dashboard
6. Full testing

**Ready to build Phase 3! 🚀**

# 🧪 Testing - Fase 3 & 5 (Medical CRUD + QR)

## Estado Actual ✅

Todas las rutas y componentes están **CREADOS Y CONECTADOS**:

### Rutas Creadas
- ✅ `/add-medication` → Agregar medicamento
- ✅ `/edit-medication?id=X` → Editar medicamento
- ✅ `/add-vaccine` → Agregar vacuna
- ✅ `/edit-vaccine?id=X` → Editar vacuna
- ✅ `/add-surgery` → Agregar cirugía
- ✅ `/edit-surgery?id=X` → Editar cirugía
- ✅ `/add-emergency-contact` → Agregar contacto de emergencia
- ✅ `/edit-emergency-contact?id=X` → Editar contacto de emergencia
- ✅ `/add-habits` → Registrar/editar hábitos
- ✅ `/generate-qr` → Generar código QR

### Componentes Creados (14 nuevos)
1. **AddMedicationPage.tsx** - Formulario para agregar medicamento
2. **EditMedicationPage.tsx** - Formulario para editar medicamento
3. **AddVaccinePage.tsx** - Formulario para agregar vacuna
4. **EditVaccinePage.tsx** - Formulario para editar vacuna
5. **AddSurgeryPage.tsx** - Formulario para agregar cirugía
6. **EditSurgeryPage.tsx** - Formulario para editar cirugía
7. **AddEmergencyContactPage.tsx** - Formulario para agregar contacto
8. **EditEmergencyContactPage.tsx** - Formulario para editar contacto
9. **AddHabitsPage.tsx** - Formulario para registrar hábitos
10. **MedicalItemCard.tsx** - Tarjeta reutilizable para mostrar items
11. **ConfirmDeleteModal.tsx** - Modal de confirmación de eliminación
12. **MedicalHistoryPage.tsx** - Actualizado con 5 tabs y rutas
13. **GenerateQRPage.tsx** - Actualizado con integración backend
14. **api-client.ts** - Actualizado con 20+ métodos CRUD

---

## 🚀 Cómo Hacer Testing

### Paso 1: Iniciar Backend

Abre una terminal en la carpeta raíz y ejecuta:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Espera a ver:
```
Uvicorn running on http://0.0.0.0:8000
```

### Paso 2: Iniciar Frontend

Abre otra terminal en la carpeta raíz y ejecuta:

```bash
cd frontend
npm run dev
```

Espera a ver:
```
- Local:        http://localhost:3000
```

### Paso 3: Testing Manual en Navegador

Accede a: **http://localhost:3000/login**

**Registro de usuario de prueba:**
```
Email: test@example.com
Contraseña: password123
```

Luego ir a:
**http://localhost:3000/dashboard → Historial Médico**

---

## 📋 Plan de Pruebas

### Test 1: Medicamentos (Medications)
```
1. Clic en tab "Medicamentos"
2. Clic en "Agregar Medicamento"
   ✓ Verifica que navega a /add-medication
3. Llenar formulario:
   - Nombre: Paracetamol
   - Dosis: 500mg
   - Frecuencia: Cada 8 horas
   - Motivo: Dolor de cabeza
   - Activo: Si
4. Clic en "Guardar"
   ✓ Verifica que aparece en la lista
   ✓ Verifica mensaje de éxito
5. Clic en "Editar" en el medicamento
   ✓ Verifica que navega a /edit-medication?id=X
6. Cambiar "Motivo" a "Fiebre"
7. Clic en "Guardar"
   ✓ Verifica que se actualiza correctamente
8. Clic en "Eliminar"
   ✓ Verifica modal de confirmación
9. Confirmar eliminación
   ✓ Verifica que desaparece de la lista
```

### Test 2: Vacunas (Vaccines)
```
1. Clic en tab "Vacunas"
2. Clic en "Agregar Vacuna"
   ✓ Verifica que navega a /add-vaccine
3. Llenar formulario:
   - Nombre: Pfizer COVID-19
   - Fecha: 15/03/2024
   - Lote: ABC123
   - Lugar: Hospital Central
4. Clic en "Guardar"
   ✓ Verifica que aparece en la lista
5. Clic en "Editar"
   ✓ Verifica que navega a /edit-vaccine?id=X
6. Modificar "Lugar"
7. Guardar y verificar actualización
```

### Test 3: Cirugías (Surgeries)
```
1. Clic en tab "Cirugías"
2. Agregar cirugía (/add-surgery)
3. Editar cirugía (/edit-surgery?id=X)
4. Eliminar cirugía (con confirmación)
```

### Test 4: Contactos de Emergencia
```
1. Clic en tab "Contactos Emergencia"
2. Agregar contacto (/add-emergency-contact)
   - Nombre: Juan Pérez
   - Teléfono O Email (al menos uno)
   - Relación: Hermano
3. Editar contacto (/edit-emergency-contact?id=X)
4. Eliminar contacto
```

### Test 5: Hábitos (Habits)
```
1. Clic en tab "Hábitos"
2. Clic en "Editar" (o si es primera vez, botón de agregar)
   ✓ Verifica que navega a /add-habits
3. Llenar formulario:
   - Fuma: No
   - Bebe alcohol: Ocasionalmente
   - Ejercita: 3 veces por semana
   - Dieta: Balanceada
   - Horas sueño: 8
4. Guardar
   ✓ Verifica que se guarda (no hay lista, es 1:1 con MedicalRecord)
```

### Test 6: QR Code
```
1. Ir a http://localhost:3000/generate-qr
2. Debe mostrar código QR autogenerado del servidor
3. Clic en "Descargar" - descarga imagen QR
4. Clic en "Compartir" - copia link compartible
5. Clic en "Imprimir" - abre diálogo de impresión
```

---

## ✅ Criterios de Éxito

Cada test debe cumplir:
- ✅ Navegación correcta a la ruta
- ✅ Formulario carga correctamente
- ✅ Validaciones funcionan (campos requeridos)
- ✅ Datos se guardan en backend (GET retorna datos)
- ✅ Edición actualiza correctamente
- ✅ Eliminación confirma y remueve
- ✅ Redirecciones funcionan
- ✅ Mensajes de éxito/error aparecen

---

## 🐛 Troubleshooting

### Error: "Usuario no autenticado"
- Verifica que estés logged in
- Revisa localStorage: `localStorage.authToken`

### Error: 404 en ruta
- Verifica que la ruta existe: `/frontend/app/[ruta]/page.tsx`
- Recarga página (Ctrl+F5)

### Error: Datos no se guardan
- Verifica que backend está corriendo en puerto 8000
- Revisa console del navegador (F12) para ver errores
- Revisa terminal del backend para ver logs

### Error: Formulario no valida
- Revisa que los campos requeridos estén indicados
- Intenta enviar formulario vacío - debe mostrar error

---

## 📊 Resumen de Cobertura

| Feature | Add | Edit | Delete | Status |
|---------|-----|------|--------|--------|
| Medicamentos | ✅ | ✅ | ✅ | Ready |
| Vacunas | ✅ | ✅ | ✅ | Ready |
| Cirugías | ✅ | ✅ | ✅ | Ready |
| Contactos | ✅ | ✅ | ✅ | Ready |
| Hábitos | ✅ | ✅ | ✗ | Ready |
| QR Code | - | - | - | Ready |

---

## 📝 Notas Importantes

1. **Hábitos (Habits)** es relación 1:1 con MedicalRecord
   - Solo puede haber UN registro de hábitos por usuario
   - No hay eliminación de hábitos
   - Botón cambia de "Agregar" a "Editar"

2. **Contactos de Emergencia**
   - Requiere NOMBRE obligatorio
   - TELÉFONO o EMAIL (al menos uno)
   - RELACIÓN opcional

3. **Medicamentos/Vacunas/Cirugías**
   - Todos los campos son obligatorios
   - Los IDs se pasan por query params (?id=X)
   - Validaciones en cliente y servidor

4. **QR Code**
   - Se genera automáticamente en backend
   - Cambios en perfil del usuario generan nuevo QR

---

## 🎯 Resultado Final

Si TODOS los tests pasan:
✅ Fase 3 (Medical CRUD) completada
✅ Fase 5 (QR) completada
✅ Rutas conectadas exitosamente
✅ Backend-Frontend integrados

Próximo: **Fase 6 - Testing y pulido general**

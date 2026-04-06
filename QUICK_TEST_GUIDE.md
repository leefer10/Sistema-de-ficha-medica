# 🎬 GUÍA RÁPIDA: Ejecutar y Probar Todo

## Resumen de lo Completado

✅ **Componentes creados:** 14 nuevos  
✅ **Rutas creadas:** 9 nuevas  
✅ **Navegación actualizada:** MedicalHistoryPage  
✅ **Backend integrado:** 20+ métodos CRUD  

---

## 🚀 Pasos para Probar

### Paso 1: Terminal 1 - Iniciar Backend

Abre PowerShell/CMD y ejecuta:

```powershell
cd "C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\backend"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Espera a ver:
```
Uvicorn running on http://0.0.0.0:8000
```

---

### Paso 2: Terminal 2 - Iniciar Frontend

Abre otra terminal y ejecuta:

```powershell
cd "C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\frontend"
npm run dev
```

Espera a ver:
```
- Local:        http://localhost:3000
```

---

### Paso 3: Navegador - Prueba Completa

1. Abre: **http://localhost:3000/login**

2. **Registra un usuario nuevo o inicia sesión**
   - Email: test@example.com
   - Contraseña: password123

3. Ve a: **Dashboard → Historial Médico**

4. **Prueba Medicamentos:**
   - Clic en tab "Medicamentos"
   - Clic en "Agregar Medicamento"
   - Verifica que va a `/add-medication`
   - Llena el formulario:
     ```
     Nombre: Paracetamol
     Dosis: 500 mg
     Frecuencia: Cada 8 horas
     Motivo: Dolor
     Activo: Sí
     ```
   - Clic en "Guardar"
   - Verifica que aparece en la lista
   - Clic en "Editar"
   - Verifica que va a `/edit-medication?id=1`
   - Cambia el motivo a "Fiebre"
   - Clic en "Guardar"
   - Verifica que se actualizó
   - Clic en "Eliminar" → Confirmar
   - Verifica que desaparece

5. **Prueba Vacunas:**
   - Mismo proceso pero con tab "Vacunas"
   - Rutas: `/add-vaccine` y `/edit-vaccine?id=X`

6. **Prueba Cirugías:**
   - Mismo proceso pero con tab "Cirugías"
   - Rutas: `/add-surgery` y `/edit-surgery?id=X`

7. **Prueba Contactos:**
   - Mismo proceso pero con tab "Contactos Emergencia"
   - Rutas: `/add-emergency-contact` y `/edit-emergency-contact?id=X`
   - Nota: Solo necesita NOMBRE + (TELÉFONO O EMAIL)

8. **Prueba Hábitos:**
   - Clic en tab "Hábitos"
   - Clic en "Editar" (si es primera vez muestra "Agregar")
   - Verifica que va a `/add-habits`
   - Llena el formulario
   - Clic en "Guardar"
   - Verifica que se guardó

9. **Prueba QR:**
   - Ve a: **http://localhost:3000/generate-qr**
   - Verifica que muestra un código QR
   - Clic en "Descargar" - debe descargar imagen
   - Clic en "Compartir" - debe copiar link
   - Clic en "Imprimir" - debe abrir diálogo

---

## ✅ Si Todo Funciona

Verás:
- ✅ Todas las rutas navegan correctamente
- ✅ Los formularios se llenan y validan
- ✅ Los datos se guardan en la base de datos
- ✅ Edición actualiza los datos
- ✅ Eliminación remueve los registros
- ✅ QR code se genera correctamente

---

## ❌ Si Algo Falla

### Error: "Usuario no autenticado"
```
1. Abre Console (F12)
2. Revisa localStorage.authToken
3. Si está vacío, inicia sesión de nuevo
```

### Error: 404 en ruta
```
1. Verifica la URL exacta en navegador
2. Presiona Ctrl+F5 para limpiar caché
3. Revisa que los archivos existen:
   C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\frontend\app\[ruta]\page.tsx
```

### Error: Datos no se guardan
```
1. Abre Console del navegador (F12)
2. Busca error rojo
3. Revisa Terminal del Backend para ver logs
4. Verifica que Backend está en puerto 8000
```

### Error: Formulario no valida
```
1. Revisa que todos los campos obligatorios estén llenos
2. Verifica que Backend retorna error de validación
3. Revisa los requisitos en TESTING_PHASE_3_5.md
```

---

## 📊 Resumen de Rutas

| Acción | Ruta | Estado |
|--------|------|--------|
| Agregar Medicamento | `/add-medication` | ✅ |
| Editar Medicamento | `/edit-medication?id=X` | ✅ |
| Agregar Vacuna | `/add-vaccine` | ✅ |
| Editar Vacuna | `/edit-vaccine?id=X` | ✅ |
| Agregar Cirugía | `/add-surgery` | ✅ |
| Editar Cirugía | `/edit-surgery?id=X` | ✅ |
| Agregar Contacto | `/add-emergency-contact` | ✅ |
| Editar Contacto | `/edit-emergency-contact?id=X` | ✅ |
| Agregar/Editar Hábitos | `/add-habits` | ✅ |
| Generar QR | `/generate-qr` | ✅ |

---

## 🎯 Documentación Disponible

- 📖 **ROUTE_CONNECTION_COMPLETE.md** - Resumen técnico de lo hecho
- 🧪 **TESTING_PHASE_3_5.md** - Plan detallado de testing
- 📋 **INTEGRATION_PLAN.md** - Plan general del proyecto

---

¡Listo! Ahora a probar todo 🚀

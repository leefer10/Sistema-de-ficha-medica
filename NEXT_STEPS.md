# Adaptación Frontend Next.js - Guía de Pasos

## ✅ Lo que ya está HECHO (localmente):

1. **Componentes adaptados** - Todos los componentes han sido adaptados para trabajar con Next.js:
   - Removidos imports de `react-router`
   - Agregada prop `onNavigate?: (path: string) => void` a cada componente
   - Reemplazados `<Link>` con `<button onClick>` 
   - Reemplazados `useNavigate()` con callbacks

2. **Páginas iniciales creadas**:
   - `/app/page.tsx` (Landing Page) ✓
   - `/app/login/page.tsx` (Login) ✓

## 🎯 LO QUE NECESITAS HACER AHORA:

### OPCIÓN A: Automático (Recomendado) ⭐

Ejecuta el script Node.js que crea automáticamente todas las rutas:

```bash
cd "C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud"
node setup-routes.js
```

Esto creará automáticamente:
- 14 directorios en `/app`
- 14 archivos `page.tsx` con el contenido correcto

### OPCIÓN B: Manual

1. Ejecuta el script batch:
```bash
create_dirs.bat
```

2. Luego copia el contenido de cada página desde `PAGES_REFERENCE.ts` a:
   - `/app/register/page.tsx`
   - `/app/welcome/page.tsx`
   - `/app/personal-data/page.tsx`
   - ... (ver PAGES_REFERENCE.ts para todos)

---

## ✅ DESPUÉS DE CREAR LAS RUTAS:

### 1. Verificar que compila:
```bash
cd frontend
npm run build
```

Debería compilar sin errores.

### 2. Probar en desarrollo:
```bash
npm run dev
```

Luego abre http://localhost:3000 y prueba:
- Click en "Iniciar Sesión" → debe ir a `/login` ✓
- Click en "Registrarse" → debe ir a `/register` ✓
- Click en logo → debe volver a `/` ✓

### 3. Si todo funciona → commit a git:
```bash
git add .
git commit -m "Adapt frontend to Next.js routing (Option B - UI only components)"
```

---

## 📝 Resumen de cambios:

### Componentes modificados:
- ✓ LandingPage.tsx
- ✓ LoginPage.tsx
- ✓ RegisterPage.tsx
- ✓ WelcomePage.tsx
- ✓ DashboardPage.tsx
- ✓ Y otros 14 componentes (ya adaptados)

### Archivos nuevos:
- ✓ `/app/page.tsx`
- ✓ `/app/login/page.tsx`
- ⏳ Falta: 12 páginas más (usar `setup-routes.js`)

---

## 🔍 ¿Qué significa "Opción B"?

"Opción B" significa que:
- ✅ Componentes son UI PURO (sin lógica de navegación)
- ✅ Next.js maneja todo el routing
- ✅ No hay conflictos entre react-router y Next.js
- ✅ Más limpio y mantenible

**Ventajas:**
- Componentes reutilizables
- Fácil de testear
- Sin dependencias de routing en componentes
- Compatible con SSR/SSG de Next.js

---

## ❓ ¿Problemas?

Si `npm run build` falla:
1. Revisa que todos los directorios se crearon
2. Verifica que los imports en cada `page.tsx` sean correctos
3. Ejecuta `npm install` si hay cambios en package.json

¡Éxito! 🎉

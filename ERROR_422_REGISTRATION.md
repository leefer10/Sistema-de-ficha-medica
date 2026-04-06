# Error 422 - Registro Fallido

## Problema
Recibiste un error **422 (Unprocessable Content)** al intentar registrarse.

## Causa
La contraseña **no cumple con los requisitos de validación**.

---

## Requisitos de Contraseña

La contraseña debe tener:

1. ✅ **Mínimo 8 caracteres** (máximo 128)
2. ✅ **Al menos una letra MAYÚSCULA** (A-Z)
3. ✅ **Al menos una letra minúscula** (a-z)
4. ✅ **Al menos un número** (0-9)

---

## ¿Por qué falló `password123`?

```
Contraseña: password123
- Caracteres: 11 ✓ (cumple)
- Mayúsculas: NO ✗ (FALLA - no tiene ninguna mayúscula)
- Minúsculas: sí ✓
- Números: sí ✓ (tiene "123")
```

---

## Solución

Usa una contraseña que tenga mayúsculas. Ejemplos válidos:

```
✓ Password123
✓ MySecurePass123
✓ Test@Password456
✓ Admin2024Pass
```

---

## Formulario de Registro - Ejemplo Correcto

```
Nombre completo: test example
Email: test@example.com
Contraseña: Password123          ← Con mayúscula
Confirmar contraseña: Password123
Términos: Aceptado
```

---

## Mensaje de Error Exacto

Si falla, FastAPI retorna:

```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "La contraseña debe tener al menos una letra mayuscula",
      "type": "value_error"
    }
  ]
}
```

---

## Intenta Nuevamente

Cambiar la contraseña a: **`Password123`** y vuelve a intentar registrarte.

Si sigue fallando, verifica en la consola del navegador (F12) qué dice el error exacto.

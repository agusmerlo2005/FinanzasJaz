# Finanzas de Jazmín 🎀

App personal de **debe & haber** (ingresos y gastos) con reloj en vivo de Argentina,
perfil personalizable y datos en Google Sheets (o local).

## 🚀 Probarla ya (modo local)

```bash
npm install
npm run dev
```

Abrí la URL que aparece (normalmente http://localhost:5173).

**Login:**
- Usuario: `Jazmin De Grande Muscatelo`
- Contraseña: `20032010Jaz`

> En modo local, los movimientos se guardan en el navegador de la compu donde se usa.
> El perfil (foto, cumple, apodo) **siempre** se guarda local en el dispositivo.

## ☁️ Conectar a Google Sheets (opcional)

1. Creá una **Google Sheet** nueva.
2. Menú **Extensiones → Apps Script**.
3. Borrá lo que haya y pegá el contenido de [`apps-script/Code.gs`](apps-script/Code.gs).
4. Guardá y andá a **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquiera**
5. Copiá la **URL de la app web** (termina en `/exec`).
6. Pegala en [`src/config.js`](src/config.js) en `APPS_SCRIPT_URL`.
7. Listo: los movimientos van y vienen de la planilla. Se crea sola la pestaña `Movimientos`.

## 🌐 Publicarla (Vercel)

```bash
npm run build
```

Subí el proyecto a Vercel (framework: **Vite**). Preset automático, sin config extra.

## 📲 Instalarla como app (PWA)

La app es **instalable**: se puede bajar al escritorio de la PC o a la pantalla
de inicio del celular, y se abre en su propia ventana (sin barra del navegador).

- **PC (Chrome/Edge):** aparece un ícono de instalar ⊕ en la barra de direcciones,
  o usá el botón **"⬇ Instalar app"** que sale arriba en la propia página.
- **Android (Chrome):** menú ⋮ → *Instalar aplicación* / *Agregar a pantalla de inicio*.
- **iPhone (Safari):** botón *Compartir* → *Agregar a pantalla de inicio*.

> Para que la instalación funcione tiene que estar servida por **HTTPS**
> (Vercel ya lo hace) o en `localhost`. Una vez instalada, funciona incluso
> sin internet gracias al *service worker*.

## 🎨 Personalizar

- **Contraseña / usuario:** `src/config.js` → `AUTH`
- **Categorías y emojis:** `src/config.js` → `CATEGORIAS`
- **Colores y estética:** `src/index.css` (variables al inicio)
- **Perfil:** se edita desde la propia app (botón *Editar perfil*).

## ⚠️ Sobre la seguridad

El login es una **traba simbólica**: la contraseña vive en el código del navegador,
así que no es seguridad de verdad. Para una app personal está perfecto, pero no
la uses para guardar datos sensibles como si fuera un banco. 💛

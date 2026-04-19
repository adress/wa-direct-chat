# wa-direct-chat

Extensión de Chrome que permite enviar mensajes directos de WhatsApp a cualquier número de teléfono sin necesidad de tenerlo guardado en contactos.

## Descripción

La extensión abre un popup donde el usuario ingresa el código de país, número de teléfono y mensaje. Al hacer clic en "Enviar", abre WhatsApp (Web o Desktop) con la conversación y mensaje pre-cargados usando la URL pública de WhatsApp.

```
https://{domain}/send/?phone={codigoPais}{numero}&text={mensaje}
```

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| TypeScript | ^5.4 | Lenguaje principal |
| Webpack | ^5.75 | Bundler / compilación |
| ESLint | ^8.57 | Linting |
| Prettier | ^3.2 | Formateo de código |
| Chrome Extension API | Manifest V3 | API del navegador |
| ts-loader | ^9.4 | Carga TypeScript en Webpack |
| copy-webpack-plugin | ^11.0 | Copia assets estáticos al build |

## Estructura del proyecto

```
wa-direct-chat/
├── src/
│   └── popup.ts              # Lógica principal: captura inputs y abre WhatsApp
├── public/
│   ├── manifest.json         # Manifiesto de la extensión (Manifest V3)
│   ├── wa-direct.html        # UI del popup
│   └── styles.css            # Estilos del popup
├── webpack/
│   └── webpack.config.js     # Configuración del build (dev y prod)
├── .eslintrc.json            # Configuración ESLint
├── .prettierrc               # Configuración Prettier
├── tsconfig.json             # Configuración TypeScript
└── package.json              # Dependencias y scripts
```

El output del build se genera en `dist/` (ignorado en git).

## Requisitos previos

- Node.js >= 14
- npm >= 6
- Google Chrome (o cualquier navegador Chromium)

## Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo con watch (recompila automáticamente al guardar)
npm run dev

# Build de producción (minificado)
npm run build
```

## Cargar la extensión en Chrome

1. Ejecutar `npm run build` (o tener `npm run dev` corriendo)
2. Abrir Chrome y navegar a `chrome://extensions/`
3. Activar **Modo desarrollador** (toggle en la esquina superior derecha)
4. Clic en **"Cargar descomprimida"**
5. Seleccionar la carpeta `dist/`

Con `npm run dev` activo, basta con recargar la extensión en `chrome://extensions/` cada vez que guardas un cambio.

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run build` | Build de producción minificado |
| `npm run dev` | Watch mode para desarrollo (recompila al guardar) |
| `npm run lint` | Verifica errores de estilo con ESLint |
| `npm run lint:fix` | Corrige automáticamente errores de ESLint |
| `npm run format` | Formatea el código con Prettier |

## Calidad de código

El proyecto usa **ESLint** con el plugin de TypeScript y **Prettier** para mantener consistencia en el código.

```bash
# Verificar antes de hacer commit
npm run lint
npm run format
```

La configuración ESLint (`.eslintrc.json`) incluye:
- Reglas recomendadas de TypeScript (`@typescript-eslint/recommended`)
- Integración con Prettier para evitar conflictos (`eslint-config-prettier`)

## Flujo de usuario

1. El usuario hace clic en el ícono de la extensión
2. Se abre el popup (`wa-direct.html`)
3. El usuario selecciona:
   - **Plataforma:** WhatsApp Web (`web.whatsapp.com`) o Escritorio (`api.whatsapp.com`)
   - **País:** selector con código internacional
   - **Número de teléfono:** sin código de país
   - **Mensaje:** texto a enviar
4. Al hacer clic en **Enviar**, se abre una nueva pestaña con la URL de WhatsApp

## Cómo funciona el código

### `src/popup.ts`

Único módulo TypeScript del proyecto:

- **`getValueFront(id, htmlElement?)`** — helper que obtiene el valor de un elemento del DOM por su ID
- **Listener `DOMContentLoaded`** — espera que el popup cargue y registra el handler del botón
- **Handler del botón** — lee los inputs, construye la URL de WhatsApp y abre una nueva pestaña con `chrome.tabs.create()`

```typescript
// URL generada
// https://web.whatsapp.com/send/?phone=573001234567&text=Hola%20mundo
```

### `public/manifest.json`

Manifest V3: `action.default_popup` apunta a `wa-direct.html`.

## Build

El modo (`development` / `production`) se pasa como argumento desde el script npm. Webpack resuelve extensiones `.ts` y `.js`. TypeScript 5 con `strict: true` y target ES2016.

```
src/popup.ts  →  dist/popup.js
public/*      →  dist/*
```

## Agregar países

El selector de países está en [public/wa-direct.html](public/wa-direct.html). Para agregar un país, agregar un `<option>` al select `#countryCodeWA`:

```html
<option value="44">🇬🇧 +44</option>
```

## Contribuir

1. Hacer fork del repositorio
2. Crear una rama: `git checkout -b feature/mi-feature`
3. Desarrollar con watch activo: `npm run dev`
4. Verificar calidad: `npm run lint && npm run format`
5. Build final: `npm run build` y probar la extensión en Chrome
6. Hacer commit y abrir un Pull Request hacia `develop`

No hay suite de tests automatizados; las pruebas son manuales cargando la extensión en Chrome.

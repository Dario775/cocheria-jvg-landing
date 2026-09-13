# Cochería J.V. González — Portal Institucional & Velatorios Online

[![Producción Vercel](https://img.shields.io/badge/Vercel-Producción-black?style=flat&logo=vercel)](https://www.cocheriajvgonzalez.com.ar)
[![Dominio Oficial](https://img.shields.io/badge/Dominio-www.cocheriajvgonzalez.com.ar-gold?style=flat)](https://www.cocheriajvgonzalez.com.ar)
[![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime_DB-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)

Portal web oficial y plataforma interactiva de servicios fúnebres de **Cochería J.V. González**, empresa líder en servicios exequiales, salas velatorias climatizadas, traslados nacionales y acompañamiento integral a las familias en **Joaquín V. González**, **San José de Metán**, **General Güemes** y todo el Departamento de Anta, Salta.

🌐 **Sitio Web Oficial en Producción:** [https://www.cocheriajvgonzalez.com.ar](https://www.cocheriajvgonzalez.com.ar)

---

## 🌟 Características Principales

### 1. 🕯️ Obituario Digital & Servicios Vigentes (100% Dinámico)
- **Sincronización en Tiempo Real:** Conectado directamente a **Supabase** (`wake_services` y `wake_condolences`), sin datos ficticios o hardcodeados.
- **Filtros de Estado Precisos:**
  - *Todos los servicios*: Histórico y actuales.
  - *En Sala de Velación*: Capillas con velatorio activo en curso (indicador pulsante en vivo).
  - *Descanso Eterno*: Servicios concluidos e inhumaciones.
- **Homenajes Simbólicos & Condolencias:**
  - Encendido virtual de velas conmemorativas (persiste en base de datos).
  - Publicación y moderación de condolencias ciudadanas en tiempo real.
  - Ofrendas florales, oraciones y recordatorios.
- **Tratamiento Digno de Imágenes:** Monograma sobrio con las iniciales del difunto ante servicios sin fotografía digital o errores de carga.
- **Compartir en Redes Sociales:** Integración nativa con Web Share API, WhatsApp, Facebook y copiado de enlace.

### 2. 📡 Capilla Ardiente Virtual & Streaming en Vivo (`/velatorio/:id`)
- **Acceso Privado Familiar:** Control de ingreso mediante **PIN de 4 dígitos** para proteger la intimidad familiar.
- **Transmisión de Video en Directo:** Soporte para YouTube Live (canales y directos) y fuentes HLS compatibles con cámaras IP de sala.
- **Muro de Condolencias en Pantalla:** Actualización reactiva vía WebSockets de los mensajes y velas encendidas durante la ceremonia.

### 3. 📺 Panel de Gestión de Velatorios & Modo Kiosco TV Box (`/admin/velatorios`)
- **Barra de Herramientas Unificada:** Interfaz minimalista y ergonómica con buscador rápido, selectores de sucursal, contadores de estado y cambio de tema claro/oscuro.
- **Alta y Edición de Servicios:** Formulario validado y sanitizado para datos del homenajeado, horarios de cortejo, sala asignada, PIN y URL de streaming.
- **Kiosco TV Box para Capillas:** Asignación remota de transmisiones o pantallas de bienvenida a dispositivos Android TV / TV Box instalados en cada sala.
- **Cola de Moderación:** Aprobación o rechazo de mensajes de pésame antes de su proyección pública.

### 4. 🏛️ Módulos Institucionales
- **Sedes Regionales:** Presentación interactiva de las casas velatorias en Joaquín V. González, Metán y Güemes.
- **Guía Asistencial ante Deceso:** Modal explicativo en 3 pasos con los procedimientos legales y administrativos ante el fallecimiento de un familiar.
- **Llamada de Guardia 24hs & WhatsApp Urgencias:** Botones de enlace telefónico prioritario siempre accesibles.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite 6 |
| **Estilos & UI** | Tailwind CSS, Lucide React Icons |
| **Animaciones** | Framer Motion |
| **Backend & Realtime** | Supabase (PostgreSQL + Realtime WebSockets) |
| **Enrutamiento** | React Router DOM v6 |
| **Despliegue** | Vercel (Edge Network + SSL Automático) |

---

## 📁 Estructura del Proyecto

```text
landing/
├── public/
│   ├── favicon.svg            # Isotipo oficial de la Cochería
│   ├── robots.txt             # Directivas para buscadores
│   └── sitemap.xml            # Mapa del sitio para indexación SEO
├── src/
│   ├── components/
│   │   ├── DigitalObituary.tsx        # Sección pública de obituarios dinámicos
│   │   ├── ObituaryDetailModal.tsx    # Modal conmemorativo y libro de condolencias
│   │   ├── Navbar.tsx                 # Barra de navegación principal
│   │   ├── Hero.tsx                   # Portada principal con video/imagen solemne
│   │   ├── RegionalBranchesSection.tsx # Sedes y salas velatorias
│   │   ├── ServicesSection.tsx        # Catálogo de servicios exequiales
│   │   ├── BereavementGuideModal.tsx  # Guía asistencial "¿Qué hacer?"
│   │   ├── streaming/
│   │   │   └── VirtualWakeRoom.tsx    # Sala virtual de velatorio en vivo
│   │   └── logos/
│   │       └── CompanyLogos.tsx       # Emblemas vectoriales de la marca
│   ├── context/
│   │   ├── WakeServicesContext.tsx    # Proveedor de estado y conexión Supabase
│   │   └── ThemeContext.tsx           # Contexto de tema Claro / Oscuro
│   ├── pages/
│   │   ├── LandingHomePage.tsx        # Página principal de la landing
│   │   ├── VirtualWakePage.tsx        # Vista de acceso a capilla virtual
│   │   └── admin/
│   │       └── AdminDashboardPage.tsx # Panel administrativo de guardia y TV Box
│   ├── lib/
│   │   └── supabase.ts                # Inicialización del cliente Supabase
│   ├── utils/
│   │   ├── security.ts                # Funciones de sanitización (XSS, inputs)
│   │   └── shareUtils.ts              # Utilidades de compartición web
│   ├── types.ts                       # Definiciones TypeScript globales
│   ├── main.tsx                       # Punto de entrada de la aplicación
│   └── index.css                      # Estilos globales y tokens Tailwind
├── docs/
│   └── MANUAL_INSTALACION_TV_BOX.md  # Manual técnico para TVs en capillas
├── index.html                         # Plantilla HTML con metadatos SEO
├── vercel.json                        # Configuración de redirecciones SPA
├── vite.config.ts                     # Configuración de compilación Vite
└── package.json                       # Dependencias y scripts
```

---

## ⚙️ Variables de Entorno

Copie `.env.example` a `.env.local` y complete los valores:

```bash
# Dominio de Producción en Vercel
VITE_APP_URL="https://www.cocheriajvgonzalez.com.ar"

# Conexión a Supabase (Portal de Velatorios & Realtime)
VITE_SUPABASE_URL="https://pbrivnpozzqjyskfimje.supabase.co"
VITE_SUPABASE_ANON_KEY="tu_clave_publica_anon"

# URL de acceso al sistema CRM / Afiliados
VITE_CRM_URL="https://crm.cocheriajvgonzalez.com.ar"

# Opcional: Gemini API Key para asistencia inteligente
GEMINI_API_KEY=""
```

---

## 🚀 Instalación y Ejecución Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

4. **Previsualizar compilación de producción:**
   ```bash
   npm run preview
   ```

---

## ☁️ Despliegue en Vercel

El proyecto está optimizado para su despliegue continuo en **Vercel** conectado al repositorio de GitHub:

1. **Configuración de Build:**
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
2. **Variables de Entorno:**
   Configurar en el panel de Vercel (`Project Settings > Environment Variables`) las variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_APP_URL`.
3. **Dominio Personalizado:**
   - Dominio principal: `www.cocheriajvgonzalez.com.ar`
   - Redirección automática de `cocheriajvgonzalez.com.ar` hacia `www.cocheriajvgonzalez.com.ar`.
   - Certificado SSL automático emitido por Vercel.

---

## 🔒 Seguridad y Privacidad

- **Sanitización de Inputs:** Todas las cadenas de texto ingresadas por los usuarios (condolencias, nombres, notas) son procesadas con `sanitizeText` en [security.ts](file:///d:/Proyectos%20Neurocortex/Cocheria-JV-Gonzales/landing/src/utils/security.ts) para mitigar vectores de inyección XSS y caracteres maliciosos.
- **Acceso por PIN:** Las salas virtuales requieren PIN de acceso familiar para proteger la privacidad de los deudos.
- **CSP y Headers:** Configurados para permitir streaming embebido autorizado y WebSockets seguros (`wss://`).

---

## 📄 Licencia

Desarrollado para **Cochería J.V. González**. Todos los derechos reservados.

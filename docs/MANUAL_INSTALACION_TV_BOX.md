# Manual de Instalación y Operación: Sistema TV Box Kiosco para Salas Velatorias
**Cochería J.V. González** — Sistema Autónomo de Salas Velatorias & Pantallas Conmemorativas

---

## 1. Visión General del Sistema

El sistema **TV Box Kiosco** permite que cada sala velatoria física cuente con una pantalla conmemorativa profesional que opera de forma **100% desatendida (Cero Clics)**:

- **Para el personal de la sala (choferes, guardia):** Solo encienden el televisor o la zapatilla eléctrica.
- **Para la pantalla:** Enciende, abre en pantalla completa y muestra el estado actual sin necesidad de mouse, teclado ni control remoto.
- **Para el operador en la oficina:** Desde el **Panel de Guardia (`/admin`)** puede, con un solo clic:
  - Activar el **Modo Transmisión** con la foto, epitafio y datos del difunto.
  - Pasar a **Modo Espera** (reloj institucional de guardia 24hs cuando no hay velatorio).
  - Moderar y enviar condolencias en tiempo real que aparecen como avisos flotantes en la pantalla del televisor.

---

## 2. Requerimientos de Hardware

1. **Pantalla:** Televisor LED / Smart TV con entrada HDMI (1080p Full HD o 4K).
2. **Dispositivo Receptor:**
   - **Opción recomendada:** Cualquier **TV Box con Android** (Xiaomi Mi Box, Mecool, Tanix, TV Stick, Fire TV Stick) con Android 7.0 o superior y conexión Wi-Fi/Ethernet.
3. **Conectividad:** Conexión a Internet de la sucursal (Wi-Fi o cable de red).

---

## 3. Configuración Inicial del TV Box (Se realiza una sola vez)

Para que el TV Box funcione como una pantalla de aeropuerto o de hotel que arranca sola sin intervención, se utiliza la app **Fully Kiosk Browser** (gratuita en Google Play Store o instalable por APK mediante pendrive):

### Paso 1: Instalar la aplicación
- En el TV Box, abrir Google Play Store y buscar **Fully Kiosk Browser & Launcher**.
- O bien descargar el archivo APK oficial desde [fully-kiosk.com](https://www.fully-kiosk.com) e instalarlo.

### Paso 2: Configurar los 4 parámetros clave
Abrir el menú de configuración de Fully Kiosk (*Settings*):

1. **Web Browsing $\rightarrow$ Start URL (URL de Inicio):**
   Ingresar la dirección web correspondiente a la sala física del dispositivo:
   - Para Sala Magna A (J.V. González): `https://cocheria-jvg.com.ar/tv/TV-JVG-01`
   - Para Sala B (J.V. González): `https://cocheria-jvg.com.ar/tv/TV-JVG-02`
   - Para Sala Memorial (Metán): `https://cocheria-jvg.com.ar/tv/TV-MET-01`
   - Para Sala Güemes: `https://cocheria-jvg.com.ar/tv/TV-GUE-01`
   *(En pruebas locales reemplazar por: `http://IP_LOCAL:5173/tv/TV-JVG-01`)*

2. **Device Management $\rightarrow$ Run on Boot:**
   Activar en **ON**.
   *(Hace que la aplicación se inicie automáticamente en cuanto el TV Box recibe energía).*

3. **Device Management $\rightarrow$ Keep Screen On:**
   Activar en **ON**.
   *(Evita que el televisor se suspenda, se apague o active salvapantallas de Android).*

4. **Kiosk Mode $\rightarrow$ Enable Kiosk Mode:**
   Activar en **ON**.
   *(Oculta la barra de estado de Android, botones de inicio y bloquea el acceso a otras aplicaciones).*

---

## 4. Mapa de Dispositivos y Salas Registradas

| Código de Dispositivo | Sala Velatoria | Sucursal | URL Asignada |
| :--- | :--- | :--- | :--- |
| **`TV-JVG-01`** | Sala Magna A (Principal) | Casa Central • Joaquín V. González | `/tv/TV-JVG-01` |
| **`TV-JVG-02`** | Sala B (Capilla Menor) | Casa Central • Joaquín V. González | `/tv/TV-JVG-02` |
| **`TV-MET-01`** | Sala Memorial Metán | Sucursal San José de Metán | `/tv/TV-MET-01` |
| **`TV-GUE-01`** | Sala Jardín Güemes | Sucursal General Güemes | `/tv/TV-GUE-01` |

---

## 5. Operación Cotidiana desde el Panel de Guardia (`/admin`)

El personal administrativo u operador de turno gestiona las pantallas sin necesidad de acudir físicamente a las salas:

### A. Si NO hay velatorio en la sala:
- En la pestaña **Control TV Box**, la sala estará en **Modo Espera**.
- El televisor mostrará el logo institucional dorado de Cochería J.V. González, la hora oficial exacta en tipografía grande y el aviso de guardia permanente 24hs.

### B. Cuando ingresa un servicio velatorio:
1. En la pestaña **+ Nuevo Servicio**, cargar:
   - Nombre del homenajeado, años y edad.
   - Foto conmemorativa y horario de cortejo.
   - Seleccionar la sala asignada (ej: *Sala Magna A*).
   - Marcar: *"Activar transmisión en directo de inmediato"*.
2. Al presionar **Guardar**, el TV Box de esa sala física **conmuta automáticamente a la foto de Don Roberto, enciende las velas virtuales y queda listo para recibir condolencias**.

### C. Al concluir el servicio:
- Desde el panel, hacer clic en **"Finalizar Servicio"** o en **"Conmutar a Modo Espera"**.
- El televisor de la sala vuelve de inmediato a la pantalla institucional de guardia sin reiniciar el equipo.

---

## 6. Respuestas a Fallas y Preguntas Frecuentes (FAQ)

### ¿Qué ocurre si hay un corte de energía eléctrica en la sala?
Al regresar la luz, el TV Box se enciende solo. Fully Kiosk arranca automáticamente en menos de 5 segundos, recupera la sala asignada desde su memoria local y reanuda la pantalla sin pedir contraseñas ni clics.

### ¿Qué sucede si se interrumpe la conexión de Internet (Wi-Fi)?
El sistema web cuenta con **resiliencia offline**: almacena en la memoria del navegador la foto y los datos del difunto. El televisor continuará mostrando el homenaje y el reloj con total normalidad; una vez restablecido el Wi-Fi, se reconectará de forma transparente.

### ¿Cómo sale el técnico de la pantalla si necesita cambiar la red Wi-Fi?
En Fully Kiosk, tocando 5 veces la esquina superior izquierda de la pantalla (o mediante el botón *Back* del control remoto), se ingresa el PIN de desbloqueo configurado por el técnico para acceder al menú de Android.

# H03 / H04: H1 visible y animaciones progresivas

## Alcance

Rama desde `origin/main` (`eadb2b7`), con la corrección www ya integrada.
Sin cambios en URLs, metadatos canónicos, sitemap, robots, formularios o medios.

- El logo permanece en su contenedor con los mismos tamaños y clases.
- La tagline visible pasa de párrafo a H1, con fuente sans y estilos explícitos
  para mantener exactamente su apariencia. Texto EN: “Live Paella Catering in
  Los Angeles”; ES: “Catering de paellas en directo en Los Ángeles”.
- Los platos son H4 bajo los H3 de sus grupos; los títulos de secciones siguen H2.
  No se añade texto oculto ni se cambia la composición.
- El servidor y la primera renderización cliente muestran contenido. El hook
  prepara mediante `data-reveal=pending` únicamente elementos aún fuera de la
  pantalla; conserva distancias, duraciones y retrasos existentes. No vuelve a
  ocultar contenido ya visible al hidratar o al entrar por un enlace profundo.
- Si IntersectionObserver falta o falla, el contenido queda visible. También con
  movimiento reducido, incluido activarlo durante la visita. El foco de teclado
  revela el elemento pendiente. Limpieza del observer y listeners al desmontar.
- Los vídeos, overlays y estados interactivos mantienen su lógica original.

## Verificación reproducible

Arrancar `npm run dev` (o `npm run start` tras un build correcto) en una terminal.
En otra:

```bash
npm run lint
npx tsc --noEmit
npm run test:seo
npm run test:content
python tests/content-browser.py
```

Las pruebas de navegador usan Python Playwright y Chromium ya disponibles en el
entorno cloud, sin añadir dependencias a npm ni cambiar el lockfile. Se puede
seleccionar Chromium con `CHROMIUM_PATH`. Ambos tipos de prueba aceptan
`SEO_BASE_URL` para otro servidor autorizado. Las APIs de formularios se
interceptan en Chromium: no se envían correos ni solicitudes al backend real.
Una preview protegida debe revisarse con acceso autorizado, sin eludir protección.

Resultados locales:

- Lint y TypeScript: pasan.
- SEO www: 3/3 pasan; HTML de contenido/H1: 1/1 pasa.
- Chromium: 5 métodos pasan, cubriendo móvil 390×844 y escritorio 1440×1000:
  JS desactivado, scripts bloqueados, observer ausente/constructor fallido,
  entrada por `#menu`, transición CSS real, reduced motion al inicio y al cambiar,
  navegación móvil/escritorio, EN/ES, opción negra, selección/quitar paellas,
  reproducción/pausa de vídeo, extras, modales, selección de clase y ambos
  formularios con respuestas interceptadas. Sin errores de hidratación ni de
  página en la prueba de animación.
- Portada antes/después: misma geometría de logo, tagline/H1 y enlaces en ambas
  resoluciones. Coincidencia exacta de píxeles fuera del indicador de desarrollo
  de Next.js. Capturas realizadas con reduced motion para eliminar variación
  temporal de la animación. Fuentes locales de sustitución en ambos casos.

## Limitaciones y revisión antes de publicar

El build se debe completar en un entorno con acceso permitido a Google Fonts;
la red de este entorno deniega la descarga de Inter/Newsreader. No se sustituyen
fuentes, se modifica la red ni se omiten verificaciones para forzarlo.
La comparación local no prueba la apariencia con las fuentes descargadas en
producción, ni cubre Safari/iOS o todos los anchos de pantalla.

Revisar en preview autorizada con las fuentes finales: portada EN/ES, móvil y
escritorio, scroll hasta menús/extras/experiencia, entrada directa a un ancla y
movimiento reducido. Desactivar JavaScript y comprobar lectura de esas secciones.
Confirmar build y repetir las pruebas HTML/SEO. No hacer merge ni desplegar a
producción sin aprobación.

# H01 — URLs indexables en inglés y español

## Arquitectura

Rama desde `main` a4f1600, con www y H03–H04 integrados.

- `app/(en)/` sirve `/`; `app/es/` sirve `/es/`. Cada layout de servidor
  pasa un idioma explícito a `SiteLayout`, que comparte fuentes, Header, Footer y
  estructura. `HomePage` comparte las mismas secciones, fotografías y animaciones.
- No se usa detección de idioma, cookies, geolocalización ni cabeceras para elegir
  idioma. `LocaleProvider` recibe el idioma de la ruta; ignora la antigua preferencia
  `pauella-locale`. La primera respuesta y la hidratación usan el mismo diccionario.
- Se usan layouts raíz por idioma para emitir `html lang` desde el servidor,
  sin convertir las páginas estáticas en rutas dependientes de la petición.
- Los metadatos completos de home se exportan desde cada **page**, no desde los
  layouts, para evitar que futuras páginas de servicio hereden el canonical de home.
  Nuevas páginas inglesas pueden añadirse bajo `(en)` y españolas bajo `es`,
  reutilizando el layout y componentes, con sus propios metadatos y equivalencias.
- `locale-seo.ts` centraliza las URLs canónicas, descripciones y alternates.
  EN mantiene su título y contenido; ES tiene título y descripción españoles.
  Canonical propio, hreflang en/es/x-default y metadatos OG/Twitter por idioma.
- `trailingSlash: true` permite serializar las URLs canónicas con barra final.
  `skipTrailingSlashRedirect: true` sirve `/es/` directamente sin alterar el acceso
  existente a `/api/contact` y `/api/custom-idea`. `/es` también es accesible y
  declara `/es/` como canonical; no se toca la configuración de dominio de Vercel.
- Sitemap con ambas URLs y alternates recíprocos, sin lastmod inventado. Robots
  conserva el dominio www. FAQ y menú JSON-LD usan el diccionario de la ruta;
  contacto, área de servicio y demás información del negocio permanecen iguales.

## Selector y datos en curso

Los controles EN/ES son enlaces HTML con el mismo aspecto. Funcionan sin JS y
sin preferencias previas. Con JS conservan el fragmento actual, incluidos enlaces
internos de Next que usan pushState y no emiten hashchange. Los fragmentos de
platos se mapean por identidad si sus nombres difieren entre idiomas.

Cambiar entre layouts raíz supone una navegación completa. Para que no pierda
información accidentalmente, el clic explícito de cambio de idioma guarda en
**sessionStorage de la pestaña**:

- Valores de ambos formularios (sin campos ocultos derivados).
- Paellas seleccionadas mediante claves estables, etiquetas localizadas al llegar.
- Ingredientes elegidos para la paella personalizada y opciones de paella negra.

La página de destino consume y elimina esas instantáneas tras restaurarlas. No se
usan cookies ni localStorage para almacenar borradores, ni se envían a un servidor.
Si el almacenamiento está bloqueado o lleno, se avisa y el usuario puede cancelar
sin perder su formulario. Se comprueba el formato de las selecciones almacenadas.
Un clic normal en el idioma activo no recarga la página. Ctrl/cmd-clic conserva
la semántica del enlace; no se pretende sincronizar borradores entre pestañas.

Durante un envío pendiente se impide cambiar de idioma y se muestra un aviso,
para que no se repita una solicitud por navegar antes de conocer el resultado.
Sin JavaScript las dos páginas y enlaces son legibles, pero no se puede guardar
un borrador al navegar; las funciones interactivas y el envío de formularios
siguen requiriendo JS como antes. No se añaden ni sustituyen endpoints de envío.

## Verificación

Con servidor local arrancado en otra terminal:

```bash
npm run lint
npx tsc --noEmit
npm run test:seo
npm run test:content
npm run test:i18n
python tests/content-browser.py
python tests/i18n-browser.py
npm run build
```

Las pruebas usan Node y el Playwright/Chromium ya instalado en el entorno cloud;
no se añaden dependencias npm ni se modifica el lockfile. Para otro servidor,
`SEO_BASE_URL=https://preview-autorizada.vercel.app` funciona en las pruebas.
No eluden la protección de Vercel. Todas las solicitudes de formularios de las
pruebas de navegador se interceptan: no se envían correos reales.

Cobertura: respuestas 200, HTML sin JS, H1, lang, titles/descripciones, canonical,
hreflang recíprocos absolutos, OG/Twitter, FAQ/menú JSON-LD, sitemap sin lastmod,
robots y rutas API existentes; navegación, recarga, preferencia localStorage
contradictoria, borradores/selecciones, anclas, almacenamiento bloqueado, envío en
curso, navegación móvil, modales, formularios, extras, paellas negras, vídeo,
animaciones y movimiento reducido, con comprobación de errores de hidratación.
Tamaños: móvil 390×844 y escritorio 1440×1000.

La portada inglesa conserva geometría y píxeles frente a las capturas de la fase
H03–H04, excluyendo el indicador de desarrollo Next.js. Ambas portadas sin
desbordamiento horizontal en esos tamaños. Las capturas usan reduced motion y
las fuentes de sustitución disponibles localmente; validar las fuentes finales
sobre la preview y comprobar Safari/iOS sigue siendo necesario.

El build puede seguir bloqueado por la política de salida a Google Fonts
(Inter/Newsreader). No se alteran las fuentes, la red ni las verificaciones para
forzar el resultado. Un build bloqueado no se presenta como validación de producción.

## Revisión en preview de Vercel

1. Verificar que el despliegue de revisión corresponde a esta rama y que el build
   termina correctamente. No hacer merge ni publicar manualmente sin autorización.
2. Abrir directamente `/` y `/es/`, recargar y usar “Ver código fuente”: idioma,
   H1 y contenido correctos; canonical siempre de producción www en su idioma,
   alternates en/es/x-default absolutos y recíprocos. La preview no debe indexarse.
3. Abrir `/robots.txt` y `/sitemap.xml`: dominio www, ambas URLs y sin fechas falsas.
4. Desactivar JS y repetir acceso directo y enlaces EN/ES. Con JS, probar cambiar
   idioma desde `#contact`, con formulario parcialmente escrito y paellas elegidas;
   comprobar restauración, eliminación de selección, opciones y envío interceptado.
   No enviar una prueba real desde preview salvo autorización y configuración expresa.
5. Revisar navegación, modales, vídeo, reduced motion y portada EN/ES en móvil y
   escritorio con las fuentes finales. Ejecutar las suites contra una preview
   accesible o un servidor local; la protección de preview requiere acceso autorizado.
6. Solo tras aprobar y publicar: comprobar las dos URLs públicas y registrar el
   sitemap en Search Console. La indexación efectiva depende de Google; este
   cambio habilita rastreo independiente, no garantiza posiciones ni plazos.

## Resultado de esta ejecución

- Lint y TypeScript: pasan.
- Pruebas SEO H01: 4/4; SEO www anterior: 3/3; HTML H1/H04: 1/1.
- Suite de navegador H01: 7 métodos pasan, con los escenarios y tamaños descritos.
- Regresión de navegador H03–H04 adaptada a enlaces: 5 métodos pasan.
- Build ejecutado: falla al descargar las fuentes Inter y Newsreader de Google
  Fonts por la restricción de red del entorno. Pendiente completarlo en Vercel.
- API GitHub: denegada (`Forbidden`) en este entorno; la rama se puede subir por
  Git. La creación del PR requiere acceso permitido a la API o abrirlo en GitHub.

Archivos por responsabilidad:

- Rutas: `app/(en)/{layout,page}.tsx`, `app/es/{layout,page}.tsx`;
  el antiguo `app/page.tsx` se comparte ahora como `home/HomePage.tsx` y el
  antiguo `app/layout.tsx` como `layout/SiteLayout.tsx`.
- SEO: `lib/locale-seo.ts`, `lib/schema.ts`, `app/sitemap.ts`, `FAQSection.tsx` y
  `next.config.ts` para la política de barras finales.
- Idioma/estado: `LocaleProvider.tsx`, `LocaleSwitcher.tsx`, `useInterestedPaella.ts`,
  `paella-identity.ts`, `language-drafts.ts`, `useLanguageChoices.ts`, formularios,
  `MenuSection.tsx` y `PaellaRow.tsx`. Header y modales localizan etiquetas accesibles.
- Pruebas/documentación: `tests/i18n-seo.test.mjs`, `tests/i18n-browser.py`, adaptación
  de `tests/content-browser.py`, comando de `package.json`, README y este documento.

Sin cambios en `siteConfig.url`, `robots.ts`, `HeroSection.tsx`, `useReveal.ts`,
lockfile, dependencias, endpoints de Resend ni recursos multimedia.

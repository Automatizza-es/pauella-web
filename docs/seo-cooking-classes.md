# Landing de clases de paella — revisión

Rama: `feat/seo-paella-cooking-classes`, desde `origin/main` e980f25.

## Condiciones comerciales aplicadas

Las nuevas condiciones del usuario sustituyen las dudas del borrador anterior:

- Pau está basado en Los Ángeles y ofrece experiencias en el área de LA.
  Otras zonas del sur de California: según disponibilidad; la distancia puede
  influir en el presupuesto. No se anuncia una sede física ni tarifas de viaje.
- Duración aproximada de 3 horas.
- Experiencias individuales, parejas y grupos. Sin máximo comercial anunciado ni
  promesa de capacidad ilimitada; se pide el número de participantes.
- Equipo y utensilios para la experiencia, ingredientes de la receta acordada y
  una receta para repetirla en casa. No se promete entregar los utensilios al cliente.
- La receta se elige y confirma con Pau según preferencias y opciones disponibles.
- La solicitud no es una reserva ni un pago. Pau contacta personalmente para
  confirmar disponibilidad, ubicación, condiciones y presupuesto.

Texto y FAQ completos EN/ES en `src/lib/classes/content.ts`. No se inventan
precios, cancelaciones, sede, aforo, disponibilidad concreta ni reseñas.

## Rutas y SEO

- `/paella-cooking-classes-los-angeles/`
- `/es/clases-de-paella-los-angeles/`

Ambas entregan HTML completo con idioma, H1 y metadatos propios. El registro
`page-routes.ts` agrupa equivalencias de home y clases. Canonical y hreflang usan
producción `https://www.pauella.com`, con x-default a la clase inglesa equivalente.
OG/Twitter localizados; sitemap con cuatro URLs y sus grupos de alternativas,
sin lastmod artificial. Robots, dominio www y redirecciones no se cambian.

JSON-LD: WebPage, Service, Organization como proveedor, BreadcrumbList y FAQPage
coherente con el contenido visible. Sin dirección inventada, CourseInstance,
Event, precios ni valoraciones. El marcado no garantiza resultados enriquecidos.

## Diseño y navegación

Se conservan fuentes, paleta y estilo de componentes. Se utilizan únicamente las
fotos de arroz, Pau y el poster/vídeo ya disponibles. No se identifica a personas
como alumnos/clientes ni se atribuye una ubicación no confirmada a las imágenes.
El vídeo se monta al pedir su reproducción y tiene controles nativos.

Las entradas progresivas reutilizan `useReveal`; contenido visible sin JS y
reduced motion respetado. El header y footer conocen el contexto: desde clases,
menú/extras/historia regresan a la home localizada; logo a home; CTA y contacto
al formulario de clase. EN/ES conserva la landing equivalente y sus anclas.

En home solo se añaden los enlaces secundarios del teaser, modal y footer.
Se conservan secciones, CTA, formularios, platos, extras, fotos, vídeos e historia.

## Formulario y entrega

Campos obligatorios: nombre, email y participantes. Opcionales: fecha preferida,
ubicación y mensaje. Sin pago, plazas garantizadas ni confirmación automática.
El formulario da estado de envío, error recuperable y éxito como solicitud,
con aviso explícito de que la reserva aún no está confirmada.

Nuevo endpoint `/api/cooking-class`, con identidad `cooking-class` fijada por el
servidor y visible en el asunto y cuerpo del email. Reutiliza `emailRows` y
`sendNotificationEmail`/Resend sin cambiar los endpoints ni envíos de home.

Validación: objeto JSON, tipos, nombre/email requeridos, email sin saltos de línea,
participantes enteros positivos, fecha de calendario válida y límites técnicos:
nombre 120, email 254, ubicación 300 y mensaje 4000 caracteres; cuerpo hasta 24 KiB
leído con límite de bytes. Safe integer es un límite de representación numérica,
no un máximo comercial. Errores 400/413/415 de entrada y 502 genérico de entrega;
no se devuelven errores del SDK ni datos personales. No se registran valores de
la solicitud. El asunto constante tampoco introduce nombres en el log del sender
de desarrollo existente. No se afirma haber probado entrega real en esta fase.

Sin JS, el contenido y los enlaces funcionan y se ofrece email como alternativa.
El envío interactivo requiere JS: el botón queda deshabilitado hasta hidratar,
y method=post evita poner campos personales en la URL por un GET de fallback.

## Borradores independientes

`NavigationPreserver` protege los enlaces entre páginas e idiomas. Las instantáneas
sessionStorage se combinan por ID de formulario en vez de sobrescribirse:
`contact`, `custom-idea`, `cooking-class`. El destino solo consume su propio borrador.
Se conservan selecciones y opciones incluso cuando la página intermedia de clases
no renderiza el selector de paellas. Sin cookies/localStorage para datos personales.

Si falla almacenamiento se puede cancelar la navegación. Durante un envío se
espera al resultado antes de salir. Ctrl/cmd-clic mantiene el comportamiento de
nueva pestaña; sin JS no se puede restaurar un borrador al navegar. No se promete
sincronización entre pestañas ni funcionamiento del formulario sin JS.

## Comprobaciones

Con servidor arrancado en otra terminal:

```bash
npm run lint
npx tsc --noEmit
npm run test:classes:api
npm run test:classes:seo
npm run test:i18n
npm run test:seo
npm run test:content
python tests/cooking-class-browser.py
python tests/i18n-browser.py
python tests/content-browser.py
npm run build
```

Las pruebas de API usan el handler real con emisor simulado y escape HTML real,
sin credenciales ni llamadas a Resend. Se usa Node 24 disponible en el entorno,
con `--test-isolation=none` para informar los cinco casos nominales al cargar TS
nativo; se mantienen todas las aserciones. Las de navegador usan el
Playwright/Chromium ya instalado e interceptan todas las rutas de formulario.
No se añaden dependencias npm ni se altera el lockfile.

- API: 5 casos pasan, con matrices de datos inválidos, límites, HTML escapado,
  identidad, opcionales y fallo de entrega sin falso éxito.
- HTML/SEO de clases: 3 pasan; H01 adaptada al sitemap de cuatro URLs: 4 pasan;
  SEO www: 3 pasan; H1/H04: 1 pasa.
- Chromium clases: 4 métodos pasan, con EN/ES, móvil 390×844 y escritorio 1440×1000,
  sin JS, requisitos del formulario, fallo/reintento interceptados, video,
  navegación, anclas, reduced motion y borradores independientes ida/vuelta.
- Regresiones Chromium H01: 7 métodos pasan; H03–H04: 5 pasan.
- Sin errores de hidratación detectados en esas suites.
- Portada home EN/ES: coincidencia de píxeles antes/después en ambos tamaños,
  excluyendo el indicador de desarrollo. Los enlaces nuevos cambian únicamente
  el espacio de teaser/modal/footer. Las landings no desbordan horizontalmente.
- Capturas locales con fuentes de sustitución; falta comprobar fuentes finales
  y Safari/iOS. Build ejecutado: falla al descargar Inter y Newsreader de Google Fonts por
  la restricción de red. No se modifican las fuentes ni se omite la verificación;
  queda pendiente completarlo en el entorno permitido de Vercel.

## Preview y aprobación

Tras subir la rama, la integración Git de Vercel puede generar automáticamente una
preview. No se ejecuta un despliegue manual ni merge. La API de GitHub está denegada
en este entorno; el PR y la lectura de checks/URL de preview pueden requerir el panel.

En Vercel, abrir el despliegue de esta rama y comprobar su build antes de revisar:

1. Visitar las dos rutas anteriores directamente y recargar. Revisar código fuente:
   lang/H1, canonical propio con www, alternates recíprocos de clases, OG y JSON-LD.
2. Confirmar que la preview no se indexa y que no introduce su host en metadatos.
3. Revisar móvil/escritorio, CTA, sección de equipo, vídeo y FAQ actualizadas.
4. Desde home abrir detalles en teaser y modal, y enlace de footer; comprobar que
   los CTA originales y las secciones siguen presentes.
5. Empezar borrador de catering, ir a clases, escribir otro y cambiar EN/ES; volver
   a home y a clases. Confirmar valores independientes y selección de paellas.
6. Probar formulario mediante automatización interceptada, sin enviar correos
   reales. Las variables Resend de Production no se presuponen habilitadas en
   Preview; no copiar ni exponer valores para probar. Cualquier prueba real de
   entrega debe autorizarse por separado.

Se acepta `SEO_BASE_URL=https://preview-autorizada.vercel.app` en las suites de
HTML/navegador. No se elude Deployment Protection. No hacer merge ni publicar en
producción antes de aprobar esta revisión.

### URL de preview facilitada para esta revisión

- EN: https://pauella-web-git-feat-seo-paella-cooki-70e128-mjlopezzs-projects.vercel.app/paella-cooking-classes-los-angeles/
- ES: https://pauella-web-git-feat-seo-paella-cooki-70e128-mjlopezzs-projects.vercel.app/es/clases-de-paella-los-angeles/

La URL base fue facilitada por el usuario y coincide con el enlace de Vercel
mostrado para el commit en GitHub. Las consultas desde el entorno cloud se
bloquean en el proxy (CONNECT 403), antes de llegar a Vercel: no se afirma que
la aplicación devuelva ese error ni que el build remoto haya sido verificado.
Completar la revisión visual e interactiva y confirmar el build desde Vercel.

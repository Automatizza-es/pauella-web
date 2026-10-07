# Pauella

Web de [Pauella](https://pauella.com), paella en directo para bodas, fiestas privadas y eventos de empresa en Los Ángeles. Una sola página con secciones ancla, en inglés y español.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- [Resend](https://resend.com) para los emails de los formularios

## Arrancar en local

```bash
npm install
cp .env.example .env.local   # y rellena las variables (ver abajo)
npm run dev
```

La web queda en http://localhost:3000.

## Variables de entorno

| Variable             | Para qué sirve                                              |
| -------------------- | ----------------------------------------------------------- |
| `RESEND_API_KEY`     | Clave de la API de Resend                                   |
| `NOTIFICATION_EMAIL` | Dirección que recibe las solicitudes de los formularios     |

Si falta alguna, los formularios siguen funcionando pero no se envía ningún email (solo se registra en consola).

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción
- `npm run start`: sirve el build de producción
- `npm run lint`: ESLint

## Estructura

```
src/
  app/              layout, página principal, SEO (sitemap, robots, icon) y rutas API
    api/contact/      formulario de contacto
    api/custom-idea/  modal de "paella a medida"
  components/
    home/           una sección de la home por componente
    layout/         header, footer, selector de idioma
    providers/      contexto de idioma
  lib/
    i18n/           textos en inglés y español
    site-config.ts  datos de contacto y redes
    email.ts        envío de emails con Resend
public/
  images/, videos/  fotos y vídeos ya optimizados que usa la web
```

Los textos de la web están en `src/lib/i18n/en.ts` y `es.ts`. Cualquier cambio de copy hay que hacerlo en los dos.

## Fotos y vídeos

Los originales sin procesar (`fotos/` y `source-photos/`) no se suben a git porque pesan demasiado. Solo se versionan las versiones optimizadas de `public/`.

# Avatares: cómo reemplazarlos

Los avatares de EduBaka son imágenes estáticas servidas por el propio frontend (no hay servidor de imágenes). Ahora mismo son 12 SVG dibujados a mano (sin derechos de autor de terceros). Si más adelante quieres poner arte real (personajes de WoW, anime, etc.) descargado por ti, sigue esta guía.

## Dónde van los archivos

```
EduBakaFront/public/avatars/wow/1.svg   ...  6.svg
EduBakaFront/public/avatars/anime/1.svg ...  6.svg
```

Son 6 "WoW" + 6 "anime", numerados del 1 al 6. Los nombres de archivo deben ser exactamente `1`, `2`, `3`, `4`, `5`, `6` (más la extensión).

## Formato recomendado

- Cuadrado (misma proporción de ancho y alto) — se recortan en un círculo con `object-fit: cover`, así que si la imagen no es cuadrada se verá descentrada.
- SVG si es posible (peso mínimo). Si usas fotos/arte descargado, `PNG` a 256×256 o 512×512 funciona igual de bien.
- Nombres de archivo simples: `1.png`, `2.png`, etc. (o `.jpg`).

## Si cambias de `.svg` a `.png` (o cualquier otra extensión)

El código genera las rutas automáticamente a partir de la extensión configurada en `EduBakaFront/src/pages/Settings.tsx`, líneas 7-8:

```ts
const WOW_AVATARS = Array.from({ length: 6 }, (_, i) => `/avatars/wow/${i + 1}.svg`);
const ANIME_AVATARS = Array.from({ length: 6 }, (_, i) => `/avatars/anime/${i + 1}.svg`);
```

Cambia `.svg` por `.png` (o la extensión que uses) en esas dos líneas si reemplazas los archivos con otro formato.

## Pasos

1. Consigue/descarga las imágenes (asegúrate de tener derecho a usarlas — arte de fans o assets con licencia para uso personal, no oficiales de Blizzard/estudios de anime).
2. Renómbralas a `1` a `6` dentro de la carpeta correspondiente (`wow` o `anime`), reemplazando los SVG existentes (o borrándolos primero si cambias de extensión).
3. Si cambiaste la extensión, actualiza las dos líneas de `Settings.tsx` mencionadas arriba.
4. `npm run dev` y entra a Configuración → deberías ver las nuevas imágenes en la grilla de selección de avatar.

No hace falta tocar el backend — el backend solo guarda la URL (`/avatars/...`) que el usuario eligió, nunca sirve las imágenes.

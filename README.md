# Inferencia estadística — ejercicios del parcial 1

Los ejercicios del parcial 1 de Inferencia estadística, resueltos paso a paso como diapositivas
web: cada línea aparece con →, cada teorema usado se enuncia, y al pasar el cursor sobre un
símbolo aparece su definición.

**<https://extantword.github.io/inferencia-parcial1/>**

- `capitulo-1.html` — Estadísticos de orden (8 ejercicios)
- `capitulo-2.html` — Convergencia (14 ejercicios)

Se recorre con → y ←; `I` vuelve al índice del capítulo. Las fórmulas se dibujan con MathJax.

## Cómo editar

Las páginas se generan desde `fuente/`; no se editan `index.html` ni `capitulo-*.html` a mano.

    python3 fuente/build.py

- `fuente/capitulo-N/` — el índice, los ejercicios y las definiciones de cada capítulo.
  Cada diapositiva es un `<section class="slide" data-ex="N">`; los elementos con `data-b`
  aparecen uno por uno con →.
- `fuente/comun/defs.html` y `fuente/capitulo-N/defs*.html` — lo que aparece al pasar el cursor.
  En las fórmulas, `\D{clave}{…}` marca un símbolo; su definición es el `<div data-k="clave">`
  (con `data-ex="N"` si es propia de un ejercicio).
- `fuente/estilo/`, `fuente/js/` — estilo, navegación y definiciones emergentes.
- `fuente/portada.html` — la página de inicio.
- `fuente/fonts/` — KaTeX Main (licencia MIT), que se incrusta en las páginas.

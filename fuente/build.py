"""Construye el sitio a partir de las fuentes de esta carpeta.

    python3 fuente/build.py                  # index.html, capitulo-1.html y capitulo-2.html en la raíz del repo
    python3 fuente/build.py --artifact DIR   # versión sin <html>/<head>/<body>, para publicar como Artifact

Cada capítulo se arma con: su índice, sus ejercicios (secciones <section class="slide" data-ex="N">),
las definiciones que aparecen al pasar el cursor (comun/defs.html más las del capítulo),
el estilo (estilo/) y la lógica de navegación y definiciones (js/).
"""
import base64, pathlib, sys

D = pathlib.Path(__file__).parent
ROOT = D.parent

CHAPTERS = {
    "1": dict(title="Estadísticos de orden",
              parts=["indice.html", "ejercicio-1.html", "ejercicios-2-8.html"],
              defs=["defs-ejercicio-1.html", "../comun/defs.html", "defs.html"]),
    "2": dict(title="Convergencia",
              parts=["indice.html", "ejercicios.html"],
              defs=["../comun/defs.html", "defs.html"]),
}


def read(p):
    return (D / p).read_text(encoding="utf-8")


def font(name):
    return base64.b64encode((D / "fonts" / name).read_bytes()).decode()


FONTS = {"__MAIN_R__": font("KaTeX_Main-Regular.woff2"), "__MAIN_I__": font("KaTeX_Main-Italic.woff2")}


def with_fonts(text):
    for k, v in FONTS.items():
        text = text.replace(k, v)
    return text


def chapter(n, standalone):
    cfg = CHAPTERS[n]
    folder = f"capitulo-{n}/"
    css = with_fonts(read("estilo/base.css") + read("estilo/extra.css"))
    body = "\n".join(read(folder + p) for p in cfg["parts"])
    defs = "\n".join(read(folder + p) for p in cfg["defs"])
    head = f"Capítulo {n} · {cfg['title']}"
    page = f"""<meta charset="utf-8">
<title>{head}</title>
<style>{css}</style>

<header class="running-head" id="runhead">{head}</header>

{body}

<footer class="foot">
  <span class="hint">→ avanzar · ← retroceder · I índice · pasa el cursor sobre los símbolos para ver su definición</span>
  <span class="nav">
    <button class="idx" id="idxBtn">Índice</button>
    <button id="prevBtn" aria-label="Anterior">‹</button>
    <span class="counter" id="counter"></span>
    <button id="nextBtn" aria-label="Siguiente">›</button>
  </span>
</footer>

<div id="tip" role="tooltip"></div>

<div id="defs" aria-hidden="true">
{defs}
</div>

<script>
{read('js/engine.js')}
{read('js/tip.js')}
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg-full.js"></script>
"""
    if standalone:
        split = page.index("</style>") + len("</style>")
        page = ('<!doctype html>\n<html lang="es">\n<head>\n'
                '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
                + page[:split] + "\n</head>\n<body>\n" + page[split:] + "\n</body>\n</html>\n")
        page = page.replace('<p class="eyebrow">Inferencia estadística · Ejercicios del parcial 1</p>',
                            '<p class="eyebrow"><a href="./" style="color:inherit">Inferencia estadística · Ejercicios del parcial 1</a></p>')
    return page


def main():
    if len(sys.argv) == 3 and sys.argv[1] == "--artifact":
        out_dir, standalone = pathlib.Path(sys.argv[2]), False
    else:
        out_dir, standalone = ROOT, True
        faces = "\n".join(l for l in read("estilo/base.css").splitlines() if "@font-face" in l)
        (ROOT / "index.html").write_text(read("portada.html").replace("__FONTS__", with_fonts(faces)), encoding="utf-8")
        print("index.html")
    for n in CHAPTERS:
        page = chapter(n, standalone)
        out = out_dir / f"capitulo-{n}.html"
        out.write_text(page, encoding="utf-8")
        print(out.name, f"{len(page) // 1024} KB,", page.count('<section class="slide'), "diapositivas")


main()

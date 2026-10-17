// Gera um "Apresentacao.html" independente para cada programa, a partir do
// .dc.html editado no Claude Design. O arquivo gerado abre com dois cliques
// (file://), sem servidor: usa o <deck-stage> direto, sem o runtime do editor,
// e embute as fotos do .image-slots.state.json.
//
// Rode de novo sempre que editar uma apresentação:  node gerar-apresentacoes.js
const fs = require('fs');
const path = require('path');

const RAIZ = __dirname;
const SAIDA = 'Apresentacao.html';

const APRESENTACOES = [
  { pasta: 'Viva Educação', fonte: 'VIVA Educacao v2.dc.html', titulo: 'VIVA Educação · ecoha' },
  { pasta: 'VIVA Letramento', fonte: 'VIVA Letramento - Apresentação Comercial v3.dc.html', titulo: 'VIVA Letramento · ecoha' },
];

function atributo(attrs, nome, padrao) {
  const m = attrs.match(new RegExp(`\\b${nome}="([^"]*)"`));
  return m ? m[1] : padrao;
}

// O image-slot lê as fotos via fetch('.image-slots.state.json'), que o
// navegador bloqueia em file://. Responde esse fetch com o estado embutido.
function scriptImagens(estado) {
  const json = JSON.stringify(estado).replace(/</g, '\\u003c');
  return `<script>
(function () {
  var estado = ${json};
  var original = window.fetch;
  window.fetch = function (url) {
    if (String(url && url.url || url).split('?')[0].endsWith('.image-slots.state.json')) {
      return Promise.resolve(new Response(JSON.stringify(estado), { headers: { 'Content-Type': 'application/json' } }));
    }
    return original.apply(this, arguments);
  };
})();
</script>`;
}

const BOTAO_CAPA = `<a id="voltar-capa" href="../index.html" title="Voltar para a capa">&larr; Capa</a>
<style>
  #voltar-capa {
    position: fixed; top: 18px; left: 18px; z-index: 2147483647;
    padding: 8px 16px; border-radius: 999px;
    background: rgba(20,8,30,.72); color: #fff; border: 1px solid rgba(255,255,255,.2);
    font: 600 14px/1 'Montserrat', 'Segoe UI', Arial, sans-serif; text-decoration: none;
    opacity: 0; transition: opacity .3s; pointer-events: none;
  }
  #voltar-capa.visivel { opacity: 1; pointer-events: auto; }
  #voltar-capa:hover { background: #22c9d6; color: #2a0f3b; }
</style>
<script>
(function () {
  var botao = document.getElementById('voltar-capa');
  var timer;
  document.addEventListener('mousemove', function () {
    botao.classList.add('visivel');
    clearTimeout(timer);
    timer = setTimeout(function () { botao.classList.remove('visivel'); }, 2500);
  });
})();
</script>`;

for (const ap of APRESENTACOES) {
  const pasta = path.join(RAIZ, ap.pasta);
  const fonte = fs.readFileSync(path.join(pasta, ap.fonte), 'utf8');

  const helmet = (fonte.match(/<helmet>([\s\S]*?)<\/helmet>/) || [, ''])[1].trim();
  const deck = fonte.match(/<x-import\b([^>]*)>([\s\S]*)<\/x-import>/);
  if (!deck) throw new Error(`Não encontrei os slides (<x-import>) em ${ap.fonte}`);
  const largura = atributo(deck[1], 'width', '1920');
  const altura = atributo(deck[1], 'height', '1080');
  const slides = deck[2].trim();

  const arquivoEstado = path.join(pasta, '.image-slots.state.json');
  const estado = fs.existsSync(arquivoEstado) ? JSON.parse(fs.readFileSync(arquivoEstado, 'utf8')) : null;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${ap.titulo}</title>
<!-- Gerado por gerar-apresentacoes.js a partir de "${ap.fonte}". Não edite aqui: edite o .dc.html e gere de novo. -->
${estado ? scriptImagens(estado) : ''}
${helmet}
<style>deck-stage:not(:defined) { visibility: hidden; }</style>
</head>
<body>
<deck-stage width="${largura}" height="${altura}" no-rail>
${slides}
</deck-stage>
${BOTAO_CAPA}
<script src="./deck-stage.js"></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(pasta, SAIDA), html, 'utf8');
  const total = (slides.match(/<section\b/g) || []).length;
  console.log(`OK  ${ap.pasta}/${SAIDA}  (${total} slides${estado ? `, ${Object.keys(estado).length} imagens` : ''})`);
}

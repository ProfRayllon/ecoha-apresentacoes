# Apresentações ecoha

Capa e apresentações dos programas da **ecoha Educação e Inovação**:

- **VIVA Educação** — Programa de Educação Positiva e Bem-Estar
- **VIVA Letramento** — Programa de Desenvolvimento da Linguagem e do Pensamento Matemático

## Apresentar

**Online:** abra a página publicada e escolha o programa na capa.

**No computador:** dê dois cliques em `Iniciar Apresentacao.bat`. Ele atualiza as apresentações e abre a capa no navegador.

Durante a apresentação:

| Tecla | Ação |
| --- | --- |
| `→` / `Espaço` / clique | Próximo slide |
| `←` | Slide anterior |
| `F11` | Tela cheia |
| `1` / `2` (na capa) | Escolher o programa |

Mexa o mouse para aparecer o botão **← Capa**.

## Estrutura

```
index.html                     Capa: escolhe qual apresentação rodar
gerar-apresentacoes.js         Gera as versões de apresentação
Viva Educação/
  VIVA Educacao v2.dc.html     Fonte, editada no Claude Design
  Apresentacao.html            Gerado — não editar
VIVA Letramento/
  VIVA Letramento - Apresentação Comercial v3.dc.html
  Apresentacao.html            Gerado — não editar
```

## Editar os slides

Edite sempre os arquivos `.dc.html` no Claude Design. Depois rode:

```
node gerar-apresentacoes.js
```

Isso recria os arquivos `Apresentacao.html`, que são versões independentes: rodam como slides no navegador, sem o editor e sem servidor. O gerador também embute nelas as fotos guardadas em `.image-slots.state.json`.

Os arquivos `Apresentacao.html` são sobrescritos a cada geração, então qualquer edição feita neles é perdida.

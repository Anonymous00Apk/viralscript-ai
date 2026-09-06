// ============================================================
// ViralScript AI — Netlify Function: GERADOR DE CAPA DE YOUTUBE
// Endpoint: POST /api/gerar-imagem (via redirect no netlify.toml)
// BYOK: usa a chave Gemini do usuário (único provedor com geração
// de imagem por API). Groq/OpenRouter não geram imagens.
// EXCLUSIVO do YouTube Longo: é a única plataforma onde a capa é
// recurso oficial (upload de imagem 1280x720).
// Cada requisição gera UMA capa focada em UM gancho (ganchoFoco
// 0/1/2) — o cliente dispara 3 em paralelo.
// A imagem de referência (opcional) NUNCA é armazenada nem logada.
// ============================================================

// PROMPT DE CAPA DE YOUTUBE — engenharia de CTR (segredo comercial
// do projeto). Placeholders preenchidos no handler:
//   {titulo} {nicho} {tema} {ganchos} {foco} {instrucoes_referencia}
const PROMPT_IMAGEM_TEMPLATE = String.raw`Você é um Diretor de Arte de elite especializado em CAPAS OFICIAIS de YouTube (thumbnails) de altíssima taxa de cliques (CTR). Sua tarefa é gerar UMA capa no formato oficial do YouTube: 16:9 paisagem (1280x720).

CONTEXTO:
- O vídeo é do YouTube em formato longo (8+ minutos): a capa compete pelo clique na página inicial, nas sugestões laterais e no celular — ela é o primeiro contato com o conteúdo;
- Título oficial do vídeo (definido para a capa e a busca): {titulo}
- Nicho do canal: {nicho}
- Tema do vídeo: {tema}
- Ganchos aprovados pelo roteiro:
{ganchos}
{foco}

REGRAS DE CAPA DE YOUTUBE (OBRIGATÓRIAS):
1. FOCO VISUAL ÚNICO: um sujeito/elemento dominante ocupando 40-60% do quadro, posicionado levemente fora do centro (regra dos terços). Nada de cena confusa ou multipersonagem;
2. EMOÇÃO NO PRIMEIRO PLANO: se houver pessoa/rosto, expressão intensa e legível (surpresa, urgência, concentração ou triunfo), olhos bem definidos olhando para a câmera ou para o objeto da promessa. Anatomia e mãos corretas;
3. TEXTO NA IMAGEM — MÁXIMO DE 4 PALAVRAS: extraia as palavras de MAIOR IMPACTO do GANCHO FOCO (não copie o gancho inteiro e NÃO repita o título oficial do vídeo — a capa complementa o título, não duplica), em CAIXA ALTA, tipografia bold condensada, cor sólida de altíssimo contraste com contorno/sombra para leitura instantânea em miniatura, posicionada em área limpa da composição SEM cobrir o sujeito principal. Ortografia perfeita em português;
4. CONTRASTE E COR: paleta saturada de alto contraste (cores complementares), iluminação dramática com rim light separando o sujeito do fundo; fundo simples e desfocado ou gráfico, nunca competindo com o sujeito;
5. LEGIBILIDADE EM MINIATURA: a capa deve ser compreensível no tamanho de um polegar (feed do celular, barra lateral de sugestões) — silhuetas limpas, sem ruído visual, sem detalhes minúsculos importantes;
6. ESTILO DO NICHO: realismo fotográfico cinematográfico para temas reais (finanças, fitness, rotina) ou ilustração/digital art vibrante quando o nicho pede (tech, games, entretenimento) — escolha o que maximiza o clique no nicho informado.

PROIBIDO:
- Marcas d'água, logotipos de terceiros, assinaturas;
- Mais de 4 palavras na imagem;
- Elementos cortados de forma confusa, anatomia deformada, mãos com dedos extras;
- Bordas de interface, molduras, mockups de celular;
- Excesso de elementos (mais de 2 pontos de atenção visual).

{instrucoes_referencia}

QUALIDADE FINAL: a capa deve parecer de um canal com mais de 1 milhão de inscritos — impacto imediato no feed e nas sugestões, promessa visual clara e desejo de clicar.

Responda gerando APENAS a imagem (sem texto explicativo).`;

// Timeout por tentativa (teto 26s da Netlify). Geração de imagem é mais
// lenta que texto: 20s cobre a maioria; falha de timeout = erro claro.
const TIMEOUT_MS = 20000;

// Somente Gemini gera imagem — validação espelha o gerar-roteiro.js
const PREFIXOS_GEMINI = ['AIza', 'AQ.'];

// CASCATA DE MODELOS DE IMAGEM (mesma filosofia da V4.9: o Google aposenta
// modelos; 400/404/timeout avança p/ o próximo; 401/402/403/429 interrompe):
//   1º env AI_GEMINI_IMAGE_MODEL (se definida no Netlify)
//   2º gemini-2.5-flash-image              (Nano Banana — alias estável)
//   3º gemini-2.5-flash-image-preview      (variante preview)
//   4º gemini-2.0-flash-preview-image-generation  (experimental legado)
const CASCATA_IMAGEM = [
  process.env.AI_GEMINI_IMAGE_MODEL,
  'gemini-2.5-flash-image',
  'gemini-2.5-flash-image-preview',
  'gemini-2.0-flash-preview-image-generation'
].filter(m => m && m.trim());

// Criatividade da composição (0 a 1). Override via AI_TEMPERATURE.
const TEMPERATURE = (() => {
  const t = parseFloat(process.env.AI_TEMPERATURE);
  return (t >= 0 && t <= 1) ? t : 0.9;
})();

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

function cors() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
}

async function fetchComTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('A geração da imagem demorou demais (limite da hospedagem). Tente novamente — se persistir, simplifique a imagem de referência.');
    }
    throw new Error('Falha de rede entre o servidor e o Google Gemini.');
  } finally {
    clearTimeout(timer);
  }
}

async function erroHTTP(res) {
  let erro;
  if (res.status === 401 || res.status === 403) {
    erro = new Error('Sua chave do Gemini foi recusada (inválida, revogada ou sem permissão). Verifique em "Configurar Chave".');
  } else if (res.status === 402) {
    erro = new Error('Sua conta do Gemini está sem créditos (HTTP 402).');
  } else if (res.status === 429) {
    erro = new Error('Limite de requisições atingido na sua conta do Gemini (HTTP 429). Aguarde alguns minutos.');
  } else if (res.status >= 500) {
    erro = new Error('O Gemini está com instabilidade no momento (HTTP ' + res.status + '). Tente novamente.');
  } else {
    erro = new Error('Falha na requisição ao Gemini (HTTP ' + res.status + ').');
  }
  erro.status = res.status;
  try {
    const body = await res.json();
    if (body && body.error && body.error.message) erro.detalhe = body.error.message;
  } catch (e) { /* corpo ilegível */ }
  return erro;
}

async function lerJsonProvedor(res) {
  try {
    return await res.json();
  } catch (e) {
    throw new Error('O Gemini retornou uma resposta ilegível. Tente novamente em alguns instantes.');
  }
}

// Monta as parts multimodais: texto do prompt + imagem de referência
// (inline base64) quando o usuário a forneceu.
function montarParts(prompt, imagemRef) {
  const parts = [{ text: prompt }];
  if (imagemRef && imagemRef.mime && imagemRef.base64) {
    parts.push({ inlineData: { mimeType: imagemRef.mime, data: imagemRef.base64 } });
  }
  return parts;
}

// Chamada a UM modelo de imagem. A chave vai via HEADER x-goog-api-key.
// responseModalities ['TEXT','IMAGE'] é obrigatório nesses modelos
// (o 2.0-preview rejeita ['IMAGE'] sozinho com 400).
async function chamarImagemTentativa(apiKey, parts, modelo) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelo + ':generateContent';
  const res = await fetchComTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{ parts: parts }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        temperature: TEMPERATURE
      }
    })
  });
  if (!res.ok) throw await erroHTTP(res);
  const data = await lerJsonProvedor(res);
  if (data.error) throw new Error(data.error.message);

  // Extrai a imagem (inlineData) e o texto eventual da resposta
  const partsResposta = data.candidates?.[0]?.content?.parts || [];
  let mime = '', base64 = '', texto = '';
  for (const p of partsResposta) {
    if (p.inlineData && p.inlineData.data) {
      mime = p.inlineData.mimeType || 'image/png';
      base64 = p.inlineData.data;
    } else if (p.text) {
      texto += p.text;
    }
  }
  if (!base64) {
    // Modelo respondeu só texto (ex.: recusa de segurança) → trata como
    // falha de modelo para a cascata tentar o próximo
    const erro = new Error(texto ? ('O Gemini não gerou a imagem: ' + texto.slice(0, 200)) : 'O Gemini não retornou imagem.');
    erro.semImagem = true;
    throw erro;
  }
  return { mime, base64, texto: texto.trim() };
}

// CASCATA de modelos de imagem: 400/404/timeout/sem-imagem → próximo;
// 401/402/403/429 (chave/conta) → lança na hora; sucesso → retorna.
async function gerarImagem(apiKey, parts) {
  const tentados = [];
  let ultimoErro = null;

  for (const modelo of CASCATA_IMAGEM) {
    tentados.push(modelo);
    try {
      return await chamarImagemTentativa(apiKey, parts, modelo);
    } catch (err) {
      ultimoErro = err;
      if (err.status && [401, 402, 403, 429].includes(err.status)) throw err;
      continue;
    }
  }

  const erro = new Error(
    'Nenhum modelo de imagem do Gemini funcionou com sua chave (testados: ' + tentados.join(', ') + ').' +
    (ultimoErro ? ' Última falha: ' + ultimoErro.message + (ultimoErro.detalhe ? ' — ' + ultimoErro.detalhe : '') : '')
  );
  erro.status = 502;
  throw erro;
}

function interpolar(template, params) {
  let resultado = template || '';
  for (const key of Object.keys(params)) {
    const bruto = params[key] == null ? '' : String(params[key]);
    const seguro = bruto.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    resultado = resultado.split('{' + key + '}').join(seguro);
  }
  return resultado;
}

// Extrai o corpo de base64 puro de um data URI "data:image/png;base64,...."
// (aceita também base64 cru, para robustez).
function extrairBase64(valor) {
  if (typeof valor !== 'string' || !valor) return null;
  const m = valor.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (m) return { mime: m[1], base64: m[2] };
  if (/^[A-Za-z0-9+/=\s]+$/.test(valor) && valor.replace(/\s/g, '').length > 100) {
    return { mime: 'image/jpeg', base64: valor.replace(/\s/g, '') };
  }
  return null;
}

exports.handler = async (event) => {
  const headers = cors();

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ erro: 'Método não permitido.' }) };
  }

  try {
    const apiKey = (event.headers['x-api-key'] || event.headers['X-Api-Key'] || '').trim();

    let corpo;
    try {
      corpo = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ erro: 'Corpo da requisição inválido (JSON malformado).' }) };
    }
    const { tema, nicho, titulo, ganchos, ganchoFoco, imagemRef } = corpo;

    // Este endpoint é EXCLUSIVO do Gemini (único provedor com geração de
    // imagem por API — Groq e OpenRouter não atendem)
    if (!apiKey) {
      return { statusCode: 401, headers, body: JSON.stringify({ erro: 'Nenhuma chave de IA configurada. Clique em "Configurar Chave" no topo da página.' }) };
    }
    const prefixoOk = PREFIXOS_GEMINI.some(p => apiKey.startsWith(p));
    if (!prefixoOk) {
      return { statusCode: 401, headers, body: JSON.stringify({ erro: 'A geração de capa funciona apenas com chaves do Google Gemini (prefixos "AIza" ou "AQ."). Troque o provedor em "Configurar Chave".' }) };
    }

    if (!tema || !nicho) {
      return { statusCode: 400, headers, body: JSON.stringify({ erro: 'Parâmetros incompletos (tema e nicho são obrigatórios).' }) };
    }
    if (nicho.length > 200 || tema.length > 400 || (titulo && titulo.length > 200)) {
      return { statusCode: 400, headers, body: JSON.stringify({ erro: 'Parâmetros muito longos.' }) };
    }

    // Ganchos: 1 a 3 itens {tipo, texto} — normalizados como String
    const ganchosArr = Array.isArray(ganchos)
      ? ganchos.slice(0, 3).map((g, i) => ({
          tipo: g && typeof g.tipo === 'string' ? g.tipo.slice(0, 60) : ('Gancho ' + (i + 1)),
          texto: g && typeof g.texto === 'string' ? g.texto.slice(0, 400) : ''
        }))
      : [];
    const ganchosNorm = ganchosArr
      .map((g) => '- ' + g.tipo + ': ' + g.texto)
      .filter(l => !l.endsWith(': '))
      .join('\n');
    if (!ganchosNorm) {
      return { statusCode: 400, headers, body: JSON.stringify({ erro: 'Nenhum gancho válido recebido — gere um roteiro antes de criar a capa.' }) };
    }

    // GANCHO FOCO (0-2): qual gancho comanda ESTA capa. O cliente dispara
    // 3 requisições paralelas (uma por gancho) — assim cada capa nasce com
    // identidade visual própria, sem estourar o teto de 26s.
    const focoIdx = Number.isInteger(ganchoFoco) && ganchoFoco >= 0 && ganchoFoco < ganchosArr.length
      ? ganchoFoco
      : 0;
    const blocoFoco = 'GANCHO FOCO desta capa: ' + ganchosArr[focoIdx].tipo +
      ' — "' + ganchosArr[focoIdx].texto + '". A composição, a emoção e o texto da imagem devem nascer PRINCIPALMENTE deste gancho. Os demais ganchos servem apenas de contexto emocional.';

    // Título oficial (só YouTube Longo gera esse campo no roteiro): alinha
    // a capa ao título sem duplicá-lo. Se ausente, instrução de fallback.
    const blocoTitulo = (titulo && titulo.trim())
      ? '"' + titulo.trim().slice(0, 200) + '"'
      : '(ainda não definido — baseie-se no tema e nos ganchos)';

    // Imagem de referência (OPCIONAL): aceita data URI ou base64 cru.
    // Limite de ~3,5 MB em base64. NUNCA armazenada nem logada.
    let ref = null;
    let instrucoesReferencia = 'A capa deve ser criada do zero, com base no tema, no nicho e no gancho foco acima.';
    if (imagemRef) {
      ref = (typeof imagemRef === 'string') ? extrairBase64(imagemRef) : extrairBase64(imagemRef.base64 || imagemRef.data || '');
      if (!ref) {
        return { statusCode: 400, headers, body: JSON.stringify({ erro: 'Imagem de referência inválida (use JPEG, PNG ou WebP).' }) };
      }
      if (ref.base64.length > 5000000) {
        return { statusCode: 413, headers, body: JSON.stringify({ erro: 'Imagem de referência muito grande (máximo ~3 MB). Reduza e tente novamente.' }) };
      }
      instrucoesReferencia = 'IMAGEM DE REFERÊNCIA FORNECIDA PELO USUÁRIO (em anexo): use-a como SUJEITO/BASE da capa, mantendo o sujeito claramente reconhecível e íntegro. Transforme o enquadramento em capa de YouTube de alto CTR: fundo novo com contraste, iluminação dramática e o texto de impacto conforme as regras acima. Não altere traços ou características essenciais do sujeito.';
    }

    const prompt = interpolar(PROMPT_IMAGEM_TEMPLATE, {
      titulo: blocoTitulo,
      nicho, tema,
      ganchos: ganchosNorm,
      foco: blocoFoco,
      // BUGFIX: a chave PRECISA ter o mesmo nome do placeholder do template
      // ({instrucoes_referencia}) — antes vinha como "instrucoesReferencia"
      // e o placeholder nunca era substituído (as instruções da referência
      // não chegavam ao modelo).
      instrucoes_referencia: instrucoesReferencia
    });

    const resultado = await gerarImagem(apiKey, montarParts(prompt, ref));

    // 200 { mime, base64, texto? } — a montagem em data URI fica no cliente
    return { statusCode: 200, headers, body: JSON.stringify(resultado) };

  } catch (err) {
    const status = (err && err.status >= 400 && err.status < 500) ? err.status : ((err && err.status === 502) ? 502 : 500);
    const mensagem = err.message + (err.detalhe ? ' — Detalhe do provedor: ' + err.detalhe : '');
    return { statusCode: status, headers, body: JSON.stringify({ erro: mensagem || 'Erro interno do servidor.' }) };
  }
};

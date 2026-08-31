// ============================================================
// ViralScript AI — Netlify Function (Backend BYOK)
// As chaves NUNCA ficam aqui: o usuário usa a própria chave.
// ============================================================

const PROMPT_TEMPLATE = String.raw`Você é o Principal Engenheiro de Conteúdo Viral e Especialista em Copywriting de Elite para Monetização Multiplataforma (TikTok, Kwai, Instagram Reels, YouTube Shorts, YouTube Normal/Longo, Facebook Video e Threads). Sua missão é criar roteiros cirúrgicos de alta conversão, otimizados para maximizar o tempo de exibição (Watch Time) e a receita em qualquer plataforma.

REGRAS DE IDIOMA E REGISTRO:
- Escreva TODO o conteúdo em português brasileiro, tom natural e direto (como um criador fala com sua audiência).
- PROIBIDO começar gancho com fórmulas gastas: "Você sabia que...", "Você sabia", "Hoje eu vou te mostrar", "Oi gente", "Fala pessoal", "Neste vídeo".
- PROIBIDO clichês vazios: "mude sua vida", "isso vai te chocar", "o segredo que ninguém te conta", "as pessoas não sabem, mas".
- Proibido misturar inglês (exceto termos já naturalizados: watch time, B-roll, hook).

ESPECIFICIDADE (OBRIGATÓRIA):
- Prefira SEMPRE números, prazos e detalhes concretos a afirmações vagas: "10 mil seguidores em 30 dias" vence "muitos seguidores"; "errei 3 mil reais no cartão" vence "perdi dinheiro".
- Todo gancho e todo bloco de áudio deve conter pelo menos um elemento concreto (número, prazo, valor, ferramenta, situação específica).

TOM DE VOZ (CONSISTÊNCIA TOTAL):
- O tom "{tom}" é a ASSINATURA de todo o conteúdo: ganchos, áudio, CTA e legenda devem usar vocabulário, ritmo e exemplos que reflitam esse tom — não apenas os ganchos.

PARÂMETROS DE ENTRADA:
- Plataforma Alvo: {plataforma}
- Nicho de Atuação: {nicho}
- Tema/Ideia do Vídeo: {tema}
- Tom de Voz Desejado: {tom}
- Duração Alvo: {duracao}

DIRETRIZES TÉCNICAS E DE ALGORITMO POR PLATAFORMA ({plataforma}):
- TikTok / Kwai: Foco absoluto em retenção nos primeiros 2 segundos, curiosidade imediata, cortes ultra-dinâmicos e ganchos em formato de "História / Erro Grave / Revelação".
- Instagram Reels: Foco em salvamentos, compartilhamento via DM, valor estético elevado e CTA direcionada para conversão ou interação no direct.
- YouTube Shorts: Loop perfeito (o final do roteiro deve se conectar organicamente com a primeira palavra do gancho), ritmo acelerado e zero enrolação.
- YouTube Normal (Vídeo Longo): Foco em alta taxa de clique (CTR) e Watch Time acumulado. Abertura explosiva (sem vinhetas), divisão em blocos com retenção progressiva a cada 30-45 segundos e chamadas para inscrição e engajamento no momento certo.
- Facebook Video: Foco em Storytelling emocional, apelo visual explicativo (para exibição no mudo), grande potencial de compartilhamento em grupos e comentários acalorados.
- Threads: Plataforma de TEXTO, não de vídeo. Estruture o conteúdo como post/thread de texto: gancho de opinião forte ou fato contraintuitivo na primeira linha (é o que aparece antes do "ver mais"), desenvolvimento em blocos curtos de 1-2 frases com quebras de linha, e CTA orientada a resposta/repost. Trilha sonora e direção visual de vídeo NÃO se aplicam: preencha os campos com "-" e concentre TODO o valor no texto do campo "audio" (que aqui é o texto do post/thread).

DURAÇÃO ({duracao}):
- Se a Duração Alvo informada for um tempo específico (ex.: "30 segundos", "3 minutos"), divida os blocos para somar EXATAMENTE essa duração.
- Se estiver vazia, "-", "auto" ou "automático", use a duração padrão da plataforma: TikTok/Kwai/Reels = 30-45s · Shorts = 30-60s · YouTube Longo = 8-12 minutos · Facebook = 60-90s · Threads = 4-6 blocos de texto.
- O exemplo de formato abaixo usa tempos RELATIVOS: adapte os tempos e a QUANTIDADE de blocos à duração real (vídeo de 3 minutos exige mais blocos que 4; vídeo de 15s exige menos).

ESTRUTURA DE ENGENHARIA DE CONTEÚDO:
1. GANCHOS VIRAIS (3 Opções Irresistíveis):
   - Crie 3 variações psiquicamente irresistíveis ajustadas ao tom "{tom}" e adaptadas à plataforma {plataforma}.
   - OBRIGATÓRIO: cada gancho usa uma ESTRATÉGIA DIFERENTE (nunca repita a estratégia entre os 3 ganchos). Escolha 3 dentre: Quebra de Padrão Visceral, Alerta de Erro Crítico, Fato Contraintuitivo, Promessa Magnética.
   - Cada gancho tem no máximo 1 frase curta e impactante (máx. ~15 palavras) e é ESPECÍFICO (números e detalhes, nunca generalidades).
   - PADRÃO DE QUALIDADE (exemplo de FORMATO apenas — não copie o nicho nem o tema do exemplo): "Fiquei 30 dias sem cartão de crédito — o dia 12 quase me quebrou" (específico, pessoal, promessa implícita de história).

2. ROTEIRO CRONOMETRADO (Anti-Drop):
   - O PRIMEIRO bloco do roteiro DEVE começar EXATAMENTE com o texto do Gancho 1 (o mais forte), integrado naturalmente à narração — ganchos e roteiro são um produto só, não entregas separadas.
   - Divida o vídeo em blocos cronometrados com ritmo adaptado à plataforma {plataforma} (se for vídeo longo, crie blocos mais estruturados; se for curto, tempos concisos).
   - "audio": Narrativa fluida, persuasiva e com gatilhos de retenção contínua. TAMANHO-ALVO: 2 a 4 frases faláveis por bloco (o que a pessoa vai FALAR, no ritmo natural — ~35-45 palavras por 10 segundos).
   - "visual": Direção de cena cirúrgica. TAMANHO-ALVO: 1 a 3 indicações objetivas por bloco (texto na tela em caixa alta, B-roll, cortes, efeitos sonoros, memes, gesticulação). B-ROLL ESPECÍFICO DO NICHO {nicho}: cite cenas concretas (ex.: finanças — print de extrato, gráfico caindo, envelope rasgado; fitness — antes/depois no espelho, prato montado, suor no treino). NUNCA "B-roll genérico".
   - No Threads: "audio" carrega o texto do post/thread; "trilha_sonora" e "visual" recebem "-".

3. CALL TO ACTION (CTA) DE ALTA MONETIZAÇÃO:
   - CTA focada na metrificação principal da plataforma {plataforma} (comentários polêmicos, salvamento, compartilhamento ou inscrição/seguidor).
   - TAMANHO-ALVO: 1 a 2 frases.

4. LEGENDA & HASHTAGS SEO:
   - Primeira linha magnética para visualização prévia.
   - Texto escaneável otimizado para a busca nativa (SEO) da plataforma {plataforma}.
   - Bloco com 5 a 8 hashtags altamente relevantes para o nicho {nicho}.

REGRA RÍGIDA DE FORMATO:
Retorne EXCLUSIVAMENTE o objeto JSON válido no modelo abaixo (adapte os VALORES, nunca as chaves). NUNCA inclua introduções, explicações fora do JSON ou blocos adicionais. Preencha os campos com conteúdo REAL e específico (nunca "..." ou texto de exemplo). EXCEÇÃO DE CAMPO EXTRA: se a plataforma for YouTube Normal (Vídeo Longo), adicione como PRIMEIRO campo do objeto um campo extra "titulo" (título do vídeo com alta taxa de clique: até ~60 caracteres, curiosidade + palavra-chave do tema — é o texto da CAPA e do resultado de busca). Nas demais plataformas, NÃO inclua o campo titulo.

{
  "ganchos": [
    {"tipo": "Quebra de Padrão Visceral", "texto": "Primeira frase do gancho 1"},
    {"tipo": "Alerta de Erro Crítico", "texto": "Primeira frase do gancho 2"},
    {"tipo": "Fato Contraintuitivo", "texto": "Primeira frase do gancho 3"}
  ],
  "roteiro": [
    {"tempo": "0:00-0:03 (ajuste à duração real)", "trilha_sonora": "Descrição da trilha ou emoção sonora", "audio": "O que será falado neste bloco (2-4 frases)", "visual": "1-3 indicações de cena, texto na tela e cortes"},
    {"tempo": "próximo bloco", "trilha_sonora": "...", "audio": "...", "visual": "..."},
    {"tempo": "bloco final", "trilha_sonora": "...", "audio": "Fechamento + CTA", "visual": "..."}
  ],
  "cta": "Chamada para ação ultra-específica para a plataforma (1-2 frases)",
  "legenda": "Legenda otimizada para SEO da plataforma...\n\n#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5"
}

AUTO-VERIFICAÇÃO FINAL (silenciosa, antes de responder):
- Todos os campos preenchidos com conteúdo real e específico (nunca "..." ou texto de exemplo)?
- Os 3 ganchos usam 3 ESTRATÉGIAS DIFERENTES?
- O primeiro bloco do roteiro começa com o texto do Gancho 1?
- A soma dos tempos do roteiro respeita a Duração Alvo (ou a duração padrão da plataforma)?
- O tom "{tom}" está presente em TODOS os campos?
Se qualquer resposta for "não", corrija antes de retornar o JSON.`;

const TIMEOUT_MS = 25000;

// Prefixos válidos por provedor (LISTA — o Google emite chaves Gemini em 2
// formatos: legado "AIza..." e novo "AQ...."; ambas são válidas na API)
const PREFIXOS = {
  gemini: ['AIza', 'AQ.'],
  groq: ['gsk_'],
  openrouter: ['sk-or-']
};

const NOMES = { gemini: 'Gemini', groq: 'Groq', openrouter: 'OpenRouter' };

// 🆕 V3.1: modelo do Gemini configurável. O Google aposenta modelos com
// frequência (gemini-2.5-flash foi bloqueado para novos usuários). Com esta
// constante, a próxima troca é feita via env var AI_GEMINI_MODEL no painel
// do Netlify — SEM tocar em código. Padrão: gemini-3.6-flash (sucessor
// indicado pelo próprio Google na mensagem de erro).
const GEMINI_MODEL = process.env.AI_GEMINI_MODEL || 'gemini-3.6-flash';

// Criatividade da geração (0 a 1). Padrão 0.95: copywriting se beneficia de
// variedade alta. Override opcional via env var AI_TEMPERATURE no Netlify.
const TEMPERATURE = (() => {
  const t = parseFloat(process.env.AI_TEMPERATURE);
  return (t >= 0 && t <= 1) ? t : 0.95;
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

function interpolar(template, params) {
  let resultado = template || '';
  for (const key of Object.keys(params)) {
    const bruto = params[key] == null ? '' : String(params[key]);
    const seguro = bruto.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    resultado = resultado.split('{' + key + '}').join(seguro);
  }
  return resultado;
}

async function fetchComTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('O provedor de IA demorou demais para responder. Tente novamente.');
    }
    throw new Error('Falha de rede entre o servidor e o provedor de IA.');
  } finally {
    clearTimeout(timer);
  }
}

// Converte erros do PROVEDOR em erro com status HTTP adequado + extrai a
// mensagem REAL do corpo do erro (diagnóstico preciso no toast do usuário).
async function erroHTTP(provedor, res) {
  let erro;
  if (res.status === 401 || res.status === 403) {
    erro = new Error('Sua chave do ' + provedor + ' foi recusada (inválida, revogada ou sem permissão). Verifique em "Configurar Chave".');
  } else if (res.status === 402) {
    erro = new Error('Sua conta do ' + provedor + ' está sem créditos (HTTP 402).');
  } else if (res.status === 429) {
    erro = new Error('Limite de requisições atingido na sua conta do ' + provedor + ' (HTTP 429). Aguarde alguns minutos.');
  } else if (res.status >= 500) {
    erro = new Error('O ' + provedor + ' está com instabilidade no momento (HTTP ' + res.status + '). Tente novamente.');
  } else {
    erro = new Error('Falha na requisição ao ' + provedor + ' (HTTP ' + res.status + ').');
  }
  erro.status = res.status; // repassa o status real ao cliente

  // Extrai a mensagem detalhada do Google (se houver)
  try {
    const body = await res.json();
    if (body && body.error && body.error.message) {
      erro.detalhe = body.error.message;
    }
  } catch (e) { /* corpo ilegível — segue com a mensagem padrão */ }

  return erro;
}

// Lê o corpo JSON do provedor com proteção: respostas 200 ilegíveis (gateway,
// instabilidade) não devem virar SyntaxError críptico para o usuário.
async function lerJsonProvedor(provedor, res) {
  try {
    return await res.json();
  } catch (e) {
    throw new Error('O ' + provedor + ' retornou uma resposta ilegível (formato inesperado). Tente novamente em alguns instantes.');
  }
}

// A chave do Gemini é enviada via HEADER x-goog-api-key (método documentado
// pelo Google, compatível com chaves "AIza..." e o novo formato "AQ....").
// O modelo usado vem de GEMINI_MODEL (env AI_GEMINI_MODEL configurável).
async function chamarGemini(apiKey, prompt) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';
  const res = await fetchComTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: TEMPERATURE
      }
    })
  });
  if (!res.ok) throw await erroHTTP('Gemini', res);
  const data = await lerJsonProvedor('Gemini', res);
  if (data.error) throw new Error(data.error.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function chamarGroq(apiKey, prompt) {
  const res = await fetchComTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: TEMPERATURE
    })
  });
  if (!res.ok) throw await erroHTTP('Groq', res);
  const data = await lerJsonProvedor('Groq', res);
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content || '';
}

async function chamarOpenRouter(apiKey, prompt) {
  const res = await fetchComTimeout('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: TEMPERATURE
    })
  });
  if (!res.ok) throw await erroHTTP('OpenRouter', res);
  const data = await lerJsonProvedor('OpenRouter', res);
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content || '';
}

function repararJson(texto) {
  let out = '', inStr = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (inStr) {
      if (c === '\\') { out += c + (texto[i + 1] ?? ''); i++; continue; }
      if (c === '"') {
        let j = i + 1;
        while (j < texto.length && /\s/.test(texto[j])) j++;
        const nxt = texto[j];
        if (nxt === undefined || ':,}]'.includes(nxt)) { inStr = false; out += c; }
        else out += '\\"';
        continue;
      }
      if (c === '\n') { out += '\\n'; continue; }
      if (c === '\r') { continue; }
      if (c === '\t') { out += '\\t'; continue; }
      if (texto.charCodeAt(i) < 32) { continue; }
      out += c;
    } else {
      if (c === '"') { inStr = true; out += c; continue; }
      const code = texto.charCodeAt(i);
      if (code < 32 && c !== '\n' && c !== '\r' && c !== '\t') continue;
      out += c;
    }
  }
  return out;
}

function validarEsquema(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw new Error('A resposta da IA não é um objeto JSON válido.');
  }
  const r = {
    // Prompt Mestre V3: titulo opcional (apenas YouTube Longo gera o campo)
    titulo: dados.titulo != null ? String(dados.titulo) : '',
    ganchos: Array.isArray(dados.ganchos)
      ? dados.ganchos
          .map(g => ({ tipo: String(g?.tipo ?? 'Gancho'), texto: String(g?.texto ?? '') }))
          .filter(g => g.texto)
      : [],
    roteiro: Array.isArray(dados.roteiro)
      ? dados.roteiro.map(b => ({
          tempo: String(b?.tempo ?? ''),
          trilha_sonora: String(b?.trilha_sonora ?? ''),
          audio: String(b?.audio ?? ''),
          visual: String(b?.visual ?? '')
        }))
      : [],
    cta: dados.cta != null ? String(dados.cta) : '',
    legenda: dados.legenda != null ? String(dados.legenda) : ''
  };
  if (!r.ganchos.length && !r.roteiro.length && !r.cta && !r.legenda) {
    throw new Error('A resposta da IA não contém os campos esperados (ganchos, roteiro, cta, legenda).');
  }
  return r;
}

function parseJsonResponse(textoBruto) {
  if (!textoBruto || !textoBruto.trim()) {
    throw new Error('A resposta retornada da IA está vazia.');
  }

  const cleaned = textoBruto.replace(/```json|```/gi, '').trim();

  // Tentativa principal: parse direto do texto limpo.
  try { return validarEsquema(JSON.parse(cleaned)); } catch (e) { /* segue para o parser de resgate */ }

  // Parser de resgate: isola do primeiro { ao último } e repara controles/aspas.
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('Não foi possível isolar um objeto JSON válido na resposta da IA.');
  }
  try { return validarEsquema(JSON.parse(repararJson(match[0]))); }
  catch (e2) { throw new Error('Erro no parseamento da resposta JSON da IA.'); }
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
    const { provedor, plataforma, nicho, tema, tom, duracao } = corpo;

    if (!provedor || !Object.keys(PREFIXOS).includes(provedor)) {
      return { statusCode: 400, headers, body: JSON.stringify({ erro: 'Provedor de IA inválido.' }) };
    }
    if (!plataforma || !nicho || !tema || !tom) {
      return { statusCode: 400, headers, body: JSON.stringify({ erro: 'Parâmetros incompletos (plataforma, nicho, tema e tom são obrigatórios).' }) };
    }
    if (!apiKey) {
      return { statusCode: 401, headers, body: JSON.stringify({ erro: 'Nenhuma chave de IA configurada. Clique em "Configurar Chave" no topo da página.' }) };
    }
    // Validação de prefixo aceita LISTA de formatos por provedor
    // (Gemini: "AIza..." legado OU "AQ...." novo formato do AI Studio)
    const prefixosValidos = PREFIXOS[provedor];
    const prefixoOk = prefixosValidos.some(p => apiKey.startsWith(p));
    if (!prefixoOk) {
      return { statusCode: 401, headers, body: JSON.stringify({ erro: 'A chave informada não parece ser do ' + NOMES[provedor] + ' (prefixos aceitos: ' + prefixosValidos.map(p => '"' + p + '"').join(' ou ') + '). Confira em "Configurar Chave".' }) };
    }
    // duracao é OPCIONAL (compatível com o index.html atual): se presente, limita tamanho
    if (duracao && typeof duracao === 'string' && duracao.length > 60) {
      return { statusCode: 400, headers, body: JSON.stringify({ erro: 'Parâmetro de duração muito longo.' }) };
    }
    if (plataforma.length > 100 || nicho.length > 200 || tema.length > 400 || tom.length > 100) {
      return { statusCode: 400, headers, body: JSON.stringify({ erro: 'Parâmetros muito longos.' }) };
    }

    const prompt = interpolar(PROMPT_TEMPLATE, {
      plataforma, nicho, tema, tom,
      duracao: (duracao && String(duracao).trim()) || 'auto'
    });

    let raw = '';
    if (provedor === 'gemini')     raw = await chamarGemini(apiKey, prompt);
    if (provedor === 'groq')       raw = await chamarGroq(apiKey, prompt);
    if (provedor === 'openrouter') raw = await chamarOpenRouter(apiKey, prompt);

    const resultado = parseJsonResponse(raw);
    return { statusCode: 200, headers, body: JSON.stringify(resultado) };

  } catch (err) {
    // Erros causados pela CHAVE/conta do usuário recebem o status HTTP do
    // provedor (401/402/429); demais falhas permanecem 500.
    const status = (err && err.status >= 400 && err.status < 500) ? err.status : 500;
    const mensagem = err.message + (err.detalhe ? ' — Detalhe do provedor: ' + err.detalhe : '');
    return { statusCode: status, headers, body: JSON.stringify({ erro: mensagem || 'Erro interno do servidor.' }) };
  }
};

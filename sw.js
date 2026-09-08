// ============================================================
// ViralScript AI — Service Worker (PWA)
// Estratégia: cache do shell (CSS + páginas de conteúdo + ícones).
// A API (/api/*) NUNCA é cacheada (resposta única, dados ao vivo).
// ============================================================

const CACHE_NAME = 'viralscript-v3';

const RECURSOS_OFFLINE = [
  '/estilo.css',
  '/guia-roteiros-virais.html',
  '/guia-chave-api-gratis.html',
  '/guia-plataformas.html',
  '/faq.html',
  '/sobre.html',
  '/politica-privacidade.html',
  '/termos-uso.html',
  '/contato.html',
  '/404.html',
  '/icon.svg',
  '/icon-maskable.svg',
  '/robot.svg',
  '/apple-touch-icon.png',
  '/manifest.json'
];

// Instalação: pré-cacheia o shell. Tolerante a falhas individuais:
// cache.add() por recurso dentro de Promise.allSettled — se um arquivo
// ainda não existir no deploy, o shell instala mesmo assim.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => Promise.allSettled(RECURSOS_OFFLINE.map((url) => cache.add(url))))
    .then(() => self.skipWaiting())
  );
});

// Ativação: remove caches antigos (quando a versão do CACHE_NAME mudar)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
    .then((chaves) => Promise.all(
      chaves
      .filter((chave) => chave !== CACHE_NAME)
      .map((chave) => caches.delete(chave))
    ))
    .then(() => self.clients.claim())
  );
});

// Estratégia de fetch:
//  - /api/*          → rede SEMPRE (nunca cachear respostas de IA);
//  - HTML de navegação → rede primeiro, cai no cache se offline;
//  - CSS/ícone/manifest → cache primeiro, revalidando em segundo plano.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // API: nunca cachear
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Páginas HTML (navegação): rede primeiro, cache como fallback offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
      .then((res) => {
        const copia = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        return res;
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match('/404.html')))
    );
    return;
  }
  
  // Demais recursos (css/ícone/manifest): cache primeiro + revalidação
  event.respondWith(
    caches.match(event.request).then((doCache) => {
      const daRede = fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const copia = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
          }
          return res;
        })
        .catch(() => doCache);
      return doCache || daRede;
    })
  );
});
/* ============================================================
   Генератор индексируемых страниц пород  →  /porody/<id>.html
   ------------------------------------------------------------
   Собирает по одной странице на каждую породу из katalog/data.js
   с уникальным текстом, alt-тегами и микроразметкой (нужно для SEO).

   Как пересобрать после правок в data.js:
       node tools/build-breeds.js
   (обычно это делаю я при внесении изменений).
   ============================================================ */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://xoxloff-farm.ru';

// ── загрузка данных из katalog/data.js ──
global.window = {};
require(path.join(ROOT, 'katalog', 'data.js'));
const DATA = global.window.CATALOG_DATA;

// ── вводные тексты по породам (уникальный контент для поиска) ──
const INTRO = {
  brama: 'Брама — крупная и величественная азиатская порода кур с пышным оперением и «оперёнными» ногами. Спокойный, дружелюбный характер, отличная переносимость холода. В нашем хозяйстве брама представлена во множестве редких окрасов — от белой и чёрной до фарфоровой, сплэш, изабеллы и тёмной.',
  kohinhin: 'Кохинхин карликовый — миниатюрная декоративная порода: пушистый округлый силуэт, оперённые ножки и на редкость спокойный, ручной нрав. Идеальная птица для небольшого двора и в подарок. У нас есть карликовый кохинхин лосось, изабелла и мраморный.',
  viandot: 'Виандот карликовый — аккуратная декоративная порода с округлыми формами, плотным оперением и чётким рисунком пера. Птицы подвижные, но покладистые — одни из самых любимых у ценителей породной птицы.',
  shelkovaya: 'Китайская шёлковая — знаменитая порода с шелковистым, похожим на пух оперением, тёмной кожей и хохолком на голове. Необычайно спокойные и ручные, прекрасные наседки. Есть и редкая голошеяя разновидность.',
  lokenfelder: 'Локенфельдер — изящная редкая декоративная порода с контрастным рисунком оперения. Подвижная, выносливая птица для коллекционеров необычной птицы. Представлена в золотом и шёлковом вариантах.',
  sultan: 'Султан — нарядная хохлатая декоративная порода: пышный хохолок, «борода», оперённые ноги и пять пальцев. Спокойная выставочная птица необычного облика.',
  paduan: 'Падуан — хохлатая декоративная порода с крупным шарообразным хохлом. Эффектная выставочная птица, которая всегда привлекает внимание. Окрас шамуа — тёплый палевый с белыми «жемчужинами».',
  brikel: 'Брикель — старинная бельгийская порода с серебристо-белым корпусом и чётким чёрным поперечно-полосатым рисунком. Подвижная, выносливая, неприхотливая декоративно-яичная птица.',
  maram: 'Марам (маран) — порода, знаменитая очень тёмными, шоколадно-коричневыми яйцами. Медно-чёрный окрас: чёрное оперение с зелёным отливом и медно-красной гривой у петухов. Крепкая, спокойная птица.'
};

// ── утилиты ──
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function plural(n, one, few, many) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
}

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--brown:#7c4a1e;--brown-light:#a0622e;--yellow:#f5c842;--yellow-light:#fde98a;--cream:#fdf6e3;--cream-dark:#f0e6c8;--text:#2d1f0f;--text-muted:#6b5040;--white:#fff;--shadow:0 4px 18px rgba(124,74,30,.13);--radius:12px}
html{-webkit-text-size-adjust:100%}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:var(--cream);color:var(--text);font-size:16px;line-height:1.6}
a{color:var(--brown);text-decoration:none}img{display:block;max-width:100%}
header{background:var(--brown);color:#fff;position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,.18)}
.header-inner{max-width:1280px;margin:0 auto;padding:8px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.logo{display:flex;align-items:center;gap:10px;font-size:1.3rem;font-weight:700;color:var(--yellow)}
.logo img{width:44px;height:44px;border-radius:50%;object-fit:cover}
nav{display:flex;gap:4px;flex-wrap:wrap}
nav a{color:var(--cream);padding:8px 14px;border-radius:8px;font-weight:500}
nav a:hover,nav a.active{background:var(--yellow);color:var(--brown)}
.nav-phone{color:#fff!important;font-weight:700;white-space:nowrap}
.nav-cta{background:var(--yellow);color:var(--brown)!important;font-weight:700}
main{max-width:1100px;margin:0 auto;padding:20px 16px 56px}
.crumbs{font-size:.9rem;color:var(--text-muted);margin-bottom:18px}
.crumbs a{color:var(--brown-light)}
.breed-hero h1{font-size:clamp(1.7rem,4vw,2.4rem);color:var(--brown);margin-bottom:12px}
.breed-hero p.intro{max-width:820px;color:var(--text);font-size:1.05rem;margin-bottom:8px}
.count-line{color:var(--text-muted);margin:6px 0 28px}
.variants{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,320px));justify-content:center;gap:24px}
.variant{background:var(--white);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column}
.v-photo{aspect-ratio:1/1;background:#ddd6c6;position:relative;overflow:hidden}
.v-photo img{width:100%;height:100%;object-fit:cover}
.v-photo .ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#8a8172}
.v-photo .ph-icon{font-size:2.4rem;opacity:.6}.v-photo .ph-num{font-weight:700}.v-photo .ph-note{font-size:.75rem;opacity:.85}
.v-photo .badge{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.55);color:#fff;font-size:.78rem;border-radius:20px;padding:2px 9px}
.v-body{padding:14px 16px 16px;display:flex;flex-direction:column;flex:1;gap:8px}
.v-body h2{font-size:1.1rem;color:var(--brown);line-height:1.3}
.v-body p{font-size:.92rem;color:var(--text-muted);flex:1}
.v-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:9px 16px;border-radius:8px;font-weight:700;font-size:.9rem}
.btn-primary{background:var(--yellow);color:var(--brown)}
.btn-ghost{background:transparent;color:var(--brown);border:2px solid var(--brown)}
.breed-links{margin:34px 0 0;text-align:center}
.breed-links a{color:var(--brown-light);font-weight:600}
footer{background:var(--brown);color:var(--cream);text-align:center;padding:28px 16px;font-size:.9rem;margin-top:40px}
footer a{color:var(--yellow)}
@media(max-width:560px){.variants{grid-template-columns:1fr}}
`;

function photoImg(num, alt) {
  // кандидаты имён + запасной серый placeholder — подхватывает и DSC_0NNN.jpg, и NNN.jpg
  return `<img src="../katalog/photos/DSC_${String(num).padStart(4, '0')}.jpg" data-num="${num}" data-ci="0" loading="lazy" alt="${esc(alt)}">`;
}

function page(breed) {
  const url = `${SITE}/porody/${breed.id}.html`;
  const n = breed.variants.length;
  const intro = INTRO[breed.id] || '';
  const title = `${breed.name} — окрасы, фото, купить в Краснодарском крае | XOXLOFF farm`;
  const descText = (intro || `${breed.name}: породные куры с документами.`).replace(/\s+/g, ' ').slice(0, 300);

  const cards = breed.variants.map(v => {
    const first = v.photos.length ? v.photos[0] : null;
    const img = first !== null ? photoImg(first, v.name)
      : `<div class="ph"><div class="ph-icon">&#128247;</div></div>`;
    const badge = v.photos.length > 1 ? `<span class="badge">&#128247; ${v.photos.length}</span>` : '';
    const desc = v.description ? `<p>${esc(v.description)}</p>` : '<p>Описание появится позже.</p>';
    return `      <article class="variant">
        <div class="v-photo">${img}${badge}</div>
        <div class="v-body">
          <h2>${esc(v.name)}</h2>
          ${desc}
          <div class="v-actions">
            <a class="btn btn-primary" href="../index.html#order&amp;p=${encodeURIComponent(v.name)}">Оставить заявку</a>
            <a class="btn btn-ghost" href="../catalog.html#ad/${breed.id}/${v.id}">Все фото</a>
          </div>
        </div>
      </article>`;
  }).join('\n');

  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: SITE + '/catalog.html' },
      { '@type': 'ListItem', position: 3, name: breed.name, item: url }
    ]
  };
  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: `Окрасы: ${breed.name}`,
    itemListElement: breed.variants.map((v, i) => ({ '@type': 'ListItem', position: i + 1, name: v.name }))
  };

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(descText)}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#7c4a1e">
  <link rel="icon" type="image/svg+xml" href="../xoxloff_farm_logo.svg">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="XOXLOFF farm">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(descText)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/xoxloff_farm_logo.svg">
  <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
  <script type="application/ld+json">${JSON.stringify(itemListLd)}</script>
  <style>${CSS}</style>
</head>
<body>
<header>
  <div class="header-inner">
    <a class="logo" href="../index.html"><img src="../xoxloff_farm_logo.svg" width="44" height="44" alt="XOXLOFF farm">КурФерма</a>
    <nav>
      <a href="../index.html">Главная</a>
      <a href="../catalog.html">Каталог</a>
      <a href="../yaytso.html">Яйцо</a>
      <a href="../about.html">О нас</a>
      <a href="../contacts.html">Контакты</a>
      <a class="nav-phone" href="tel:+79037222188">☎ 8 903 722-21-88</a>
      <a class="nav-cta" href="../index.html#order">Заказать</a>
    </nav>
  </div>
</header>
<main>
  <div class="crumbs"><a href="../index.html">Главная</a> › <a href="../catalog.html">Каталог</a> › ${esc(breed.name)}</div>
  <div class="breed-hero">
    <h1>${esc(breed.name)} — окрасы и фото</h1>
    <p class="intro">${esc(intro)}</p>
  </div>
  <p class="count-line">${n} ${plural(n, 'окрас', 'окраса', 'окрасов')} в наличии. Цена у каждой птицы своя — уточняйте по заявке.</p>
  <section class="variants">
${cards}
  </section>
  <p class="breed-links"><a href="../catalog.html">← Все породы в каталоге</a></p>
</main>
<footer>
  <p>XOXLOFF farm — редкие породы кур, Краснодарский край, Динской район.</p>
  <p>Телефон: <a href="tel:+79037222188">8 (903) 722-21-88</a> · <a href="../contacts.html">Контакты</a> · <a href="../about.html">О ферме</a></p>
</footer>
<script>
// подхват имён фото: DSC_0NNN.jpg → NNN.jpg → серый placeholder
(function(){
  function pad4(n){n=String(n);while(n.length<4)n='0'+n;return n;}
  function cands(num){return ['DSC_'+pad4(num)+'.jpg','DSC_'+pad4(num)+'.JPG','DSC_'+pad4(num)+'.jpeg',num+'.jpg',num+'.jpeg',num+'.png',num+'.webp',num+'.JPG'];}
  document.addEventListener('error',function(e){
    var img=e.target;if(!img||img.tagName!=='IMG'||!img.dataset.num)return;
    var list=cands(img.dataset.num),nx=parseInt(img.dataset.ci,10)+1;
    if(nx<list.length){img.dataset.ci=nx;img.src='../katalog/photos/'+list[nx];}
    else{img.outerHTML='<div class="ph"><div class="ph-icon">&#128247;</div><div class="ph-num">№ '+img.dataset.num+'</div><div class="ph-note">фото '+img.dataset.num+'.jpg</div></div>';}
  },true);
})();
</script>
</body>
</html>
`;
}

// ── генерация ──
const outDir = path.join(ROOT, 'porody');
fs.mkdirSync(outDir, { recursive: true });
const urls = [];
DATA.breeds.forEach(b => {
  fs.writeFileSync(path.join(outDir, b.id + '.html'), page(b));
  urls.push(`${SITE}/porody/${b.id}.html`);
  console.log('  ✓ porody/' + b.id + '.html');
});

// ── sitemap.xml (главные страницы + страницы пород) ──
const today = new Date().toISOString().slice(0, 10);
const staticUrls = [
  { loc: SITE + '/', pr: '1.0', cf: 'weekly' },
  { loc: SITE + '/catalog.html', pr: '0.9', cf: 'weekly' },
  { loc: SITE + '/yaytso.html', pr: '0.8', cf: 'weekly' },
  { loc: SITE + '/about.html', pr: '0.6', cf: 'monthly' },
  { loc: SITE + '/contacts.html', pr: '0.7', cf: 'monthly' }
];
const breedUrls = urls.map(u => ({ loc: u, pr: '0.8', cf: 'weekly' }));
const sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  [...staticUrls, ...breedUrls].map(u =>
    `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.cf}</changefreq>\n    <priority>${u.pr}</priority>\n  </url>`
  ).join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm);
console.log('  ✓ sitemap.xml (' + (staticUrls.length + breedUrls.length) + ' URL)');
console.log('Готово: ' + urls.length + ' страниц пород.');

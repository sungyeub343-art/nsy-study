// 지역 상세 페이지(쿼리스트링 + JS 렌더링)를 시·군·구 단위 정적 HTML로 미리 만들어 local/ 아래에 저장하고,
// sitemap.xml을 다시 생성합니다. 크롤러가 JS를 실행하지 않아도 지역별 본문을 읽을 수 있게 하기 위함입니다.
//
// 사용법: cd tools && npm install && npm run build:local
const fs = require('fs');
const path = require('path');
const {JSDOM, VirtualConsole} = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://nsystudy.kr';
const OUT_DIR = path.join(ROOT, 'local');
const TODAY = new Date().toISOString().slice(0, 10);

// key는 정적 페이지 경로(/local/<key>/...)이자 기존 페이지 인라인 리다이렉트에서 쓰는 값입니다.
const SUBJECTS = [
  {key: 'all', page: 'region.html', label: '전과목', name: '전과목 과외'},
  {key: 'math', page: 'math-region.html', label: '수학', name: '수학 과외'},
  {key: 'english', page: 'english-region.html', label: '영어', name: '영어 과외'},
  {key: 'korean', page: 'korean-region.html', label: '국어', name: '국어 과외'},
  {key: 'science', page: 'science-region.html', label: '과학', name: '과학 과외'},
  {key: 'social', page: 'social-region.html', label: '사회', name: '사회 과외'},
  {key: 'essay', page: 'essay-region.html', label: '논술', name: '논술 과외'},
  {key: 'ged', page: 'ged-detail.html', label: '검정고시', name: '검정고시 과외'},
];

const HUB_PAGES = [
  ['', '1.0', 'weekly'],
  ['regions.html', '0.9', 'weekly'],
  ['math.html', '0.9', 'weekly'],
  ['english.html', '0.9', 'weekly'],
  ['korean.html', '0.9', 'weekly'],
  ['science.html', '0.9', 'weekly'],
  ['social.html', '0.9', 'weekly'],
  ['international.html', '0.8', 'weekly'],
  ['ged.html', '0.8', 'weekly'],
  ['essay.html', '0.8', 'weekly'],
  ['special-highschool.html', '0.8', 'weekly'],
  ['tutoring-guide.html', '0.8', 'monthly'],
  ['local/', '0.8', 'weekly'],
];

const INTL_SCHOOLS = ['korean-foreign-school-seoul', 'seoul-dwight-school', 'chadwick-jeju', 'nlcs-jeju'];

function slugFor(province, city){
  return province === city ? province : `${province}-${city}`;
}

function staticPath(key, province, city){
  return `/local/${key}/${encodeURIComponent(slugFor(province, city))}.html`;
}

function escapeHtml(text){
  return String(text).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
}

function loadRegions(){
  const text = fs.readFileSync(path.join(ROOT, 'regions-data.js'), 'utf8');
  return [...text.matchAll(/\{"province":"([^"]+)","cities":(\[[^\]]*\])\}/g)]
    .map((m) => ({province: m[1], cities: JSON.parse(m[2])}));
}

// 페이지 HTML에서 로컬 스크립트 목록을 뽑고, 정적 결과물에는 남기지 않을 스크립트를 제거합니다.
function prepareTemplate(page){
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const scripts = [...html.matchAll(/<script[^>]*\ssrc="(?!https?:)([^"?]+)[^"]*"[^>]*><\/script>/g)].map((m) => m[1]);
  const stripped = html
    .replace(/[ \t]*<script[^>]*\ssrc="(?!https?:)[^"]*"[^>]*><\/script>\n?/g, '')
    .replace(/<script>[^<]*location\.replace[^<]*<\/script>/g, '')
    .replace(/<meta charset="utf-8" \/>/i, '<meta charset="utf-8" />\n    <base href="/" />');
  const sources = scripts.map((file) => fs.readFileSync(path.join(ROOT, file), 'utf8'));
  return {html: stripped, sources};
}

function renderPage(subject, template, province, city){
  const query = new URLSearchParams({province, city}).toString();
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (e) => errors.push(e.message));
  const dom = new JSDOM(template.html, {url: `${BASE}/${subject.page}?${query}`, runScripts: 'outside-only', virtualConsole});
  const {window} = dom;
  template.sources.forEach((source) => window.eval(source));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  if(errors.length) throw new Error(`${subject.page} ${province} ${city}: ${errors.join(' | ')}`);
  return dom;
}

function finalizePage(dom, subject, province, city, regions){
  const {document} = dom.window;
  const url = `${BASE}${staticPath(subject.key, province, city)}`;

  let canonical = document.querySelector('link[rel="canonical"]');
  if(!canonical){
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if(!ogUrl){
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', url);
  const robots = document.querySelector('meta[name="robots"]');
  if(robots) robots.setAttribute('content', 'index,follow,max-image-preview:large');
  // 구조화 데이터에 남은 기존 쿼리스트링 주소를 정적 주소로 바꿉니다.
  const queryUrl = new RegExp(`${BASE.replace(/\./g, '\\.')}/${subject.page.replace(/\./g, '\\.')}\\?[^"\\s]*`, 'g');
  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    script.textContent = script.textContent.replace(queryUrl, url);
  });

  const place = province === city ? province : `${province} ${city}`;
  const otherSubjects = SUBJECTS.filter((s) => s.key !== subject.key)
    .map((s) => `<a href="${staticPath(s.key, province, city)}">${escapeHtml(`${city} ${s.name}`)}</a>`).join('');
  const region = regions.find((r) => r.province === province);
  const otherCities = region.cities.filter((c) => c !== city)
    .map((c) => `<a href="${staticPath(subject.key, province, c)}">${escapeHtml(`${c} ${subject.name}`)}</a>`).join('');
  const section = document.createElement('section');
  section.className = 'section section-light';
  section.innerHTML = `<div class="container">
        <h2 class="keyword-group-title">${escapeHtml(place)} 다른 과목 과외</h2>
        <div class="keyword-links">${otherSubjects}</div>
        ${otherCities ? `<h2 class="keyword-group-title">${escapeHtml(province)} 다른 지역 ${escapeHtml(subject.name)}</h2>
        <div class="keyword-links">${otherCities}</div>` : ''}
        <p class="region-help-text" style="margin-top:1rem;"><a href="/local/">전국 지역별 과외 안내 전체 보기</a></p>
      </div>`;
  (document.querySelector('main') || document.body).appendChild(section);
  return {html: dom.serialize(), url};
}

function buildIndexPage(regions, headerHtml){
  const groups = SUBJECTS.map((subject) => {
    const provinces = regions.map((r) => `
          <h3 class="keyword-group-title">${escapeHtml(r.province)}</h3>
          <div class="keyword-links">${r.cities.map((c) => `<a href="${staticPath(subject.key, r.province, c)}">${escapeHtml(r.province === c ? `${c} ${subject.name}` : `${c} ${subject.name}`)}</a>`).join('')}</div>`).join('');
    return `
      <section class="section${subject.key === 'all' ? '' : ' section-light'}" id="${subject.key}">
        <div class="container">
          <div class="section-heading"><p class="eyebrow">${escapeHtml(subject.label)}</p><h2>전국 지역별 ${escapeHtml(subject.name)}</h2></div>${provinces}
        </div>
      </section>`;
  }).join('');
  const jump = SUBJECTS.map((s) => `<a href="#${s.key}">${escapeHtml(s.name)}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <base href="/" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="brand-favicon.svg" />
    <title>전국 지역별 과외 안내 | 수학·영어·국어·과학·사회·논술·검정고시 | 상상코칭</title>
    <meta name="description" content="전국 시·군·구별 수학·영어·국어·과학·사회·논술·검정고시 1:1 과외 안내 페이지 모음입니다. 우리 지역 과외 정보를 확인하고 무료 상담을 받아보세요. 010-2928-3614" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${BASE}/local/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="상상코칭" />
    <meta property="og:title" content="전국 지역별 과외 안내 | 상상코칭" />
    <meta property="og:url" content="${BASE}/local/" />
    <meta property="og:image" content="${BASE}/data/og-cover.png" />
    <link rel="stylesheet" href="styles.css?v=20261021a" />
  </head>
  <body>
    ${headerHtml}
    <main>
      <section class="section hero hero--compact">
        <div class="container">
          <div class="regions-hero-center">
            <h1>전국 지역별 과외 안내</h1>
            <p class="regions-hero-desc">시·군·구와 과목을 선택하면 해당 지역 과외 안내 페이지로 이동합니다.</p>
            <div class="keyword-links" style="justify-content:center;">${jump}</div>
          </div>
        </div>
      </section>${groups}
    </main>
    <footer class="site-footer"><div class="container footer-wrap"><p>© 2026 상상코칭. 전국 지역별 과외 안내.</p><a href="index.html">홈으로</a></div></footer>
  </body>
</html>
`;
}

function buildSitemap(staticUrls){
  const entry = (loc, priority, changefreq) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  HUB_PAGES.forEach(([p, priority, freq]) => lines.push(entry(`${BASE}/${p}`, priority, freq)));
  INTL_SCHOOLS.forEach((school) => lines.push(entry(`${BASE}/international-detail.html?school=${school}`, '0.7', 'weekly')));
  staticUrls.forEach((url) => lines.push(entry(url, '0.7', 'weekly')));
  lines.push('</urlset>', '');
  return lines.join('\n');
}

function buildSubject(subject, regions){
  const template = prepareTemplate(subject.page);
  const dir = path.join(OUT_DIR, subject.key);
  fs.rmSync(dir, {recursive: true, force: true});
  fs.mkdirSync(dir, {recursive: true});
  let count = 0;
  for(const {province, cities} of regions){
    for(const city of cities){
      const dom = renderPage(subject, template, province, city);
      const {html} = finalizePage(dom, subject, province, city, regions);
      dom.window.close();
      fs.writeFileSync(path.join(dir, `${slugFor(province, city)}.html`), html);
      count += 1;
    }
  }
  console.log(`${subject.key}: ${count} pages`);
}

function main(){
  const regions = loadRegions();
  const only = process.argv[2];
  if(only){
    buildSubject(SUBJECTS.find((s) => s.key === only), regions);
    return;
  }
  // jsdom 창이 과목 하나 분량만 쌓여도 메모리가 커서, 과목마다 별도 프로세스로 생성합니다.
  const {execFileSync} = require('child_process');
  SUBJECTS.forEach((subject) => {
    execFileSync(process.execPath, ['--max-old-space-size=4096', __filename, subject.key], {stdio: 'inherit'});
  });
  const staticUrls = SUBJECTS.flatMap((subject) => regions.flatMap(({province, cities}) =>
    cities.map((city) => `${BASE}${staticPath(subject.key, province, city)}`)));

  const regionHtml = fs.readFileSync(path.join(ROOT, 'region.html'), 'utf8');
  const headerHtml = (regionHtml.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0];
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), buildIndexPage(regions, headerHtml));
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(staticUrls));
  console.log(`done: ${staticUrls.length} static pages, sitemap ${staticUrls.length + HUB_PAGES.length + INTL_SCHOOLS.length} urls`);
}

main();

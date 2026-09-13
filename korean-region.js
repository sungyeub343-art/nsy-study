function decodeKoreanParam(value){
  try{ return decodeURIComponent(value); }catch(e){ return value; }
}

function buildKoreanCanonicalUrl(){
  const source = new URLSearchParams(window.location.search);
  const params = new URLSearchParams();
  ['province', 'city', 'town'].forEach((key) => {
    const value = source.get(key);
    if(value) params.set(key, value);
  });
  return `https://nsystudy.kr/korean-region.html?${params.toString()}`;
}

function upsertJsonLdScript(id, data){
  let script = document.getElementById(id);
  if(!script){
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function buildKoreanPlaceText(province, city, town){
  const base = province === city || !city ? province : `${province} ${city}`;
  return town ? `${base} ${town}` : base;
}

function updateKoreanMetaTags(placeText){
  const pageTitle = `${placeText} 국어 과외 | 초등·중등·고등 무료상담`;
  const pageDescription = `${placeText} 지역 1:1 국어 과외 안내입니다. 초등 독해와 글쓰기, 중등 내신, 고등 문학·비문학·문법·수능 국어 학습 진단과 방문·화상 수업 무료 상담을 제공합니다.`;
  const canonicalUrl = buildKoreanCanonicalUrl();
  const keywords = `${placeText} 국어 과외, ${placeText} 국어 과외 추천, ${placeText} 국어 과외 비용, ${placeText} 초등 국어, ${placeText} 중등 국어, ${placeText} 고등 국어, ${placeText} 내신 국어, ${placeText} 수능 국어`;

  document.title = pageTitle;
  const metaTitle = document.getElementById('metaTitle');
  if(metaTitle) metaTitle.textContent = pageTitle;
  ['ogTitle', 'twitterTitle'].forEach((id) => {
    const element = document.getElementById(id);
    if(element) element.setAttribute('content', pageTitle);
  });
  ['metaDescription', 'ogDescription', 'twitterDescription'].forEach((id) => {
    const element = document.getElementById(id);
    if(element) element.setAttribute('content', pageDescription);
  });
  const metaKeywords = document.getElementById('metaKeywords');
  if(metaKeywords) metaKeywords.setAttribute('content', keywords);
  const canonical = document.getElementById('canonicalLink');
  if(canonical) canonical.setAttribute('href', canonicalUrl);
  const ogUrl = document.getElementById('ogUrl');
  if(ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  const robots = document.getElementById('metaRobots');
  if(robots) robots.setAttribute('content', 'index,follow,max-image-preview:large');

  upsertJsonLdScript('breadcrumbSchema', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: '홈', item: 'https://nsystudy.kr/'},
      {'@type': 'ListItem', position: 2, name: '국어 과외', item: 'https://nsystudy.kr/korean.html'},
      {'@type': 'ListItem', position: 3, name: placeText, item: canonicalUrl}
    ]
  });

  upsertJsonLdScript('serviceSchema', {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${placeText} 국어 과외`,
    description: pageDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'NSY Study',
      url: 'https://nsystudy.kr/',
      telephone: '+82-10-2928-3614',
      areaServed: 'KR'
    },
    areaServed: placeText,
    availableLanguage: 'ko-KR'
  });
}

function buildKoreanRegionUrl(province, city, town){
  const params = new URLSearchParams({ province, city });
  if(town) params.set('town', town);
  return `korean-region.html?${params.toString()}`;
}

function getKoreanRegionTowns(province, city){
  return ((window.subRegionsData || {})[province] || {})[city] || [];
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const province = decodeKoreanParam(params.get('province') || '');
  const city = decodeKoreanParam(params.get('city') || '');
  const town = decodeKoreanParam(params.get('town') || '');
  const title = document.getElementById('regionTitle');
  const metaLine = document.getElementById('metaLine');
  const content = document.getElementById('articleContent');
  const backLink = document.getElementById('backToList');
  const subregionSection = document.getElementById('subregionSection');
  const subregionTitle = document.getElementById('subregionTitle');
  const subregionHelp = document.getElementById('subregionHelp');
  const subregionGrid = document.getElementById('subregionGrid');
  const consult = document.getElementById('consultBtn');

  if(!province || !city){
    title.textContent = '지역 정보를 찾을 수 없습니다.';
    content.innerHTML = '<p style="color:var(--muted)">국어 과외 지역 목록에서 지역을 다시 선택해 주세요.</p>';
    return;
  }

  const placeText = buildKoreanPlaceText(province, city, town);
  const localLabel = town || city;
  const towns = getKoreanRegionTowns(province, city);
  updateKoreanMetaTags(placeText);

  if(town){
    backLink.href = buildKoreanRegionUrl(province, city, '');
    backLink.textContent = `← ${city} 동읍면 목록으로 돌아가기`;
  }else{
    backLink.href = 'korean.html';
    backLink.textContent = '← 국어 과외 지역 목록으로 돌아가기';
  }

  if(!town && towns.length > 0){
    subregionSection.style.display = 'block';
    subregionTitle.textContent = `${city} 동읍면 국어 과외 지역 선택`;
    subregionHelp.textContent = '거주 또는 수업 희망 동읍면을 선택하면 더 자세한 지역 상담 페이지로 이동합니다.';
    towns.forEach((name) => {
      const link = document.createElement('a');
      link.className = 'district-chip';
      link.textContent = name;
      link.href = buildKoreanRegionUrl(province, city, name);
      subregionGrid.appendChild(link);
    });
  }

  title.textContent = `${placeText} 국어 과외 상담 안내`;
  metaLine.textContent = '초등·중등·고등 국어 맞춤 상담 · 방문 및 화상 수업';
  content.innerHTML = `
    <p style="margin-top:0;color:var(--muted)">${localLabel} 지역 학생을 위한 1:1 국어 과외 상담 안내입니다. 학년, 현재 성적, 읽기 습관과 취약 영역을 확인한 뒤 학교 수업과 시험 일정에 맞는 학습 계획을 제안합니다.</p>
    <h2 style="margin-top:1.4rem">학년별 국어 과외</h2>
    <div class="tip-cards">
      <div class="tip-card"><h4>초등 국어</h4><p>읽기 유창성, 어휘, 중심 내용 찾기, 요약과 글쓰기를 연결해 문해력의 기초를 다집니다.</p></div>
      <div class="tip-card"><h4>중등 국어</h4><p>교과서 문학 작품, 독서 지문, 문법과 서술형을 학교별 시험 범위에 맞춰 정리합니다.</p></div>
      <div class="tip-card"><h4>고등·수능 국어</h4><p>문학과 독서, 화법과 작문, 언어와 매체를 기출 분석과 시간 관리 훈련으로 대비합니다.</p></div>
    </div>
    <h2 style="margin-top:1.6rem">상담 시 확인하는 항목</h2>
    <ul>
      <li>학생 학년, 학교, 최근 성적과 목표 등급</li>
      <li>문학·비문학·문법·서술형 등 취약 영역</li>
      <li>내신, 모의고사, 수능 또는 문해력 향상 목표</li>
      <li>방문·화상 수업 방식과 주당 횟수, 예상 비용</li>
    </ul>
    <h2 style="margin-top:1.6rem">국어 실력 향상 과정</h2>
    <ol>
      <li><strong>진단:</strong> 지문 독해 과정과 오답 원인을 확인합니다.</li>
      <li><strong>개념:</strong> 작품, 독서 제재, 문법 개념을 학생 언어로 정리합니다.</li>
      <li><strong>적용:</strong> 학교 문제와 기출문제로 근거를 찾는 풀이를 반복합니다.</li>
      <li><strong>점검:</strong> 오답과 시간 배분을 기록해 다음 학습 계획에 반영합니다.</li>
    </ol>
    <div class="info-card" style="margin-top:1.4rem;">
      <h3 style="margin-top:0">${localLabel} 국어 과외 상담</h3>
      <p style="margin-bottom:0;color:var(--muted)">상담은 무료이며 학생에게 필요한 수업 범위와 일정, 방문 또는 화상 가능 여부를 확인한 뒤 적합한 수업 방향을 안내합니다.</p>
    </div>
  `;

  const subject = encodeURIComponent(`${placeText} 국어 과외 상담 신청`);
  consult.href = 'tel:+821029283614';
  consult.setAttribute('data-mailto', `mailto:hello@nsystudy.kr?subject=${subject}`);
});

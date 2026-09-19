function decodeSocialParam(value){
  try{ return decodeURIComponent(value); }catch(e){ return value; }
}

function buildSocialCanonicalUrl(){
  const source = new URLSearchParams(window.location.search);
  const params = new URLSearchParams();
  ['province', 'city', 'town'].forEach((key) => {
    const value = source.get(key);
    if(value) params.set(key, value);
  });
  return `https://nsystudy.kr/social-region.html?${params.toString()}`;
}

function upsertSocialJsonLd(id, data){
  let script = document.getElementById(id);
  if(!script){
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function buildSocialPlaceText(province, city, town){
  const base = province === city || !city ? province : `${province} ${city}`;
  return town ? `${base} ${town}` : base;
}

function updateSocialMetaTags(placeText){
  const pageTitle = `${placeText} 사회 과외 | 초등·중등·고등 무료상담`;
  const pageDescription = `${placeText} 지역 1:1 사회 과외 안내입니다. 초등 사회, 중등 내신, 고등 통합사회·한국사·생활과 윤리·사회문화·정치와 법·경제·지리 학습 진단과 방문·화상 수업 무료 상담을 제공합니다.`;
  const canonicalUrl = buildSocialCanonicalUrl();
  const keywords = `${placeText} 사회 과외, ${placeText} 사회 과외 추천, ${placeText} 사회 과외 비용, ${placeText} 초등 사회, ${placeText} 중등 사회, ${placeText} 고등 사회, ${placeText} 통합사회, ${placeText} 사회탐구`;

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

  upsertSocialJsonLd('breadcrumbSchema', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: '홈', item: 'https://nsystudy.kr/'},
      {'@type': 'ListItem', position: 2, name: '사회 과외', item: 'https://nsystudy.kr/social.html'},
      {'@type': 'ListItem', position: 3, name: placeText, item: canonicalUrl}
    ]
  });

  upsertSocialJsonLd('serviceSchema', {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${placeText} 사회 과외`,
    description: pageDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: '상상코칭',
      url: 'https://nsystudy.kr/',
      telephone: '+82-10-2928-3614',
      areaServed: 'KR'
    },
    areaServed: placeText,
    availableLanguage: 'ko-KR'
  });
}

function buildSocialRegionUrl(province, city, town){
  const params = new URLSearchParams({ province, city });
  if(town) params.set('town', town);
  return `social-region.html?${params.toString()}`;
}

function getSocialRegionTowns(province, city){
  return ((window.subRegionsData || {})[province] || {})[city] || [];
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const province = decodeSocialParam(params.get('province') || '');
  const city = decodeSocialParam(params.get('city') || '');
  const town = decodeSocialParam(params.get('town') || '');
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
    content.innerHTML = '<p style="color:var(--muted)">사회 과외 지역 목록에서 지역을 다시 선택해 주세요.</p>';
    return;
  }

  const placeText = buildSocialPlaceText(province, city, town);
  const localLabel = town || city;
  const towns = getSocialRegionTowns(province, city);
  updateSocialMetaTags(placeText);

  if(town){
    backLink.href = buildSocialRegionUrl(province, city, '');
    backLink.textContent = `← ${city} 동읍면 목록으로 돌아가기`;
  }else{
    backLink.href = 'social.html';
    backLink.textContent = '← 사회 과외 지역 목록으로 돌아가기';
  }

  if(!town && towns.length > 0){
    subregionSection.style.display = 'block';
    subregionTitle.textContent = `${city} 동읍면 사회 과외 지역 선택`;
    subregionHelp.textContent = '거주 또는 수업 희망 동읍면을 선택하면 더 자세한 지역 상담 페이지로 이동합니다.';
    towns.forEach((name) => {
      const link = document.createElement('a');
      link.className = 'district-chip';
      link.textContent = name;
      link.href = buildSocialRegionUrl(province, city, name);
      subregionGrid.appendChild(link);
    });
  }

  title.textContent = `${placeText} 사회 과외 상담 안내`;
  metaLine.textContent = '초등·중등·고등 사회 맞춤 상담 · 방문 및 화상 수업';
  content.innerHTML = `
    <p style="margin-top:0;color:var(--muted)">${localLabel} 지역 학생을 위한 1:1 사회 과외 상담 안내입니다. 학년, 현재 성적, 개념 이해도와 취약 영역을 확인한 뒤 학교 수업과 시험 일정에 맞는 학습 계획을 제안합니다.</p>
    <h2 style="margin-top:1.4rem">학년별 사회 과외</h2>
    <div class="tip-cards">
      <div class="tip-card"><h4>초등 사회</h4><p>지도와 연표, 사진과 도표를 교과 개념에 연결하고 핵심 용어와 자료 읽기의 기초를 다집니다.</p></div>
      <div class="tip-card"><h4>중등 사회·역사</h4><p>지리·일반사회·역사의 핵심 개념과 사료·지도·통계 자료, 학교별 서술형 문제를 함께 대비합니다.</p></div>
      <div class="tip-card"><h4>고등·수능 사회탐구</h4><p>통합사회와 선택 과목의 개념을 체계화하고 자료 분석, 선지 판단, 기출 문제 풀이를 훈련합니다.</p></div>
    </div>
    <h2 style="margin-top:1.6rem">상담 시 확인하는 항목</h2>
    <ul>
      <li>학생 학년, 학교, 최근 성적과 목표 등급</li>
      <li>통합사회·한국사·생활과 윤리·사회문화·정치와 법·경제·지리 중 학습 과목</li>
      <li>개념·암기·자료 해석·사료 분석·서술형 등 취약 영역</li>
      <li>방문·화상 수업 방식과 주당 횟수, 예상 비용</li>
    </ul>
    <h2 style="margin-top:1.6rem">사회 실력 향상 과정</h2>
    <ol>
      <li><strong>진단:</strong> 개념 이해와 자료 분석 과정에서 막히는 지점을 확인합니다.</li>
      <li><strong>개념:</strong> 사건, 제도, 지역과 사회 현상의 관계를 학생 언어로 정리합니다.</li>
      <li><strong>적용:</strong> 지도·도표·통계·사료와 기출문제로 근거를 찾는 연습을 반복합니다.</li>
      <li><strong>점검:</strong> 오답 원인과 취약 단원을 기록해 다음 학습 계획에 반영합니다.</li>
    </ol>
    <div class="info-card" style="margin-top:1.4rem;">
      <h3 style="margin-top:0">${localLabel} 사회 과외 상담</h3>
      <p style="margin-bottom:0;color:var(--muted)">상담은 무료이며 학생에게 필요한 과목과 수업 범위, 일정, 방문 또는 화상 가능 여부를 확인한 뒤 적합한 수업 방향을 안내합니다.</p>
    </div>
  `;

  const subject = encodeURIComponent(`${placeText} 사회 과외 상담 신청`);
  consult.href = 'tel:+821029283614';
  consult.setAttribute('data-mailto', `mailto:hello@nsystudy.kr?subject=${subject}`);
});
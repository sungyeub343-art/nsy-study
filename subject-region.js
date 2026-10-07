const SUBJECT_DETAIL_CONFIGS = {
  math: {
    subject: '수학',
    hub: 'math.html',
    detail: 'math-region.html',
    eyebrow: '수학 과외',
    metaLine: '초등·중등·고등 수학 맞춤 상담 · 방문 및 화상 수업',
    description: '초등 연산과 사고력, 중등 내신, 고등 수학·수능 대비 학습 진단과 방문·화상 수업 무료 상담을 제공합니다.',
    keywords: ['초등 수학 과외', '중등 수학 과외', '고등 수학 과외', '내신 수학 과외', '수능 수학 과외', '수포자 과외', '수학 과외 추천', '수학 과외 비용'],
    cards: [
      ['초등 수학', '연산 정확도와 수 감각, 문장제 풀이 과정을 점검해 개념과 사고력의 기초를 다집니다.'],
      ['중등 수학', '학교별 진도에 맞춰 개념, 유형, 서술형과 내신 기출을 연결하고 취약 단원을 보완합니다.'],
      ['고등·수능 수학', '공통수학과 선택 과목의 개념을 체계화하고 모의고사·수능 기출 풀이와 시간 관리를 훈련합니다.']
    ],
    weakAreas: '연산·개념·유형·서술형·고난도 문제 중 취약 영역',
    process: [
      ['진단', '개념 이해와 문제 풀이 과정에서 막히는 지점을 확인합니다.'],
      ['개념', '공식의 원리와 단원 간 연결을 학생 언어로 정리합니다.'],
      ['적용', '학교 문제와 기출문제로 조건을 해석하고 풀이를 완성합니다.'],
      ['점검', '오답 원인과 취약 단원을 기록해 다음 학습 계획에 반영합니다.']
    ]
  },
  english: {
    subject: '영어',
    hub: 'english.html',
    detail: 'english-region.html',
    eyebrow: '영어 과외',
    metaLine: '초등·중등·고등 영어 맞춤 상담 · 방문 및 화상 수업',
    description: '초등 영어 기초, 중등 내신, 고등 독해·문법·수능 영어 학습 진단과 방문·화상 수업 무료 상담을 제공합니다.',
    keywords: ['초등 영어 과외', '중등 영어 과외', '고등 영어 과외', '내신 영어 과외', '수능 영어 과외', '영포자 과외', '영어 과외 추천', '영어 과외 비용'],
    cards: [
      ['초등 영어', '파닉스와 어휘, 문장 읽기와 듣기·말하기를 연결해 영어 학습의 기초를 다집니다.'],
      ['중등 영어', '교과서 본문, 문법, 어휘와 서술형을 학교별 시험 범위에 맞춰 대비합니다.'],
      ['고등·수능 영어', '구문과 독해, 어법, 듣기, 모의고사·수능 기출 풀이와 시간 관리를 훈련합니다.']
    ],
    weakAreas: '어휘·문법·구문·독해·듣기·서술형 중 취약 영역',
    process: [
      ['진단', '어휘량과 문장 해석, 문제 풀이 과정에서 막히는 지점을 확인합니다.'],
      ['개념', '문법과 구문 원리를 실제 문장에 연결해 정리합니다.'],
      ['적용', '교과서와 기출 지문으로 근거를 찾는 독해를 반복합니다.'],
      ['점검', '오답과 누적 어휘를 기록해 다음 학습 계획에 반영합니다.']
    ]
  }
};

function decodeSubjectParam(value){
  try{ return decodeURIComponent(value); }catch(e){ return value; }
}

function buildSubjectPlaceText(province, city, town){
  const base = province === city || !city ? province : `${province} ${city}`;
  return town ? `${base} ${town}` : base;
}

function buildSubjectRegionUrl(config, province, city, town){
  const params = new URLSearchParams({ province, city });
  if(town) params.set('town', town);
  return `${config.detail}?${params.toString()}`;
}

function buildSubjectCanonicalUrl(config){
  const source = new URLSearchParams(window.location.search);
  const params = new URLSearchParams();
  ['province', 'city', 'town'].forEach((key) => {
    const value = source.get(key);
    if(value) params.set(key, value);
  });
  return `https://nsystudy.kr/${config.detail}?${params.toString()}`;
}

function upsertSubjectJsonLd(id, data){
  let script = document.getElementById(id);
  if(!script){
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function updateSubjectMeta(config, placeText){
  const pageTitle = `${placeText} ${config.subject} 과외 | 초등·중등·고등 무료상담`;
  const pageDescription = `${placeText} 지역 1:1 ${config.subject} 과외 안내입니다. ${config.description}`;
  const canonicalUrl = buildSubjectCanonicalUrl(config);
  const keywordText = config.keywords.map((keyword) => `${placeText} ${keyword}`).join(', ');

  document.title = pageTitle;
  const title = document.getElementById('metaTitle');
  if(title) title.textContent = pageTitle;
  ['ogTitle', 'twitterTitle'].forEach((id) => {
    const element = document.getElementById(id);
    if(element) element.setAttribute('content', pageTitle);
  });
  ['metaDescription', 'ogDescription', 'twitterDescription'].forEach((id) => {
    const element = document.getElementById(id);
    if(element) element.setAttribute('content', pageDescription);
  });
  const keywords = document.getElementById('metaKeywords');
  if(keywords) keywords.setAttribute('content', keywordText);
  const canonical = document.getElementById('canonicalLink');
  if(canonical) canonical.setAttribute('href', canonicalUrl);
  const ogUrl = document.getElementById('ogUrl');
  if(ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  const robots = document.getElementById('metaRobots');
  if(robots) robots.setAttribute('content', 'index,follow,max-image-preview:large');

  upsertSubjectJsonLd('breadcrumbSchema', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: '홈', item: 'https://nsystudy.kr/'},
      {'@type': 'ListItem', position: 2, name: `${config.subject} 과외`, item: `https://nsystudy.kr/${config.hub}`},
      {'@type': 'ListItem', position: 3, name: placeText, item: canonicalUrl}
    ]
  });
  upsertSubjectJsonLd('serviceSchema', {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${placeText} ${config.subject} 과외`,
    description: pageDescription,
    provider: {'@type': 'LocalBusiness', name: '상상코칭', url: 'https://nsystudy.kr/', telephone: '+82-10-2928-3614'},
    areaServed: placeText,
    availableLanguage: 'ko-KR'
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const config = SUBJECT_DETAIL_CONFIGS[document.body.dataset.subjectKey];
  if(!config) return;

  const params = new URLSearchParams(window.location.search);
  const province = decodeSubjectParam(params.get('province') || '');
  const city = decodeSubjectParam(params.get('city') || '');
  const town = decodeSubjectParam(params.get('town') || '');
  const title = document.getElementById('regionTitle');
  const content = document.getElementById('articleContent');
  const backLink = document.getElementById('backToList');
  const subregionSection = document.getElementById('subregionSection');
  const subregionTitle = document.getElementById('subregionTitle');
  const subregionHelp = document.getElementById('subregionHelp');
  const subregionGrid = document.getElementById('subregionGrid');
  const towns = ((window.subRegionsData || {})[province] || {})[city] || [];

  document.querySelectorAll('[data-subject-label]').forEach((element) => { element.textContent = config.eyebrow; });
  document.getElementById('metaLine').textContent = config.metaLine;
  backLink.href = town ? buildSubjectRegionUrl(config, province, city, '') : config.hub;
  backLink.textContent = town ? `← ${city} 동읍면 목록으로 돌아가기` : `← ${config.subject} 과외 지역 목록으로 돌아가기`;

  if(!province || !city){
    title.textContent = '지역 정보를 찾을 수 없습니다.';
    content.innerHTML = `<p style="color:var(--muted)">${config.subject} 과외 지역 목록에서 지역을 다시 선택해 주세요.</p>`;
    return;
  }

  const placeText = buildSubjectPlaceText(province, city, town);
  const localLabel = town || city;
  updateSubjectMeta(config, placeText);
  title.textContent = `${placeText} ${config.subject} 과외 상담 안내`;

  if(!town && towns.length > 0){
    subregionSection.style.display = 'block';
    subregionTitle.textContent = `${city} 동읍면 ${config.subject} 과외 지역 선택`;
    subregionHelp.textContent = '거주 또는 수업 희망 동읍면을 선택하면 더 자세한 지역 상담 페이지로 이동합니다.';
    towns.forEach((name) => {
      const link = document.createElement('a');
      link.className = 'district-chip';
      link.textContent = name;
      link.href = buildSubjectRegionUrl(config, province, city, name);
      subregionGrid.appendChild(link);
    });
  }

  const cards = config.cards.map(([heading, text]) => `<div class="tip-card"><h4>${heading}</h4><p>${text}</p></div>`).join('');
  const process = config.process.map(([heading, text]) => `<li><strong>${heading}:</strong> ${text}</li>`).join('');
  content.innerHTML = `
    <p style="margin-top:0;color:var(--muted)">${localLabel} 지역 학생을 위한 1:1 ${config.subject} 과외 상담 안내입니다. 학년, 현재 성적과 취약 영역을 확인한 뒤 학교 진도와 시험 일정에 맞는 학습 계획을 제안합니다.</p>
    <h2 style="margin-top:1.4rem">학년별 ${config.subject} 과외</h2>
    <div class="tip-cards">${cards}</div>
    <h2 style="margin-top:1.6rem">상담 시 확인하는 항목</h2>
    <ul>
      <li>학생 학년, 학교, 최근 성적과 목표 등급</li>
      <li>${config.weakAreas}</li>
      <li>내신, 모의고사, 수능 또는 기초 보완 목표</li>
      <li>방문·화상 수업 방식과 주당 횟수, 예상 비용</li>
    </ul>
    <h2 style="margin-top:1.6rem">${config.subject} 실력 향상 과정</h2>
    <ol>${process}</ol>
    <div class="info-card" style="margin-top:1.4rem;">
      <h3 style="margin-top:0">${localLabel} ${config.subject} 과외 추천·비용 상담</h3>
      <p style="margin-bottom:0;color:var(--muted)">상담은 무료이며 학생에게 필요한 수업 범위와 일정, 방문 또는 화상 가능 여부를 확인한 뒤 적합한 선생님과 예상 과외 비용을 안내합니다.</p>
    </div>`;

  document.getElementById('consultBtn').setAttribute('data-mailto', `mailto:hello@nsystudy.kr?subject=${encodeURIComponent(`${placeText} ${config.subject} 과외 상담 신청`)}`);
});
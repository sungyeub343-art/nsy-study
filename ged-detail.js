function decodeParam(v){ try{ return decodeURIComponent(v); }catch(e){ return v; } }

function buildPageUrl(pageName, query) {
  const path = window.location.pathname;
  const basePath = path.endsWith('/')
    ? path
    : path.includes('.')
      ? path.slice(0, path.lastIndexOf('/') + 1)
      : `${path}/`;
  return `${basePath}${pageName}?${query.toString()}`;
}

function buildGedDetailUrl(province, city, town){
  const params = new URLSearchParams({ province, city });
  if(town) params.set('town', town);
  return buildPageUrl('ged-detail.html', params);
}

function getSubRegions(province, city){
  const root = window.subRegionsData || {};
  const provMap = root[province] || {};
  return provMap[city] || [];
}

function updateSchemaData(placeText) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${placeText} 검정고시 과외`,
    "description": `${placeText}의 검정고시 대비 과외 상담 및 매칭 서비스`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "NSY Study",
      "url": "https://nsystudy.kr/",
      "telephone": "+82-10-2928-3614",
      "areaServed": "KR"
    },
    "areaServed": "KR",
    "availableLanguage": "ko-KR"
  };
  
  let schemaScript = document.getElementById('serviceSchema');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'serviceSchema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(serviceSchema);
}

function updateMetaTags(placeText, subject = '검정고시') {
  const pageTitle = `${placeText} ${subject} 과외 | 시험 대비 맞춤 상담`;
  const pageDescription = `${placeText} 초졸·중졸·고졸 검정고시 대비 1:1 맞춤 과외. 기출문제, 예상문제, 시험일정, 원서접수, 합격 전략까지 방문·화상 수업으로 안내합니다.`;
  const canonicalUrl = `https://nsystudy.kr/ged-detail.html?${new URLSearchParams(new URL(window.location).searchParams).toString()}`;
  const pageKeywords = `${placeText} 검정고시, 초졸 검정고시, 중졸 검정고시, 고졸 검정고시, 검정고시 과외, 검정고시 온라인, 검정고시 화상수업, 검정고시 기출문제, 검정고시 단기합격`;
  
  document.title = pageTitle;
  
  const metaTitle = document.getElementById('metaTitle');
  const metaDesc = document.getElementById('metaDescription');
  const canonical = document.getElementById('canonicalLink');
  const ogTitle = document.getElementById('ogTitle');
  const ogDesc = document.getElementById('ogDescription');
  const ogUrl = document.getElementById('ogUrl');
  const twitterTitle = document.getElementById('twitterTitle');
  const twitterDesc = document.getElementById('twitterDescription');
  let keywordsMeta = document.querySelector('meta[name="keywords"]');

  if(!keywordsMeta){
    keywordsMeta = document.createElement('meta');
    keywordsMeta.setAttribute('name', 'keywords');
    document.head.appendChild(keywordsMeta);
  }
  
  if(metaTitle) metaTitle.textContent = pageTitle;
  if(metaDesc) metaDesc.setAttribute('content', pageDescription);
  if(canonical) canonical.setAttribute('href', canonicalUrl);
  if(ogTitle) ogTitle.setAttribute('content', pageTitle);
  if(ogDesc) ogDesc.setAttribute('content', pageDescription);
  if(ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  if(twitterTitle) twitterTitle.setAttribute('content', pageTitle);
  if(twitterDesc) twitterDesc.setAttribute('content', pageDescription);
  if(keywordsMeta) keywordsMeta.setAttribute('content', pageKeywords);
}

document.addEventListener('DOMContentLoaded', async ()=>{
  const params = new URLSearchParams(location.search);
  const province = decodeParam(params.get('province')||'');
  const city = decodeParam(params.get('city')||'');
  const town = decodeParam(params.get('town')||'');

  const backToGedList = document.getElementById('backToList');
  const titleEl = document.getElementById('regionTitle');
  const metaLine = document.getElementById('metaLine');
  const hero = document.getElementById('heroImg');
  const subregionSection = document.getElementById('subregionSection');
  const subregionTitle = document.getElementById('subregionTitle');
  const subregionHelp = document.getElementById('subregionHelp');
  const subregionGrid = document.getElementById('subregionGrid');
  const content = document.getElementById('articleContent');
  const consult = document.getElementById('consultBtn');

  if(!province || !city){
    titleEl.textContent = '지역 정보를 찾을 수 없습니다.';
    content.innerHTML = '<p style="color:var(--muted)">지역 파라미터가 필요합니다.</p>';
    return;
  }

  const hasTown = !!town;
  const placeText = hasTown ? `${province} ${city} ${town}` : `${province} ${city}`;
  const subRegions = getSubRegions(province, city);
  const isSeongdong = province === '서울특별시' && city === '성동구';

  if(backToGedList){
    if(hasTown){
      backToGedList.href = buildGedDetailUrl(province, city, '');
      backToGedList.textContent = `← ${city} 동읍면 목록으로 돌아가기`;
    } else {
      backToGedList.href = 'ged.html';
      backToGedList.textContent = '← 검정고시 지역 목록으로 돌아가기';
    }
  }

  if(!hasTown && subRegions.length > 0){
    subregionSection.style.display = 'block';
    subregionTitle.textContent = `${city} 동읍면 지역 선택`;
    subregionHelp.textContent = '거주 또는 수업 희망 동읍면을 선택하면 해당 지역 검정고시 상담 페이지로 이동합니다.';
    subregionGrid.innerHTML = '';

    subRegions.forEach((name)=>{
      const a = document.createElement('a');
      a.className = 'district-chip';
      a.textContent = name;
      a.href = buildGedDetailUrl(province, city, name);
      subregionGrid.appendChild(a);
    });
  } else {
    subregionSection.style.display = 'none';
  }

  titleEl.textContent = `${placeText} 검정고시 과외 안내`;
  metaLine.textContent = '검정고시 대비 무료 상담 — 방문/화상 가능';
  hero.src = 'ged-image-11.jpg';
  
  // Update meta tags for SEO
  updateMetaTags(placeText, '검정고시');
  
  // Update schema data for SEO
  updateSchemaData(placeText);

  content.innerHTML = `
    <p style="margin-top:0;color:var(--muted)">${hasTown ? town : city} 지역의 검정고시(중·고졸 학력 인정) 대비 과외 상담 안내입니다. 학습 현황 진단 후 맞춤형 커리큘럼과 시험 대비 전략을 안내합니다.</p>
    ${isSeongdong ? `<p class="region-focus-note"><strong>성동구 맞춤 안내:</strong> 행당동, 응봉동, 금호동, 성수동, 송정동 통학 동선을 고려하여 초졸·중졸·고졸 검정고시 준비 과정을 1:1 과외로 설계해드립니다.</p>` : ''}
    <h3 style="margin-top:1rem">상담 항목</h3>
    <ul>
      <li>목표(중졸/고졸) 및 희망 시험 일정</li>
      <li>필수 과목(국어/수학/영어/사회/과학) 및 수준</li>
      <li>수업 방식(방문/화상), 예상 수업 횟수 및 비용</li>
    </ul>
  `;

  // 준비 팁
  const gedTips = `<h3 style="margin-top:1rem">${hasTown ? town : city} 검정고시 준비 팁</h3>
    <div class="info-card" style="margin-top:0.6rem;">
      <ul style="margin:0;padding-left:1.1rem;color:var(--muted)">
        <li>시험 종류(중졸/고졸)와 응시 자격을 먼저 확인하세요.</li>
        <li>필수 과목 중심으로 기초 개념을 먼저 정리하세요.</li>
        <li>기출문제와 모의고사로 실전 연습을 꾸준히 하세요.</li>
        <li>단기간 대비 시 우선 순위를 정해 집중 학습하세요.</li>
        <li>필요 시 온라인 강의와 병행해 보강하세요.</li>
      </ul>
    </div>`;
  content.innerHTML += gedTips;

  // 과목별 상세 설명
  const subjects = [
    {name: '국어', desc: '문학과 비문학 독해, 문법과 한자 이해. 검정고시 국어는 기초 문법과 글 이해가 핵심입니다.', color: '#f5a623', bg: '#fffdf1'},
    {name: '수학', desc: '기초 연산부터 방정식, 확률 등. 검정고시 수학은 고등학교 범위지만 기초부터 체계적으로 배워야 합니다.', color: '#6a33f6', bg: '#f9f7ff'},
    {name: '영어', desc: '기초 문법과 일상 회화 중심. 기본 어휘와 문장 구조를 명확히 하는 것이 중요합니다.', color: '#2d9b4a', bg: '#f7fcf3'},
    {name: '사회', desc: '한국사, 세계사, 지리 통합. 시대 흐름과 주요 사건을 체계적으로 이해합니다.', color: '#3498db', bg: '#ecf8ff'},
    {name: '과학', desc: '물리, 화학, 생명과학 기초 개념. 일상과 연결된 과학 원리를 배웁니다.', color: '#e74c3c', bg: '#fff5f4'}
  ];
  let subjectHtml = `<h2 style="margin-top:2rem">📖 과목별 수업 안내</h2>`;
  subjects.forEach(s => {
    subjectHtml += `<div style="background:${s.bg};padding:1.2rem;border-radius:10px;margin:1rem 0;border-left:4px solid ${s.color};"><h3 style="color:${s.color};font-weight:700;margin:0 0 0.5rem;">${s.name}</h3><p style="color:#555;margin:0;">${s.desc}</p></div>`;
  });
  content.innerHTML += subjectHtml;

  const keywordGroups = {
    '초졸 검정고시 키워드': [
      '초졸 검정고시', '초등 검정고시', '초등학교 검정고시', '초졸 검정고시 과외', '초졸 검정고시 학원', '초졸 검정고시 인강',
      '초졸 검정고시 온라인', '초졸 검정고시 화상수업', '초졸 검정고시 비대면', '초졸 검정고시 개인과외', '초졸 검정고시 1:1 과외',
      '초졸 검정고시 일대일 과외', '초졸 검정고시 기출문제', '초졸 검정고시 기출', '초졸 검정고시 예상문제', '초졸 검정고시 합격',
      '초졸 검정고시 단기합격', '초졸 검정고시 시험일정', '초졸 검정고시 원서접수', '초졸 검정고시 공부법'
    ],
    '중졸 검정고시 키워드': [
      '중졸 검정고시', '중학교 검정고시', '중등 검정고시', '중졸 검정고시 과외', '중졸 검정고시 학원', '중졸 검정고시 인강',
      '중졸 검정고시 온라인', '중졸 검정고시 화상수업', '중졸 검정고시 비대면', '중졸 검정고시 개인과외', '중졸 검정고시 1:1 과외',
      '중졸 검정고시 일대일 과외', '중졸 검정고시 기출문제', '중졸 검정고시 기출', '중졸 검정고시 예상문제', '중졸 검정고시 합격',
      '중졸 검정고시 단기합격', '중졸 검정고시 시험일정', '중졸 검정고시 원서접수', '중졸 검정고시 공부법'
    ],
    '고졸 검정고시 키워드': [
      '고졸 검정고시', '고등학교 검정고시', '고등 검정고시', '고졸 검정고시 과외', '고졸 검정고시 학원', '고졸 검정고시 인강',
      '고졸 검정고시 온라인', '고졸 검정고시 화상수업', '고졸 검정고시 비대면', '고졸 검정고시 개인과외', '고졸 검정고시 1:1 과외',
      '고졸 검정고시 일대일 과외', '고졸 검정고시 기출문제', '고졸 검정고시 기출', '고졸 검정고시 예상문제', '고졸 검정고시 합격',
      '고졸 검정고시 단기합격', '고졸 검정고시 시험일정', '고졸 검정고시 원서접수', '고졸 검정고시 공부법'
    ],
    '검정고시 입시·학습관리 키워드': [
      '검정고시 수능', '검정고시 대학입시', '검정고시 대입', '검정고시 내신대체', '검정고시', '검정고시 과외', '검정고시 학원',
      '검정고시 온라인', '검정고시 화상수업', '검정고시 비대면', '검정고시 개인과외', '검정고시 1:1 과외', '검정고시 일대일 과외',
      '검정고시 방문과외', '검정고시 방문수업', '검정고시 기출문제', '검정고시 기출', '검정고시 예상문제', '검정고시 합격',
      '검정고시 단기합격', '검정고시 공부법', '검정고시 시험일정', '검정고시 원서접수', '검정고시 난이도', '검정고시 준비',
      '검정고시 교재', '검정고시 커리큘럼', '검정고시 학습관리', '검정고시 학습코칭'
    ]
  };

  let keywordHtml = `<section class="keyword-section"><h2 style="margin-top:2rem">🔎 ${placeText} 검정고시 키워드 안내</h2>`;
  keywordHtml += `<p style="color:var(--muted);margin-top:0.4rem;">초졸·중졸·고졸 검정고시 준비 수준에 맞춰 과목별 지도, 기출문제 분석, 시험일정 관리, 원서접수 안내까지 통합 관리합니다. 아래 키워드 기반으로 맞춤형 커리큘럼을 구성해드립니다.</p>`;
  Object.entries(keywordGroups).forEach(([title, words]) => {
    keywordHtml += `<div class="keyword-group"><h3>${title}</h3><div class="keyword-chip-cloud">`;
    words.forEach((word) => {
      keywordHtml += `<span class="keyword-chip">${word}</span>`;
    });
    keywordHtml += `</div></div>`;
  });
  keywordHtml += `</section>`;
  content.innerHTML += keywordHtml;

  // 교사 정보
  let teacherHtml = `<h2 style="margin-top:2rem">👨‍🏫 우리 선생님들</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;">NSY Study의 교사 선생님들은 다음 기준을 만족합니다:</p>
    <ul style="color:#555;line-height:1.8;">
      <li>✓ 검정고시 출제 경향과 최신 기출문제 숙지</li>
      <li>✓ 성인 학습자에 대한 맞춤 교육법</li>
      <li>✓ 기초부터 단계적으로 가르치는 능력</li>
      <li>✓ 학생별 진도 관리 및 정기 상담</li>
      <li>✓ 시험 일정에 맞춘 학습 전략 수립</li>
    </ul>
    <p style="color:var(--muted);margin-top:1.5rem;"><strong>학습 진행 과정</strong></p>
    <ol style="color:#555;line-height:1.8;">
      <li>학습 목표 및 일정 상담</li>
      <li>수준 진단 테스트</li>
      <li>개인 맞춤 학습 계획 수립</li>
      <li>정기적 진도 점검 및 모의고사</li>
      <li>최종 시험 전 집중 보충</li>
    </ol>`;
  content.innerHTML += teacherHtml;

  // FAQ 섹션
  const faqs = [
    {q: '검정고시는 몇 살부터 응시 가능한가요?', a: '중졸 검정고시: 만 15세 이상, 고졸 검정고시: 만 18세 이상이면 응시 가능합니다.'},
    {q: '검정고시는 몇 과목을 봐야 하나요?', a: '중졸: 국어, 수학, 영어, 사회, 과학 5과목. 고졸: 국어, 수학, 영어, 사회/과학 4과목입니다.'},
    {q: '과외로 충분히 합격할 수 있나요?', a: '네, 충분합니다. 기초부터 체계적으로 배우면 3~6개월 안에 합격할 수 있습니다.'},
    {q: '방문과 화상 중 어느 것이 좋나요?', a: '성인 학습자는 화상이 시간 조정이 유연하고, 방문은 집중도가 높은 경향이 있습니다.'},
    {q: '체험 수업 후 결정해도 되나요?', a: '네, 무료 체험 수업 후 충분히 생각한 후 결정하실 수 있습니다.'},
    {q: '합격까지 평균 비용은 얼마나 되나요?', a: '월 60~120만원 정도, 3~6개월 기준으로 계획하시면 됩니다. 상담 시 정확히 안내합니다.'}
  ];
  let faqHtml = `<h2 style="margin-top:2rem">❓ 자주 묻는 질문 (FAQ)</h2>`;
  faqs.forEach((faq, idx) => {
    faqHtml += `<div style="background:#f5f5f5;padding:1.2rem;border-radius:10px;margin:1rem 0;"><h4 style="color:#1a1a1a;margin:0 0 0.6rem;font-weight:700;">Q${idx+1}. ${faq.q}</h4><p style="color:#555;margin:0;line-height:1.6;">${faq.a}</p></div>`;
  });
  content.innerHTML += faqHtml;

  // 검정고시 일정
  const schedule = [
    {term:'2026 상반기', apply:'2026-03-01 ~ 2026-03-10', exam:'2026-04-10', result:'2026-04-30'},
    {term:'2026 하반기', apply:'2026-08-01 ~ 2026-08-10', exam:'2026-09-12', result:'2026-10-01'}
  ];
  let schedHtml = `<div class="schedule-box"><h3 style="margin-top:2rem">검정고시 일정</h3>`;
  schedHtml += `<table class="schedule-table" style="width:100%;border-collapse:collapse;margin-top:1rem;"><thead><tr style="background:#f0f0f0;"><th style="padding:0.8rem;border:1px solid #ddd;">회차</th><th style="padding:0.8rem;border:1px solid #ddd;">원서 접수</th><th style="padding:0.8rem;border:1px solid #ddd;">시험일</th><th style="padding:0.8rem;border:1px solid #ddd;">합격자 발표</th></tr></thead><tbody>`;
  schedule.forEach(s => {
    schedHtml += `<tr><td style="padding:0.8rem;border:1px solid #ddd;">${s.term}</td><td style="padding:0.8rem;border:1px solid #ddd;">${s.apply}</td><td style="padding:0.8rem;border:1px solid #ddd;">${s.exam}</td><td style="padding:0.8rem;border:1px solid #ddd;">${s.result}</td></tr>`;
  });
  schedHtml += `</tbody></table></div>`;
  content.innerHTML += schedHtml;

  // 다른 서비스 안내 섹션
  let relatedHtml = `<div style="background:#f9f9f9;margin:2rem 0;padding:1.5rem;border-radius:10px;border-top:3px solid #6a33f6;">
    <h3 style="margin-top:0;color:#1a1a1a;">📚 다른 입시 과외도 보세요</h3>
    <p style="color:var(--muted);margin:0.5rem 0 1rem;">검정고시 외 다양한 입시 전형 대비 과외를 안내해드립니다.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;">
      <a href="regions.html" style="padding:1rem;background:white;border:1px solid #ddd;border-radius:8px;text-decoration:none;color:#333;text-align:center;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
        <div style="font-size:1.5rem;margin-bottom:0.5rem;">🎯</div>
        <strong>전국과외</strong>
        <p style="margin:0.5rem 0 0;font-size:0.85rem;color:#666;">수학·영어 중심</p>
      </a>
      <a href="essay.html" style="padding:1rem;background:white;border:1px solid #ddd;border-radius:8px;text-decoration:none;color:#333;text-align:center;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
        <div style="font-size:1.5rem;margin-bottom:0.5rem;">📝</div>
        <strong>논술</strong>
        <p style="margin:0.5rem 0 0;font-size:0.85rem;color:#666;">대학 입시 전형</p>
      </a>
      <a href="international.html" style="padding:1rem;background:white;border:1px solid #ddd;border-radius:8px;text-decoration:none;color:#333;text-align:center;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
        <div style="font-size:1.5rem;margin-bottom:0.5rem;">🌍</div>
        <strong>국제학교</strong>
        <p style="margin:0.5rem 0 0;font-size:0.85rem;color:#666;">IB, AP 준비</p>
      </a>
    </div>
  </div>`;
  content.innerHTML += relatedHtml;

  // Primary action
  const telNumber = '+821029283614';
  consult.href = `tel:${telNumber}`;
  consult.textContent = '전화로 상담하기';
  consult.setAttribute('data-mailto', `mailto:hello@nsystudy.kr?subject=${encodeURIComponent(placeText+' 검정고시 상담 신청')}`);
});

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

function buildRegionUrl(province, city, town){
  const params = new URLSearchParams({ province, city });
  if(town) params.set('town', town);
  return buildPageUrl('region.html', params);
}

// 지역 데이터 포함
const subRegionsData = {
  "서울특별시": {
    "강남구": ["삼성동", "강남동", "논현동", "압구정동", "신사동", "서초동", "방배동", "양재동", "도곡동"],
    "강동구": ["성내동", "암사동", "상일동", "고덕동", "천호동", "성자동"],
    "강북구": ["수유동", "인수동", "미아동", "번동"],
    "강서구": ["화곡동", "등촌동", "마곡동", "발산동", "가양동"],
    "관악구": ["봉천동", "신림동", "인헌동", "조원동"],
    "광진구": ["중곡동", "능동", "자양동", "광장동", "구의동"],
    "구로구": ["구로동", "고척동", "개봉동", "오류동", "궁동"],
    "금천구": ["독산동", "가산동"],
    "노원구": ["상계동", "중계동", "하계동", "월계동", "공릉동", "상수동"],
    "도봉구": ["방학동", "쌍문동", "창동", "도봉동"],
    "동대문구": ["제기동", "용두동", "신설동", "이문동", "전농동", "답십리동", "장안동"],
    "동작구": ["노량진동", "상도동", "사당동", "흑석동"],
    "마포구": ["망원동", "서강동", "합정동", "상수동", "마포동"],
    "서대문구": ["충현동", "현저동", "대현동", "신촌동", "연희동"],
    "서초구": ["서초동", "방배동", "양재동", "우면동"],
    "성동구": ["행당동", "응봉동", "금호동", "성수동", "송정동"],
    "성북구": ["길음동", "석관동", "안암동", "종로5가동", "정릉동"],
    "송파구": ["문정동", "장지동", "삼전동", "가락동", "잠실동", "신천동"],
    "양천구": ["목동", "신정동"],
    "영등포구": ["영등포동", "대방동", "여의도동", "당산동", "도림동"],
    "용산구": ["이태원동", "한남동", "원효로동", "청파동"],
    "은평구": ["불광동", "녹번동", "응암동", "대조동", "수색동"],
    "종로구": ["청계천로", "종로1-6가", "이화동", "명동", "창신동"],
    "중구": ["중림동", "만리동", "황학동", "정동", "을지로동"],
    "중랑구": ["망우동", "상봉동", "신내동", "중화동"]
  },
  "부산광역시": {
    "중구": ["중앙동", "동광동", "대청동", "보수동", "부평동"],
    "서구": ["동대신동", "서대신동", "부용동", "부민동"],
    "동구": ["초량동", "수정동", "좌천동", "범일동"],
    "영도구": ["남항동", "영선동", "신선동", "봉래동"],
    "부산진구": ["부전동", "연지동", "초읍동", "양정동"],
    "동래구": ["명륜동", "온천동", "사직동", "안락동"],
    "남구": ["대연동", "용호동", "용당동", "문현동"],
    "북구": ["구포동", "금곡동", "화명동", "덕천동"],
    "해운대구": ["우동", "중동", "좌동", "송정동"],
    "사하구": ["괴정동", "당리동", "하단동", "신평동"]
  }
};

function getSubRegions(province, city){
  const provMap = subRegionsData[province] || {};
  return provMap[city] || [];
}

function sampleTeachers(province, city){
  const key = province + '|' + city;
  const db = {
    '서울특별시|서초구': [
      {name:'김선생', subject:'수학', price:'주1 30만원', intro:'수능·내신 전문, 5년 경력'},
      {name:'이선생', subject:'영어', price:'주1 28만원', intro:'회화와 문법을 모두 잡는 수업'}
    ],
    '서울특별시|강남구': [
      {name:'박선생', subject:'수학', price:'주2 35만원', intro:'개념 중심의 맞춤형 수업'}
    ]
  };
  return db[key] || [];
}

function formatDate(){
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
}

function updateSchemaData(placeText) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${placeText} 수학·영어 과외`,
    "description": `${placeText}의 수학·영어 과외 상담 및 매칭 서비스`,
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

function updateMetaTags(placeText, hasTown, city) {
  const pageTitle = `${placeText} 수학·영어 과외 | 지역 맞춤 학습 상담`;
  const pageDescription = `${placeText} 초등·중등·고등 과외 상담. 내신, 수능, 수행평가, 자기주도학습까지 1:1 맞춤 커리큘럼으로 방문·화상 수업을 안내해드립니다.`;
  const canonicalUrl = `https://nsystudy.kr/region.html?${new URLSearchParams(new URL(window.location).searchParams).toString()}`;
  const pageKeywords = `${placeText} 과외, 초등 과외, 중등 과외, 고등 과외, 수학 과외, 영어 과외, 국어 과외, 과학 과외, 사회 과외, 방문 과외, 화상 과외, 1:1 과외, 학습관리, 내신, 수능`;
  
  // Update document title
  document.title = pageTitle;
  
  // Update meta tags
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

document.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(location.search);
  const province = decodeParam(params.get('province') || '');
  const city = decodeParam(params.get('city') || '');
  const town = decodeParam(params.get('town') || '');

  const backToList = document.getElementById('backToList');
  const titleEl = document.getElementById('regionTitle');
  const metaLine = document.getElementById('metaLine');
  const heroImg = document.getElementById('heroImg');
  const subregionSection = document.getElementById('subregionSection');
  const subregionTitle = document.getElementById('subregionTitle');
  const subregionHelp = document.getElementById('subregionHelp');
  const subregionGrid = document.getElementById('subregionGrid');
  const contentEl = document.getElementById('articleContent');
  const teachersEl = document.getElementById('teachers');

  if(!province || !city){
    titleEl.textContent = '지역 정보를 찾을 수 없습니다.';
    metaLine.textContent = '';
    contentEl.innerHTML = '<p style="color:var(--muted)">잘못된 접근입니다. 지역 목록으로 돌아가 주세요.</p>';
    heroImg.style.display = 'none';
    return;
  }

  const subRegions = getSubRegions(province, city);
  const hasTown = !!town;
  const placeText = hasTown ? `${province} ${city} ${town}` : `${province} ${city}`;
  const isSeongdong = province === '서울특별시' && city === '성동구';

  if(backToList){
    if(hasTown){
      backToList.href = buildRegionUrl(province, city, '');
      backToList.textContent = `← ${city} 동읍면 목록으로 돌아가기`;
    } else {
      backToList.href = 'regions.html';
      backToList.textContent = '← 지역 목록으로 돌아가기';
    }
  }

  titleEl.textContent = `${placeText} 수학·영어 과외 상담 안내`;
  metaLine.innerHTML = `<span>과외정보팀 편집</span> · <span>${formatDate()}</span>`;
  heroImg.src = 'tutoring-landing-11.jpg';
  
  // Update meta tags for SEO
  updateMetaTags(placeText, hasTown, city);
  
  // Update schema data for SEO
  updateSchemaData(placeText);

  if(!hasTown && subRegions.length > 0){
    subregionSection.style.display = 'block';
    subregionTitle.textContent = `${city} 동읍면 지역 선택`;
    subregionHelp.textContent = '거주 또는 수업 희망 동읍면을 선택하면 해당 지역 상담 페이지로 이동합니다.';
    subregionGrid.innerHTML = '';

    subRegions.forEach((name)=>{
      const a = document.createElement('a');
      a.className = 'district-chip';
      a.textContent = name;
      a.href = buildRegionUrl(province, city, name);
      subregionGrid.appendChild(a);
    });
  } else {
    subregionSection.style.display = 'none';
  }

  // 기본 콘텐츠
  contentEl.innerHTML = `
    <p style="margin-top:0">${hasTown ? `${town} 지역` : `${city} 지역`}의 전과목 과외 상담 안내<br>
    수학·영어 포함(국어, 사회, 역사, 과학 등등) 전과목 과외 상담을 통해 학생 수준에 맞춘 맞춤형 학습 플랜을 안내해드립니다. 상담은 무료이며, 방문·화상 모두 지원합니다.</p>
    ${isSeongdong ? `<p class="region-focus-note"><strong>성동구 맞춤 안내:</strong> 행당동, 응봉동, 금호동, 성수동, 송정동 등 통학 동선을 고려해 초등학생 과외부터 중학생 과외, 고등학생 과외까지 1:1 과외 및 소그룹 과외를 연결해드립니다.</p>` : ''}
    <h2 style="margin-top:1rem">상담 시 안내해드리는 항목</h2>
    <ul>
      <li>학생 정보(학년, 현재 성적, 취약 단원)</li>
      <li>희망 과목 및 수업 방식(방문/화상/혼합)</li>
      <li>목표(내신/수능/보충) 및 기간</li>
      <li>예상 수업 요금(주 1~2회 기준) 및 체험 수업 안내</li>
    </ul>
    <h3 style="margin-top:1rem">상담 방법</h3>
    <p style="color:var(--muted)">아래의 '무료 상담 신청하기' 버튼을 눌러 이메일로 상담 신청서를 보내주세요. 제목에 지역 정보를 자동으로 입력합니다. 원하시면 전화 상담 또는 카카오톡 상담도 연결해드립니다.</p>
  `;

  // 준비 팁
  const tips = [
    {title: '학습 진단 먼저', body: '현재 수준(약점/강점)을 먼저 파악한 뒤 계획을 세우세요.'},
    {title: '우선 과목 선정', body: '수학·영어를 우선으로 하고 필요 시 국어·탐구 병행을 추천합니다.'},
    {title: '기출·모의고사 활용', body: '실전 감각을 위해 기출과 모의고사를 주기적으로 풀어보세요.'},
    {title: '체험 수업 활용', body: '선생님과의 호흡을 확인하기 위해 체험 수업을 활용하세요.'},
    {title: '일정 관리', body: '시험/내신 일정에 맞춰 역량별 우선순위로 학습하세요.'}
  ];

  let tipsHtml = `<h2 style="margin-top:1.2rem">${hasTown ? town : city} 준비 팁</h2>`;
  tipsHtml += `<div class="tip-cards">`;
  tips.forEach(t => {
    tipsHtml += `<div class="tip-card"><h4>${t.title}</h4><p>${t.body}</p></div>`;
  });
  tipsHtml += `</div>`;
  contentEl.innerHTML += tipsHtml;

  // 과목별 상세 설명
  const subjects = [
    {name: '수학', desc: '기초 연산부터 수능·내신 기출까지. 약점을 파악하고 집중 보충하는 맞춤형 수학 수업입니다.', color: '#6a33f6', bg: '#f9f7ff'},
    {name: '영어', desc: '문법, 독해, 듣기, 쓰기를 균형있게 학습합니다. 회화부터 수능영어까지 단계별 수업이 가능합니다.', color: '#2d9b4a', bg: '#f7fcf3'},
    {name: '국어', desc: '문학, 비문학, 문법을 통합적으로 배웁니다. 독해력과 작문능력을 동시에 향상시킵니다.', color: '#f5a623', bg: '#fffdf1'},
    {name: '과학', desc: '물리, 화학, 생명과학의 개념을 명확히 합니다. 실험원리와 문제풀이능력을 키웁니다.', color: '#e74c3c', bg: '#fff5f4'},
    {name: '사회', desc: '세계사, 한국사, 지리, 경제 등 사회전영역을 다룹니다. 시대흐름을 이해하는 종합학습입니다.', color: '#3498db', bg: '#ecf8ff'}
  ];
  let subjectHtml = `<h2 style="margin-top:2rem">📖 과목별 수업 안내</h2>`;
  subjects.forEach(s => {
    subjectHtml += `<div style="background:${s.bg};padding:1.2rem;border-radius:10px;margin:1rem 0;border-left:4px solid ${s.color};"><h3 style="color:${s.color};font-weight:700;margin:0 0 0.5rem;">${s.name}</h3><p style="color:#555;margin:0;">${s.desc}</p></div>`;
  });
  contentEl.innerHTML += subjectHtml;

  // 키워드 기반 과정 안내
  const keywordGroups = {
    '초등 과정 키워드': [
      '초등 과외', '초등학생 과외', '초등 영어과외', '초등 수학과외', '초등 국어과외', '초등 과학과외', '초등 사회과외',
      '초등 논술과외', '초등 독서논술', '초등 코딩과외', '초등 방문과외', '초등 방문수업', '초등 화상과외', '초등 온라인과외',
      '초등 비대면과외', '초등 개인과외', '초등 1:1 과외', '초등 일대일 과외', '초등 소그룹 과외', '초등 학습관리', '초등 학습코칭',
      '초1', '초2', '초3', '초4', '초5', '초6', '예비중1', '자기주도학습', '공부습관'
    ],
    '중등 과정 키워드': [
      '중등 과외', '중학생 과외', '중학교 과외', '중등 영어과외', '중등 수학과외', '중등 국어과외', '중등 과학과외', '중등 사회과외',
      '중등 역사과외', '중등 한국사과외', '중등 방문과외', '중등 방문수업', '중등 화상과외', '중등 온라인과외', '중등 비대면과외',
      '중등 개인과외', '중등 1:1 과외', '중등 일대일 과외', '중등 소그룹 과외', '중등 학습관리', '중등 학습코칭', '중1', '중2', '중3',
      '예비중1', '예비중2', '예비중3', '예비고1', '내신', '중간고사', '기말고사', '수행평가', '서술형', '고입 대비', '특목고 대비', '자사고 대비'
    ],
    '고등 과정 키워드': [
      '고등 과외', '고등학생 과외', '고등학교 과외', '고등 영어과외', '고등 수학과외', '고등 국어과외', '고등 과학과외', '고등 사회과외',
      '물리 과외', '화학 과외', '생명과학 과외', '지구과학 과외', '한국사 과외', '세계사 과외', '정치와법 과외', '경제 과외', '사회문화 과외',
      '생활과윤리 과외', '윤리와사상 과외', '고등 방문과외', '고등 방문수업', '고등 화상과외', '고등 온라인과외', '고등 비대면과외', '고등 개인과외',
      '고등 1:1 과외', '고등 일대일 과외', '고등 소그룹 과외', '고1', '고2', '고3', '예비고1', '예비고2', '예비고3', 'N수생', '재수생', '반수생',
      '수능', '모의고사', '학력평가', '수시', '정시', '학생부관리', '입시'
    ],
    '수업 방식·학습관리 키워드': [
      '여름방학 특강', '겨울방학 특강', '방학 특강', '신학기 대비', '개학 대비', '맞춤형 과외', '개인과외', '1:1 과외', '일대일 과외',
      '방문과외', '방문수업', '온라인과외', '화상과외', '비대면과외', '소그룹 과외', '그룹과외', '자기주도학습', '학습관리', '학습코칭',
      '학습컨설팅', '플래너 관리', '숙제관리', '진도관리', '오답노트', '성적향상', '맞춤 커리큘럼'
    ]
  };

  let keywordHtml = `<section class="keyword-section"><h2 style="margin-top:2rem">🔎 ${placeText} 과정별 키워드 안내</h2>`;
  keywordHtml += `<p style="color:var(--muted);margin-top:0.4rem;">아래 키워드를 기준으로 초등·중등·고등 맞춤형 과외를 구성해 상담해드립니다. 학년, 과목, 수업 방식(방문/화상), 시험 목표(내신/수능/입시)에 맞춰 커리큘럼을 설계합니다.</p>`;
  Object.entries(keywordGroups).forEach(([title, words]) => {
    keywordHtml += `<div class="keyword-group"><h3>${title}</h3><div class="keyword-chip-cloud">`;
    words.forEach((word) => {
      keywordHtml += `<span class="keyword-chip">${word}</span>`;
    });
    keywordHtml += `</div></div>`;
  });
  keywordHtml += `</section>`;
  contentEl.innerHTML += keywordHtml;

  // 교사 정보
  let teacherHtml = `<h2 style="margin-top:2rem">👨‍🏫 우리 선생님들</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;">NSY Study의 교사 선생님들은 다음 기준을 만족합니다:</p>
    <ul style="color:#555;line-height:1.8;">
      <li>✓ 5년 이상 교육경력 또는 현직교사/대학강사</li>
      <li>✓ 학생별 맞춤 학습계획 수립 능력</li>
      <li>✓ 정기 피드백 및 진도 관리 시스템</li>
      <li>✓ 학부모 상담 경험 풍부</li>
      <li>✓ 지역 밀착형 학교 정보 파악</li>
    </ul>
    <p style="color:var(--muted);margin-top:1.5rem;"><strong>선생님 매칭 과정</strong></p>
    <ol style="color:#555;line-height:1.8;">
      <li>학생 정보 및 요구사항 수집</li>
      <li>3~5명 교사 추천</li>
      <li>무료 체험 수업 (1회 60분)</li>
      <li>학생·학부모·교사 3자 합의 후 수업 시작</li>
    </ol>`;
  contentEl.innerHTML += teacherHtml;

  // FAQ 섹션
  const faqs = [
    {q: '과외 비용은 얼마나 되나요?', a: '과목, 학년, 지역에 따라 다릅니다. 일반적으로 주 1회 60분 기준 25~35만원대입니다. 첫 상담에서 정확한 견적을 안내해드립니다.'},
    {q: '방문 과외와 화상 과외 중 어느 것이 좋나요?', a: '방문 과외는 대면 상호작용이 많고, 화상 과외는 스케줄 유연성과 편의성이 좋습니다. 학생 성향에 맞춰 선택하거나 병행할 수 있습니다.'},
    {q: '체험 수업은 정말 무료인가요?', a: '네, 완전히 무료입니다. 1회 60분 정도로 진행되며, 학생이 선생님과 맞는지 확인할 수 있는 기회입니다.'},
    {q: '수업을 못할 경우 보강이 가능한가요?', a: '네, 학원과 달리 시간 조정이 매우 유연합니다. 학생과 교사가 협의하여 보강 일정을 정할 수 있습니다.'},
    {q: '과외를 시작하기 전에 상담을 받을 수 있나요?', a: '네, 무료 상담을 받으실 수 있습니다. 전화, 카카오톡, 이메일 등 다양한 방식으로 가능합니다.'},
    {q: '교사 변경이 가능한가요?', a: '물론입니다. 어떤 이유로든 교사 변경을 요청하실 수 있으며, 새로운 교사로 매칭해드립니다.'}
  ];
  let faqHtml = `<h2 style="margin-top:2rem">❓ 자주 묻는 질문 (FAQ)</h2>`;
  faqs.forEach((faq, idx) => {
    faqHtml += `<div style="background:#f5f5f5;padding:1.2rem;border-radius:10px;margin:1rem 0;"><h4 style="color:#1a1a1a;margin:0 0 0.6rem;font-weight:700;">Q${idx+1}. ${faq.q}</h4><p style="color:#555;margin:0;line-height:1.6;">${faq.a}</p></div>`;
  });
  contentEl.innerHTML += faqHtml;

  // 다른 서비스 안내 섹션
  let relatedHtml = `<h2 style="margin-top:2.5rem;padding-top:1.5rem;border-top:2px solid #eee;">📚 다른 수업도 살펴보세요</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.2rem;margin-top:1.2rem;">
      <a href="ged.html" style="padding:1.5rem;border:1px solid #ddd;border-radius:10px;text-decoration:none;color:#333;background:#f9f7ff;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(106, 51, 246, 0.2)'" onmouseout="this.style.boxShadow='none'">
        <h3 style="margin:0 0 0.5rem;color:#6a33f6;">🎓 검정고시</h3>
        <p style="margin:0;font-size:0.9rem;color:#666;">중·고졸 학력 인정 검정고시 대비 과외</p>
      </a>
      <a href="essay.html" style="padding:1.5rem;border:1px solid #ddd;border-radius:10px;text-decoration:none;color:#333;background:#fffdf1;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(245, 166, 35, 0.2)'" onmouseout="this.style.boxShadow='none'">
        <h3 style="margin:0 0 0.5rem;color:#f5a623;">📝 논술</h3>
        <p style="margin:0;font-size:0.9rem;color:#666;">대학 입시 논술 전형 대비 수업</p>
      </a>
      <a href="international.html" style="padding:1.5rem;border:1px solid #ddd;border-radius:10px;text-decoration:none;color:#333;background:#f0f8ff;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(52, 152, 219, 0.2)'" onmouseout="this.style.boxShadow='none'">
        <h3 style="margin:0 0 0.5rem;color:#3498db;">🌍 국제학교</h3>
        <p style="margin:0;font-size:0.9rem;color:#666;">국제학교 학생을 위한 맞춤 과외</p>
      </a>
    </div>`;
  contentEl.innerHTML += relatedHtml;

  // Configure consultation button
  const consultBtn = document.getElementById('consultBtn');
  const mailSubject = encodeURIComponent(`${placeText} 수학·영어 과외 상담 신청`);
  const telNumber = '+821029283614';
  consultBtn.href = `tel:${telNumber}`;
  consultBtn.textContent = '전화로 상담하기';
  consultBtn.setAttribute('data-mailto', `mailto:hello@nsystudy.kr?subject=${mailSubject}`);

  if(teachersEl) teachersEl.style.display = 'none';
});

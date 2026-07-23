function decodeParam(v){ try{ return decodeURIComponent(v); }catch(e){ return v; } }

function updateSchemaData(schoolName) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${schoolName} 국제학교 과외`,
    "description": `${schoolName} 국제학교 학생들을 위한 영어, 수학, 과학 과외 상담 및 매칭 서비스`,
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

function updateMetaTags(schoolName, city) {
  const pageTitle = `${schoolName} 국제학교 과외 | 커리큘럼 맞춤 상담`;
  const pageDescription = `${schoolName} 국제학교 학생에게 맞는 영어·수학·과학 과외와 IB·AP·국제커리큘럼 대비 1:1 맞춤 수업을 안내합니다.`;
  const canonicalUrl = `https://nsystudy.kr/international-detail.html?${new URLSearchParams(new URL(window.location).searchParams).toString()}`;
  
  document.title = pageTitle;
  
  const metaTitle = document.getElementById('metaTitle');
  const metaDesc = document.getElementById('metaDescription');
  const canonical = document.getElementById('canonicalLink');
  const ogTitle = document.getElementById('ogTitle');
  const ogDesc = document.getElementById('ogDescription');
  const ogUrl = document.getElementById('ogUrl');
  const twitterTitle = document.getElementById('twitterTitle');
  const twitterDesc = document.getElementById('twitterDescription');
  
  if(metaTitle) metaTitle.textContent = pageTitle;
  if(metaDesc) metaDesc.setAttribute('content', pageDescription);
  if(canonical) canonical.setAttribute('href', canonicalUrl);
  if(ogTitle) ogTitle.setAttribute('content', pageTitle);
  if(ogDesc) ogDesc.setAttribute('content', pageDescription);
  if(ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  if(twitterTitle) twitterTitle.setAttribute('content', pageTitle);
  if(twitterDesc) twitterDesc.setAttribute('content', pageDescription);
}

// 학교 데이터 (간단히 유지)
const schoolDb = {
  'korean-foreign-school-seoul': {name:'한국외국인학교 (서울캠퍼스)', city:'서울', province:'서울특별시'},
  'seoul-dwight-school': {name:'서울드와이트외국인학교', city:'서울', province:'서울특별시'},
  'chadwick-jeju': {name:'채드윅 송도국제학교 제주 캠퍼스', city:'제주', province:'제주특별자치도'},
  'nlcs-jeju': {name:'NLCS 제주', city:'제주', province:'제주특별자치도'},
};

document.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(location.search);
  const school = decodeParam(params.get('school')||'');
  const schoolNameParam = decodeParam(params.get('name')||'');

  const titleEl = document.getElementById('regionTitle');
  const metaLine = document.getElementById('metaLine');
  const hero = document.getElementById('heroImg');
  const content = document.getElementById('articleContent');
  const consult = document.getElementById('consultBtn');

  const record = schoolDb[school] || {name: schoolNameParam || school || '국제학교'};

  titleEl.textContent = `${record.name} 과외`;
  metaLine.textContent = '국제학교 입학 및 교육과정 문의';
  hero.src = 'international-image-11.jpg?v=20260718phonefix';
  
  // Update meta tags for SEO
  updateMetaTags(record.name, record.city);
  
  // Update schema data
  updateSchemaData(record.name);

  content.innerHTML = `
    <p style="color:var(--muted)">${record.name} 학생들을 위한 맞춤 과외 서비스입니다.</p>
    <h3 style="margin-top:1rem">국제학교 과외 커리큘럼</h3>
    <p style="color:var(--muted);margin-top:0.3rem;">기초부터 중급까지, 국제학교 수업 방식에 맞춘 단계별 학습 플랜입니다.</p>
    <div style="margin-top:0.8rem;display:grid;gap:0.7rem;">
      <div style="padding:0.9rem 1rem;border:1px solid var(--border);border-radius:10px;background:#f9f7ff;">
        <strong>1단계 · 레벨 진단</strong>
        <ul style="margin:0.45rem 0 0 1.1rem;color:var(--muted);">
          <li>영어 레벨 테스트: Reading, Writing, Speaking, Listening</li>
          <li>수학 개념 테스트</li>
          <li>과목별 약점 분석 및 목표 확인</li>
        </ul>
      </div>
      <div style="padding:0.9rem 1rem;border:1px solid var(--border);border-radius:10px;background:#f7fcf3;">
        <strong>2단계 · 영어 기본 강화</strong>
        <ul style="margin:0.45rem 0 0 1.1rem;color:var(--muted);">
          <li>Reading Comprehension 지문 이해</li>
          <li>Vocabulary 어휘 학습</li>
          <li>Grammar와 Writing 기초</li>
        </ul>
      </div>
      <div style="padding:0.9rem 1rem;border:1px solid var(--border);border-radius:10px;background:#fffdf1;">
        <strong>3단계 · 국제학교 수업 방식 적응</strong>
        <ul style="margin:0.45rem 0 0 1.1rem;color:var(--muted);">
          <li>Note-taking과 Essay Writing 구조</li>
          <li>Presentation과 Critical Thinking</li>
          <li>Group Discussion 훈련</li>
        </ul>
      </div>
      <div style="padding:0.9rem 1rem;border:1px solid var(--border);border-radius:10px;background:#fff5f4;">
        <strong>4단계 · 과목별 심화 학습</strong>
        <ul style="margin:0.45rem 0 0 1.1rem;color:var(--muted);">
          <li>수학: Algebra, Geometry, Calculus 중급 이상</li>
          <li>과학: Physics, Chemistry, Biology 개념 이해</li>
          <li>AP/IB 수업 준비</li>
        </ul>
      </div>
    </div>
  `;

  // 과목별 설명
  const subjects = [
    {name: 'English', desc: 'Reading, Writing, Speaking 능력을 종합적으로 개발합니다. 국제학교 수업을 따라가는 데 필수입니다.', color: '#2d9b4a', bg: '#f7fcf3'},
    {name: 'Mathematics', desc: 'Algebra, Geometry, Precalculus 등 국제커리큘럼 수학을 체계적으로 배웁니다.', color: '#6a33f6', bg: '#f9f7ff'},
    {name: 'Science', desc: 'Physics, Chemistry, Biology를 영어로 학습합니다. 개념 이해가 핵심입니다.', color: '#e74c3c', bg: '#fff5f4'},
    {name: 'Humanities', desc: '역사, 지리, 사회 교과를 비판적 사고와 함께 학습합니다.', color: '#f5a623', bg: '#fffdf1'},
    {name: 'AP/IB Prep', desc: 'Advanced Placement 또는 International Baccalaureate 시험 대비 수업입니다.', color: '#3498db', bg: '#ecf8ff'}
  ];
  let subjectHtml = `<h2 style="margin-top:2rem">📖 과목별 수업 안내</h2>`;
  subjects.forEach(s => {
    subjectHtml += `<div style="background:${s.bg};padding:1.2rem;border-radius:10px;margin:1rem 0;border-left:4px solid ${s.color};"><h3 style="color:${s.color};font-weight:700;margin:0 0 0.5rem;">${s.name}</h3><p style="color:#555;margin:0;">${s.desc}</p></div>`;
  });
  content.innerHTML += subjectHtml;

  // 교사 정보
  let teacherHtml = `<h2 style="margin-top:2rem">👨‍🏫 우리 선생님들</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;">NSY Study의 국제학교 전문 교사 기준:</p>
    <ul style="color:#555;line-height:1.8;">
      <li>✓ 국제학교 또는 해외 교육 경험 보유</li>
      <li>✓ 영어 모국어 수준 또는 완전 능숙</li>
      <li>✓ 국제 커리큘럼(IB, AP, Cambridge) 숙지</li>
      <li>✓ 학생별 맞춤 학습 계획 수립</li>
      <li>✓ 정기 진도 점검 및 학부모 상담</li>
    </ul>
    <p style="color:var(--muted);margin-top:1.5rem;"><strong>국제학교 맞춤 과외 프로세스</strong></p>
    <ol style="color:#555;line-height:1.8;">
      <li>학생 입학 시험 준비 또는 현 수준 진단</li>
      <li>과목별 선생님 추천</li>
      <li>무료 체험 수업 (1회 60-90분)</li>
      <li>학생·부모·선생님 상담 후 시작</li>
      <li>정기 평가 및 진도 관리</li>
    </ol>`;
  content.innerHTML += teacherHtml;

  // FAQ
  const faqs = [
    {q: '국제학교 입시에 과외가 필수인가요?', a: '필수는 아니지만, 입학 시험 준비 시 전문 과외가 매우 도움됩니다. 특히 영어와 수학은 강화하는 것이 좋습니다.'},
    {q: '영어 모국어 선생님이 필요한가요?', a: '영어 유창한 선생님과 한국인 선생님 모두 장점이 있습니다. 학생의 목표와 수준에 따라 선택하실 수 있습니다.'},
    {q: 'AP/IB 대비는 가능한가요?', a: '네, 가능합니다. AP/IB 경험이 있는 선생님들이 준비를 도와드립니다.'},
    {q: '온라인과 오프라인 중 어디가 낫나요?', a: '효율성은 온라인이 높고, 집중도는 오프라인이 높습니다. 학생 성향에 따라 선택하세요.'},
    {q: '국제학교 적응 기간은 얼마나 되나요?', a: '개인차가 있지만, 1-3개월이면 학교 수업을 따라가는 데 무리가 없습니다.'},
    {q: '비용은 어느 정도인가요?', a: '월 80-150만원 정도입니다. 과목, 선생님 경력, 수업 시간에 따라 다릅니다.'}
  ];
  let faqHtml = `<h2 style="margin-top:2rem">❓ 자주 묻는 질문 (FAQ)</h2>`;
  faqs.forEach((faq, idx) => {
    faqHtml += `<div style="background:#f5f5f5;padding:1.2rem;border-radius:10px;margin:1rem 0;"><h4 style="color:#1a1a1a;margin:0 0 0.6rem;font-weight:700;">Q${idx+1}. ${faq.q}</h4><p style="color:#555;margin:0;line-height:1.6;">${faq.a}</p></div>`;
  });
  content.innerHTML += faqHtml;

  // 다른 서비스 안내 섹션
  let relatedHtml = `<div style="background:#f0f8ff;margin:2rem 0;padding:1.5rem;border-radius:10px;border-left:4px solid #3498db;">
    <h3 style="margin-top:0;color:#1a1a1a;">📚 다른 과외 서비스도 확인하세요</h3>
    <p style="color:#666;margin:0.5rem 0 1rem;">자녀의 목표에 맞는 다양한 과외 프로그램을 안내합니다.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;">
      <a href="regions.html" style="padding:1.2rem;background:white;border:1px solid #3498db;border-radius:8px;text-decoration:none;color:#333;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(52, 152, 219, 0.2)'" onmouseout="this.style.boxShadow='none'">
        <h4 style="margin:0 0 0.5rem;color:#3498db;font-weight:700;">📖 전국과외</h4>
        <p style="margin:0;font-size:0.9rem;color:#666;">수학·영어 기초부터 심화까지</p>
      </a>
      <a href="ged.html" style="padding:1.2rem;background:white;border:1px solid #6a33f6;border-radius:8px;text-decoration:none;color:#333;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(106, 51, 246, 0.2)'" onmouseout="this.style.boxShadow='none'">
        <h4 style="margin:0 0 0.5rem;color:#6a33f6;font-weight:700;">🎓 검정고시</h4>
        <p style="margin:0;font-size:0.9rem;color:#666;">중·고졸 학력 인정 시험</p>
      </a>
      <a href="essay.html" style="padding:1.2rem;background:white;border:1px solid #f5a623;border-radius:8px;text-decoration:none;color:#333;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(245, 166, 35, 0.2)'" onmouseout="this.style.boxShadow='none'">
        <h4 style="margin:0 0 0.5rem;color:#f5a623;font-weight:700;">📝 논술</h4>
        <p style="margin:0;font-size:0.9rem;color:#666;">대학 입시 논술 전형</p>
      </a>
    </div>
  </div>`;
  content.innerHTML += relatedHtml;

  // Consult button
  const telNumber = '+821029283614';
  consult.href = `tel:${telNumber}`;
  consult.textContent = '전화로 상담하기';
  consult.setAttribute('data-mailto', `mailto:hello@nsystudy.kr?subject=${encodeURIComponent(record.name + ' 과외 상담 신청')}`);
});

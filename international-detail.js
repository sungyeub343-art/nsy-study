function decodeParam(v){ try{ return decodeURIComponent(v); }catch(e){ return v; } }

// Sample school directory with curriculum keywords included for richer detail pages.
const schoolDb = {
  'korean-foreign-school-seoul': {name:'한국외국인학교 (서울캠퍼스)', city:'서울', province:'서울특별시', desc:'서울에 위치한 대표적인 외국인학교로, 국제 커리큘럼과 다국적 학습 환경을 제공합니다.', keywords:['International Curriculum','English Immersion','IB Curriculum','Global Education','Critical Thinking','Project-Based Learning (PBL)']},
  'korean-kent-school': {name:'한국켄트외국인학교', city:'서울', province:'서울특별시', desc:'영어권 교육과 국제적 교육 철학을 바탕으로 한 학교입니다.', keywords:['English Language Arts','Mathematics','Science','IB MYP','AP Courses','Debate','Public Speaking']},
  'seoul-foreign-school': {name:'서울외국인학교', city:'서울', province:'서울특별시', desc:'전통 있는 외국인학교로 국제적 학습 경험과 다양한 선택과목이 특징입니다.', keywords:['English Literature','History','Global Studies','IB DP','CAS','Visual Arts','Computer Science']},
  'seoul-dwight-school': {name:'서울드와이트외국인학교', city:'서울', province:'서울특별시', desc:'다양한 국제 교육과정과 학생 중심 학습 방식을 강조합니다.', keywords:['IB Diploma Programme','Theory of Knowledge','Extended Essay','Mathematics','Biology','Chemistry']},
  'korea-foreign-school': {name:'코리아외국인학교', city:'서울', province:'서울특별시', desc:'기초 학문과 국제 커리큘럼을 함께 다루는 학교입니다.', keywords:['English Language Arts','Algebra','Geometry','Physics','Economics','Art & Design']},
  'asia-pacific-international-school': {name:'아시아퍼시픽국제외국인학교', city:'서울', province:'서울특별시', desc:'아시아권 국제 교육 환경에 적합한 창의적·실용적 학습을 지향합니다.', keywords:['Project-Based Learning (PBL)','Robotics','Coding / Programming','Design Technology','Media Studies']},
  'global-christian-school': {name:'지구촌기독외국인학교', city:'서울', province:'서울특별시', desc:'국제적 교육 철학과 기독교적 교육 가치를 함께 추구합니다.', keywords:['Humanities','Social Studies','English Immersion','Global Education','Music','Drama / Theater']},
  'seoul-yongsan-international-school': {name:'서울용산국제학교', city:'서울', province:'서울특별시', desc:'다양한 국제학교형 교육법과 멀티문화 학습 환경이 장점입니다.', keywords:['IB PYP','IB MYP','Science','Environmental Science','Physical Education','World History']},
  'dulwich-college-seoul': {name:'덜위치칼리지서울영국학교', city:'서울', province:'서울특별시', desc:'영국식 교육과정을 기반으로 한 국제학교입니다.', keywords:['A-Level Courses','Cambridge Curriculum','Mathematics','English Literature','Geography','Business Studies']},
  'lycee-francais-de-seoul': {name:'서울프랑스학교 (Lycée Français de Séoul)', city:'서울', province:'서울특별시', desc:'프랑스식 교육과정을 중심으로 디테일한 학업 관리가 가능한 학교입니다.', keywords:['French Curriculum','Humanities','Science','Visual Arts','Public Speaking','Global Studies']},
  'seoul-japanese-school': {name:'서울일본인학교', city:'서울', province:'서울특별시', desc:'일본식 교육과정과 국제적 협력 프로그램을 운영합니다.', keywords:['Mathematics','Science','English Immersion','Japanese Language','Social Studies','Music']},
  'seoul-german-school': {name:'서울독일학교', city:'서울', province:'서울특별시', desc:'독일식 교육과정과 국제적 학습 기반이 특징입니다.', keywords:['Science','Mathematics','German Language','English Language Arts','Physics','Chemistry']},
  'xavier-international-school': {name:'하비에르 국제학교', city:'서울', province:'서울특별시', desc:'다양한 국제 교육과정과 학생 맞춤형 학습을 지원합니다.', keywords:['IB Curriculum','AP Program','English Language Arts','Pre-Calculus','Statistics','Drama / Theater']},
  'cheongna-dalton-school': {name:'청라달튼외국인학교', city:'인천', province:'인천광역시', desc:'청라에 위치해 있으며, 미국식 교육 스타일과 학생 중심 교육이 강점입니다.', keywords:['AP Biology','AP Chemistry','Math','English','Music','Physical Education']},
  'gyeonggi-suwon-foreign-school': {name:'경기수원외국인학교', city:'수원', province:'경기도', desc:'수원 지역의 국제 학습 환경을 제공하는 외국인학교입니다.', keywords:['English Immersion','Global Studies','Science','Mathematics','Debate','Project-Based Learning (PBL)']},
  'korean-foreign-school-pangyo': {name:'한국외국인학교 (판교캠퍼스)', city:'판교', province:'경기도', desc:'판교 지역의 국제학교 수요에 맞춘 교육적 접근이 가능합니다.', keywords:['IB MYP','English Language Arts','Social Studies','Computer Science','Coding / Programming']},
  'pyeongtaek-christian-school': {name:'평택크리스천외국인학교', city:'평택', province:'경기도', desc:'기독교적 교육 철학과 국제적 학습 환경을 동시에 제공하는 학교입니다.', keywords:['Humanities','Science','English','Music','Drama / Theater','Physical Education']},
  'incheon-hwa-gyo-school': {name:'인천화교학교', city:'인천', province:'인천광역시', desc:'다문화 학습과 국제적 소통 역량을 키우는 학교입니다.', keywords:['Chinese Language','Mathematics','English','Science','Social Studies','Art & Design']},
  'busan-foreign-school': {name:'부산외국인학교', city:'부산', province:'부산광역시', desc:'부산에 위치한 외국인학교로 국제적 커리큘럼을 제공합니다.', keywords:['English Immersion','Global Education','Biology','Physics','Economics','Visual Arts']},
  'busan-international-foreign-school': {name:'부산국제외국인학교', city:'부산', province:'부산광역시', desc:'국제 커리큘럼과 다양한 글로벌 활동이 특징입니다.', keywords:['IB Curriculum','AP Program','Mathematics','English Literature','Environmental Science','Media Studies']},
  'gyeongnam-international-school': {name:'경남국제외국인학교', city:'경남', province:'부산광역시', desc:'경남 지역의 국제학교 수요에 맞춘 교육 환경을 제공합니다.', keywords:['International Curriculum','English Language Arts','Science','Social Studies','Robotics','Coding / Programming']},
  'geoje-international-school': {name:'거제국제외국인학교', city:'거제', province:'부산광역시', desc:'거제 지역의 국제학교형 교육을 지원하는 학교입니다.', keywords:['English Immersion','Mathematics','Physics','Chemistry','Global Studies','Health Education']},
  'daejeon-foreign-school': {name:'대전외국인학교', city:'대전', province:'대전광역시', desc:'대전 지역의 국제교육 니즈를 고려한 외국인학교입니다.', keywords:['IB Curriculum','English','Science','Social Studies','Music','Physical Education']},
  'ulsan-hyundai-foreign-school': {name:'울산현대외국인학교', city:'울산', province:'울산광역시', desc:'울산의 산업 도시 특성에 맞는 실용적 교육이 가능한 학교입니다.', keywords:['Engineering','Mathematics','Science','Global Studies','Computer Science','Design Technology']},
  'gwangju-international-school': {name:'광주국제외국인학교', city:'광주', province:'광주광역시', desc:'광주 지역에서 국제적인 교육과정을 찾는 학부모에게 적합합니다.', keywords:['English Immersion','Mathematics','Science','Humanities','Visual Arts','Debate']},
  'daegu-hwa-gyo-high-school': {name:'한국대구화교중고등학교', city:'대구', province:'대구광역시', desc:'대구 지역의 화교학교로, 국제적 교육성과 전통 교육을 함께 이어갑니다.', keywords:['English Language Arts','Mathematics','Science','Humanities','Social Studies','Computer Science']},
  'daegu-hwa-gyo-elementary-school': {name:'한국대구화교초등학교', city:'대구', province:'대구광역시', desc:'초등 과정에서 국제적 사고력과 언어 능력을 키우는 교육 환경입니다.', keywords:['English Immersion','Project-Based Learning (PBL)','Science','Mathematics','Art & Design']},
  'chadwick-jeju': {name:'채드윅 송도국제학교 제주 캠퍼스', city:'제주', province:'제주특별자치도', desc:'제주에 위치한 대표적인 국제학교로, IB/해외 커리큘럼과 첨단 교육 환경이 강점입니다.', keywords:['IB Diploma Programme','IB MYP','AP Courses','Biology','Chemistry','Physics','Theater','Visual Arts']},
  'nlcs-jeju': {name:'NLCS 제주 (North London Collegiate School Jeju)', city:'제주', province:'제주특별자치도', desc:'영국식 교육과정과 높은 학업 수준을 지향하는 국제학교입니다.', keywords:['A-Level Courses','English Literature','History','Mathematics','Science','Debate']},
  'branksome-hall-asia': {name:'브랭섬홀 아시아', city:'제주', province:'제주특별자치도', desc:'제주에서 국제적 교육 경험과 글로벌 커뮤니티를 누릴 수 있는 학교입니다.', keywords:['IB Curriculum','English Immersion','Global Education','Critical Thinking','Creative Writing','Design Technology']},
  'saint-johns-british-academy-jeju': {name:'세인트존스베리아카데미 제주', city:'제주', province:'제주특별자치도', desc:'영국식 교육 체계와 글로벌 교육 환경을 제공하는 학교입니다.', keywords:['Cambridge Curriculum','English Language Arts','Mathematics','Science','Geography','Drama / Theater']},
  'kis-jeju': {name:'KIS 제주 (Korea International School Jeju)', city:'제주', province:'제주특별자치도', desc:'다국적 학생과 교직원, 다양한 국제 교육과정이 어우러진 학교입니다.', keywords:['IB Curriculum','AP Program','English Immersion','Global Studies','Business Studies','Robotics']},
  'jeju-international-school': {name:'제주국제학교', city:'제주', province:'제주특별자치도', desc:'제주 지역의 국제학교 수요를 반영한 교육 프로그램을 운영합니다.', keywords:['International Curriculum','English Immersion','Science','Mathematics','Art & Design','Physical Education']}
};

document.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(location.search);
  const province = decodeParam(params.get('province')||'');
  const city = decodeParam(params.get('city')||'');
  const school = decodeParam(params.get('school')||'');
  const schoolNameParam = decodeParam(params.get('name')||'');

  const titleEl = document.getElementById('schoolTitle');
  const metaLine = document.getElementById('metaLine');
  const hero = document.getElementById('schoolHero');
  const content = document.getElementById('schoolContent');
  const consult = document.getElementById('schoolConsult');

  const record = schoolDb[school] || {name: schoolNameParam || school || `${city} 국제학교`, desc:'학교 정보가 준비 중입니다.', keywords:['International Curriculum','English Immersion']};

  const keywords = record.keywords || [];
  const hasEnglish = keywords.some(k => /English|ELA|Literature/i.test(k));
  const hasMath = keywords.some(k => /(Mathematics|Algebra|Geometry|Calculus|Statistics)/i.test(k));
  const hasIB = keywords.some(k => /IB/i.test(k));
  const hasAP = keywords.some(k => /AP/i.test(k));
  const hasAlgebra = keywords.some(k => /Algebra/i.test(k));
  const hasGeometry = keywords.some(k => /Geometry/i.test(k));
  const titleSuffix = '수학·영어과외 알지브라 지오메트리 IB AP';
  titleEl.textContent = `${record.name} ${titleSuffix}`.trim();
  metaLine.textContent = '국제학교 입학 및 교육과정 문의';
  hero.src = 'international-image-11.jpg?v=20260718phonefix';

  const keywordHtml = (record.keywords || []).map(k => `<span class="subject-badge" style="margin:0.2rem;display:inline-block">${k}</span>`).join('');
  content.innerHTML = `
    <p style="color:var(--muted)">${record.desc}</p>
    <h3 style="margin-top:1rem">대표 과목/프로그램 키워드</h3>
    <div style="margin-top:0.6rem;display:flex;flex-wrap:wrap;gap:0.45rem;">${keywordHtml}</div>

    <h3 style="margin-top:1.4rem">국제학교 과외 커리큘럼</h3>
    <p style="color:var(--muted);margin-top:0.3rem;">기초부터 중급까지, 국제학교 수업 방식에 맞춘 단계별 학습 플랜입니다.</p>
    <div style="margin-top:0.8rem;display:grid;gap:0.7rem;">
      <div style="padding:0.9rem 1rem;border:1px solid var(--border);border-radius:10px;background:#f9f7ff;">
        <strong>1단계 · 레벨 진단 (1주)</strong>
        <ul style="margin:0.45rem 0 0 1.1rem;color:var(--muted);">
          <li>영어 레벨 테스트: Reading / Writing / Speaking / Listening</li>
          <li>수학 개념 테스트: 기초 연산부터 응용까지</li>
          <li>과목별 약점 분석 및 IB / AP 목표 확인</li>
        </ul>
      </div>
      <div style="padding:0.9rem 1rem;border:1px solid var(--border);border-radius:10px;background:#f7fcf3;">
        <strong>2단계 · 영어 기본 강화 (2~4주)</strong>
        <ul style="margin:0.45rem 0 0 1.1rem;color:var(--muted);">
          <li>Reading Comprehension 지문 이해</li>
          <li>Vocabulary 필수 어휘 500~1000개</li>
          <li>Grammar / Writing Basic / Speaking Q&A</li>
        </ul>
      </div>
      <div style="padding:0.9rem 1rem;border:1px solid var(--border);border-radius:10px;background:#fffdf1;">
        <strong>3단계 · 국제학교 학습 방식 적응 (4~8주)</strong>
        <ul style="margin:0.45rem 0 0 1.1rem;color:var(--muted);">
          <li>Note-taking / Essay Writing 구조</li>
          <li>Presentation / Critical Thinking</li>
          <li>Group Discussion 토론 훈련</li>
        </ul>
      </div>
      <div style="padding:0.9rem 1rem;border:1px solid var(--border);border-radius:10px;background:#fff5f4;">
        <strong>4단계 · 과목별 심화 학습 (8~12주)</strong>
        <ul style="margin:0.45rem 0 0 1.1rem;color:var(--muted);">
          <li>Math: Algebra / Geometry / Statistics / Word Problem</li>
          <li>Science: Biology / Chemistry / Physics / Lab Report</li>
          <li>Social Studies: World History / Geography / Essay 답안</li>
        </ul>
      </div>
      <div style="padding:0.9rem 1rem;border:1px solid var(--border);border-radius:10px;background:#f8f2ff;">
        <strong>5단계 · 시험 & 평가 대비</strong>
        <ul style="margin:0.45rem 0 0 1.1rem;color:var(--muted);">
          <li>Quiz / Test 대비 문제풀이</li>
          <li>IB / AP Mock Test 및 Essay 첨삭</li>
          <li>Oral Exam / Speaking Test 준비</li>
        </ul>
      </div>
      <div style="padding:0.9rem 1rem;border:1px solid var(--border);border-radius:10px;background:#fff8eb;">
        <strong>6단계 · 고급 과정 (선택)</strong>
        <ul style="margin:0.45rem 0 0 1.1rem;color:var(--muted);">
          <li>IB Extended Essay / TOK 기초</li>
          <li>AP Subject 집중 대비</li>
          <li>대학 진학용 에세이 작성 지원</li>
        </ul>
      </div>
    </div>

    <h3 style="margin-top:1.4rem">학교 선택 팁</h3>
    <ul style="color:var(--muted)">
      <li>학교의 교육과정(IB/American/British 등)을 확인하세요.</li>
      <li>학비/기숙사 여부, 통학 편의성을 확인하세요.</li>
      <li>입학 절차 및 시험/면접 일정을 확인하세요.</li>
    </ul>
  `;

  const telNumber = '+821029283614';
  consult.href = `tel:${telNumber}`;
  consult.textContent = '전화로 문의하기';
  consult.setAttribute('data-mailto', `mailto:hello@nsystudy.kr?subject=${encodeURIComponent(record.name+' 문의')}`);
});

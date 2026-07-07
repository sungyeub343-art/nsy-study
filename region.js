function decodeParam(v){ try{ return decodeURIComponent(v); }catch(e){ return v; } }

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

document.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(location.search);
  const province = decodeParam(params.get('province') || '');
  const city = decodeParam(params.get('city') || '');

  const titleEl = document.getElementById('regionTitle');
  const metaLine = document.getElementById('metaLine');
  const heroImg = document.getElementById('heroImg');
  const contentEl = document.getElementById('articleContent');
  const teachersEl = document.getElementById('teachers');

  if(!province || !city){
    titleEl.textContent = '지역 정보를 찾을 수 없습니다.';
    metaLine.textContent = '';
    contentEl.innerHTML = '<p style="color:var(--muted)">잘못된 접근입니다. 지역 목록으로 돌아가 주세요.</p>';
    heroImg.style.display = 'none';
    return;
  }

  titleEl.textContent = `${province} ${city} 수학·영어 과외 상담 안내`;
  metaLine.innerHTML = `<span>과외정보팀 편집</span> · <span>${formatDate()}</span>`;
  heroImg.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder';

  // Article body: consultation-focused template
  contentEl.innerHTML = `
    <p style="margin-top:0">${city} 지역의 전과목 과외 상담 안내<br>
    수학·영어 포함(국어, 사회, 역사, 과학 등등) 전과목 과외 상담을 통해 학생 수준에 맞춘 맞춤형 학습 플랜을 안내해드립니다. 상담은 무료이며, 방문·화상 모두 지원합니다.</p>
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

  // 준비 팁 섹션 (카드형)
  const tips = [
    {title: '학습 진단 먼저', body: '현재 수준(약점/강점)을 먼저 파악한 뒤 계획을 세우세요.'},
    {title: '우선 과목 선정', body: '수학·영어를 우선으로 하고 필요 시 국어·탐구 병행을 추천합니다.'},
    {title: '기출·모의고사 활용', body: '실전 감각을 위해 기출과 모의고사를 주기적으로 풀어보세요.'},
    {title: '체험 수업 활용', body: '선생님과의 호흡을 확인하기 위해 체험 수업을 활용하세요.'},
    {title: '일정 관리', body: '시험/내신 일정에 맞춰 역량별 우선순위로 학습하세요.'}
  ];

  let tipsHtml = `<h2 style="margin-top:1.2rem">${city} 준비 팁</h2>`;
  tipsHtml += `<div class="tip-cards">`;
  tips.forEach(t => {
    tipsHtml += `<div class="tip-card"><h4>${t.title}</h4><p>${t.body}</p></div>`;
  });
  tipsHtml += `</div>`;
  contentEl.innerHTML += tipsHtml;

  // Configure consultation button
  const consultBtn = document.getElementById('consultBtn');
  const mailSubject = encodeURIComponent(`${province} ${city} 수학·영어 과외 상담 신청`);
  // Primary action: 전화 연결. Fallback: mailto included in data- attributes
  const telNumber = '+821029283614';
  consultBtn.href = `tel:${telNumber}`;
  consultBtn.textContent = '전화로 상담하기';
  consultBtn.setAttribute('data-mailto', `mailto:hello@nsystudy.kr?subject=${mailSubject}`);

  // hide teachersEl if present (we no longer show teacher list)
  if(teachersEl) teachersEl.style.display = 'none';
});

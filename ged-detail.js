function decodeParam(v){ try{ return decodeURIComponent(v); }catch(e){ return v; } }

document.addEventListener('DOMContentLoaded', async ()=>{
  const params = new URLSearchParams(location.search);
  const province = decodeParam(params.get('province')||'');
  const city = decodeParam(params.get('city')||'');

  const titleEl = document.getElementById('gedTitle');
  const metaLine = document.getElementById('metaLine');
  const hero = document.getElementById('gedHero');
  const content = document.getElementById('gedContent');
  const consult = document.getElementById('gedConsult');

  if(!province || !city){
    titleEl.textContent = '지역 정보를 찾을 수 없습니다.';
    content.innerHTML = '<p style="color:var(--muted)">지역 파라미터가 필요합니다.</p>';
    return;
  }

  titleEl.textContent = `${province} ${city} 검정고시 과외 안내`;
  metaLine.textContent = '검정고시 대비 무료 상담 — 방문/화상 가능';
  hero.src = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder';

  content.innerHTML = `
    <p style="margin-top:0;color:var(--muted)">${city} 지역의 검정고시(중·고졸 학력 인정) 대비 과외 상담 안내입니다. 학습 현황 진단 후 맞춤형 커리큘럼과 시험 대비 전략을 안내합니다.</p>
    <h3 style="margin-top:1rem">상담 항목</h3>
    <ul>
      <li>목표(중졸/고졸) 및 희망 시험 일정</li>
      <li>필수 과목(국어/수학/영어/사회/과학) 및 수준</li>
      <li>수업 방식(방문/화상), 예상 수업 횟수 및 비용</li>
    </ul>
  `;

  // 준비 팁 섹션 for GED
  const gedTips = `
    <h3 style="margin-top:1rem">${city} 검정고시 준비 팁</h3>
    <div class="info-card" style="margin-top:0.6rem;">
      <ul style="margin:0;padding-left:1.1rem;color:var(--muted)">
        <li>시험 종류(중졸/고졸)와 응시 자격을 먼저 확인하세요.</li>
        <li>필수 과목 중심으로 기초 개념을 먼저 정리하세요.</li>
        <li>기출문제와 모의고사로 실전 연습을 꾸준히 하세요.</li>
        <li>단기간 대비 시 우선 순위를 정해 집중 학습하세요.</li>
        <li>필요 시 온라인 강의와 병행해 보강하세요.</li>
      </ul>
    </div>
  `;
  content.innerHTML += gedTips;

  // 검정고시 일정(예시 데이터) - 실제 일정으로 교체해주세요
  const schedule = [
    {term:'2026 상반기', apply:'2026-03-01 ~ 2026-03-10', exam:'2026-04-10', result:'2026-04-30'},
    {term:'2026 하반기', apply:'2026-08-01 ~ 2026-08-10', exam:'2026-09-12', result:'2026-10-01'}
  ];

  let schedHtml = `<div class="schedule-box"><h3 style="margin-top:1rem">검정고시 일정</h3>`;
  schedHtml += `<table class="schedule-table"><thead><tr><th>회차</th><th>원서 접수</th><th>시험일</th><th>합격자 발표</th></tr></thead><tbody>`;
  schedule.forEach(s => {
    schedHtml += `<tr><td>${s.term}</td><td>${s.apply}</td><td>${s.exam}</td><td>${s.result}</td></tr>`;
  });
  schedHtml += `</tbody></table></div>`;
  content.innerHTML += schedHtml;

  // Primary action: 전화 연결
  const telNumber = '+821029283614';
  consult.href = `tel:${telNumber}`;
  consult.textContent = '전화로 상담하기';
  consult.setAttribute('data-mailto', `mailto:hello@nsystudy.kr?subject=${encodeURIComponent(province+' '+city+' 검정고시 상담 신청')}`);
});

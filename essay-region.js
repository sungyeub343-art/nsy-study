function loadEssayRegion() {
  const params = new URLSearchParams(window.location.search);
  const province = params.get('province') || '지역';
  const city = params.get('city') || '';

  const titleEl = document.getElementById('essayTitle');
  const metaEl = document.getElementById('essayMeta');
  const contentEl = document.getElementById('essayContent');
  const heroEl = document.getElementById('essayHero');

  // 제목 설정
  titleEl.textContent = `${city} 수리·인문논술 과외 무료 수업 안내`;
  document.title = titleEl.textContent;

  // 메타 정보
  metaEl.textContent = `${province} ${city} 지역의 맞춤형 논술 과외 과정입니다.`;

  // 대표 이미지
  if (heroEl) {
    heroEl.src = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop';
  }

  // 본문 콘텐츠
  contentEl.innerHTML = `
    <section style="margin-bottom:2rem;">
      <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;color:#1a1a1a;">수리·인문논술 과외 무료 수업 안내</h2>
      <p style="line-height:1.8;color:#444;margin-bottom:1rem;">
        본 수업은 수리논술, 인문논술을 중심으로 하되, 자연계논술·사회논술·의학계열 논술까지 대비할 수 있도록 구성된 맞춤형 논술 수업입니다. 학생의 지원 전형과 수준에 따라 단계별로 진행됩니다.
      </p>
    </section>

    <section style="margin-bottom:2rem;">
      <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;color:#1a1a1a;">📌 수업 대상 논술 유형</h2>
      <div style="background:#f9f7ff;padding:1.2rem;border-radius:10px;margin-bottom:1rem;">
        <h3 style="font-weight:700;margin-bottom:0.5rem;color:#6a33f6;">수리논술</h3>
        <p style="color:#555;font-size:0.95rem;">수학 개념 기반 문제 해결형 논술 (미적분, 확률과 통계, 기하 등)</p>
      </div>
      <div style="background:#f7fcf3;padding:1.2rem;border-radius:10px;margin-bottom:1rem;">
        <h3 style="font-weight:700;margin-bottom:0.5rem;color:#2d9b4a;">인문논술</h3>
        <p style="color:#555;font-size:0.95rem;">제시문 분석 및 비판적 글쓰기 중심</p>
      </div>
      <div style="background:#fffdf1;padding:1.2rem;border-radius:10px;margin-bottom:1rem;">
        <h3 style="font-weight:700;margin-bottom:0.5rem;color:#f5a623;">자연계논술</h3>
        <p style="color:#555;font-size:0.95rem;">과학 + 수학 통합형 논술 (물리/화학/생명 개념 활용)</p>
      </div>
      <div style="background:#fff5f4;padding:1.2rem;border-radius:10px;margin-bottom:1rem;">
        <h3 style="font-weight:700;margin-bottom:0.5rem;color:#e74c3c;">사회논술</h3>
        <p style="color:#555;font-size:0.95rem;">사회 현상 분석, 자료 해석, 시사형 논술</p>
      </div>
      <div style="background:#f8f2ff;padding:1.2rem;border-radius:10px;">
        <h3 style="font-weight:700;margin-bottom:0.5rem;color:#9b59b6;">의·치·한의대 논술</h3>
        <p style="color:#555;font-size:0.95rem;">고난도 제시문 분석 + 과학적 사고력 평가</p>
      </div>
    </section>

    <section style="margin-bottom:2rem;">
      <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;color:#1a1a1a;">📚 수업 진행 방식 (커리큘럼)</h2>
      
      <div style="background:#f9f7ff;padding:1.2rem;border-radius:10px;margin-bottom:1rem;">
        <h3 style="font-weight:700;margin-bottom:0.8rem;color:#6a33f6;font-size:1.1rem;">1단계: 기초 진단 및 방향 설정</h3>
        <ul style="margin:0;padding-left:1.5rem;color:#555;">
          <li style="margin-bottom:0.5rem;">학생 수준 테스트 (글쓰기 / 사고력 / 개념 이해)</li>
          <li style="margin-bottom:0.5rem;">목표 대학 및 전형 분석</li>
          <li>취약 유형 파악</li>
        </ul>
      </div>

      <div style="background:#f7fcf3;padding:1.2rem;border-radius:10px;margin-bottom:1rem;">
        <h3 style="font-weight:700;margin-bottom:0.8rem;color:#2d9b4a;font-size:1.1rem;">2단계: 논술 기본 구조 훈련</h3>
        <ul style="margin:0;padding-left:1.5rem;color:#555;">
          <li style="margin-bottom:0.5rem;">논술 글 구조 이해 (서론-본론-결론)</li>
          <li style="margin-bottom:0.5rem;">제시문 읽는 방법 훈련</li>
          <li>핵심 요약 & 논지 추출 연습</li>
        </ul>
      </div>

      <div style="background:#fffdf1;padding:1.2rem;border-radius:10px;margin-bottom:1rem;">
        <h3 style="font-weight:700;margin-bottom:0.8rem;color:#f5a623;font-size:1.1rem;">3단계: 유형별 실전 훈련</h3>
        <ul style="margin:0;padding-left:1.5rem;color:#555;">
          <li style="margin-bottom:0.5rem;">수리논술: 문제 풀이 + 서술형 답안 작성</li>
          <li style="margin-bottom:0.5rem;">인문논술: 비교/분석/비판형 글쓰기</li>
          <li style="margin-bottom:0.5rem;">자연·사회논술: 자료 해석 + 통합 사고 훈련</li>
          <li>의학계열: 고난도 제시문 논리 전개</li>
        </ul>
      </div>

      <div style="background:#fff5f4;padding:1.2rem;border-radius:10px;margin-bottom:1rem;">
        <h3 style="font-weight:700;margin-bottom:0.8rem;color:#e74c3c;font-size:1.1rem;">4단계: 실전 모의논술</h3>
        <ul style="margin:0;padding-left:1.5rem;color:#555;">
          <li style="margin-bottom:0.5rem;">실제 대학 기출 문제 풀이</li>
          <li style="margin-bottom:0.5rem;">시간 제한 실전 작성 연습</li>
          <li>첨삭 및 피드백 반복</li>
        </ul>
      </div>

      <div style="background:#f8f2ff;padding:1.2rem;border-radius:10px;margin-bottom:1rem;">
        <h3 style="font-weight:700;margin-bottom:0.8rem;color:#9b59b6;font-size:1.1rem;">5단계: 1:1 첨삭 및 약점 보완</h3>
        <ul style="margin:0;padding-left:1.5rem;color:#555;">
          <li style="margin-bottom:0.5rem;">개별 답안 상세 피드백</li>
          <li style="margin-bottom:0.5rem;">논리 흐름 수정</li>
          <li>표현력 및 구조 완성도 강화</li>
        </ul>
      </div>
    </section>

    <section>
      <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:1rem;color:#1a1a1a;">✍️ 수업 특징</h2>
      <ul style="margin:0;padding-left:1.5rem;color:#555;font-size:0.95rem;">
        <li style="margin-bottom:0.8rem;line-height:1.6;">✓ <strong>개인 맞춤형 1:1 수업</strong> - 학생의 수준과 목표에 맞춰 설계된 커리큘럼</li>
        <li style="margin-bottom:0.8rem;line-height:1.6;">✓ <strong>대학별 기출 기반 학습</strong> - 실제 입시에 필요한 콘텐츠 중심</li>
        <li style="margin-bottom:0.8rem;line-height:1.6;">✓ <strong>반복 첨삭을 통한 실력 향상</strong> - 체계적 피드백으로 글쓰기 개선</li>
        <li style="line-height:1.6;">✓ <strong>단기간 실전 대비 가능 구조</strong> - 효율적인 학습으로 빠른 성장</li>
      </ul>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', loadEssayRegion);

function decodeParam(v){ try{ return decodeURIComponent(v); }catch(e){ return v; } }

function buildCanonicalUrl(pageName, keys){
  const params = new URLSearchParams(window.location.search);
  const normalized = new URLSearchParams();

  keys.forEach((key) => {
    const value = params.get(key);
    if(value) normalized.set(key, value);
  });

  const query = normalized.toString();
  return query ? `https://nsystudy.kr/${pageName}?${query}` : `https://nsystudy.kr/${pageName}`;
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

function updateSchemaData(regionText) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${regionText} 논술 과외`,
    "description": `${regionText}의 수리논술, 인문논술, 약술형논술 입시 전략 및 과외 상담 서비스`,
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

  upsertJsonLdScript('serviceSchema', serviceSchema);
}

function updateMetaTags(regionText, essayType = '논술') {
  const pageTitle = `${regionText} ${essayType} 과외 | 대학 입시 맞춤 상담`;
  const pageDescription = `${regionText}에서 수리논술, 인문논술, 약술형논술 준비를 고민 중이라면 입시 전략과 1:1 첨삭 중심의 맞춤형 과외를 만나보세요. 논술 과외 추천, 논술 과외 비용 상담, 대학별 기출 분석 상담도 가능합니다.`;
  const canonicalUrl = buildCanonicalUrl('essay-region.html', ['province', 'city', 'town']);
  const pageKeywords = `${regionText} 논술 과외, ${regionText} 논술 과외 추천, ${regionText} 논술 과외 비용, ${regionText} 수리논술, ${regionText} 인문논술, ${regionText} 약술형논술, ${regionText} 논술 첨삭, 대학 논술 과외, 입시 논술 대비, 대학별 논술 기출`;
  
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

  upsertJsonLdScript('breadcrumbSchema', {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://nsystudy.kr/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "논술",
        "item": "https://nsystudy.kr/essay.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": regionText,
        "item": canonicalUrl
      }
    ]
  });

  upsertJsonLdScript('webPageSchema', {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": canonicalUrl,
    "inLanguage": "ko-KR",
    "isPartOf": {
      "@type": "WebSite",
      "name": "NSY Study",
      "url": "https://nsystudy.kr/"
    }
  });
}

function buildEssayDetailUrl(province, city, town){
  const params = new URLSearchParams({ province, city });
  if(town) params.set('town', town);
  return `essay-region.html?${params.toString()}`;
}

function getSubRegions(province, city){
  const root = window.subRegionsData || {};
  const provMap = root[province] || {};
  return provMap[city] || [];
}

document.addEventListener('DOMContentLoaded', async ()=>{
  const params = new URLSearchParams(location.search);
  const province = decodeParam(params.get('province')||'');
  const city = decodeParam(params.get('city')||'');
  const town = decodeParam(params.get('town')||'');

  const backToEssayList = document.getElementById('backToList');
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

  if(backToEssayList){
    if(hasTown){
      backToEssayList.href = buildEssayDetailUrl(province, city, '');
      backToEssayList.textContent = `← ${city} 동읍면 목록으로 돌아가기`;
    } else {
      backToEssayList.href = 'essay.html';
      backToEssayList.textContent = '← 논술 지역 목록으로 돌아가기';
    }
  }

  if(!hasTown && subRegions.length > 0){
    subregionSection.style.display = 'block';
    subregionTitle.textContent = `${city} 동읍면 지역 선택`;
    subregionHelp.textContent = '거주 또는 수업 희망 동읍면을 선택하면 해당 지역 논술 상담 페이지로 이동합니다.';
    subregionGrid.innerHTML = '';

    subRegions.forEach((name)=>{
      const a = document.createElement('a');
      a.className = 'district-chip';
      a.textContent = name;
      a.href = buildEssayDetailUrl(province, city, name);
      subregionGrid.appendChild(a);
    });
  } else {
    subregionSection.style.display = 'none';
  }

  titleEl.textContent = `${placeText} 논술 과외 안내`;
  metaLine.textContent = '대학 입시 논술 전형 무료 상담';
  hero.onerror = ()=>{
    hero.onerror = null;
    hero.src = 'tutoring-landing-11.jpg';
  };
  hero.src = 'essay-landing-11.jpg?v=20260807a';
  
  // Update meta tags for SEO
  updateMetaTags(placeText, '논술');
  
  // Update schema data
  updateSchemaData(placeText);

  content.innerHTML = `
    <p style="margin-top:0;color:var(--muted)">${hasTown ? town : city} 지역의 대학 입시 논술 전형 대비 과외 상담입니다. 수리논술, 인문논술, 약술형논술, 자연계논술, 사회계논술, 의학계열논술까지 학생의 수준과 목표에 맞춘 맞춤형 지도를 제공합니다.</p>
    <p style="color:var(--muted);margin-top:0.8rem;">논술 글쓰기와 논리적 글쓰기, 논술 첨삭 지도를 중심으로 답안 구조를 정리하고, 논술 기출 분석과 논술 모의고사 훈련을 반복해 대학 입시 논술 전형에 필요한 실전 감각을 길러드립니다.</p>
    <h3 style="margin-top:1rem">상담 항목</h3>
    <ul>
      <li>논술 전형 대학 및 전공 선택, 대입 논술 방향 설정</li>
      <li>논술 유형(수리/인문/약술형/자연계열/사회계열/의학계열) 파악</li>
      <li>현 수준 진단, 논술 시험대비 계획, 단기/장기 학습 플랜</li>
      <li>기출 분석, 논술 채점 기준 확인, 예상 출제 경향 파악</li>
    </ul>
  `;

  // 논술 팁
  const essayTips = `<h3 style="margin-top:1rem">${hasTown ? town : city} 논술 준비 팁</h3>
    <div class="info-card" style="margin-top:0.6rem;">
      <ul style="margin:0;padding-left:1.1rem;color:var(--muted)">
        <li>자신의 강점 과목을 먼저 선택하고 수리논술, 인문논술, 약술형논술 중 맞는 유형을 정하세요.</li>
        <li>기출문제를 최소 5년치 풀고 논술 채점 기준과 대학별 출제 경향을 분석하세요.</li>
        <li>논술 글쓰기와 논리적 글쓰기, 서술형 답안 구성을 반복 연습하세요.</li>
        <li>논술 첨삭 지도와 모의 논술고사 피드백을 함께 받아야 완성도가 올라갑니다.</li>
        <li>자연계논술, 사회계논술, 의학계열논술은 과목별 핵심 개념 정리가 중요합니다.</li>
      </ul>
    </div>`;
  content.innerHTML += essayTips;

  // 논술 유형별 설명
  const essayTypes = [
    {name: '수리논술', desc: '수학 개념 이해와 논리적 풀이 과정 서술이 핵심입니다. 수학을 정리된 글로 표현하는 능력이 중요합니다.', color: '#6a33f6', bg: '#f9f7ff'},
    {name: '인문논술', desc: '역사, 철학, 사회학적 관점에서 논제 분석과 논거 제시를 훈련합니다. 비판적 사고와 논리적 글쓰기가 필요합니다.', color: '#f5a623', bg: '#fffdf1'},
    {name: '약술형논술', desc: '핵심 개념을 짧고 정확하게 서술하는 훈련입니다. 제한된 분량 안에서 서술형 답안을 완성하는 연습이 중요합니다.', color: '#8e44ad', bg: '#f8f0fc'},
    {name: '자연계논술', desc: '과학 개념을 바탕으로 자료 해석, 현상 설명, 논술 첨삭이 이어지는 유형입니다. Physics, Chemistry, Biology 이해가 중요합니다.', color: '#e74c3c', bg: '#fff5f4'},
    {name: '사회계논술', desc: '경제, 정치, 사회 현상 분석과 대안 제시를 다룹니다. 사회계열 논술 전형에서는 다각적 관점과 현실 감각이 중요합니다.', color: '#3498db', bg: '#ecf8ff'},
    {name: '의학계열논술', desc: '의료 사례, 생명윤리, 사회문제 분석을 통해 의학계열 논술 대비를 합니다. 의학적 이해와 인문학적 소양을 함께 요구합니다.', color: '#2d9b4a', bg: '#f7fcf3'}
  ];
  let essayHtml = `<h2 style="margin-top:2rem">📝 논술 유형별 안내</h2>`;
  essayTypes.forEach(e => {
    essayHtml += `<div style="background:${e.bg};padding:1.2rem;border-radius:10px;margin:1rem 0;border-left:4px solid ${e.color};"><h3 style="color:${e.color};font-weight:700;margin:0 0 0.5rem;">${e.name}</h3><p style="color:#555;margin:0;">${e.desc}</p></div>`;
  });
  content.innerHTML += essayHtml;

  // 교사 정보
  let teacherHtml = `<h2 style="margin-top:2rem">👨‍🏫 우리 선생님들</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;">NSY Study의 논술 전문 교사 기준:</p>
    <ul style="color:#555;line-height:1.8;">
      <li>✓ 논술 채점 기준, 출제 경향, 대학별 기출 분석 숙지</li>
      <li>✓ 주요 대학 논술 입시 성공 경험 보유</li>
      <li>✓ 학생 개인차에 맞춘 논술 첨삭 및 피드백</li>
      <li>✓ 기초부터 고급까지 단계별 지도 능력</li>
      <li>✓ 정기 모의 논술고사 및 진도 관리</li>
    </ul>
    <p style="color:var(--muted);margin-top:1.5rem;"><strong>논술 과외 진행 프로세스</strong></p>
    <ol style="color:#555;line-height:1.8;">
      <li>논술 유형 선택, 수준 진단, 대입 논술 목표 설정 (1회)</li>
      <li>기초 논술 구조와 논리적 글쓰기 훈련 (4주)</li>
      <li>기출문제 풀이, 논술 첨삭, 채점 기준 반영 (8주)</li>
      <li>모의 논술고사와 실전 답안 작성 연습 (4주)</li>
      <li>최종 피드백 및 시험 전 집중 보충</li>
    </ol>`;
  content.innerHTML += teacherHtml;

  // FAQ
  const faqs = [
    {q: '논술은 기초 없이 시작해도 괜찮나요?', a: '네, 가능합니다. 논술 글쓰기와 논리 구조부터 시작하면 고등학교 2학년 이후에도 충분히 합격 수준에 도달할 수 있습니다.'},
    {q: '논술 유형이 여러 개인데, 모두 배워야 하나요?', a: '자신의 강점이나 목표 대학에 맞춰 수리논술, 인문논술, 약술형논술, 자연계논술, 사회계논술, 의학계열논술 중 1-2개 유형을 선택해 집중하는 것이 효과적입니다.'},
    {q: '기출 분석은 선생님과 함께 해야 하나요?', a: '네, 강력히 권장합니다. 논술 채점 기준과 출제자의 의도를 정확히 이해하는 데 도움이 됩니다.'},
    {q: '논술 과외 기간은 보통 얼마나 되나요?', a: '3-6개월이 일반적입니다. 목표 시험 일정, 논술 시험대비 범위, 현재 수준에 따라 계획합니다.'},
    {q: '혼자 첨삭 연습하는 것이 효과적인가요?', a: '일부 효과는 있지만, 전문가 첨삭과 피드백을 받아야 실력이 빠르게 향상됩니다.'},
    {q: '논술 과외 비용은 어느 정도인가요?', a: '월 70-120만원 정도입니다. 과외 횟수, 선생님 경력, 논술 첨삭 밀도에 따라 다릅니다.'}
  ];
  let faqHtml = `<h2 style="margin-top:2rem">❓ 자주 묻는 질문 (FAQ)</h2>`;
  faqs.forEach((faq, idx) => {
    faqHtml += `<div style="background:#f5f5f5;padding:1.2rem;border-radius:10px;margin:1rem 0;"><h4 style="color:#1a1a1a;margin:0 0 0.6rem;font-weight:700;">Q${idx+1}. ${faq.q}</h4><p style="color:#555;margin:0;line-height:1.6;">${faq.a}</p></div>`;
  });
  content.innerHTML += faqHtml;

  upsertJsonLdScript('faqSchema', {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  });

  // 다른 서비스 안내 섹션
  let relatedHtml = `<div style="background:#fffdf1;margin:2rem 0;padding:1.5rem;border-radius:10px;border-left:4px solid #f5a623;">
    <h3 style="margin-top:0;color:#1a1a1a;">📚 다른 입시 대비도 함께하세요</h3>
    <p style="color:#666;margin:0.5rem 0 1rem;">논술 외 다양한 입시 전형을 함께 준비할 수 있습니다.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;">
      <a href="regions.html" style="padding:1.2rem;background:white;border:1px solid #2d9b4a;border-radius:8px;text-decoration:none;color:#333;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(45, 155, 74, 0.2)'" onmouseout="this.style.boxShadow='none'">
        <h4 style="margin:0 0 0.5rem;color:#2d9b4a;font-weight:700;">📖 전국과외</h4>
        <p style="margin:0;font-size:0.9rem;color:#666;">수학·영어 수능 대비</p>
      </a>
      <a href="ged.html" style="padding:1.2rem;background:white;border:1px solid #6a33f6;border-radius:8px;text-decoration:none;color:#333;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(106, 51, 246, 0.2)'" onmouseout="this.style.boxShadow='none'">
        <h4 style="margin:0 0 0.5rem;color:#6a33f6;font-weight:700;">🎓 검정고시</h4>
        <p style="margin:0;font-size:0.9rem;color:#666;">중·고졸 검정고시</p>
      </a>
      <a href="international.html" style="padding:1.2rem;background:white;border:1px solid #3498db;border-radius:8px;text-decoration:none;color:#333;transition:all 0.3s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(52, 152, 219, 0.2)'" onmouseout="this.style.boxShadow='none'">
        <h4 style="margin:0 0 0.5rem;color:#3498db;font-weight:700;">🌍 국제학교</h4>
        <p style="margin:0;font-size:0.9rem;color:#666;">IB·AP·외국학 과외</p>
      </a>
    </div>
  </div>`;
  content.innerHTML += relatedHtml;

  // Primary action
  const telNumber = '+821029283614';
  consult.href = `tel:${telNumber}`;
  consult.textContent = '전화로 상담하기';
  consult.setAttribute('data-mailto', `mailto:hello@nsystudy.kr?subject=${encodeURIComponent(placeText+' 논술 상담 신청')}`);
});

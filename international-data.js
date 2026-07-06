// Data for international schools grouped by province/city
const intlFallback = [
  {province:'서울특별시', schools:[
    {city:'서울', name:'한국외국인학교 (서울캠퍼스)', slug:'korean-foreign-school-seoul'},
    {city:'서울', name:'한국켄트외국인학교', slug:'korean-kent-school'},
    {city:'서울', name:'서울외국인학교', slug:'seoul-foreign-school'},
    {city:'서울', name:'서울드와이트외국인학교', slug:'seoul-dwight-school'},
    {city:'서울', name:'코리아외국인학교', slug:'korea-foreign-school'},
    {city:'서울', name:'아시아퍼시픽국제외국인학교', slug:'asia-pacific-international-school'},
    {city:'서울', name:'지구촌기독외국인학교', slug:'global-christian-school'},
    {city:'서울', name:'서울용산국제학교', slug:'seoul-yongsan-international-school'},
    {city:'서울', name:'덜위치칼리지서울영국학교', slug:'dulwich-college-seoul'},
    {city:'서울', name:'서울프랑스학교 (Lycée Français de Séoul)', slug:'lycee-francais-de-seoul'},
    {city:'서울', name:'서울일본인학교', slug:'seoul-japanese-school'},
    {city:'서울', name:'서울독일학교', slug:'seoul-german-school'},
    {city:'서울', name:'하비에르 국제학교', slug:'xavier-international-school'}
  ]},
  {province:'경기도', schools:[
    {city:'인천', name:'청라달튼외국인학교', slug:'cheongna-dalton-school'},
    {city:'수원', name:'경기수원외국인학교', slug:'gyeonggi-suwon-foreign-school'},
    {city:'판교', name:'한국외국인학교 (판교캠퍼스)', slug:'korean-foreign-school-pangyo'},
    {city:'평택', name:'평택크리스천외국인학교', slug:'pyeongtaek-christian-school'},
    {city:'인천', name:'인천화교학교', slug:'incheon-hwa-gyo-school'}
  ]},
  {province:'부산광역시', schools:[
    {city:'부산', name:'부산외국인학교', slug:'busan-foreign-school'},
    {city:'부산', name:'부산국제외국인학교', slug:'busan-international-foreign-school'},
    {city:'경남', name:'경남국제외국인학교', slug:'gyeongnam-international-school'},
    {city:'거제', name:'거제국제외국인학교', slug:'geoje-international-school'}
  ]},
  {province:'대전광역시', schools:[
    {city:'대전', name:'대전외국인학교', slug:'daejeon-foreign-school'}
  ]},
  {province:'울산광역시', schools:[
    {city:'울산', name:'울산현대외국인학교', slug:'ulsan-hyundai-foreign-school'}
  ]},
  {province:'광주광역시', schools:[
    {city:'광주', name:'광주국제외국인학교', slug:'gwangju-international-school'}
  ]},
  {province:'대구광역시', schools:[
    {city:'대구', name:'한국대구화교중고등학교', slug:'daegu-hwa-gyo-high-school'},
    {city:'대구', name:'한국대구화교초등학교', slug:'daegu-hwa-gyo-elementary-school'}
  ]},
  {province:'제주특별자치도', schools:[
    {city:'제주', name:'채드윅 송도국제학교 제주 캠퍼스', slug:'chadwick-jeju'},
    {city:'제주', name:'NLCS 제주 (North London Collegiate School Jeju)', slug:'nlcs-jeju'},
    {city:'제주', name:'브랭섬홀 아시아', slug:'branksome-hall-asia'},
    {city:'제주', name:'세인트존스베리아카데미 제주', slug:'saint-johns-british-academy-jeju'},
    {city:'제주', name:'KIS 제주 (Korea International School Jeju)', slug:'kis-jeju'},
    {city:'제주', name:'제주국제학교', slug:'jeju-international-school'}
  ]},
  {province:'외국', schools:[
    {city:'두바이', name:'American School of Dubai', slug:'american-school-of-dubai'},
    {city:'런던', name:'American School of London', slug:'american-school-of-london'},
    {city:'홍콩', name:'American International School of Hong Kong', slug:'american-international-school-of-hong-kong'},
    {city:'방콕', name:'American School of Bangkok', slug:'american-school-of-bangkok'},
    {city:'베이징', name:'International School of Beijing', slug:'international-school-of-beijing'},
    {city:'상하이', name:'International School of Shanghai', slug:'international-school-of-shanghai'},
    {city:'쿠알라룸푸르', name:'International School of Kuala Lumpur', slug:'international-school-of-kuala-lumpur'},
    {city:'싱가포르', name:'Singapore American School', slug:'singapore-american-school'},
    {city:'타이베이', name:'Taipei American School', slug:'taipei-american-school'},
    {city:'서울', name:'Seoul Foreign School', slug:'seoul-foreign-school-us-curriculum'},
    {city:'도쿄', name:'British School of Tokyo', slug:'british-school-of-tokyo'},
    {city:'베이징', name:'British School of Beijing', slug:'british-school-of-beijing'},
    {city:'자카르타', name:'British School of Jakarta', slug:'british-school-of-jakarta'},
    {city:'방콕', name:'British International School Bangkok (BISB)', slug:'british-international-school-bangkok'},
    {city:'마닐라', name:'British School Manila', slug:'british-school-manila'},
    {city:'런던', name:'Southbank International School (London)', slug:'southbank-international-school-london'},
    {city:'런던', name:'ACS International Schools (UK)', slug:'acs-international-schools-uk'},
    {city:'싱가포르', name:'Dulwich College Singapore', slug:'dulwich-college-singapore'},
    {city:'싱가포르', name:'United World College of South East Asia (UWCSEA)', slug:'uwcsea-singapore'},
    {city:'싱가포르', name:'Australian International School Singapore', slug:'australian-international-school-singapore'},
    {city:'싱가포르', name:'Stamford American International School', slug:'stamford-american-international-school'},
    {city:'방콕', name:'NIST International School (Thailand)', slug:'nist-international-school-thailand'},
    {city:'자카르타', name:'Jakarta Intercultural School (JIS)', slug:'jakarta-intercultural-school-jis'},
    {city:'홍콩', name:'Hong Kong International School (HKIS)', slug:'hong-kong-international-school-hkis'},
    {city:'홍콩', name:'Chinese International School', slug:'chinese-international-school'},
    {city:'홍콩', name:'German Swiss International School', slug:'german-swiss-international-school'},
    {city:'홍콩', name:'Australian International School Hong Kong', slug:'australian-international-school-hong-kong'},
    {city:'홍콩', name:'Harrow International School Hong Kong', slug:'harrow-international-school-hong-kong'},
    {city:'중국', name:'Western Academy of Beijing (WAB)', slug:'western-academy-of-beijing'},
    {city:'상하이', name:'Shanghai American School (SAS)', slug:'shanghai-american-school-sas'},
    {city:'상하이', name:'Concordia International School Shanghai', slug:'concordia-international-school-shanghai'},
    {city:'베이징', name:'Dulwich College Beijing', slug:'dulwich-college-beijing'},
    {city:'상하이', name:'Dulwich College Shanghai', slug:'dulwich-college-shanghai'},
    {city:'상하이', name:'YK Pao School', slug:'yk-pao-school'},
    {city:'베이징', name:'International School of Beijing (ISB)', slug:'international-school-of-beijing-isb'},
    {city:'도쿄', name:'Tokyo American School', slug:'tokyo-american-school'},
    {city:'도쿄', name:'International School of the Sacred Heart', slug:'international-school-of-the-sacred-heart'},
    {city:'도쿄', name:'British School in Tokyo', slug:'british-school-in-tokyo'},
    {city:'도쿄', name:'Canadian International School Tokyo', slug:'canadian-international-school-tokyo'},
    {city:'요코하마', name:'Yokohama International School', slug:'yokohama-international-school'},
    {city:'도쿄', name:'Aoba-Japan International School', slug:'aoba-japan-international-school'},
    {city:'방콕', name:'Bangkok Patana School', slug:'bangkok-patana-school'},
    {city:'방콕', name:'Shrewsbury International School Bangkok', slug:'shrewsbury-international-school-bangkok'},
    {city:'두바이', name:'Dubai International Academy', slug:'dubai-international-academy'},
    {city:'두바이', name:'GEMS World Academy', slug:'gems-world-academy'},
    {city:'두바이', name:'Jumeirah English Speaking School (JESS)', slug:'jumeirah-english-speaking-school-jess'},
    {city:'아부다비', name:'British International School Abu Dhabi', slug:'british-international-school-abu-dhabi'},
    {city:'두바이', name:'Nord Anglia International School Dubai', slug:'nord-anglia-international-school-dubai'},
    {city:'제네바', name:'International School of Geneva', slug:'international-school-of-geneva'},
    {city:'취리히', name:'Zurich International School', slug:'zurich-international-school'},
    {city:'프랑크푸르트', name:'Frankfurt International School', slug:'frankfurt-international-school'},
    {city:'베를린', name:'Berlin Brandenburg International School', slug:'berlin-brandenburg-international-school'},
    {city:'암스테르담', name:'International School of Amsterdam', slug:'international-school-of-amsterdam'},
    {city:'파리', name:'British School of Paris', slug:'british-school-of-paris'},
    {city:'뉴욕', name:'United Nations International School (NY)', slug:'united-nations-international-school-ny'},
    {city:'뉴욕', name:'Avenues The World School (NY)', slug:'avenues-the-world-school-ny'},
    {city:'로스앤젤레스', name:'International School of Los Angeles', slug:'international-school-of-los-angeles'},
    {city:'샌프란시스코', name:'International School of San Francisco', slug:'international-school-of-san-francisco'},
    {city:'워싱턴 DC', name:'German International School Washington DC', slug:'german-international-school-washington-dc'},
    {city:'시카고', name:'British International School of Chicago', slug:'british-international-school-of-chicago'},
    {city:'카이로', name:'Cairo American College', slug:'cairo-american-college'},
    {city:'나이로비', name:'International School of Kenya', slug:'international-school-of-kenya'},
    {city:'라고스', name:'American International School of Lagos', slug:'american-international-school-of-lagos'},
    {city:'브라질리아', name:'American School of Brasilia', slug:'american-school-of-brasilia'},
    {city:'상파울루', name:'Graded School', slug:'graded-school-brazil'},
    {city:'부에노스아이레스', name:'British School of Buenos Aires', slug:'british-school-of-buenos-aires'}
  ]}
];

function loadIntl(){
  renderIntl(intlFallback);
}

function renderIntl(data){
  const container = document.getElementById('intlPanel');
  container.innerHTML = '';
  data.forEach(group=>{
    const box = document.createElement('div');
    box.className = 'region-card-large';
    const title = document.createElement('h3');
    title.style.color = '#6a33f6';
    title.style.marginBottom = '0.6rem';
    title.textContent = group.province;

    const grid = document.createElement('div');
    grid.className = 'district-grid';

    if(group.schools && group.schools.length>0){
      group.schools.forEach(s=>{
        const a = document.createElement('a');
        a.className = 'district-chip';
        a.href = `international-detail.html?province=${encodeURIComponent(group.province)}&city=${encodeURIComponent(s.city)}&school=${encodeURIComponent(s.slug)}&name=${encodeURIComponent(s.name)}`;
        a.textContent = s.name;
        grid.appendChild(a);
      });
    } else {
      const p = document.createElement('p');
      p.style.color='var(--muted)';
      p.textContent = '해당 지역의 국제학교 목록이 없습니다.';
      grid.appendChild(p);
    }

    box.appendChild(title);
    box.appendChild(grid);
    container.appendChild(box);
  });
}

document.addEventListener('DOMContentLoaded', loadIntl);

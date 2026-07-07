const regions = [
  { province: '서울특별시', city: '강남구', math: 42, english: 28, link: '#' },
  { province: '서울특별시', city: '서초구', math: 18, english: 12, link: '#' },
  { province: '경기도', city: '수원시', math: 22, english: 16, link: '#' },
  { province: '경기도', city: '성남시', math: 15, english: 20, link: '#' },
  { province: '부산광역시', city: '해운대구', math: 9, english: 7, link: '#' },
  { province: '대전광역시', city: '유성구', math: 6, english: 4, link: '#' },
  { province: '제주특별자치도', city: '제주시', math: 4, english: 3, link: '#' }
];

function renderRegions(list) {
  const container = document.getElementById('regionsList');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p>검색 결과가 없습니다. 다른 키워드로 시도해보세요.</p>';
    return;
  }

  // Group by province
  const byProvince = list.reduce((acc, r) => {
    acc[r.province] = acc[r.province] || [];
    acc[r.province].push(r);
    return acc;
  }, {});

  Object.keys(byProvince).forEach((prov) => {
    const header = document.createElement('div');
    header.className = 'province-header';
    header.textContent = prov;
    container.appendChild(header);

    const group = byProvince[prov];
    group.forEach((r) => {
      const card = document.createElement('article');
      card.className = 'region-card';

      const title = document.createElement('h4');
      title.textContent = r.city;

      const meta = document.createElement('div');
      meta.className = 'region-meta';
      meta.innerHTML = `<span class="subject-badge">수학 ${r.math}</span><span class="subject-badge" style="background:rgba(99,221,255,0.12);color:#007ea8">영어 ${r.english}</span>`;

      const actions = document.createElement('div');
      actions.className = 'region-actions';
      const view = document.createElement('a');
      view.href = r.link;
      view.textContent = '선생님 보기';
      actions.appendChild(view);

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(actions);

      container.appendChild(card);
    });
  });
}

function applyFilters() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const subj = document.getElementById('subjectFilter').value;

  let filtered = regions.filter((r) => {
    const hay = (r.province + ' ' + r.city).toLowerCase();
    return hay.includes(q);
  });

  if (subj === 'math') filtered = filtered.filter((r) => r.math > 0);
  if (subj === 'english') filtered = filtered.filter((r) => r.english > 0);

  renderRegions(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('subjectFilter').addEventListener('change', applyFilters);
  renderRegions(regions);
});

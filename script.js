const REGION_CACHE_KEY = 'nsy_regions_v1';
const HOME_FEATURED_LIMIT = 20;
const SEARCH_RESULT_LIMIT = 80;

const fallbackRegions = [
  { province: '서울특별시', cities: ['강남구', '서초구'] },
  { province: '경기도', cities: ['수원시', '성남시'] },
  { province: '부산광역시', cities: ['해운대구'] },
  { province: '대전광역시', cities: ['유성구'] },
  { province: '제주특별자치도', cities: ['제주시'] }
];

let regions = [];
let featuredRegions = [];
let isHomeRegionsInitialized = false;
let lastRenderedRegionSignature = '';

function setRegionsAndRender(data) {
  const nextRegions = flattenRegions(data);
  const nextSignature = buildRowsSignature(nextRegions);
  if (nextSignature === lastRenderedRegionSignature && regions.length > 0) {
    return;
  }

  lastRenderedRegionSignature = nextSignature;
  regions = nextRegions;
  featuredRegions = buildFeaturedRegions(regions, HOME_FEATURED_LIMIT);
  renderCurrentHomeView();
}

function buildRowsSignature(rows) {
  return rows.map((row) => `${row.province}|${row.city}`).join('~');
}

function readCachedRegions() {
  try {
    const raw = window.localStorage.getItem(REGION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function writeCachedRegions(data) {
  try {
    window.localStorage.setItem(REGION_CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    // Ignore private mode/quota errors.
  }
}

function buildPageUrl(pageName, query) {
  const path = window.location.pathname;
  const basePath = path.endsWith('/')
    ? path
    : path.includes('.')
      ? path.slice(0, path.lastIndexOf('/') + 1)
      : `${path}/`;
  return `${basePath}${pageName}?${query.toString()}`;
}

function buildRegionUrl(province, city) {
  const params = new URLSearchParams({ province, city });
  return buildPageUrl('region.html', params);
}

function flattenRegions(data) {
  const rows = [];
  data.forEach((prov) => {
    (prov.cities || []).forEach((city) => {
      rows.push({
        province: prov.province,
        city,
        keyword: `${prov.province} ${city}`.toLowerCase(),
        link: buildRegionUrl(prov.province, city)
      });
    });
  });
  return rows;
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), delay);
  };
}

function buildFeaturedRegions(rows, maxCount) {
  const byProvince = rows.reduce((acc, row) => {
    if (!acc[row.province]) {
      acc[row.province] = [];
    }
    acc[row.province].push(row);
    return acc;
  }, {});

  const provinces = Object.keys(byProvince);
  const featured = [];
  let depth = 0;

  while (featured.length < maxCount) {
    let addedInRound = 0;
    provinces.forEach((province) => {
      const next = byProvince[province][depth];
      if (next && featured.length < maxCount) {
        featured.push(next);
        addedInRound += 1;
      }
    });

    if (addedInRound === 0) {
      break;
    }
    depth += 1;
  }

  return featured;
}

function renderRegions(list, meta = {}) {
  const container = document.getElementById('regionsList');
  if (!container) return;

  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p>검색 결과가 없습니다. 다른 키워드로 시도해보세요.</p>';
    return;
  }

  const byProvince = list.reduce((acc, row) => {
    if (!acc[row.province]) {
      acc[row.province] = [];
    }
    acc[row.province].push(row);
    return acc;
  }, {});

  const fragment = document.createDocumentFragment();
  Object.keys(byProvince).forEach((prov) => {
    const header = document.createElement('div');
    header.className = 'province-header';
    header.textContent = prov;
    fragment.appendChild(header);

    byProvince[prov].forEach((row) => {
      const card = document.createElement('article');
      card.className = 'region-card';

      const title = document.createElement('h4');
      title.textContent = row.city;

      const meta = document.createElement('div');
      meta.className = 'region-meta';
      meta.innerHTML = '<span class="subject-badge">수학 상담 가능</span><span class="subject-badge" style="background:rgba(99,221,255,0.12);color:#007ea8">영어 상담 가능</span>';

      const actions = document.createElement('div');
      actions.className = 'region-actions';
      const view = document.createElement('a');
      view.href = row.link;
      view.textContent = '지역 상세 보기';
      actions.appendChild(view);

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(actions);
      fragment.appendChild(card);
    });
  });

  container.appendChild(fragment);

  if (meta.hasMore) {
    const more = document.createElement('p');
    more.style.margin = '1rem 0 0';
    more.style.color = 'var(--muted)';
    more.innerHTML = `총 ${meta.totalCount}개 지역 중 일부만 표시 중입니다. <a href="regions.html" style="color:var(--primary-dark);font-weight:700;">전체 지역 보기</a>`;
    container.appendChild(more);
  }
}

function applyFilters() {
  const searchInput = document.getElementById('searchInput');
  const subjectFilter = document.getElementById('subjectFilter');
  if (!searchInput || !subjectFilter) return;

  const q = searchInput.value.trim().toLowerCase();
  const subj = subjectFilter.value;

  const filtered = regions.filter((row) => {
    return row.keyword.includes(q);
  });

  const isSubjectFiltered = subj === 'math' || subj === 'english';
  if (!q && !isSubjectFiltered) {
    renderRegions(featuredRegions, { hasMore: regions.length > featuredRegions.length, totalCount: regions.length });
    return;
  }

  const limited = filtered.slice(0, SEARCH_RESULT_LIMIT);
  renderRegions(limited, { hasMore: filtered.length > limited.length, totalCount: filtered.length });
}

function renderCurrentHomeView() {
  const searchInput = document.getElementById('searchInput');
  const subjectFilter = document.getElementById('subjectFilter');

  if (!searchInput || !subjectFilter) {
    renderRegions(featuredRegions, { hasMore: regions.length > featuredRegions.length, totalCount: regions.length });
    return;
  }

  const hasQuery = searchInput.value.trim().length > 0;
  const hasSubjectFilter = subjectFilter.value === 'math' || subjectFilter.value === 'english';
  if (hasQuery || hasSubjectFilter) {
    applyFilters();
    return;
  }

  renderRegions(featuredRegions, { hasMore: regions.length > featuredRegions.length, totalCount: regions.length });
}

async function initHomeRegions() {
  const cached = readCachedRegions();
  const source = cached && cached.length > 0 ? cached : fallbackRegions;
  setRegionsAndRender(source);

  try {
    const res = await fetch('data/regions.json', { cache: 'force-cache' });
    if (!res.ok) return;

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      writeCachedRegions(data);
      setRegionsAndRender(data);
    }
  } catch (e) {
    // Keep rendered cached/fallback data.
  }
}

function scheduleHomeRegionsInit() {
  if (isHomeRegionsInitialized) return;
  isHomeRegionsInitialized = true;

  const startInit = () => {
    void initHomeRegions();
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(startInit, { timeout: 1500 });
  } else {
    window.setTimeout(startInit, 120);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const subjectFilter = document.getElementById('subjectFilter');
  const onInput = debounce(() => {
    scheduleHomeRegionsInit();
    applyFilters();
  }, 100);

  if (searchInput) {
    searchInput.addEventListener('input', onInput);
    searchInput.addEventListener('focus', scheduleHomeRegionsInit, { once: true });
  }
  if (subjectFilter) {
    subjectFilter.addEventListener('change', () => {
      scheduleHomeRegionsInit();
      applyFilters();
    });
  }

  const regionsSection = document.getElementById('regions');
  if (regionsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        scheduleHomeRegionsInit();
      }
    }, { rootMargin: '300px 0px' });
    observer.observe(regionsSection);
  } else {
    scheduleHomeRegionsInit();
  }
});

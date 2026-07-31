const fallbackRegions = [];
const REGION_CACHE_KEY = 'nsy_regions_v1';

function readCachedRegions(){
  try{
    const raw = window.localStorage.getItem(REGION_CACHE_KEY);
    if(!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  }catch(e){
    return null;
  }
}

function writeCachedRegions(data){
  try{
    window.localStorage.setItem(REGION_CACHE_KEY, JSON.stringify(data));
  }catch(e){
    // Ignore quota or private mode errors.
  }
}

async function loadRegions(){
  const cached = readCachedRegions();
  if(cached && cached.length > 0){
    initRegionsUI(cached);
  }

  try{
    const res = await fetch('data/regions.json', { cache: 'force-cache' });
    if(!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if(Array.isArray(data) && data.length > 0){
      writeCachedRegions(data);
      if(!cached || cached.length === 0){
        initRegionsUI(data);
      }
      return;
    }
    throw new Error('regions.json was empty');
  }catch(e){
    const source = cached && cached.length > 0 ? cached : fallbackRegions;
    console.warn('Fetch failed, using cached/fallback regions', e);
    if(!cached || cached.length === 0){
      initRegionsUI(source);
    }
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

function getSubRegions(province, city){
  const root = window.subRegionsData || {};
  const provMap = root[province] || {};
  return provMap[city] || [];
}

function buildRegionUrl(province, city, town){
  const params = new URLSearchParams({ province, city });
  if(town) params.set('town', town);
  return buildPageUrl('region.html', params);
}

function normalizeText(value){
  return (value || '').toString().trim().toLowerCase();
}

function debounce(fn, delay){
  let timer = null;
  return (...args) => {
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), delay);
  };
}

function getProvinceLabel(province){
  if(province === '서울특별시') return '서울';
  if(province === '인천광역시') return '인천';
  if(province === '부산광역시') return '부산';
  if(province === '대구광역시') return '대구';
  if(province === '광주광역시') return '광주';
  if(province === '대전광역시') return '대전';
  if(province === '울산광역시') return '울산';
  if(province === '세종특별자치시') return '세종';
  if(province === '경기도') return '경기';
  if(province === '강원도') return '강원';
  if(province === '충청북도') return '충북';
  if(province === '충청남도') return '충남';
  if(province === '전라북도') return '전북';
  if(province === '전라남도') return '전남';
  if(province === '경상북도') return '경북';
  if(province === '경상남도') return '경남';
  if(province === '제주특별자치도') return '제주';
  return province;
}

function flattenRegions(data){
  const rows = [];

  data.forEach((prov) => {
    prov.cities.forEach((city) => {
      rows.push({
        province: prov.province,
        city,
        town: '',
        label: `${city} (${getProvinceLabel(prov.province)})`,
        keyword: `${prov.province} ${getProvinceLabel(prov.province)} ${city}`.toLowerCase(),
        href: buildRegionUrl(prov.province, city, '')
      });

      const towns = getSubRegions(prov.province, city);
      towns.forEach((town) => {
        rows.push({
          province: prov.province,
          city,
          town,
          label: `${town} (${city}, ${getProvinceLabel(prov.province)})`,
          keyword: `${prov.province} ${getProvinceLabel(prov.province)} ${city} ${town}`.toLowerCase(),
          href: buildRegionUrl(prov.province, city, town)
        });
      });
    });
  });

  return rows;
}

function initRegionsUI(data){
  const provinceChipGrid = document.getElementById('provinceChipGrid');
  const cityChipGrid = document.getElementById('cityChipGrid');
  const regionSearchInput = document.getElementById('regionSearchInput');
  const regionSearchResults = document.getElementById('regionSearchResults');
  const regionHelpText = document.getElementById('regionHelpText');

  if(!provinceChipGrid || !cityChipGrid || !regionSearchInput || !regionSearchResults || !regionHelpText){
    return;
  }

  if(!Array.isArray(data) || data.length === 0){
    regionHelpText.textContent = '지역 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
    cityChipGrid.innerHTML = '';
    provinceChipGrid.innerHTML = '';
    return;
  }

  const flattened = flattenRegions(data);
  let activeProvince = data[0] ? data[0].province : '';

  function renderProvinceChips(){
    provinceChipGrid.innerHTML = '';

    data.forEach((prov) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'province-chip';
      if(prov.province === activeProvince) {
        btn.classList.add('province-chip--active');
      }
      btn.textContent = getProvinceLabel(prov.province);

      btn.addEventListener('click', () => {
        activeProvince = prov.province;
        renderProvinceChips();
        renderCityChips();
        regionSearchInput.value = '';
        regionSearchResults.innerHTML = '';
      });

      provinceChipGrid.appendChild(btn);
    });
  }

  function renderCityChips(){
    cityChipGrid.innerHTML = '';

    const selected = data.find((item) => item.province === activeProvince);
    if(!selected){
      regionHelpText.textContent = '원하는 지역을 입력해 바로 이동해보세요.';
      return;
    }

    regionHelpText.textContent = `${getProvinceLabel(selected.province)} 지역 시·군·구를 선택하면 상세 페이지로 이동합니다.`;

    selected.cities.forEach((city) => {
      const a = document.createElement('a');
      a.className = 'city-chip';
      a.href = buildRegionUrl(selected.province, city, '');
      a.textContent = city;
      cityChipGrid.appendChild(a);
    });
  }

  function renderSearchResults(items){
    regionSearchResults.innerHTML = '';

    if(items.length === 0){
      regionSearchResults.innerHTML = '<p class="region-result-empty">검색 결과가 없습니다. 시·도 또는 시·군·구 이름으로 다시 입력해 주세요.</p>';
      return;
    }

    const list = document.createElement('div');
    list.className = 'region-result-list';

    items.slice(0, 9).forEach((item) => {
      const a = document.createElement('a');
      a.className = 'region-result-item';
      a.href = item.href;
      a.innerHTML = `<strong>${item.town || item.city}</strong><span>${item.province} ${item.city}${item.town ? ` · ${item.town}` : ''}</span>`;
      list.appendChild(a);
    });

    regionSearchResults.appendChild(list);
  }

  const onSearchInput = debounce(() => {
    const q = normalizeText(regionSearchInput.value);
    if(!q){
      regionSearchResults.innerHTML = '';
      return;
    }

    const filtered = flattened.filter((row) => row.keyword.includes(q));
    renderSearchResults(filtered);
  }, 120);

  regionSearchInput.addEventListener('input', onSearchInput);

  regionSearchInput.addEventListener('keydown', (event) => {
    if(event.key !== 'Enter') return;

    const q = normalizeText(regionSearchInput.value);
    if(!q) return;

    const firstMatch = flattened.find((row) => row.keyword.includes(q));
    if(firstMatch){
      window.location.href = firstMatch.href;
    }
  });

  renderProvinceChips();
  renderCityChips();
}

document.addEventListener('DOMContentLoaded', loadRegions);

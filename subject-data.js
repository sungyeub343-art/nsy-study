const SUBJECT_REGION_CACHE_KEY = 'nsy_regions_v2';

function getSubjectConfig(){
  const body = document.body;
  return {
    subject: body.dataset.subject || '',
    detailPage: body.dataset.detailPage || '',
    searchInputId: body.dataset.searchInputId || '',
    searchResultsId: body.dataset.searchResultsId || '',
    provinceGridId: body.dataset.provinceGridId || '',
    cityGridId: body.dataset.cityGridId || '',
    helpTextId: body.dataset.helpTextId || ''
  };
}

function readCachedSubjectRegions(){
  try{
    const parsed = JSON.parse(window.localStorage.getItem(SUBJECT_REGION_CACHE_KEY));
    return Array.isArray(parsed) ? parsed : null;
  }catch(e){
    return null;
  }
}

function writeCachedSubjectRegions(data){
  try{
    window.localStorage.setItem(SUBJECT_REGION_CACHE_KEY, JSON.stringify(data));
  }catch(e){
    // Storage can be unavailable in private browsing.
  }
}

function getSubjectProvinceLabel(province){
  const labels = {
    '서울특별시': '서울', '부산광역시': '부산', '대구광역시': '대구', '인천광역시': '인천',
    '전남광주통합특별시': '전남·광주', '대전광역시': '대전', '울산광역시': '울산',
    '세종특별자치시': '세종', '경기도': '경기', '강원도': '강원', '충청북도': '충북',
    '충청남도': '충남', '전라북도': '전북', '경상북도': '경북', '경상남도': '경남',
    '제주특별자치도': '제주'
  };
  return labels[province] || province;
}

function buildSubjectDetailUrl(config, province, city, town){
  const params = new URLSearchParams({ province, city });
  if(town) params.set('town', town);
  return `${config.detailPage}?${params.toString()}`;
}

function getSubjectSubRegions(province, city){
  return ((window.subRegionsData || {})[province] || {})[city] || [];
}

function flattenSubjectRegions(data, config){
  const rows = [];
  data.forEach((region) => {
    region.cities.forEach((city) => {
      rows.push({
        province: region.province,
        city,
        town: '',
        keyword: `${region.province} ${getSubjectProvinceLabel(region.province)} ${city}`.toLowerCase(),
        href: buildSubjectDetailUrl(config, region.province, city, '')
      });
      getSubjectSubRegions(region.province, city).forEach((town) => {
        rows.push({
          province: region.province,
          city,
          town,
          keyword: `${region.province} ${getSubjectProvinceLabel(region.province)} ${city} ${town}`.toLowerCase(),
          href: buildSubjectDetailUrl(config, region.province, city, town)
        });
      });
    });
  });
  return rows;
}

function showSubjectRegionError(config){
  const helpText = document.getElementById(config.helpTextId);
  if(helpText) helpText.textContent = '지역 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
}

function initSubjectRegionsUI(data, config){
  const provinceGrid = document.getElementById(config.provinceGridId);
  const cityGrid = document.getElementById(config.cityGridId);
  const searchInput = document.getElementById(config.searchInputId);
  const searchResults = document.getElementById(config.searchResultsId);
  const helpText = document.getElementById(config.helpTextId);
  if(!provinceGrid || !cityGrid || !searchInput || !searchResults || !helpText) return;

  const rows = flattenSubjectRegions(data, config);
  let activeProvince = data[0] ? data[0].province : '';

  function renderProvinceChips(){
    provinceGrid.innerHTML = '';
    data.forEach((region) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'province-chip';
      if(region.province === activeProvince) button.classList.add('province-chip--active');
      button.textContent = getSubjectProvinceLabel(region.province);
      button.addEventListener('click', () => {
        activeProvince = region.province;
        searchInput.value = '';
        searchResults.innerHTML = '';
        renderProvinceChips();
        renderCityChips();
      });
      provinceGrid.appendChild(button);
    });
  }

  function renderCityChips(){
    cityGrid.innerHTML = '';
    const selected = data.find((region) => region.province === activeProvince);
    if(!selected) return;
    helpText.textContent = `${getSubjectProvinceLabel(selected.province)} 지역 시·군·구를 선택하면 ${config.subject} 과외 상담 페이지로 이동합니다.`;
    selected.cities.forEach((city) => {
      const link = document.createElement('a');
      link.className = 'city-chip';
      link.href = buildSubjectDetailUrl(config, selected.province, city, '');
      link.textContent = city;
      cityGrid.appendChild(link);
    });
  }

  function renderSearchResults(items){
    if(items.length === 0){
      searchResults.innerHTML = '<p class="region-result-empty">검색 결과가 없습니다. 시·도, 시·군·구 또는 동읍면 이름을 입력해 주세요.</p>';
      return;
    }
    const list = document.createElement('div');
    list.className = 'region-result-list';
    items.slice(0, 9).forEach((item) => {
      const link = document.createElement('a');
      link.className = 'region-result-item';
      link.href = item.href;
      link.innerHTML = `<strong>${item.town || item.city}</strong><span>${item.province} ${item.city}${item.town ? ` · ${item.town}` : ''}</span>`;
      list.appendChild(link);
    });
    searchResults.replaceChildren(list);
  }

  let searchTimer;
  searchInput.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      const query = searchInput.value.trim().toLowerCase();
      if(!query){
        searchResults.innerHTML = '';
        return;
      }
      renderSearchResults(rows.filter((row) => row.keyword.includes(query)));
    }, 120);
  });

  searchInput.addEventListener('keydown', (event) => {
    if(event.key !== 'Enter') return;
    const query = searchInput.value.trim().toLowerCase();
    const match = rows.find((row) => row.keyword.includes(query));
    if(match) window.location.href = match.href;
  });

  renderProvinceChips();
  renderCityChips();
}

async function loadSubjectRegions(){
  const config = getSubjectConfig();
  const cached = readCachedSubjectRegions();
  if(cached && cached.length > 0) initSubjectRegionsUI(cached, config);

  try{
    const response = await fetch('data/regions.json', { cache: 'force-cache' });
    const data = response.ok ? await response.json() : null;
    if(!Array.isArray(data) || data.length === 0) throw new Error('regions.json was empty');
    writeCachedSubjectRegions(data);
    if(!cached || cached.length === 0) initSubjectRegionsUI(data, config);
  }catch(e){
    console.warn(`Failed to load regions.json for ${config.subject} tutoring page`, e);
    if(!cached || cached.length === 0) showSubjectRegionError(config);
  }
}

document.addEventListener('DOMContentLoaded', loadSubjectRegions);
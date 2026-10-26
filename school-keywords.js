// 지역 페이지 본문에 들어가는 중·고등학교 키워드 섹션. 학교 목록은 schools-data.js(window.schoolsData)를 사용합니다.

function getRegionSchools(province, city){
  const root = window.schoolsData || {};
  return root[`${province}|${city}`] || {middle: [], high: []};
}

function buildSchoolHint(schools){
  return schools.high.slice(0, 3).join('·');
}

// subject: '국어'처럼 과목명(없으면 전과목). notes: {high, middle}로 학교급별 안내 문장을,
// notes.examText로 제목의 '내신 ' 부분을 바꿀 수 있습니다.
function buildSchoolKeywordsHtml(city, schools, subject = '', notes = {}){
  const subjectText = subject ? `${subject} ` : '';
  const examText = notes.examText ?? '내신 ';
  const defaultNote = `학생의 학교별 ${subjectText}내신 시험 범위와 출제 경향에 맞춘 1:1 ${subjectText}과외 상담이 가능합니다.`;
  const renderGroup = (label, names, note) => names.length
    ? `<h3 style="margin-top:1rem">${city} ${label} ${subjectText}${examText}과외</h3>
      <p style="color:var(--muted)">${names.join(', ')} ${note || defaultNote}</p>`
    : '';
  const high = renderGroup('고등학교', schools.high, notes.high);
  const middle = renderGroup('중학교', schools.middle, notes.middle);
  if(!high && !middle) return '';
  return `<h2 style="margin-top:1.2rem">${city} 중·고등학교 ${subjectText}${examText ? `${examText}대비 ` : ''}과외</h2>${high}${middle}`;
}

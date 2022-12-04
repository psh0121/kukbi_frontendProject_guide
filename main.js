(() => {
    
  let yOffset = 0;                // 스크롤 위치값
  let currentSection = 0;         // 현재 섹션 번호

  // section 정보 집합
  const sectionSet = [
      // section-0의 정보들 - 높이, 배수, 엘리먼트정보
      {
          height : 0,
          hMultiple : 5,
          objs : {
              container : document.querySelector('#section-0')
          }
      },
      // section-1의 정보들
      {
          height : 0,
          hMultiple : 2,
          objs : {
              container : document.querySelector('#section-1')
          }
      }
  ];

////////////////////////////////////////////////////////
// 일반함수

// Element의 크기, 위치등을 설정
const setLayout = function()
{
  // section-0과 section-1의 높이를 설정한다.
  for(let i = 0; i < sectionSet.length; i++)
  {
      sectionSet[i].height = window.innerHeight * sectionSet[i].hMultiple;
      sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`;
  }

}

const getCurrentSection = function()
{
  let section = 0;

  let segment = [
      sectionSet[0].height,
      sectionSet[0].height + sectionSet[1].height
  ];

  if(yOffset <= segment[0])
  {
      section = 0;
  }
  else if((yOffset > segment[0]) &&
          (yOffset <= segment[1]))
  {
      section = 1;
  }
  else 
  {
  }
  return section;
}

const setBodyID = function(section)
{
  document.body.setAttribute('id', `show-section${section}`);
}

////////////////////////////////////////////////////////
// 이벤트 핸들러

  // 스크롤은 system이기 때문에 상위 window에 이벤트추가
  window.addEventListener('scroll', () => {
      yOffset = window.scrollY;

      // 현재 섹션값을 가지고 온 뒤 body 아이디 설정
      currentSection = getCurrentSection();       // 스크롤할때마다 섹션위치를 업데이트
      setBodyID(currentSection);  // currentSection을 통해 받아온 섹션 위치를 통해 body의 id값 새로고침
  });

  // load : 모든 작업이 끝났다.
  window.addEventListener('load', () => {
      // 섹션에 대한 높이를 설정한다.
      setLayout();
  })
})();
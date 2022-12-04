(() => {
    
  let yOffset = 0;

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
          hMultiple : 5,
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
      console.log('클라이언트 창 높이 : ' + window.innerHeight);
      console.log(i + '번째 섹션 높이 : ' + sectionSet[i].height);
      sectionSet[i].objs.container.style.height = `${sectionSet[0].height}px`;
  }

}

////////////////////////////////////////////////////////
// 이벤트 핸들러

  // 스크롤은 system이기 때문에 상위 window에 이벤트추가
  window.addEventListener('scroll', () => {
      yOffset = window.scrollY;

      console.log(yOffset);
  });

  // load : 모든 작업이 끝났다.
  window.addEventListener('load', () => {
      // section-0하고 section-1하고의 높이를 설정한다.
      setLayout();
  })





})();
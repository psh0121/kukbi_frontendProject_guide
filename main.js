(() => {
    
  let yOffset = 0;                // 스크롤 위치값
  let currentSection = 0;         // 현재 섹션 번호
  let sectionYOffset = 0;

  // section 정보 집합
  const sectionSet = [
      // section-0의 정보들 - 높이, 배수, 엘리먼트정보
      {
          height : 0,
          hMultiple : 5,
          objs : {
              container : document.querySelector('#section-0'),
              messageA : document.querySelector('.section0-message.a'),
              messageB : document.querySelector('.section0-message.b'),
              messageC : document.querySelector('.section0-message.c'),
              messageD : document.querySelector('.section0-message.d'),
          },
          vals : {
              messageA_opacity_out : [0, 1, {start: 0.05, end: 0.14}],
              messageA_opacity_in : [1, 0, {start:0.15, end: 0.24}],
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

// 현재 섹션의 위에 있는 섹션의 높이 합.
const getPrevSectionHeight = function()
{
  // 현재 섹션이 0 ==> 0
  // 현재 섹션 1 ==> section0의 높이
  // 현재 섹션 2 ==> section0의 높이 + section1의 높이
  let prevHeight = 0;

  for(let i = 0; i < currentSection; i++)
  {
      prevHeight = prevHeight + sectionSet[i].height;
  }

  return prevHeight;
}

// messageA_opacity_out : [0, 1, {start: 0.05, end: 0.14}]
const calcValue = function(values)
{
  let result = 0;
  let rate = 0;
  const height = sectionSet[currentSection].height;

  let partStart;  // start 스크롤값
  let partEnd;    // end 스크롤값 
  let partHeihgt; // end - start

  if(values.length === 2)
  {
      // 1. 스크롤 비율을 구한다.
      rate = sectionYOffset / height;

       // 2. 비율에 따른 실제 적용한 CSS값을 계산한다.
      result = (rate * (values[1] - values[0])) + values[0];
  }

  else if(values.length === 3)
  {
      // step01) 모든 값들을 비율이 아닌 실제화 한다.
      partStart =  values[2].start * height;  
      partEnd = values[2].end * height;
      partHeihgt = partEnd - partStart;

      // 설정한 범위값을 벗어난 값을 0또는 1로 설정해준다.
      if(sectionYOffset < partStart)
      {
          result = values[0];
      }
      else if(sectionYOffset > partEnd)
      {
          result = values[1];
      }
      else
      {
          // step02) sectionYOffset에서 partStart값을 빼내어 실제 범위내의 크기를 구하고
          // 범위간의 비율을 구한다.
          rate = (sectionYOffset - partStart) / partHeihgt;

          // step03) 값을 css화 하여 result안에 넣어준다.
          result = (rate * (values[1] - values[0])) + values[0];
      }
  }

  return result;
}

const playAnimation = function()
{
  let value;

  let scrollRate = sectionYOffset / sectionSet[currentSection].height;
  let objects = sectionSet[currentSection].objs;

  switch(currentSection)
  {
      case 0:
          
          if(scrollRate <= 0.25)
          {
              if(scrollRate <= sectionSet[currentSection].vals.messageA_opacity_out[2].end)
              {
                  value = calcValue(sectionSet[currentSection].vals.messageA_opacity_out);
              }
              else if(scrollRate > sectionSet[currentSection].vals.messageA_opacity_out[2].end)
              {
                  value = calcValue(sectionSet[currentSection].vals.messageA_opacity_in);
              }
              console.log('message A를 애니메이션');
          }
          else if((scrollRate > 0.25) && (scrollRate <= 0.5))
          {
              value = calcValue(sectionSet[currentSection].vals);    
              console.log('message B를 애니메이션');
          }
          else if((scrollRate > 0.5) && (scrollRate <= 0.75))
          {
              value = calcValue(sectionSet[currentSection].vals);    
              console.log('message C를 애니메이션');
          }
          else if((scrollRate > 0.75) && (scrollRate <= 1))
          {
              value = calcValue(sectionSet[currentSection].vals);    
              console.log('message D를 애니메이션');
          }

          // 1. messageA의 엘리먼트를 가지고 온다. --> 무한반복 우려 위에서한다.

          break;
      
      case 1:
          // 2. 스크롤 값에 따라 적용해야할 CSS값을 계산한다.
          // 3. 계산된 결과를 적용한다.
          break;
      
      default:
          break;
      
      
  }

  objects.messageA.style.opacity = value;
}

////////////////////////////////////////////////////////
// 이벤트 핸들러

  // 스크롤은 system이기 때문에 상위 window에 이벤트추가
  window.addEventListener('scroll', () => {
      yOffset = window.scrollY;

      // 현재 섹션값 및 섹션내에서의 yoffset값을 구한다.
      currentSection = getCurrentSection();       // 스크롤할때마다 섹션위치를 업데이트
      sectionYOffset = yOffset - getPrevSectionHeight();


      setBodyID(currentSection);  // currentSection을 통해 받아온 섹션 위치를 통해 body의 id값 새로고침

      playAnimation();
  });

  // load : 모든 작업이 끝났다.
  window.addEventListener('load', () => {
      // 섹션에 대한 높이를 설정한다.
      setLayout();
  })



})();
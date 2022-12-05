(() => {
    
    let yOffset = 0;                // 스크롤 위치값
    let currentSection = 0;         // 현재 섹션 번호
    
    // 필요한 이유 - yOffset이라는값을 가지고 각 섹션에 대한 비율을 계산하는데 어려움
    // 섹션의 비율값에 따른 CSS값을 편하게 계산하기 위해서 sectionYOffset을 만들었다.
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
            // vals : message에 대한 투명도와 translateY에 대한 정보값
            vals : {
                messageA_opacity_out : [0, 1, {start: 0.05, end: 0.14}],
                messageA_opacity_in : [1, 0, {start:0.15, end: 0.24}],
                messageA_translateY_out : [0, -40, {start: 0.05, end: 0.14}],
                messageA_translateY_in : [-40, -80, {start:0.15, end: 0.24}],

                messageB_opacity_out : [0, 1, {start: 0.25, end: 0.34}],
                messageB_opacity_in : [1, 0, {start:0.35, end: 0.44}],
                messageB_translateY_out : [0, -40, {start: 0.25, end: 0.34}],
                messageB_translateY_in : [-40, -80, {start:0.35, end: 0.44}],

                messageC_opacity_out : [0, 1, {start: 0.45, end: 0.54}],
                messageC_opacity_in : [1, 0, {start:0.55, end: 0.64}],
                messageC_translateY_out : [0, -40, {start: 0.45, end: 0.54}],
                messageC_translateY_in : [-40, -80, {start:0.55, end: 0.64}],

                messageD_opacity_out : [0, 1, {start: 0.65, end: 0.74}],
                messageD_opacity_in : [1, 0, {start:0.75, end: 0.84}],
                messageD_translateY_out : [0, -40, {start: 0.65, end: 0.74}],
                messageD_translateY_in : [-40, -80, {start:0.75, end: 0.84}]
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
        // -- 시작위치의 실제 스크롤값
        partStart =  values[2].start * height;  

        // -- 끝나는 위치의 실제 스크롤값
        partEnd = values[2].end * height;

        // -- 실제 높이값
        partHeihgt = partEnd - partStart;

        // 설정한 범위값을 벗어난 값을 0또는 1로 설정해준다.
        //-- 스크롤 값이 시작위치 이전인 경우 values[0]을 확장해서 적용
        if(sectionYOffset < partStart)
        {
            result = values[0];
        }
        //-- 스크롤 값이 끝나는값 이후인 경우 values[1]을 확장해서 적용
        else if(sectionYOffset > partEnd)
        {
            result = values[1];
        }
        else
        {
            // step02) sectionYOffset에서 partStart값을 빼내어 실제 범위내의 크기를 구하고
            // -- 비율을 구한다. 부분영역에서 얼마큼 진행했는지 비율을 구한다.
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
    let values = sectionSet[currentSection].vals;

    switch(currentSection)
    {
        case 0:
            // message에 대한 투명도 값 초기화
            objects.messageA.style.opacity = 0;
            objects.messageB.style.opacity = 0;
            objects.messageC.style.opacity = 0;
            objects.messageD.style.opacity = 0;
            
            if(scrollRate < 0.15)   // messageA_out
            {
                value = calcValue(values.messageA_opacity_out);
                objects.messageA.style.opacity = value;

                value = calcValue(values.messageA_translateY_out);
                objects.messageA.style.transform = `translateY(${value}%)`;

            }
            else if((scrollRate >= 0.15) && (scrollRate < 0.25))    // messageA_in
            {
                value = calcValue(values.messageA_opacity_in);
                objects.messageA.style.opacity = value;

                value = calcValue(values.messageA_translateY_in);
                objects.messageA.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.25) && (scrollRate < 0.35))    // messageB_out
            {
                value = calcValue(values.messageB_opacity_out);
                objects.messageB.style.opacity = value;

                value = calcValue(values.messageB_translateY_out);
                objects.messageB.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.35) && (scrollRate < 0.45))    // messageB_in
            {
                value = calcValue(values.messageB_opacity_in);
                objects.messageB.style.opacity = value;

                value = calcValue(values.messageB_translateY_in);
                objects.messageB.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.45) && (scrollRate < 0.55))    // messageC_out
            {
                value = calcValue(values.messageC_opacity_out);
                objects.messageC.style.opacity = value;

                value = calcValue(values.messageC_translateY_out);
                objects.messageC.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.55) && (scrollRate < 0.65))    // messageC_in
            {
                value = calcValue(values.messageC_opacity_in);
                objects.messageC.style.opacity = value;

                value = calcValue(values.messageC_translateY_in);
                objects.messageC.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.65) && (scrollRate < 0.75))    // messageD_out
            {
                value = calcValue(values.messageD_opacity_out);
                objects.messageD.style.opacity = value;

                value = calcValue(values.messageD_translateY_out);
                objects.messageD.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.75) && (scrollRate < 0.85))    // messageD_in
            {
                value = calcValue(values.messageD_opacity_in);
                objects.messageD.style.opacity = value;

                value = calcValue(values.messageD_translateY_in);
                objects.messageD.style.transform = `translateY(${value}%)`;
            }
            else
            {
                objects.messageA.style.opacity = 0;
                objects.messageB.style.opacity = 0;
                objects.messageC.style.opacity = 0;
                objects.messageD.style.opacity = 0;

                objects.messageA.style.transform = 'translateY(0%)';
                objects.messageB.style.transform = 'translateY(0%)';
                objects.messageC.style.transform = 'translateY(0%)';
                objects.messageD.style.transform = 'translateY(0%)';
            }

            break;
        
        case 1:
            
            break;
        
        default:
            break;
        
        
    }
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
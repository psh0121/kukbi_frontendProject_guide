(() => {
    
    let yOffset = 0;                // yOffset : 스크롤 위치값
    let currentSection = 0;         // currentSection : 현재 섹션 번호
    
    let sectionYOffset = 0;         // sectionYOffset : 섹션 위치에 따른 yOffset의 상대값
    /*
    sectionYOffset의 필요성
    - yOffset이라는 값을 가지고 각 섹션에 대한 비율을 계산하는데에 어려움이 있다.
    - 섹션의 비율값에 따른 CSS값을 편하게 계산하기 위해서 sectionYOffset이 필요하다.
    */
    
    // sectionSet = section에 대한 정보 집합
    const sectionSet = [
        // section-0의 정보
        {
            height : 0,         // 높이
            hMultiple : 5,      // 높이 설정 배수
            objs : {            // 엘리먼트 정보, graphic context
                container : document.querySelector('#section-0'),
                messageA : document.querySelector('.section0-message.a'),
                messageB : document.querySelector('.section0-message.b'),
                messageC : document.querySelector('.section0-message.c'),
                messageD : document.querySelector('.section0-message.d'),
                canvas : document.querySelector('#main-canvas'),
                context : document.querySelector('#main-canvas').getContext('2d'),
                canvasImages : []
            },
            vals : {            // message에 대한 투명도 설정값, translateY 설정값, canvas 설정값
                imageCount : 500,
                imageSequence : [0, 499],

                canvas_opacity_in : [1, 0, {start: 0.75, end: 0.95}],

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
        // section-1의 정보
        {
            height : 0,         // 높이
            hMultiple : 3,      // 높이 설정 배수
            objs : {            // 엘리먼트 정보
                container : document.querySelector('#section-1')
            }
        }
    ];

////////////////////////////////////////////////////////
// 일반함수

// setLayout = 섹션(Element)의 크기, 위치등을 설정해 준다.
const setLayout = function()
{
    // 윈도우 창의 크기가 작은 경우 --> 섹션창의 각 크기를 세그먼트 값으로 설정해준다.
    if(window.innerHeight < 500)
    {
        sectionSet[0].height = 3000;
        sectionSet[1].height = 3000;

        sectionSet[0].objs.container.style.height = `${sectionSet[0].height}px`;
        sectionSet[1].objs.container.style.height = `${sectionSet[1].height}px`;
    }

    // 윈도우 창의 크기가 적절할 경우 --> 각 섹션의 크기를 미리지정한 배수에 맞춰 크기를 설정해준다.
    else
    {
        for(let i = 0; i < sectionSet.length; i++)
        {
            // section[i]의 height = 현재창의 크기 * 배수
            sectionSet[i].height = window.innerHeight * sectionSet[i].hMultiple;
            sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`;
        }
    }
}

// getCurrentSection = 현재 섹션위치
const getCurrentSection = function()
{
    let section = 0;

    // segment = section-0과 section-1의 height절대값들의 배열
    let segment = [
        sectionSet[0].height,
        sectionSet[0].height + sectionSet[1].height
    ];

    // 만약 scroll Y의 위치값이 section-0 안에 포함된다면 --> section-0
    if(yOffset <= segment[0])
    {
        section = 0;
    }

    // 만약 scroll Y의 위치값이 section-0을 벗어나고
    // section-1 안에 있다면 --> section-1
    else if((yOffset > segment[0]) && (yOffset <= segment[1]))
    {
        section = 1;
    }
    else 
    {
        // 이후의 추가섹션에 대한 여지공간
    }

    return section;
}

// setBodyID = 현재섹션 위치를 기반으로 body엘리먼트의 id속성값 업데이트
// --> 섹션영역에 따라 특정 엘리먼트를 보이고 안보이고를 할 수 있다.
const setBodyID = function(section)
{
    document.body.setAttribute('id', `show-section${section}`);
}

// getPrevSectionHeight = 현재 위치의 섹션 이전 섹션까지의 높이 합
const getPrevSectionHeight = function()
{
    /*
    currentSection is...
    0 ==> 0
    1 ==> section-0 height
    2 ==> (section-0 height) + (section-1 height)
    */
    let prevHeight = 0;

    // currentSection 이전 섹션까지 높이 값을 더해준다.
    for(let i = 0; i < currentSection; i++)
    {
        prevHeight = prevHeight + sectionSet[i].height;
    }

    return prevHeight;
}

// calcValue = 비율에 따른 실제적용할 CSS값 계산
// ex) messageA_opacity_out : [0, 1, {start: 0.05, end: 0.14}]
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
        // rate = 스크롤의 비율을 구한다.
        rate = sectionYOffset / height;

         // 비율에 따른 실제 적용할 CSS값을 계산한다.
        result = (rate * (values[1] - values[0])) + values[0];
    }

    else if(values.length === 3)
    {
        // 모든 값들을 비율이 아닌 실제화 한다.

        // partStart = 시작위치의 실제 스크롤값
        partStart =  values[2].start * height;  

        // partEnd = 끝나는 위치의 실제 스크롤값
        partEnd = values[2].end * height;

        // partHeight = 실제 높이값
        partHeihgt = partEnd - partStart;

        // 범위에 벗어난 값을 스무스하게 처리해주기 위해서 값을 시작값이나 끝값으로 처리해준다.

        // 만약 스크롤 값이 시작위치 이전인 경우 --> values[0]을 확장해서 적용
        if(sectionYOffset < partStart)
        {
            result = values[0];
        }

        // 만약 스크롤 값이 끝나는값 이후인 경우 --> values[1]을 확장해서 적용
        else if(sectionYOffset > partEnd)
        {
            result = values[1];
        }

        // 제대로 범위내에 위치한 경우 --> 비율계산후 CSS값 넣기
        else
        {
            // sectionYOffset에서 partStart값을 빼내어 실제 범위내의 크기를 구하고 비율 계산한다.
            // 부분영역에서 얼마큼 진행했는지에 대한 비율을 구한다.
            rate = (sectionYOffset - partStart) / partHeihgt;

            // 값을 css화 하여 result안에 넣어준다.
            result = (rate * (values[1] - values[0])) + values[0];
        }
    }

    return result;
}

// playAnimation = CSS에 따른 애니메이션 동작
const playAnimation = function()
{
    let value;

    // scrollRate = 현재 스크롤 위치에 따른 스크롤 비율
    let scrollRate = sectionYOffset / sectionSet[currentSection].height;

    let objects = sectionSet[currentSection].objs;
    let values = sectionSet[currentSection].vals;

    // imageIndex = 캔버스 화면에 그려줄때 사용할 이미지 인덱스값
    let imageIndex = 0;

    // 현재섹션 위치에따른 애니메이션 설정
    switch(currentSection)
    {
        case 0:
            // 처음 화면이 시작했을때의 첫화면 설정
            imageIndex = Math.floor(calcValue(values.imageSequence));
            objects.context.drawImage(objects.canvasImages[imageIndex], 0, 0);

            // message에 대한 투명도 값 초기화
            objects.messageA.style.opacity = 0;
            objects.messageB.style.opacity = 0;
            objects.messageC.style.opacity = 0;
            objects.messageD.style.opacity = 0;
            
            // section-0안에서의 특정 비율안에 해당될 때의 message애니메이션 효과 적용
            if(scrollRate < 0.15)   // messageA_out
            {
                // 투명도 설정 및 적용
                value = calcValue(values.messageA_opacity_out);
                objects.messageA.style.opacity = value;

                // Y위치값 설정 및 적용
                value = calcValue(values.messageA_translateY_out);
                objects.messageA.style.transform = `translateY(${value}%)`;

            }
            else if((scrollRate >= 0.15) && (scrollRate < 0.25))    // messageA_in
            {
                // 투명도 설정 및 적용
                value = calcValue(values.messageA_opacity_in);
                objects.messageA.style.opacity = value;

                // Y위치값 설정 및 적용
                value = calcValue(values.messageA_translateY_in);
                objects.messageA.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.25) && (scrollRate < 0.35))    // messageB_out
            {
                // 투명도 설정 및 적용
                value = calcValue(values.messageB_opacity_out);
                objects.messageB.style.opacity = value;

                // Y위치값 설정 및 적용
                value = calcValue(values.messageB_translateY_out);
                objects.messageB.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.35) && (scrollRate < 0.45))    // messageB_in
            {
                // 투명도 설정 및 적용
                value = calcValue(values.messageB_opacity_in);
                objects.messageB.style.opacity = value;

                // Y위치값 설정 및 적용
                value = calcValue(values.messageB_translateY_in);
                objects.messageB.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.45) && (scrollRate < 0.55))    // messageC_out
            {
                // 투명도 설정 및 적용
                value = calcValue(values.messageC_opacity_out);
                objects.messageC.style.opacity = value;

                // Y위치값 설정 및 적용
                value = calcValue(values.messageC_translateY_out);
                objects.messageC.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.55) && (scrollRate < 0.65))    // messageC_in
            {
                // 투명도 설정 및 적용
                value = calcValue(values.messageC_opacity_in);
                objects.messageC.style.opacity = value;

                // Y위치값 설정 및 적용
                value = calcValue(values.messageC_translateY_in);
                objects.messageC.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.65) && (scrollRate < 0.75))    // messageD_out
            {
                // 투명도 설정 및 적용
                value = calcValue(values.messageD_opacity_out);
                objects.messageD.style.opacity = value;

                // Y위치값 설정 및 적용
                value = calcValue(values.messageD_translateY_out);
                objects.messageD.style.transform = `translateY(${value}%)`;
            }
            else if((scrollRate >= 0.75) && (scrollRate < 0.85))    // messageD_in
            {
                // 투명도 설정 및 적용
                value = calcValue(values.messageD_opacity_in);
                objects.messageD.style.opacity = value;

                // Y위치값 설정 및 적용
                value = calcValue(values.messageD_translateY_in);
                objects.messageD.style.transform = `translateY(${value}%)`;
            }
            else
            {
                // message 투명도, 위치 초기화
                objects.messageA.style.opacity = 0;
                objects.messageB.style.opacity = 0;
                objects.messageC.style.opacity = 0;
                objects.messageD.style.opacity = 0;

                objects.messageA.style.transform = 'translateY(0%)';
                objects.messageB.style.transform = 'translateY(0%)';
                objects.messageC.style.transform = 'translateY(0%)';
                objects.messageD.style.transform = 'translateY(0%)';
            }

            // 범위내의 영역에서 이미지에 애니메이션효과 적용
            if((scrollRate > 0.74) && (scrollRate < 0.96))
            {
                // 이미지 투명도 설정 및 적용
                objects.canvas.style.opacity = calcValue(values.canvas_opacity_in);   
            }

            break;
        
        case 1:
            
            break;
        
        default:
            break;
        
        
    }
}

// setCanvas = 모든 이미지를 로딩하고 0번째 이미지를 캔버스에 출력한다.
const setCanvas = function()
{
    let imageCount = sectionSet[0].vals.imageCount;
    let canvasImages = sectionSet[0].objs.canvasImages;
    let imageElement;
    
    // 파일을 로딩한다.
    for(let i = 0; i < imageCount; i++)
    {
        imageElement = new Image();
        imageElement.src = `./image/apple_${i}.png`;

        // 로딩한 파일을 배열에 넣어준다.
        canvasImages.push(imageElement);
    }

    // load 이벤트 발생!!!
    imageElement.addEventListener('load', () => {
        // 캔버스에 0번째 이미지를 드로잉한다.
        sectionSet[0].objs.context.drawImage(canvasImages[0], 0, 0);
    })
}

// setLocalnavMenu = 스크롤값이 localnav를 넘어감에 따라 localnav의 position fixed로 변경
// --> class를 붙여주거나 떼어줌으로써 position값을 변경할 수 있다.
const setLocalnavMenu = function()
{
    // yOffset값이 localnav크기를 넘어갔다면 --> 클래스 추가 (position fixed)
    if(yOffset > 44)
    {
        document.body.classList.add('local-nav-sticky');
    }

    // yOffset값이 localnav크기를 넘어가지 않았다면 --> 클래스 삭제 (position absolute)
    else
    {
        document.body.classList.remove('local-nav-sticky');
    }
}

////////////////////////////////////////////////////////
// 이벤트 핸들러

    // scroll 이벤트 발생!!!
    // --> scroll은 system이기 때문에 가장 상위에 이벤트를 추가해준다.
    window.addEventListener('scroll', () => {

        // yOffset = 현재 얼마나 스크롤이 되었는가
        yOffset = window.scrollY;

        // currentSection = 현재 섹션위치
        // sectionYOffset = 섹션에 따른 yOffset의 상대값
        currentSection = getCurrentSection();
        sectionYOffset = yOffset - getPrevSectionHeight();

        // setBodyID(currentSection) : 현재섹션 위치를 기반으로 body엘리먼트 id값 새로고침
        setBodyID(currentSection);

        // setLocalnavMenu() : 상단의 nav를 yOffset값에 의한 고정 유무를 설정
        setLocalnavMenu();

        // playAnimation() : CSS에 따른 애니메이션 동작
        playAnimation();
    });

    // load 이벤트 발생!!!
    // --> load는 전체페이지가 로드된 이후에 이벤트가 발생된다.
    window.addEventListener('load', () => {
        
        // setLayout() : 섹션에 대한 높이를 설정해 준다.
        setLayout();

        // currentSection = 현재 섹션위치
        // sectionYOffset = 섹션에 따른 yOffset의 상대값
        currentSection = getCurrentSection();
        sectionYOffset = yOffset - getPrevSectionHeight();

        // setCanvas() : 모든 이미지를 로딩하고 0번째 이미지를 캔버스에 출력
        setCanvas();

        // setBodyID(currentSection) : 현재섹션 위치를 기반으로 body엘리먼트 id값 새로고침
        setBodyID(currentSection);

        // setLocalnavMenu() : 상단의 nav를 yOffset값에 의한 고정 유무를 설정
        setLocalnavMenu();

    })

    // 사이즈를 재설정 해주었을 때 값들을 일부 다시 수정해주어야 한다.
    window.addEventListener("resize", () => {
        
        // setLayout() : 섹션에 대한 높이를 설정해 준다.
        setLayout();

        // currentSection = 현재 섹션위치
        // sectionYOffset = 섹션에 따른 yOffset의 상대값
        currentSection = getCurrentSection();
        sectionYOffset = yOffset - getPrevSectionHeight();

        // setBodyID(currentSection) : 현재섹션 위치를 기반으로 body엘리먼트 id값 새로고침
        setBodyID(currentSection);

        // setLocalnavMenu() : 상단의 nav를 yOffset값에 의한 고정 유무를 설정
        setLocalnavMenu();

    })

})();
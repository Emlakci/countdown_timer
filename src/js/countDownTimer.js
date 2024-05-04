
export class CountDownTimer
{
    constructor(width, groundColor, indicatorColor, indicatorWarningColor, indicatorDivColor, digitsColor, digitsStopColor, parentElementID, time=[0,0,0], warningTime=[0,0,0])
    {
        this.ground_width = width;
        this.ground_color = groundColor;
        this.indicator_color = indicatorColor;
        this.indicator_warning_color = indicatorWarningColor;
        this.middle_circle_color = indicatorDivColor;
        this.digits_color = digitsColor;
        this.digits_stop_color = digitsStopColor;
        this.indicator_bar_gap = this.ground_width / 15;
        this.setTime = time[0]*3600000 + time[1]*60000 + time[2]*1000; 
        this.startTime = Date.now();
        this.parent_element = document.getElementById(parentElementID);
        this.futureTime = this.startTime + this.setTime;
        this.warning_time = warningTime[0]*3600000 + warningTime[1]*60000 + warningTime[2]*1000;
        this.timerDiv = this.createTimer();
        this.indicators = this.timerDiv.querySelectorAll('.indicator-inner-circle');
        this.startInterval = this.counterStarter();
    }

    createTimer() //+@ function creates timer' elements,  returns an element of timer
    {
        let fragment = document.createDocumentFragment();

        //~ create main circle
        const ground = document.createElement('div');
        ground.setAttribute('id', 'conuntdown-timer-ground');
        ground.style.width = `${this.ground_width}rem`;
        ground.style.aspectRatio = '1/1';
        ground.style.background = this.ground_color;
        ground.style.borderRadius = '100vw';
        ground.style.position = 'relative';
        ground.style.display = 'flex';
        ground.style.justifyContent = 'center';
        ground.style.alignItems = 'center';
        ground.style.overflow = 'hidden';
        ground.style.zIndex = '1';

        //~ create 
        const indicatorDivs = [];

        for(let i=1; i<=3; i++)
        {
            let indicatorDiv = document.createElement('div');
            indicatorDiv.className = 'indicator-inner-circle';
            indicatorDiv.style.width = '50%';
            indicatorDiv.style.height = '100%';
            indicatorDiv.style.position = 'absolute';
            indicatorDiv.style.top = 0;
            indicatorDiv.style.left = 0;
            indicatorDiv.style.transformOrigin = 'right center';

            if(i==1)
            {
                indicatorDiv.style.background = this.indicator_color;
                indicatorDiv.style.zIndex = 2;
            }
            else if(i==2)
            {
                indicatorDiv.style.background = this.indicator_color;
                indicatorDiv.style.zIndex = 3;
            }
            else if(i==3)
            {
                indicatorDiv.style.background = this.ground_color;
                indicatorDiv.style.zIndex = 4;
                indicatorDiv.style.display = 'none';
            };

            indicatorDivs.push(indicatorDiv);
        };

        const innerCircle = document.createElement('div');
        innerCircle.className = 'inner-circle';
        innerCircle.style.width = `${this.ground_width - this.indicator_bar_gap}rem`;
        innerCircle.style.aspectRatio = '1/1';
        innerCircle.style.position = 'relative';
        innerCircle.style.background = this.middle_circle_color;
        innerCircle.style.borderRadius = '100vw';
        innerCircle.style.zIndex = 5;

        const digitsArea = document.createElement('div');
        digitsArea.className = 'timer-container';
        digitsArea.style.width = `${this.ground_width / 1.3}rem`;
        digitsArea.style.height = `${this.ground_width / 2}rem`;
        digitsArea.style.position = 'absolute';
        digitsArea.style.display = 'flex';
        digitsArea.style.justifyContent = 'center'
        digitsArea.style.alignItems = 'center';
        digitsArea.style.padding = `${this.ground_width / 8}rem`
        digitsArea.style.top = '50%';
        digitsArea.style.left = '50%';
        digitsArea.style.transform = 'translate(-50%, -50%)';
        digitsArea.style.zIndex = 6;

        const spans = [];

        for(let i=1; i<=6; i++)
        {
            let timeNumber = document.createElement('span');
            timeNumber.style.width = 'max-content';
            timeNumber.style.height = '100%';
            timeNumber.style.display = 'flex';
            timeNumber.style.alignItems = 'center';
            timeNumber.style.fontSize = `${this.ground_width * 0.1725}rem`;
            timeNumber.style.color = this.digits_color;
            timeNumber.style.textAlign = 'center';
            timeNumber.style.fontWeight = 700;

            if (i==2 || i==4) 
            {
                timeNumber.style.width = '10%';
                timeNumber.style.height = '80%';
                timeNumber.style.alignSelf = 'start';
                timeNumber.textContent = ':'
            };
            if (i==6)
            {
                timeNumber.style.width = '100%';
                timeNumber.style.position = 'absolute';
                timeNumber.textContent = 'time is up!';
                timeNumber.style.textTransform = 'capitalize';
                timeNumber.style.background = this.middle_circle_color;
                timeNumber.style.zIndex = 7;
                timeNumber.style.display = 'none';
            };

            spans.push(timeNumber);
        };

        spans.forEach(item=>{
            digitsArea.appendChild(item);
        });

        innerCircle.appendChild(digitsArea);

        indicatorDivs.forEach(item=>{
            ground.appendChild(item);
        });
        
        ground.appendChild(innerCircle);

        fragment.append(ground);
        // append timer to desired element in HTML.
        this.parent_element.append(fragment);

        return ground;
    };

    countDown() //+@ countdown function, starts the countdown
    {
        const currentTime = Date.now();
        const remainingTime = this.futureTime - currentTime;
        const angle = (remainingTime / this.setTime) * 360;

        //~ progress indicator definings
        if(angle > 180) // when the indicator moves in the left half of the circle 
        {
            this.indicators[2].style.display = 'none';
            this.indicators[0].style.transform = 'rotate(180deg)';
            this.indicators[1].style.transform = `rotate(${angle}deg)`;
        }
        else // when the indicator moves in the right half of the circle both divs move together
        {
            this.indicators[2].style.display = 'block'; // close the this.indicators[1] and make it invisible
            this.indicators[0].style.transform = `rotate(${angle}deg)`;
            this.indicators[1].style.transform = `rotate(${angle}deg)`;
        };

        //~digits displaying remaining time
        const digitsSpans = this.timerDiv.querySelectorAll('span');
        // calculate hours, minutes, seconds and assign them values
        const [hours, minutes, seconds] = this.calculateTime(remainingTime);
        // write assigned values in spans
        this.writeValuesInto(digitsSpans, [0,2,4], [hours,minutes,seconds]);

        //~ warning of little time left
        if(remainingTime <= this.warning_time)
        {
            this.indicators[0].style.background = this.indicator_warning_color;
            this.indicators[1].style.background = this.indicator_warning_color;
            
            digitsSpans.forEach(item=>{
                item.style.color = this.indicator_warning_color;
            });
        };


        //~ ending progrees rule
        if(remainingTime <= 0)
        {
            // stops looping
            clearInterval(this.startInterval);
            // make progress divs invisible
            this.indicators.forEach(item=>{
                item.style.display = 'none';
            });
            // reset timer digits 
            this.writeValuesInto(digitsSpans, [0,2,4], [0,0,0]);
            // reduce the timer digits's text color's opacity  
            digitsSpans.forEach(item=>{
                item.style.color = this.digits_stop_color;
            });
            // make the time is up text visible
            digitsSpans[5].style.display = 'flex';
            digitsSpans[5].style.color = this.indicator_warning_color;
        };
    };
    
    counterStarter() //+@ function returns a intervalID
    {
        //defining loop for countDown function
        const timerLoop = setInterval(this.countDown.bind(this));
        //start countDown function
        this.countDown();
        
        return timerLoop;
    };

    calculateTime(time) //+@ param = value of time in Unix time (in milliseconds); function returns an array includes values in time format
    {
        let hours = Math.floor((time / (1000*60*60)) % 24).toString().padStart(2, '0');
        let minutes = Math.floor((time / (1000*60)) % 60).toString().padStart(2, '0');
        let seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');

        return [hours, minutes, seconds];
    };

    writeValuesInto(elementArray, index=[], values=[]) //+@ params are [array]; it prints the desired values ​​to the elements of the index entered as a parameter of the array.
    {
        for (let i=0; i<index.length; i++)
        {
            elementArray[index[i]].textContent = values[i];
        }
    };
}
const images = [{image: '<i class="fa-solid fa-bowling-ball"></i>', kind: 'bowling-ball' }, {image: '<i class="fa-solid fa-cat"></i>', kind: 'cat'}, { image:'<i class="fa-solid fa-anchor"></i>', kind: 'anchor'}, {image:'<i class="fa-brands fa-android"></i>', kind: 'android'}, {image:'<i class="fa-solid fa-atom"></i>', kind: 'atom'}, {image:'<i class="fa-brands fa-bitcoin"></i>', kind: 'bitcoin'}, {image:'<i class="fa-solid fa-bolt"></i>', kind: 'bolt'}, {image:'<i class="fa-solid fa-brain"></i>', kind: 'brain'}, {image: '<i class="fa-solid fa-bowling-ball"></i>', kind: 'bowling-ball' }, {image: '<i class="fa-solid fa-cat"></i>', kind: 'cat'}, { image:'<i class="fa-solid fa-anchor"></i>', kind: 'anchor'}, {image:'<i class="fa-brands fa-android"></i>', kind: 'android'}, {image:'<i class="fa-solid fa-atom"></i>', kind: 'atom'}, {image:'<i class="fa-brands fa-bitcoin"></i>', kind: 'bitcoin'}, {image:'<i class="fa-solid fa-bolt"></i>', kind: 'bolt'}, {image:'<i class="fa-solid fa-brain"></i>', kind: 'brain'}];

const boxContainer = document.querySelectorAll('.box-container');
const boxes = document.querySelectorAll('.box');
const timerDiv = document.querySelector('.timer');
const resetBtn = document.querySelector('.reset-btn');
const movesAmount = document.querySelector('.moves-title');
const statusB = document.querySelector('.status');
//global variables 
//click count keeps track of clicks and prevents the user from clicking on more than two items
let clickCount = 1;
let firstElement, secondElement, start, FirstParentElement, SecondParentElement;
//processing happens when we compare images 
let processing = false;
//beginTimer prevents multiple timers from occuring. 
let beginTimer = false;
//once timer has ended, we prevent any user input
let timerEnded = false;
//game lifes 
let gameMoves = 10; 
//game duration in seconds 
let gameDuration = 40;
//gloabl intervalID, this controls the game timer 'setinterval'
let intervalID;
let boxBackgroundColor = 'lightseagreen';
let initialPageLoad = false;

boxContainer.forEach((box)=>{
    box.addEventListener('click', (e)=>{
        
        if(processing === false && timerEnded === false){
            if(e.target.classList[0] === 'box-container') return 

                if(beginTimer === false){
                    beginTimer = true;
                    start = Date.now();
                    
                    intervalID = setInterval(gameDelay, 1000);
                }
            if(clickCount === 1 && e.target.classList[1] === undefined){
                applicationStatus();
                FirstParentElement = e.target;
                firstElement = e.target.firstChild;
                console.log(e.target.classList[1]);
                //gsap animation, rotate the box element back ( reveal on first click)
                flipBoxElement(FirstParentElement)
                firstElement.classList.add('active');
                clickCount++;
            }else if(clickCount === 2 && e.target.classList[1] === undefined){
                secondElement = e.target.firstChild;
                if(firstElement.classList[2] === secondElement.classList[2]){
                    console.log('ERROR - same icon was clicked')
                    return
                }
                processing = true;
                SecondParentElement = e.target;
                flipBoxElement(SecondParentElement)
                secondElement.classList.add('active');
                //select all boxes and make all items unclickable 
                setTimeout(locateMatch, 600);
                clickCount = 1;
            }
        
        }
       
    });
});

function gameDelay (){
    const millis = Math.floor((Date.now() - start) / 1000);
    if((gameDuration - millis) >= 10){
        timerDiv.innerText = `00:${gameDuration - millis} Seconds`;
    }else if((gameDuration - millis) < 10){
        timerDiv.innerText = `00:0${gameDuration - millis} Seconds`;
    }
    
    if((gameDuration - millis) === 0){
        timerDiv.innerText = `00:00 Seconds`;
        clearInterval(intervalID);
        timerEnded = true;
        //reveal all the images 
        revealAllImages();
        
        return
    }
}

function locateMatch (){
    if(firstElement.classList[1] === secondElement.classList[1]){
        FirstParentElement.style.border = '.5rem solid white';
        SecondParentElement.style.border = '.5rem solid white';
        FirstParentElement.style.backgroundColor = boxBackgroundColor;
        SecondParentElement.style.backgroundColor = boxBackgroundColor;
        FirstParentElement.classList.add('match');
        SecondParentElement.classList.add('match');
        calculateWin();
        //re-add the green color to the matched items *****************************
    }else{
        gsap.to(FirstParentElement, {transform: 'rotateY(180deg)', duration: .5})
        gsap.to(SecondParentElement, {transform: 'rotateY(180deg)', duration: .5})
        console.log(firstElement.parent);
        console.log(secondElement);
        
        calculateGameMoves();
    }
    revealAllImages();
    processing = false;
}

function revealAllImages(){
    //reveal all images 
        if(gameMoves === 0 || timerEnded === true){
            boxes.forEach((index)=>{
                if(index.classList[1] === undefined){
                    console.log(index);
                    // gsap.to(index, {transform: 'none', duration: .5});
                    // gsap.to(index, {transform: 'rotateY(180deg)', duration: .5});
                    boxes.forEach((box, index)=>{
                        gsap.fromTo(box, {transform: 'rotateY(0deg)'}, {transform: 'rotateY(180deg)', duration: 1.5});
                        gsap.fromTo(box, {transform: 'rotateY(180deg)'}, {transform: 'rotateY(0deg)', duration: 1.5});
                    }, 400 * index);
                    index.style.display = 'flex';
                    index.firstChild.style.backfaceVisibility= 'visible';
                    index.style.border = '6px solid white';
                    index.style.backgroundColor = 'rgb(240, 142, 67)';
                    statusB.innerText = 'Sorry, please try again!';
                }
            });
        }      
}

resetBtn.addEventListener('click', ()=>{
    window.location.reload();    
    // gsap.fromTo(resetBtn, {transform: 'rotateY(0deg)'}, {transform: 'rotateY(180deg)', duration: 1.5});
    // gsap.fromTo(resetBtn, {transform: 'rotateY(180deg)'}, {transform: 'rotateY(0deg)', duration: 1.5});
});

function applicationStatus (){
    if( initialPageLoad === true){
        statusB.innerText = 'Loading Game...';
    }else if(initialPageLoad === false){
        statusB.innerText = 'Ready!';
        if(beginTimer === true){
            statusB.innerText = 'Game Active';
        }
    }
} 

function setRandomImages(){
    let numberArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    boxes.forEach((box, index)=>{
        let randomNumber = Math.floor(Math.random() * numberArray.length );
        box.innerHTML = images[numberArray[randomNumber]].image;
        box.firstChild.classList.add(index);
        numberArray.splice(randomNumber, 1);
    });
}   

// setRandomImages();
firstPageLoad();

function firstPageLoad(){
    
    //random images 
    processing = true;
    
    initialPageLoad = true;
    applicationStatus();
    setRandomImages();
    
    //show those random images 
    boxes.forEach((element)=>{
         element.firstChild.style.display = 'flex';
    });

    setTimeout(()=>{
        boxes.forEach((element, index)=>{

            setTimeout(()=>{
            // gsap.to(element, {transform: 'rotateY(180deg)', duration: 1})
            flipBoxElement(element)
            // element.classList.add('box-back');
                if(index === 15){
                    //settimeout - to make sure boxes are flipped completely before adding 
                    // new random icons or random icons will be visible before the 'flip' 
                    // is complete '300' is barely enough
                    setTimeout(()=>{
                        setRandomImages();
                        boxes.forEach((element)=>{
                            element.firstChild.style.display = 'flex';
                       });
                        initialPageLoad = false;
                        applicationStatus();
                    }, 300); //300
                    processing = false;
                    
                }
            }, 170 * (index)); //170
            console.log('end')
            
        })
        
       
    }, 1250); 
}

function flipBoxElement(element){
    if(element.style.transform === 'rotateY(180deg)'){
        gsap.to(element, {transform: 'none', duration: .5})
    }else{
        gsap.to(element, {transform: 'rotateY(180deg)', duration: .5})
    }
}

function calculateGameMoves(){
    gameMoves--;
    movesAmount.innerText = `Moves: ${gameMoves}`;
    if(gameMoves === 0){
        timerEnded = true;
        revealAllImages();
        clearInterval(intervalID);
        return
    }
}

function calculateWin (){
    let trueCount = 0;
    boxes.forEach((index)=>{
        
        if(index.classList.contains('match')){
            trueCount++;
           
            if (trueCount === 16){
                console.log('user has won the game');
                statusB.innerText = `Congratulations, You've won!`;
                setTimeout(()=>{
                    boxes.forEach((box, index)=>{
                        gsap.fromTo(box, {transform: 'rotateY(0deg)'}, {transform: 'rotateY(180deg)', duration: 2.0});
                        gsap.fromTo(box, {transform: 'rotateY(180deg)'}, {transform: 'rotateY(0deg)', duration: 2.0});
                    }, 100 * index);
                }, 500);
                

                timerEnded = true;
                clearInterval(intervalID);
                return true;
            }//if timer or lifes end then that should indicate the user has lost 
        }
        
    })

}


//if you win, you must stop the time and show some kind of a pop up or something to show that you won! 


    

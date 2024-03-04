/*
1 - create JSON object 
2 - starting markup language
3 - add Dumy data
4 - creating the styling
5 - Fetch number of quetion from json object
6 - show quetion count + question catagory


7 - show the number of bullets depend on question count
8 - set the number of right and wrong answer
9 - create countdown timer
10 - Fetch the questions from json object
11 - show first question
12 - check the answer and hide question then show next one
13 - if the time is end , mark the question as wrong and show the next question
14 - add class on bullet after answering the question
15 - if questions is finished show the result
------------------------
get repositories
*/ 
// select element
let count = document.querySelector(".count span");
let containerSpans = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answer_area = document.querySelector(".answer-area")

let submit = document.querySelector(".submit-button");
let result_area = document.querySelector(".result");
let bullets = document.querySelector(".bullets");
let cancelButton = document.querySelector(".cancel");
let countDownArea = document.querySelector(".count-down")
/////
let currentIndex = 0;
let rganswer = 0;
let countInterval;
////

function getQuestion(){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            let questionObject = JSON.parse(this.responseText);
            let countQuestion = questionObject.length;
            createBullets(countQuestion);
            addData(questionObject[currentIndex], countQuestion);
            // count down
            countDown(countQuestion,5);

            submit.onclick = function(){
                let rightanswer = questionObject[currentIndex].right_answer;
                currentIndex++;
                checkanswer(rightanswer,countQuestion);
                quizArea.innerHTML = "";
                answer_area.innerHTML = "";
                // add data
                addData(questionObject[currentIndex], countQuestion);
                // handel bullets
                handlebullets();
                // count down
                clearInterval(countInterval);
                countDown(countQuestion,5);
                if(currentIndex === countQuestion){
                    showResult(countQuestion);
                    quizArea.remove();
                    answer_area.remove();
                    bullets.remove();
                    submit.remove();
                    cancelButton.remove();
                }
               
            }
            cancelButton.onclick = function(){
                showResult(countQuestion);
                quizArea.remove();
                answer_area.remove();
                bullets.remove();
                submit.remove();
                cancelButton.remove();
            }
        }
    }

    myRequest.open("GET","question_html.json",true);
    myRequest.send();
}
getQuestion();

// create bullets function
function createBullets(num){
    count.innerHTML = num;
    //create bulletes span
    for(let i = 0; i < num; i++){
        let spans = document.createElement("span");
        if(i == 0){
            spans.className = "on"
        }
        containerSpans.appendChild(spans);

    }
}

// Add data to questions container
function addData(obj, cou){
    if(currentIndex < cou){
        let h2 = document.createElement("h2");
        let texth2 = document.createTextNode(obj.title);
        h2.appendChild(texth2);
        quizArea.appendChild(h2);
        for(let i = 1; i <= 4; i++){
            // create main  div
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";
            // append main div
            answer_area.appendChild(mainDiv);
            // create input radio
            let input = document.createElement("input");
            input.type = "radio";
            input.name = "question";
            input.id = `answer_${i}`;
            if(i == 1){
                 input.checked = true;
            }
            input.dataset.answer = obj[`answer_${i}`];
            mainDiv.appendChild(input);
            // create label
            let label = document.createElement("label");
            label.htmlFor = `answer_${i}`;
            label.appendChild(document.createTextNode(obj[`answer_${i}`]));
            // add label to main div
            mainDiv.appendChild(label);
        }    
    }
}
// check answer 

function checkanswer(answerright,count){
    let question_answer = document.getElementsByName("question");
    let choosenright;
    question_answer.forEach((ele)=>{
        if(ele.checked){
            choosenright = ele.dataset.answer;
        }
    });

    if(answerright === choosenright){
        rganswer++;
    }
    
}
// function handle bullets
function handlebullets(){
    let bullets = document.querySelectorAll(".bullets .spans span");
    bullets.forEach((ele,index)=>{
        if(index == currentIndex){
            ele.classList.add("on");
        }
    })
}
// function show result
function showResult(coun){
    let result;
    if(rganswer > coun/2 && rganswer < coun){
        result = `<span class="good">Good</span>, ${rganswer} from ${coun}`;
    }else if(rganswer === coun){
        result = `<span class="perfect">perfect</span>, ${rganswer} from ${coun}`;
    }else {
        result = `<span class="bad">Bad</span>, ${rganswer} from ${coun}`;
    }
    result_area.innerHTML = result;
    result_area.style.padding = "15px";
    result_area.style.backgroundColor = "#fff";
}
// function count down
function countDown(count,duration){
    if(currentIndex < count){
        countInterval = setInterval(()=>{
            let minutes = parseInt(duration / 60);
            let second = parseInt(duration % 60);
            minutes < 10 ?`0${minutes}`:minutes;
            second < 10 ? `0${second}`:second;
            if(--duration < 0){
                clearInterval(countInterval);
                submit.click();
            }
            countDownArea.innerHTML = `${minutes}:${second}`
        },1000)
        
    }
}
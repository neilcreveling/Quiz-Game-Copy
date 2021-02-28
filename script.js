
var timeLeft;
var timeInterval; 
var quizCurrent; 
var answerChoice; 
var finalScore; 
var currentLeaderboard; 
var initials; 


var quizQuestionsAnswers = [
    {
        question: "<h2 data-state='correct'>About how many breeds of cats are there?</h2>",
        answers: [
            "<button type='button' data-value='0' data-state='incorrect'>15</button>",
            "<button type='button' data-value='1' data-state='incorrect'>35</button>",
            "<button type='button' data-value='2' data-state='correct'>70</button>",
            "<button type='button' data-value='3' data-state='incorrect'>100</button>"
        ]
    },
    {
        question: "<h2 data-state='correct'>Are cats the first, second, third, or fourth most popular pet in the U.S.?</h2>",
        answers: [
            "<button type='button' data-value='0' data-state='incorrect'>first</button>",
            "<button type='button' data-value='1' data-state='correct'>second</button>",
            "<button type='button' data-value='2' data-state='incorrect'>third</button>",
            "<button type='button' data-value='3' data-state='incorrect'>fourth</button>"
        ]
    },
    {
        question: "<h2 data-state='correct'>About how many cats are alive on earth?</h2>",
        answers: [
            "<button type='button' data-value='0' data-state='incorrect'>100 - 200 million</button>",
            "<button type='button' data-value='1' data-state='incorrect'>200 - 300 million</button>",
            "<button type='button' data-value='2' data-state='correct'>300 - 400 million</button>",
            "<button type='button' data-value='3' data-state='incorrect'>over 400 million</button>"
        ]
    },
    {
        question: "<h2 data-state='correct'>When were the first instances of domesticated cats?</h2>",
        answers: [
            "<button type='button' data-value='0' data-state='correct'>7,500 BC</button>",
            "<button type='button' data-value='1' data-state='incorrect'>5,000 BC</button>",
            "<button type='button' data-value='2' data-state='incorrect'>2,500 BC</button>",
            "<button type='button' data-value='3' data-state='incorrect'>1,000 BC</button>"
        ]
    },
    {
        question: "<h2 data-state='correct'>How heavy was the heaviest known cat?</h2>",
        answers: [
            "<button type='button' data-value='0' data-state='incorrect'>25 pounds</button>",
            "<button type='button' data-value='1' data-state='incorrect'>40 pounds</button>",
            "<button type='button' data-value='2' data-state='correct'>50 pounds</button>",
            "<button type='button' data-value='3' data-state='incorrect'>65 pounds</button>"
        ]
    }
]


var mainBody = document.querySelector(".main");
var highScoresBtn = document.querySelector(".high-scores");
var timerEl = document.querySelector(".time-left");
var quizQuestionEl = document.querySelector(".quiz-question");
var quizChoiceEl = document.querySelectorAll(".quiz-choice");
var startButtonEl = document.querySelector(".start-button");
var correctIncorrectEl = document.querySelector(".correct-incorrect");

function quizInit(){
    quizCurrent = 0;
    startTimer();
    removeButtons();
    clearQuestionAndChoice();
    buildQuestionAndChoice(quizCurrent);
}

function startTimer(){
    timeLeft = 60;
    timeInterval = setInterval(() => {
        if (timeLeft > 0){
            timeLeft--;
            timerEl.textContent = timeLeft;
        } else {
            clearInterval(timeInterval);
            timerEl.textContent = timeLeft;
            quizEnd();
        }
    }, 1000);
}

function quizEnd(){
    if (timeLeft <= 0){
        finalScore = timeLeft;
        gameOver();
    } else if (quizCurrent === quizQuestionsAnswers.length){
        clearInterval(timeInterval);
        finalScore = timeLeft;
        gameOver();
    }
}

function clearQuestionAndChoice(){
    quizQuestionEl.firstElementChild.remove();
    for (var i = 0; i < quizChoiceEl.length; i++){
        if (quizChoiceEl[i].firstElementChild !== null){
            quizChoiceEl[i].firstElementChild.removeEventListener("click", selectAnswer);
            quizChoiceEl[i].firstElementChild.remove();
        }
    }
}

function buildQuestionAndChoice(questionNum){
    quizQuestionEl.innerHTML = quizQuestionsAnswers[questionNum].question;
    for (var i = 0; i < quizChoiceEl.length; i++){
        quizChoiceEl[i].innerHTML = quizQuestionsAnswers[questionNum].answers[i];
        quizChoiceEl[i].firstElementChild.addEventListener("click", selectAnswer);
    }
}

function removeButtons(){
    if (startButtonEl.firstElementChild !== null){
        for (var i = 0; i <= startButtonEl.childElementCount; i++){
            startButtonEl.firstElementChild.remove();
        }
    }
}

function buildButton(cla, txt, func){
    cla = document.createElement("button");
    cla.setAttribute("class", cla);
    txt = document.createTextNode(txt);
    cla.appendChild(txt);
    startButtonEl.appendChild(cla);
    cla.addEventListener("click", func);
}

function selectAnswer(event){
    event.stopPropagation();
    event.preventDefault();
    answerChoice = event.target.getAttribute("data-value");
    answerValidation(answerChoice);
    quizCurrent++;
    quizEnd();
    if (quizCurrent !== quizQuestionsAnswers.length){
        buildQuestionAndChoice(quizCurrent);
    }
}

function answerValidation(choice){
    var questionState = quizQuestionEl.firstElementChild.getAttribute("data-state");
    var answerState = quizChoiceEl[choice].firstElementChild.getAttribute("data-state");
    compareAnswer(questionState, answerState);
}

function compareAnswer(q, a){
    if (q === a){
        quickMessage("Correct!");
    } else {
        quickMessage("Incorrect!");
        timeLeft -= 5; 
    }
}

function quickMessage(message){
    var quickTimer = 4;
    var quickInterval = setInterval(() => {
        if (quickTimer !== 0){
            quickTimer--;
            correctIncorrectEl.textContent = message;
        } else {
            clearInterval(quickInterval);
            correctIncorrectEl.textContent = " ";
        }
    }, 250);
}

function gameOver(){
    clearQuestionAndChoice();
    quizQuestionEl.innerHTML = "<h2>Your final score is " + finalScore + ".</h>";
    quizChoiceEl[0].innerHTML = "<label for='highscore'>Enter your name or initials to submit your score:</label>";
    quizChoiceEl[1].innerHTML = "<input type='text' class='initials'>";
    quizChoiceEl[2].innerHTML = " ";
    quizChoiceEl[3].innerHTML = " ";
    quizChoiceEl[1].firstElementChild.focus();
    buildButton("submit", "Submit Score!", submitScore);
    correctIncorrect.textContent = " ";
    initials = document.querySelector(".initials");
    currentLeaderboard = JSON.parse(localStorage.getItem("scoreArray")) || []; 
}

function submitScore(){
    var newScore = {
        score: finalScore,
        name: initials.value
    }
    
    currentLeaderboard.push(newScore);
    currentLeaderboard.sort(compareHighScore);
    localStorage.setItem("scoreArray", JSON.stringify(currentLeaderboard));
    buildHighScores(); 
}

function compareHighScore(a, b){
    var playerA = a.score;
    var playerB = b.score;
    var comparison = 0;
    if (playerA > playerB){
        comparison = 1;
    } else if (playerA < playerB){
        comparison = -1;
    }
    return comparison * -1;
}

function buildHighScores(){
    clearInterval(timeInterval); 
    removeButtons();
    clearQuestionAndChoice();
    quizQuestionEl.innerHTML = "<h2>Current Leaderboard</h2>";
    currentLeaderboard = JSON.parse(localStorage.getItem("scoreArray")) || [];
    buildLeaderboard();
    buildButton("menu", "Main Menu!", pageReInit);
    buildButton("clear", "Clear Leaderboard!", clearScore);
}

function buildLeaderboard(){
    if (currentLeaderboard.length < quizChoiceEl.length){
        for (var i = 0; i < currentLeaderboard.length; i++){
            quizChoiceEl[i].innerHTML = "<p>" + currentLeaderboard[i].name + " " + currentLeaderboard[i].score + "</p>";
        }
    } else if (currentLeaderboard.length >= quizChoiceEl.length){
        for (var i = 0; i < quizChoiceEl.length; i++){
            quizChoiceEl[i].innerHTML = "<p>" + currentLeaderboard[i].name + " " + currentLeaderboard[i].score + "</p>";
        }
    }
}

function pageReInit(){
    for (var i = 0; i <= startButtonEl.childElementCount; i++){
        startButtonEl.firstElementChild.remove();
    }
    pageInit();
}

function clearScore(){
    localStorage.clear();
    buildHighScores();
}

function pageInit(){
    quizQuestionEl.innerHTML = "<h2>How much do you know about cats?</h2>";
    quizChoiceEl[0].innerHTML = "<p>You'll have 60 seconds to answer 5 questions.</p>";
    quizChoiceEl[1].innerHTML = "<p>When you answer wrong, you'll lose 5 seconds from the timer.</p>";
    quizChoiceEl[2].innerHTML = "<p>When you're done with the quiz, the time remaining is your score.</p>";
    quizChoiceEl[3].innerHTML = "<p>Good luck!</p>";
    buildButton("start", "Start Quiz!", quizInit);
}

pageInit();

highScoresBtn.addEventListener("click", buildHighScores);
let currentQuestionIndex = 0;
let score = 0;
let gameActive = false;

function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=15&category=9&difficulty=medium')

    .then(response => response.json())
        .then(data => {
            handleQuestions(data.results);
            showQuestion(currentQuestionIndex);
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

function handleQuestions(questions) {
    window.quizQuestions = questions;
}

function showQuestion(questionIndex) {
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const submitButton = document.getElementById('submit-button');
    const nextButton = document.getElementById('next-button');
    const startButton = document.querySelector('.start-btn');
    const questionsRemaining = window.quizQuestions.length - currentQuestionIndex;
    const questionsAnswered = currentQuestionIndex;

    questionContainer.innerHTML = '';
    optionsContainer.innerHTML = '';

    if (questionIndex >= window.quizQuestions.length) {
        questionContainer.innerText = 'Quiz færdig!';
        submitButton.disabled = true;
        nextButton.disabled = true;
        showScore();
    } else {
        const question = window.quizQuestions[questionIndex].question;
        const correctAnswer = window.quizQuestions[questionIndex].correct_answer;
        const wrongAnswers = window.quizQuestions[questionIndex].incorrect_answers;
        questionContainer.innerHTML = question;


        const allAnswers = [...wrongAnswers, correctAnswer];


        const shuffledAnswers = shuffleArray(allAnswers);

        shuffledAnswers.forEach(answer => {
            const radioBtn = document.createElement('input');
            radioBtn.type = 'radio';
            radioBtn.name = 'answer';
            radioBtn.value = answer;

            const label = document.createElement('label');
            label.innerText = answer;

            optionsContainer.appendChild(radioBtn);
            optionsContainer.appendChild(label);
        });

        submitButton.disabled = false;
        nextButton.disabled = true;

        resetAnswerColors();

        const radioButtons = document.querySelectorAll('input[name="answer"]');
        radioButtons.forEach(radioBtn => {
            radioBtn.addEventListener('click', function() {
                if (submitButton.disabled) {
                    radioBtn.checked = false;
                }
            });
        });

        questionContainer.innerHTML += ` (Questions Remaining: ${questionsRemaining}, Questions Answered: ${questionsAnswered})`;
    }

    startButton.disabled = true;
}

function resetAnswerColors() {
    const answerOptions = document.querySelectorAll('label');
    answerOptions.forEach(option => {
        option.style.color = 'black';
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function submitAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    const submitButton = document.getElementById('submit-button');
    const nextButton = document.getElementById('next-button');
    const optionsContainer = document.getElementById('options-container');
    const resultContainer = document.getElementById('result-container');

    if (selectedAnswer) {
        const radioButtons = document.querySelectorAll('input[name="answer"]');
        radioButtons.forEach(radioBtn => {
            radioBtn.disabled = true;
        });

        const answer = selectedAnswer.value;
        const currentQuestion = window.quizQuestions[currentQuestionIndex];

        const resultText = document.createElement('p');
        if (answer === currentQuestion.correct_answer) {
            selectedAnswer.parentNode.classList.add('correct');
            score++;
            resultText.innerText = 'KORREKT!';
            resultText.style.color = 'green';
        } else {
            selectedAnswer.parentNode.classList.add('wrong');
            const correctOption = document.querySelector(`input[value="${currentQuestion.correct_answer}"]`);
            correctOption.parentNode.classList.add('correct');
            radioButtons.forEach(radioBtn => {
                if (radioBtn.value !== currentQuestion.correct_answer) {
                    radioBtn.parentNode.classList.add('wrong');
                }
            });
            resultText.innerText = 'FORKERT! :(';
            resultText.style.color = 'red';
        }

        resultContainer.innerHTML = '';


        resultContainer.appendChild(resultText);

        submitButton.disabled = true;
        nextButton.disabled = false;

        const answerOptions = document.querySelectorAll('label');
        answerOptions.forEach(option => {
            if (option.classList.contains('correct')) {
                option.style.color = 'green';
            } else if (option.classList.contains('wrong')) {
                option.style.color = 'red';
            }
        });
    }
}



function nextQuestion() {
    const nextButton = document.getElementById('next-button');

    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
    nextButton.disabled = true;

    resetAnswerColors();
}

function showScore() {
    const scoreContainer = document.getElementById('score-container');
    const totalQuestions = window.quizQuestions.length;
    const correctAnswers = score;
    const wrongAnswers = totalQuestions - correctAnswers;

    scoreContainer.innerHTML = `Korrekte: ${correctAnswers}<br>Forkerte svar: ${wrongAnswers}`;
}

function openGamePopup() {
    document.getElementById('game-popup').style.display = 'block';
    document.getElementById('game-container').style.display = 'block';
    fetchQuestions();
}

function closeGamePopup() {
    document.getElementById('game-popup').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
}

const questions = [
    {
        question: "1. What does HTML stand for?",
        answers: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Multi Language",
            "Home Text Markup Language"
        ],
        correct: 0
    },
    {
        question: "2. Which language is used to style a webpage?",
        answers: ["HTML", "CSS", "C++", "SQL"],
        correct: 1
    },
    {
        question: "3. Which tag creates a hyperlink in HTML?",
        answers: ["<p>", "<img>", "<a>", "<h1>"],
        correct: 2
    },
    {
        question: "4. Which property changes text color in CSS?",
        answers: ["font-size", "background", "margin", "color"],
        correct: 3
    },
    {
        question: "5. Which language makes a webpage interactive?",
        answers: ["JavaScript", "HTML only", "SQL", "XML"],
        correct: 0
    },
    {
        question: "6. Which CSS property creates space outside an element?",
        answers: ["padding", "margin", "border", "width"],
        correct: 1
    },
    {
        question: "7. Which HTML tag displays an image?",
        answers: ["<image>", "<picture>", "<img>", "<src>"],
        correct: 2
    },
    {
        question: "8. Which symbol selects a class in CSS?",
        answers: ["#", ".", "*", "@"],
        correct: 1
    }
];

let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
let answered = false;
let resultHistory = [];

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");
const downloadBtn = document.getElementById("downloadBtn");

const welcome = document.querySelector(".welcome");
const quizBox = document.getElementById("quiz");
const resultBox = document.getElementById("result");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const questionCount = document.getElementById("questionCount");
const timerElement = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");
const feedback = document.getElementById("feedback");
const scoreElement = document.getElementById("score");

// Shuffle questions randomly
function shuffleQuestions(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// Start Quiz
function startQuiz() {
    clearInterval(timerInterval);

    quizQuestions = shuffleQuestions(questions).slice(0, 5);
    currentQuestion = 0;
    score = 0;
    resultHistory = [];

    welcome.hidden = true;
    resultBox.hidden = true;
    quizBox.hidden = false;

    showQuestion();
}

// Display Question
function showQuestion() {
    clearInterval(timerInterval);

    answered = false;
    timeLeft = 30;
    timerElement.textContent = timeLeft;
    nextBtn.disabled = true;
    nextBtn.textContent =
        currentQuestion === quizQuestions.length - 1
            ? "See Results"
            : "Next Question";

    feedback.textContent = "";
    answersElement.innerHTML = "";

    const current = quizQuestions[currentQuestion];

    questionElement.textContent = current.question;
    questionCount.textContent =
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    progressBar.style.width =
        `${(currentQuestion / quizQuestions.length) * 100}%`;

    current.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.className = "answer-btn";
        button.textContent = answer;
        button.addEventListener("click", () => selectAnswer(index));

        answersElement.appendChild(button);
    });

    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeIsUp();
        }
    }, 1000);
}

// Check Selected Answer
function selectAnswer(selectedIndex) {
    if (answered) return;

    answered = true;
    clearInterval(timerInterval);

    const current = quizQuestions[currentQuestion];
    const buttons = answersElement.querySelectorAll("button");
    const isCorrect = selectedIndex === current.correct;

    if (isCorrect) {
        score++;
        feedback.textContent = "Correct Answer!";
    } else {
        feedback.textContent = "Wrong Answer!";
    }

    feedback.style.color = isCorrect ? "#27ae60" : "#e74c3c";

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === current.correct) {
            button.classList.add("correct");
        } else if (index === selectedIndex) {
            button.classList.add("incorrect");
        }
    });

    resultHistory.push({
        question: current.question,
        selected: current.answers[selectedIndex],
        correct: current.answers[current.correct],
        status: isCorrect ? "Correct" : "Incorrect"
    });

    nextBtn.disabled = false;
}

// Handle Timer Expiry
function timeIsUp() {
    if (answered) return;

    answered = true;

    const current = quizQuestions[currentQuestion];
    const buttons = answersElement.querySelectorAll("button");

    feedback.textContent = "Time is up!";
    feedback.style.color = "#e74c3c";

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === current.correct) {
            button.classList.add("correct");
        }
    });

    resultHistory.push({
        question: current.question,
        selected: "No answer",
        correct: current.answers[current.correct],
        status: "Time expired"
    });

    nextBtn.disabled = false;
}

// Move to Next Question
function nextQuestion() {
    if (!answered) return;

    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Show Final Score
function showResults() {
    clearInterval(timerInterval);

    quizBox.hidden = true;
    resultBox.hidden = false;

    progressBar.style.width = "100%";

    scoreElement.textContent =
        `Your Score: ${score} / ${quizQuestions.length}`;

    const percentage = Math.round(
        (score / quizQuestions.length) * 100
    );

    const message = document.createElement("p");
    message.textContent = `Percentage: ${percentage}%`;
    scoreElement.appendChild(message);
}

// Restart Quiz
function restartQuiz() {
    startQuiz();
}

// Dark and Light Mode
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    themeBtn.textContent = document.body.classList.contains("dark")
        ? "Light Mode"
        : "Dark Mode";
});

// Download Result as PDF
function downloadResult() {
    const percentage = Math.round(
        (score / quizQuestions.length) * 100
    );

    const report = [
        "QUIZ MASTER - QUIZ RESULT",
        "-------------------------",
        `Score: ${score} / ${quizQuestions.length}`,
        `Percentage: ${percentage}%`,
        "",
        ...resultHistory.flatMap((item, index) => [
            `${index + 1}. ${item.question}`,
            `Your answer: ${item.selected}`,
            `Correct answer: ${item.correct}`,
            `Result: ${item.status}`,
            ""
        ])
    ].join("\n");

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Please allow pop-ups to download your result.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Quiz Result</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    line-height: 1.8;
                }
                h1 { color: #2c3e50; }
                pre {
                    white-space: pre-wrap;
                    font-family: Arial, sans-serif;
                }
            </style>
        </head>
        <body>
            <h1>Quiz Master Result</h1>
            <pre>${escapeHTML(report)}</pre>
            <script>
                window.onload = function() {
                    window.print();
                };
            <\/script>
        </body>
        </html>
    `);

    printWindow.document.close();
}

// Escape HTML special characters in the report
function escapeHTML(text) {
    return text.replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Connect Buttons
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);
downloadBtn.addEventListener("click", downloadResult);

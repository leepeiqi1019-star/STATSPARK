
const questContainer = document.getElementById("questContainer");
const achievementContainer = document.getElementById("achievementContainer");

// =================================
// 1. LOAD SAVED PROGRESS
// =================================

let savedProgress = JSON.parse(
    localStorage.getItem("statsparkQuestProgress")
) || {};

let totalPoints = savedProgress.totalPoints || 0;
let correctAnswers = Number.isFinite(savedProgress.correctAnswers)
    ? savedProgress.correctAnswers
    : (savedProgress.completedQuests || []).length;
let answeredQuestions = savedProgress.answeredQuestions || 0;
let recentQuestions = savedProgress.recentQuestions || [];

let difficulty = savedProgress.difficulty || "Easy";

let currentQuestion = null;
let hasAnswered = false;

// =================================
// 2. SAVE PROGRESS
// =================================

function saveProgress() {
    localStorage.setItem(
        "statsparkQuestProgress",
        JSON.stringify({
            totalPoints,
            correctAnswers,
            answeredQuestions,
            recentQuestions: recentQuestions.slice(-20),
            difficulty
        })
    );
}

// =================================
// 3. RANDOM NUMBER HELPERS
// =================================

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function formatNumber(number) {
    return Number(number.toFixed(2)).toString();
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

// =================================
// 4. QUESTION GENERATORS
// =================================

function generateMean() {
    const count = difficulty === "Easy" ? 3 :
                  difficulty === "Medium" ? 4 : 5;

    const numbers = Array.from(
        { length: count },
        () => randomInt(1, difficulty === "Easy" ? 10 : 30)
    );

    const answer = numbers.reduce((a, b) => a + b, 0) / count;

    return {
        topic: "Mean",
        question: `Calculate the mean of ${numbers.join(", ")}.`,
        answer: formatNumber(answer),
        options: createNumberOptions(answer),
        key: `mean-${numbers.join("-")}`
    };
}

function generateMedian() {
    const count = difficulty === "Easy" ? 3 :
                  difficulty === "Medium" ? 5 : 7;

    const numbers = Array.from(
        { length: count },
        () => randomInt(1, 40)
    ).sort((a, b) => a - b);

    const answer = numbers[Math.floor(count / 2)];

    return {
        topic: "Median",
        question: `Find the median of ${numbers.join(", ")}.`,
        answer: String(answer),
        options: createNumberOptions(answer),
        key: `median-${numbers.join("-")}`
    };
}

function generateRange() {
    const count = difficulty === "Easy" ? 3 :
                  difficulty === "Medium" ? 5 : 7;

    const numbers = Array.from(
        { length: count },
        () => randomInt(1, 50)
    );

    const answer = Math.max(...numbers) - Math.min(...numbers);

    return {
        topic: "Range",
        question: `Calculate the range of ${numbers.join(", ")}.`,
        answer: String(answer),
        options: createNumberOptions(answer),
        key: `range-${numbers.join("-")}`
    };
}

function generateProbability() {
    const total = difficulty === "Easy" ? 5 :
                  difficulty === "Medium" ? 6 : 10;

    const favourable = randomInt(1, total - 1);
    const divisor = gcd(favourable, total);

    const answer = `${favourable / divisor}/${total / divisor}`;

    const options = new Set([answer]);

    while (options.size < 4) {
        const other = randomInt(1, total - 1);
        const otherDivisor = gcd(other, total);

        options.add(
            `${other / otherDivisor}/${total / otherDivisor}`
        );
    }

    return {
        topic: "Probability",
        question: `A bag contains ${favourable} red balls and ${total - favourable} blue balls. What is the probability of selecting a red ball?`,
        answer,
        options: shuffle([...options]),
        key: `probability-${favourable}-${total}`
    };
}

// =================================
// 5. GENERATE ANSWER OPTIONS
// =================================

function createNumberOptions(answer) {
    const correct = Number(answer);
    const options = new Set([formatNumber(correct)]);

    while (options.size < 4) {
        const offset = randomInt(1, 4);
        const direction = Math.random() < 0.5 ? -1 : 1;
        const wrongAnswer = correct + offset * direction;

        if (wrongAnswer >= 0) {
            options.add(formatNumber(wrongAnswer));
        }
    }

    return shuffle([...options]);
}

// =================================
// 6. GENERATE RANDOM QUESTION
// =================================

function generateQuestion() {
    const generators = [
        generateMean,
        generateMedian,
        generateRange,
        generateProbability
    ];

    let question;
    let attempts = 0;

    do {
        const generator = generators[
            randomInt(0, generators.length - 1)
        ];

        question = generator();
        attempts++;

    } while (
        recentQuestions.includes(question.key) &&
        attempts < 100
    );

    currentQuestion = question;
    hasAnswered = false;

    displayQuestion();
}

// =================================
// 7. DISPLAY QUESTION
// =================================

function displayQuestion() {
    const points = difficulty === "Easy" ? 10 :
                   difficulty === "Medium" ? 20 : 30;

    questContainer.innerHTML = `
        <div class="quest-score">
            <h3>Your Points: ${totalPoints} XP</h3>
            <p>Correct Answers: ${correctAnswers}</p>
            <p>Questions Attempted: ${answeredQuestions}</p>
        </div>

        <div class="quest-card">
            <div class="quest-question-info">
                <span>${currentQuestion.topic}</span>
                <span>${difficulty}</span>
            </div>

            <h3>Random Challenge</h3>

            <p>${currentQuestion.question}</p>

            <div class="quest-options">
                ${currentQuestion.options.map(option => `
                    <button
                        onclick="answerQuest('${option}')"
                        ${hasAnswered ? "disabled" : ""}
                    >
                        ${option}
                    </button>
                `).join("")}
            </div>

            <p id="questFeedback"></p>

            <button
                class="next-question-btn"
                onclick="generateQuestion()"
                ${hasAnswered ? "" : "disabled"}
            >
                Next Question →
            </button>

            <p class="quest-points-info">
                Correct answer: +${points} XP
            </p>
        </div>
    `;
}

// =================================
// 8. ANSWER QUESTION
// =================================

function answerQuest(selectedAnswer) {
    if (hasAnswered) return;

    const feedback = document.getElementById("questFeedback");
    const buttons = document.querySelectorAll(".quest-options button");

    answeredQuestions++;
    hasAnswered = true;

    if (selectedAnswer === currentQuestion.answer) {
        const points = difficulty === "Easy" ? 10 :
                       difficulty === "Medium" ? 20 : 30;

        totalPoints += points;
        correctAnswers++;

        feedback.textContent = `Correct! +${points} XP`;
        feedback.style.color = "green";

        recentQuestions.push(currentQuestion.key);

        saveProgress();
        displayAchievements();

    } else {
        feedback.textContent =
            `Incorrect! The correct answer is ${currentQuestion.answer}.`;

        feedback.style.color = "red";
    }

    buttons.forEach(button => {
        button.disabled = true;
    });

    const nextButton = document.querySelector(".next-question-btn");
    nextButton.disabled = false;

    saveProgress();
    updateQuestScore();
}

// =================================
// 9. UPDATE SCORE
// =================================

function updateQuestScore() {
    const score = document.querySelector(".quest-score");

    if (score) {
        score.innerHTML = `
            <h3>Your Points: ${totalPoints} XP</h3>
            <p>Correct Answers: ${correctAnswers}</p>
            <p>Questions Attempted: ${answeredQuestions}</p>
        `;
    }

    displayAchievements();
}
    

// =================================
// 10. CHANGE DIFFICULTY
// =================================

function changeDifficulty() {
    const selector = document.getElementById("difficultySelect");

    difficulty = selector.value;

    saveProgress();
    generateQuestion();
}

// =================================
// 11. ACHIEVEMENT BADGES
// =================================

function displayAchievements() {
    const achievements = [
        {
            name: "Beginner",
            icon: "🥉",
            description: "Get your first correct answer.",
            unlocked: correctAnswers >= 1
        },
        {
            name: "Intermediate",
            icon: "🥈",
            description: "Get 5 correct answers.",
            unlocked: correctAnswers >= 5
        },
        {
            name: "Statistics Master",
            icon: "🥇",
            description: "Get 10 correct answers.",
            unlocked: correctAnswers >= 10
        }
    ];

    achievementContainer.innerHTML = achievements.map(item => `
        <div class="achievement-card ${item.unlocked ? "unlocked" : "locked"}">
            <div class="achievement-icon">${item.icon}</div>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span>${item.unlocked ? "UNLOCKED" : "LOCKED"}</span>
        </div>
    `).join("");
}

// =================================
// 12. INITIALIZE QUEST
// =================================

questContainer.innerHTML = `
    <div class="quest-score">
        <h3>Your Points: ${totalPoints} XP</h3>
        <p>Correct Answers: ${correctAnswers}</p>
        <p>Questions Attempted: ${answeredQuestions}</p>
    </div>

    <div class="quest-card">
        <h3>Choose Your Difficulty</h3>

        <select id="difficultySelect" onchange="changeDifficulty()">
            <option value="Easy" ${difficulty === "Easy" ? "selected" : ""}>Easy</option>
            <option value="Medium" ${difficulty === "Medium" ? "selected" : ""}>Medium</option>
            <option value="Hard" ${difficulty === "Hard" ? "selected" : ""}>Hard</option>
        </select>

        <button class="next-question-btn" onclick="generateQuestion()">
            Start Random Quest →
        </button>
    </div>
`;

displayAchievements();
console.log("Correct Answers:", correctAnswers);
console.log("Achievement Container:", achievementContainer);

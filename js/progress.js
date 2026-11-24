
const progressContainer = document.getElementById("progressContainer");

// =================================
// 1. LOAD SAVED QUEST PROGRESS
// =================================

function loadProgress() {
    const savedProgress = JSON.parse(
        localStorage.getItem("statsparkQuestProgress")
    ) || {};

    const totalPoints = savedProgress.totalPoints || 0;
    const correctAnswers = savedProgress.correctAnswers || 0;
    const answeredQuestions = savedProgress.answeredQuestions || 0;

    const accuracy = answeredQuestions > 0
        ? (correctAnswers / answeredQuestions) * 100
        : 0;

    return {
        totalPoints,
        correctAnswers,
        answeredQuestions,
        accuracy
    };
}

// =================================
// 2. DISPLAY PROGRESS
// =================================

function displayProgress() {
    const progress = loadProgress();

    let performanceMessage = "";

    if (progress.accuracy >= 80) {
        performanceMessage =
            "Excellent! You have a strong understanding of Statistics.";
    } else if (progress.accuracy >= 50) {
        performanceMessage =
            "Good progress! Keep practising to improve your accuracy.";
    } else if (progress.answeredQuestions > 0) {
        performanceMessage =
            "Keep learning! Review the topics and try more questions.";
    } else {
        performanceMessage =
            "Start your first quest to discover your learning performance.";
    }

    // =================================
    // ACHIEVEMENT DATA
    // =================================

    const achievements = [
        {
            name: "Beginner",
            icon: "🥉",
            description: "Get your first correct answer.",
            unlocked: progress.correctAnswers >= 1
        },
        {
            name: "Intermediate",
            icon: "🥈",
            description: "Get 5 correct answers.",
            unlocked: progress.correctAnswers >= 5
        },
        {
            name: "Statistics Master",
            icon: "🥇",
            description: "Get 10 correct answers.",
            unlocked: progress.correctAnswers >= 10
        }
    ];

    const unlockedCount = achievements.filter(
        item => item.unlocked
    ).length;

    // =================================
    // DASHBOARD CONTENT
    // =================================

    progressContainer.innerHTML = `

        <div class="progress-dashboard">

            <div class="progress-card">
                <h3>Total XP</h3>
                <p>${progress.totalPoints}</p>
                <span>Experience Points</span>
            </div>

            <div class="progress-card">
                <h3>Questions Attempted</h3>
                <p>${progress.answeredQuestions}</p>
                <span>Total Questions</span>
            </div>

            <div class="progress-card">
                <h3>Correct Answers</h3>
                <p>${progress.correctAnswers}</p>
                <span>Successfully Answered</span>
            </div>

            <div class="progress-card">
                <h3>Accuracy Rate</h3>
                <p>${progress.accuracy.toFixed(1)}%</p>
                <span>Overall Accuracy</span>
            </div>

        </div>

        <!-- LEARNING PERFORMANCE -->

        <div class="performance-section">

            <h2>Learning Performance</h2>

            <div class="performance-card">

                <h3>Your Performance</h3>

                <p>${performanceMessage}</p>

                <div class="progress-bar-background">

                    <div
                        class="progress-bar-fill"
                        style="width: ${Math.min(100, progress.accuracy)}%"
                    ></div>

                </div>

                <span>${progress.accuracy.toFixed(1)}% Accuracy</span>

            </div>

        </div>

        <!-- ACHIEVEMENT OVERVIEW -->

        <div class="progress-achievement-section">

            <h2>Achievement Overview</h2>

            <p>
                You have unlocked ${unlockedCount} out of
                ${achievements.length} achievements.
            </p>

            <div class="progress-achievement-grid">

                ${achievements.map(item => `
                    <div class="progress-achievement-card ${item.unlocked ? "unlocked" : "locked"}">

                        <div class="achievement-icon">
                            ${item.icon}
                        </div>

                        <h3>${item.name}</h3>

                        <p>${item.description}</p>

                        <span>
                            ${item.unlocked ? "UNLOCKED" : "LOCKED"}
                        </span>

                    </div>
                `).join("")}

            </div>

        </div>

    `;
}

// =================================
// 3. INITIALIZE
// =================================


function initializeProgress() {
    if (!progressContainer) {
        console.error("Progress container not found!");
        return;
    }

    displayProgress();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeProgress);
} else {
    initializeProgress();
}

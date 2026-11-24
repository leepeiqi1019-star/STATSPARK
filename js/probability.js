
/* =================================
   STATSPARK - PROBABILITY LAB
================================= */

document.addEventListener("DOMContentLoaded", function () {

    // =================================
    // 1. BASIC PROBABILITY CALCULATOR
    // =================================

    const favourableInput = document.getElementById("favourableInput");
    const totalInput = document.getElementById("totalInput");
    const basicProbabilityBtn = document.getElementById("basicProbabilityBtn");
    const basicError = document.getElementById("basicError");
    const basicResult = document.getElementById("basicResult");

    function calculateBasicProbability() {

        const favourable = Number(favourableInput.value);
        const total = Number(totalInput.value);

        basicError.textContent = "";

        if (
            favourableInput.value.trim() === "" ||
            totalInput.value.trim() === ""
        ) {
            basicError.textContent = "Please enter both values.";
            return;
        }

        if (
            !Number.isInteger(favourable) ||
            !Number.isInteger(total) ||
            favourable < 0 ||
            total <= 0
        ) {
            basicError.textContent =
                "Please enter valid non-negative whole numbers. Total outcomes must be greater than zero.";
            return;
        }

        if (favourable > total) {
            basicError.textContent =
                "Favourable outcomes cannot exceed total outcomes.";
            return;
        }

        const probability = favourable / total;
        const percentage = probability * 100;

        basicResult.innerHTML = `
            <div class="explanation-section">

                <h3>Probability Result</h3>

                <div class="step-item">
                    <span class="step-number">STEP 01</span>
                    <p><strong>Formula</strong></p>
                    <p>P(A) = Favourable Outcomes ÷ Total Outcomes</p>
                </div>

                <div class="step-item">
                    <span class="step-number">STEP 02</span>
                    <p><strong>Substitute the values</strong></p>
                    <p>P(A) = ${favourable} ÷ ${total}</p>
                </div>

                <div class="step-item">
                    <span class="step-number">STEP 03</span>
                    <p><strong>Calculate the probability</strong></p>
                    <p>P(A) = ${probability.toFixed(4)}</p>
                </div>

                <p class="final-answer">
                    Probability = ${probability.toFixed(4)}
                    <br>
                    Percentage = ${percentage.toFixed(2)}%
                </p>

            </div>
        `;
    }

    if (basicProbabilityBtn) {
        basicProbabilityBtn.addEventListener(
            "click",
            calculateBasicProbability
        );
    }


    // =================================
    // 2. COMPLEMENTARY PROBABILITY
    // =================================

    const eventProbability = document.getElementById("eventProbability");
    const complementBtn = document.getElementById("complementBtn");
    const complementError = document.getElementById("complementError");
    const complementResult = document.getElementById("complementResult");

    function calculateComplement() {

        const probability = Number(eventProbability.value);

        complementError.textContent = "";

        if (eventProbability.value.trim() === "") {
            complementError.textContent = "Please enter a probability.";
            return;
        }

        if (
            !Number.isFinite(probability) ||
            probability < 0 ||
            probability > 1
        ) {
            complementError.textContent =
                "Probability must be between 0 and 1.";
            return;
        }

        const complement = 1 - probability;

        complementResult.innerHTML = `
            <div class="explanation-section">

                <h3>Complementary Probability Result</h3>

                <div class="step-item">
                    <span class="step-number">STEP 01</span>
                    <p><strong>Formula</strong></p>
                    <p>P(A') = 1 - P(A)</p>
                </div>

                <div class="step-item">
                    <span class="step-number">STEP 02</span>
                    <p><strong>Substitute the value</strong></p>
                    <p>P(A') = 1 - ${probability}</p>
                </div>

                <div class="step-item">
                    <span class="step-number">STEP 03</span>
                    <p><strong>Calculate</strong></p>
                    <p>P(A') = ${complement.toFixed(4)}</p>
                </div>

                <p class="final-answer">
                    Complementary Probability = ${complement.toFixed(4)}
                    <br>
                    Percentage = ${(complement * 100).toFixed(2)}%
                </p>

            </div>
        `;
    }

    if (complementBtn) {
        complementBtn.addEventListener("click", calculateComplement);
    }


    // =================================
    // 3. INTERACTIVE DICE EXPERIMENT
    // =================================

    const rollDiceBtn = document.getElementById("rollDiceBtn");
    const diceResult = document.getElementById("diceResult");
    const diceHistory = document.getElementById("diceHistory");
    const diceChart = document.getElementById("diceChart");

    let diceRolls = [];

    function rollDice() {

        const result = Math.floor(Math.random() * 6) + 1;

        diceRolls.push(result);

        const totalRolls = diceRolls.length;

        const counts = [1, 2, 3, 4, 5, 6].map(
            number => diceRolls.filter(value => value === number).length
        );

        diceResult.innerHTML = `
            <div class="explanation-section">
                <h3>Dice Result</h3>
                <p style="font-size: 48px; font-weight: bold;">
                    🎲 ${result}
                </p>
                <p>Number of rolls: ${totalRolls}</p>
            </div>
        `;

        diceHistory.innerHTML = `
            <div class="explanation-section">
                <h3>Experiment Summary</h3>
                <p><strong>Total Rolls:</strong> ${totalRolls}</p>
                <p><strong>Results:</strong> ${diceRolls.join(", ")}</p>
                <h4>Frequency of Each Outcome</h4>

                ${counts.map((count, index) => `
                    <p>
                        ${index + 1}: ${count} time(s)
                        — Relative Frequency:
                        ${((count / totalRolls) * 100).toFixed(2)}%
                    </p>
                `).join("")}

            </div>
        `;

        // UPDATE DICE FREQUENCY CHART

        diceChart.innerHTML = `
            <div class="frequency-chart">

                ${counts.map((count, index) => `
                    <div class="chart-row">

                        <span class="chart-label">
                            ${index + 1}
                        </span>

                        <div class="chart-bar-container">
                            <div class="chart-bar"
                                 style="width: ${(count / totalRolls) * 100}%;">
                            </div>
                        </div>

                        <span class="chart-value">
                            ${count}
                        </span>

                    </div>
                `).join("")}

            </div>
        `;
    }

    if (rollDiceBtn) {
        rollDiceBtn.addEventListener("click", rollDice);
    }


    // =================================
    // 4. RESET DICE EXPERIMENT
    // =================================

    const resetDiceBtn = document.getElementById("resetDiceBtn");

    function resetDice() {

        diceRolls = [];

        diceResult.innerHTML = `
            <p>Click the button to roll the die.</p>
        `;

        diceHistory.innerHTML = `
            <p>No rolls yet.</p>
        `;

        diceChart.innerHTML = `
            <p>Roll the dice to generate the chart.</p>
        `;
    }

    if (resetDiceBtn) {
        resetDiceBtn.addEventListener("click", resetDice);
    }

    console.log("PROBABILITY LAB READY");

});

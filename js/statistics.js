
/* =================================
   STATSPARK - STATISTICS EXPLORER
================================= */

const dataInput = document.getElementById("dataInput");
const calculateBtn = document.getElementById("calculateBtn");
const clearBtn = document.getElementById("clearBtn");
const errorMessage = document.getElementById("errorMessage");
const explanationContent = document.getElementById("explanationContent");
const sampleBtn = document.getElementById("sampleBtn");
const historyContent = document.getElementById("historyContent");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const interpretationContent = document.getElementById("interpretationContent");
// DATASET COMPARISON

const datasetAInput = document.getElementById("datasetA");
const datasetBInput = document.getElementById("datasetB");
const comparisonError = document.getElementById("comparisonError");
const compareBtn = document.getElementById("compareBtn");
const comparisonResults = document.getElementById("comparisonResults");
// =================================
// 1. HELPER FUNCTION
// =================================

function formatNumber(value) {
    return Number(value.toFixed(2)).toString();
}


// =================================
// 2. CALCULATE STATISTICS
// =================================

function calculateStatistics() {

    const input = dataInput.value.trim();

    if (input === "") {
        errorMessage.textContent = "Please enter your dataset.";
        return;
    }

    const data = input.split(",").map(Number);

    if (data.some(value => !Number.isFinite(value))) {
        errorMessage.textContent =
            "Please enter valid numbers separated by commas.";
        return;
    }

    if (data.length < 2) {
        errorMessage.textContent =
            "Please enter at least two numbers.";
        return;
    }

    errorMessage.textContent = "";

    const sortedData = [...data].sort((a, b) => a - b);
    const n = sortedData.length;


    // MEAN

    const sum = sortedData.reduce(
        (total, value) => total + value, 0
    );

    const mean = sum / n;


    // MEDIAN

    let median;

    if (n % 2 === 0) {
        median = (
            sortedData[n / 2 - 1] +
            sortedData[n / 2]
        ) / 2;
    } else {
        median = sortedData[Math.floor(n / 2)];
    }


    // MODE

    const frequency = {};

    sortedData.forEach(value => {
        frequency[value] = (frequency[value] || 0) + 1;
    });

    const highestFrequency = Math.max(
        ...Object.values(frequency)
    );

    let mode = "No mode";

    if (highestFrequency > 1) {
        mode = Object.keys(frequency)
            .filter(value => frequency[value] === highestFrequency)
            .join(", ");
    }


    // RANGE

    const range = sortedData[n - 1] - sortedData[0];


    // POPULATION VARIANCE

    const squaredDifferences = sortedData.map(value =>
        Math.pow(value - mean, 2)
    );

    const sumSquaredDifferences = squaredDifferences.reduce(
        (total, value) => total + value, 0
    );

    const variance = sumSquaredDifferences / n;
    const standardDeviation = Math.sqrt(variance);


    // DISPLAY RESULTS

    document.getElementById("meanResult").textContent =
        mean.toFixed(2);

    document.getElementById("medianResult").textContent =
        median.toFixed(2);

    document.getElementById("modeResult").textContent = mode;

    document.getElementById("rangeResult").textContent =
        range.toFixed(2);

    document.getElementById("varianceResult").textContent =
        variance.toFixed(2);

    document.getElementById("sdResult").textContent =
        standardDeviation.toFixed(2);


    // GENERATE EXPLANATION

    generateExplanation(
        sortedData,
        sum,
        mean,
        median,
        mode,
        range,
        squaredDifferences,
        sumSquaredDifferences,
        variance,
        standardDeviation
    );
      // GENERATE QUICK INTERPRETATION

    generateInterpretation(
        mean,
        median,
        mode,
        range,
        variance,
        standardDeviation
    );
    // SAVE CALCULATION HISTORY

    saveCalculationHistory({

        date: new Date().toLocaleString(),

        dataset: sortedData.join(", "),

        mean: formatNumber(mean),

        median: formatNumber(median),

        mode: mode,

        range: formatNumber(range),

        variance: formatNumber(variance),

        sd: formatNumber(standardDeviation)

    });
}


// =================================
// 3. GENERATE EXPLANATION
// =================================

function generateExplanation(
    data,
    sum,
    mean,
    median,
    mode,
    range,
    squaredDifferences,
    sumSquaredDifferences,
    variance,
    standardDeviation
) {

    const n = data.length;

    let medianSteps;

    if (n % 2 === 0) {
        medianSteps = `
            <p>There are ${n} values, so take the average
            of the two middle values.</p>

            <p>
                Median = (${data[n / 2 - 1]} + ${data[n / 2]}) ÷ 2
                = ${formatNumber(median)}
            </p>
        `;
    } else {
        medianSteps = `
            <p>There are ${n} values, so select the middle value.</p>

            <p>Median = ${formatNumber(median)}</p>
        `;
    }

    const squaredSteps = data.map(value => {
        return `(${value} - ${formatNumber(mean)})²`;
    }).join(" + ");

    const squaredValues = squaredDifferences
        .map(value => formatNumber(value))
        .join(" + ");


    explanationContent.innerHTML = `

        <!-- MEAN -->

        <div class="explanation-section">

            <p class="step-label">TOPIC 01 · CENTRAL TENDENCY</p>

            <h3>1. Mean</h3>

            <div class="step-item">

                <span class="step-number">STEP 01</span>

                <p><strong>Formula</strong></p>

                <p>Mean = Σx ÷ n</p>

            </div>

            <div class="step-item">

                <span class="step-number">STEP 02</span>

                <p><strong>Add all the values</strong></p>

                <p>${data.join(" + ")} = ${formatNumber(sum)}</p>

            </div>

            <div class="step-item">

                <span class="step-number">STEP 03</span>

                <p><strong>Divide by the number of values</strong></p>

                <p>${formatNumber(sum)} ÷ ${n} = ${formatNumber(mean)}</p>

            </div>

            <p class="final-answer">
                Final Answer: ${formatNumber(mean)}
            </p>

        </div>


        <!-- MEDIAN -->

        <div class="explanation-section">

            <p class="step-label">TOPIC 02 · CENTRAL TENDENCY</p>

            <h3>2. Median</h3>

            <div class="step-item">

                <span class="step-number">STEP 01</span>

                <p><strong>Arrange the data in ascending order</strong></p>

                <p>${data.join(", ")}</p>

            </div>

            <div class="step-item">

                <span class="step-number">STEP 02</span>

                <p><strong>Identify the middle value(s)</strong></p>

                ${medianSteps}

            </div>

            <p class="final-answer">
                Final Answer: ${formatNumber(median)}
            </p>

        </div>


        <!-- MODE -->

        <div class="explanation-section">

            <p class="step-label">TOPIC 03 · CENTRAL TENDENCY</p>

            <h3>3. Mode</h3>

            <div class="step-item">

                <span class="step-number">STEP 01</span>

                <p><strong>Identify the frequency of each value</strong></p>

                <p>Find how many times each value appears in the dataset.</p>

            </div>

            <div class="step-item">

                <span class="step-number">STEP 02</span>

                <p><strong>Identify the highest frequency</strong></p>

                <p>The value(s) with the highest frequency is the mode.</p>

            </div>

            <p class="final-answer">
                Final Answer: ${mode}
            </p>

        </div>


        <!-- RANGE -->

        <div class="explanation-section">

            <p class="step-label">TOPIC 04 · MEASURES OF DISPERSION</p>

            <h3>4. Range</h3>

            <div class="step-item">

                <span class="step-number">STEP 01</span>

                <p><strong>Identify the highest and lowest values</strong></p>

                <p>Highest value = ${data[n - 1]}</p>

                <p>Lowest value = ${data[0]}</p>

            </div>

            <div class="step-item">

                <span class="step-number">STEP 02</span>

                <p><strong>Apply the range formula</strong></p>

                <p>Range = Highest value - Lowest value</p>

                <p>${data[n - 1]} - ${data[0]} = ${formatNumber(range)}</p>

            </div>

            <p class="final-answer">
                Final Answer: ${formatNumber(range)}
            </p>

        </div>


        <!-- VARIANCE -->

        <div class="explanation-section">

            <p class="step-label">TOPIC 05 · MEASURES OF DISPERSION</p>

            <h3>5. Population Variance</h3>

            <div class="step-item">

                <span class="step-number">STEP 01</span>

                <p><strong>Formula</strong></p>

                <p>σ² = Σ(x - μ)² ÷ N</p>

            </div>

            <div class="step-item">

                <span class="step-number">STEP 02</span>

                <p><strong>Calculate the squared differences</strong></p>

                <p>${squaredSteps}</p>

                <p>${squaredValues}</p>

            </div>

            <div class="step-item">

                <span class="step-number">STEP 03</span>

                <p><strong>Add all squared differences</strong></p>

                <p>${formatNumber(sumSquaredDifferences)}</p>

            </div>

            <div class="step-item">

                <span class="step-number">STEP 04</span>

                <p><strong>Divide by the number of values</strong></p>

                <p>
                    ${formatNumber(sumSquaredDifferences)} ÷ ${n}
                    = ${formatNumber(variance)}
                </p>

            </div>

            <p class="final-answer">
                Final Answer: ${formatNumber(variance)}
            </p>

        </div>


        <!-- STANDARD DEVIATION -->

        <div class="explanation-section">

            <p class="step-label">TOPIC 06 · MEASURES OF DISPERSION</p>

            <h3>6. Population Standard Deviation</h3>

            <div class="step-item">

                <span class="step-number">STEP 01</span>

                <p><strong>Formula</strong></p>

                <p>σ = √σ²</p>

            </div>

            <div class="step-item">

                <span class="step-number">STEP 02</span>

                <p><strong>Substitute the variance</strong></p>

                <p>SD = √${formatNumber(variance)}</p>

            </div>

            <div class="step-item">

                <span class="step-number">STEP 03</span>

                <p><strong>Calculate the square root</strong></p>

                <p>SD = ${formatNumber(standardDeviation)}</p>

            </div>

            <p class="final-answer">
                Final Answer: ${formatNumber(standardDeviation)}
            </p>

        </div>

    `;
}
// =================================
// QUICK INTERPRETATION
// =================================

function generateInterpretation(
    mean,
    median,
    mode,
    range,
    variance,
    standardDeviation
) {

    interpretationContent.innerHTML = `

        <div class="interpretation-item">

            <h3>Mean</h3>

            <p>
                The average value of the dataset is
                <strong>${formatNumber(mean)}</strong>.
            </p>

        </div>

        <div class="interpretation-item">

            <h3>Median</h3>

            <p>
                The middle value of the dataset is
                <strong>${formatNumber(median)}</strong>.
            </p>

        </div>

        <div class="interpretation-item">

            <h3>Mode</h3>

            <p>
                The most frequently occurring value is
                <strong>${mode}</strong>.
            </p>

        </div>

        <div class="interpretation-item">

            <h3>Range</h3>

            <p>
                The difference between the highest and lowest
                values is <strong>${formatNumber(range)}</strong>.
            </p>

        </div>

        <div class="interpretation-item">

            <h3>Variance</h3>

            <p>
                The population variance is
                <strong>${formatNumber(variance)}</strong>.
            </p>

        </div>

        <div class="interpretation-item">

            <h3>Standard Deviation</h3>

            <p>
                The population standard deviation is
                <strong>${formatNumber(standardDeviation)}</strong>.
            </p>

        </div>

    `;

}
// =================================
// DATASET COMPARISON FUNCTION
// =================================

function compareDatasets() {

    const inputA = datasetAInput.value.trim();
    const inputB = datasetBInput.value.trim();

    comparisonError.textContent = "";

    if (inputA === "" || inputB === "") {
        comparisonError.textContent =
            "Please enter both datasets.";
        return;
    }

    const dataA = inputA.split(",").map(Number);
    const dataB = inputB.split(",").map(Number);

    if (
        dataA.some(value => !Number.isFinite(value)) ||
        dataB.some(value => !Number.isFinite(value))
    ) {
        comparisonError.textContent =
            "Please enter valid numbers separated by commas.";
        return;
    }

    if (dataA.length < 2 || dataB.length < 2) {
        comparisonError.textContent =
            "Each dataset must contain at least two numbers.";
        return;
    }

    function calculateSummary(data) {

        const sorted = [...data].sort((a, b) => a - b);

        const n = sorted.length;

        const mean = sorted.reduce(
            (total, value) => total + value, 0
        ) / n;

        const median = n % 2 === 0
            ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
            : sorted[Math.floor(n / 2)];

        const range = sorted[n - 1] - sorted[0];

        const variance = sorted.reduce(
            (total, value) => total + Math.pow(value - mean, 2), 0
        ) / n;

        const sd = Math.sqrt(variance);

        return { mean, median, range, variance, sd };

    }

    const resultA = calculateSummary(dataA);
    const resultB = calculateSummary(dataB);

    comparisonResults.innerHTML = `

        <h3>Comparison Results</h3>

        <table class="comparison-table">

            <tr>
                <th>Statistic</th>
                <th>Dataset A</th>
                <th>Dataset B</th>
            </tr>

            <tr>
                <td>Mean</td>
                <td>${formatNumber(resultA.mean)}</td>
                <td>${formatNumber(resultB.mean)}</td>
            </tr>

            <tr>
                <td>Median</td>
                <td>${formatNumber(resultA.median)}</td>
                <td>${formatNumber(resultB.median)}</td>
            </tr>

            <tr>
                <td>Range</td>
                <td>${formatNumber(resultA.range)}</td>
                <td>${formatNumber(resultB.range)}</td>
            </tr>

            <tr>
                <td>Variance</td>
                <td>${formatNumber(resultA.variance)}</td>
                <td>${formatNumber(resultB.variance)}</td>
            </tr>

            <tr>
                <td>Standard Deviation</td>
                <td>${formatNumber(resultA.sd)}</td>
                <td>${formatNumber(resultB.sd)}</td>
            </tr>

        </table>

    `;

}
// =================================
// 4. CLEAR DATA
// =================================

function clearStatistics() {

    dataInput.value = "";
    errorMessage.textContent = "";

    document.getElementById("meanResult").textContent = "-";
    document.getElementById("medianResult").textContent = "-";
    document.getElementById("modeResult").textContent = "-";
    document.getElementById("rangeResult").textContent = "-";
    document.getElementById("varianceResult").textContent = "-";
    document.getElementById("sdResult").textContent = "-";

    explanationContent.innerHTML = `
        <p>
            Enter your dataset and click
            Calculate to view the explanation.
        </p>
    `;

}


// =================================
// 5. BUTTON EVENTS
// =================================

calculateBtn.addEventListener("click", calculateStatistics);


clearBtn.addEventListener("click", clearStatistics);
// =================================
// 6. TRY ANOTHER DATASET
// =================================

function loadSampleDataset() {

    const sampleDatasets = [
        "2, 4, 4, 6, 8",
        "5, 10, 15, 20, 25",
        "3, 7, 7, 9, 12, 14",
        "10, 12, 15, 18, 20, 25"
    ];

    const randomIndex = Math.floor(
        Math.random() * sampleDatasets.length
    );

    dataInput.value = sampleDatasets[randomIndex];

    calculateStatistics();

}

sampleBtn.addEventListener("click", loadSampleDataset);
// =================================
// 7. CALCULATION HISTORY
// =================================

function saveCalculationHistory(record) {

    let history = [];

    try {
        history = JSON.parse(
            localStorage.getItem("statsparkHistory")
        ) || [];
    } catch (error) {
        history = [];
    }

    history.unshift(record);

    // Keep only the latest 10 calculations
    history = history.slice(0, 10);

    localStorage.setItem(
        "statsparkHistory",
        JSON.stringify(history)
    );

    displayCalculationHistory();

}
// =================================
// 8. DISPLAY CALCULATION HISTORY
// =================================

function displayCalculationHistory() {

    let history = [];

    try {
        history = JSON.parse(
            localStorage.getItem("statsparkHistory")
        ) || [];
    } catch (error) {
        history = [];
    }

    if (history.length === 0) {

        historyContent.innerHTML = `
            <p>No calculation history yet.</p>
        `;

        return;
    }

    historyContent.innerHTML = history.map((item, index) => `

        <div class="history-item">

            <h3>Calculation ${history.length - index}</h3>

            <p><strong>Date:</strong> ${item.date}</p>

            <p><strong>Dataset:</strong> ${item.dataset}</p>

            <p><strong>Mean:</strong> ${item.mean}</p>

            <p><strong>Median:</strong> ${item.median}</p>

            <p><strong>Mode:</strong> ${item.mode}</p>

            <p><strong>Range:</strong> ${item.range}</p>

            <p><strong>Variance:</strong> ${item.variance}</p>

            <p><strong>Standard Deviation:</strong> ${item.sd}</p>

        </div>

    `).join("");

}
// =================================
// 9. LOAD HISTORY WHEN PAGE OPENS
// =================================

displayCalculationHistory();
// =================================
// 10. CLEAR CALCULATION HISTORY
// =================================

function clearCalculationHistory() {

    const confirmClear = confirm(
        "Are you sure you want to clear all calculation history?"
    );

    if (!confirmClear) return;

    localStorage.removeItem("statsparkHistory");

    displayCalculationHistory();

}

clearHistoryBtn.onclick = clearCalculationHistory;
// =================================
// 11. DATASET COMPARISON BUTTON
// =================================

compareBtn.addEventListener(
    "click",
    compareDatasets
);

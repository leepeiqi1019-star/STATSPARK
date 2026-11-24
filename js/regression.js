
/* =================================
   STATSPARK - REGRESSION VISUALIZER
================================= */

const regressionX = document.getElementById("regressionX");
const regressionY = document.getElementById("regressionY");

const calculateRegressionBtn =
    document.getElementById("calculateRegression");

const sampleRegressionBtn =
    document.getElementById("sampleRegression");

const clearRegressionBtn =
    document.getElementById("clearRegression");

const regressionError =
    document.getElementById("regressionError");


// =================================
// 1. CALCULATE REGRESSION
// =================================

function calculateRegression() {

    const xValues = regressionX.value
        .split(",")
        .map(value => Number(value.trim()));

    const yValues = regressionY.value
        .split(",")
        .map(value => Number(value.trim()));

    if (
        regressionX.value.trim() === "" ||
        regressionY.value.trim() === ""
    ) {
        regressionError.textContent = "Please enter both X and Y values.";
        return;
    }

    if (
        xValues.some(value => !Number.isFinite(value)) ||
        yValues.some(value => !Number.isFinite(value))
    ) {
        regressionError.textContent = "Please enter valid numerical values.";
        return;
    }

    if (
        xValues.length !== yValues.length ||
        xValues.length < 2
    ) {
        regressionError.textContent =
            "Both datasets must have the same number of values (at least 2).";
        return;
    }

    const n = xValues.length;

    const meanX =
        xValues.reduce((sum, value) => sum + value, 0) / n;

    const meanY =
        yValues.reduce((sum, value) => sum + value, 0) / n;

    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;

    for (let i = 0; i < n; i++) {

        numerator +=
            (xValues[i] - meanX) *
            (yValues[i] - meanY);

        denominatorX +=
            Math.pow(xValues[i] - meanX, 2);

        denominatorY +=
            Math.pow(yValues[i] - meanY, 2);
    }

    if (denominatorX === 0 || denominatorY === 0) {
        regressionError.textContent =
            "Correlation cannot be calculated when all values in X or Y are identical.";
        return;
    }

    const correlation =
        numerator / Math.sqrt(denominatorX * denominatorY);

    const slope = numerator / denominatorX;

    const intercept = meanY - slope * meanX;

    const rSquared = correlation * correlation;


    // =================================
    // 2. DISPLAY RESULTS
    // =================================

    document.getElementById("correlationResult")
        .textContent = correlation.toFixed(4);

    document.getElementById("slopeResult")
        .textContent = slope.toFixed(4);

    document.getElementById("interceptResult")
        .textContent = intercept.toFixed(4);

    document.getElementById("rSquaredResult")
        .textContent = rSquared.toFixed(4);

    document.getElementById("regressionEquation")
        .textContent =
        `Regression Equation: Y = ${intercept.toFixed(2)} + (${slope.toFixed(2)})X`;


    // =================================
    // 3. DATA INTERPRETATION
    // =================================

    let interpretation = "";

    const absR = Math.abs(correlation);

    if (absR >= 0.8) {
        interpretation = "Very strong";
    } else if (absR >= 0.6) {
        interpretation = "Strong";
    } else if (absR >= 0.4) {
        interpretation = "Moderate";
    } else if (absR >= 0.2) {
        interpretation = "Weak";
    } else {
        interpretation = "Very weak";
    }

    let direction = "";

if (correlation > 0) {
    direction = "positive";
} else if (correlation < 0) {
    direction = "negative";
} else {
    direction = "no";
}

    document.getElementById("regressionExplanation")
        .innerHTML = `
            <p>
                <strong>Correlation:</strong>
                There is ${direction === "no"
    ? "no linear correlation"
    : `a ${interpretation.toLowerCase()} ${direction} linear correlation`}
between X and Y.
            </p>

            <p>
                <strong>Coefficient of Determination:</strong>
                Approximately ${(rSquared * 100).toFixed(2)}%
                of the variation in Y is explained by the
                linear relationship with X.
            </p>

            <p>
                <strong>Slope:</strong>
                For every one-unit increase in X,
                the predicted value of Y changes by
                ${slope.toFixed(4)} units.
            </p>
        `;

    regressionError.textContent = "";

    // =================================
// 3. SCATTER PLOT & REGRESSION LINE
// =================================

drawRegressionChart(xValues, yValues, slope, intercept);
}


// =================================
// 4. SAMPLE DATA
// =================================

function loadSampleRegression() {

    regressionX.value = "1, 2, 3, 4, 5";

    regressionY.value = "2, 4, 5, 4, 6";

    regressionError.textContent = "";
}


// =================================
// 5. CLEAR DATA
// =================================

function clearRegression() {

    regressionX.value = "";
    regressionY.value = "";

    regressionError.textContent = "";

    document.getElementById("correlationResult").textContent = "-";
    document.getElementById("slopeResult").textContent = "-";
    document.getElementById("interceptResult").textContent = "-";
    document.getElementById("rSquaredResult").textContent = "-";

    document.getElementById("regressionEquation")
        .textContent = "Regression Equation: -";

    document.getElementById("regressionExplanation")
        .innerHTML = `
            <p>
                Enter your data to view the
                correlation and regression interpretation.
            </p>
        `;

    document.getElementById("regressionChart")
        .innerHTML = `
            <p>
                Your scatter plot will appear here
                after analysing the data.
            </p>
        `;
}


// =================================
// 6. BUTTON EVENTS
// =================================

calculateRegressionBtn.addEventListener(
    "click",
    calculateRegression
);

sampleRegressionBtn.addEventListener(
    "click",
    loadSampleRegression
);

clearRegressionBtn.addEventListener(
    "click",
    clearRegression
);

function drawRegressionChart(xValues, yValues, slope, intercept) {

    const chart = document.getElementById("regressionChart");

    const width = 600;
    const height = 350;
    const padding = 55;

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const xRange = maxX - minX || 1;
    const yRange = maxY - minY || 1;

    const xMin = minX - xRange * 0.1;
    const xMax = maxX + xRange * 0.1;

    const yMin = Math.min(
        minY,
        slope * xMin + intercept
    ) - yRange * 0.1;

    const yMax = Math.max(
        maxY,
        slope * xMax + intercept
    ) + yRange * 0.1;

    const graphX = value =>
        padding +
        ((value - xMin) / (xMax - xMin)) *
        (width - 2 * padding);

    const graphY = value =>
        height - padding -
        ((value - yMin) / (yMax - yMin)) *
        (height - 2 * padding);

    const points = xValues.map((value, index) => `
        <circle
            cx="${graphX(value)}"
            cy="${graphY(yValues[index])}"
            r="6"
            fill="#315f9f"
            stroke="#ffffff"
            stroke-width="2"
        />
    `).join("");

    const line = `
        <line
            x1="${graphX(xMin)}"
            y1="${graphY(slope * xMin + intercept)}"
            x2="${graphX(xMax)}"
            y2="${graphY(slope * xMax + intercept)}"
            stroke="#e05252"
            stroke-width="3"
        />
    `;

    chart.innerHTML = `
        <div class="regression-chart-container">

            <svg viewBox="0 0 ${width} ${height}"
                 role="img"
                 aria-label="Scatter plot with regression line">

                <line
                    x1="${padding}"
                    y1="${height - padding}"
                    x2="${width - padding}"
                    y2="${height - padding}"
                    stroke="#64748b"
                    stroke-width="2"
                />

                <line
                    x1="${padding}"
                    y1="${padding}"
                    x2="${padding}"
                    y2="${height - padding}"
                    stroke="#64748b"
                    stroke-width="2"
                />

                ${line}
                ${points}

                <text x="${width / 2}"
                      y="${height - 10}"
                      text-anchor="middle">
                    X Values
                </text>

                <text x="18"
                      y="${height / 2}"
                      text-anchor="middle"
                      transform="rotate(-90 18 ${height / 2})">
                    Y Values
                </text>

            </svg>

            <div class="regression-legend">
                <span>
                    <i class="legend-dot"></i>
                    Data Points
                </span>

                <span>
                    <i class="legend-line"></i>
                    Regression Line
                </span>
            </div>

        </div>
    `;
}

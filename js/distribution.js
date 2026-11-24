
/* =================================
   STATSPARK - DISTRIBUTION SIMULATOR
================================= */

const distributionContent = document.getElementById("distributionContent");

const distributionButtons = document.querySelectorAll(
    ".distribution-options button"
);

// =================================
// 1. BINOMIAL DISTRIBUTION
// =================================

function showBinomial() {

    distributionContent.innerHTML = `
        <h3>Binomial Distribution</h3>

        <p>
            A binomial distribution calculates
            the probability of obtaining a certain
            number of successes in a fixed number
            of independent trials.
        </p>

        <div class="formula-box">
            P(X = x) = C(n,x) p^x (1-p)^(n-x)
        </div>

        <label>Number of Trials (n)</label>
        <input type="number" id="binomialN" placeholder="Example: 5">

        <label>Probability of Success (p)</label>
        <input type="number" id="binomialP" placeholder="Example: 0.4" step="0.01">

        <label>Number of Successes (x)</label>
        <input type="number" id="binomialX" placeholder="Example: 2">

        <button class="btn btn-primary" id="calculateBinomial">
            Calculate Probability
        </button>

        <div id="binomialResult"></div>
    `;

    document.getElementById("calculateBinomial")
        .addEventListener("click", calculateBinomial);
}


function calculateBinomial() {

    const nInput = document.getElementById("binomialN");
    const pInput = document.getElementById("binomialP");
    const xInput = document.getElementById("binomialX");

    const n = Number(nInput.value);
    const p = Number(pInput.value);
    const x = Number(xInput.value);

    const result = document.getElementById("binomialResult");

    if (
        nInput.value === "" ||
        pInput.value === "" ||
        xInput.value === ""
    ) {
      
        result.innerHTML = "<p>Please fill in all values.</p>";
        return;
    }

    if (
        !Number.isInteger(n) ||
        !Number.isInteger(x) ||
        n < 0 ||
        n > 30 ||
        x < 0 ||
        x > n ||
        p < 0 ||
        p > 1
    ) {
        result.innerHTML = "<p>Please enter valid values. Number of trials must be between 0 and 30.</p>";
        return;
    }

    function combination(n, r) {
        let answer = 1;

        for (let i = 1; i <= r; i++) {
            answer = answer * (n - i + 1) / i;
        }

        return answer;
    }

    function binomialProbability(k) {
        return combination(n, k) *
            Math.pow(p, k) *
            Math.pow(1 - p, n - k);
    }

    const probability = binomialProbability(x);
    const probabilities = [];

    for (let k = 0; k <= n; k++) {
        probabilities.push(binomialProbability(k));
    }

    const maxProbability = Math.max(...probabilities);

    result.innerHTML = `
        <div class="formula-box">
            P(X = ${x}) = ${probability.toFixed(4)}
        </div>

        <p>
            Percentage: ${(probability * 100).toFixed(2)}%
        </p>

      <h3>Binomial Distribution Graph</h3>

        <p>
            Each bar represents the probability
            of obtaining a particular number of successes.
        </p>

        <div class="distribution-chart">
            ${probabilities.map((value, k) => `
                <div class="distribution-bar-row">
                    <span class="distribution-bar-label">${k}</span>

                    <div class="distribution-bar-track">
                        <div class="distribution-bar"
                            style="width: ${maxProbability === 0 ? 0 : (value / maxProbability) * 100}%;">
                        </div>
                    </div>

                    <span class="distribution-bar-value">
                        ${value.toFixed(3)}
                    </span>
                </div>
            `).join("")}
        </div>
    `;
}


// =================================
// 2. POISSON DISTRIBUTION
// =================================

function showPoisson() {

    distributionContent.innerHTML = `
        <h3>Poisson Distribution</h3>

        <p>
            A Poisson distribution calculates
            the probability of a certain number
            of events occurring in a fixed interval.
        </p>

        <div class="formula-box">
            P(X = x) = (e^-λ × λ^x) / x!
        </div>

        <label>Mean (λ)</label>
        <input type="number" id="poissonLambda" placeholder="Example: 3" step="0.01">

        <label>Number of Events (x)</label>
        <input type="number" id="poissonX" placeholder="Example: 2">

        <button class="btn btn-primary" id="calculatePoisson">
            Calculate Probability
        </button>

        <div id="poissonResult"></div>
    `;

    document.getElementById("calculatePoisson")
        .addEventListener("click", calculatePoisson);
}

function factorial(number) {

    let answer = 1;

    for (let i = 1; i <= number; i++) {
        answer *= i;
    }

    return answer;
}


function calculatePoisson() {

    const lambdaInput = document.getElementById("poissonLambda");
    const xInput = document.getElementById("poissonX");
    const result = document.getElementById("poissonResult");

    const lambda = Number(lambdaInput.value);
    const x = Number(xInput.value);

    if (lambdaInput.value === "" || xInput.value === "") {
        result.innerHTML = "<p>Please fill in all values.</p>";
        return;
    }

    if (
        lambda < 0 ||
        !Number.isFinite(lambda) ||
        !Number.isInteger(x) ||
        x < 0 ||
        x > 30
    ) {
        result.innerHTML = "<p>Please enter valid values. Number of events must be between 0 and 30.</p>";
        return;
    }

    const probabilities = [];

    function poissonProbability(k) {
        return (
            Math.exp(-lambda) *
            Math.pow(lambda, k)
        ) / factorial(k);
    }

    for (let k = 0; k <= Math.max(15, x); k++) {
        probabilities.push(poissonProbability(k));
    }

    const probability = poissonProbability(x);
    const maxProbability = Math.max(...probabilities);

    result.innerHTML = `
        <div class="formula-box">
            P(X = ${x}) = ${probability.toFixed(4)}
        </div>

        <p>
            Percentage: ${(probability * 100).toFixed(2)}%
        </p>

        <h3>Poisson Distribution Graph</h3>

        <p>
            Each bar represents the probability
            of a particular number of events.
        </p>

        <div class="distribution-chart">
            ${probabilities.map((value, k) => `
                <div class="distribution-bar-row">
                    <span class="distribution-bar-label">${k}</span>

                    <div class="distribution-bar-track">
                        <div class="distribution-bar"
                            style="width: ${maxProbability === 0 ? 0 : (value / maxProbability) * 100}%;">
                        </div>
                    </div>

                    <span class="distribution-bar-value">
                        ${value.toFixed(3)}
                    </span>
                </div>
            `).join("")}
        </div>
    `;
}


// =================================
// 3. NORMAL DISTRIBUTION
// =================================

function showNormal() {

    distributionContent.innerHTML = `
        <h3>Normal Distribution</h3>

        <p>
            A normal distribution is a symmetric,
            bell-shaped probability distribution.
        </p>

        <div class="formula-box">
            Z = (X - μ) / σ
        </div>

        <label>Value (X)</label>
        <input type="number" id="normalX" placeholder="Example: 70">

        <label>Mean (μ)</label>
        <input type="number" id="normalMean" placeholder="Example: 60">

        <label>Standard Deviation (σ)</label>
        <input type="number" id="normalSD" placeholder="Example: 5">

        <button class="btn btn-primary" id="calculateNormal">
            Calculate Z-Score
        </button>

        <div id="normalResult"></div>
    `;

    document.getElementById("calculateNormal")
        .addEventListener("click", calculateNormal);
}


function calculateNormal() {

    const xInput = document.getElementById("normalX");
    const meanInput = document.getElementById("normalMean");
    const sdInput = document.getElementById("normalSD");

    const result = document.getElementById("normalResult");

    const x = Number(xInput.value);
    const mean = Number(meanInput.value);
    const sd = Number(sdInput.value);

    if (
        xInput.value === "" ||
        meanInput.value === "" ||
        sdInput.value === ""
    ) {
        result.innerHTML = "<p>Please fill in all values.</p>";
        return;
    }

    if (sd <= 0) {
        result.innerHTML = "<p>Standard deviation must be greater than zero.</p>";
        return;
    }

    const z = (x - mean) / sd;

    const points = [];
    const start = mean - 4 * sd;
    const end = mean + 4 * sd;

    for (let i = 0; i <= 80; i++) {
        const value = start + (end - start) * i / 80;

        const density =
            (1 / (sd * Math.sqrt(2 * Math.PI))) *
            Math.exp(-0.5 * Math.pow((value - mean) / sd, 2));

        points.push({ value, density });
    }

    const maxDensity = Math.max(...points.map(point => point.density));

    const chartWidth = 600;
    const chartHeight = 250;
    const padding = 35;

    const coordinates = points.map((point, index) => {
        const px = padding +
            (index / 80) * (chartWidth - 2 * padding);

        const py = chartHeight - padding -
            (point.density / maxDensity) * (chartHeight - 2 * padding);

        return `${px},${py}`;
    }).join(" ");

    const xPosition =
        padding + ((x - start) / (end - start)) *
        (chartWidth - 2 * padding);

    result.innerHTML = `
        <div class="formula-box">
            Z = (${x} - ${mean}) / ${sd}
        </div>

        <div class="formula-box">
            Z-Score = ${z.toFixed(4)}
        </div>

        <h3>Normal Distribution Bell Curve</h3>

        <p>
            The curve shows the probability density
            of values in a normal distribution.
        </p>

        <div class="normal-chart">
            <svg viewBox="0 0 600 250"
                 role="img"
                 aria-label="Normal distribution bell curve">

                <line x1="35" y1="215"
                      x2="565" y2="215"
                      stroke="#64748b"
                      stroke-width="2"/>

                <polyline
                    points="${coordinates}"
                    fill="none"
                    stroke="#315f9f"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>

                <line
                    x1="${xPosition}"
                    y1="35"
                    x2="${xPosition}"
                    y2="215"
                    stroke="#e05252"
                    stroke-width="2"
                    stroke-dasharray="6 5"/>

                <text x="35" y="238" font-size="12">${start.toFixed(1)}</text>
                <text x="290" y="238" font-size="12" text-anchor="middle">${mean.toFixed(1)}</text>
                <text x="565" y="238" font-size="12" text-anchor="end">${end.toFixed(1)}</text>

                <text x="${Math.max(45, Math.min(555, xPosition))}"
                      y="25"
                      font-size="13"
                      fill="#e05252"
                      text-anchor="middle">X = ${x}</text>
            </svg>
        </div>
    `;
}


// =================================
// 4. BUTTON EVENTS
// =================================

distributionButtons[0].addEventListener("click", showBinomial);
distributionButtons[1].addEventListener("click", showPoisson);
distributionButtons[2].addEventListener("click", showNormal);

import { callGeminiAPI } from '../api.js';

let retirementChart; // Variable to hold the chart instance

function renderRetirementChart(labels, data) {
    const ctx = document.getElementById('retirement-chart').getContext('2d');

    if (retirementChart) {
        retirementChart.destroy(); // Destroy previous chart instance before creating a new one
    }

    retirementChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Projected Savings',
                data: data,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

export function initRetirementAdvisor() {
    const calculateBtn = document.getElementById('calculate-btn');
    const getAdviceBtn = document.getElementById('get-advice-btn');
    const adviceLoader = document.getElementById('advice-loader');
    const adviceOutput = document.getElementById('advice-output');
    const calculationOutput = document.getElementById('calculation-output');
    const chartContainer = document.getElementById('chart-container');
    
    let retirementData = {};

    calculateBtn.addEventListener('click', () => {
        const currentAge = parseInt(document.getElementById('current-age').value, 10);
        const retirementAge = parseInt(document.getElementById('retirement-age').value, 10);
        const currentSavings = parseFloat(document.getElementById('current-savings').value);
        const monthlyContrib = parseFloat(document.getElementById('monthly-contrib').value);

        if (isNaN(currentAge) || isNaN(retirementAge) || isNaN(currentSavings) || isNaN(monthlyContrib) || currentAge >= retirementAge) {
            calculationOutput.textContent = "Please enter valid numbers and ensure current age is less than retirement age.";
            getAdviceBtn.classList.add('hidden');
            chartContainer.classList.add('hidden');
            if (retirementChart) {
                retirementChart.destroy();
            }
            return;
        }

        const yearsToGrow = retirementAge - currentAge;
        const annualRate = 0.07;
        const chartLabels = [];
        const chartDataPoints = [];

        for (let i = 0; i <= yearsToGrow; i++) {
            const year = currentAge + i;
            chartLabels.push(year);

            const fvOfCurrentSavings = currentSavings * Math.pow((1 + annualRate), i);
            const fvOfContributions = (monthlyContrib * 12) * ((Math.pow((1 + annualRate), i) - 1) / annualRate);
            chartDataPoints.push(fvOfCurrentSavings + fvOfContributions);
        }

        const totalProjectedSavings = chartDataPoints[chartDataPoints.length - 1];
        retirementData = { currentAge, retirementAge, currentSavings, monthlyContrib, totalProjectedSavings };

        calculationOutput.innerHTML = `Estimated retirement savings: <span class="text-blue-600">$${totalProjectedSavings.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>`;
        getAdviceBtn.classList.remove('hidden');
        adviceOutput.classList.add('hidden');

        renderRetirementChart(chartLabels, chartDataPoints);
        chartContainer.classList.remove('hidden');
    });

    getAdviceBtn.addEventListener('click', async () => {
        adviceLoader.classList.remove('hidden');
        adviceOutput.classList.add('hidden');
        getAdviceBtn.disabled = true;

        const userQuery = `I am planning for retirement. Here is my information:
        - Current Age: ${retirementData.currentAge}
        - Target Retirement Age: ${retirementData.retirementAge}
        - Current Savings: $${retirementData.currentSavings.toLocaleString()}
        - Monthly Contribution: $${retirementData.monthlyContrib.toLocaleString()}
        - My estimated retirement savings will be $${retirementData.totalProjectedSavings.toLocaleString('en-US', {maximumFractionDigits: 0})}.
        
        Based on this, provide some personalized, actionable retirement planning advice in a few paragraphs. The tone should be encouraging and professional. Do not just repeat the numbers I gave you. Focus on potential strategies and next steps.`;

        const adviceText = await callGeminiAPI(userQuery);

        adviceOutput.textContent = adviceText;
        adviceLoader.classList.add('hidden');
        adviceOutput.classList.remove('hidden');
        getAdviceBtn.disabled = false;
    });
}
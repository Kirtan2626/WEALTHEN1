import { callGeminiAPI } from '../api.js';

export function initMarketSummary() {
    const getSummaryBtn = document.getElementById('get-summary-btn');
    const summaryLoader = document.getElementById('summary-loader');
    const summaryOutput = document.getElementById('summary-output');

    getSummaryBtn.addEventListener('click', async () => {
        summaryLoader.classList.remove('hidden');
        summaryOutput.classList.add('hidden');
        getSummaryBtn.disabled = true;

        const userQuery = "Summarize the top 5 most important financial and market news headlines from the last 24 hours for India. Present it as a concise, easy-to-read summary for a non-expert investor.";
        const summaryText = await callGeminiAPI(userQuery);
        
        summaryOutput.textContent = summaryText;
        summaryLoader.classList.add('hidden');
        summaryOutput.classList.remove('hidden');
        getSummaryBtn.disabled = false;
    });
}
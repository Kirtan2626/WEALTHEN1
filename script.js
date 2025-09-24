import { initMarketSummary } from './js/features/marketSummary.js';
import { initRetirementAdvisor } from './js/features/retirementAdvisor.js';
import { initGoalPlanner } from './js/features/goalPlanner.js';
import { initPortfolioAdvisor } from './js/features/portfolioAdvisor.js';
import { initEconomicAnalysis } from './js/features/economicAnalysis.js';
import { initExpenseAnalyzer, updateExpenseDashboard } from './js/features/expenseAnalyzer.js';
import { initBehavioralCoach } from './js/features/behavioralCoach.js';
import { initTaxPlanner } from './js/features/taxPlanner.js';

// Simple mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    mobileMenu.classList.toggle('hidden');
    mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
});

// Dashboard state
const addAccountBtn = document.getElementById('add-account-btn');
const accountList = document.getElementById('account-list');
const totalSavingsInput = document.getElementById('total-savings');
const loanInput = document.getElementById('loan-liabilities');
const mortgageInput = document.getElementById('mortgage-liabilities');
const netWorthOutput = document.getElementById('net-worth-output');

let accounts = [];
let totalSavings = 0;

// Financial Dashboard Logic
function updateDashboard() {
    // Update Account List
    if (accounts.length === 0) {
         accountList.innerHTML = `<p class="text-gray-500">No accounts connected yet.</p>`;
    } else {
        accountList.innerHTML = '';
        totalSavings = 0;
        accounts.forEach(acc => {
            const accountEl = document.createElement('div');
            accountEl.className = 'bg-white p-3 rounded-lg shadow flex justify-between items-center';
            accountEl.innerHTML = `
                <div>
                    <p class="font-semibold text-gray-800">${acc.name}</p>
                    <p class="text-green-600 font-mono">₹${acc.balance.toLocaleString('en-IN')}</p>
                </div>
            `;
            accountList.appendChild(accountEl);
            totalSavings += acc.balance;
        });
    }
    
    // Update Total Savings and Net Worth
    totalSavingsInput.value = totalSavings;
    calculateNetWorth();
}

function calculateNetWorth() {
     const loans = parseFloat(loanInput.value) || 0;
     const mortgage = parseFloat(mortgageInput.value) || 0;
     const netWorth = totalSavings - loans - mortgage;
     netWorthOutput.textContent = `₹${netWorth.toLocaleString('en-IN')}`;
}

addAccountBtn.addEventListener('click', () => {
    const accName = document.getElementById('account-name').value;
    const accBalance = parseFloat(document.getElementById('account-balance').value);

    if (accName && !isNaN(accBalance)) {
        accounts.push({ name: accName, balance: accBalance });
        document.getElementById('account-name').value = '';
        document.getElementById('account-balance').value = '';
        updateDashboard();
    }
});

loanInput.addEventListener('input', calculateNetWorth);
mortgageInput.addEventListener('input', calculateNetWorth);

// Initialize all features on page load
function initializeApp() {
    // Basic dashboard
    updateDashboard();
    updateExpenseDashboard();
    
    // AI Features
    initMarketSummary();
    initRetirementAdvisor();
    initGoalPlanner();
    initPortfolioAdvisor();
    initEconomicAnalysis(() => totalSavings);
    initExpenseAnalyzer();
    initBehavioralCoach();
    initTaxPlanner();
}

initializeApp();
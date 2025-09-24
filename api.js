runconst apiKey = "YOUR_API_KEY"; 
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

export async function callGeminiAPI(prompt) {
    if (apiKey === "YOUR_API_KEY") {
        console.error("API Key for Gemini is not set. Please replace 'YOUR_API_KEY' in js/api.js.");
        return "API Key not configured. Please set your Gemini API key in the js/api.js file.";
    }

    const payload = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("API Error:", errorBody);
            throw new Error(`API request failed with status ${response.status}. Check console for details.`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return `Sorry, there was an error fetching the AI response: ${error.message}`;
    }
}
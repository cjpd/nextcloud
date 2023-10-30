import { loadState } from '@nextcloud/initial-state';
import { showSuccess, showError } from '@nextcloud/dialogs';
import OpenAI from 'openai';

const GPT_API_KEY = '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';

document.addEventListener('DOMContentLoaded', (event) => {
    main();
});

function main() {
    loadState('catgifs', 'tutorial_initial_state');
    configForm();
}

function configForm() {
    const form = document.getElementById("detailsForm");
    const loader = document.getElementById("loader");
    const responseDiv = document.getElementById("response");
    const downloadBtn = document.getElementById("downloadReportBtn");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        loader.style.display = "block";

        const reportTitle = document.getElementById("reportTitle").value;
        const industry = document.getElementById("industry").value;
        const keyFindings = document.getElementById("keyFindings").value;
        const recommendations = document.getElementById("recommendations").value;
        const extraDetails = document.getElementById("extraDetails").value;

        const prompt = buildPrompt(reportTitle, industry, keyFindings, recommendations, extraDetails);
        const answer = await askGpt(prompt);

        loader.style.display = "none";
        responseDiv.innerText = answer;
        downloadBtn.style.display = 'block';  // Show the download button
    });

    downloadBtn.addEventListener("click", function() {
        const reportTitle = document.getElementById("reportTitle").value;
        const responseText = responseDiv.innerText;
        downloadReport(reportTitle.replace(/\s+/g, '_') + ".txt", responseText);
    });

    const clearFormBtn = document.getElementById("clearFormBtn");
    clearFormBtn.addEventListener("click", function() {
        form.reset();
        responseDiv.innerHTML = "";
        downloadBtn.style.display = 'none'; // Hide download button on clear
        loader.style.display = "none";
    });
}

function downloadReport(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function buildPrompt(reportTitle, industry, keyFindings, recommendations, extraDetails) {
    return `
        Given a cybersecurity report titled '${reportTitle}' related to the ${industry} sector, analyze and enrich the content. 
        Reflect on the ${keyFindings} and consider how they align with current cybersecurity trends, threats, and technological advancements.
        Evaluate the ${recommendations} in light of industry best practices, regulatory requirements, and innovative security strategies. Additionally, integrate insights regarding the impact of recent cyber incidents, threat evolution, and emerging defense mechanisms on the report's findings and advice.
        Consider ${extraDetails} for a more comprehensive and contextual analysis.
    `;
}

async function askGpt(promptString) {
    const openai = new OpenAI({
        apiKey: GPT_API_KEY,
        dangerouslyAllowBrowser: true
    });

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": promptString}],
    });

    console.log(chatCompletion);

    return chatCompletion.choices[0].message.content;
}

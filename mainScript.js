import { loadState } from '@nextcloud/initial-state'
import { showSuccess, showError } from '@nextcloud/dialogs'
import OpenAI from 'openai';

const GPT_API_KEY = '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';
const loader = document.getElementById("loader")
loader.style.display = "none"

// we wait for the page to be fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
	main()
})

function main() {
	// we get the data injected via the Initial Sftate mechanism
	const state = loadState('catgifs', 'tutorial_initial_state')
    configForm();
}

function configForm() {
    const form = document.getElementById("detailsForm")
    const loader = document.getElementById("loader")
    const reponseDiv = document.querySelector('#app-content #response')

    form.addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent the form from submitting and refreshing the page
        loader.style.display = "block"

        const companyName = document.getElementById("companyName").value;
        const industry = document.getElementById("industry").value;
        const mission = document.getElementById("mission").value;
        const vision = document.getElementById("vision").value;
        const extraDetails = document.getElementById("extraDetails").value;

        const prompt = buildPrompt(companyName, industry, mission, vision, extraDetails)
        const answer = await askGpt(prompt);

        loader.style.display = "none"
        setResponseText(reponseDiv, answer)
    });

    const clearFormBtn = document.getElementById("clearFormBtn");
    clearFormBtn.addEventListener("click", function() {
        form.reset()
        reponseDiv.innerHTML = ""
        loader.style.display = "none"
    });
}

function setResponseText(div, text) {
    div.innerText = text
}

function buildPrompt(companyName, industry, mission, vision, extraDetails) {
    return `
Imagine you are a seasoned cybersecurity expert, renowned for your meticulous analysis and strategic foresight in the field. You have been hired by ${companyName}, a prominent player in the ${industry} sector. The company's mission statement is '${mission}' and its vision is '${vision}'. 

Please provide an executive report summary titled "Executive Report Summary: Cybersecurity and Software Threats in the ${industry} Industry". The report should:
- Begin with an introduction.
- Elaborate on potential cybersecurity threats, offering insights into prevalent cyber-attacks in the ${industry} sector with bullet points.
- Discuss software threats in the industry with bullet points.
- Suggest preventive measures and best practices to safeguard against these threats, ensuring alignment with the company’s mission and vision with bullet points.
- Conclude by emphasizing the importance of safeguarding both employee and customer data effectively.
Throughout the whole summary take into account the extra details ${extraDetails}
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

    console.log(chatCompletion)

    return chatCompletion.choices[0].message.content;
}

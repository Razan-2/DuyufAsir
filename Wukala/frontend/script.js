"use strict";

const apiBaseUrl = "http://127.0.0.1:8000";
const agentsGrid = document.querySelector("#agentsGrid");
const agentSelect = document.querySelector("#agentSelect");
const chatForm = document.querySelector("#chatForm");
const messageInput = document.querySelector("#messageInput");
const sendButton = document.querySelector("#sendButton");
const responseMessage = document.querySelector("#responseMessage");

function showStatus(message, type) {
    responseMessage.textContent = message;
    responseMessage.className = `response-message ${type}`;
    responseMessage.hidden = false;
}

function createAgentCard(agent) {
    const card = document.createElement("article");
    card.className = "agent-card";
    card.innerHTML = `
        <div class="agent-icon" aria-hidden="true">${agent.icon}</div>
        <h3>${agent.name}</h3>
        <p>${agent.description}</p>
        <button class="secondary-button" type="button" data-agent-id="${agent.id}">فتح الوكيل</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
        agentSelect.value = agent.id;
        document.querySelector("#chat").scrollIntoView({ behavior: "smooth" });
        messageInput.focus();
    });

    return card;
}

async function loadAgents() {
    try {
        // طلب GET.
        const response = await fetch(`${apiBaseUrl}/agents`);

        // التحقق من response.ok.
        if (!response.ok) {
            throw new Error(`تعذر تحميل الوكلاء. رمز الحالة: ${response.status}`);
        }

        const agents = await response.json();
        agentsGrid.replaceChildren();

        for (const agent of agents) {
            agentsGrid.appendChild(createAgentCard(agent));

            const option = document.createElement("option");
            option.value = agent.id;
            option.textContent = agent.name;
            agentSelect.appendChild(option);
        }
    } catch (error) {
        const message = error instanceof TypeError ? "تعذر الاتصال بالخادم. تأكد من تشغيل الواجهة الخلفية." : error.message;
        agentsGrid.innerHTML = `<p class="load-error">${message}</p>`;
    }
}

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    responseMessage.hidden = true;
    sendButton.disabled = true;
    sendButton.textContent = "جاري الإرسال...";

    try {
        // طلب POST.
        const response = await fetch(`${apiBaseUrl}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                agent: agentSelect.value,
                message: messageInput.value.trim(),
            }),
        });

        // التحقق من response.ok.
        if (!response.ok) {
            const errorPayload = await response.json().catch(() => null);
            const detail = errorPayload?.detail;
            throw new Error(typeof detail === "string" ? detail : "تعذر إكمال الطلب.");
        }

        const data = await response.json();
        showStatus(`${data.selected_agent}: ${data.ai_response}`, "success");
    } catch (error) {
        const message = error instanceof TypeError ? "تعذر الاتصال بالخادم. تأكد من تشغيل الواجهة الخلفية." : error.message;
        showStatus(message, "error");
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = "إرسال الرسالة";
    }
});

loadAgents();

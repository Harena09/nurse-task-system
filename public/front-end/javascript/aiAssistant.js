
// Runs when page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const chatForm = document.getElementById("assistant-chat");
    const chatInput = document.getElementById("chat-questions");
    const sendButton = document.getElementById("submit");
    const chatMessages = document.getElementById("chat-messages");

    let isLoading = false;

    // Submit chat form
    chatForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        await sendMessage();
    });

    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Quick question buttons
    document.querySelectorAll(".question").forEach(button => {
        button.addEventListener("click", function () {
            chatInput.value = this.dataset.question || this.textContent;
            sendMessage();
        });
    });


    // send message to backend AI
    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage || isLoading) return;

        appendMessage("user", userMessage);
        chatInput.value = "";

        isLoading = true;
        sendButton.disabled = true;
        sendButton.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span>';

        try {
            const response = await fetch("http://localhost:8080/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            if (response.ok && data.reply) {
                appendMessage("bot", data.reply);
            } else {
                appendMessage("bot", "Sorry, the assistant is temporarily unavailable. Please try again.");
            }

        } catch (error) {
            console.error("Chat error:", error);
            appendMessage("bot", "Connection error. Please check your server and try again.");
        } finally {
            isLoading = false;
            sendButton.disabled = false;
            sendButton.innerHTML = '<span class="material-symbols-outlined">send</span>';
            chatInput.focus();
        }
    }


   // Append message to chat UI
    function appendMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.textContent = message;

        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
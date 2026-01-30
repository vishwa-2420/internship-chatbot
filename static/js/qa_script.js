document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function appendMessage(role, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        // Simple Markdown-like formatting for bold text
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        contentDiv.innerHTML = formattedText;

        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage(overrideText = null) {
        const message = overrideText || userInput.value.trim();
        if (!message) return;

        // Clear welcome section if it's the first message
        const welcome = document.querySelector('.welcome-section');
        if (welcome) {
            welcome.style.display = 'none';
        }

        if (!overrideText) userInput.value = '';

        appendMessage('user', message);

        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerText = 'AI Expert is analyzing...';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('/api/qa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            chatMessages.removeChild(typingDiv);

            if (data.error) {
                appendMessage('ai', `Error: ${data.error}`);
            } else {
                appendMessage('ai', data.response);
            }
        } catch (error) {
            chatMessages.removeChild(typingDiv);
            appendMessage('ai', "Sorry, I'm having trouble connecting to the AI Expert server.");
            console.error('Fetch error:', error);
        }
    }

    // Global function for topic cards
    window.askTopic = (topic) => {
        sendMessage(topic);
    };

    sendBtn.addEventListener('click', () => sendMessage());

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    userInput.focus();
});

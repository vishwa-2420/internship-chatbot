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
                let aiResponse = data.response;
                let suggestions = [];

                // Parse suggestions
                const suggestionIndex = aiResponse.indexOf('SUGGESTIONS:');
                if (suggestionIndex !== -1) {
                    const suggestionPart = aiResponse.substring(suggestionIndex + 12).trim();
                    aiResponse = aiResponse.substring(0, suggestionIndex).trim();
                    suggestions = suggestionPart.split(',').map(s => s.replace(/[\[\]]/g, '').trim());
                }

                appendMessage('ai', aiResponse);

                // Render suggestions
                if (suggestions.length > 0) {
                    renderSuggestions(suggestions);
                }
            }
        } catch (error) {
            if (typingDiv.parentNode) chatMessages.removeChild(typingDiv);
            appendMessage('ai', "Sorry, I'm having trouble connecting to the AI Expert server.");
            console.error('Fetch error:', error);
        }
    }

    function renderSuggestions(suggestions) {
        const suggestionContainer = document.createElement('div');
        suggestionContainer.className = 'suggestion-container';

        const title = document.createElement('p');
        title.innerText = 'Related topics:';
        title.style.fontSize = '0.8rem';
        title.style.color = 'var(--text-secondary)';
        title.style.marginBottom = '10px';
        suggestionContainer.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'topic-grid';
        grid.style.marginBottom = '20px';

        suggestions.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'topic-card';
            card.style.fontSize = '0.85rem';
            card.style.padding = '10px';
            card.innerText = topic;
            card.onclick = () => sendMessage(topic);
            grid.appendChild(card);
        });

        suggestionContainer.appendChild(grid);
        chatMessages.appendChild(suggestionContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
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

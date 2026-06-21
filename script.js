const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotQuickActions = document.getElementById('chatbotQuickActions');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotStatus = document.getElementById('chatbotStatus');

const conversation = [
  {
    role: 'assistant',
    content: 'Hi! I’m the STAT Services assistant. What can I help you with today?'
  }
];

let isSending = false;

function setChatbotOpen(isOpen) {
  if (!chatbotPanel || !chatbotToggle) return;
  chatbotPanel.hidden = !isOpen;
  chatbotToggle.setAttribute('aria-expanded', String(isOpen));
}

function clearHighlights() {
  document.querySelectorAll('.active-target').forEach((element) => {
    element.classList.remove('active-target');
  });
}

function highlightSectionFromText(text) {
  const normalized = text.toLowerCase();
  const sectionMap = [
    { keywords: ['quickbooks'], selector: '#quickbooks' },
    { keywords: ['setup', 'training'], selector: '#training' },
    { keywords: ['bookkeeping'], selector: '#bookkeeping' },
    { keywords: ['notary'], selector: '#notary' },
    { keywords: ['new business', 'startup', 'start a business'], selector: '#new-business' },
    { keywords: ['consultation', 'consult'], selector: '#consultation' }
  ];

  for (const section of sectionMap) {
    if (section.keywords.some((keyword) => normalized.includes(keyword))) {
      const target = document.querySelector(section.selector);
      if (target) {
        clearHighlights();
        target.classList.add('active-target');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      break;
    }
  }
}

function appendMessage(role, text) {
  if (!chatbotMessages) return;

  const message = document.createElement('div');
  message.className = `chatbot-message ${role === 'user' ? 'user-message' : 'bot-message'}`;
  message.textContent = text;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function setLoadingState(loading) {
  isSending = loading;
  if (!chatbotInput || !chatbotSend) return;
  chatbotInput.disabled = loading;
  chatbotSend.disabled = loading;
  chatbotSend.textContent = loading ? 'Sending…' : 'Send';
}

function setStatus(message = '', isError = false) {
  if (!chatbotStatus) return;
  chatbotStatus.hidden = !message;
  chatbotStatus.textContent = message;
  chatbotStatus.classList.toggle('error', isError);
}

async function sendChatMessage(userMessage) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: conversation,
      userMessage
    })
  });

  if (!response.ok) {
    throw new Error('Unable to reach assistant right now.');
  }

  return response.json();
}

async function handleSubmit(messageText) {
  const trimmed = messageText.trim();
  if (!trimmed || isSending) return;

  appendMessage('user', trimmed);
  conversation.push({ role: 'user', content: trimmed });
  setStatus();
  setLoadingState(true);

  try {
    const data = await sendChatMessage(trimmed);
    const reply = data?.reply || 'Thanks for your message. Please request a consultation and we can help further.';
    appendMessage('assistant', reply);
    conversation.push({ role: 'assistant', content: reply });
    highlightSectionFromText(`${trimmed} ${reply}`);
  } catch (error) {
    setStatus(error.message || 'Something went wrong. Please try again.', true);
  } finally {
    setLoadingState(false);
    if (chatbotInput) chatbotInput.focus();
  }
}

chatbotToggle?.addEventListener('click', () => {
  const isOpen = chatbotPanel?.hidden;
  setChatbotOpen(Boolean(isOpen));
});

chatbotClose?.addEventListener('click', () => {
  setChatbotOpen(false);
});

chatbotForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!chatbotInput) return;
  const text = chatbotInput.value;
  chatbotInput.value = '';
  await handleSubmit(text);
});

chatbotQuickActions?.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-prompt]');
  if (!button) return;
  const prompt = button.getAttribute('data-prompt');
  if (!prompt) return;
  await handleSubmit(prompt);
});

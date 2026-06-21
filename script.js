const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotBody = document.getElementById('chatbotBody');
const chatbotOptions = document.getElementById('chatbotOptions');

const responses = {
  quickbooks: {
    target: '#quickbooks',
    message: 'QuickBooks support is a great fit if you need help with records, reports, or getting your bookkeeping system organized. I\'ll take you there now.'
  },
  training: {
    target: '#training',
    message: 'Setup and training can help you get your systems in place and feel confident using them. I\'ll guide you to that section.'
  },
  bookkeeping: {
    target: '#bookkeeping',
    message: 'Bookkeeping support can help keep your records accurate and up to date. I\'ll show you that service now.'
  },
  notary: {
    target: '#notary',
    message: 'Notary services are available for important business documents. I\'ll take you to that section.'
  },
  'new-business': {
    target: '#new-business',
    message: 'New business setup support is perfect if you\'re just getting started and want help with the basics. I\'ll bring you there now.'
  },
  consultation: {
    target: '#consultation',
    message: 'Great choice. A consultation is the best way to talk through your needs directly. I\'ll take you to the consultation form now.'
  }
};

function setChatbotOpen(isOpen) {
  chatbotPanel.hidden = !isOpen;
  chatbotToggle.setAttribute('aria-expanded', String(isOpen));
}

function appendMessage(text) {
  const message = document.createElement('div');
  message.className = 'chatbot-message bot-message';
  message.textContent = text;
  chatbotBody.insertBefore(message, chatbotOptions);
}

function clearHighlights() {
  document.querySelectorAll('.active-target').forEach((element) => {
    element.classList.remove('active-target');
  });
}

function guideTo(choice) {
  const response = responses[choice];
  if (!response) return;

  appendMessage(response.message);
  const target = document.querySelector(response.target);

  if (target) {
    clearHighlights();
    target.classList.add('active-target');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

chatbotToggle?.addEventListener('click', () => {
  const isOpen = chatbotPanel.hidden;
  setChatbotOpen(isOpen);
});

chatbotClose?.addEventListener('click', () => {
  setChatbotOpen(false);
});

chatbotOptions?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-choice]');
  if (!button) return;

  const choice = button.getAttribute('data-choice');
  guideTo(choice);
});

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value;
    if (!message.trim()) return;
  
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
  
    fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
      chatBox.innerHTML += `<div><strong>Bot:</strong> ${data.reply}</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
      input.value = '';
    });
  }
  
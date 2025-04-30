document.getElementById('highlightBtn').addEventListener('click', async () => {
  const keywords = document.getElementById('keywords').value
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { action: 'highlight', keywords }, (response) => {
    if (chrome.runtime.lastError) {
      alert('Cannot highlight: This page does not support highlighting.');
    }
  });
});

const highlightBtn = document.getElementById('highlightBtn');

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
    if (chrome.runtime.lastError) {
      highlightBtn.disabled = true;
      highlightBtn.textContent = 'Not supported on this page';
      highlightBtn.style.background = '#ccc';
    }
  });
});
  
const highlightBtn = document.getElementById('highlightBtn');
const keywordsInput = document.getElementById('keywords');

function handleHighlightClick() {
  const keywords = keywordsInput.value
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { action: 'highlight', keywords });
  });
}

highlightBtn.addEventListener('click', handleHighlightClick);
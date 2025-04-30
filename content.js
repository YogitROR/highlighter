function highlightParagraphs(keywords) {
  if (!keywords || !keywords.length) return;
  const keywordRegex = new RegExp(keywords.join('|'), 'gi');
  document.querySelectorAll('p').forEach(p => {
    if (keywordRegex.test(p.textContent)) {
      p.style.backgroundColor = 'aqua';
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    sendResponse({ status: 'ok' });
  }
  if (request.action === 'highlight' && request.keywords) {
    highlightParagraphs(request.keywords);
  }
});

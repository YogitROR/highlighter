function highlightParagraphs(keywords) {
  if (!keywords || !keywords.length) return;
  const keywordRegex = new RegExp(keywords.join('|'), 'gi');
  document.querySelectorAll('p').forEach(p => {
    if (keywordRegex.test(p.textContent)) {
      p.style.backgroundColor = 'aqua';
    }
  });
}

// Function to count hyperlinks
function countHyperlinks() {
  const links = document.getElementsByTagName('a');
  return links.length;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCount') {
    const count = countHyperlinks();
    sendResponse({ count: count });
    return true; // Keep the message channel open
  }

  if (request.action === 'highlight' && request.keywords) {
    highlightParagraphs(request.keywords);
    sendResponse({ status: 'completed' });
  }
});

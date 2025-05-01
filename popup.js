// Get DOM elements
const highlightBtn = document.getElementById('highlightBtn');
const keywordsInput = document.getElementById('keywords');
const linkCountElement = document.getElementById('linkCount');
const externalCountElement = document.getElementById('externalCount');

// Function to inject and execute content script
async function executeContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        const links = document.getElementsByTagName('a');
        return links.length;
      }
    });
  } catch (err) {
    console.error('Failed to inject script:', err);
    return false;
  }
}

// Function to update link counts
async function updateLinkCounts() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab) {
            linkCountElement.textContent = 'N/A';
            externalCountElement.textContent = 'N/A';
            return;
        }

        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                const links = document.getElementsByTagName('a');
                const currentDomain = window.location.hostname;
                
                let externalCount = 0;
                for (let link of links) {
                    try {
                        const url = new URL(link.href);
                        if (url.hostname !== currentDomain) {
                            externalCount++;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                return {
                    total: links.length,
                    external: externalCount
                };
            }
        });

        if (results && results[0]) {
            const counts = results[0].result;
            linkCountElement.textContent = counts.total;
            externalCountElement.textContent = counts.external;
        } else {
            linkCountElement.textContent = '0';
            externalCountElement.textContent = '0';
        }

    } catch (error) {
        console.error('Error:', error);
        linkCountElement.textContent = 'N/A';
        externalCountElement.textContent = 'N/A';
    }
}

// Handle highlight button click
function handleHighlightClick() {
    const keywords = keywordsInput.value
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.tabs.sendMessage(tab.id, { action: 'highlight', keywords });
    });
}

// Event listeners
highlightBtn.addEventListener('click', handleHighlightClick);
document.addEventListener('DOMContentLoaded', updateLinkCounts);

document.getElementById('urlForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('result');
    const url = urlInput.value.trim();
    
    // Clear previous results and show loading state
    resultDiv.innerHTML = '<div class="loading">Generating short URL...</div>';
    
    if (!url) {
        resultDiv.innerHTML = '<div class="error">Please enter a URL</div>';
        return;
    }

    try {
        const response = await fetch('/api/shorten', {  // Updated to /api/shorten
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl: url })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to shorten URL');
        }

        const data = await response.json();
        // Format expiration date
        const expiresAt = new Date(data.expiresAt);
        const formattedDate = expiresAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        console.log(data)
        // Enhanced result display
        resultDiv.innerHTML = `
            <div class="result-container">
                <p class="success">URL shortened successfully!</p>
                <div class="url-result">
                    <span>Original:</span>
                    <a href="${url}" target="_blank">${url}</a>
                </div>
                <div class="url-result">
                    <span>Short URL:</span>
                    <a href="${data.shortUrl}" target="_blank" id="shortUrl">${data.shortUrl}</a>
                    <button onclick="copyToClipboard('${data.shortUrl.replace(/'/g, "\\'")}')" class="copy-btn">
                        Copy
                    </button>
                </div>
                <div class="meta-info">
                    <p>Expires: ${formattedDate}</p>
                    <a href="/api/${data.shortCode}/analytics" target="_blank" class="analytics-link">
                        View Analytics
                    </a>
                </div>
            </div>
        `;
        
        // Clear the input field
        urlInput.value = '';
        
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="error">
                <p>${error.message}</p>
                <p>Please try again with a valid URL</p>
            </div>
        `;
    }
});

// Enhanced copy function with visual feedback
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            const copyBtn = document.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.textContent = 'Copied!';
                copyBtn.style.backgroundColor = '#4CAF50';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.style.backgroundColor = '#2196F3';
                }, 2000);
            }
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        });
}
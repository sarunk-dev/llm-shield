document.getElementById('url-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const url = document.getElementById('url-input').value;

  // Send the URL to the backend to scrape it
  const response = await fetch('/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ url })
  });

  const data = await response.json();

  // Store the data in localStorage for use in the summary page
  localStorage.setItem('scrapedData', JSON.stringify(data));

  // Redirect to the summary page
  window.location.href = './summary.html';
});

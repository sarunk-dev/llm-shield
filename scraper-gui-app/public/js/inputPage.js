document.getElementById('url-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const url = document.getElementById('url-input').value;
  console.log(`url to scrape: ${url}`);
  const response = await fetch('/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url })  // Send the URL as JSON
  });

  if (response.ok) {
    window.location.href = './summary.html';
  } else {
    console.error('Failed to scrape the URL');
  }
});

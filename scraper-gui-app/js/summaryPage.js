const url = localStorage.getItem('scrape-url');

if (url) {
  document.getElementById('summary-content').innerText = `Scraped data from ${url} will be shown here.`;
} else {
  document.getElementById('summary-content').innerText = 'No URL provided!';
}

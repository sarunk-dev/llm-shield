document.getElementById('url-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const url = document.getElementById('url-input').value;
  
  if (url) {
    localStorage.setItem('scrape-url', url);
    window.location.href = 'summary.html';
  }
});


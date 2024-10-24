document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(localStorage.getItem('scrapedData'));

  if (data) {
    // Display the scraped text content
    const textSummary = document.getElementById('text-summary');
    if (data.text.trim()) {
      textSummary.innerText = data.text;
    } else {
      textSummary.innerText = 'No text content found.';
    }

    // Display scraped images with captions
    const imageContainer = document.getElementById('image-summary');
    if (data.images && data.images.length > 0) {
      data.images.forEach((src, index) => {
        const imgElem = document.createElement('img');
        imgElem.src = src;
        imgElem.alt = data.captions[index];
        imgElem.style.width = '200px';
        imgElem.style.marginBottom = '10px';

        const captionElem = document.createElement('p');
        captionElem.innerText = data.captions[index];

        const div = document.createElement('div');
        div.appendChild(imgElem);
        div.appendChild(captionElem);

        imageContainer.appendChild(div);
      });
    } else {
      imageContainer.innerText = 'No images found.';
    }
  } else {
    document.getElementById('summary-content').innerText = 'No data available.';
  }
});

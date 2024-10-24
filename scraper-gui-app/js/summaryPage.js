document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(localStorage.getItem('scrapedData'));

  if (data) {
    document.getElementById('text-summary').innerText = data.text;

    const imageContainer = document.getElementById('image-summary');
    data.images.forEach((src, index) => {
      const imgElem = document.createElement('img');
      imgElem.src = src;
      imgElem.alt = data.captions[index];
      imgElem.style.width = '200px';  // Example styling

      const captionElem = document.createElement('p');
      captionElem.innerText = data.captions[index];

      const div = document.createElement('div');
      div.appendChild(imgElem);
      div.appendChild(captionElem);

      imageContainer.appendChild(div);
    });
  } else {
    document.getElementById('summary-content').innerText = 'No data to display.';
  }
});

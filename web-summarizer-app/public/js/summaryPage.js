document.addEventListener("DOMContentLoaded", async () => {
    try {
      console.log("Fetching scraped data from backend");
      const response = await fetch("/scrape/get-summary");
      const data = await response.json();
      console.log("Received data:", data);
  
      if (data.summaryText) {
        document.getElementById("text-summary").textContent = data.summaryText; // try using textContent here
      }
  
      if (data.images && data.images.length > 0) {
        const imageSummary = document.getElementById("image-summary");
        data.images.forEach((image) => {
          const imgElement = document.createElement("img");
          imgElement.src = image.url;
          imgElement.alt = image.caption;
  
          const captionElement = document.createElement("p");
          captionElement.textContent = image.caption; // try using textContent here
  
          imageSummary.appendChild(imgElement);
          imageSummary.appendChild(captionElement);
        });
      }
    } catch (error) {
      console.error("Error fetching the summary:", error);
    }
  });
  
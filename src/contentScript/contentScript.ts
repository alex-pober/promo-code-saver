// content.js
const contentDiv = document.querySelector(".content");

function startTimer(duration) {
  let timer = duration;
  let minutes, seconds;
  let timerElement;

  if (contentDiv) {
    timerElement = document.createElement("div");
    timerElement.className = "timer";
    contentDiv.appendChild(timerElement);
  }
  const intervalId = setInterval(function () {
    // @ts-expect-error
    minutes = parseInt(timer / 60, 10);
    // @ts-expect-error
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // Update the timer element text content
    if (timerElement) {
      timerElement.textContent = minutes + ":" + seconds;
    }

    if (--timer < 0) {
      clearInterval(intervalId);
      // Timer reached 0, perform actions here
    }
  }, 1000);
}

function addImageToLocalStorage(pngData) {
  // Retrieve existing images from local storage
  const existingImages = JSON.parse(localStorage.getItem("images")) || [];

  // Add the new image data
  existingImages.push(pngData);

  // Store the updated images back to local storage
  localStorage.setItem("images", JSON.stringify(existingImages));
}

function displayImagesFromLocalStorage() {
  const images = JSON.parse(localStorage.getItem("images")) || [];
  console.log("image from json", images);
  if (contentDiv) {
    // Create and append the image viewer div to the body
    const imageViewerDiv = document.createElement("div");
    imageViewerDiv.className = "image-viewer";
    imageViewerDiv.style.display = 'flex'
    imageViewerDiv.style.flexDirection = 'column'
    imageViewerDiv.style.alignItems = 'center'
    imageViewerDiv.style.gap = '8px'
    contentDiv.appendChild(imageViewerDiv);
    // Display each image in the image viewer
    images.reverse().forEach((imageData, index) => {
      console.log("image from forEacj", imageData);
      const imageElement = document.createElement("img");
      imageElement.src = "data:image/png;base64," + imageData;
      imageElement.alt = "Image " + (index + 1);
      imageElement.style.width = '166px';
      imageElement.style.height = '29px';
      imageElement.style.border = '3px solid'
      imageElement.style.borderRadius = '9px'
      imageElement.style.padding = '3px'
      // Append each image to the image viewer div
      imageViewerDiv.appendChild(imageElement);
      // You can customize the styles of the image element if needed
      // imageElement.style.width = '100px';
    });
  }
}

function extractPNGData(element) {
  // Get the background image property value
  const backgroundImage = window
    .getComputedStyle(element)
    .getPropertyValue("background-image");

  // Extract the base64 encoded PNG data from the URL
  const match = backgroundImage.match(
    /^url\("data:image\/png;base64,([^"]+)"\)$/
  );
  if (match && match[1]) {
    let pngData = match[1];
    startTimer(5 * 60);
    addImageToLocalStorage(pngData);
    console.log("Extracted PNG Data:", pngData);
    // Now you can use the extracted PNG data as needed
    // For example, you can send it to the background script or perform any other actions
  }
}

// Function to be called when a mutation is observed
function handleMutation(mutationsList) {
  mutationsList.forEach((mutation) => {
    // Check if the target node is added (appeared on the screen)
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((addedNode) => {
        // Check if the added node has the specified class
        if (addedNode.classList && addedNode.classList.contains("fs-exclude")) {
          extractPNGData(addedNode);
          displayImagesFromLocalStorage();
        }
      });
    }
  });
}

// Create an observer instance linked to the handleMutation function
const observer = new MutationObserver(handleMutation);

// Start observing the target node for mutations
observer.observe(document.body, { childList: true, subtree: true });

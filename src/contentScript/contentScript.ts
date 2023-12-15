// content.js
const contentDiv = document.querySelector(".content");

// Function to click on the specified element
function clickElement() {
  const element = document.getElementById("footer__postal-request-code");
  if (element) {
    element.click();
  }
}

// Check if the current URL matches the specific website you want to target
if (window.origin === 'https://lobby.chumbacasino.com') {
  // Execute the click function after a short delay (adjust as needed)
  setTimeout(clickElement, 5000);
}

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

function deleteImageFromLocalStorage(index) {
  // Retrieve existing images from local storage
  const existingImages = JSON.parse(localStorage.getItem("images")) || [];

  // Remove the image at the specified index
  existingImages.splice(index, 1);

  // Store the updated images back to local storage
  localStorage.setItem("images", JSON.stringify(existingImages));

  // Refresh the displayed images
  displayImagesFromLocalStorage();
}

function displayImagesFromLocalStorage() {
  const images = JSON.parse(localStorage.getItem("images")) || [];
  const imageViewer = document.querySelector(".image-viewer");

  // Remove any existing image viewer elements
  const existingImageViewers = document.querySelectorAll(".image-viewer");
  existingImageViewers.forEach((viewer) => viewer.remove());

  if (contentDiv) {
    // Create and append the image viewer div to the body
    const imageViewerDiv = document.createElement("div");
    imageViewerDiv.className = "image-viewer";
    imageViewerDiv.style.display = "flex";
    imageViewerDiv.style.flexDirection = "column";
    imageViewerDiv.style.alignItems = "center";
    imageViewerDiv.style.gap = "8px";

    // Check if the element has a previous sibling with the class 'image-viewer'
    if (
      imageViewer &&
      imageViewer.previousElementSibling &&
      imageViewer.previousElementSibling.classList.contains("image-viewer")
    ) {
      // Remove the entire element
      imageViewer.parentElement.removeChild(imageViewer);
    } else {
      console.log(
        "No previous sibling element with class 'image-viewer' to remove."
      );
    }

    //       // Check if the element has children
    //   if (imageViewerDiv.hasChildNodes()) {
    //     // Clear all children
    //     while (imageViewerDiv.firstChild) {
    //       imageViewerDiv.removeChild(imageViewerDiv.firstChild);
    //     }
    //   } else {
    //     console.log("No children to remove.");
    //   }

    contentDiv.appendChild(imageViewerDiv);
    // Display each image in the image viewer
    images.forEach((imageData, index) => {
      const imageContainer = document.createElement("div");
      imageContainer.className = "image-delete flex flex-row";
      imageContainer.style.display = "flex";
      imageContainer.style.flexDirection = "column";
      imageContainer.style.alignItems = "center";

      const imageElement = document.createElement("img");
      imageElement.src = "data:image/png;base64," + imageData;
      imageElement.alt = "Image " + (index + 1);
      imageElement.style.width = "166px";
      imageElement.style.height = "29px";
      imageElement.style.border = "3px solid";
      imageElement.style.borderRadius = "9px";
      imageElement.style.padding = "3px";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () =>
        deleteImageFromLocalStorage(index)
      );

      // Append each image to the image viewer div
      imageContainer.appendChild(imageElement);
      imageContainer.appendChild(deleteButton);

      // Append each image container to the image viewer div
      imageViewerDiv.appendChild(imageContainer);
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

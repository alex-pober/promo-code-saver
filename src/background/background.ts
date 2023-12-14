// const { createWorker } = require('tesseract.js');

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log(request);
//     console.log(sender);

//     if (request.pngData) {
//         // Handle the received PNG data here
//         console.log("Received PNG Data in background script:", request.pngData);


//             console.log("hello aync")
//             try {
//                 const worker = await createWorker('eng');
//                 const ret = await worker.recognize(request.pngData);
//                 console.log(ret.data.text);
//                 await worker.terminate();
//             } catch (error) {
//                 console.error("Tesseract.js error:", error);
//             }
//             // Send the response asynchronously
//             sendResponse({ message: "PNG data received successfully" });
//         ;

//         // Return true to indicate that you will be sending a response asynchronously
//         return true;
//     }
// })

// // Append the script to the head of the document

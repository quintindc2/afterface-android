/**
 * Afterface UI bootstrap.
 * Full face-swap engine is in the project zip under assets/www/app.js.
 * Replace this file with the complete app.js from AfterfaceAndroid.zip for face swap.
 */
(function () {
  const status = document.getElementById("status");
  const swapBtn = document.getElementById("swapBtn");
  const photoInput = document.getElementById("photoInput");
  const videoInput = document.getElementById("videoInput");

  function setStatus(msg, isError) {
    if (!status) return;
    status.textContent = msg || "";
    status.classList.toggle("error", Boolean(isError));
  }

  setStatus("App shell loaded. Push the full app.js from AfterfaceAndroid.zip for face swap.");

  if (photoInput) {
    photoInput.addEventListener("change", () => {
      setStatus("Portrait selected (full engine required to process).");
    });
  }
  if (videoInput) {
    videoInput.addEventListener("change", () => {
      setStatus("Clip selected (full engine required to process).");
    });
  }
  if (swapBtn) {
    swapBtn.disabled = false;
    swapBtn.addEventListener("click", () => {
      setStatus(
        "Replace this app.js with the complete file from the AfterfaceAndroid project zip, then rebuild.",
        true,
      );
    });
  }
})();

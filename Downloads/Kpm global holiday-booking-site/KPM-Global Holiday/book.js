// book.js
// - URL se package info read karega (?pkg=, ?dest=)
// - Form submit par simple success message dikhayega (demo mode)

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const pkgNameFromUrl = params.get("pkg");     // e.g. Goa Beachside Escape
  const destFromUrl = params.get("dest");       // e.g. Goa

  const packageInput = document.getElementById("packageName");
  const destinationInput = document.getElementById("destination");
  const bookingForm = document.getElementById("bookingForm");
  const bookingMessage = document.getElementById("bookingMessage");

  // URL se aaya hua data set karna
  if (packageInput) {
    packageInput.value = pkgNameFromUrl || "Custom holiday enquiry";
  }
  if (destinationInput) {
    destinationInput.value = destFromUrl || "To be decided";
  }

  // Form submit handling (frontend demo)
  if (bookingForm && bookingMessage) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      bookingMessage.textContent =
        "Thanks! Your booking request has been submitted. Our team will contact you shortly with details.";
      bookingMessage.style.color = "var(--accent-3)";

      // Demo: thodi der baad form ko light reset kar do
      setTimeout(() => {
        bookingForm.reset();
        // Package info ko URL se hi rehne do
        if (packageInput) packageInput.value = pkgNameFromUrl || "Custom holiday enquiry";
        if (destinationInput) destinationInput.value = destFromUrl || "To be decided";
      }, 2000);
    });
  }
});

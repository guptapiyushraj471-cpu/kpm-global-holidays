// book.js
// - URL se package info read
// - Supabase "bookings" table me insert
// - Backend ko call karke WhatsApp + Email trigger

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  // ?package=Goa ya ?pkg=Goa
  const pkgFromUrl = params.get("package") || params.get("pkg");
  const destFromUrl = params.get("dest");

  const packageInput = document.getElementById("packageName");
  const destinationInput = document.getElementById("destination");
  const bookingForm = document.getElementById("bookingForm");
  const bookingMessage = document.getElementById("bookingMessage");

  // URL se aaya data form me daal do
  if (packageInput) {
    packageInput.value = pkgFromUrl || "Custom holiday enquiry";
  }
  if (destinationInput) {
    destinationInput.value = destFromUrl || "To be decided";
  }

  // Supabase client (book.html me banaya hai)
  const client = window.supabaseClient;

  if (!bookingForm) return;

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    bookingMessage.textContent = "Saving your booking request...";
    bookingMessage.style.color = "#ccc";

    if (!client) {
      bookingMessage.textContent =
        "Supabase client missing. Please refresh page.";
      bookingMessage.style.color = "red";
      console.error("Supabase client missing");
      return;
    }

    // Form values
    const package_name = packageInput.value;
    const destination = destinationInput.value;
    const full_name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value; // yahi raw phone backend ko jayega
    const start_date = document.getElementById("startDate").value;
    const end_date = document.getElementById("endDate").value;
    const adults = Number(document.getElementById("adults").value || 0);
    const children = Number(document.getElementById("children").value || 0);
    const preferences = document.getElementById("preferences").value;

    // 1) Supabase me insert
    const { data, error } = await client.from("bookings").insert([
      {
        package_name,
        destination,
        full_name,
        email,
        phone,
        start_date,
        end_date,
        adults,
        children,
        preferences,
      },
    ]);

    if (error) {
      console.error("Supabase INSERT ERROR =>", error);
      bookingMessage.textContent = "Error while saving. Please try again.";
      bookingMessage.style.color = "red";
      return;
    }

    console.log("✅ Booking saved in Supabase", data);

    // 2) Backend ko call karo (WhatsApp + Email)
    try {
      const resp = await fetch("http://localhost:4000/notify-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          package_name,
          destination,
          full_name,
          email,
          phone,
          start_date,
          end_date,
          adults,
          children,
          preferences,
        }),
      });

      const json = await resp.json();
      console.log("Backend notify response =>", json);

      if (!resp.ok) {
        console.error("Notify failed:", json);
      }
    } catch (err) {
      console.error("Backend notify fetch error =>", err);
    }

    // 3) SUCCESS message front-end pe
    bookingMessage.textContent =
      "🎉 Booking request saved! Our team will contact you shortly.";
    bookingMessage.style.color = "var(--accent-3)";

    // Form reset
    bookingForm.reset();
    packageInput.value = pkgFromUrl || "Custom holiday enquiry";
    destinationInput.value = destFromUrl || "To be decided";
  });
});
// example booking page par:
localStorage.setItem("bookingName", "Piyush Kumar");
localStorage.setItem("bookingEmail", "piyush@gmail.com");
localStorage.setItem("bookingPhone", "+91 9876543210");
localStorage.setItem("bookingPackage", "Goa Holiday 3N/4D");
localStorage.setItem("bookingDate", "10 Jan 2025");
localStorage.setItem("bookingTravellers", "2 Adults");
localStorage.setItem("bookingAmount", "25000"); // number only
localStorage.setItem("bookingGstPercent", "5");

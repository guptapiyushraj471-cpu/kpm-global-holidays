// booking-details.js
// URL: booking-details.html?id=BOOKING_ID
// Supabase se booking read karke page pe dikhata hai
// + WhatsApp & Email buttons banata hai

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Supabase client
  const SUPABASE_URL = "https://hqpkihlwodmkymklyict.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxcGtpaGx3b2Rta3lta2x5aWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTIwNTUsImV4cCI6MjA3OTUyODA1NX0.TzINeb5iOiahigBteOxxrGLxBCc1_hQGs6mRzSMeR5w";

  const supabaseClient = window.supabaseClient
    ? window.supabaseClient
    : supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 2. URL se id nikaalo
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const titleEl = document.getElementById("booking-title");
  const subtitleEl = document.getElementById("booking-subtitle");
  const idLabel = document.getElementById("booking-id-label");
  const infoEl = document.getElementById("actions-info");

  if (!id) {
    if (titleEl) titleEl.textContent = "No booking ID found";
    if (subtitleEl) subtitleEl.textContent =
      "URL me ?id=123 jaisa booking id pass karo.";
    if (idLabel) idLabel.textContent = "#ID – missing";
    return;
  }

  idLabel.textContent = `#ID – ${id}`;
  subtitleEl.textContent = "Fetching booking from Supabase...";

  // 3. Supabase se booking fetch
  const { data, error } = await supabaseClient
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error("Error loading booking:", error);
    if (titleEl) titleEl.textContent = "Booking not found";
    if (subtitleEl)
      subtitleEl.textContent =
        "Is ID ke liye koi booking nahi mili. Supabase table check karo.";
    if (infoEl) infoEl.textContent = "Could not load booking.";
    return;
  }

  // 4. DOM me values bharna
  if (titleEl)
    titleEl.textContent = data.package_name || "Booking details";

  if (subtitleEl) {
    const name = data.full_name || "Traveler";
    const dest = data.destination || data.package_name || "Trip";
    subtitleEl.textContent = `${name} • ${dest}`;
  }

  const metaPackage = document.getElementById("meta-package");
  const metaDestination = document.getElementById("meta-destination");
  const metaName = document.getElementById("meta-name");
  const metaEmail = document.getElementById("meta-email");
  const metaPhone = document.getElementById("meta-phone");
  const metaDates = document.getElementById("meta-dates");
  const metaGuests = document.getElementById("meta-guests");
  const metaCreated = document.getElementById("meta-created");
  const metaPrefs = document.getElementById("meta-preferences");

  if (metaPackage) metaPackage.textContent = data.package_name || "—";
  if (metaDestination) metaDestination.textContent = data.destination || "—";
  if (metaName) metaName.textContent = data.full_name || "—";
  if (metaEmail) metaEmail.textContent = data.email || "—";
  if (metaPhone) metaPhone.textContent = data.phone || "—";

  if (metaDates) {
    const s = data.start_date || "—";
    const e = data.end_date || "—";
    metaDates.textContent = `${s} → ${e}`;
  }

  if (metaGuests) {
    const adults = data.adults ?? 0;
    const children = data.children ?? 0;
    metaGuests.textContent = `${adults} adults, ${children} children`;
  }

  if (metaCreated) {
    const created = data.created_at || "";
    metaCreated.textContent = created ? new Date(created).toLocaleString() : "—";
  }

  if (metaPrefs) {
    metaPrefs.textContent = data.preferences || "No special requests.";
  }

  // 5. WhatsApp + Email buttons
  const btnWhatsApp = document.getElementById("btn-whatsapp");
  const btnEmail = document.getElementById("btn-email");

  // Phone ko digits me clean karna
  const rawPhone = (data.phone || "").toString();
  const digitsOnly = rawPhone.replace(/\D/g, ""); // sirf 0–9

  if (btnWhatsApp && digitsOnly.length >= 8) {
    const fullPhone = digitsOnly.startsWith("91") ? digitsOnly : "91" + digitsOnly;

    const msg = encodeURIComponent(
      `Hi ${data.full_name || ""}, this is KPM Global Holidays regarding your booking for ${data.destination || data.package_name || "your trip"}.`
    );

    const waUrl = `https://wa.me/${fullPhone}?text=${msg}`;

    btnWhatsApp.disabled = false;
    btnWhatsApp.addEventListener("click", () => {
      window.open(waUrl, "_blank");
    });
  } else if (infoEl) {
    infoEl.textContent =
      "Phone number missing/invalid – WhatsApp button disabled.";
  }

  if (btnEmail && data.email) {
    const subject = encodeURIComponent(
      `Your KPM Global Holidays booking – ${data.destination || data.package_name || ""}`
    );
    const body = encodeURIComponent(
      `Hi ${data.full_name || ""},\n\n` +
        `Thank you for your booking with KPM Global Holidays.\n\n` +
        `Package: ${data.package_name || ""}\n` +
        `Destination: ${data.destination || ""}\n` +
        `Dates: ${data.start_date || ""} to ${data.end_date || ""}\n` +
        `Guests: ${data.adults ?? 0} adults, ${data.children ?? 0} children\n\n` +
        `We'll get back to you shortly with payment details and confirmations.\n\n` +
        `Regards,\nKPM Global Holidays`
    );

    const mailtoLink = `mailto:${data.email}?subject=${subject}&body=${body}`;

    btnEmail.disabled = false;
    btnEmail.addEventListener("click", () => {
      window.location.href = mailtoLink;
    });
  } else if (infoEl) {
    infoEl.textContent =
      (infoEl.textContent ? infoEl.textContent + " " : "") +
      "Email missing – email button disabled.";
  }

  if (!infoEl.textContent) {
    infoEl.textContent = "Booking loaded successfully.";
  }
});

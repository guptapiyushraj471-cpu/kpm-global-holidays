// order.js – handles loading & filtering orders on order.html

document.addEventListener("DOMContentLoaded", () => {
  // Yeh file sirf order.html pe kaam kare
  const tableBody = document.getElementById("orderTableBody");
  if (!tableBody) return;

  let allOrders = [];

  // Orders load karo
  fetch("order.json")
    .then((res) => res.json())
    .then((data) => {
      allOrders = data || [];
      renderOrders(allOrders);
      updateSummary(allOrders);
      initOrderFilters(allOrders);
    })
    .catch((err) => {
      console.error("Error loading orders:", err);
      const errEl = document.getElementById("orderError");
      const summary = document.getElementById("orderSummary");
      if (errEl) errEl.style.display = "block";
      if (summary) summary.textContent = "Could not load orders.";
    });

  function renderOrders(orders) {
    const tbody = document.getElementById("orderTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!orders.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 7;
      td.textContent = "No orders found for this filter.";
      td.style.padding = "10px 6px";
      tbody.appendChild(tr);
      tr.appendChild(td);
      return;
    }

    orders.forEach((order) => {
      const tr = document.createElement("tr");

      const amountFormatted = Number(order.amount || 0).toLocaleString("en-IN");

      tr.innerHTML = `
        <td style="padding:8px 6px;">${order.id}</td>
        <td style="padding:8px 6px;">${order.customerName}</td>
        <td style="padding:8px 6px;">${order.destination}</td>
        <td style="padding:8px 6px;">${order.packageName}</td>
        <td style="padding:8px 6px;">${order.travelDates}</td>
        <td style="padding:8px 6px;">₹ ${amountFormatted}</td>
        <td style="padding:8px 6px; text-transform:capitalize;">${order.status}</td>
      `;

      tbody.appendChild(tr);
    });
  }

  function updateSummary(orders) {
    const summary = document.getElementById("orderSummary");
    if (!summary) return;

    const total = orders.length;
    const confirmed = orders.filter((o) => o.status === "confirmed").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const newOnes = orders.filter((o) => o.status === "new").length;

    summary.textContent = `Total orders: ${total} • New: ${newOnes} • Confirmed: ${confirmed} • Cancelled: ${cancelled}`;
  }

  function initOrderFilters(all) {
    const group = document.getElementById("orderFilters");
    if (!group) return;

    group.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;

      group.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");

      const status = btn.getAttribute("data-status") || "all";
      let filtered = all;

      if (status !== "all") {
        filtered = all.filter((o) => o.status === status);
      }

      renderOrders(filtered);
      updateSummary(filtered);
    });
  }
});

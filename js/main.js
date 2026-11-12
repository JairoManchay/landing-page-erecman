window.sr = ScrollReveal();

sr.reveal(".top", {
  duration: 1500,
  origin: "top",
  distance: "70px",
});

sr.reveal(".left", {
  duration: 2000,
  origin: "left",
  distance: "70px",
});

sr.reveal(".rigth", {
  duration: 2000,
  origin: "right",
  distance: "70px",
});

sr.reveal(".bottom", {
  duration: 2000,
  origin: "bottom",
  distance: "70px",
});

const CHRISTMAS_CAMPAIGN = {
  enabled: true,
  promotionalPrice: 269.9,
  regularPrice: 299,
  productQuantity: 2,
};

const WHATSAPP_NUMBER = "51970396146";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  document.querySelectorAll(".zoom-in").forEach(function (element) {
    let scale = 1;
    let direction = 1;

    window.setInterval(function () {
      scale += direction * 0.02;
      if (scale >= 1.2) direction = -1;
      if (scale <= 1) direction = 1;
      element.style.transform = `scale(${scale})`;
    }, 100);
  });
}

document.querySelectorAll(".carrousel-wrapper").forEach(function (wrapper) {
  const track = wrapper.querySelector(".carrousel");
  const prev = wrapper.querySelector(".carrousel-arrow--prev");
  const next = wrapper.querySelector(".carrousel-arrow--next");

  function update() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    wrapper.classList.toggle("is-scrollable", maxScroll > 1);
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= maxScroll - 1;
  }

  function step() {
    const item = track.querySelector(".carrousel-item");
    return item ? item.offsetWidth + 20 : track.clientWidth;
  }

  prev.addEventListener("click", function () {
    track.scrollBy({ left: -step(), behavior: "smooth" });
  });
  next.addEventListener("click", function () {
    track.scrollBy({ left: step(), behavior: "smooth" });
  });

  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("load", update);
  update();
});

const orderModal = document.querySelector("#order-modal");
const orderForm = document.querySelector("#order-form");

if (orderModal && orderForm) {
  const formMessage = document.querySelector("#order-form-message");
  const steps = orderModal.querySelectorAll("[data-step]");
  const indicators = orderModal.querySelectorAll("[data-step-indicator]");
  const triggerButtons = document.querySelectorAll("[data-order-trigger]");
  const promotionInputs = orderModal.querySelectorAll('input[name="promotion"]');
  const destinationInputs = orderModal.querySelectorAll('input[name="destination"]');
  const provinceNotice = document.querySelector("#province-notice");
  const provinceAdvance = document.querySelector("#province-advance");
  let currentStep = 1;
  let lastFocusedElement = null;

  function money(value) {
    return `S/${value.toFixed(2).replace(".", ",")}`;
  }

  function christmasPrice() {
    return CHRISTMAS_CAMPAIGN.enabled
      ? CHRISTMAS_CAMPAIGN.promotionalPrice
      : CHRISTMAS_CAMPAIGN.regularPrice;
  }

  function selectedPromotion() {
    const selected = orderModal.querySelector('input[name="promotion"]:checked');
    const isChristmas = selected && selected.value === "christmas";
    return {
      key: isChristmas ? "christmas" : "individual",
      name: isChristmas ? "Pack Especial Navidad" : "Pide Especial",
      quantity: isChristmas ? CHRISTMAS_CAMPAIGN.productQuantity : 1,
      price: isChristmas ? christmasPrice() : 150,
    };
  }

  function refreshCampaignLabels() {
    const card = orderModal.querySelector('[data-promotion-card="christmas"]');
    const offerPrice = document.querySelector(".section__offer-two-image .container__info-now strong");
    if (card) {
      const price = card.querySelector("b");
      if (price) price.textContent = money(christmasPrice());
      const previous = card.querySelector("s");
      if (previous) previous.textContent = money(CHRISTMAS_CAMPAIGN.regularPrice);
      const label = card.querySelector("em");
      if (label) label.hidden = !CHRISTMAS_CAMPAIGN.enabled;
    }
    if (offerPrice) offerPrice.textContent = money(christmasPrice());
  }

  function setMessage(message) {
    formMessage.textContent = message;
  }

  function setStep(stepNumber) {
    currentStep = stepNumber;
    steps.forEach(function (step) {
      const isActive = Number(step.dataset.step) === stepNumber;
      step.hidden = !isActive;
      step.classList.toggle("is-active", isActive);
    });
    indicators.forEach(function (indicator) {
      indicator.classList.toggle("is-active", Number(indicator.dataset.stepIndicator) <= stepNumber);
    });
    setMessage("");
  }

  function showError(id, message) {
    const error = orderModal.querySelector(`[data-error-for="${id}"]`);
    const input = document.getElementById(id);
    if (error) error.textContent = message;
    if (input) input.setAttribute("aria-invalid", "true");
  }

  function clearErrors() {
    orderModal.querySelectorAll(".order-error").forEach(function (error) {
      error.textContent = "";
    });
    orderModal.querySelectorAll("[aria-invalid]").forEach(function (input) {
      input.removeAttribute("aria-invalid");
    });
  }

  function validateStep(stepNumber) {
    clearErrors();
    setMessage("");
    if (stepNumber === 1) {
      let valid = true;
      ["customer-name", "customer-phone"].forEach(function (id) {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
          showError(id, "Este campo es obligatorio.");
          valid = false;
        }
      });
      if (!valid) setMessage("Completa los datos obligatorios para continuar.");
      return valid;
    }

    const destination = orderModal.querySelector('input[name="destination"]:checked');
    const deliveryMethod = orderModal.querySelector('input[name="deliveryMethod"]:checked');
    const requiredFields = ["department", "province", "district", "address"];
    let valid = true;

    if (!destination) {
      setMessage("Selecciona Lima o Provincia.");
      valid = false;
    }
    if (!deliveryMethod) {
      setMessage("Selecciona un método de entrega.");
      valid = false;
    }
    requiredFields.forEach(function (id) {
      const input = document.getElementById(id);
      if (!input.value.trim()) {
        showError(id, "Este campo es obligatorio.");
        valid = false;
      }
    });
    if (destination && destination.value === "Provincia" && !provinceAdvance.checked) {
      setMessage("Acepta la condición del adelanto de S/40 para continuar.");
      valid = false;
    }
    if (!valid && !formMessage.textContent) {
      setMessage("Completa los datos obligatorios para continuar.");
    }
    return valid;
  }

  function addSummaryRow(container, label, value) {
    const row = document.createElement("p");
    const labelElement = document.createElement("span");
    const valueElement = document.createElement("strong");
    labelElement.textContent = label;
    valueElement.textContent = value;
    row.append(labelElement, valueElement);
    container.appendChild(row);
  }

  function renderSummary() {
    const summary = document.querySelector("#order-summary");
    const promotion = selectedPromotion();
    const destination = orderModal.querySelector('input[name="destination"]:checked').value;
    const deliveryMethod = orderModal.querySelector('input[name="deliveryMethod"]:checked').value;
    summary.replaceChildren();
    addSummaryRow(summary, "Promoción", promotion.name);
    addSummaryRow(summary, "Cantidad", `${promotion.quantity} frasco${promotion.quantity > 1 ? "s" : ""}`);
    addSummaryRow(summary, "Precio", money(promotion.price));
    addSummaryRow(summary, "Destino", destination);
    addSummaryRow(summary, "Entrega", deliveryMethod);
    addSummaryRow(summary, "Cliente", document.querySelector("#customer-name").value.trim());
    addSummaryRow(summary, "Celular", document.querySelector("#customer-phone").value.trim());
    addSummaryRow(summary, "Departamento", document.querySelector("#department").value);
    addSummaryRow(summary, "Provincia", document.querySelector("#province").value.trim());
    addSummaryRow(summary, "Distrito", document.querySelector("#district").value.trim());
    addSummaryRow(summary, "Dirección/agencia", document.querySelector("#address").value.trim());
    const reference = document.querySelector("#reference").value.trim();
    if (reference) addSummaryRow(summary, "Referencia", reference);
    if (destination === "Provincia") addSummaryRow(summary, "Adelanto de envío", "S/40 pendiente de coordinar");
  }

  function openModal(trigger) {
    lastFocusedElement = document.activeElement;
    const promotion = trigger.dataset.orderTrigger === "christmas" && CHRISTMAS_CAMPAIGN.enabled
      ? "christmas"
      : "individual";
    const input = orderModal.querySelector(`input[name="promotion"][value="${promotion}"]`);
    if (input) input.checked = true;
    refreshCampaignLabels();
    setStep(1);
    orderModal.classList.add("is-open");
    orderModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("order-modal-open");
    orderModal.querySelector(".order-modal__close").focus();
  }

  function closeModal() {
    orderModal.classList.remove("is-open");
    orderModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("order-modal-open");
    setStep(1);
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function buildWhatsAppMessage() {
    const promotion = selectedPromotion();
    const destination = orderModal.querySelector('input[name="destination"]:checked').value;
    const deliveryMethod = orderModal.querySelector('input[name="deliveryMethod"]:checked').value;
    const reference = document.querySelector("#reference").value.trim() || "No indicada";
    const advance = destination === "Provincia" ? "\nADELANTO DE ENVÍO:\nS/40 pendientes de coordinar" : "";
    return [
      "Hola, quiero confirmar un pedido de Erecman Plus.",
      "",
      "PROMOCIÓN:",
      `${promotion.name} — ${promotion.quantity} frasco${promotion.quantity > 1 ? "s" : ""}`,
      "",
      `PRECIO:\n${money(promotion.price)}`,
      `DESTINO:\n${destination}${advance}`,
      "",
      "DATOS DEL CLIENTE:",
      `Nombre: ${document.querySelector("#customer-name").value.trim()}`,
      `Celular: ${document.querySelector("#customer-phone").value.trim()}`,
      "",
      "ENTREGA:",
      `Departamento: ${document.querySelector("#department").value}`,
      `Provincia: ${document.querySelector("#province").value.trim()}`,
      `Distrito: ${document.querySelector("#district").value.trim()}`,
      `Dirección: ${document.querySelector("#address").value.trim()}`,
      `Referencia: ${reference}`,
      `Método: ${deliveryMethod}`,
      "",
      "Quisiera confirmar mi pedido y coordinar el pago y la entrega.",
    ].join("\n");
  }

  triggerButtons.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      openModal(trigger);
    });
  });

  orderModal.querySelectorAll("[data-order-close]").forEach(function (closeButton) {
    closeButton.addEventListener("click", closeModal);
  });

  promotionInputs.forEach(function (input) {
    input.addEventListener("change", refreshCampaignLabels);
  });

  destinationInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      const isProvince = input.value === "Provincia" && input.checked;
      provinceNotice.hidden = !isProvince;
      if (!isProvince) provinceAdvance.checked = false;
    });
  });

  orderModal.querySelectorAll("[data-next-step]").forEach(function (button) {
    button.addEventListener("click", function () {
      const nextStep = Number(button.dataset.nextStep);
      if (!validateStep(currentStep)) return;
      if (nextStep === 3) renderSummary();
      setStep(nextStep);
    });
  });

  orderModal.querySelectorAll("[data-prev-step]").forEach(function (button) {
    button.addEventListener("click", function () {
      setStep(Number(button.dataset.prevStep));
    });
  });

  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateStep(2)) {
      setStep(2);
      return;
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    window.open(url, "_blank", "noopener");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && orderModal.classList.contains("is-open")) {
      closeModal();
    }
    if (event.key !== "Tab" || !orderModal.classList.contains("is-open")) return;
    const focusable = orderModal.querySelectorAll("button, input, select, [href]");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  refreshCampaignLabels();
}

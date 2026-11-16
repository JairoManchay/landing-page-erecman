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

const PACK_PROMOTION = {
  enabled: true,
  promotionalPrice: 269.9,
  regularPrice: 299,
  productQuantity: 2,
};

const WHATSAPP_NUMBER = "51970396146";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  document.querySelectorAll(".zoom-in:not([data-order-trigger])").forEach(function (element) {
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
    return `S/${Number.isInteger(value) ? value : value.toFixed(2)}`;
  }

  function normalizarCelularPeru(numero) {
    let limpio = String(numero).replace(/\D/g, "");
    if (limpio.length === 11 && limpio.startsWith("51")) {
      limpio = limpio.slice(2);
    }
    return limpio;
  }

  function validarCelularPeru(numero) {
    return /^9\d{8}$/.test(normalizarCelularPeru(numero));
  }

  function packPrice() {
    return PACK_PROMOTION.enabled
      ? PACK_PROMOTION.promotionalPrice
      : PACK_PROMOTION.regularPrice;
  }

  function selectedPromotion() {
    const selected = orderModal.querySelector('input[name="promotion"]:checked');
    const isPack = selected && selected.value === "pack";
    return {
      key: isPack ? "pack" : "individual",
      name: isPack ? "Especial Pack" : "Pide Especial",
      quantity: isPack ? PACK_PROMOTION.productQuantity : 1,
      price: isPack ? packPrice() : 150,
    };
  }

  function paymentBreakdown(promotion, destination) {
    const advanceRequired = destination === "Provincia" ? 40 : 0;
    return {
      productPrice: promotion.price,
      advanceRequired,
      advancePaid: 0,
      estimatedBalance: promotion.price - advanceRequired,
      deliveryAdditional: "Por confirmar, si aplica",
    };
  }

  function refreshCampaignLabels() {
    const card = orderModal.querySelector('[data-promotion-card="pack"]');
    const offerPrice = document.querySelector(".section__offer-two-image .container__info-now strong");
    if (card) {
      const price = card.querySelector("b");
      if (price) price.textContent = money(packPrice());
      const previous = card.querySelector("s");
      if (previous) previous.textContent = money(PACK_PROMOTION.regularPrice);
      const label = card.querySelector("em");
      if (label) label.hidden = !PACK_PROMOTION.enabled;
    }
    if (offerPrice) offerPrice.textContent = money(packPrice());
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
      const number = Number(indicator.dataset.stepIndicator);
      indicator.classList.toggle("is-active", number === stepNumber);
      indicator.classList.toggle("is-complete", number < stepNumber);
      if (number === stepNumber) indicator.setAttribute("aria-current", "step");
      else indicator.removeAttribute("aria-current");
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
      const customerName = document.getElementById("customer-name");
      const customerPhone = document.getElementById("customer-phone");
      if (!customerName.value.trim()) {
        showError("customer-name", "Este campo es obligatorio.");
        valid = false;
      }
      if (!customerPhone.value.trim()) {
        showError("customer-phone", "Este campo es obligatorio.");
        valid = false;
      } else if (!validarCelularPeru(customerPhone.value)) {
        showError("customer-phone", "Ingresa un número de celular peruano válido de 9 dígitos.");
        valid = false;
      } else {
        customerPhone.value = normalizarCelularPeru(customerPhone.value);
      }
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
    const productSummary = document.querySelector("#order-summary-product");
    const promotion = selectedPromotion();
    const destination = orderModal.querySelector('input[name="destination"]:checked').value;
    const deliveryMethod = orderModal.querySelector('input[name="deliveryMethod"]:checked').value;
    const payment = paymentBreakdown(promotion, destination);
    productSummary.replaceChildren();
    const image = document.createElement("img");
    image.src = orderModal.querySelector(`[data-promotion-card="${promotion.key}"] img`).getAttribute("src");
    image.alt = "Frasco de Erecman Plus";
    const productDetails = document.createElement("div");
    const productName = document.createElement("strong");
    productName.textContent = promotion.name;
    const productInfo = document.createElement("span");
    productInfo.textContent = `${promotion.quantity} frasco${promotion.quantity > 1 ? "s" : ""}`;
    productDetails.append(productName, productInfo);
    const productPrice = document.createElement("strong");
    productPrice.className = "order-summary-price";
    productPrice.textContent = money(payment.productPrice);
    productSummary.append(image, productDetails, productPrice);
    summary.replaceChildren();
    function section(title, paymentSection = false) {
      const card = document.createElement("section");
      card.className = "order-summary-section" + (paymentSection ? " order-summary-section--payment" : "");
      const heading = document.createElement("h3");
      heading.textContent = title;
      card.append(heading);
      summary.append(card);
      return card;
    }
    const financialSummary = section("Resumen económico", true);
    const deliverySummary = section("Datos de entrega");
    addSummaryRow(financialSummary, "Precio del producto", money(payment.productPrice));
    if (destination === "Provincia") {
      addSummaryRow(financialSummary, "Adelanto requerido para provincia", money(payment.advanceRequired));
      addSummaryRow(financialSummary, "Estado del adelanto", "Pendiente de coordinar");
      addSummaryRow(financialSummary, "Saldo estimado tras adelanto", money(payment.estimatedBalance));
      addSummaryRow(financialSummary, "Delivery", "No incluido; por confirmar");
    } else {
      addSummaryRow(financialSummary, "Delivery", payment.deliveryAdditional);
    }
    addSummaryRow(deliverySummary, "Destino", destination);
    addSummaryRow(deliverySummary, "Entrega", deliveryMethod);
    addSummaryRow(deliverySummary, "Nombre", document.querySelector("#customer-name").value.trim());
    addSummaryRow(deliverySummary, "Celular / WhatsApp", document.querySelector("#customer-phone").value.trim());
    addSummaryRow(deliverySummary, "Departamento", document.querySelector("#department").value);
    addSummaryRow(deliverySummary, "Provincia", document.querySelector("#province").value.trim());
    addSummaryRow(deliverySummary, "Distrito", document.querySelector("#district").value.trim());
    addSummaryRow(deliverySummary, "Dirección/agencia", document.querySelector("#address").value.trim());
    const reference = document.querySelector("#reference").value.trim();
    if (reference) addSummaryRow(deliverySummary, "Referencia", reference);
  }

  function openModal(trigger) {
    lastFocusedElement = document.activeElement;
    const promotion = trigger.dataset.orderTrigger === "pack" && PACK_PROMOTION.enabled
      ? "pack"
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
    const payment = paymentBreakdown(promotion, destination);
    const reference = document.querySelector("#reference").value.trim() || "No indicada";
    return [
      "Hola, quiero confirmar un pedido de Erecman Plus.",
      "",
      "PROMOCIÓN:",
      `${promotion.name} — ${promotion.quantity} frasco${promotion.quantity > 1 ? "s" : ""}`,
      "",
      `PRECIO DEL PRODUCTO:\n${money(payment.productPrice)}`,
      ...(destination === "Provincia"
        ? [
            `ADELANTO REQUERIDO:\n${money(payment.advanceRequired)}`,
            "ADELANTO: Pendiente de coordinar; no pagado",
            `SALDO ESTIMADO DEL PRODUCTO:\n${money(payment.estimatedBalance)}`,
            "DELIVERY: No incluido; por confirmar",
          ]
        : ["DELIVERY: Por confirmar, si aplica"]),
      `DESTINO:\n${destination}`,
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
      provinceAdvance.disabled = !isProvince;
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

// Keep the floating contact control clear of purchase actions as the page scrolls.
const floatingWhatsApp = document.querySelector('.whatsapp-float');
if (floatingWhatsApp) {
  const purchaseActions = [...document.querySelectorAll(
    '[data-order-trigger], .container__info, .section__offer-info, .section__price-title, h1, h2, h3, h4, button, label'
  )];
  let floatingCheckPending = false;
  function updateFloatingWhatsApp() {
    floatingCheckPending = false;
    const floating = floatingWhatsApp.getBoundingClientRect();
    const obstructsPurchase = purchaseActions.some(action => {
      const rect = action.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.left < floating.right + 8 &&
        rect.right > floating.left - 8 && rect.top < floating.bottom + 8 &&
        rect.bottom > floating.top - 8;
    });
    floatingWhatsApp.classList.toggle('is-obstructing', obstructsPurchase);
  }
  function scheduleFloatingWhatsAppCheck() {
    if (!floatingCheckPending) {
      floatingCheckPending = true;
      window.requestAnimationFrame(updateFloatingWhatsApp);
    }
  }
  window.addEventListener('scroll', scheduleFloatingWhatsAppCheck, { passive: true });
  window.addEventListener('resize', scheduleFloatingWhatsAppCheck);
  window.addEventListener('load', scheduleFloatingWhatsAppCheck);
  updateFloatingWhatsApp();
}

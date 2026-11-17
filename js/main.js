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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const consultationLink = document.getElementById("whatsapp-consulta");
const orderTriggers = document.querySelectorAll("[data-order-trigger]");

if (consultationLink) {
  consultationLink.href = WhatsAppOrder.link("Hola, quisiera recibir más información sobre Erecman Plus.");
  consultationLink.hidden = false;
  consultationLink.addEventListener("click", () => {
    window.dataLayer?.push({ event: "whatsapp_consulta_click" });
  });

  let frame = 0;
  function checkConsultationOverlap() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const button = consultationLink.getBoundingClientRect();
      const overlaps = [...orderTriggers].some(trigger => {
        const bounds = trigger.getBoundingClientRect();
        return bounds.left < button.right + 8 && bounds.right > button.left - 8 &&
          bounds.top < button.bottom + 8 && bounds.bottom > button.top - 8;
      });
      consultationLink.classList.toggle("is-obstructing", overlaps);
    });
  }
  window.addEventListener("scroll", checkConsultationOverlap, { passive: true });
  window.addEventListener("resize", checkConsultationOverlap);
  window.addEventListener("load", checkConsultationOverlap);
  checkConsultationOverlap();
}

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
  const formMessage = document.getElementById("order-form-message");
  const provinceNotice = document.getElementById("province-notice");
  const scrollArea = orderModal.querySelector(".order-modal__content");
  let lastFocusedElement = null;
  let activeMode = null;
  let navigatingToThanks = false;
  const catalog = window.ERECMAN_UBIGEO;
  const departmentField = document.getElementById("department");
  const provinceField = document.getElementById("province");
  const districtField = document.getElementById("district");
  const addressField = document.getElementById("address");
  const referenceField = document.getElementById("reference");
  const addressHelp = document.getElementById("address-help");

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
    return /^(?:\+?51)?9\d{8}$/.test(String(numero).replace(/[\s-]/g, ""));
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
    const advanceRequired = destination === "Shalom" ? 40 : 0;
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


  function setMessage(message) { formMessage.textContent = message; }

  function controlsFor(id) {
    const field = document.getElementById(id);
    return field ? [field] : [...orderForm.querySelectorAll(`input[name="${id}"]`)];
  }

  function showError(id, message) {
    const error = orderForm.querySelector(`[data-error-for="${id}"]`);
    if (error) error.textContent = message;
    controlsFor(id).filter(field => !field.disabled).forEach(field => field.setAttribute("aria-invalid", "true"));
  }

  function clearError(id) {
    const error = orderForm.querySelector(`[data-error-for="${id}"]`);
    if (error) error.textContent = "";
    controlsFor(id).forEach(field => field.removeAttribute("aria-invalid"));
  }

  function clearErrors() {
    orderForm.querySelectorAll(".order-error").forEach(error => { error.textContent = ""; });
    orderForm.querySelectorAll("[aria-invalid]").forEach(field => field.removeAttribute("aria-invalid"));
    setMessage("");
  }

  function prettyLocation(name) { return name.toLocaleLowerCase("es-PE").replace(/(^|[\s-])\p{L}/gu, letter => letter.toLocaleUpperCase("es-PE")); }
  function districtName(item) {
    if (item.code === "150101") return "Lima (Cercado de Lima)";
    if (item.code === "150118") return "Lurigancho (Chosica)";
    return prettyLocation(item.name);
  }
  function shippingMode() {
    const value = orderForm.querySelector('[name="destination"]:checked')?.value;
    return ["Lima", "Shalom"].includes(value) ? value : "";
  }
  function locationOptions(select, locations, placeholder, display = item => prettyLocation(item.name)) {
    const options = placeholder ? [new Option(placeholder, "")] : [];
    [...locations].sort((a,b)=>a.name.localeCompare(b.name,"es")).forEach(item=>options.push(new Option(display(item),item.code)));
    select.replaceChildren(...options);
  }
  function geographicSelection() {
    const department = catalog?.departments.find(item => item.code === departmentField.value);
    const province = department?.provinces.find(item => item.code === provinceField.value);
    const district = province?.districts.find(item => item.code === districtField.value);
    return { department, province, district };
  }
  function allowedProvinces(department) {
    if (!department) return [];
    return shippingMode() === "Lima" ? (department.code === "15" ? department.provinces.filter(p=>p.code === "1501") : []) : department.provinces;
  }
  function setFieldLabel(field,text) {
    const label=field.closest('.order-field').querySelector('span'),icon=label.querySelector('svg');label.replaceChildren();if(icon)label.append(icon);label.append(document.createTextNode(text));
  }
  function clearPickupFields() { addressField.value="";referenceField.value="";clearError("address"); }
  function updateDistrictOptions() {
    clearPickupFields();clearError("district");
    const lima = shippingMode() === "Lima";
    locationOptions(districtField,lima ? catalog.limaDistricts : [],"Selecciona tu distrito",districtName);
    districtField.disabled = !lima;
  }
  function updateProvinceOptions() {
    if(shippingMode() !== "Shalom")return;
    const department=catalog?.departments.find(d=>d.code===departmentField.value),provinces=allowedProvinces(department);
    locationOptions(provinceField,provinces,department?"Selecciona una provincia":"Selecciona un departamento");
    provinceField.disabled=!provinces.length;clearError("province");updateDistrictOptions();
  }
  function syncShippingMode() {
    const mode=shippingMode();if(mode===activeMode){return}activeMode=mode;
    for(const id of ["department","province","district","address","reference"])clearError(id);
    clearPickupFields();provinceNotice.hidden=!mode||mode==="Lima";
    for(const field of [departmentField,provinceField,districtField,addressField,referenceField]){field.value="";field.disabled=!mode||!catalog;field.closest('.order-field').hidden=false}
    districtField.required=mode==="Lima";districtField.closest(".order-field").hidden=mode==="Shalom";
    locationOptions(districtField,[],"Selecciona una provincia");locationOptions(provinceField,[],"Selecciona un departamento");locationOptions(departmentField,[],"Selecciona una modalidad de env\u00edo");
    setFieldLabel(provinceField,"Provincia *");setFieldLabel(addressField,mode==="Lima"?"Direcci\u00f3n exacta de entrega *":mode==="Shalom"?"Direcci\u00f3n de entrega *":"Direcci\u00f3n de entrega o agencia *");
    addressField.placeholder=mode==="Lima"?"Calle, n\u00famero y detalles de entrega":mode==="Shalom"?"Indica la agencia o courier a confirmar":"Selecciona primero la forma de env\u00edo";
    addressHelp.textContent=mode==="Lima"?"Confirma con el asesor la cobertura de delivery para tu distrito.":mode?"Confirma la agencia Shalom o courier y su cobertura con nuestro asesor.":"Selecciona la forma de env\u00edo para habilitar los campos de ubicaci\u00f3n.";
    if(mode&&!catalog){setMessage("No se pudo cargar el cat\u00e1logo de ubicaciones. Recarga la p\u00e1gina.");return}
    if(mode==="Lima"){
      const lima=catalog.departments.find(d=>d.code==="15");locationOptions(departmentField,[lima]);departmentField.disabled=true;
      locationOptions(provinceField,allowedProvinces(lima));provinceField.disabled=true;updateDistrictOptions();
    }else if(mode==="Shalom"){
      locationOptions(departmentField,catalog.departments,"Selecciona un departamento");provinceField.disabled=true;districtField.disabled=true;
    }
  }

  function validateForm() {
    clearErrors();let valid=true;const fail=(id,message)=>{showError(id,message);valid=false};
    const name=document.getElementById('customer-name'),phone=document.getElementById('customer-phone');
    if(!name.value.trim())fail('customer-name','Escribe tu nombre completo.');
    if(!validarCelularPeru(phone.value))fail('customer-phone','Ingresa 9 d\u00edgitos y empieza con 9. Puedes incluir +51.');else phone.value=normalizarCelularPeru(phone.value);
    const mode=shippingMode(),geo=geographicSelection();
    if(!mode)fail('destination','Selecciona una modalidad de env\u00edo.');
    else if(!catalog)fail('destination','No se pudo cargar el cat\u00e1logo de ubicaciones. Recarga la p\u00e1gina.');
    else{
      if(!geo.department||(mode==='Lima'&&geo.department.code!=='15'))fail('department','Selecciona un departamento v\u00e1lido para esta modalidad.');
      if(!allowedProvinces(geo.department).some(p=>p.code===geo.province?.code))fail('province','Selecciona una provincia v\u00e1lida para esta modalidad y departamento.');
      if(mode==='Lima'&&!geo.district)fail('district','Selecciona un distrito de la provincia elegida.');
      if(!addressField.value.trim())fail('address',mode==='Lima'?'Escribe la direcci\u00f3n exacta de entrega.':'Indica Shalom o el courier y lugar de recojo.');
    }
    if(!valid)setMessage('Revisa los campos indicados para continuar con tu pedido.');return valid;
  }
  function buildWhatsAppMessage() {
    const promotion=selectedPromotion(),mode=shippingMode(),payment=paymentBreakdown(promotion,mode),geo=geographicSelection();
    const shipping=mode==='Lima'?'Lima \u2014 Contraentrega':'Shalom';
    return [
      '\u{1F6D2} *NUEVO PEDIDO \u2014 ERECMAN PLUS*','',
      `\u{1F4E6} *Producto:* ${promotion.name}`,`\u{1F522} *Cantidad:* ${promotion.quantity} frasco${promotion.quantity>1?'s':''}`,`\u{1F4B0} *Precio:* ${money(payment.productPrice)}`,'',
      `\u{1F69A} *Env\u00edo:* ${shipping}`,
      ...(mode==='Lima'?['\u{1F4B5} *Pago:* Contraentrega']:[`\u{1F4B5} *Adelanto requerido:* ${money(payment.advanceRequired)}`,`\u{1F4B3} *Saldo tras el adelanto:* ${money(payment.estimatedBalance)}`,'\u23F3 *Estado:* Adelanto pendiente']), '',
      `\u{1F464} *Cliente:* ${document.getElementById('customer-name').value.trim()}`,`\u{1F4F1} *Celular:* ${document.getElementById('customer-phone').value.trim()}`,'',
      `\u{1F5FA}\uFE0F *Departamento:* ${prettyLocation(geo.department.name)}`,`\u{1F4CD} *Provincia:* ${prettyLocation(geo.province.name)}`,...(mode==='Lima'?[`\u{1F3D8}\uFE0F *Distrito:* ${districtName(geo.district)}`]:[]),
      `\u{1F3E0} *${mode==='Lima'?'Direcci\u00f3n':'Shalom o courier'}:* ${addressField.value.trim()}`,`\u{1F4DD} *Referencia:* ${referenceField.value.trim()||'No indicada'}`,'',
      'Cobertura y costo adicional de env\u00edo: por confirmar.',
      ...(mode==='Lima'?[]:['El adelanto no ha sido pagado; la diferencia se paga al recoger.']),
      mode==='Lima'?'\u2705 Deseo confirmar mi pedido.':'\u2705 Deseo coordinar mi pedido y el adelanto.'
    ].join('\n');
  }

  function openModal(trigger) {
    lastFocusedElement = trigger;
    const promotion = trigger.dataset.orderTrigger === "pack" && PACK_PROMOTION.enabled ? "pack" : "individual";
    orderForm.querySelector(`[name="promotion"][value="${promotion}"]`).checked = true;
    clearErrors();
    syncShippingMode();
    refreshCampaignLabels();
    orderModal.classList.add("is-open");
    orderModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("order-modal-open");
    scrollArea.scrollTop = 0;
    orderModal.querySelector(".order-modal__close").focus({ preventScroll: true });
  }

  function closeModal() {
    orderModal.classList.remove("is-open");
    orderModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("order-modal-open");
    if (lastFocusedElement?.isConnected) lastFocusedElement.focus({ preventScroll: true });
  }

  orderTriggers.forEach(trigger => trigger.addEventListener("click", event => {
    event.preventDefault();
    openModal(trigger);
  }));
  orderModal.querySelectorAll("[data-order-close]").forEach(button => button.addEventListener("click", closeModal));
  window.addEventListener("pageshow", () => {
    navigatingToThanks = false;
    if (!history.state?.returnFromWhatsApp) return;
    const { returnFromWhatsApp, ...state } = history.state;
    history.replaceState(state, "");
    closeModal();
    window.scrollTo({ top: 0, behavior: "instant" });
    history.scrollRestoration = "auto";
  });

  orderForm.addEventListener("input", event => {
    if (event.target.type === "radio" || event.target.type === "checkbox") return;
    clearError(event.target.id);
    if (!orderForm.querySelector('[aria-invalid="true"]')) setMessage("");
  });
  orderForm.addEventListener("change", event => {
    if (event.target.name === "destination") syncShippingMode();
    if (event.target.id === "department") updateProvinceOptions();
    if (event.target.id === "province") updateDistrictOptions();
    if (event.target.id === "district") clearPickupFields();
    if (event.target.name === "promotion") refreshCampaignLabels();

    clearError(event.target.type === "radio" ? event.target.name : event.target.id);
    if (!orderForm.querySelector('[aria-invalid="true"]')) setMessage("");
  });

  orderForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (navigatingToThanks) return;
    if (!validateForm()) {
      const firstInvalid = orderForm.querySelector('[aria-invalid="true"]:not(:disabled)');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ block: "center", behavior: prefersReducedMotion ? "auto" : "smooth" });
        firstInvalid.focus({ preventScroll: true });
      }
      return;
    }
    try {
      WhatsAppOrder.save(buildWhatsAppMessage());
      navigatingToThanks = true;
      const page = new URL("gracias/index.html", window.location.href);
      if (/^https?:$/.test(page.protocol) && page.pathname === "/gracias/index.html") {
        try {
          const route = await fetch("/gracias", { signal: AbortSignal.timeout(2500) });
          if (route.ok && (await route.text()).includes('id="order-ready"')) {
            page.pathname = "/gracias";
          }
        } catch {
          // Static previews can serve the file directly without the clean URL.
        }
      }
      history.replaceState({ ...history.state, returnFromWhatsApp: true }, "");
      history.scrollRestoration = "manual";
      window.location.assign(page.href);
    } catch (error) {
      navigatingToThanks = false;
      setMessage("No pudimos preparar la página de gracias. Habilita el almacenamiento de esta sesión e inténtalo de nuevo.");
      scrollArea.scrollTop = 0;
    }
  });

  document.addEventListener("keydown", event => {
    if (!orderModal.classList.contains("is-open")) return;
    if (event.key === "Escape") { event.preventDefault(); closeModal(); return; }
    if (event.key !== "Tab") return;
    const focusable = [...orderModal.querySelectorAll('button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.disabled && element.getClientRects().length > 0);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  syncShippingMode();
  refreshCampaignLabels();
}

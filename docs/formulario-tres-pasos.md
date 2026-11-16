# Formulario Erecman Plus: versión de tres pasos

Documento de conservación previo al rediseño de una sola página. Describe el comportamiento que se aprobó e incluye el HTML y la lógica del formulario tal como estaban antes de modificarlo.

## Estado de referencia

- Rama: feature/campana-navidena.
- Commit base: ee79e44. El botón rojo REALIZAR PEDIDO con caja y parpadeo era un cambio local posterior, también conservado en los extractos de este documento.
- Archivos de producción: index.html, css/style.css y js/main.js. Landing estática, sin framework ni dependencias adicionales.
- Recursos y evidencias previas: qa/final-form, qa/product-zoom, qa/button-visibility, qa/province-delivery y qa/summary-badges.
- Al iniciar el rediseño ya faltaba erecmanplus_version_final.zip en el árbol de trabajo. Esa eliminación no forma parte del rediseño.

## 1. Apertura y cierre del modal

Los cinco botones COMPRAR AHORA utilizan data-order-trigger y abren el mismo modal. Individual selecciona Pide Especial y pack selecciona Especial Pack si la promoción está activa. La posición de la landing se conserva, se bloquea el scroll del documento y se oculta WhatsApp flotante. X, fondo y Escape cierran el modal, restaurando el foco al botón de origen. Los datos permanecen al volver a abrirlo, pero el paso activo vuelve al primero.

En escritorio se usan dos columnas: panel rojo con marca, frasco original y beneficios; formulario blanco a la derecha. En móvil, el panel rojo se compacta en una cabecera. Solo el cuerpo del paso activo se desplaza; las acciones quedan accesibles abajo.

## 2. Paso 1: Datos principales

1. Elegir promoción mediante tarjetas con radio, imagen navideña, nombre, cantidad y precio.
2. Pide Especial: un frasco, S/150. Imagen imagen_de_un_solo_frasco.png.
3. Especial Pack: dos frascos, S/269.90; referencia tachada S/299 y Oferta temporal. Imagen imagen_frasco_doble_navideño.png.
4. Nombre completo obligatorio.
5. Celular / WhatsApp obligatorio: nueve dígitos y empieza con 9. Se acepta prefijo 51 o +51 y se normaliza antes de avanzar.
6. SIGUIENTE valida el paso y muestra errores junto al nombre o celular si corresponde.

La configuración PACK_PROMOTION centraliza enabled, promotionalPrice, regularPrice y productQuantity. Desactivar la promoción devuelve el pack a S/299.

## 3. Paso 2: Ubicación y entrega

1. Elegir Lima o Provincia.
2. Lima permite Entrega a domicilio o Envío por agencia Shalom; no exige adelanto.
3. Provincia oculta y deshabilita domicilio. Permite Shalom u Olva Courier.
4. Si domicilio estaba seleccionado y se cambia a Provincia, se selecciona Shalom. Al volver de courier a Lima también se selecciona Shalom.
5. Provincia muestra adelanto de S/40 y exige aceptación mediante checkbox. Es pendiente de coordinar, no pagado. Al volver a Lima se desmarca y deshabilita la aceptación.
6. Campos obligatorios: departamento (incluye todos los departamentos y Callao), provincia, distrito y dirección de entrega o agencia. Referencia opcional.
7. VOLVER conserva los datos. SIGUIENTE valida destino, método habilitado, campos y aceptación del adelanto, y genera el resumen.

## 4. Paso 3: Resumen del pedido

Se muestra el producto seleccionado, cantidad y precio. Debajo aparecen tres imágenes existentes: satisfacción garantizada, 100% natural y producción verificada.

El resumen económico incluye precio, adelanto requerido cuando corresponde, estado pendiente, saldo estimado y delivery por confirmar. Para el pack a Provincia: S/269.90 − S/40 = S/229.90. No se considera dinero recibido ni se descuenta dos veces.

Datos de entrega muestra destino, método, nombre, celular, departamento, provincia, distrito, dirección/agencia y referencia si existe. Se incluye únicamente el logo de Shalom u Olva elegido. Domicilio no lleva logo de agencia y solo está permitido para Lima.

En pantallas menores de 600 px, las etiquetas de entrega se colocan encima de su valor, con texto de 16 px y ajuste de direcciones largas. El cuadro económico mantiene sus dos columnas.

EDITAR vuelve al paso de entrega sin perder datos. El botón final local decía REALIZAR PEDIDO, con caja SVG, fondo rojo y parpadeo suave. Conservaba el submit de WhatsApp.

## 5. Mensaje y validaciones de WhatsApp

Número existente: 51970396146. El mensaje se construye con buildWhatsAppMessage(), se codifica con encodeURIComponent() y se abre mediante window.open en wa.me. No se envía automáticamente y no se confirma un pedido ni un pago dentro de la landing.

Orden del mensaje: saludo, promoción y cantidad, precio, adelanto/saldo/delivery según destino, destino, datos del comprador, ubicación, dirección, referencia y método. Referencia vacía se presenta como No indicada. El cierre solicita confirmar el pedido y coordinar pago y entrega.

## 6. Animación, recursos y accesibilidad

- Solo las imágenes del producto tienen zoom; los sellos y logos de agencia son estáticos.
- Miniaturas del Paso 1: 8%; resumen: 3%. Los frascos navideños se conservan sin recortes.
- Se respeta prefers-reduced-motion.
- Labels visibles, radios de 20 px, errores junto al campo, modal con role=dialog y aria-modal. El teclado contempla Tab y Escape.
- No hay cobros, solicitudes de tarjeta ni envío de datos a un servidor propio.

## 7. Orden para reconstruir la versión de tres pasos

1. Consultar este documento y los archivos del commit ee79e44 en una copia separada; no restaurar indiscriminadamente todo el repositorio.
2. Recuperar el bloque #order-modal y las reglas originales de modal en CSS. Los extractos de abajo conservan además el botón rojo local.
3. Recuperar la lógica de steps/indicators, setStep, validateStep y sus eventos SIGUIENTE/VOLVER.
4. Mantener PACK_PROMOTION, WHATSAPP_NUMBER, recursos originales y condiciones comerciales.
5. Revisar apertura desde los cinco botones; recorrer ambas promociones, Lima y Provincia; confirmar las cuentas y el mensaje sin enviar un pedido real.
6. Comprobar 375, 390, 768, 1366 y 1920 px, movimiento reducido, scroll interno, footer y textos largos.

## 8. Pruebas que verificaban esta versión

15 pruebas funcionales del formulario y WhatsApp; 79 comprobaciones de sellos, agencias y geometría en cinco anchos, más evidencias de las iteraciones previas. Los scripts de QA de tres pasos quedan como referencia histórica y no corresponden al formulario rediseñado.

## HTML conservado antes del cambio

```html
    <div class="order-modal" id="order-modal" aria-hidden="true">
        <div class="order-modal__backdrop" data-order-close></div>
        <section class="order-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
            <button class="order-modal__close" type="button" aria-label="Cerrar formulario"
                data-order-close>&times;</button>
            <div class="order-modal__visual">
                <div class="order-modal__visual-brand" aria-label="Erecman Plus">
                    <span>ERECMAN</span>
                    <strong>PLUS</strong>
                    <i aria-hidden="true"></i>
                </div>
                <img class="order-modal__campaign-image" src="./imgs/Frasco SupleVita con cápsulas doradas.png"
                    alt="Frasco de Erecman Plus">
                <ul class="order-benefits">
                    <li>
                        <span class="order-benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M13.2 2 5.5 13h5.1L9.8 22l8.7-12h-5.2L13.2 2Z" /></svg></span>
                        <span>Más energía</span>
                    </li>
                    <li>
                        <span class="order-benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M6 20v-7.5a2 2 0 0 1 4 0V15l1-7a2 2 0 0 1 4 .3l-.2 3.2.7-2.2a2 2 0 0 1 3.8 1.2l-1.6 6.3A4 4 0 0 1 13.8 20H6Z" /><path d="M6 13H4.8A2.8 2.8 0 0 0 2 15.8V20h4" /></svg></span>
                        <span>Mayor potencia</span>
                    </li>
                    <li>
                        <span class="order-benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /><path d="M15 7h4v4" /></svg></span>
                        <span>Mejor rendimiento</span>
                    </li>
                    <li>
                        <span class="order-benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.6Z" /></svg></span>
                        <span>Recupera tu confianza</span>
                    </li>
                </ul>
            </div>
            <div class="order-modal__content">
                <div class="order-modal__header">
                    <h2 id="order-modal-title"><span class="order-cart-icon" aria-hidden="true"></span>REALIZA TU PEDIDO
                    </h2>
                    <ol class="order-steps" aria-label="Progreso del pedido">
                        <li class="is-active" data-step-indicator="1">1. Datos principales</li>
                        <li data-step-indicator="2">2. Ubicación</li>
                        <li data-step-indicator="3">3. Resumen</li>
                    </ol>
                </div>
                <p class="order-form-message" id="order-form-message" role="alert"></p>

                <form id="order-form" novalidate>
                    <div class="order-step is-active" data-step="1">
                        <fieldset class="order-fieldset">
                            <legend>Paso 1: Datos principales</legend>
                            <p class="order-section-label">Selecciona tu promoción</p>
                            <div class="order-promotions">
                                <label class="order-promotion" data-promotion-card="individual">
                                    <input type="radio" name="promotion" value="individual" checked>
                                    <img src="./imgs/imagen_de_un_solo_frasco.png" alt=""
                                        aria-hidden="true">
                                    <span>
                                        <strong>Pide Especial</strong>
                                        <small>1 frasco</small>
                                        <b>S/150</b>
                                    </span>
                                </label>
                                <label class="order-promotion" data-promotion-card="pack">
                                    <input type="radio" name="promotion" value="pack">
                                    <img src="./imgs/imagen_frasco_doble_navideño.png" alt=""
                                        aria-hidden="true">
                                    <span>
                                        <strong>Especial Pack</strong>
                                        <small>2 frascos · Antes: <s>S/299</s></small>
                                        <b>S/269.90</b>
                                        <em>Oferta temporal</em>
                                    </span>
                                </label>
                            </div>
                            <p class="order-step-hint">En el siguiente paso te pediremos los datos de ubicación. Para
                                Provincia se solicita un adelanto de S/40.</p>
                            <div class="order-form-grid">
                                <label class="order-field">
                                    <span>Nombre completo *</span>
                                    <input id="customer-name" name="customerName" type="text" autocomplete="name"
                                        required>
                                    <small class="order-error" data-error-for="customer-name"></small>
                                </label>
                                <label class="order-field">
                                    <span>Celular / WhatsApp *</span>
                                    <input id="customer-phone" name="customerPhone" type="tel" inputmode="numeric"
                                        autocomplete="tel" aria-describedby="customer-phone-error" required>
                                    <small class="order-error" id="customer-phone-error"
                                        data-error-for="customer-phone"></small>
                                </label>
                            </div>
                        </fieldset>
                        <button class="order-button order-button--primary" type="button" data-next-step="2">SIGUIENTE
                            <span aria-hidden="true">→</span></button>
                    </div>

                    <div class="order-step" data-step="2" hidden>
                        <fieldset class="order-fieldset">
                            <legend>Paso 2: Ubicación y entrega</legend>
                            <div class="order-choice-group">
                                <span class="order-label">Destino *</span>
                                <label><input type="radio" name="destination" value="Lima" required> Lima</label>
                                <label><input type="radio" name="destination" value="Provincia" required>
                                    Provincia</label>
                            </div>
                            <div class="province-notice" id="province-notice" hidden>
                                <strong>Envíos a provincias:</strong> se solicita un adelanto de S/40, que se descontará
                                del importe pendiente de pago. Los detalles de entrega se confirmarán por WhatsApp.
                                <label><input id="province-advance" type="checkbox" disabled> Entiendo que debo
                                    adelantar S/40 para gestionar mi envío a provincia.</label>
                            </div>
                            <div class="order-choice-group">
                                <span class="order-label">Método de entrega *</span>
                                <label data-home-delivery><input type="radio" name="deliveryMethod" value="Entrega a domicilio" required>
                                    Entrega a domicilio</label>
                                <label><input type="radio" name="deliveryMethod" value="Envío por agencia Shalom" required>
                                    <span data-agency-delivery-label>Envío por agencia Shalom</span></label>
                                <label data-courier-delivery hidden><input type="radio" name="deliveryMethod" value="Envío por Olva Courier" required disabled>
                                    Envío por Olva Courier</label>
                            </div>
                            <div class="order-form-grid">
                                <label class="order-field">
                                    <span>Departamento *</span>
                                    <select id="department" name="department" required>
                                        <option value="">Selecciona un departamento</option>
                                        <option>Amazonas</option>
                                        <option>Áncash</option>
                                        <option>Apurímac</option>
                                        <option>Arequipa</option>
                                        <option>Ayacucho</option>
                                        <option>Cajamarca</option>
                                        <option>Callao</option>
                                        <option>Cusco</option>
                                        <option>Huancavelica</option>
                                        <option>Huánuco</option>
                                        <option>Ica</option>
                                        <option>Junín</option>
                                        <option>La Libertad</option>
                                        <option>Lambayeque</option>
                                        <option>Lima</option>
                                        <option>Loreto</option>
                                        <option>Madre de Dios</option>
                                        <option>Moquegua</option>
                                        <option>Pasco</option>
                                        <option>Piura</option>
                                        <option>Puno</option>
                                        <option>San Martín</option>
                                        <option>Tacna</option>
                                        <option>Tumbes</option>
                                        <option>Ucayali</option>
                                    </select>
                                    <small class="order-error" data-error-for="department"></small>
                                </label>
                                <label class="order-field">
                                    <span>Provincia *</span>
                                    <input id="province" name="province" type="text" required>
                                    <small class="order-error" data-error-for="province"></small>
                                </label>
                                <label class="order-field">
                                    <span>Distrito *</span>
                                    <input id="district" name="district" type="text" required>
                                    <small class="order-error" data-error-for="district"></small>
                                </label>
                                <label class="order-field">
                                    <span>Dirección de entrega o agencia *</span>
                                    <input id="address" name="address" type="text" required>
                                    <small class="order-error" data-error-for="address"></small>
                                </label>
                                <label class="order-field order-field--full">
                                    <span>Referencia</span>
                                    <input id="reference" name="reference" type="text">
                                </label>
                            </div>
                        </fieldset>
                        <div class="order-actions">
                            <button class="order-button order-button--secondary" type="button"
                                data-prev-step="1">VOLVER</button>
                            <button class="order-button order-button--primary" type="button"
                                data-next-step="3">SIGUIENTE <span aria-hidden="true">→</span></button>
                        </div>
                    </div>

                    <div class="order-step" data-step="3" hidden>
                        <fieldset class="order-fieldset">
                            <legend>Paso 3: Resumen del pedido</legend>
                            <div class="order-summary-product" id="order-summary-product"></div>
                            <ul class="order-summary-trust" aria-label="Garantías del producto">
                                <li><img src="./imgs/porciento_garantizado.png" alt="" width="80" height="80"><span>Satisfacción garantizada</span></li>
                                <li><img src="./imgs/porciento_natural.png" alt="" width="80" height="80"><span>100% natural</span></li>
                                <li><img src="./imgs/produccion_verificado.png" alt="" width="80" height="80"><span>Producción verificada</span></li>
                            </ul>
                            <div class="order-summary" id="order-summary"></div>
                            <p class="order-summary__note">Al continuar, se abrirá WhatsApp con el resumen de tu pedido
                                para que un asesor confirme la entrega y el pago.</p>
                        </fieldset>
                        <div class="order-actions">
                            <button class="order-button order-button--secondary" type="button"
                                data-prev-step="2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m16 3 5 5-12 12-6 1 1-6Z M14 5l5 5"/></svg>EDITAR</button>
                            <button class="order-button order-button--place-order" type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m12 3 9 5v8l-9 5-9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5V14"/></svg>REALIZAR PEDIDO</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    </div>

```

## JavaScript conservado antes del cambio

```js
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
    if (!deliveryMethod || deliveryMethod.disabled ||
        (destination && destination.value === "Provincia" && deliveryMethod.value === "Entrega a domicilio")) {
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
    const carrier = deliveryMethod.includes("Shalom")
      ? { image: "./imgs/salom.png", name: "Shalom" }
      : deliveryMethod.includes("Olva")
        ? { image: "./imgs/olva.png", name: "Olva Courier" }
        : null;
    if (carrier) {
      const carrierBlock = document.createElement("div");
      carrierBlock.className = "order-summary-carrier";
      const carrierImage = document.createElement("img");
      carrierImage.src = carrier.image;
      carrierImage.alt = carrier.name;
      carrierImage.width = 56;
      carrierImage.height = 56;
      const carrierText = document.createElement("div");
      const carrierLabel = document.createElement("span");
      carrierLabel.textContent = "Agencia seleccionada";
      const carrierName = document.createElement("strong");
      carrierName.textContent = carrier.name;
      carrierText.append(carrierLabel, carrierName);
      carrierBlock.append(carrierImage, carrierText);
      deliverySummary.append(carrierBlock);
    }
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

  function syncDeliveryOptions() {
    const isProvince = orderModal.querySelector('input[name="destination"]:checked')?.value === "Provincia";
    const home = orderModal.querySelector('[data-home-delivery]');
    const homeInput = home.querySelector('input');
    const agencyLabel = orderModal.querySelector('[data-agency-delivery-label]');
    const agencyInput = agencyLabel.closest('label').querySelector('input');
    const courier = orderModal.querySelector('[data-courier-delivery]');
    const courierInput = courier.querySelector('input');
    home.hidden = isProvince;
    homeInput.disabled = isProvince;
    courier.hidden = !isProvince;
    courierInput.disabled = !isProvince;
    agencyInput.value = "Env\u00edo por agencia Shalom";
    agencyLabel.textContent = agencyInput.value;
    if ((isProvince && homeInput.checked) || (!isProvince && courierInput.checked)) {
      homeInput.checked = false;
      courierInput.checked = false;
      agencyInput.checked = true;
    }
    provinceNotice.hidden = !isProvince;
    provinceAdvance.disabled = !isProvince;
    if (!isProvince) provinceAdvance.checked = false;
  }

  destinationInputs.forEach(function (input) {
    input.addEventListener("change", syncDeliveryOptions);
  });
  syncDeliveryOptions();

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


```

## Ajustes CSS finales conservados

Las bases anteriores del modal se encuentran en css/style.css del commit ee79e44. Este extracto conserva la cascada final vigente antes del redise?o.

```css
/* Responsive order layout: dimensions use px independently of the landing's rem scale. */
.order-modal { padding: 0; }
.order-modal__dialog { display: grid; width: min(94vw, 1080px); height: auto; max-height: min(86dvh, 760px); grid-template-rows: minmax(0, 1fr); grid-template-columns: 28% minmax(0, 1fr); border-radius: 16px; }
.order-modal__visual { display: flex; flex-direction: column; min-width: 0; min-height: 0; gap: 16px; padding: 24px 20px; justify-content: center; text-align: left; }
.order-modal__visual-brand { font-size: 25px; flex: 0 0 auto; }
.order-modal__visual img.order-modal__campaign-image { width: min(100%, 210px); height: 210px; max-height: 30dvh; flex: 0 1 auto; min-height: 0; margin: 0 auto; object-fit: contain; }
.order-benefits { gap: 4px; flex: 0 0 auto; }
.order-benefits li { min-height: 38px; gap: 8px; font-size: 14px; line-height: 1.4; }
.order-benefit-icon { width: 28px; height: 28px; flex: 0 0 28px; }
.order-benefit-icon svg { width: 18px; height: 18px; }
body.order-modal-open > .whatsapp-float { visibility: hidden; }
.order-modal .whatsapp-float { display: none; }
.order-modal__content { display: flex; flex-direction: column; min-width: 0; min-height: 0; padding: 0; }
.order-modal__header { margin: 0; padding: 24px 26px 12px; }
.order-modal__header h2 { font-size: 28px; margin: 4px 0 18px; padding-right: 22px; }
.order-modal__close { width: 44px; height: 44px; top: 8px; right: 8px; background: #fff; color: #ae1a39; border-color: #ead3d8; }
.order-form-message { margin: 0; min-height: 0; padding: 0 26px; font-size: 15px; line-height: 1.5; }
.order-form-message:empty { display: none; }
#order-form { display: flex; flex: 0 1 auto; flex-direction: column; min-height: 0; overflow: hidden; }
.order-step { flex: 0 1 auto; min-height: 0; overflow: hidden; }
.order-step .order-fieldset, .order-step[data-step="1"] .order-fieldset { flex: 1 1 auto; max-height: none; min-height: 0; overflow-y: auto; padding: 20px 26px; }
.order-step[data-step="1"] .order-fieldset { padding-bottom: 12px; }
.order-fieldset legend { float: left; width: 100%; font-size: 21px; line-height: 1.3; margin: 0 0 20px; }
.order-fieldset legend + * { clear: both; }
.order-actions, .order-step > .order-button { flex: 0 0 auto; margin: 0; padding: 16px 26px max(16px, env(safe-area-inset-bottom)); border-top: 1px solid #eee; background: #fff; }
.order-step > .order-button { width: calc(100% - 52px); margin: 12px 26px 16px; padding: 12px 16px; background: #cc1337; }
.order-actions { display: grid; grid-template-columns: 3fr 7fr; gap: 12px; }
.order-actions .order-button { width: 100%; margin: 0; }
.order-button { display: inline-flex; justify-content: center; align-items: center; gap: 8px; min-width: 0; min-height: 44px; padding: 12px; font-size: 15px; line-height: 1.35; border-radius: 9px; white-space: normal; }
.order-button svg { width: 20px; height: 20px; flex: 0 0 20px; }
.order-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
.order-steps li { display: flex; align-items: center; justify-content: center; min-width: 0; padding: 8px 6px; border: 1px solid #ddd; border-radius: 20px; color: #666; font-size: 13px; line-height: 1.3; text-align: center; }
.order-steps li.is-active { color: #cc1337; border-color: #cc1337; background: #fff1f4; }
.order-steps li.is-complete { color: #444; background: #f3f3f3; }
.order-field, .order-choice-group, .province-notice { font-size: 15px; line-height: 1.5; }
.order-error { font-size: 14px; line-height: 1.5; }
.order-error:empty { display: none; }
.order-choice-group label { min-height: 44px; padding: 6px 8px; border-radius: 6px; }
.province-notice label { min-height: 44px; line-height: 1.5; }
.order-choice-group input, .province-notice input, .order-promotion input { width: 20px; height: 20px; flex: 0 0 20px; }
.order-promotion > span { min-width: 0; }
.order-button--place-order { background: #cc1337; }
.order-field input, .order-field select { min-height: 46px; font-size: 16px; border-color: #999; }
.order-section-label { font-size: 18px; }
.order-promotion strong { font-size: 16px; line-height: 1.4; }
.order-promotion b { font-size: 20px; line-height: 1.35; }
.order-promotion small, .order-promotion em, .order-step-hint { font-size: 14px; line-height: 1.5; }
.order-promotion small, .order-step-hint { color: #505050; }
.order-summary-product { display: grid; grid-template-columns: 68px minmax(0, 1fr) auto; gap: 14px; padding: 16px; margin-bottom: 20px; }
.order-summary-product img { width: 68px; height: 92px; object-fit: contain; }
.order-summary-product strong { font-size: 18px; line-height: 1.4; }
.order-summary-product span { font-size: 15px; line-height: 1.5; }
.order-summary-product .order-summary-price { color: #ae1a39; font-size: 24px; white-space: nowrap; }
.order-summary { display: grid; gap: 20px; padding: 0; border: 0; background: none; font-size: 15px; line-height: 1.5; }
.order-summary-section { padding: 18px; border: 1px solid #ead3d8; border-radius: 10px; background: #fff; }
.order-summary-section h3 { margin: 0 0 16px; font-size: 18px; color: #333; }
.order-summary p { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: 16px; margin: 0 0 10px; }
.order-summary p:last-child { margin-bottom: 0; }
.order-summary strong { color: #333; font-weight: 500; text-align: left; overflow-wrap: anywhere; }
.order-summary-section--payment strong { text-align: right; }
.order-summary__note { margin: 20px 0 0; font-size: 15px; line-height: 1.5; }
/* Use the available height on intermediate screens, without a fixed minimum. */
@media (min-width: 600px) and (max-width: 1224px) {
 .order-modal__dialog { max-height: min(90dvh, 800px); }
}
/* Below 900px, a horizontal brand panel leaves enough width for the form. */
@media (max-width: 899px) {
 .order-modal__dialog { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); }
 .order-modal__visual { display: grid; grid-template-areas: "brand image" "benefits image"; grid-template-columns: minmax(0, 1fr) 90px; gap: 12px 16px; padding: 16px 48px 16px 20px; }
 .order-modal__visual-brand { grid-area: brand; font-size: 22px; transform: none; flex-direction: row; align-items: baseline; gap: 5px; line-height: 1.1; }
 .order-modal__visual-brand strong { margin-left: 0; }
 .order-modal__visual-brand i { display: none; }
 .order-modal__visual img.order-modal__campaign-image { grid-area: image; width: 90px; height: 112px; max-height: none; margin: 0; }
 .order-benefits { grid-area: benefits; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 12px; }
 .order-benefits li { min-width: 0; min-height: 28px; gap: 6px; font-size: 12px; border: 0; }
 .order-benefit-icon { width: 24px; height: 24px; flex: 0 0 24px; }
 .order-modal__header { padding-top: 16px; }
 .order-modal__header h2 { font-size: 24px; margin-bottom: 12px; }
}
@media (max-width: 599px) {
 .order-modal__dialog { width: calc(100vw - 16px); max-height: calc(100dvh - 16px); border-radius: 12px; }
 .order-modal__visual { grid-template-areas: "brand image" "benefits benefits"; grid-template-columns: minmax(0, 1fr) 60px; gap: 10px; padding: 14px 42px 14px 16px; }
 .order-modal__visual-brand { font-size: 21px; }
 .order-modal__visual img.order-modal__campaign-image { width: 60px; height: 66px; }
 .order-benefits { gap: 6px 10px; }
 .order-modal__header { padding: 12px 20px 8px; }
 .order-modal__header h2 { font-size: 22px; margin: 0 0 10px; }
 .order-steps { gap: 5px; }
 .order-steps li { font-size: 12px; padding: 6px 4px; }
 .order-promotions { grid-template-columns: minmax(0, 1fr); }
 .order-form-grid { grid-template-columns: minmax(0, 1fr); }
 .order-field--full { grid-column: auto; }
 .order-step .order-fieldset, .order-step[data-step="1"] .order-fieldset { padding: 20px; }
 .order-actions { padding: 12px 20px max(12px, env(safe-area-inset-bottom)); gap: 10px; }
 .order-button { font-size: 15px; padding: 10px 8px; }
 .order-step > .order-button { width: calc(100% - 40px); margin: 4px 20px max(12px, env(safe-area-inset-bottom)); }
 .order-summary-product { grid-template-columns: 56px minmax(0, 1fr); gap: 12px; }
 .order-summary-product img { width: 56px; height: 76px; grid-row: span 2; }
 .order-summary-product .order-summary-price { grid-column: 2; }
 .order-summary-section { padding: 16px; }
 .order-summary p { grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 12px; }
}
/* Keep a usable scrolling body when the visible mobile viewport shrinks. */
@media (max-width: 899px) and (max-height: 500px) {
 .order-modal__visual { grid-template-areas: "brand image" "benefits image"; grid-template-columns: minmax(0, 1fr) 44px; gap: 6px 10px; padding: 10px 40px 10px 12px; }
 .order-modal__visual-brand { font-size: 18px; }
 .order-modal__visual img.order-modal__campaign-image { width: 44px; height: 68px; }
 .order-benefits { gap: 4px; }
 .order-benefits li { font-size: 12px; gap: 4px; min-height: 24px; }
 .order-benefit-icon { width: 20px; height: 20px; flex-basis: 20px; }
 .order-benefit-icon svg { width: 14px; height: 14px; }
 .order-modal__header { padding: 8px 16px; }
 .order-modal__header h2 { font-size: 20px; margin-bottom: 8px; }
}

/* Focused purchase-button and floating WhatsApp visibility improvements. */
[data-order-trigger] .section__price-button-title,
[data-order-trigger] .section__offer-button-title { font-weight: 800; font-size: clamp(16px, 1.5vw, 20px); line-height: 1.25; letter-spacing: .035em; }
[data-order-trigger] .section__price-button-title::before,
[data-order-trigger] .section__offer-button-title::before { width: 2rem; height: 2rem; }
.whatsapp-float {
    position: fixed;
    right: max(20px, calc(env(safe-area-inset-right, 0px) + 12px));
    bottom: max(20px, calc(env(safe-area-inset-bottom, 0px) + 12px));
    z-index: 9999;
    display: block;
    width: 96px;
    height: 96px;
    padding: 5px;
    box-sizing: border-box;
    border: 0;
    border-radius: 50%;
    background: #25d366;
    box-shadow: 0 4px 16px rgba(0, 70, 34, .25);
    cursor: pointer;
}
.whatsapp-float svg {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform-origin: center;
    animation: purchase-button-pulse 3.5s ease-in-out .6s infinite;
}
.whatsapp-float:focus-visible { outline: 3px solid #075e54; outline-offset: 4px; }
.whatsapp-float.is-obstructing { visibility: hidden; }
@media (prefers-reduced-motion: reduce) {
    .whatsapp-float svg { animation: none; }
}

/* Province delivery choices and a readable mobile delivery summary. */
.order-choice-group label[hidden] { display: none; }
@media (max-width: 599px) {
    .order-summary-section:not(.order-summary-section--payment) p {
        grid-template-columns: minmax(0, 1fr);
        gap: 4px;
        margin-bottom: 16px;
    }
    .order-summary-section:not(.order-summary-section--payment) p > span {
        color: #666;
        font-size: 14px;
        line-height: 1.4;
    }
    .order-summary-section:not(.order-summary-section--payment) p > strong {
        min-width: 0;
        font-size: 16px;
        line-height: 1.5;
        text-align: left;
        overflow-wrap: anywhere;
    }
}

/* Existing product seals and the selected shipping carrier in the order summary. */
.order-summary-trust {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin: 0 0 24px;
    padding: 16px 8px;
    list-style: none;
    border: 1px solid #ead3d8;
    border-radius: 10px;
    background: #fff;
}
.order-summary-trust li { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0; text-align: center; }
.order-summary-trust img { display: block; width: 80px; max-width: 100%; height: 80px; object-fit: contain; }
.order-summary-trust span { font-size: 14px; line-height: 1.4; color: #505050; overflow-wrap: anywhere; }
.order-summary-carrier { display: flex; align-items: center; gap: 12px; padding: 0 0 16px; margin: 0 0 16px; border-bottom: 1px solid #ead3d8; }
.order-summary-carrier img { display: block; width: 56px; height: 56px; object-fit: contain; flex: 0 0 56px; }
.order-summary-carrier > div { min-width: 0; }
.order-summary-carrier span { display: block; color: #666; font-size: 14px; }
.order-summary-carrier strong { display: block; font-size: 16px; font-weight: 700; }
@media (max-width: 599px) {
    .order-summary-trust { gap: 8px; padding: 16px 8px; }
    .order-summary-trust img { width: 64px; height: 64px; }
}

/* Gentle red blink on the final order action without hiding its label. */
@keyframes place-order-blink {
    0%, 100% { background-color: #cc1337; box-shadow: 0 4px 12px rgba(174, 26, 57, .22); }
    50% { background-color: #a6112e; box-shadow: 0 4px 18px rgba(174, 26, 57, .48); }
}
.order-button--place-order { animation: place-order-blink 2.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
    .order-button--place-order { animation: none; }
}

```

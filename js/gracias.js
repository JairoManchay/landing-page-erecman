const pendingOrder = WhatsAppOrder.read();
const pageOrderId = history.state?.erecmanOrderId;

if (pendingOrder && (pageOrderId === pendingOrder.id || (!pageOrderId && !pendingOrder.visited))) {
  const whatsappLink = document.getElementById("continue-whatsapp");
  const spinner = document.getElementById("whatsapp-spinner");
  const status = document.getElementById("whatsapp-status");
  let openingWhatsApp = false;
  let leftForWhatsApp = false;
  function showManualOptions() {
    spinner.hidden = true;
    status.textContent = "Si WhatsApp no se abrió, pulsa el botón para enviar y confirmar tu pedido.";
  }

  function openWhatsApp() {
    showManualOptions();
    openingWhatsApp = true;
    window.location.replace(pendingOrder.url);
  }

  document.addEventListener("visibilitychange", () => {
    if (!openingWhatsApp) return;
    if (document.hidden) {
      leftForWhatsApp = true;
    } else if (leftForWhatsApp) {
      window.location.replace(document.querySelector(".thanks-home").href);
    }
  });

  whatsappLink.href = pendingOrder.url;
  whatsappLink.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openWhatsApp();
  });
  document.getElementById("no-order").hidden = true;
  document.getElementById("order-ready").hidden = false;

  if (!pendingOrder.visited) {
    try {
      history.replaceState({ ...history.state, erecmanOrderId: pendingOrder.id }, "");
      WhatsAppOrder.markVisited(pendingOrder);
      window.dataLayer.push({
        event: "pedido_iniciado_whatsapp",
        order_id: pendingOrder.id,
      });
    } catch {
      // The WhatsApp link is available even if tracking fails.
    }

    spinner.hidden = false;
    const stopRedirect = () => {
      clearTimeout(redirect);
      showManualOptions();
    };
    const redirect = window.setTimeout(openWhatsApp, 4000);
    whatsappLink.addEventListener("click", stopRedirect, { once: true });
    window.addEventListener("pagehide", stopRedirect, { once: true });
  } else {
    showManualOptions();
  }
}

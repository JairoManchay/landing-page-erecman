const WhatsAppOrder = (() => {
  const storageKey = "erecman.whatsappOrder";
  const contactURL = "https://wa.me/51970396146?text=";
  const orderLifetime = 30 * 60 * 1000;

  function link(message) {
    return contactURL + encodeURIComponent(message);
  }

  function save(message) {
    const id = Array.from(crypto.getRandomValues(new Uint8Array(16)),
      byte => byte.toString(16).padStart(2, "0")).join("");
    sessionStorage.setItem(storageKey, JSON.stringify({
      id,
      url: link(message),
      expiresAt: Date.now() + orderLifetime,
      visited: false,
    }));
  }

  function read() {
    try {
      const order = JSON.parse(sessionStorage.getItem(storageKey));
      if (!order || !/^[a-f0-9]{32}$/.test(order.id) ||
          !Number.isFinite(order.expiresAt) || order.expiresAt <= Date.now() ||
          typeof order.url !== "string" || !order.url.startsWith(contactURL) ||
          order.url.length <= contactURL.length || typeof order.visited !== "boolean") return null;
      return order;
    } catch {
      return null;
    }
  }

  function markVisited(order) {
    sessionStorage.setItem(storageKey, JSON.stringify({ ...order, visited: true }));
  }

  return { link, save, read, markVisited };
})();

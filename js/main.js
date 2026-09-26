window.sr = ScrollReveal();

sr.reveal(".top", {
    duration: 1500,
    origin: "top",
    distance: "70px",
})

sr.reveal(".left", {
    duration: 2000,
    origin: "left",
    distance: "70px",
})

sr.reveal(".rigth", {
    duration: 2000,
    origin: "rigth",
    distance: "70px",
})

sr.reveal(".bottom", {
    duration: 2000,
    origin: "bottom",
    distance: "70px",
})



document.querySelectorAll('.zoom-in').forEach(function(el) {
  let scale = 1;
  let direction = 1; // 1 = zoom in, -1 = zoom out
  setInterval(function() {
    scale += direction * 0.02; // Zoom más suave
    if (scale >= 1.2) direction = -1; // Zoom máximo promedio
    if (scale <= 1) direction = 1;  // Zoom mínimo
    el.style.transform = `scale(${scale})`;
  }, 100);
});

// Carrusel de testimonios: flechas solo cuando hay más items de los que caben
document.querySelectorAll('.carrousel-wrapper').forEach(function(wrapper) {
  const track = wrapper.querySelector('.carrousel');
  const prev = wrapper.querySelector('.carrousel-arrow--prev');
  const next = wrapper.querySelector('.carrousel-arrow--next');

  function update() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    wrapper.classList.toggle('is-scrollable', maxScroll > 1);
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= maxScroll - 1;
  }

  function step() {
    return track.querySelector('.carrousel-item').offsetWidth + 20;
  }

  prev.addEventListener('click', function() {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  next.addEventListener('click', function() {
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
});

const SLIDE_MS = 6000;
const FADE_MS = 900;

const current = document.querySelector("#current");
const next = document.querySelector("#next");

let images = [];
let index = 0;
let active = current;
let standby = next;
let timer = 0;

init();

async function init() {
  const response = await fetch("./images.json", { cache: "no-cache" });
  images = shuffle(await response.json());

  if (!images.length) {
    return;
  }

  await loadImage(active, images[0]);
  active.classList.add("is-visible");
  preload(1);
  timer = window.setInterval(showNext, SLIDE_MS);

  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("pointerdown", showNext);
}

async function showNext() {
  if (images.length < 2) {
    return;
  }

  window.clearInterval(timer);
  index = (index + 1) % images.length;

  try {
    await loadImage(standby, images[index]);
  } catch {
    timer = window.setInterval(showNext, SLIDE_MS);
    return;
  }

  standby.classList.add("is-visible");
  active.classList.remove("is-visible");

  window.setTimeout(() => {
    [active, standby] = [standby, active];
    standby.classList.remove("is-visible");
    standby.removeAttribute("src");
    preload(index + 1);
    timer = window.setInterval(showNext, SLIDE_MS);
  }, FADE_MS);
}

function preload(nextIndex) {
  const image = new Image();
  image.decoding = "async";
  image.src = images[nextIndex % images.length];
}

function handleKeydown(event) {
  if (event.key === "ArrowRight" || event.key === " ") {
    showNext();
  }
}

function loadImage(element, src) {
  return new Promise((resolve, reject) => {
    element.onload = () => resolve();
    element.onerror = () => reject(new Error(`Unable to load ${src}`));
    element.src = src;

    if (element.complete && element.naturalWidth > 0) {
      resolve();
    }
  });
}

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

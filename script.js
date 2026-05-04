const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canHover = window.matchMedia("(pointer: fine)");
const floatingNodes = Array.from(document.querySelectorAll("[data-float]")).filter(
  (node) => !node.classList.contains("tech-badge")
);

function resetFloatingNodes() {
  root.style.setProperty("--pointer-x", "50%");
  root.style.setProperty("--pointer-y", "18%");

  floatingNodes.forEach((node) => {
    node.style.transform = "";
  });
}

function updatePointerEffects(clientX, clientY) {
  const xRatio = clientX / window.innerWidth;
  const yRatio = clientY / window.innerHeight;

  root.style.setProperty("--pointer-x", `${(xRatio * 100).toFixed(2)}%`);
  root.style.setProperty("--pointer-y", `${(yRatio * 100).toFixed(2)}%`);

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  floatingNodes.forEach((node) => {
    const depth = Number(node.dataset.float || 0.012);
    const moveX = (clientX - centerX) * depth;
    const moveY = (clientY - centerY) * depth;
    const rotateY = ((clientX - centerX) / centerX) * depth * 18;
    const rotateX = ((centerY - clientY) / centerY) * depth * 18;

    node.style.transform =
      `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) ` +
      `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });
}

if (!prefersReducedMotion.matches && canHover.matches) {
  window.addEventListener("mousemove", (event) => {
    updatePointerEffects(event.clientX, event.clientY);
  });

  window.addEventListener("mouseleave", resetFloatingNodes);
  window.addEventListener("blur", resetFloatingNodes);
} else {
  resetFloatingNodes();
}

prefersReducedMotion.addEventListener("change", () => {
  if (prefersReducedMotion.matches) {
    resetFloatingNodes();
  }
});

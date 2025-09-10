export function UseCloseModal(saveClick: number, onClose: () => void) {
  document.body.style.overflowY = "auto";
  document.documentElement.style.overflow = "auto";

  setTimeout(() => {
    window.scrollTo({ top: saveClick, behavior: "instant" });
  }, 0);

  onClose();
}

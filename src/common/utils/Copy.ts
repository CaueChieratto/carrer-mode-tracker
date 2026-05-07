export const Copy = async (
  text: string,
  successMessage: string = "Copiado com sucesso!",
) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      alert(successMessage);
      return;
    } catch (error) {
      console.warn("Falha na Clipboard API, tentando fallback...", error);
    }
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;

  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";

  textArea.setAttribute("readonly", "false");
  textArea.contentEditable = "true";

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, 999999);

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      alert(successMessage);
    } else {
      console.error("Fallback de cópia falhou (execCommand retornou false).");
    }
  } catch (err) {
    console.error("Erro ao copiar texto no fallback:", err);
  } finally {
    window.getSelection()?.removeAllRanges();
    document.body.removeChild(textArea);
  }
};

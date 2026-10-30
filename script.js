// Menu responsivo compartilhado entre as páginas.
const menuToggle = document.querySelector(".menu-toggle");
const navList = document.querySelector(".nav-list");

if (menuToggle && navList) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  // Fecha o menu depois que um link é escolhido em telas pequenas.
  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    });
  });

  // Ao voltar para uma tela grande, garante que a navegação não fique presa.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      navList.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Filtro por categoria e palavra-chave na página Explore.
const filterForm = document.querySelector("#filter-form");
if (filterForm) {
  const searchInput = document.querySelector("#search-input");
  const categorySelect = document.querySelector("#category-select");
  const cards = Array.from(document.querySelectorAll(".explore-card"));
  const resultsMessage = document.querySelector("#results-message");
  const clearButton = document.querySelector("#clear-filters");

  function filterCards() {
    const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
    const category = categorySelect.value;
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = card.textContent.toLocaleLowerCase("pt-BR");
      const cardCategory = card.dataset.category;
      const matchesText = text.includes(query);
      const matchesCategory = category === "todos" || cardCategory === category;
      const shouldShow = matchesText && matchesCategory;
      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    resultsMessage.textContent = visibleCount
      ? `${visibleCount} ${visibleCount === 1 ? "opção encontrada" : "opções encontradas"}.`
      : "Nenhuma opção encontrada. Tente outra palavra ou categoria.";
  }

  searchInput.addEventListener("input", filterCards);
  categorySelect.addEventListener("change", filterCards);
  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterCards();
  });
  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    categorySelect.value = "todos";
    filterCards();
    searchInput.focus();
  });
  filterCards();
}

// Validação acessível do formulário demonstrativo de contato.
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const statusMessage = document.querySelector("#form-status");
  const fields = ["nome", "email", "assunto", "mensagem"];

  function showError(fieldName, message) {
    const error = document.querySelector(`#${fieldName}-error`);
    if (error) error.textContent = message;
    const field = contactForm.elements[fieldName];
    if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    statusMessage.textContent = "";
    let isValid = true;

    fields.forEach((fieldName) => {
      const field = contactForm.elements[fieldName];
      const value = field.value.trim();
      let error = "";

      if (!value) {
        error = "Preencha este campo.";
      } else if (fieldName === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) error = "Digite um e-mail válido, como nome@exemplo.com.";
      }

      showError(fieldName, error);
      if (error) isValid = false;
    });

    if (!isValid) {
      statusMessage.textContent = "Revise os campos destacados antes de continuar.";
      const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    statusMessage.textContent = "Tudo certo! Os dados foram validados no navegador, mas não foram enviados. Este formulário é demonstrativo.";
    contactForm.reset();
    fields.forEach((fieldName) => showError(fieldName, ""));
  });

  fields.forEach((fieldName) => {
    contactForm.elements[fieldName].addEventListener("input", () => {
      showError(fieldName, "");
    });
  });
}

// Perguntas frequentes: cada botão abre/fecha sua resposta.
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answerId = button.getAttribute("aria-controls");
    const answer = document.getElementById(answerId);
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
    const icon = button.querySelector(".faq-icon");
    if (icon) icon.textContent = isExpanded ? "+" : "−";
  });
});

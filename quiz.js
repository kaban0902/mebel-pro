"use strict";

(() => {
  const quiz = document.querySelector("#furniture-quiz");
  if (!quiz) return;

  const steps = [...quiz.querySelectorAll(".quiz-step")];
  const progressLabel = quiz.querySelector(".quiz-progress-label");
  const progressBar = quiz.querySelector(".quiz-progress-track");
  const progressFill = quiz.querySelector(".quiz-progress-fill");
  const controls = quiz.querySelector(".quiz-controls");
  const backButton = quiz.querySelector(".quiz-back");
  const nextButton = quiz.querySelector(".quiz-next");
  const result = quiz.querySelector(".quiz-result");
  const whatsappLink = quiz.querySelector(".quiz-whatsapp");
  const editButton = quiz.querySelector(".quiz-edit");
  let currentStep = 0;
  let started = false;

  function track(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...detail });
    }
  }

  function selectedAnswer(step) {
    return steps[step].querySelector("input:checked");
  }

  function showStep(step, moveFocus = false) {
    currentStep = step;
    steps.forEach((item, index) => {
      item.hidden = index !== step;
    });
    result.hidden = true;
    controls.hidden = false;
    backButton.hidden = step === 0;
    nextButton.disabled = !selectedAnswer(step);
    progressLabel.textContent = "Вопрос " + (step + 1) + " из " + steps.length;
    progressBar.setAttribute("aria-valuenow", String(step + 1));
    progressFill.style.width = ((step + 1) / steps.length * 100) + "%";

    if (moveFocus) {
      requestAnimationFrame(() => {
        const legend = steps[step].querySelector("legend");
        legend.tabIndex = -1;
        legend.focus();
      });
    }
  }

  function showResult() {
    const answers = steps.map((_, index) => selectedAnswer(index));
    if (answers.some((answer) => !answer)) return;

    const furnitureLine = (answers[0].dataset.lead || "Мне нужна") + ": " + answers[0].dataset.message + ".";
    const apartmentOffer = answers[0].value === "Мебель для всей квартиры";
    const message = [
      "Здравствуйте! Хочу узнать стоимость мебели.",
      "",
      furnitureLine,
      "Размеры: " + answers[1].dataset.message + ".",
      "Сейчас: " + answers[2].dataset.message + ".",
      "Планирую заказать: " + answers[3].dataset.message + ".",
      "",
      ...(apartmentOffer ? ["Также хочу воспользоваться предложением с кондиционером и установкой в подарок.", ""] : []),
      "Подскажите, пожалуйста, предварительную стоимость."
    ].join("\n");

    whatsappLink.href = "https://wa.me/77086738821?text=" + encodeURIComponent(message);
    steps.forEach((item) => { item.hidden = true; });
    controls.hidden = true;
    result.hidden = false;
    progressLabel.textContent = "4 из 4 — готово";
    progressBar.setAttribute("aria-valuenow", String(steps.length));
    progressFill.style.width = "100%";
    track("quiz_completed", {
      furniture: answers[0].value,
      dimensions: answers[1].value,
      stage: answers[2].value,
      timeline: answers[3].value
    });
    requestAnimationFrame(() => result.querySelector("h3").focus());
  }

  quiz.addEventListener("change", (event) => {
    if (!event.target.matches('.quiz-step input[type="radio"]')) return;
    if (!started) {
      started = true;
      track("quiz_started");
    }
    track("quiz_answered", { question: currentStep + 1, answer: event.target.value });
    nextButton.disabled = false;
  });

  nextButton.addEventListener("click", () => {
    if (!selectedAnswer(currentStep)) return;
    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1, true);
    } else {
      showResult();
    }
  });

  backButton.addEventListener("click", () => {
    if (currentStep > 0) showStep(currentStep - 1, true);
  });

  editButton.addEventListener("click", () => showStep(0, true));
  whatsappLink.addEventListener("click", () => track("whatsapp_calculation_clicked"));

  showStep(0);
})();
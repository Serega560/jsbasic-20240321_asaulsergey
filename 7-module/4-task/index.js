export default class StepSlider {
  elem = null;
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.segments = this.steps - 1;
    this.elem = this.#render();
  }

  #createSlide() {
    let steps = [];

    for (let i = 0; i < this.steps; i++) {
      if (i === this.value) {
        steps.push(`<span class="slider__step-active"></span>`);
      } else {
        steps.push(`<span></span>`);
      }
    }

    return steps;
  }

  #template() {
    return `
    <div class="slider__thumb">
      <span class="slider__value">${this.value}</span>
    </div>
    <div class="slider__progress"></div>
    <div class="slider__steps">
    ${this.#createSlide().join("\n")}
    </div>
    </div>`;
  }

  #setSliderStep(num) {
    let sliderSteps = this.elem.querySelectorAll(".slider__steps span");

    sliderSteps.forEach((step, index) => {
      if (step.closest(".slider__step-active")) {
        step.classList.remove("slider__step-active");
      }

      if (index === num - 1) {
        step.classList.add("slider__step-active");
      }
    });
  }

  #setValue(textValue, styleValue) {
    let thumb = this.elem.querySelector(".slider__thumb");
    let progress = this.elem.querySelector(".slider__progress");
    let sliderValue = this.elem.querySelector(".slider__value");

    sliderValue.textContent = textValue;
    this.#setSliderStep(textValue);
    thumb.style.left = `${styleValue}%`;
    progress.style.width = `${styleValue}%`;
  }

  #onChangeValue = (e) => {
    let left = e.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;
    this.value = Math.round(leftRelative * this.segments);
    let valuePercents = (this.value / this.segments) * 100;

    this.#setValue(this.value, valuePercents);

    // Update

    const event = new CustomEvent("slider-change", {
      detail: this.value,
      bubbles: true,
    });

    this.elem.dispatchEvent(event);
  };

  #onDown = () => {
    document.addEventListener("pointermove", this.#onMove);
    document.addEventListener("pointerup", this.#onUp);

    this.elem.classList.add("slider_dragging");

    const event = new CustomEvent("slider-change", {
      detail: this.value,
      bubbles: true,
    });

    this.elem.dispatchEvent(event);
  };

  #onMove = (e) => {
    let left = e.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;

    if (leftRelative < 0) {
      leftRelative = 0;
    }

    if (leftRelative > 1) {
      leftRelative = 1;
    }

    let leftPercents = leftRelative * 100;
    this.value = Math.round(leftRelative * this.segments);

    this.#setValue(this.value, leftPercents);
  };

  #onUp = () => {
    document.removeEventListener("pointermove", this.#onMove);
    document.removeEventListener("pointerup", this.#onUp);

    this.elem.classList.remove("slider_dragging");

    const event = new CustomEvent("slider-change", {
      detail: this.value,
      bubbles: true,
    });

    this.elem.dispatchEvent(event);
  };

  #render() {
    this.elem = document.createElement("div");
    this.elem.classList.add("slider");
    this.elem.innerHTML = this.#template();
    this.elem.querySelector(".slider__progress").style.width = `${this.value}`;

    this.elem.addEventListener("click", this.#onChangeValue);

    let thumb = this.elem.querySelector(".slider__thumb");
    thumb.addEventListener("dragstart", (e) => e.preventDefault());
    thumb.addEventListener("pointerdown", this.#onDown);

    return this.elem;
  }
}

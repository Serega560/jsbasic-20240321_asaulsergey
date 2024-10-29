export default class StepSlider {
  elem = null;
  steps = null;

  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;

    this.elem = this.#render();
  }

  #template() {
    const spans = new Array(this.steps)

      .fill('step')
      .map((el, i) => `<span class="${i === this.value ? 'slider__step-active' : ''}"></span>`)
      .join('');
    return `
      <div class="slider__thumb">
        <span class="slider__value">0</span>
      </div>
      <div class="slider__progress"></div>
      <div class="slider__steps">
        ${spans}
      </div>
    `;
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

  #sliderChange = (e) => {
    let thumb = this.elem.querySelector(".slider__thumb");
    let progress = this.elem.querySelector(".slider__progress");
    let value = this.elem.querySelector(".slider__value");
    let left = e.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;
    let segments = this.steps - 1;
    this.value = Math.round(leftRelative * segments);
    let valuePercents = (this.value / segments) * 100;

    value.textContent = this.value;
    thumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`;
    this.#setSliderStep(this.value);

    const event = new CustomEvent("slider-change", {
      detail: this.value,
      bubbles: true,
    });

    this.elem.dispatchEvent(event);
  }

  #render() {
    this.elem = document.createElement("div");
    this.elem.classList.add('slider');
    this.elem.innerHTML = this.#template();

    this.elem.addEventListener('click', this.#sliderChange);

    return this.elem;
  }
}

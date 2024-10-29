import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  elem = null;

  constructor(products) {
    this.products = products;
    this.filters = {};

    this.elem = this.#render();
  }

  #template() {
    return `
      <div class="products-grid__inner">
        ${this.#renderMenu()}
      </div>
    `;
  }

  #updateFiltersObject(filterData) {
    for (let key in filterData) {
      this.filters[key] = filterData[key];
    }
  }

  updateFilter(filters) {
    this.#updateFiltersObject(filters);

    const filteredProducts = this.products.filter(product => {

      if (this.filters.noNuts && product.nuts) {
        return false;
      }

      if (this.filters.vegeterianOnly && !product.vegeterian) {
        return false;
      }

      if (this.filters.maxSpiciness && product.spiciness > this.filters.maxSpiciness) {
        return false;
      }

      if (this.filters.category && product.category !== this.filters.category) {
        return false;
      }

      return true;
    });

    this.elem.querySelector('.products-grid__inner').innerHTML = '';
    this.elem.querySelector('.products-grid__inner').innerHTML = this.#renderMenu(filteredProducts);
  }

  #renderMenu() {
    return this.products.map(product => {
      const productCard = new ProductCard(product);
      return productCard.elem.outerHTML;
    }).join('');
  }

  #render() {
    this.elem = document.createElement('div');
    this.elem.classList.add('products-grid');

    this.elem.innerHTML = this.#template();
    return this.elem;
  }
}

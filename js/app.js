let suggestionsPath = "../data/suggestions.json";
let collectionsPath = "../data/collections.json";
let productsPath = "../data/products.json";
let blocksPath = "../data/blocks.json";

const dataType = {
  suggestions: "suggestions",
  collections: "collections",
  products: "products",
  blocks: "blocks",
};

function getData(url) {
  var promise = axios({
    url,
    method: "GET",
    responseType: "json",
  });

  return promise
    .then(function (result) {
      const { data } = result;

      switch (url) {
        case suggestionsPath:
          localStorage.setItem("suggestions", JSON.stringify(data));
          break;
        case collectionsPath:
          localStorage.setItem("collections", JSON.stringify(data));
          break;
        case blocksPath:
          localStorage.setItem("blocks", JSON.stringify(data));
          break;

        default:
          localStorage.setItem("products", JSON.stringify(data));
          break;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

getData(suggestionsPath);
getData(collectionsPath);
getData(productsPath);
getData(blocksPath);

function getSuggestedData(data, value, type) {
  return data.filter(function (el) {
    switch (type) {
      case dataType.suggestions: {
        const { term } = el;
        if (term.toLowerCase().includes(value.toLowerCase())) return el;
        break;
      }

      case dataType.collections:
      case dataType.products: {
        const { title } = el;
        if (title.toLowerCase().includes(value.toLowerCase())) return el;
        break;
      }

      default: {
        return [];
      }
    }
  });
}

function handleSearchBox(isDisplay) {
  var inputEl = document.getElementById("search__input");
  var iconEl = document.getElementById("search__icon");
  var searchResultEl = document.getElementById("search__result");
  var removeIconEl = document.getElementById("remove__icon");

  if (isDisplay) {
    inputEl.focus();
    inputEl.classList.add("active");
    iconEl.classList.add("active");
    removeIconEl.style.opacity = "1";
  } else {
    inputEl.value = "";
    inputEl.classList.remove("active");
    iconEl.classList.remove("active");
    searchResultEl.style.display = "none";
    removeIconEl.style.opacity = "0";
  }
}

function autoSuggestion() {
  var value = document.getElementById("search__input").value;
  var searchResultEl = document.getElementById("search__result");
  var countNumberEl = document.getElementById("search__count__number");

  if (value) {
    let suggestions = getSuggestedData(
      JSON.parse(localStorage.getItem("suggestions")),
      value,
      dataType.suggestions
    );
    let collections = getSuggestedData(
      JSON.parse(localStorage.getItem("collections")),
      value,
      dataType.collections
    );
    let products = getSuggestedData(
      JSON.parse(localStorage.getItem("products")),
      value,
      dataType.products
    );

    var count = 0;
    count = suggestions.length + collections.length + products.length;
    countNumberEl.innerHTML = count;

    renderSuggestions(suggestions, value);
    renderColletions(collections);
    renderProducts(products);
    searchResultEl.style.display = "block";
  } else {
    searchResultEl.style.display = "none";
  }
}

function renderSuggestions(suggestions, value) {
  let suggestionsSection = document.getElementById("suggestions__result");
  suggestionsSection.innerHTML = "";

  var suggestionsItemHtml = "";

  if (suggestions.length) {
    for (let index = 0; index < suggestions.length; index++) {
      const element = suggestions[index];

      element.term = element.term.replace(value, `<b>${value}</b>`);
      suggestionsItemHtml += `<div class="search__result__container"><p>${element.term}</p></div>`;
    }
  } else {
    suggestionsItemHtml = `<p class="no__result">No result</p>`;
  }
  suggestionsSection.innerHTML = suggestionsItemHtml;
}

function renderColletions(collections) {
  let collectionsSection = document.getElementById("collections__result");
  collectionsSection.innerHTML = "";

  var collectionsItemHtml = "";

  if (collections.length) {
    for (let index = 0; index < collections.length; index++) {
      const element = collections[index];

      collectionsItemHtml += `<div class="search__result__container"><p>${element.title}</p></div>`;
    }
  } else {
    collectionsItemHtml = `<p class="no__result">No result</p>`;
  }
  collectionsSection.innerHTML = collectionsItemHtml;
}

function renderProducts(products) {
  let productsSection = document.getElementById("products__result");
  productsSection.innerHTML = "";

  var productsItemHtml = "";

  if (products.length) {
    for (let index = 0; index < products.length; index++) {
      const product = products[index];

      productsItemHtml += `<div class="product__item">
                                <div class="container d-flex">
                                <div class="product__img">
                                    <img
                                    src="${product.url}"
                                    alt="product__img"
                                    />
                                </div>
                                <div class="product__info">
                                    <p class="title">${product.title}</p>
                                    <p class="brand">${product.brand}</p>
                                    <p class="price">${product.price}</p>
                                </div>
                                </div>
                            </div>`;
    }
  } else {
    productsItemHtml = `<p class="no__result">No result</p>`;
  }
  productsSection.innerHTML = productsItemHtml;
}

function renderResultBlock() {
  let blocksSection = document.getElementById("search__result");
  let blocks = JSON.parse(localStorage.getItem("blocks"));
  var blocksItemHtml = "";

  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];

    blocksItemHtml += `<div id="${block.id}">
                            <div class="search__result__title">
                            <p>${block.title}</p>
                            </div>
                            <div
                            id="${block.id}__result"
                            class="search__result__content"
                            ></div>
                        </div>`;
  }

  blocksItemHtml += `<div id="search__count">
                            View ALL <span id="search__count__number"></span> PRODUCT(S)
                        </div>`;

  blocksSection.innerHTML = blocksItemHtml;
}

function renderProductList() {
  let productsSection = document.getElementById("product__list");
  let products = JSON.parse(localStorage.getItem("products"));
  var productsItemHtml = "";

  for (let index = 0; index < products.length; index++) {
    const product = products[index];

    productsItemHtml += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 product__item">
                            <img
                            src="${product.url}"
                            class="product__img"
                            alt="product__img"
                            />

                            <div class="product__info">
                                <p class="title">${product.title}</p>
                                <p class="brand">${product.brand}</p>
                                <p class="price">${product.price} USD</p>
                            </div>
                        </div>`;
  }

  productsSection.innerHTML = productsItemHtml;
}

renderResultBlock();
renderProductList();

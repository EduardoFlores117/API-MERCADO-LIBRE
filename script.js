document.addEventListener('DOMContentLoaded', function () {

  function obtenerResultadosAleatorios() {
    const categorias = ['computadora', 'celular', 'ropa', 'libro', 'juguete'];
    const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];

    return fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${categoriaAleatoria}&limit=10`)
      .then(res => res.json())
      .then(data => data.results);
  }

  function obtenerYMostrarResultados(query, orden) {
    let url = `https://api.mercadolibre.com/sites/MLA/search?q=${query}&limit=40`;

    if (orden) {
      url += `&sort=${orden}`;
    }

    return fetch(url)
      .then(res => res.json())
      .then(data => data.results);
  }

  function mostrarResultados(resultados) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row row-cols-1 row-cols-md-5 g-4';

    resultados.forEach(item => {
      const col = document.createElement('div');
      col.className = 'col mb-4';

      const card = document.createElement('div');
      card.className = 'card h-100 shadow-sm';

      const img = document.createElement('img');
      img.className = 'card-img-top img-thumbnail cursor-pointer';
      img.src = item.thumbnail.replace('-I.jpg', '-HD.jpg');
      img.alt = item.title;
      img.style.maxHeight = '200px';

      img.addEventListener('click', function() {
        showImageCarousel(item.pictures);
      });

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const title = document.createElement('h5');
      title.className = 'card-title fs-6';
      title.textContent = item.title;

      const price = document.createElement('p');
      price.className = 'card-text fs-5 fw-bold text-primary';
      const priceMXN = convertToMXN(item.price, item.currency_id);
      price.textContent = `Precio: $ ${priceMXN} MXN`;

      const quantity = document.createElement('p');
      quantity.className = 'card-text text-muted';
      quantity.textContent = `Cantidad disponible: ${item.available_quantity}`;

      cardBody.appendChild(title);
      cardBody.appendChild(price);
      cardBody.appendChild(quantity);
      card.appendChild(img);
      card.appendChild(cardBody);

      card.addEventListener('mouseover', function() {
        card.classList.add('border-primary');
      });

      card.addEventListener('mouseout', function() {
        card.classList.remove('border-primary');
      });

      col.appendChild(card);
      row.appendChild(col);
    });

    resultsContainer.appendChild(row);
  }

  document.getElementById('ordenSelect').style.display = 'none';

  obtenerResultadosAleatorios().then(resultados => mostrarResultados(resultados));

  document.getElementById('searchButton').addEventListener('click', function() {
    ejecutarBusqueda();
  });

  document.getElementById('ordenSelect').addEventListener('change', function() {
    ejecutarBusqueda();
  });

  function ejecutarBusqueda() {
    const query = document.getElementById('searchInput').value.trim();
    const orden = document.getElementById('ordenSelect').value;

    if (query !== '') {
      obtenerYMostrarResultados(query, orden)
        .then(resultados => {
          mostrarResultados(resultados);
          document.getElementById('ordenSelect').style.display = 'block';
        })
        .catch(err => console.error('Error al buscar:', err));
    } else {
      obtenerResultadosAleatorios()
        .then(resultados => {
          mostrarResultados(resultados);
          document.getElementById('ordenSelect').style.display = 'none';
        })
        .catch(err => console.error('Error al obtener resultados aleatorios:', err));
    }
  }

  function showImageCarousel(images) {
    const overlay = document.getElementById('overlay');
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = '';

    images.forEach((image, index) => {
      const carouselItem = document.createElement('div');
      carouselItem.className = index === 0 ? 'carousel-item active' : 'carousel-item';

      const img = document.createElement('img');
      img.src = image.url;
      img.className = 'd-block w-100';

      carouselItem.appendChild(img);
      carouselInner.appendChild(carouselItem);
    });

    overlay.style.display = 'block';

    const carousel = new bootstrap.Carousel(document.querySelector('.carousel'), {
      interval: false
    });
  }

  document.getElementById('overlay').addEventListener('click', function(event) {
    if (event.target === this) {
      this.style.display = 'none';
    }
  });

  function convertToMXN(priceARS, currency) {
    if (currency === 'ARS') {
      const conversionRate = 0.019;
      return (priceARS * conversionRate).toFixed(2);
    }
    return priceARS;
  }

});

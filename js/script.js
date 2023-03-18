const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: 'db38272c4b368470eb3f2f14fc6f1928',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

// render cards
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  results.forEach((result) => {
    renderCard(result, 'movie');
  });
}
async function displayPopularTVShows() {
  const { results } = await fetchAPIData('tv/popular');
  console.log(results);
  results.forEach((result) => {
    renderCard(result, 'tv');
  });
}

// render card
function renderCard(result, media) {
  const popularMovies = document.querySelector('#popular-movies');
  const popularShows = document.querySelector('#popular-shows');
  const card = document.createElement('div');
  card.classList.add('card');

  createImage(result, media, card);
  createBody(result, media, card);

  if (media === 'movie') {
    popularMovies.appendChild(card);
  } else if (media === 'tv') {
    popularShows.appendChild(card);
  }
}

function createImage(result, media, card) {
  // link and cover
  const a = document.createElement('a');

  const cover = document.createElement('img');
  cover.classList.add('card-img-top');
  result.poster_path
    ? cover.setAttribute(
        'src',
        `https://image.tmdb.org/t/p/w500${result.poster_path}`
      )
    : cover.setAttribute('src', `../images/no-image.jpg`);

  if (media === 'movie') {
    a.setAttribute(`href`, `movie-details.html?id=${result.id}`);
    cover.setAttribute('alt', result.title);
  } else if (media === 'tv') {
    a.setAttribute(`href`, `tv-details.html?id=${result.id}`);
    cover.setAttribute('alt', result.name);
  }

  card.appendChild(a);
  a.appendChild(cover);
}

function createBody(result, media, card) {
  //body
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  card.appendChild(cardBody);

  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  const cardText = document.createElement('p');
  cardText.classList.add('card-text');

  if (media === 'movie') {
    cardTitle.textContent = result.title;
    cardText.innerHTML = `<small class="text-muted"> Release ${result.release_date} </small>`;
  } else if (media === 'tv') {
    cardTitle.textContent = result.name;
    cardText.innerHTML = `<small class="text-muted"> Release ${result.first_air_date} </small>`;
  }

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
}

// display Movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  //overlay for background image
  displayBackgroundImage('movie', movie.backdrop_path);

  console.log(movie);
  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
  <div>
    <img
      src= ${
        movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '../images/no-image.jpg'
      } 
      class="card-img-top"
      alt="${movie.title}"
    />
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>${movie.overview}</p>

    <h5>Genres</h5>
    <ul class="list-group">
    ${movie.genres.map((g) => `<li>${g.name}</li> `).join('')}
    </ul>
    <a href=${
      movie.homepage
    } target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span>  ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
  ${movie.production_companies.map((c) => `<span>${c.name}</span>`).join(', ')}
  </div>
</div>
`;
  document.querySelector('#movie-details').appendChild(div);
}

// display show details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];

  const show = await fetchAPIData(`tv/${showId}`);
  console.log(show);
  //overlay for background image
  displayBackgroundImage('tv', show.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
  <div>
    <img
      src= ${
        show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : '../images/no-image.jpg'
      } 
      class="card-img-top"
      alt="${show.name}"
    />
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">First air Date: ${show.first_air_date}</p>
    <p>${show.overview}</p>

    <h5>Genres</h5>
    <ul class="list-group">
    ${show.genres.map((g) => `<li>${g.name}</li> `).join('')}
    </ul>
    <a href=${show.homepage} target="_blank" class="btn">Visit Show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
  <li><span class="text-secondary">Number Of Episodes:</span> ${
    show.number_of_episodes
  }</li>
  <li>
    <span class="text-secondary">Last Episode To Air:</span> ${
      show.last_air_date
    }
  </li>
  <li><span class="text-secondary">Status:</span> ${show.status}</li>

  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
  ${show.production_companies.map((c) => `<span>${c.name}</span>`).join(', ')}
  </div>
</div>
`;
  document.querySelector('#show-details').appendChild(div);
}

// Search Movies / shows:
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert('No results found');
      return;
    }

    displaySearchResults(results);
    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter a seach term', 'error');
  }
}

function displaySearchResults(results) {
  // clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
  <a href= "/${global.search.type}-details.html?id=${result.id}">
  <img src= ${
    result.poster_path
      ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
      : 'images/no-image.jpg'
  } class="card-img-top" alt="${
      global.search.type === 'movie' ? result.title : result.name
    }
    " />
  </a>
  <div class="card-body">
    <h5 class="card-title">${
      global.search.type === 'movie' ? result.title : result.name
    }
    </h5>
    <p class="card-text">
      <small class="text-muted">Release: ${
        global.search.type === 'movie'
          ? result.release_date
          : result.first_air_date
      }
      </small>
    </p>
  </div>
  `;
    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;
    document.querySelector('#search-results').appendChild(div);
  });

  displayPagination();
}

// create and display pagination for search
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `;
  document.querySelector('#pagination').appendChild(div);

  // diable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }
  // diable nest button if on first page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // prev page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  window.scrollTo(0, 308);
}

// render swiper
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  results.forEach((result) => {
    console.log(result);
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
    <a href="movie-details.html?id=${result.id}">
    <img src=${
      result.poster_path
        ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
        : './images/no-image.jpg'
    } alt="${result.name}" />
    </a>
    <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${result.vote_average.toFixed(
      1
    )} / 10
    </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Display Backdrop image:
function displayBackgroundImage(media, path) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${path})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (media === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

// Fetch data form TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}
// search api data
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

// spiner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}
// Highlight active link
function highLightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// show alert
function showAlert(message, className = 'error') {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// init app - router
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home');
      displayPopularMovies();
      displaySlider();
      break;
    case '/shows.html':
      console.log('Shows');
      displayPopularTVShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      console.log('Movie details');
      break;
    case '/tv-details.html':
      displayShowDetails();
      console.log('Tv details');
      break;
    case '/search.html':
      console.log('Search');
      search();
      break;
  }
}

highLightActiveLink();
document.addEventListener('DOMContentLoaded', init);

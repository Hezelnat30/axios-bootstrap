document.addEventListener('DOMContentLoaded', async function() {
  const movies = await getMovies('fantasy')
  if(movies) {
    updateUI(movies)
  } else {
    console.log('Data tidak ditemukan')
  }
})

const searchButton = document.querySelector(".search-button");
searchButton.addEventListener('click', async function (e){
  e.preventDefault()
  // Loading Spinner
  const spinner = document.querySelector("#spinner");
  spinner.classList.remove("d-none");

  const inputKeyword = document.querySelector(".input-keyword");
  const movies = await getMovies(inputKeyword.value)

  spinner.classList.add('d-none')
  updateUI(movies)
})

// Event Binding
document.addEventListener('click',async function(e) {
  if( e.target.classList.contains('modal-detail-button') ) {
    const imdbid = e.target.dataset.imdbid;
    // Loading Spinner
    const growSpinner = document.querySelector('#grow');
    growSpinner.classList.remove('d-none');

    const movieDetail = await getMovieDetail(imdbid);

    growSpinner.classList.add('d-none');
    const imdbRating = movieDetail.Ratings.find((rating) => rating.Source === "Internet Movie Database")?.Value;
    const rottenTomatoesRating = movieDetail.Ratings.find((rating) => rating.Source === "Rotten Tomatoes")?.Value;
    const metacritic = movieDetail.Ratings.find((rating) => rating.Source === "Metacritic")?.Value;
    updateUIDetail(movieDetail, imdbRating, rottenTomatoesRating, metacritic)
  }
})

function getMovieDetail (imdbid) {
  return axios.get(`https://www.omdbapi.com/?apikey=9d99dbf3&i=${imdbid}`)
    .then(res => res.data)
    .catch(err => `Data tidak ditemukan ${err}`)
}

function updateUIDetail(detail, imdbRating, rottenTomatoesRating, metacritic){
  const movieDetail = showDetails(detail,imdbRating,rottenTomatoesRating, metacritic);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetail;
}

function getMovies (keyword) {
    return axios.get(`https://www.omdbapi.com/?apikey=e123faa5&s=${keyword}`)
      .then(res => {
        const data = res.data.Search;
        return data;
      })
      .catch(err => {
        console.log(`Data tidak ditemukan ${err}`)
      })
}

function updateUI (movies) {
  if(movies && movies.length > 0) {
    let cards = "";
    movies.forEach(m => cards += showCards(m));
    const movieContainer = document.querySelector(".movie-container");
    movieContainer.innerHTML = cards;
  } else {
    const movieContainer = document.querySelector(".movie-container");
    movieContainer.innerHTML = "<h3>Data tidak ditemukan.</h3>";
    console.error("Data tidak ditemukan atau terjadi kesalahan dalam memuat data.");
  }
}

function showCards(movie) {
  return `<div class="col-md-3 my-3">
            <div class="card" style="height: 100%;">
              <img src="${movie.Poster}" class="card-img-top" alt="${movie.imdbID}" style="object-fit: cover; height: 70%"; />
              <div class="card-body h-full d-flex flex-column justify-content-between">
              <div class="title">
                <h5 class="card-title">${movie.Title}</h5>
                <h6 class="text-muted card-subtitle mb-2">${movie.Year}</h6>
              </div>
                <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal"
                data-bs-target="#movieDetailModal" data-imdbid="${movie.imdbID}">Show Details</a>
              </div>
            </div>
          </div>`;
}

function showDetails(detail, imdbRating, rottenTomatoesRating, metacritic) {
  return `<div class="container-fluid">
          <div class="row">
            <div class="col-md-3 mx-auto text-center">
              <img src="${detail.Poster}" alt="${detail.Poster}" class="img-fluid" />
            </div>
            <div class="col-md-9">
              <ul class="list-group">
                <li class="list-group-item">
                  <h4>${detail.Title}</h4>
                  <p class="text-muted fs-6 my-0">( ${detail.Genre} )</p>
                </li>
                <li class="list-group-item">
                  <strong>Director: </strong>${detail.Director}
                </li>
                <li class="list-group-item">
                  <strong>Actors : </strong>${detail.Actors}
                </li>
                <li class="list-group-item">
                  <strong>Writer : </strong>${detail.Writer}
                </li>
                <li class="list-group-item">
                  <strong>Synopsis : </strong>${detail.Plot}
                </li>
                <li class="list-group-item">
                  <strong>IMDB Rating : </strong><i class="bi bi-star-fill text-warning"></i> ${imdbRating}
                  <br>
                  <strong>Rotten Tomatoes : </strong><i class="fa-solid fa-lemon text-danger"></i> ${rottenTomatoesRating}
                  <br>
                  <strong>Metacritic : </strong><i class="fa-solid fa-lemon text-danger"></i> ${metacritic}
                </li>
              </ul>
            </div>
          </div>
        </div>`;
}

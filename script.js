document.addEventListener("DOMContentLoaded", async function () {
  try {
    const res = await axios.get(
      `https://www.omdbapi.com/?apikey=e123faa5&s=popular`
    );
    const movies = res.data.Search;
    let cards = "";
    for (let movie of movies) {
      cards += showCards(movie);
    }
    const movieContainer = document.querySelector(".movie-container");
    movieContainer.innerHTML = cards;

    // Ketika tombol diklik
    const btnModal = document.querySelector(".modal-detail-button");
    btnModal.addEventListener("click", async function () {
      
      try {
        const res = await axios.get(
          `https://www.omdbapi.com/?apikey=e123faa5&i=${this.dataset.imdbid}`
        );
        const detail = res.data;
        const imdbRating = res.data.Ratings.find(
          (rating) => rating.Source === "Internet Movie Database"
        )?.Value;
        const rottenTomatoesRating = res.data.Ratings.find(
          (rating) => rating.Source === "Rotten Tomatoes"
        )?.Value;
        const movieDetail = showDetails(
          detail,
          imdbRating,
          rottenTomatoesRating
        );
        const modalBody = document.querySelector(".modal-body");
        modalBody.innerHTML = movieDetail;
      } catch (error) {
        console.log(`Data tidak ditemukan ${error}`);
      }
    });
  } catch (error) {
    console.log(`Data tidak ditemukan ${error}`);
  }
});

const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", function (e) {
  e.preventDefault()
  const getData = async () => {
    const spinner = document.querySelector("#spinner");
    spinner.classList.remove("d-none");
    try {
      const inputKeyword = document.querySelector(".input-keyword");
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=e123faa5&s=${inputKeyword.value}`
      );
      const movies = res.data.Search;
      let cards = "";
      for (let movie of movies) {
        cards += showCards(movie);
      }
      const movieContainer = document.querySelector(".movie-container");
      spinner.classList.add("d-none");
      movieContainer.innerHTML = cards;

      // Ketika tombol diklik
      const btnModal = document.querySelector(".modal-detail-button");
      btnModal.addEventListener("click", async function () {
        try {
          const res = await axios.get(
            `https://www.omdbapi.com/?apikey=e123faa5&i=${this.dataset.imdbid}`
          );
          const detail = res.data;
          const imdbRating = res.data.Ratings.find(
            (rating) => rating.Source === "Internet Movie Database"
          )?.Value;
          const rottenTomatoesRating = res.data.Ratings.find(
            (rating) => rating.Source === "Rotten Tomatoes"
          )?.Value;
          const movieDetail = showDetails(
            detail,
            imdbRating,
            rottenTomatoesRating
          );
          const modalBody = document.querySelector(".modal-body");
          modalBody.innerHTML = movieDetail;
        } catch (error) {
          console.log(`Data tidak ditemukan ${error}`);
        }
      });
    } catch (error) {
      console.log(`Data tidak ditemukan ${error}`);
    }
  };
  getData();
});

function showCards(movie) {
  return `<div class="col-md-3 my-3">
            <div class="card" style="height: 100%;">
              <img src="${movie.Poster}" class="card-img-top" alt="${movie.imdbID}" style="object-fit: cover; height: 70%" />
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

function showDetails(detail, imdbRating, rottenTomatoesRating) {
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
                  <strong>Synopsis : </strong><br />${detail.Plot}
                </li>
                <li class="list-group-item">
                  <strong>IMDB Rating : </strong><i class="bi bi-star-fill text-warning"></i> ${imdbRating}
                  <br>
                  <strong>Rotten Tomatoes : </strong><i class="fa-solid fa-lemon text-danger"></i> ${rottenTomatoesRating}
                </li>
              </ul>
            </div>
          </div>
        </div>`;
}

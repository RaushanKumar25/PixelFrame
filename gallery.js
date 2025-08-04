document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "q7TQOr6znsQsMhvloqTZ7CbeREYJknTjzchhcUPtxfMEmeOq57tLmahc";
  const perPage = 15;
  let currentPage = 1;
  let searchTerm = null;

  const imagesWrapper = document.querySelector(".images");
  const loadMoreBtn = document.querySelector(".load-more");
  const searchInput = document.querySelector(".search-box input");

  // ✅ Make downloadImg globally accessible
  window.downloadImg = (imgURL) => {
    fetch(imgURL)
      .then(res => res.blob())
      .then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
      })
      .catch(() => alert("Failed to download image!"));
  };

  // 🖼 Generate cards from fetched image data
  const generateHTML = (images) => {
    const newCards = images.map((img) =>
      `<li class="card">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button onclick="downloadImg('${img.src.large2x}')">
            <i class="uil uil-import"></i>
          </button>
        </div>
      </li>`
    ).join("");

    imagesWrapper.insertAdjacentHTML("beforeend", newCards);
  };

  // 📦 Fetch images from Pexels API
  const getImages = (apiURL) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");

    fetch(apiURL, {
      headers: { Authorization: apiKey }
    })
    .then(res => res.json())
    .then(data => {
      generateHTML(data.photos);
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(error => {
      console.error("Failed to fetch images:", error);
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    });
  };

  // ➕ Load more images on button click
  const loadMoreImages = () => {
    currentPage++;
    const apiURL = searchTerm
      ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
      : `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImages(apiURL);
  };

  // 🔎 Search input function
  const loadSearchImages = (e) => {
    if (e.key === "Enter") {
      currentPage = 1;
      searchTerm = e.target.value.trim();
      imagesWrapper.innerHTML = "";
      getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
  };

  // 📤 Initial load
  getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

  // 👇 Button & search field listeners
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMoreImages);
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", loadSearchImages);
  }
});

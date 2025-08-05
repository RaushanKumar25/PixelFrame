document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "q7TQOr6znsQsMhvloqTZ7cbeREYJknTjzchhcUPtxfMEmeOq57tLmahc";
  const perPage = 15;
  let currentPage = 1;
  let searchTerm = null;

  const imagesWrapper = document.querySelector(".images");
  const loadMoreBtn = document.querySelector(".load-more");
  const searchInput = document.querySelector(".search-box input");
  const lightBox = document.querySelector(".lightbox");
  const closeBtn = lightBox.querySelector(".uil-times");
  const downloadImgBtn = lightBox.querySelector(".uil-import");

  
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

 
  const showLightbox = (name, img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

   const hideLightbox = () => {
    lightBox.classList.remove("show"); 
     document.body.style.overflow = "auto"; 
   }

  
  lightBox.addEventListener("click", () => lightBox.classList.remove("show"));

  
  const generateHTML = (images) => {
    const newCards = images.map((img, index) =>
      `<li class="card" data-name="${img.photographer}" data-img="${img.src.large2x}">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button data-download="${img.src.large2x}">
            <i class="uil uil-import"></i>
          </button>
        </div>
      </li>`
    ).join("");

    imagesWrapper.insertAdjacentHTML("beforeend", newCards);
  };

 
  imagesWrapper.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    const downloadBtn = e.target.closest("button[data-download]");

    if (downloadBtn) {
      const imgURL = downloadBtn.getAttribute("data-download");
      downloadImg(imgURL);
    } else if (card) {
      const name = card.getAttribute("data-name");
      const img = card.getAttribute("data-img");
      showLightbox(name, img);
    }
  });

 


 
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


  const loadMoreImages = () => {
    currentPage++;
    const apiURL = searchTerm
      ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
      : `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImages(apiURL);
  };


  const loadSearchImages = (e) => {
    if (e.key === "Enter") {
      currentPage = 1;
      searchTerm = e.target.value.trim();
      imagesWrapper.innerHTML = "";
      getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
  };

  
  getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);


  loadMoreBtn?.addEventListener("click", loadMoreImages);
  searchInput?.addEventListener("keyup", loadSearchImages);
  closeBtn.addEventListener("click", hideLightbox);
  downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));
});

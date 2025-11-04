// ==================================================
// J.U.N.E. — Joint Unified National Elite
// World Intelligence Feed Script
// ==================================================

const views = {
  home: document.getElementById("home"),
  news: document.getElementById("news")
};
const links = {
  home: document.getElementById("link-home"),
  news: document.getElementById("link-news")
};

function showView(view) {
  for (const key in views) {
    views[key].style.display = key === view ? "" : "none";
    links[key].setAttribute("aria-current", key === view ? "true" : "false");
  }
}
window.addEventListener("hashchange", () => showView(location.hash.replace("#", "") || "home"));
showView(location.hash.replace("#", "") || "home");

// ===================== GLOBAL NEWS FETCHER =====================
const API_KEY = "9706b53ba74c4755bbdc9e5d1da8828c"; // Replace with your NewsAPI key
const NEWS_LIST = document.getElementById("news-list");
const COUNTRY_SELECT = document.getElementById("country-select");

async function fetchNewsByCountry(countryCode) {
  NEWS_LIST.innerHTML = `<p class="loading">Gathering intelligence reports from ${countryCode.toUpperCase()}...</p>`;

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&pageSize=12&apiKey=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "ok" && data.articles.length > 0) {
      renderNews(data.articles);
    } else {
      NEWS_LIST.innerHTML = `<p class="error">No current reports for ${countryCode.toUpperCase()}.</p>`;
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    NEWS_LIST.innerHTML = `<p class="error">Unable to retrieve reports. Check connection or API key.</p>`;
  }
}

function renderNews(articles) {
  NEWS_LIST.innerHTML = "";
  for (const a of articles) {
    const card = document.createElement("article");
    card.className = "news-item";
    card.innerHTML = `
      <h3><a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.title}</a></h3>
      <p>${a.description || "No description available."}</p>
      <div class="meta">
        <span>${a.source.name || "Unknown Source"}</span> — 
        <span>${new Date(a.publishedAt).toLocaleString()}</span>
      </div>
    `;
    NEWS_LIST.appendChild(card);
  }
}

// ===================== AUTO UPDATE =====================
let currentCountry = COUNTRY_SELECT.value;
fetchNewsByCountry(currentCountry);
setInterval(() => fetchNewsByCountry(currentCountry), 10 * 60 * 1000);

COUNTRY_SELECT.addEventListener("change", () => {
  currentCountry = COUNTRY_SELECT.value;
  fetchNewsByCountry(currentCountry);
});

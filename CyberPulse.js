const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const body = document.getElementById("body");
// const particle = document.getElementsByClassName("particle");
/* const title = document.getElementByClass("mainTitle"); */
const categoryclasses = {
  critical: "critical",
  medium: "medium",
  low: "low",
};

const colors = [
 "#00ff00", // verde fósforo
    "#00d9ff", // cian
    "#00a058", // ámbar
    "#dcff5ff7", // rojo
    "#70ff11",  // blanco
];

const logBtn = document.getElementById("logBtn");
const logDoc = document.getElementById("logDoc");
const overlay = document.getElementById("overlay");
const visibleClass = document.getElementsByClassName("visible")
const closeModal = document.getElementById("closeModal");
logBtn.addEventListener("click", () => {
  
  overlay.classList.add("visible")
});

closeModal.addEventListener("click", () => {
  overlay.classList.remove("visible")
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

const particleContainer = document.getElementById("particleContainer");
const partCount = 50;

function createParticles(){

  for(let i=0;i<partCount;i++){

    const particle = document.createElement("div");
    particle.classList.add("particle");

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    const randomIndexCol = Math.floor(Math.random() *colors.length);
    const randomCol = colors[randomIndexCol];
    const randomScale = Math.random();

    if (randomScale >=.3 && randomScale <.6) {
      particle.style.scale = 1.3;
    } else if (randomScale >=.6) {
      particle.style.scale = 2;
    }

    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.background = randomCol;

    const direction = Math.random() < 0.5;
    const duration = Math.random() * 50 + 16;

    if (direction) {
    particle.style.animation = `moveRight ${duration}s linear infinite alternate`;} 
    else {particle.style.animation = `moveLeft ${duration}s linear infinite alternate`;
    }

    particle.style.animationDelay = `${Math.random() * -15}s`;

    particleContainer.appendChild(particle);

    particles.push({
    element: particle,
    x: x,
    y: y,
});

  }
}

const particles = [];

function animateParticles() {

    particles.forEach(particle => {

        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.element.style.left = particle.x + "px";
        particle.element.style.top = particle.y + "px";

    });

    requestAnimationFrame(animateParticles);

}

let articles = [];
let articlesShowed = [];
let countArticles = 0;
let loadingArticles = false;
let infiniteScrollObserver = null;

async function getData(){
  await getDataArticles();

  const initialCount = Math.min(10, articles.length);
  countArticles = initialCount;
  articlesShowed = articles.slice(0, initialCount);

  if (articlesShowed.length > 0) {
    await getDataSeverity(createUrlSeverity(articlesShowed));
  }
}

async function getDataArticles(){

  await fetch("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",)
  .then(response => response.json())
  .then(async data => await normalizeData(data))
  .catch(error => console.error(error));
  // console.log(articles);
}

async function loadMoreArticles() {
  if (loadingArticles || !articles.length || countArticles >= articles.length) return;

  loadingArticles = true;

  try {
    const nextBatch = articles.slice(countArticles, countArticles + 10);

    if (nextBatch.length === 0) return;

    articlesShowed = [...articlesShowed, ...nextBatch];
    countArticles += nextBatch.length;

    await getDataSeverity(createUrlSeverity(articlesShowed));

    const articlesContainer = document.getElementById("news-container");
    if (!articlesContainer) return;

    articlesContainer.innerHTML = "";
    articlesShowed.forEach((article) => {
      const articleElement = createCard(article);
      articlesContainer.appendChild(articleElement);
    });
  } finally {
    loadingArticles = false;
  }
}

async function getDataSeverity(url){

  await fetch(url,)
  .then(response => response.json())
  .then(async data => await updateSeverity(data))
  .catch(error => console.error(error));
}

function normalizeData(data){

  const vulnerabilities = data.vulnerabilities
  vulnerabilities.forEach((vulnerability) => {
    articles.push(
      { cveID: vulnerability.cveID,
        title: vulnerability.vulnerabilityName,
        description: vulnerability.shortDescription,
        date: vulnerability.dateAdded,
        uniqueId: vulnerability.cveID,
        readMore: vulnerability.notes.split(";").map(x => x.trim()).find(x => x.includes("nvd.nist.gov")),
        errorType: vulnerability.cwes,
        baseScore: "N/A",
        baseSeverity: "N/A",
      },
    )
  })
}

function updateSeverity(data){
  console.log("updating severity");
//  console.log(articles);
  const vulnerabilities = data.vulnerabilities;
  // console.log(vulnerabilities);
  vulnerabilities.forEach(
    (vulnerability) => {
      const cveid = vulnerability?.cve?.id;
      const basescore = vulnerability?.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore;
      const baseseverity = vulnerability?.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity;
  
      const article = articles.find((article) => article.cveID === cveid);
      if (article) {
        article.baseScore = basescore ?? "N/A";
        article.baseSeverity = baseseverity ?? "N/A";
      }
    }
  )
  // console.log(articles);
}

function createUrlSeverity(articles){
  let cveConcat="";
  articles.forEach((article) => cveConcat=cveConcat+article.cveID+",");
  let cves=cveConcat.slice(0,-1);
  console.log("https://services.nvd.nist.gov/rest/json/cves/2.0?cveIds="+cves);
  return "https://services.nvd.nist.gov/rest/json/cves/2.0?cveIds="+cves;
}

function setupInfiniteScroll() {
  const sentinel = document.getElementById("sentinel");
  if (!sentinel) return;

  if (infiniteScrollObserver) {
    infiniteScrollObserver.disconnect();
  }

  infiniteScrollObserver = new IntersectionObserver((entries) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    if (loadingArticles || !articles.length || countArticles >= articles.length) return;

    loadMoreArticles();
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "200px 0px",
  });

  infiniteScrollObserver.observe(sentinel);
}

const articlesMock = [
  {
    category: "critical",
    title: "New Windows Vulnerability Discovered",
    description:
      "Microsoft released information regarding a newly discovered vulnerability affecting Windows 11 users. The vulnerability, identified as CVE-2024-12345, allows attackers to execute arbitrary code on affected systems. Users are advised to update their systems immediately to mitigate potential risks.",
    url: "https://www.cisco.com/c/en/us/products/security/what-is-cybersecurity.html",
  },
  {
    category: "Medium",
    title: "Phishing Campaign Targets Financial Institutions",
    description:
      "A recent phishing campaign has been targeting employees of major financial institutions. The attackers are using sophisticated email templates that mimic official communications, aiming to steal sensitive information. Security experts recommend increased awareness and training for employees to recognize phishing attempts.",
    url: "https://www.cisco.com/c/en/us/products/security/what-is-cybersecurity.html",
  },
  {
    category: "Low",
    title: "New Cybersecurity Framework Released",
    description:
      "The National Institute of Standards and Technology (NIST) has released an updated cybersecurity framework aimed at helping organizations improve their security posture. The framework provides guidelines for identifying, protecting, detecting, responding to, and recovering from cyber threats.",
    url: "https://www.cisco.com/c/en/us/products/security/what-is-cybersecurity.html",
  },
];

async function initializeArticles() {
  const articlesContainer = document.getElementById("news-container");
  articlesContainer.innerHTML = "loading news...";
  await getData();

  if (!articlesShowed || articlesShowed.length === 0) {
    articlesContainer.innerHTML = "No articles available. Come back later.";
    return;
  }

  articlesContainer.innerHTML = "";
  articlesShowed.forEach((article) => {
    const articleElement = createCard(article);
    articlesContainer.appendChild(articleElement);
  });

  setupInfiniteScroll();
}

function createCard(article) {
  const articleElement = document.createElement("article");
  articleElement.classList.add("card");


articleElement.addEventListener("click", () => {
    window.open(linkElement, "_blank");})


  const categoryElement = document.createElement("span");
  categoryElement.textContent = article.baseScore + " - " + article.baseSeverity.toUpperCase();
  
  const severity = article.baseSeverity?.toLowerCase();

    if(["critical","medium","low","high"].includes(severity)) {
      categoryElement.classList.add("category", severity);
} else {categoryElement.classList.add("category", "na");

}
  const titleElement = document.createElement("h3");
  titleElement.textContent = article.title;

  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = article.description;

  const errorType = article.errorType;
  // document.createElement("p");
  // errorType.textContent = article.errorType;
  // errorType.classList.add("cwe");

  const date = article.date;
  // date.textContent = article.date;
  // date.classList.add("cwe");

  const linkElement = document.createElement("a");
  linkElement.href = article.readMore;
  linkElement.textContent = "Read more";
  linkElement.target = "_blank";

  const ctitleElement = document.createElement("div");
  ctitleElement.classList.add("ctitle");

  const subtitleElement = document.createElement("div");
  subtitleElement.textContent = (date + "_   " + errorType);
  subtitleElement.classList.add("csubtitle");

  ctitleElement.appendChild(titleElement);
  ctitleElement.appendChild(categoryElement);

  articleElement.appendChild(ctitleElement);
  articleElement.appendChild(subtitleElement);

  // articleElement.appendChild(errorType);
  articleElement.appendChild(descriptionElement);
  articleElement.appendChild(linkElement);

  return articleElement;
}

createParticles();
animateParticles();
initializeArticles();
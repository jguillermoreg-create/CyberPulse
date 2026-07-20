const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const body = document.getElementById("body");
const particles = document.getElementById("particles");
/* const title = document.getElementByClass("mainTitle"); */
const categoryclasses = {
  critical: "critical",
  medium: "medium",
  low: "low",
};

const logBtn = document.getElementById("logBtn");
const logDoc = document.getElementById("logDoc");
const overlay = document.getElementById("overlay")
logBtn.addEventListener("click", () => {
  overlay.style.display = "flex";
});

const apiKey = "9508d8ae-a290-4623-b124-d1b931f231d0"

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

//fetch("https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=5") 
//     headers: {
//         apiKey: "9508d8ae-a290-4623-b124-d1b931f231d0"
//     }
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => consolge.error(error));


// const particlesContainer = document.getElementById("particles");

//   function createParticle(){

// const particle = document.createElement("div");

//       particle.classList.add("particle");
//       particle.style.left = Math.random() * window.innerWidth + "px";
//       particle.style.top = Math.random() * window.innerHeight + "px";

// const size = Math.random() * 4 + 2;
//     particle.style.width = size + "px";
//     particle.style.height = size + "px";

// const colors = ["#00ffff","#00ff99","#33ccff","#ffffff"];

// const color = colors[Math.floor(Math.random() * colors.length)];

//     particle.style.background = color;
//     particle.style.boxShadow = `
//         0 0 6px ${color},
//         0 0 12px ${color},
//         0 0 20px ${color},
// `;
//   }

const articles = [
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

function initializeArticles() {
  const articlesContainer = document.getElementById("news-container");
  articlesContainer.innerHTML = "loading news...";
  if (!articles || articles.length === 0) {
    articlesContainer.innerHTML = "No articles available. Come back later.";
    return;
  }
  articlesContainer.innerHTML = "";

  articles.forEach((article) => {
    const articleElement = createCard(article);
    articlesContainer.appendChild(articleElement);
  });
}

function createCard(article) {
  const articleElement = document.createElement("article");
  articleElement.classList.add("card");

  const categoryElement = document.createElement("span");
  categoryElement.textContent = article.category.toUpperCase();
  categoryElement.classList.add(
    "category",
    categoryclasses[article.category.toLowerCase()],
  );

  const titleElement = document.createElement("h3");
  titleElement.textContent = article.title;

  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = article.description;

  const linkElement = document.createElement("a");
  linkElement.href = article.url;
  linkElement.textContent = "Read more";
  linkElement.target = "_blank";

  const ctitleElement = document.createElement("div");
  ctitleElement.classList.add("ctitle");

  ctitleElement.appendChild(categoryElement);
  ctitleElement.appendChild(titleElement);
  articleElement.appendChild(ctitleElement);
  articleElement.appendChild(descriptionElement);
  articleElement.appendChild(linkElement);

  return articleElement;
}

initializeArticles();
// createParticle();
console.log("Hello");

let cookieCount = 0; //localStorage.getItem("savedCount") || 0;  - tried Sam's way couldnt get it to work properly so gave up with that.
let cookiesPerSecond = 1;

function updateCookieDisplay() {
  const display = document.getElementById("cookie-display");
  display.textContent = `Cookies: ${cookieCount}`;
}

const cookieButton = document.getElementById("cookie-button");

cookieButton.addEventListener("click", () => {
  const cookiesPerClick = 1;
  cookieCount += cookiesPerClick;
  updateCookieDisplay();
});

function updateCPSDisplay() {
  const cpsDisplay = document.getElementById("cpsDisplay");
  cpsDisplay.textContent = `Cookies Per Second: ${cookiesPerSecond}`;
}

setInterval(() => {
  cookieCount += cookiesPerSecond;
  updateCookieDisplay();
  saveGame();
}, 1000);

// Save/Load current click count on refresh

function saveGame() {
  localStorage.setItem("cookieCount", cookieCount);
  localStorage.setItem("cookiesPerSecond", cookiesPerSecond);

  if (!localStorage.getItem("cookiesPerSecond")) {
    cookiesPerSecond = 1;
    saveGame();
  }
}

function loadGame() {
  const savedCount = localStorage.getItem("cookieCount");
  const savedCPS = localStorage.getItem("cookiesPerSecond");

  if (savedCount !== null) {
    cookieCount = parseInt(savedCount, 10);
    updateCookieDisplay();
  }

  if (savedCPS !== null) {
    cookiesPerSecond = parseInt(savedCPS, 10);
  } else {
    cookiesPerSecond = 1;
  }

  updateCookieDisplay();
  updateCPSDisplay();
}

window.addEventListener("load", loadGame);

//fetch api data

async function fetchData() {
  const cookies = await fetch(
    `https://cookie-upgrade-api.vercel.app/api/upgrades`
  );

  const data = await cookies.json();

  generateUI(data);
}

fetchData();

//append data to page from api

function generateUI(dataToRender) {
  dataToRender.forEach((post) => {
    const containerElem = document.createElement("div");
    const nameElem = document.createElement("h2");
    const costElem = document.createElement("p");
    const increaseElem = document.createElement("p");
    const buyBtn = document.createElement("button");

    nameElem.innerText = post.name;
    costElem.innerText = `Cost: ${post.cost} cookies`;
    increaseElem.innerText = `Increase: +${post.increase} cookies/sec`;
    buyBtn.innerText = "Buy";

    buyBtn.addEventListener("click", () => handleUpgradePurchase(post));

    containerElem.setAttribute("class", "shoppost");

    containerElem.appendChild(nameElem);
    containerElem.appendChild(costElem);
    containerElem.appendChild(increaseElem);
    containerElem.appendChild(buyBtn);

    const contentDiv = document.getElementById("content");
    contentDiv.appendChild(containerElem);
  });
}

function handleUpgradePurchase(upgrade) {
  if (cookieCount >= upgrade.cost) {
    cookieCount -= upgrade.cost;
    cookiesPerSecond += upgrade.increase;

    updateCookieDisplay();
    updateCPSDisplay();
    saveGame();
  } else {
    alert("Not enough cookies!");
  }
}

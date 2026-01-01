async function loadData(url, containerId, type) {
  const res = await fetch(url);
  const data = await res.json();
  const container = document.getElementById(containerId);

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.image}">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      ${item.price ? `<p><strong>${item.price}</strong></p>` : ""}
      ${type !== "free" ? `<a class="button" href="https://wa.me/91XXXXXXXXXX">Contact on WhatsApp</a>` : ""}
    `;

    container.appendChild(card);
  });
}

if (document.getElementById("freeRecipes")) {
  loadData("data/free-recipes.json", "freeRecipes", "free");
}
if (document.getElementById("paidRecipes")) {
  loadData("data/paid-recipes.json", "paidRecipes");
}
if (document.getElementById("classes")) {
  loadData("data/classes.json", "classes");
}

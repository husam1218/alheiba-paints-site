async function loadHome() {
  const response = await fetch("content/pages/home.md");
  const text = await response.text();
  const fm = frontMatter(text);
  const data = fm.attributes;
  const body = marked.parse(fm.body);

  document.getElementById("site-title").textContent = data.title;
  document.getElementById("hero-image").src = data.hero_image;
  document.getElementById("intro").innerHTML = body;
  document.getElementById("address").textContent = data.address;
  document.getElementById("phone-link").href = "tel:" + data.phone;
  document.getElementById("whatsapp-link").href = "https://wa.me/" + data.whatsapp.replace(/\D/g, "");
}

async function loadProjects() {
  const projectFiles = ["content/projects/example-project.md"]; 
  const container = document.getElementById("project-list");

  for (const file of projectFiles) {
    const res = await fetch(file);
    const text = await res.text();
    const fm = frontMatter(text);
    const data = fm.attributes;

    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <img src="${data.gallery[0].image}" alt="${data.title}">
      <h3>${data.title}</h3>
      <p>${new Date(data.date).toLocaleDateString("ar-YE")}</p>
    `;
    container.appendChild(card);
  }
}

loadHome();
loadProjects();
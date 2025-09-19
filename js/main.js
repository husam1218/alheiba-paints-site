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
  document.getElementById("whatsapp-link").href =
    "https://wa.me/" + data.whatsapp.replace(/\D/g, "");
}

async function loadProjects() {
  const container = document.getElementById("project-list");

  let projectFiles = [];
  try {
    const resList = await fetch("content/projects/index.json", {cache: "no-store"});
    const parsed = await resList.json();
    // support two shapes: either ["file1","file2"] OR { items: ["file1","file2"] }
    if (Array.isArray(parsed)) projectFiles = parsed;
    else if (parsed && Array.isArray(parsed.items)) projectFiles = parsed.items;
    else projectFiles = [];
  } catch (err) {
    console.error("Could not load project index:", err);
    projectFiles = [];
  }

  // If no index present, optionally fallback to the example file (prevents empty UI)
  if (projectFiles.length === 0) {
    projectFiles = ["content/projects/example-project.md"];
  }

  for (const file of projectFiles) {
    try {
      const res = await fetch(file);
      if (!res.ok) {
        console.warn("Project file not found:", file);
        continue;
      }
      const text = await res.text();
      const fm = frontMatter(text);
      const data = fm.attributes;

      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <img src="${data.gallery?.[0]?.image || '/images/uploads/placeholder.jpg'}" alt="${data.title}">
        <h3>${data.title}</h3>
        <p>${new Date(data.date).toLocaleDateString("ar-YE")}</p>
      `;
      container.appendChild(card);
    } catch (err) {
      console.error("Error loading project file:", file, err);
    }
  }
}

loadHome();
loadProjects();
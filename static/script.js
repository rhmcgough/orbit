const places = [
  {
    name: "Hillcrest Park",
    category: "Outdoors",
    rating: 4.8,
    description: "A local park for walking, photography, and community meetups."
  },
  {
    name: "Half Off Books",
    category: "Books",
    rating: 4.6,
    description: "A bookstore with book clubs, readings, and quiet spaces."
  },
  {
    name: "Fullerton Community Center",
    category: "Community",
    rating: 4.7,
    description: "A community space offering classes, clubs, and events."
  }
];

const placeList = document.querySelector("#place-list");
const searchInput = document.querySelector("#search");
const addSection = document.querySelector("#add-section");

function displayPlaces(searchText = "") {
  const query = searchText.toLowerCase();
  const matches = places.filter((place) =>
    place.name.toLowerCase().includes(query) ||
    place.category.toLowerCase().includes(query)
  );

  placeList.innerHTML = matches.map((place) => `
    <article class="place-card">
      <h3>${place.name}</h3>
      <p><strong>${place.category}</strong> · ★ ${place.rating}</p>
      <p>${place.description}</p>
    </article>
  `).join("");

  if (matches.length === 0) {
    placeList.innerHTML = "<p>No locations found.</p>";
  }
}

searchInput.addEventListener("input", () => displayPlaces(searchInput.value));

document.querySelector("#show-form-button").addEventListener("click", () => {
  addSection.hidden = false;
  addSection.scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#cancel-button").addEventListener("click", () => {
  addSection.hidden = true;
});

document.querySelector("#place-form").addEventListener("submit", (event) => {
  event.preventDefault();
  alert("can't do this yet!try later pls");
  event.target.reset();
  addSection.hidden = true;
});

// Logged out: the normal Login and Register links stay visible.
// Logged in: swap them for a greeting and a Log Out button.
async function displayAuthenticationStatus() {
  const authControls = document.querySelector("#auth-controls");

  try {
    const response = await fetch("/api/auth/me", { credentials: "same-origin" });
    if (!response.ok) return;

    const result = await response.json();
    if (!result.user) return;

    const greeting = document.createElement("span");
    greeting.className = "username-display";
    greeting.textContent = `Hello, ${result.user.username}`;

    const logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.textContent = "Log Out";
    logoutButton.addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
      window.location.reload();
    });

    authControls.replaceChildren(greeting, logoutButton);
  } catch (error) {
    console.log("Could not reach the server to check login status.");
  }
}

displayPlaces();
displayAuthenticationStatus();

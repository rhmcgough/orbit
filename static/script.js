// will keep can remove if we don't need it but will show only when the server can't be reached so it's not empty
const samplePlaces = [
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

// holds whatever is currently shown in the list from the server or the samples
let places = [];

const placeList = document.querySelector("#place-list");
const searchInput = document.querySelector("#search");
const addSection = document.querySelector("#add-section");
const placeForm = document.querySelector("#place-form");
const placeFormMessage = document.querySelector("#place-form-message");
const placeSubmitButton = placeForm.querySelector('button[type="submit"]');
const exploreSubtitle = document.querySelector("#explore-subtitle");

// builds one place card
function createPlaceCard(place) {
  const card = document.createElement("article");
  card.className = "place-card";

  const title = document.createElement("h3");
  title.textContent = place.name;

  const details = document.createElement("p");
  const category = document.createElement("strong");
  category.textContent = place.category;
  details.append(category);

  // places from the server don't have ratings yet
  if (place.rating != null) {
    details.append(` · ★ ${place.rating}`);
  }

  card.append(title, details);

  if (place.address) {
    const address = document.createElement("p");
    address.textContent = place.address;
    card.append(address);
  }

  if (place.description) {
    const description = document.createElement("p");
    description.textContent = place.description;
    card.append(description);
  }

  return card;
}

function displayPlaces(searchText = "") {
  const query = searchText.toLowerCase();
  const matches = places.filter((place) =>
    (place.name || "").toLowerCase().includes(query) ||
    (place.category || "").toLowerCase().includes(query)
  );

  if (places.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No places yet. Be the first to add one!";
    placeList.replaceChildren(empty);
    return;
  }

  if (matches.length === 0) {
    const none = document.createElement("p");
    none.textContent = "No locations found.";
    placeList.replaceChildren(none);
    return;
  }

  placeList.replaceChildren(...matches.map(createPlaceCard));
}

//list of places from the backend GET /api/locations
async function loadPlaces() {
  try {
    const response = await fetch("/api/locations", { credentials: "same-origin" });
    if (!response.ok) throw new Error(`Server responded with ${response.status}`);

    places = await response.json();
    exploreSubtitle.textContent = "Places shared by the Orbit community";
  } catch (error) {
    console.log("Could not load places from the server:", error);
    places = samplePlaces;
    exploreSubtitle.textContent = "Couldn't reach the server, so these are sample places";
  }

  displayPlaces(searchInput.value);
}

searchInput.addEventListener("input", () => displayPlaces(searchInput.value));

document.querySelector("#show-form-button").addEventListener("click", () => {
  placeFormMessage.textContent = "";
  addSection.hidden = false;
  addSection.scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#cancel-button").addEventListener("click", () => {
  placeForm.reset();
  placeFormMessage.textContent = "";
  addSection.hidden = true;
});

// sends the new place to the backend POST /api/locations after reloads the list
placeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newPlace = {
    name: document.querySelector("#place-name").value.trim(),
    category: document.querySelector("#place-category").value,
    address: document.querySelector("#place-address").value.trim(),
    description: document.querySelector("#place-description").value.trim()
  };

  placeFormMessage.textContent = "Saving...";
  placeSubmitButton.disabled = true;

  try {
    const response = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(newPlace)
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      placeFormMessage.textContent = result.error || result.message ||
        "The place could not be saved. Please try again.";
      return;
    }

    placeForm.reset();
    placeFormMessage.textContent = "";
    addSection.hidden = true;
    await loadPlaces();
    document.querySelector("#explore").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    placeFormMessage.textContent = "Could not reach the server. Please try again.";
  } finally {
    placeSubmitButton.disabled = false;
  }
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

loadPlaces();
displayAuthenticationStatus();

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

document.querySelector("#login-button").addEventListener("click", () => {
  alert("can't do this yet! try later pls");
});

displayPlaces();

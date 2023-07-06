// Helper function to format event date
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

// Fetch SpaceX historical events from the API
fetch("https://api.spacexdata.com/v3/history")
  .then((response) => response.json())
  .then((events) => {
    const eventList = document.getElementById("eventList");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");

    let filteredEvents = events;

    // Display events list
    function displayEvents() {
      eventList.innerHTML = "";

      filteredEvents.forEach((event) => {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event");
        eventElement.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-date">${formatDate(event.event_date_utc)}</div>
            <button class="like-button" data-event-id="${
              event.id
            }">Like</button>
          `;
        eventElement.addEventListener("click", () =>
          displayEventDetails(event)
        );
        eventList.appendChild(eventElement);
      });
    }

    // Filter events based on search input
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm)
      );
      displayEvents();
    });

    // Sort events based on selected option
    sortSelect.addEventListener("change", () => {
      const sortBy = sortSelect.value;

      filteredEvents.sort((a, b) => {
        if (sortBy === "date") {
          return new Date(a.event_date_utc) - new Date(b.event_date_utc);
        } else if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        } else if (sortBy === "flightNumber") {
          return a.flight_number - b.flight_number;
        }
      });

      displayEvents();
    });

    // Display event details when an event is clicked
    function displayEventDetails(event) {
      const eventDetails = document.getElementById("eventDetails");
      eventDetails.innerHTML = `
            <h2>${event.title}</h2>
            <p><strong>Date:</strong> ${formatDate(event.event_date_utc)}</p</p>
            <p><strong>Details:</strong> ${event.details}</p>
            <div class="event-link">
              <a href="${event.links.article}" target="_blank">Read Article</a>
              <a href="${event.links.wikipedia}" target="_blank">Wikipedia</a>
            </div>
          `;
      eventDetails.style.display = "block";
    }

    // Add event listener to like buttons
    function handleLike(event) {
      const eventId = event.target.dataset.eventId;
      const likeButton = event.target;

      // Update UI and perform additional actions (e.g., send a request to a server)
      likeButton.classList.toggle("liked");
      // Additional actions can be performed here (e.g., send a request to a server)

      event.stopPropagation(); // Prevent event bubbling to the event container
    }

    eventList.addEventListener("click", (event) => {
      if (event.target.matches(".article.story")) {
        handleLike(event);
      }
    });

    // Initial display of events
    displayEvents();
  });
// Fetch articles data
fetch("https://api.spacexdata.com/v3/history")
  .then((response) => response.json())
  .then((events) => {
    const articlesList = document.getElementById("articlesList");

    // Display list of articles
    events.forEach((event) => {
      const articleElement = document.createElement("div");
      articleElement.classList.add("article");
      articleElement.innerHTML = `
      <h2>${event.title}</h2>
      <p>${event.details}</p>
      <div class="article-link">
        <a href="${event.links.article}" target="_blank">Read Article</a>
        <a href="${event.links.wikipedia}" target="_blank">Wikipedia</a>
      </div>
    `;
      articlesList.appendChild(articleElement);
    });
  });

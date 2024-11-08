let typingTimer;
const typingInterval = 500;
const inputText = document.getElementById("inputText");
const suggestionsList = document.getElementById("suggestions");
const loadingElement = document.getElementById("loading");

inputText.addEventListener("input", () => {
  clearTimeout(typingTimer);
  loadingElement.style.display = "block";
  typingTimer = setTimeout(checkGrammar, typingInterval);
});

async function checkGrammar() {
  const text = inputText.value;

  if (!text) {
    suggestionsList.innerHTML = "";
    loadingElement.style.display = "none";
    return;
  }

  try {
    const response = await fetch(
      "https://dev-multivac.runspeargrowth.com/api/text-analysis/grammarly",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    const data = await response.json();
    suggestionsList.innerHTML = "";

    if (data.suggestions && data.suggestions.length > 0) {
      data.suggestions.forEach((item, index) => {
        const suggestionItem = document.createElement("li");
        suggestionItem.classList.add("suggestion-item");

        suggestionItem.innerHTML = `
          <p><strong>Suggestion:</strong> ${item.suggestion}</p>
          <h5><strong>Reason:</strong> ${item.reason}</h5>
          <button class="copyBtn" data-suggestion="${item.suggestion}">Copy</button>
        `;

        suggestionsList.appendChild(suggestionItem);
      });

      document.querySelectorAll(".copyBtn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const suggestionText = event.target.getAttribute("data-suggestion");
          navigator.clipboard
            .writeText(suggestionText)
            .then(() => {
              event.target.textContent = "Copied";
            })
            .catch((err) => {
              console.error("Failed to copy text: ", err);
            });
        });
      });
    } else {
      suggestionsList.innerHTML = "<li>No suggestions available.</li>";
    }
  } catch (error) {
    suggestionsList.innerHTML =
      "<li>Error fetching suggestion. Please try again.</li>";
    console.error("Error:", error);
  } finally {
    loadingElement.style.display = "none";
  }
}

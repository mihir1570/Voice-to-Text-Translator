document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const micBtn = document.getElementById("mic-btn");
  const resetBtn = document.getElementById("reset-btn");
  const copyInputBtn = document.getElementById("copy-input-btn"); // Copy button for input text
  const copyOutputBtn = document.getElementById("copy-output-btn"); // Copy button for output text
  const textInput = document.getElementById("text-input");
  const sourceLangSearch = document.getElementById("source-lang-search");
  const targetLangSearch = document.getElementById("target-lang-search");
  const sourceLangList = document.getElementById("source-lang-list");
  const targetLangList = document.getElementById("target-lang-list");

  // Initialize SpeechRecognition
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.interimResults = false;
  recognition.continuous = false;

  let isRecognizing = false;

  micBtn.addEventListener("click", () => {
    if (!isRecognizing) {
      recognition.lang = sourceLangSearch.dataset.code || "en-US";
      recognition.start();
      micBtn.classList.add("active");
      isRecognizing = true;
    } else {
      recognition.stop();
      micBtn.classList.remove("active");
      isRecognizing = false;
    }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    textInput.value = transcript;
    translateText(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    alert("Error in speech recognition. Please try again.");
  };

  recognition.onend = () => {
    micBtn.classList.remove("active");
    isRecognizing = false;
  };

  textInput.addEventListener("input", () => {
    translateText(textInput.value);
  });

  resetBtn.addEventListener("click", () => {
    textInput.value = "";
    output.value = "";
  });

  // Copy input text
  copyInputBtn.addEventListener("click", () => {
    textInput.select();
    document.execCommand("copy");
    alert("Input text copied to clipboard!");
  });

  // Copy output text
  copyOutputBtn.addEventListener("click", () => {
    output.select();
    document.execCommand("copy");
    alert("Translated text copied to clipboard!");
  });

  function populateDropdown(list, searchInput) {
    list.innerHTML = "";
    for (const [code, language] of Object.entries(countries)) {
      const li = document.createElement("li");
      li.textContent = language;
      li.dataset.code = code;
      li.addEventListener("click", () => {
        searchInput.value = language;
        searchInput.dataset.code = code;
        list.classList.remove("active");
        translateText(textInput.value);
      });
      list.appendChild(li);
    }
  }

  function filterDropdown(input, list) {
    const filter = input.value.toLowerCase();
    const items = list.querySelectorAll("li");
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(filter) ? "" : "none";
    });
  }

  populateDropdown(sourceLangList, sourceLangSearch);
  populateDropdown(targetLangList, targetLangSearch);

  sourceLangSearch.addEventListener("focus", () => {
    sourceLangList.classList.add("active");
    positionDropdown(sourceLangSearch, sourceLangList);
  });

  targetLangSearch.addEventListener("focus", () => {
    targetLangList.classList.add("active");
    positionDropdown(targetLangSearch, targetLangList);
  });

  sourceLangSearch.addEventListener("input", () => {
    filterDropdown(sourceLangSearch, sourceLangList);
  });

  targetLangSearch.addEventListener("input", () => {
    filterDropdown(targetLangSearch, targetLangList);
  });

  document.addEventListener("click", (e) => {
    if (
      !sourceLangSearch.contains(e.target) &&
      !sourceLangList.contains(e.target)
    ) {
      sourceLangList.classList.remove("active");
    }
    if (
      !targetLangSearch.contains(e.target) &&
      !targetLangList.contains(e.target)
    ) {
      targetLangList.classList.remove("active");
    }
  });

  function positionDropdown(input, list) {
    const rect = input.getBoundingClientRect();
    const dropdownHeight = list.offsetHeight;
    const viewportHeight = window.innerHeight;

    if (rect.bottom + dropdownHeight > viewportHeight) {
      list.style.bottom = "100%"; // Open upwards if space is limited
      list.style.top = "auto";
    } else {
      list.style.top = "100%"; // Default open position
      list.style.bottom = "auto";
    }
  }

  function translateText(text) {
    const sourceLang = sourceLangSearch.dataset.code || "en";
    const targetLang = targetLangSearch.dataset.code || "en";

    if (!text) {
      output.value = "No input detected.";
      return;
    }

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${targetLang}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.responseData && data.responseData.translatedText) {
          output.value = data.responseData.translatedText;
        } else {
          output.value = "Translation error. Please try again.";
        }
      })
      .catch((error) => {
        console.error("Translation error:", error);
        output.value = "An error occurred while translating.";
      });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});





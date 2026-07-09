/* ==========================================================================
   CineFlix — interactive behavior
   1) Loading spinner on the search form
   2) Live search suggestions as you type
   3) Netflix-style carousel arrow scrolling
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    setupLoadingSpinner();
    setupSearchSuggestions();
    setupCarousels();
});

/* ---------- 1) Loading spinner on submit ---------- */

function setupLoadingSpinner() {
    const form = document.getElementById("searchForm");
    const overlay = document.getElementById("loadingOverlay");
    if (!form || !overlay) return;

    form.addEventListener("submit", function () {
        const input = document.getElementById("movieInput");
        if (!input || !input.value.trim()) return; // let native validation handle empty input
        overlay.classList.add("show");
    });
}

/* ---------- 2) Live search suggestions ---------- */

function setupSearchSuggestions() {
    const input = document.getElementById("movieInput");
    const list = document.getElementById("suggestionsList");
    if (!input || !list) return;

    let debounceTimer = null;
    let activeIndex = -1;
    let items = [];

    input.addEventListener("input", function () {
        const query = input.value.trim();
        clearTimeout(debounceTimer);

        if (query.length < 2) {
            hideSuggestions();
            return;
        }

        debounceTimer = setTimeout(() => fetchSuggestions(query), 250);
    });

    input.addEventListener("keydown", function (e) {
        if (!list.classList.contains("show")) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive(activeIndex + 1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive(activeIndex - 1);
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            selectSuggestion(items[activeIndex]);
        } else if (e.key === "Escape") {
            hideSuggestions();
        }
    });

    document.addEventListener("click", function (e) {
        if (!list.contains(e.target) && e.target !== input) {
            hideSuggestions();
        }
    });

    function fetchSuggestions(query) {
        // Expects a Flask route: GET /suggest?q=<term> -> JSON array of title strings
        fetch(`/suggest?q=${encodeURIComponent(query)}`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => renderSuggestions(Array.isArray(data) ? data : []))
            .catch(() => hideSuggestions());
    }

    function renderSuggestions(titles) {
        items = titles.slice(0, 8);
        activeIndex = -1;

        if (items.length === 0) {
            hideSuggestions();
            return;
        }

        list.innerHTML = items
            .map((title, i) => `<li data-index="${i}">${escapeHtml(title)}</li>`)
            .join("");

        list.classList.add("show");

        list.querySelectorAll("li").forEach((li) => {
            li.addEventListener("click", () => selectSuggestion(items[Number(li.dataset.index)]));
        });
    }

    function setActive(index) {
        const options = list.querySelectorAll("li");
        if (options.length === 0) return;

        activeIndex = (index + options.length) % options.length;
        options.forEach((li) => li.classList.remove("active"));
        options[activeIndex].classList.add("active");
        options[activeIndex].scrollIntoView({ block: "nearest" });
    }

    function selectSuggestion(title) {
        input.value = title;
        hideSuggestions();
        input.focus();
    }

    function hideSuggestions() {
        list.classList.remove("show");
        list.innerHTML = "";
        activeIndex = -1;
        items = [];
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }
}

/* ---------- 3) Carousel arrows ---------- */

function setupCarousels() {
    document.querySelectorAll(".carousel").forEach((carousel) => {
        const track = carousel.querySelector(".carousel-track");
        const leftBtn = carousel.querySelector(".carousel-arrow.left");
        const rightBtn = carousel.querySelector(".carousel-arrow.right");
        if (!track || !leftBtn || !rightBtn) return;

        const scrollAmount = () => track.clientWidth * 0.8;

        leftBtn.addEventListener("click", () => {
            track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
        });

        rightBtn.addEventListener("click", () => {
            track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
        });

        const updateArrows = () => {
            leftBtn.disabled = track.scrollLeft <= 4;
            rightBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        };

        track.addEventListener("scroll", updateArrows);
        window.addEventListener("resize", updateArrows);
        updateArrows();
    });
}
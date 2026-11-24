
/* =================================
   STATSPARK - MAIN JAVASCRIPT
   ================================= */


/* 1. MOBILE NAVIGATION MENU */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {

        navMenu.classList.toggle("show");

        const isOpen = navMenu.classList.contains("show");

        menuToggle.textContent = isOpen ? "✕" : "☰";

        menuToggle.setAttribute("aria-expanded", isOpen);

    });

}


/* 2. AUTOMATIC COPYRIGHT YEAR */

const currentYear = document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


/* 3. CLOSE MOBILE MENU AFTER CLICKING A LINK */

if (navMenu) {

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("show");

            if (menuToggle) {
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-expanded", "false");
            }

        });

    });

}


/* 4. CONSOLE MESSAGE */

console.log("STATSPARK website loaded successfully!");


// =====================================
// 5. STATSPARK TOPIC SEARCH
// =====================================

const topicSearch = document.getElementById("topicSearch");
const searchMessage = document.getElementById("searchMessage");

if (topicSearch && searchMessage) {

    const topics = [
        "data-description",
        "probability",
        "random-variables",
        "distributions",
        "regression"
    ];

    function searchTopics() {

        const keyword = topicSearch.value.toLowerCase().trim();

        let count = 0;

        topics.forEach(function (id) {

            const section = document.getElementById(id);

            if (!section) return;

            const matches = section.textContent
                .toLowerCase()
                .includes(keyword);

            section.hidden = !matches;

            if (matches) {
                count++;
            }

        });

        if (keyword === "") {
            searchMessage.textContent = "Showing all " + count + " topics.";
        } else if (count === 0) {
            searchMessage.textContent = "No topics found. Try another keyword.";
        } else {
            searchMessage.textContent = "Found " + count + " topic(s).";
        }

    }

    topicSearch.addEventListener("input", searchTopics);

    searchTopics();

}
// =====================================
// 6. EXPANDABLE NOTES
// =====================================

function toggleNotes(id) {

    const notes = document.getElementById(id);

    if (!notes) return;

    notes.hidden = !notes.hidden;

    const button = notes.previousElementSibling;

    if (notes.hidden) {
        button.textContent = "+ More Notes";
    } else {
        button.textContent = "- Hide Notes";
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const dashboard = document.getElementById("dashboard");
    const adminLoginButton = document.getElementById("admin-login-button");
    const adminLoginForm = document.getElementById("admin-login-form");
    const logoutButton = document.getElementById("logout-button");
    const dynamicContent = document.getElementById("dynamic-content");
    const dynamicNav = document.getElementById("dynamic-nav");
    const sectionForm = document.getElementById("section-form");
    const sectionsList = document.getElementById("sections-list");

    const username = "ADMIN";
    const password = "ADMIN1234";

    let savedSections = JSON.parse(localStorage.getItem("sections")) || [];

    // Funzione per mostrare le sezioni nel sito principale e nella navigazione
    function renderSections() {
        dynamicContent.innerHTML = "";
        dynamicNav.innerHTML = "";

        savedSections.forEach((section, index) => {
            // Contenuto principale
            const sectionDiv = document.createElement("section");
            sectionDiv.id = `section-${index}`;
            sectionDiv.innerHTML = `
                <h2>${section.title}</h2>
                <p>${section.content}</p>
                ${section.image ? `<img src="${section.image}" alt="Section Image" style="max-width:100%; border-radius:8px;">` : ""}
            `;
            dynamicContent.appendChild(sectionDiv);

            // Navigazione
            const navItem = document.createElement("li");
            navItem.innerHTML = `<a href="#section-${index}">${section.title}</a>`;
            dynamicNav.appendChild(navItem);

            // Sezioni nella dashboard
            const adminSection = document.createElement("div");
            adminSection.innerHTML = `
                <h3>${section.title}</h3>
                <button onclick="editSection(${index})">Edit</button>
                <button onclick="deleteSection(${index})">Delete</button>
            `;
            sectionsList.appendChild(adminSection);
        });
    }

    renderSections();

    // Admin Login
    adminLoginButton.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.classList.remove("hidden");
    });

    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputUsername = document.getElementById("username").value;
        const inputPassword = document.getElementById("password").value;

        if (inputUsername === username && inputPassword === password) {
            loginForm.classList.add("hidden");
            dashboard.classList.remove("hidden");
        } else {
            alert("Invalid credentials!");
        }
    });

    logoutButton.addEventListener("click", () => {
        dashboard.classList.add("hidden");
    });

    // Add Section
    sectionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("section-title").value;
        const content = document.getElementById("section-content").value;
        const image = document.getElementById("section-image").value;

        savedSections.push({ title, content, image });
        localStorage.setItem("sections", JSON.stringify(savedSections));

        renderSections();
        sectionForm.reset();
    });

    // Delete Section
    window.deleteSection = (index) => {
        savedSections.splice(index, 1);
        localStorage.setItem("sections", JSON.stringify(savedSections));
        renderSections();
    };

    // Edit Section
    window.editSection = (index) => {
        const section = savedSections[index];
        document.getElementById("section-title").value = section.title;
        document.getElementById("section-content").value = section.content;
        document.getElementById("section-image").value = section.image;

        // Remove old section on save
        sectionForm.onsubmit = (e) => {
            e.preventDefault();
            savedSections[index] = {
                title: document.getElementById("section-title").value,
                content: document.getElementById("section-content").value,
                image: document.getElementById("section-image").value,
            };
            localStorage.setItem("sections", JSON.stringify(savedSections));
            renderSections();
            sectionForm.reset();
            sectionForm.onsubmit = addSection;
        };
    };

    // Add Section (default behavior)
    const addSection = sectionForm.onsubmit;
});

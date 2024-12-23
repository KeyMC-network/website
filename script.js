document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const dashboard = document.getElementById("dashboard");
    const adminLoginButton = document.getElementById("admin-login-button");
    const adminLoginForm = document.getElementById("admin-login-form");
    const logoutButton = document.getElementById("logout-button");
    const dynamicContent = document.getElementById("dynamic-content");
    const sectionForm = document.getElementById("section-form");
    const sectionsList = document.getElementById("sections-list");

    const username = "ADMIN";
    const password = "ADMIN1234";

    const savedSections = JSON.parse(localStorage.getItem("sections")) || [];

    // Render saved sections
    function renderSections() {
        dynamicContent.innerHTML = "";
        savedSections.forEach((section, index) => {
            const sectionDiv = document.createElement("section");
            sectionDiv.innerHTML = `<h2>${section.title}</h2><p>${section.content}</p>`;
            dynamicContent.appendChild(sectionDiv);

            // Add to admin dashboard
            const adminSection = document.createElement("div");
            adminSection.innerHTML = `
                <h3>${section.title}</h3>
                <button onclick="deleteSection(${index})">Delete</button>`;
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

        savedSections.push({ title, content });
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
});

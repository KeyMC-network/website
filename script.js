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

    function renderSections() {
        dynamicContent.innerHTML = "";
        dynamicNav.innerHTML = "";

        savedSections.forEach((section, index) => {
            const sectionDiv = document.createElement("section");
            sectionDiv.style.backgroundColor = section.color;
            sectionDiv.innerHTML = `
                <h2>${section.title}</h2>
                <p>${section.content}</p>
                ${section.image ? `<img src="${section.image}" alt="Section Image" style="max-width:100%; border-radius:8px;">` : ""}
            `;
            dynamicContent.appendChild(sectionDiv);

            const navItem = document.createElement("li");
            navItem.innerHTML = `<a href="#section-${index}">${section.title}</a>`;
            dynamicNav.appendChild(navItem);

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

    sectionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("section-title").value;
        const content = document.getElementById("section-content").value;
        const imageFile = document.getElementById("section-image").files[0];
        const color = document.getElementById("section-color").value;

        const reader = new FileReader();
        reader.onload = function () {
            const image = imageFile ? reader.result : null;
            savedSections.push({ title, content, image, color });
            localStorage.setItem("sections", JSON.stringify(savedSections));
            renderSections();
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        } else {
            savedSections.push({ title, content, image: null, color });
            localStorage.setItem("sections", JSON.stringify(savedSections));
            renderSections();
        }

        sectionForm.reset();
    });

    window.deleteSection = (index) => {
        savedSections.splice(index, 1);
        localStorage.setItem("sections", JSON.stringify(savedSections));
        renderSections();
    };

    window.editSection = (index) => {
        const section = savedSections[index];
        document.getElementById("section-title").value = section.title;
        document.getElementById("section-content").value = section.content;
        document.getElementById("section-color").value = section.color;

        sectionForm.onsubmit = (e) => {
            e.preventDefault();
            const title = document.getElementById("section-title").value;
            const content = document.getElementById("section-content").value;
            const color = document.getElementById("section-color").value;
            const imageFile = document.getElementById("section-image").files[0];

            const reader = new FileReader();
            reader.onload = function () {
                const image = imageFile ? reader.result : section.image;
                savedSections[index] = { title, content, image, color };
                localStorage.setItem("sections", JSON.stringify(savedSections));
                renderSections();
            };

            if (imageFile) {
                reader.readAsDataURL(imageFile);
            } else {
                savedSections[index] = { title, content, image: section.image, color };
                localStorage.setItem("sections", JSON.stringify(savedSections));
                renderSections();
            }

            sectionForm.reset();
            sectionForm.onsubmit = sectionFormDefault;
        };
    };

    const sectionFormDefault = sectionForm.onsubmit;
});

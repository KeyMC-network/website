document.addEventListener("DOMContentLoaded", () => {
    // ELEMENTI DOM
    const loginForm = document.getElementById("login-form");
    const dashboard = document.getElementById("dashboard");
    const adminLoginButton = document.getElementById("admin-login-button");
    const adminLoginForm = document.getElementById("admin-login-form");
    const logoutButton = document.getElementById("logout-button");
    const dynamicContent = document.getElementById("dynamic-content");
    const dynamicNav = document.getElementById("dynamic-nav");
    const sectionForm = document.getElementById("section-form");
    const subsectionsContainer = document.getElementById("subsections-container");
    const addSubsectionButton = document.getElementById("add-subsection");
    const sectionsList = document.getElementById("sections-list");

    // CREDENZIALI ADMIN
    const username = "ADMIN";
    const password = "ADMIN1234";

    // SEZIONI SALVATE
    let savedSections = JSON.parse(localStorage.getItem("sections")) || [];

    /**
     * Mostra un messaggio all'utente.
     * @param {string} message - Il messaggio da mostrare.
     * @param {string} type - Il tipo di messaggio ("success" o "error").
     */
    function showMessage(message, type) {
        const messageBox = document.createElement("div");
        messageBox.className = `message ${type}`;
        messageBox.textContent = message;
        document.body.appendChild(messageBox);
        setTimeout(() => {
            messageBox.remove();
        }, 3000);
    }

    /**
     * APRE IL DASHBOARD
     */
    function openDashboard() {
        loginForm.classList.add("hidden");
        dashboard.classList.remove("hidden");
        showMessage("Welcome to the Admin Dashboard!", "success");
    }

    /**
     * CHIUDE IL DASHBOARD
     */
    function closeDashboard() {
        dashboard.classList.add("hidden");
        loginForm.classList.add("hidden");
        showMessage("Logged out successfully!", "success");
    }

    /**
     * GESTIONE LOGIN ADMIN
     */
    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputUsername = document.getElementById("username").value;
        const inputPassword = document.getElementById("password").value;

        if (inputUsername === username && inputPassword === password) {
            openDashboard();
        } else {
            showMessage("Invalid credentials. Please try again.", "error");
        }
    });

    /**
     * MOSTRA IL FORM DI LOGIN
     */
    adminLoginButton.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.classList.remove("hidden");
    });

    /**
     * GESTIONE LOGOUT
     */
    logoutButton.addEventListener("click", () => {
        closeDashboard();
    });

    /**
     * CREA IL LINK PER OGNI SEZIONE NELLA NAVBAR.
     * @param {string} sectionId - L'ID della sezione.
     * @param {string} sectionTitle - Il titolo della sezione.
     */
    function createNavLink(sectionId, sectionTitle) {
        const navItem = document.createElement("li");
        navItem.innerHTML = `<a href="#${sectionId}" class="nav-link">${sectionTitle}</a>`;
        navItem.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToSection(sectionId);
        });
        dynamicNav.appendChild(navItem);
    }

    /**
     * SCORRE ALLA SEZIONE SPECIFICATA.
     * @param {string} sectionId - L'ID della sezione.
     */
    function scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth" });
        }
    }

    /**
     * RENDERIZZA LE SEZIONI NELLA PAGINA E NEL DASHBOARD.
     */
    function renderSections() {
        dynamicContent.innerHTML = "";
        dynamicNav.innerHTML = "";
        sectionsList.innerHTML = "";

        savedSections.forEach((section, index) => {
            const sectionId = `section-${index}`;

            // Render sezione nella pagina principale
            const sectionDiv = document.createElement("section");
            sectionDiv.style.backgroundColor = section.color;
            sectionDiv.id = sectionId;
            sectionDiv.innerHTML = `
                <h2>${section.title}</h2>
                <p>${section.description}</p>
                <div>
                    ${section.subsections
                        .map(
                            (sub) => `
                            <div style="background-color:${sub.color}; margin-bottom:10px; padding:10px; border-radius:8px;">
                                <h3>${sub.title}</h3>
                                ${sub.image ? `<img src="${sub.image}" style="max-width:100%; border-radius:8px;">` : ""}
                                <p>${sub.description}</p>
                            </div>
                        `
                        )
                        .join("")}
                </div>
            `;
            dynamicContent.appendChild(sectionDiv);

            // Aggiunge link alla navbar
            createNavLink(sectionId, section.title);

            // Aggiunge controlli nella dashboard
            const adminSection = document.createElement("div");
            adminSection.innerHTML = `
                <h3>${section.title}</h3>
                <button onclick="editSection(${index})">Edit</button>
                <button onclick="deleteSection(${index})">Delete</button>
            `;
            sectionsList.appendChild(adminSection);
        });
    }

    /**
     * AGGIUNGE UNA NUOVA SOTTO-SEZIONE DINAMICAMENTE.
     */
    function addSubsection() {
        const subsectionDiv = document.createElement("div");
        subsectionDiv.className = "subsection";
        subsectionDiv.innerHTML = `
            <label>Sub-Section Title:</label>
            <input type="text" class="sub-title" placeholder="Sub-Section Title" required>
            <label>Sub-Section Description:</label>
            <textarea class="sub-description" placeholder="Sub-Section Description" required></textarea>
            <label>Sub-Section Background Color:</label>
            <input type="color" class="sub-color" value="#ffffff">
            <label>Sub-Section Image (optional):</label>
            <input type="file" class="sub-image" accept="image/*">
            <button type="button" class="remove-subsection">Remove</button>
        `;
        subsectionsContainer.appendChild(subsectionDiv);

        // Aggiunge evento per rimuovere la sotto-sezione
        subsectionDiv.querySelector(".remove-subsection").addEventListener("click", () => {
            subsectionDiv.remove();
        });
    }

    /**
     * GESTISCE IL SUBMIT DEL FORM DI CREAZIONE SEZIONI.
     */
    sectionForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("section-title").value;
        const description = document.getElementById("section-content").value;
        const color = document.getElementById("section-color").value;

        const subsections = Array.from(subsectionsContainer.children).map((sub) => {
            const subTitle = sub.querySelector(".sub-title").value;
            const subDescription = sub.querySelector(".sub-description").value;
            const subColor = sub.querySelector(".sub-color").value;
            const subImageFile = sub.querySelector(".sub-image").files[0];

            let subImage = null;
            if (subImageFile) {
                const reader = new FileReader();
                reader.onload = () => {
                    subImage = reader.result;
                };
                reader.readAsDataURL(subImageFile);
            }

            return { title: subTitle, description: subDescription, color: subColor, image: subImage };
        });

        savedSections.push({ title, description, color, subsections });
        localStorage.setItem("sections", JSON.stringify(savedSections));

        renderSections();
        sectionForm.reset();
        subsectionsContainer.innerHTML = "";
        showMessage("Section created successfully!", "success");
    });

    /**
     * ELIMINA UNA SEZIONE
     */
    window.deleteSection = (index) => {
        if (confirm("Are you sure you want to delete this section?")) {
            savedSections.splice(index, 1);
            localStorage.setItem("sections", JSON.stringify(savedSections));
            renderSections();
            showMessage("Section deleted successfully.", "success");
        }
    };

    // Eventi
    addSubsectionButton.addEventListener("click", addSubsection);
    renderSections();
});

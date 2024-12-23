document.addEventListener("DOMContentLoaded", () => {
    // Elementi DOM
    const loginForm = document.getElementById("login-form");
    const dashboard = document.getElementById("dashboard");
    const adminLoginButton = document.getElementById("admin-login-button");
    const adminLoginForm = document.getElementById("admin-login-form");
    const logoutButton = document.getElementById("logout-button");
    const dynamicContent = document.getElementById("dynamic-content");
    const sectionForm = document.getElementById("section-form");
    const subsectionsContainer = document.getElementById("subsections-container");
    const addSubsectionButton = document.getElementById("add-subsection");
    const backgroundForm = document.getElementById("background-form");
    const backgroundUpload = document.getElementById("background-upload");
    const heroImage = document.getElementById("hero-image");

    // Credenziali Admin
    const username = "ADMIN";
    const password = "ADMIN1234";

    // Sezioni salvate e immagine di background
    let savedSections = JSON.parse(localStorage.getItem("sections")) || [];
    const savedBackground = localStorage.getItem("heroBackground");

    // Carica l'immagine di background salvata (se presente)
    if (savedBackground) {
        heroImage.src = savedBackground;
    }

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
     * Login Admin
     */
    adminLoginButton.addEventListener("click", () => {
        loginForm.classList.add("active");
    });

    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputUsername = document.getElementById("username").value;
        const inputPassword = document.getElementById("password").value;

        if (inputUsername === username && inputPassword === password) {
            loginForm.classList.remove("active");
            dashboard.classList.add("active");
            showMessage("Welcome to the Admin Dashboard!", "success");
        } else {
            showMessage("Invalid credentials. Please try again.", "error");
        }
    });

    logoutButton.addEventListener("click", () => {
        dashboard.classList.remove("active");
        showMessage("You have logged out.", "success");
    });

    /**
     * Cambia immagine di background della sezione Hero
     */
    backgroundForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const file = backgroundUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageData = reader.result;
                heroImage.src = imageData;
                localStorage.setItem("heroBackground", imageData);
                showMessage("Hero background updated successfully!", "success");
            };
            reader.readAsDataURL(file);
        } else {
            showMessage("Please select an image to upload.", "error");
        }
    });

    /**
     * Renderizza le sezioni nella pagina principale e nel dashboard.
     */
    function renderSections() {
        dynamicContent.innerHTML = "";
        savedSections.forEach((section, index) => {
            const sectionDiv = document.createElement("div");
            sectionDiv.style.backgroundColor = section.color;
            sectionDiv.innerHTML = `
                <h2>${section.title}</h2>
                <p>${section.description}</p>
                <div>
                    ${section.subsections
                        .map(
                            (sub) => `
                        <div style="background-color:${sub.color}; margin: 10px; padding: 10px; border-radius: 5px;">
                            <h3>${sub.title}</h3>
                            <p>${sub.description}</p>
                        </div>
                    `
                        )
                        .join("")}
                </div>
            `;
            dynamicContent.appendChild(sectionDiv);
        });
    }

    /**
     * Aggiunge una nuova sotto-sezione dinamicamente.
     */
    addSubsectionButton.addEventListener("click", () => {
        const subsectionDiv = document.createElement("div");
        subsectionDiv.innerHTML = `
            <input type="text" class="sub-title" placeholder="Sub-section Title">
            <textarea class="sub-description" placeholder="Sub-section Description"></textarea>
            <input type="color" class="sub-color">
            <button type="button" class="remove-subsection">Remove</button>
        `;
        subsectionDiv.querySelector(".remove-subsection").addEventListener("click", () => {
            subsectionDiv.remove();
        });
        subsectionsContainer.appendChild(subsectionDiv);
    });

    /**
     * Gestisce il submit del form di creazione o modifica sezioni.
     */
    sectionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("section-title").value;
        const description = document.getElementById("section-content").value;
        const color = document.getElementById("section-color").value;

        const subsections = Array.from(subsectionsContainer.children).map((sub) => {
            return {
                title: sub.querySelector(".sub-title").value,
                description: sub.querySelector(".sub-description").value,
                color: sub.querySelector(".sub-color").value,
            };
        });

        savedSections.push({ title, description, color, subsections });
        localStorage.setItem("sections", JSON.stringify(savedSections));

        renderSections();
        sectionForm.reset();
        subsectionsContainer.innerHTML = "";
        showMessage("Section created successfully!", "success");
    });

    /**
     * Elimina una sezione specifica.
     */
    function deleteSection(index) {
        if (confirm("Are you sure you want to delete this section?")) {
            savedSections.splice(index, 1);
            localStorage.setItem("sections", JSON.stringify(savedSections));
            renderSections();
            showMessage("Section deleted successfully.", "success");
        }
    }

    /**
     * Modifica una sezione specifica.
     */
    function editSection(index) {
        const section = savedSections[index];
        document.getElementById("section-title").value = section.title;
        document.getElementById("section-content").value = section.description;
        document.getElementById("section-color").value = section.color;

        subsectionsContainer.innerHTML = "";
        section.subsections.forEach((sub) => {
            const subsectionDiv = document.createElement("div");
            subsectionDiv.innerHTML = `
                <input type="text" class="sub-title" value="${sub.title}" placeholder="Sub-section Title">
                <textarea class="sub-description" placeholder="Sub-section Description">${sub.description}</textarea>
                <input type="color" class="sub-color" value="${sub.color}">
                <button type="button" class="remove-subsection">Remove</button>
            `;
            subsectionDiv.querySelector(".remove-subsection").addEventListener("click", () => {
                subsectionDiv.remove();
            });
            subsectionsContainer.appendChild(subsectionDiv);
        });

        sectionForm.onsubmit = (e) => {
            e.preventDefault();
            section.title = document.getElementById("section-title").value;
            section.description = document.getElementById("section-content").value;
            section.color = document.getElementById("section-color").value;

            section.subsections = Array.from(subsectionsContainer.children).map((sub) => {
                return {
                    title: sub.querySelector(".sub-title").value,
                    description: sub.querySelector(".sub-description").value,
                    color: sub.querySelector(".sub-color").value,
                };
            });

            savedSections[index] = section;
            localStorage.setItem("sections", JSON.stringify(savedSections));

            renderSections();
            sectionForm.reset();
            subsectionsContainer.innerHTML = "";
            sectionForm.onsubmit = null; // Reset the form submission handler
            showMessage("Section updated successfully!", "success");
        };
    }

    // Renderizza le sezioni salvate all'avvio
    renderSections();
});

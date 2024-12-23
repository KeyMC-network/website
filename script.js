document.addEventListener("DOMContentLoaded", () => {
    // === ELEMENTI PRINCIPALI ===
    const loginForm = document.getElementById("login-form");
    const dashboard = document.getElementById("dashboard");
    const togglePasswordButton = document.getElementById("toggle-password");
    const passwordField = document.getElementById("password");
    const logoutButton = document.getElementById("logout-button");
    const dynamicContent = document.getElementById("dynamic-content");
    const sectionForm = document.getElementById("section-form");
    const subsectionsContainer = document.getElementById("subsections-container");
    const addSubsectionButton = document.getElementById("add-subsection");
    const resetButton = document.createElement("button");

    // === CREDENZIALI PRINCIPALI ===
    const adminUsername = "ADMIN";
    const adminPassword = "ADMIN1234";

    // === DATI SALVATI ===
    let savedSections = JSON.parse(localStorage.getItem("sections")) || [];

    /**
     * Mostra un messaggio di alert
     */
    function showAlert(message, type = "info") {
        switch (type) {
            case "success":
                console.log(`✅ SUCCESS: ${message}`);
                break;
            case "error":
                console.error(`❌ ERROR: ${message}`);
                break;
            default:
                console.info(`ℹ️ INFO: ${message}`);
        }
    }

    /**
     * Toggle visibilità password
     */
    togglePasswordButton.addEventListener("click", () => {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            togglePasswordButton.textContent = "🙈";
        } else {
            passwordField.type = "password";
            togglePasswordButton.textContent = "👁️";
        }
    });

    /**
     * Gestione login
     */
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputUsername = document.getElementById("username").value.trim();
        const inputPassword = passwordField.value.trim();

        if (inputUsername === adminUsername && inputPassword === adminPassword) {
            showAlert("Login effettuato con successo!", "success");
            loginForm.classList.add("hidden");
            dashboard.classList.remove("hidden");
        } else {
            showAlert("Credenziali non valide. Riprova.", "error");
        }
    });

    /**
     * Logout
     */
    logoutButton.addEventListener("click", () => {
        showAlert("Hai effettuato il logout.", "info");
        dashboard.classList.add("hidden");
        loginForm.classList.remove("hidden");
    });

    /**
     * Renderizza sezioni salvate
     */
    function renderSections() {
        dynamicContent.innerHTML = "";
        savedSections.forEach((section, index) => {
            const sectionDiv = document.createElement("div");
            sectionDiv.style.backgroundColor = section.color || "#ffffff";
            sectionDiv.innerHTML = `
                <h2>${section.title}</h2>
                <p>${section.description}</p>
                <div>
                    ${
                        section.subsections
                            ?.map(
                                (sub) => `
                        <div style="background-color:${sub.color || "#f4f4f4"}; margin:10px; padding:10px; border-radius:5px;">
                            <h3>${sub.title || "Senza Titolo"}</h3>
                            <p>${sub.description || "Nessuna descrizione"}</p>
                        </div>
                    `
                            )
                            .join("") || ""
                    }
                </div>
            `;
            dynamicContent.appendChild(sectionDiv);
        });
    }

    /**
     * Resetta tutte le sezioni salvate
     */
    resetButton.textContent = "Reset All Sections";
    resetButton.style.backgroundColor = "#ff4d4d";
    resetButton.style.color = "white";
    resetButton.style.border = "none";
    resetButton.style.padding = "10px 15px";
    resetButton.style.borderRadius = "5px";
    resetButton.style.cursor = "pointer";
    resetButton.style.marginTop = "20px";

    dynamicContent.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
        if (confirm("Sei sicuro di voler eliminare tutte le sezioni salvate?")) {
            savedSections = [];
            localStorage.removeItem("sections");
            renderSections();
            showAlert("Tutte le sezioni sono state eliminate con successo.", "success");
        }
    });

    /**
     * Aggiunge una nuova sotto-sezione
     */
    addSubsectionButton.addEventListener("click", () => {
        const subsectionDiv = document.createElement("div");
        subsectionDiv.innerHTML = `
            <input type="text" class="sub-title" placeholder="Titolo Sotto-sezione">
            <textarea class="sub-description" placeholder="Descrizione Sotto-sezione"></textarea>
            <input type="color" class="sub-color">
            <button type="button" class="remove-subsection">Rimuovi</button>
        `;
        subsectionDiv.querySelector(".remove-subsection").addEventListener("click", () => {
            subsectionDiv.remove();
        });
        subsectionsContainer.appendChild(subsectionDiv);
    });

    /**
     * Salva una nuova sezione
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
        showAlert("Sezione creata con successo!", "success");
    });

    // Renderizza le sezioni salvate all'avvio
    renderSections();
});

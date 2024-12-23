// === DOCUMENT READY ===
document.addEventListener("DOMContentLoaded", () => {
    // === ELEMENTI PRINCIPALI ===
    const adminLoginForm = document.getElementById("admin-login-form");
    const togglePasswordButton = document.getElementById("toggle-password");
    const passwordField = document.getElementById("password");
    const logoutButton = document.getElementById("logout-button");
    const createStaffForm = document.getElementById("create-staff-form");
    const staffList = document.getElementById("staff-ul");
    const staffUsernameField = document.getElementById("staff-username");
    const staffPasswordField = document.getElementById("staff-password");
    const dynamicContent = document.getElementById("dynamic-content");
    const sectionForm = document.getElementById("section-form");
    const subsectionsContainer = document.getElementById("subsections-container");
    const addSubsectionButton = document.getElementById("add-subsection");
    const resetButton = document.createElement("button");

    // === CREDENZIALI PRINCIPALI ===
    const masterUsername = "ADMIN";
    const masterPassword = "ADMIN1234";

    // === DATI SALVATI ===
    let savedSections = JSON.parse(localStorage.getItem("sections")) || [];
    let savedAdmins = JSON.parse(localStorage.getItem("admins")) || [
        { username: masterUsername, password: masterPassword },
    ];

    // === FUNZIONI UTILI ===

    /**
     * Aggiorna il contenuto dinamico del DOM
     */
    function updateDOM(element, content) {
        if (element) {
            element.innerHTML = content;
        }
    }

    /**
     * Aggiunge un evento con sicurezza
     */
    function safeAddEventListener(element, event, callback) {
        if (element) {
            element.addEventListener(event, callback);
        }
    }

    /**
     * Mostra un messaggio di conferma
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

    // === TOGGLE PASSWORD VISIBILITY ===
    safeAddEventListener(togglePasswordButton, "click", () => {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            togglePasswordButton.textContent = "🙈";
        } else {
            passwordField.type = "password";
            togglePasswordButton.textContent = "👁️";
        }
    });

    // === LOGIN ADMIN ===
    safeAddEventListener(adminLoginForm, "submit", (e) => {
        e.preventDefault();
        const inputUsername = document.getElementById("username").value.trim();
        const inputPassword = passwordField.value.trim();

        const matchedAdmin = savedAdmins.find(
            (admin) => admin.username === inputUsername && admin.password === inputPassword
        );

        if (matchedAdmin) {
            showAlert("Login effettuato con successo!", "success");
            window.location.href = "dashboard.html"; // Reindirizza alla dashboard
        } else {
            showAlert("Credenziali non valide. Riprova.", "error");
        }
    });

    // === LOGOUT ADMIN ===
    safeAddEventListener(logoutButton, "click", () => {
        showAlert("Hai effettuato il logout.", "info");
        window.location.href = "index.html"; // Torna al login
    });

    // === CREAZIONE NUOVO ADMIN ===
    safeAddEventListener(createStaffForm, "submit", (e) => {
        e.preventDefault();
        const newUsername = staffUsernameField.value.trim();
        const newPassword = staffPasswordField.value.trim();

        if (!newUsername || !newPassword) {
            showAlert("Inserisci un username e una password validi.", "error");
            return;
        }

        const existingAdmin = savedAdmins.find((admin) => admin.username === newUsername);
        if (existingAdmin) {
            showAlert("Questo username esiste già. Scegline un altro.", "error");
            return;
        }

        savedAdmins.push({ username: newUsername, password: newPassword });
        localStorage.setItem("admins", JSON.stringify(savedAdmins));
        updateStaffList();
        createStaffForm.reset();
        showAlert(`Admin "${newUsername}" creato con successo.`, "success");
    });

    // === AGGIORNAMENTO LISTA STAFF ===
    function updateStaffList() {
        if (!staffList) return;
        staffList.innerHTML = "";
        savedAdmins.forEach((admin) => {
            const li = document.createElement("li");
            li.textContent = admin.username;
            staffList.appendChild(li);
        });
    }

    updateStaffList();

    // === RENDERIZZA SEZIONI ===
    function renderSections() {
        if (!dynamicContent) return;
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

    renderSections();

    // === RESETTA SEZIONI ===
    resetButton.textContent = "Reset All Sections";
    resetButton.style.backgroundColor = "#ff4d4d";
    resetButton.style.color = "white";
    resetButton.style.border = "none";
    resetButton.style.padding = "10px 15px";
    resetButton.style.borderRadius = "5px";
    resetButton.style.cursor = "pointer";
    resetButton.style.marginTop = "20px";

    if (dynamicContent) {
        dynamicContent.appendChild(resetButton);
    }

    safeAddEventListener(resetButton, "click", () => {
        if (confirm("Sei sicuro di voler eliminare tutte le sezioni salvate?")) {
            savedSections = [];
            localStorage.removeItem("sections");
            renderSections();
            showAlert("Tutte le sezioni sono state eliminate con successo.", "success");
        }
    });

    // === AGGIUNGI SOTTO-SEZIONE ===
    safeAddEventListener(addSubsectionButton, "click", () => {
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

    // === SALVA SEZIONE ===
    safeAddEventListener(sectionForm, "submit", (e) => {
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
});

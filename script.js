document.addEventListener("DOMContentLoaded", () => {
    // ELEMENTI DOM PRINCIPALI
    const loginForm = document.getElementById("login-form");
    const dashboard = document.getElementById("dashboard");
    const adminLoginButton = document.getElementById("admin-login-button");
    const adminLoginForm = document.getElementById("admin-login-form");
    const logoutButton = document.getElementById("logout-button");
    const togglePasswordButton = document.getElementById("toggle-password");
    const passwordField = document.getElementById("password");
    const staffSection = document.getElementById("staff-section");
    const createStaffForm = document.getElementById("create-staff-form");
    const staffList = document.getElementById("staff-ul");
    const staffUsernameField = document.getElementById("staff-username");
    const staffPasswordField = document.getElementById("staff-password");
    const backgroundForm = document.getElementById("background-form");
    const backgroundUpload = document.getElementById("background-upload");
    const heroImage = document.getElementById("hero-image");
    const dynamicContent = document.getElementById("dynamic-content");
    const sectionForm = document.getElementById("section-form");
    const subsectionsContainer = document.getElementById("subsections-container");
    const addSubsectionButton = document.getElementById("add-subsection");
    const resetButton = document.createElement("button"); // Pulsante per resettare tutto

    // CREDENZIALI ADMIN PRINCIPALE
    const masterUsername = "ADMIN";
    const masterPassword = "ADMIN1234";

    // DATI SALVATI
    let savedSections = JSON.parse(localStorage.getItem("sections")) || [];
    let savedAdmins = JSON.parse(localStorage.getItem("admins")) || [
        { username: masterUsername, password: masterPassword },
    ];
    const savedBackground = localStorage.getItem("heroBackground");

    // CARICA BACKGROUND HERO SALVATO (se esiste)
    if (savedBackground) {
        heroImage.src = savedBackground;
    }

    /**
     * Mostra il modulo di login e nasconde la dashboard
     */
    adminLoginButton.addEventListener("click", () => {
        loginForm.classList.remove("hidden");
        dashboard.classList.add("hidden");
    });

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
     * Gestisce il login
     */
    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputUsername = document.getElementById("username").value.trim();
        const inputPassword = passwordField.value.trim();

        // Controlla le credenziali
        const matchedAdmin = savedAdmins.find(
            (admin) => admin.username === inputUsername && admin.password === inputPassword
        );

        if (matchedAdmin) {
            loginForm.classList.add("hidden");
            dashboard.classList.remove("hidden");
            alert(`Benvenuto, ${inputUsername}!`);

            // Controlla se l'utente è l'admin principale
            if (inputUsername !== masterUsername) {
                staffSection.style.display = "none"; // Nasconde la gestione dello staff per gli altri admin
            } else {
                staffSection.style.display = "block"; // Mostra la gestione dello staff solo per l'admin principale
            }
        } else {
            alert("Credenziali non valide. Riprova.");
        }
    });

    /**
     * Gestisce il logout
     */
    logoutButton.addEventListener("click", () => {
        dashboard.classList.add("hidden");
        loginForm.classList.add("hidden");
        alert("Hai effettuato il logout.");
    });

    /**
     * Aggiunge un nuovo membro dello staff
     */
    createStaffForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newUsername = staffUsernameField.value.trim();
        const newPassword = staffPasswordField.value.trim();

        if (!newUsername || !newPassword) {
            alert("Inserisci un username e una password validi.");
            return;
        }

        // Controlla se l'username esiste già
        const existingAdmin = savedAdmins.find((admin) => admin.username === newUsername);
        if (existingAdmin) {
            alert("Questo username esiste già. Scegline un altro.");
            return;
        }

        // Aggiungi il nuovo admin
        savedAdmins.push({ username: newUsername, password: newPassword });
        localStorage.setItem("admins", JSON.stringify(savedAdmins));

        // Aggiorna la lista dello staff
        updateStaffList();
        createStaffForm.reset();
        alert(`Admin "${newUsername}" creato con successo.`);
    });

    /**
     * Aggiorna la lista dello staff visualizzata
     */
    function updateStaffList() {
        staffList.innerHTML = ""; // Svuota la lista
        savedAdmins.forEach((admin) => {
            const li = document.createElement("li");
            li.textContent = admin.username;
            staffList.appendChild(li);
        });
    }

    /**
     * Aggiorna la lista dello staff all'avvio
     */
    updateStaffList();

    /**
     * Renderizza tutte le sezioni salvate
     */
    function renderSections() {
        dynamicContent.innerHTML = ""; // Svuota il contenuto precedente
        savedSections.forEach((section, index) => {
            const sectionDiv = document.createElement("div");
            sectionDiv.style.backgroundColor = section.color || "#ffffff";
            sectionDiv.innerHTML = `
                <h2>${section.title}</h2>
                <p>${section.description}</p>
                <div>
                    ${section.subsections
                        ?.map(
                            (sub) => `
                        <div style="background-color:${sub.color || "#f4f4f4"}; margin:10px; padding:10px; border-radius:5px;">
                            <h3>${sub.title || "Senza Titolo"}</h3>
                            <p>${sub.description || "Nessuna descrizione"}</p>
                        </div>
                    `
                        )
                        .join("") || ""}
                </div>
            `;
            dynamicContent.appendChild(sectionDiv);
        });
    }

    /**
     * Pulsante di reset per cancellare tutte le sezioni
     */
    resetButton.textContent = "Reset All Sections";
    resetButton.style.backgroundColor = "#ff4d4d";
    resetButton.style.color = "white";
    resetButton.style.border = "none";
    resetButton.style.padding = "10px 15px";
    resetButton.style.borderRadius = "5px";
    resetButton.style.cursor = "pointer";
    resetButton.style.marginTop = "20px";
    dashboard.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
        if (confirm("Sei sicuro di voler eliminare tutte le sezioni salvate?")) {
            savedSections = [];
            localStorage.clear(); // Pulisce tutto il localStorage, incluse le sezioni vecchie
            renderSections(); // Aggiorna il contenuto dinamico
            alert("Tutte le sezioni sono state eliminate con successo.");
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

        const subsections = Array.from(subsectionsContainer.children).map(sub => {
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
        subsectionsContainer.innerHTML = ""; // Resetta il contenitore delle sotto-sezioni
        alert("Sezione creata con successo!");
    });

    // Renderizza le sezioni salvate all'avvio
    renderSections();
});

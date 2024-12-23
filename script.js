// DOMContentLoaded Event
document.addEventListener("DOMContentLoaded", () => {
    // ELEMENTI DOM PRINCIPALI
    const loginForm = document.getElementById("login-form");
    const dashboard = document.getElementById("dashboard");
    const adminLoginButton = document.getElementById("admin-login-button");
    const adminLoginForm = document.getElementById("admin-login-form");
    const logoutButton = document.getElementById("logout-button");
    const backgroundForm = document.getElementById("background-form");
    const backgroundUpload = document.getElementById("background-upload");
    const heroImage = document.getElementById("hero-image");
    const dynamicContent = document.getElementById("dynamic-content");
    const sectionForm = document.getElementById("section-form");
    const subsectionsContainer = document.getElementById("subsections-container");
    const addSubsectionButton = document.getElementById("add-subsection");

    // CREDENZIALI ADMIN
    const username = "ADMIN";
    const password = "ADMIN1234";

    // DATI SALVATI
    let savedSections = JSON.parse(localStorage.getItem("sections")) || [];
    const savedBackground = localStorage.getItem("heroBackground");

    // CARICA BACKGROUND HERO SALVATO
    if (savedBackground) {
        heroImage.src = savedBackground;
    }

    /**
     * Mostra il form di login
     * Questa funzione rende visibile il modulo di login nascondendo il dashboard
     */
    adminLoginButton.addEventListener("click", () => {
        loginForm.classList.remove("hidden");
        dashboard.classList.add("hidden");
    });

    /**
     * Gestisce il login
     * Controlla le credenziali inserite e visualizza la dashboard in caso di successo
     */
    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputUsername = document.getElementById("username").value;
        const inputPassword = document.getElementById("password").value;

        if (inputUsername === username && inputPassword === password) {
            loginForm.classList.add("hidden");
            dashboard.classList.remove("hidden");
            alert("Login effettuato con successo! Benvenuto nella Admin Dashboard.");
        } else {
            alert("Credenziali non valide. Riprova.");
        }
    });

    /**
     * Gestisce il logout
     * Nasconde il dashboard e il login form
     */
    logoutButton.addEventListener("click", () => {
        dashboard.classList.add("hidden");
        loginForm.classList.add("hidden");
        alert("Hai effettuato il logout.");
    });

    /**
     * Cambia il background della sezione Hero
     * Permette di caricare un'immagine e aggiorna la sezione Hero
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
                alert("Background aggiornato con successo!");
            };
            reader.readAsDataURL(file);
        } else {
            alert("Seleziona un'immagine da caricare.");
        }
    });

    /**
     * Renderizza tutte le sezioni salvate
     * Aggiorna il contenuto dinamico della pagina principale
     */
    function renderSections() {
        dynamicContent.innerHTML = ""; // Svuota il contenuto precedente
        savedSections.forEach((section, index) => {
            const sectionDiv = document.createElement("div");
            sectionDiv.style.backgroundColor = section.color;
            sectionDiv.innerHTML = `
                <h2>${section.title}</h2>
                <p>${section.description}</p>
                <div>
                    ${section.subsections.map(sub => `
                        <div style="background-color:${sub.color}; margin:10px; padding:10px; border-radius:5px;">
                            <h3>${sub.title}</h3>
                            <p>${sub.description}</p>
                        </div>
                    `).join("")}
                </div>
            `;
            dynamicContent.appendChild(sectionDiv);
        });
    }

    /**
     * Aggiunge una nuova sotto-sezione
     * Crea un campo dinamico per titolo, descrizione e colore
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
     * Gestisce il salvataggio di titolo, descrizione, colore e sotto-sezioni
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

    /**
     * Elimina una sezione specifica
     * Utilizza l'indice per rimuovere la sezione salvata
     */
    function deleteSection(index) {
        if (confirm("Sei sicuro di voler eliminare questa sezione?")) {
            savedSections.splice(index, 1);
            localStorage.setItem("sections", JSON.stringify(savedSections));
            renderSections();
            alert("Sezione eliminata con successo.");
        }
    }

    /**
     * Modifica una sezione specifica
     * Carica i dati nel form per la modifica
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
                <input type="text" class="sub-title" value="${sub.title}" placeholder="Titolo Sotto-sezione">
                <textarea class="sub-description" placeholder="Descrizione Sotto-sezione">${sub.description}</textarea>
                <input type="color" class="sub-color" value="${sub.color}">
                <button type="button" class="remove-subsection">Rimuovi</button>
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
            sectionForm.onsubmit = null; // Reset form submission handler
            alert("Sezione aggiornata con successo!");
        };
    }

    // Renderizza le sezioni salvate all'avvio
    renderSections();
});

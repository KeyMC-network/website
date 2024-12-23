document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
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

    // Admin credentials
    const username = "ADMIN";
    const password = "ADMIN1234";

    // Data storage
    let savedSections = JSON.parse(localStorage.getItem("sections")) || [];

    /**
     * Renders all sections to the main page and admin dashboard.
     */
    function renderSections() {
        dynamicContent.innerHTML = ""; // Clear main page content
        dynamicNav.innerHTML = ""; // Clear navigation links
        sectionsList.innerHTML = ""; // Clear admin dashboard sections

        // Loop through all saved sections
        savedSections.forEach((section, index) => {
            // Main page content
            const sectionDiv = document.createElement("section");
            sectionDiv.style.backgroundColor = section.color;
            sectionDiv.id = `section-${index}`;
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

            // Navigation links
            const navItem = document.createElement("li");
            navItem.innerHTML = `<a href="#section-${index}">${section.title}</a>`;
            dynamicNav.appendChild(navItem);

            // Admin dashboard controls
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
     * Adds a new sub-section dynamically to the section form.
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

        // Add event listener to remove subsection button
        subsectionDiv.querySelector(".remove-subsection").addEventListener("click", () => {
            subsectionDiv.remove();
        });
    }

    /**
     * Handles the submission of the section form.
     */
    sectionForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get main section data
        const title = document.getElementById("section-title").value;
        const description = document.getElementById("section-content").value;
        const color = document.getElementById("section-color").value;

        // Gather all subsections
        const subsections = Array.from(subsectionsContainer.children).map((sub) => {
            const subTitle = sub.querySelector(".sub-title").value;
            const subDescription = sub.querySelector(".sub-description").value;
            const subColor = sub.querySelector(".sub-color").value;
            const subImageFile = sub.querySelector(".sub-image").files[0];

            // Handle image upload
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

        // Add new section to savedSections array
        savedSections.push({ title, description, color, subsections });
        localStorage.setItem("sections", JSON.stringify(savedSections));

        // Update UI
        renderSections();
        sectionForm.reset();
        subsectionsContainer.innerHTML = "";
    });

    /**
     * Deletes a section by index.
     * @param {number} index - The index of the section to delete.
     */
    window.deleteSection = (index) => {
        if (confirm("Are you sure you want to delete this section?")) {
            savedSections.splice(index, 1);
            localStorage.setItem("sections", JSON.stringify(savedSections));
            renderSections();
        }
    };

    /**
     * Edits a section by index.
     * @param {number} index - The index of the section to edit.
     */
    window.editSection = (index) => {
        const section = savedSections[index];
        document.getElementById("section-title").value = section.title;
        document.getElementById("section-content").value = section.description;
        document.getElementById("section-color").value = section.color;

        // Clear existing subsections
        subsectionsContainer.innerHTML = "";
        section.subsections.forEach((sub) => {
            const subsectionDiv = document.createElement("div");
            subsectionDiv.className = "subsection";
            subsectionDiv.innerHTML = `
                <label>Sub-Section Title:</label>
                <input type="text" class="sub-title" value="${sub.title}" required>
                <label>Sub-Section Description:</label>
                <textarea class="sub-description" required>${sub.description}</textarea>
                <label>Sub-Section Background Color:</label>
                <input type="color" class="sub-color" value="${sub.color}">
                <label>Sub-Section Image (optional):</label>
                <input type="file" class="sub-image" accept="image/*">
                <button type="button" class="remove-subsection">Remove</button>
            `;
            subsectionsContainer.appendChild(subsectionDiv);

            // Add event listener to remove subsection button
            subsectionDiv.querySelector(".remove-subsection").addEventListener("click", () => {
                subsectionDiv.remove();
            });
        });

        // Update submit behavior to save changes
        sectionForm.onsubmit = (e) => {
            e.preventDefault();

            section.title = document.getElementById("section-title").value;
            section.description = document.getElementById("section-content").value;
            section.color = document.getElementById("section-color").value;

            section.subsections = Array.from(subsectionsContainer.children).map((sub) => {
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

            // Save changes
            savedSections[index] = section;
            localStorage.setItem("sections", JSON.stringify(savedSections));
            renderSections();
            sectionForm.reset();
            sectionForm.onsubmit = sectionFormDefault;
        };
    };

    // Add initial subsection
    addSubsectionButton.addEventListener("click", addSubsection);

    // Render initial sections
    renderSections();
});

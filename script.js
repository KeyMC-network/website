let applications = JSON.parse(localStorage.getItem("applications")) || [];
let staff = JSON.parse(localStorage.getItem("staff")) || [{ username: "Admin", password: "Pollo9.0ll", isAdmin: true }];
let clet applications = JSON.parse(localStorage.getItem("applications")) || [];
let staff = JSON.parse(localStorage.getItem("staff")) || [{ username: "Admin", password: "Pollo9.0ll", isAdmin: true }];
let currentUser = null;

const webhookURL = "https://discord.com/api/webhooks/1322909591130083422/v1EjWclv8RjiREgV0sWBBD5l84yIGDi0FWYepEA136C3Ku0phnuUBjl5rAj7BuMx0_qD";

const positions = {
  helper: {
    title: "Helper Application",
    questions: [
      "Discord ID",
      "Minecraft Username",
      "Age",
      "Country",
      "Local Time",
      "Why do you want to be a Helper?",
      "How would you handle a player breaking the rules?",
      "Are you aware that upgrading to Helper can lead to becoming Mod, SrMod, and eventually Admin?",
      "What qualities do you think are important for a Helper?",
      "How much time can you dedicate to the server each week?",
    ],
  },
  eventManager: {
    title: "Event Manager Application",
    questions: [
      "Discord ID",
      "Minecraft Username",
      "Age",
      "Country",
      "Local Time",
      "Why do you want to be an Event Manager?",
      "What relevant experience and skills do you have in managing events?",
      "Describe a successful event you have managed in the past.",
      "How do you plan and organize events to ensure their success?",
      "How would you promote events to maximize player participation?",
    ],
  },
  websiteDeveloper: {
    title: "Website Developer Application",
    questions: [
      "Discord ID",
      "Minecraft Username",
      "Age",
      "Country",
      "Local Time",
      "Why do you want to be a Website Developer?",
      "What relevant experience and skills do you have in web development?",
      "Share links to websites you have developed or contributed to.",
      "What technologies and programming languages are you proficient in?",
      "How do you stay updated with the latest web development trends and technologies?",
    ],
  },
  pluginDeveloper: {
    title: "Plugin Developer Application",
    questions: [
      "Discord ID",
      "Minecraft Username",
      "Age",
      "Country",
      "Local Time",
      "Why do you want to be a Plugin Developer?",
      "What relevant experience and skills do you have in plugin development?",
      "Provide examples of plugins you have developed (links or descriptions).",
      "What programming languages and tools do you use for plugin development?",
      "How do you handle debugging and troubleshooting in your code?",
    ],
  },
  configurator: {
    title: "Configurator Application",
    questions: [
      "Discord ID",
      "Minecraft Username",
      "Age",
      "Country",
      "Local Time",
      "Why do you want to be a Configurator?",
      "What experience do you have with setting up and configuring Minecraft plugins?",
      "How would you handle a plugin causing issues in-game?",
      "What qualities do you think are important for a Configurator?",
      "How much time can you dedicate to the server each week?",
    ],
  },
};

document.getElementById("applyNowBtn").onclick = () => {
  document.getElementById("formContainer").style.display = "block";
  document.getElementById("applicationContainer").style.display = "none";
  showPositions();
};

document.getElementById("staffLoginBtn").onclick = () => {
  document.getElementById("loginContainer").style.display = "block";
};

document.getElementById("loginForm").onsubmit = (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = staff.find((s) => s.username === username && s.password === password);

  if (user) {
    currentUser = user;
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    showStatus(`Welcome, ${user.username}!`, "success");
    viewApplications();
  } else {
    showStatus("Invalid credentials! Please try again.", "error");
  }
};

function showPositions() {
  document.getElementById("formContainer").innerHTML = `
    <h2>Select a Position</h2>
    ${Object.keys(positions)
      .map(
        (key) => `
      <button class="button" onclick="loadForm('${key}')">${positions[key].title}</button>
    `
      )
      .join("")}
  `;
}

function loadForm(position) {
  const positionData = positions[position];
  document.getElementById("formContainer").innerHTML = `
    <h2>${positionData.title}</h2>
    <form id="applicationForm">
      ${positionData.questions
        .map(
          (q) => `
        <div class="form-field">
          <label>${q}</label>
          <textarea required></textarea>
        </div>`
        )
        .join("")}
      <button type="submit" class="button">Submit</button>
    </form>
  `;

  document.getElementById("applicationForm").onsubmit = (e) => {
    e.preventDefault();
    const answers = Array.from(e.target.querySelectorAll("textarea")).map((input) => input.value);
    const applicationID = `APP-${Date.now()}`;
    const newApplication = { id: applicationID, position, answers, status: "Pending" };
    applications.push(newApplication);
    localStorage.setItem("applications", JSON.stringify(applications));

    sendWebhook(applicationID);

    document.getElementById("formContainer").style.display = "none";
    showStatus(`Application submitted successfully! Your Application ID is: ${applicationID}`, "success");
  };
}

function sendWebhook(applicationID) {
  const data = {
    content: `New application received! Application ID: ${applicationID}`,
  };

  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch((error) => console.error("Error sending webhook:", error));
}

function showStatus(message, type) {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  setTimeout(() => {
    statusMessage.textContent = "";
  }, 5000);
}

function viewApplications() {
  document.getElementById("adminContent").innerHTML = `
    ${currentUser.isAdmin ? `<button class="button" onclick="showAddStaffForm()">Add Staff</button>` : ""}
    ${currentUser.isAdmin ? `<button class="button" onclick="showStaff()">Show Staff</button>` : ""}
    <table class="admin-table">
      <tr>
        <th>Application ID</th>
        <th>Position</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
      ${applications
        .map(
          (app) => `
      <tr>
        <td>${app.id}</td>
        <td>${positions[app.position].title}</td>
        <td class="${app.status.toLowerCase()}">${app.status}</td>
        <td>
          <button onclick="showApplication('${app.id}')">Show Application</button>
          <button onclick="updateStatus('${app.id}', 'Accepted')">Accept</button>
          <button onclick="updateStatus('${app.id}', 'Refused')">Refuse</button>
          <button onclick="deleteApplication('${app.id}')">🗑️</button>
        </td>
      </tr>`
        )
        .join("")}
    </table>
    <div id="applicationDetails"></div>
  `;
}

function showAddStaffForm() {
  if (!currentUser.isAdmin) {
    showStatus("Only Admin can add staff!", "error");
    return;
  }

  document.getElementById("applicationDetails").innerHTML = `
    <h2>Add New Staff</h2>
    <form id="addStaffForm">
      <div class="form-field">
        <label>Username</label>
        <input type="text" id="newStaffUsername" required />
      </div>
      <div class="form-field">
        <label>Password</label>
        <input type="password" id="newStaffPassword" required />
      </div>
      <button type="submit" class="button">Add Staff</button>
    </form>
  `;

  document.getElementById("addStaffForm").onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById("newStaffUsername").value.trim();
    const password = document.getElementById("newStaffPassword").value.trim();

    if (username && password) {
      staff.push({ username, password, isAdmin: false });
      localStorage.setItem("staff", JSON.stringify(staff));
      showStatus(`Staff member "${username}" added successfully!`, "success");
      document.getElementById("applicationDetails").innerHTML = "";
    } else {
      showStatus("Please fill in all fields!", "error");
    }
  };
}

function showStaff() {
  if (!currentUser.isAdmin) {
    showStatus("You do not have permission to view staff members!", "error");
    return;
  }

  document.getElementById("applicationDetails").innerHTML = `
    <h2>Staff Members</h2>
    <ul id="staffList">
      ${staff
        .map(
          (member, index) => `
        <li>
          <strong>${member.username}</strong>
          ${member.username === "Admin" ? 
            '<button class="button disabled" title="Cannot delete Admin">🛡️</button>' : 
            `<button class="button" onclick="deleteStaff(${index})">🗑️</button>`}
        </li>`
        )
        .join("")}
    </ul>
  `;
}

function deleteStaff(index) {
  const deletedStaff = staff.splice(index, 1)[0];
  localStorage.setItem("staff", JSON.stringify(staff));
  showStatus(`Staff member "${deletedStaff.username}" deleted successfully!`, "success");
  showStaff();
}

function showApplication(applicationID) {
  const application = applications.find((app) => app.id === applicationID);
  if (application) {
    document.getElementById("applicationDetails").innerHTML = `
      <h2>Application Details</h2>
      <p><strong>Application ID:</strong> ${application.id}</p>
      <p><strong>Position:</strong> ${positions[application.position].title}</p>
      ${application.answers
        .map(
          (answer, index) =>
            `<p><strong>${positions[application.position].questions[index]}:</strong> ${answer}</p>`
        )
        .join("")}
    `;
  } else {
    document.getElementById("applicationDetails").innerHTML = "<p>Application not found.</p>";
  }
}

function updateStatus(applicationID, newStatus) {
  const application = applications.find((app) => app.id === applicationID);
  if (application) {
    application.status = newStatus;
    localStorage.setItem("applications", JSON.stringify(applications));
    viewApplications();
  }
}

function deleteApplication(applicationID) {
  applications = applications.filter((app) => app.id !== applicationID);
  localStorage.setItem("applications", JSON.stringify(applications));
  viewApplications();
}

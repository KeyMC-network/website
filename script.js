let applications = JSON.parse(localStorage.getItem("applications")) || [];
let staff = [{ username: "Admin", password: "Pollo9.0ll" }];
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
};

document.getElementById("staffLoginBtn").onclick = () => {
  document.getElementById("loginContainer").style.display = "block";
};

document.getElementById("loginForm").onsubmit = (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const user = staff.find((s) => s.username === username && s.password === password);
  if (user) {
    currentUser = user;
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    showStatus("Logged in successfully!", "success");
  } else {
    showStatus("Invalid credentials!", "error");
  }
};

function loadForm(position) {
  const positionData = positions[position];
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("applicationContainer").style.display = "block";

  document.getElementById("applicationContainer").innerHTML = `
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

    sendWebhook(applicationID, position, answers);

    document.getElementById("applicationContainer").style.display = "none";
    showStatus(
      "Application submitted successfully! The staff will contact you on Discord if your application is accepted.",
      "success"
    );
  };
}

function sendWebhook(applicationID, position, answers) {
  const data = {
    content: null,
    embeds: [
      {
        title: "

```javascript
        title: "New Staff Application",
        description: `**Position**: ${positions[position].title}\n**ID**: ${applicationID}`,
        color: 3447003,
        fields: answers.map((answer, index) => ({
          name: positions[position].questions[index],
          value: answer || "N/A",
        })),
        timestamp: new Date().toISOString(),
      },
    ],
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
        <td><a href="#" onclick="viewApplication('${app.id}')">${app.id}</a></td>
        <td>${positions[app.position].title}</td>
        <td class="${app.status.toLowerCase()}">${app.status}</td>
        <td>
          <button onclick="updateStatus('${app.id}', 'Accepted')">Accept</button>
          <button onclick="updateStatus('${app.id}', 'Refused')">Refuse</button>
        </td>
      </tr>`
        )
        .join("")}
    </table>
  `;
}

function viewApplication(applicationID) {
  const application = applications.find((app) => app.id === applicationID);
  if (application) {
    document.getElementById("adminContent").innerHTML = `
      <h2>Application Details</h2>
      <p><strong>Application ID:</strong> ${applicationID}</p>
      <p><strong>Position:</strong> ${positions[application.position].title}</p>
      ${application.answers
        .map((answer, index) => `<p><strong>${positions[application.position].questions[index]}:</strong> ${answer}</p>`)
        .join("")}
      <button onclick="viewApplications()">Back to Applications</button>
    `;
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

function addStaff() {
  const username = prompt("Enter new staff username:");
  const password = prompt("Enter new staff password:");
  if (username && password) {
    staff.push({ username, password });
    showStatus(`Staff member "${username}" added successfully!`, "success");
  }
}

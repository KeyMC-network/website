let applications = JSON.parse(localStorage.getItem("applications")) || [];
let staff = JSON.parse(localStorage.getItem("staff")) || [{ username: "Admin", password: "Pollo9.0ll" }];
let currentUser = null;

const webhookURL = "https://discord.com/api/webhooks/1322909591130083422/v1EjWclv8RjiREgV0sWBBD5l84yIGDi0FWYepEA136C3Ku0phnuUBjl5rAj7BuMx0_qD";
const baseURL = window.location.origin;

// Variabili CAPTCHA
let captchaValue = "";

// Posizioni disponibili
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

// Genera un CAPTCHA visivo
function generateCaptcha() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  captchaValue = Array.from({ length: 6 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");

  const canvas = document.getElementById("captchaCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "#4f46e5"; // Colore principale
  ctx.fillText(captchaValue, 10, 40);

  // Linee casuali per decorare
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.strokeStyle = "#3b82f6"; // Colore decorativo
    ctx.stroke();
  }
}

// Verifica il CAPTCHA
function validateCaptcha(input) {
  return input === captchaValue;
}

// Mostra il modulo di login
document.getElementById("staffLoginBtn").onclick = () => {
  document.getElementById("loginContainer").style.display = "block";
  generateCaptcha();
};

// Gestisce il login dello staff
document.getElementById("loginForm").onsubmit = (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const captchaInput = document.getElementById("captchaInput").value;

  if (!validateCaptcha(captchaInput)) {
    showStatus("Invalid CAPTCHA!", "error");
    generateCaptcha();
    return;
  }

  const user = staff.find((s) => s.username === username && s.password === password);
  if (user) {
    currentUser = user;
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    showStatus("Logged in successfully!", "success");
    viewApplications();
  } else {
    showStatus("Invalid credentials!", "error");
  }
};

// Aggiunge un nuovo membro dello staff
function addStaff() {
  const username = prompt("Enter new staff username:");
  const password = prompt("Enter new staff password:");
  if (username && password) {
    staff.push({ username, password });
    localStorage.setItem("staff", JSON.stringify(staff));
    showStatus(`Staff member "${username}" added successfully!`, "success");
  }
}

// Visualizza le applicazioni
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
        <td><a href="${app.link}" target="_blank">${app.id}</a></td>
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

// Aggiorna lo stato di un'applicazione
function updateStatus(applicationID, newStatus) {
  const application = applications.find((app) => app.id === applicationID);
  if (application) {
    application.status = newStatus;
    localStorage.setItem("applications", JSON.stringify(applications));
    viewApplications();
  }
}

// Mostra un messaggio di stato
function showStatus(message, type) {
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  setTimeout(() => {
    statusMessage.textContent = "";
  }, 5000);
}

// Carica un'applicazione specifica dalla URL
function loadApplicationFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const appID = urlParams.get("app");

  if (appID) {
    const application = applications.find((app) => app.id === appID);
    if (application) {
      document.body.innerHTML = `
        <h1>Application Details</h1>
        <p><strong>Application ID:</strong> ${application.id}</p>
        <p><strong>Position:</strong> ${positions[application.position].title}</p>
        ${application.answers
          .map(
            (answer, index) =>
              `<p><strong>${positions[application.position].questions[index]}:</strong> ${answer}</p>`
          )
          .join("")}
        <button onclick="location.href='${baseURL}'">Back to Home</button>
      `;
    } else {
      document.body.innerHTML = "<h1>Application not found</h1>";
    }
  }
}

// Carica un'applicazione specifica dalla URL se presente
loadApplicationFromURL();

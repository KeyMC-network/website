// # INITIALIZATION
if (!localStorage.getItem('users')) {
  localStorage.setItem(
    'users',
    JSON.stringify([{ username: 'Admin', email: 'admin@example.com', password: 'Pollo9.0ll', roles: ['admin'] }])
  );
}
if (!localStorage.getItem('categories')) localStorage.setItem('categories', JSON.stringify([]));
if (!localStorage.getItem('roles')) localStorage.setItem('roles', JSON.stringify([{ name: 'user', permissions: [] }]));
if (!localStorage.getItem('tags')) localStorage.setItem('tags', JSON.stringify([]));
if (!localStorage.getItem('notifications')) localStorage.setItem('notifications', JSON.stringify([]));

// Utility Functions
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// # AUTHENTICATION: Register
function registerUser() {
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;

  if (!username || !email || !password || password !== confirmPassword) {
    alert('Please fill out all fields correctly!');
    return;
  }

  const users = loadFromLocalStorage('users');
  if (users.some(user => user.username === username)) {
    alert('Username already exists!');
    return;
  }

  users.push({ username, email, password, roles: ['user'] });
  saveToLocalStorage('users', users);
  alert('Registration successful! Please login.');
  showLogin();
}

// # AUTHENTICATION: Login
function loginUser() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  const users = loadFromLocalStorage('users');
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    alert('Invalid username or password!');
    return;
  }

  sessionStorage.setItem('currentUser', JSON.stringify(user));
  updateNotificationsBadge();

  // Redirect based on role
  if (user.roles.includes('admin')) {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
  } else if (user.roles.includes('moderator')) {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('moderator-dashboard').classList.remove('hidden');
  } else {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('forum-screen').classList.remove('hidden');
    loadCategories();
  }
}

// # PROFILE MANAGEMENT
function updateProfilePicture() {
  const fileInput = document.getElementById('upload-avatar');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('profile-picture').src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

function saveProfile() {
  const displayName = document.getElementById('update-display-name').value.trim();
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (displayName) currentUser.displayName = displayName;

  const users = loadFromLocalStorage('users');
  const userIndex = users.findIndex(user => user.username === currentUser.username);
  if (userIndex !== -1) users[userIndex] = currentUser;

  saveToLocalStorage('users', users);
  sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  alert('Profile updated successfully!');
  document.getElementById('display-name').textContent = displayName || currentUser.username;
}

// # LOGOUT
function logout() {
  sessionStorage.removeItem('currentUser');
  location.reload();
}

// # ADMIN: Create Category
function createCategory() {
  const name = prompt('Enter category name:');
  if (!name) return;

  const categories = loadFromLocalStorage('categories');
  categories.push({ name, forums: [] });
  saveToLocalStorage('categories', categories);
  alert('Category created!');
  loadCategories();
}

// # ADMIN: Create Forum
function createForum() {
  const forumName = prompt('Enter forum name:');
  if (!forumName) return;

  const categories = loadFromLocalStorage('categories');
  if (categories.length === 0) {
    alert('No categories available! Create one first.');
    return;
  }

  const categoryIndex = parseInt(prompt(`Enter category index (0-${categories.length - 1}):`));
  if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= categories.length) {
    alert('Invalid category index!');
    return;
  }

  categories[categoryIndex].forums.push({ name: forumName, posts: [] });
  saveToLocalStorage('categories', categories);
  alert('Forum created!');
  loadCategories();
}

// # ADMIN: Manage Tags
function manageTags() {
  const tagName = prompt('Enter tag name:');
  const tagColor = prompt('Enter tag background color (CSS format):');
  const isModOnly = confirm('Should this tag be mod-only?');

  const tags = loadFromLocalStorage('tags');
  tags.push({ name: tagName, color: tagColor, modOnly: isModOnly });
  saveToLocalStorage('tags', tags);
  alert('Tag created!');
}

// # LOAD CATEGORIES AND FORUMS
function loadCategories() {
  const categories = loadFromLocalStorage('categories');
  const container = document.getElementById('categories');
  container.innerHTML = '';

  categories.forEach((category, index) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'card';
    categoryDiv.innerHTML = `<h3>${category.name}</h3>`;
    category.forums.forEach(forum => {
      const forumDiv = document.createElement('div');
      forumDiv.className = 'card';
      forumDiv.innerHTML = `<h4>${forum.name}</h4><button class="btn" onclick="openForum(${index}, '${forum.name}')">Open Forum</button>`;
      categoryDiv.appendChild(forumDiv);
    });
    container.appendChild(categoryDiv);
  });
}

// # OPEN FORUM
function openForum(categoryIndex, forumName) {
  document.getElementById('forum-screen').classList.add('hidden');
  document.getElementById('post-screen').classList.remove('hidden');

  const categories = loadFromLocalStorage('categories');
  const forum = categories[categoryIndex].forums.find(forum => forum.name === forumName);
  document.getElementById('post-title').textContent = forum.name;
  loadPosts(forum.posts);
}

// # POSTS AND REPLIES
function loadPosts(posts) {
  const postReplies = document.getElementById('post-replies');
  postReplies.innerHTML = '';

  posts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.className = 'card';
    postDiv.innerHTML = `<h4>${post.title}</h4><p>${post.content}</p>`;
    postDiv.innerHTML += `<button class="btn" onclick="modifyPost(${index})">Edit</button>`;
    postDiv.innerHTML += `<button class="btn" onclick="deletePost(${index})">Delete</button>`;
    postReplies.appendChild(postDiv);
  });
}

function addReply() {
  const replyContent = document.getElementById('reply-input').value.trim();
  if (!replyContent) return alert('Reply cannot be empty.');

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const newReply = {
    content: replyContent,
    author: currentUser.username,
    date: new Date().toLocaleString(),
  };

  const categories = loadFromLocalStorage('categories');
  const forumName = document.getElementById('post-title').textContent;
  const forum = categories.find(category => category.name === forumName).forums[0];

  forum.posts.push(newReply);
  saveToLocalStorage('categories', categories);

  loadPosts(forum.posts);
  document.getElementById('reply-input').value = '';
  alert('Reply added successfully!');
}

// # RETURN TO FORUM SCREEN
function returnToForum() {
  document.getElementById('post-screen').classList.add('hidden');
  document.getElementById('forum-screen').classList.remove('hidden');
}

// # TAGS & FILTERS
function applyTagToPost(postIndex) {
  const tags = loadFromLocalStorage('tags');
  const availableTags = tags.map((tag, idx) => `${idx + 1}. ${tag.name}`).join("\n");

  const selectedIndex = parseInt(prompt(`Select a tag:\n${availableTags}`)) - 1;

  if (selectedIndex >= 0 && selectedIndex < tags.length) {
    const categories = loadFromLocalStorage('categories');
    const forum = categories.find(category => category.name === document.getElementById('post-title').textContent).forums[0];
    forum.posts[postIndex].tags = forum.posts[postIndex].tags || [];
    forum.posts[postIndex].tags.push(tags[selectedIndex]);

    saveToLocalStorage('categories', categories);
    alert(`Tag "${tags[selectedIndex].name}" applied!`);
    loadPosts(forum.posts);
  } else {
    alert('Invalid tag selection.');
  }
}

function filterPostsByTag() {
  const selectedTag = document.getElementById("tag-filter").value;
  const forumName = document.getElementById("post-title").textContent;
  const categories = loadFromLocalStorage("categories");
  const forum = categories.find(category => category.name === forumName).forums[0];

  const filteredPosts = selectedTag === "all" 
    ? forum.posts 
    : forum.posts.filter(post => post.tags && post.tags.some(tag => tag.name === selectedTag));

  loadPosts(filteredPosts);
}

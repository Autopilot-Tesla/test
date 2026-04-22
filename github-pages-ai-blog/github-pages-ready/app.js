import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const DEFAULT_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  openRouterApiBase: "https://openrouter.ai/api/v1",
  defaultModel: "openai/gpt-4.1-mini",
  allowedModels: [
    "openai/gpt-4.1-mini",
    "anthropic/claude-3.7-sonnet",
    "google/gemini-2.5-pro",
    "meta-llama/llama-4-maverick",
  ],
  siteName: "Yates Editorial OS",
  ownerEmail: "replace-with-your-login-email@example.com",
  defaultRoom: "global",
};

const config = { ...DEFAULT_CONFIG, ...(window.APP_CONFIG || {}) };
const localKeys = {
  aiKey: `${config.siteName}:ai-key`,
  theme: `${config.siteName}:theme`,
};

const elements = {
  toast: document.getElementById("toast"),
  authDialog: document.getElementById("authDialog"),
  openAuthButton: document.getElementById("openAuthButton"),
  closeAuthButton: document.getElementById("closeAuthButton"),
  signUpButton: document.getElementById("signUpButton"),
  magicLinkButton: document.getElementById("magicLinkButton"),
  authForm: document.getElementById("authForm"),
  authEmail: document.getElementById("authEmail"),
  authPassword: document.getElementById("authPassword"),
  sessionLabel: document.getElementById("sessionLabel"),
  sessionDetail: document.getElementById("sessionDetail"),
  aiKeyLabel: document.getElementById("aiKeyLabel"),
  aiKeyDetail: document.getElementById("aiKeyDetail"),
  roomLabel: document.getElementById("roomLabel"),
  roomSelect: document.getElementById("roomSelect"),
  refreshMessagesButton: document.getElementById("refreshMessagesButton"),
  refreshPostsButton: document.getElementById("refreshPostsButton"),
  ownerBadge: document.getElementById("ownerBadge"),
  postsList: document.getElementById("postsList"),
  postForm: document.getElementById("postForm"),
  postTitle: document.getElementById("postTitle"),
  postExcerpt: document.getElementById("postExcerpt"),
  postBody: document.getElementById("postBody"),
  seedDemoPostButton: document.getElementById("seedDemoPostButton"),
  modelSelect: document.getElementById("modelSelect"),
  aiKeyInput: document.getElementById("aiKeyInput"),
  aiPromptInput: document.getElementById("aiPromptInput"),
  saveAiKeyButton: document.getElementById("saveAiKeyButton"),
  aiForm: document.getElementById("aiForm"),
  aiChatLog: document.getElementById("aiChatLog"),
  seedAiPromptButton: document.getElementById("seedAiPromptButton"),
  messageForm: document.getElementById("messageForm"),
  messageInput: document.getElementById("messageInput"),
  seedMessageButton: document.getElementById("seedMessageButton"),
  communityLog: document.getElementById("communityLog"),
  backgroundColor: document.getElementById("backgroundColor"),
  surfaceColor: document.getElementById("surfaceColor"),
  accentColor: document.getElementById("accentColor"),
  textColor: document.getElementById("textColor"),
  saveThemeButton: document.getElementById("saveThemeButton"),
  resetThemeButton: document.getElementById("resetThemeButton"),
};

const state = {
  client: null,
  session: null,
  profile: null,
  posts: [],
  rooms: [config.defaultRoom],
  currentRoom: config.defaultRoom,
};

const presets = {
  obsidian: {
    background: "#101720",
    surface: "#18212d",
    accent: "#c6a46b",
    text: "#f4ede1",
  },
  bone: {
    background: "#efe7d8",
    surface: "#ffffff",
    accent: "#b78b4a",
    text: "#2c2a27",
  },
  sage: {
    background: "#172421",
    surface: "#22312d",
    accent: "#b89f66",
    text: "#edf1ea",
  },
};

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2600);
}

function renderBubble(container, label, content) {
  const bubble = document.createElement("article");
  bubble.className = "chat-bubble";
  bubble.innerHTML = `<strong>${escapeHtml(label)}</strong><div>${escapeHtml(content).replace(/\n/g, "<br />")}</div>`;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function applyTheme(theme) {
  document.documentElement.style.setProperty("--background", theme.background);
  document.documentElement.style.setProperty("--surface", theme.surface);
  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--accent-strong", theme.accent);
  document.documentElement.style.setProperty("--text", theme.text);
  document.documentElement.style.setProperty("--muted", mixColor(theme.text, theme.background, 0.72));
  document.body.style.background = `radial-gradient(circle at top left, ${hexToRgba(theme.accent, 0.16)}, transparent 22%), linear-gradient(180deg, ${theme.background} 0%, ${shadeColor(theme.background, -10)} 48%, ${shadeColor(theme.background, -18)} 100%)`;
  elements.backgroundColor.value = theme.background;
  elements.surfaceColor.value = theme.surface;
  elements.accentColor.value = theme.accent;
  elements.textColor.value = theme.text;
}

function readTheme() {
  const saved = localStorage.getItem(localKeys.theme);
  if (!saved) return presets.obsidian;
  try {
    return JSON.parse(saved);
  } catch {
    return presets.obsidian;
  }
}

function saveTheme(theme) {
  localStorage.setItem(localKeys.theme, JSON.stringify(theme));
  applyTheme(theme);
  showToast("Theme saved in this browser.");
}

function mixColor(colorA, colorB, weight) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const mix = (x, y) => Math.round(x * weight + y * (1 - weight));
  return `rgb(${mix(a.r, b.r)}, ${mix(a.g, b.g)}, ${mix(a.b, b.b)})`;
}

function shadeColor(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const adjust = (value) => Math.max(0, Math.min(255, value + amount));
  return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
  const number = Number.parseInt(value, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}

function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function populateModels() {
  elements.modelSelect.innerHTML = "";
  config.allowedModels.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    if (model === config.defaultModel) option.selected = true;
    elements.modelSelect.appendChild(option);
  });
}

function populateRooms(rooms) {
  elements.roomSelect.innerHTML = "";
  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = `#${room}`;
    elements.roomSelect.appendChild(option);
  });
  elements.roomSelect.value = state.currentRoom;
  elements.roomLabel.textContent = `#${state.currentRoom}`;
}

function updateAiKeyStatus() {
  const aiKey = localStorage.getItem(localKeys.aiKey);
  if (aiKey) {
    elements.aiKeyLabel.textContent = "Ready";
    elements.aiKeyDetail.textContent = "A personal AI key is stored in this browser only.";
    elements.aiKeyInput.value = aiKey;
  } else {
    elements.aiKeyLabel.textContent = "Missing";
    elements.aiKeyDetail.textContent = "Paste your personal AI key in settings so it never lives in committed files.";
  }
}

function renderPosts(posts) {
  elements.postsList.innerHTML = "";
  if (!posts.length) {
    elements.postsList.innerHTML = `<article><header><div><p class="eyebrow">No posts yet</p><h4>Publish your first article after setup.</h4></div></header><p>The included SQL file creates a posts table. Once the configuration is connected, posts will appear here.</p></article>`;
    return;
  }

  posts.forEach((post) => {
    const article = document.createElement("article");
    article.innerHTML = `
      <header>
        <div>
          <p class="eyebrow">${escapeHtml(post.slug || "article")}</p>
          <h4>${escapeHtml(post.title)}</h4>
        </div>
        <time>${new Date(post.created_at).toLocaleDateString()}</time>
      </header>
      <p>${escapeHtml(post.excerpt || "")}</p>
    `;
    elements.postsList.appendChild(article);
  });
}

function renderMessages(messages) {
  elements.communityLog.innerHTML = "";
  if (!messages.length) {
    renderBubble(elements.communityLog, "Room waiting", "No messages are stored for this room yet.");
    return;
  }

  messages.forEach((message) => {
    renderBubble(
      elements.communityLog,
      message.display_name || message.user_email || "Member",
      message.body || ""
    );
  });
}

function updateSessionUi() {
  const signedIn = Boolean(state.session?.user);
  const isOwner = state.profile?.role === "owner" || state.session?.user?.email === config.ownerEmail;
  elements.sessionLabel.textContent = signedIn ? "Signed in" : "Signed out";
  elements.sessionDetail.textContent = signedIn
    ? `${state.session.user.email}${isOwner ? " · owner role active" : " · member role"}`
    : "Use email magic links or password auth through the hosted identity service.";
  elements.ownerBadge.textContent = isOwner ? "Owner role active" : "Owner role required";
}

async function ensureProfile() {
  if (!state.client || !state.session?.user) return;
  const payload = {
    id: state.session.user.id,
    email: state.session.user.email,
    display_name: state.session.user.user_metadata?.display_name || state.session.user.email?.split("@")[0],
    role: state.session.user.email === config.ownerEmail ? "owner" : "member",
  };

  const { error } = await state.client.from("profiles").upsert(payload);
  if (error) {
    console.error(error);
    showToast("Profile setup needs a quick review in the SQL or policy file.");
  }

  const { data } = await state.client.from("profiles").select("*").eq("id", state.session.user.id).single();
  state.profile = data || payload;
  updateSessionUi();
}

function configurationReady() {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey && config.supabaseUrl.includes("https://"));
}

async function loadPosts() {
  if (!state.client) {
    renderPosts([]);
    return;
  }
  const { data, error } = await state.client
    .from("posts")
    .select("id, title, slug, excerpt, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    renderPosts([]);
    showToast("Post loading failed. Check the SQL setup and public read policy.");
    return;
  }

  state.posts = data || [];
  renderPosts(state.posts);
}

async function loadRooms() {
  if (!state.client) {
    populateRooms(state.rooms);
    return;
  }

  const { data, error } = await state.client
    .from("rooms")
    .select("slug")
    .order("slug", { ascending: true });

  if (error || !data?.length) {
    console.error(error);
    populateRooms(state.rooms);
    return;
  }

  state.rooms = data.map((room) => room.slug);
  if (!state.rooms.includes(state.currentRoom)) state.currentRoom = state.rooms[0];
  populateRooms(state.rooms);
}

async function loadMessages() {
  if (!state.client) {
    renderMessages([]);
    return;
  }

  const { data: roomData } = await state.client
    .from("rooms")
    .select("id")
    .eq("slug", state.currentRoom)
    .single();

  if (!roomData) {
    renderMessages([]);
    return;
  }

  const { data, error } = await state.client
    .from("messages")
    .select("body, created_at, profiles(display_name, email)")
    .eq("room_id", roomData.id)
    .order("created_at", { ascending: true })
    .limit(40);

  if (error) {
    console.error(error);
    showToast("Message loading failed. Review the message policies.");
    return;
  }

  const normalized = (data || []).map((entry) => ({
    body: entry.body,
    created_at: entry.created_at,
    display_name: entry.profiles?.display_name,
    user_email: entry.profiles?.email,
  }));
  renderMessages(normalized);
}

async function signUp() {
  if (!state.client) return showToast("Create config.js first.");
  const { error } = await state.client.auth.signUp({
    email: elements.authEmail.value,
    password: elements.authPassword.value,
  });
  if (error) {
    console.error(error);
    return showToast(error.message);
  }
  showToast("Account created. Check your email if confirmation is enabled.");
}

async function signIn() {
  if (!state.client) return showToast("Create config.js first.");
  const { error } = await state.client.auth.signInWithPassword({
    email: elements.authEmail.value,
    password: elements.authPassword.value,
  });
  if (error) {
    console.error(error);
    return showToast(error.message);
  }
  showToast("Signed in.");
  elements.authDialog.close();
  document.body.classList.remove("modal-open");
}

async function sendMagicLink() {
  if (!state.client) return showToast("Create config.js first.");
  const redirectTo = window.location.href.split("#")[0];
  const { error } = await state.client.auth.signInWithOtp({
    email: elements.authEmail.value,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) {
    console.error(error);
    return showToast(error.message);
  }
  showToast("Magic link sent.");
}

async function publishPost(event) {
  event.preventDefault();
  if (!state.client || !state.session?.user) return showToast("Sign in as the owner first.");
  const isOwner = state.profile?.role === "owner" || state.session.user.email === config.ownerEmail;
  if (!isOwner) return showToast("Only the owner can publish.");

  const title = elements.postTitle.value.trim();
  const excerpt = elements.postExcerpt.value.trim();
  const body = elements.postBody.value.trim();
  if (!title || !body) return showToast("Add at least a title and body.");

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const payload = {
    author_id: state.session.user.id,
    title,
    slug,
    excerpt,
    body,
    published: true,
  };

  const { error } = await state.client.from("posts").insert(payload);
  if (error) {
    console.error(error);
    return showToast("Publishing failed. Double-check the posts policy and owner role.");
  }

  elements.postForm.reset();
  showToast("Post published.");
  await loadPosts();
}

async function sendMessage(event) {
  event.preventDefault();
  if (!state.client || !state.session?.user) return showToast("Sign in before joining the room.");
  const body = elements.messageInput.value.trim();
  if (!body) return showToast("Write a message first.");

  const { data: roomData } = await state.client.from("rooms").select("id").eq("slug", state.currentRoom).single();
  if (!roomData) return showToast("The selected room does not exist yet.");

  const { error } = await state.client.from("messages").insert({
    room_id: roomData.id,
    author_id: state.session.user.id,
    body,
  });

  if (error) {
    console.error(error);
    return showToast("Message send failed. Review the messages insert policy.");
  }

  elements.messageInput.value = "";
  await loadMessages();
}

async function sendAiMessage(event) {
  event.preventDefault();
  const prompt = elements.aiPromptInput.value.trim();
  if (!prompt) return showToast("Write a prompt first.");

  const aiKey = elements.aiKeyInput.value.trim() || localStorage.getItem(localKeys.aiKey);
  if (!aiKey) return showToast("Add your AI key first.");

  renderBubble(elements.aiChatLog, "You", prompt);
  renderBubble(elements.aiChatLog, "Model", "Thinking...");
  const thinkingBubble = elements.aiChatLog.lastElementChild;

  try {
    const response = await fetch(`${config.openRouterApiBase}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${aiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: elements.modelSelect.value || config.defaultModel,
        messages: [
          {
            role: "system",
            content:
              "You are helping a blog owner write polished editorial content, answer community questions, and reason clearly about static web architecture.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response text returned.";
    thinkingBubble.querySelector("div").innerHTML = escapeHtml(content).replace(/\n/g, "<br />");
  } catch (error) {
    console.error(error);
    thinkingBubble.querySelector("div").textContent =
      "The AI request failed. Check your key, selected model, and provider access.";
    showToast("AI request failed. See the console and setup guide.");
  }
}

function subscribeRealtime() {
  if (!state.client) return;
  state.client
    .channel("room-messages")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      () => loadMessages()
    )
    .subscribe();

  state.client
    .channel("published-posts")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "posts" },
      () => loadPosts()
    )
    .subscribe();
}

function bindEvents() {
  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.jump);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelectorAll(".side-link").forEach((link) => link.classList.remove("is-active"));
      if (button.classList.contains("side-link")) button.classList.add("is-active");
    });
  });

  elements.openAuthButton.addEventListener("click", () => {
    elements.authDialog.showModal();
    document.body.classList.add("modal-open");
  });

  elements.closeAuthButton.addEventListener("click", () => {
    elements.authDialog.close();
    document.body.classList.remove("modal-open");
  });

  elements.authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await signIn();
  });

  elements.signUpButton.addEventListener("click", signUp);
  elements.magicLinkButton.addEventListener("click", sendMagicLink);
  elements.postForm.addEventListener("submit", publishPost);
  elements.messageForm.addEventListener("submit", sendMessage);
  elements.aiForm.addEventListener("submit", sendAiMessage);
  elements.refreshPostsButton.addEventListener("click", loadPosts);
  elements.refreshMessagesButton.addEventListener("click", loadMessages);
  elements.roomSelect.addEventListener("change", async () => {
    state.currentRoom = elements.roomSelect.value;
    elements.roomLabel.textContent = `#${state.currentRoom}`;
    await loadMessages();
  });

  elements.seedDemoPostButton.addEventListener("click", () => {
    elements.postTitle.value = "Designing a static blog that still feels like premium software";
    elements.postExcerpt.value = "Why the frontend should remain static even when the product includes accounts, AI, and realtime conversation.";
    elements.postBody.value = "A GitHub Pages deployment can remain simple if the interface is static and the persistent features are delegated to a hosted identity and database layer. The design should still feel crafted, trustworthy, and satisfying to use.";
  });

  elements.seedMessageButton.addEventListener("click", () => {
    elements.messageInput.value = "Anyone else comparing model outputs for editorial rewrite quality tonight?";
  });

  elements.seedAiPromptButton.addEventListener("click", () => {
    elements.aiPromptInput.value = "Summarize my draft into three paragraphs, suggest a better title, and recommend a stronger closing section.";
  });

  elements.saveAiKeyButton.addEventListener("click", () => {
    const aiKey = elements.aiKeyInput.value.trim();
    if (!aiKey) return showToast("Paste a key first.");
    localStorage.setItem(localKeys.aiKey, aiKey);
    updateAiKeyStatus();
    showToast("AI key saved in this browser only.");
  });

  document.querySelectorAll(".theme-preset").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = presets[button.dataset.theme];
      if (preset) applyTheme(preset);
    });
  });

  elements.saveThemeButton.addEventListener("click", () => {
    saveTheme({
      background: elements.backgroundColor.value,
      surface: elements.surfaceColor.value,
      accent: elements.accentColor.value,
      text: elements.textColor.value,
    });
  });

  elements.resetThemeButton.addEventListener("click", () => saveTheme(presets.obsidian));
}

async function initSupabase() {
  if (!configurationReady()) {
    renderPosts([]);
    renderMessages([]);
    showToast("Create config.js from config.example.js and paste your project values.");
    return;
  }

  state.client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  const { data } = await state.client.auth.getSession();
  state.session = data.session;
  await ensureProfile();
  await Promise.all([loadPosts(), loadRooms()]);
  await loadMessages();
  subscribeRealtime();

  state.client.auth.onAuthStateChange(async (_event, session) => {
    state.session = session;
    await ensureProfile();
    updateSessionUi();
  });
}

function seedUi() {
  populateModels();
  populateRooms(state.rooms);
  applyTheme(readTheme());
  updateAiKeyStatus();
  renderBubble(elements.aiChatLog, "Workspace", "Add your AI key, choose a model, and send a prompt.");
  renderBubble(elements.communityLog, "Room waiting", "Sign in and connect your database config to load realtime messages.");
  renderPosts([]);
  updateSessionUi();
}

async function init() {
  seedUi();
  bindEvents();
  await initSupabase();
}

init().catch((error) => {
  console.error(error);
  showToast("Initialization failed. Open the console and review the setup guide.");
});

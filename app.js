const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    mobileNav.hidden = isOpen;
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      mobileNav.hidden = true;
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// Small, keyless portfolio assistant. Answers come from the site's own content;
// contact actions open the visitor's email app and never send anything silently.
if (!document.querySelector(".portfolio-chat")) {
  const chat = document.createElement("aside");
  chat.className = "portfolio-chat";
  chat.innerHTML = `
    <section class="chat-panel" id="portfolio-chat-panel" aria-label="Portfolio assistant" hidden>
      <header class="chat-header"><div><strong>Ask about Mehul</strong><span>Portfolio assistant</span></div><button class="chat-close" type="button" aria-label="Close assistant">×</button></header>
      <div class="chat-messages" aria-live="polite"><p class="chat-bubble chat-bot">Hi, I can help with Mehul’s background, projects, or ways to connect.</p></div>
      <div class="chat-quick-actions"><button type="button" data-question="about">About Me</button><button type="button" data-question="projects">Projects</button><button type="button" data-question="interview">Interview</button><button type="button" data-question="freelance">Freelance</button></div>
      <form class="booking-form" hidden>
        <div class="booking-heading"><strong>Request a time</strong><span>This is a request. Mehul will confirm availability by email.</span></div>
        <div class="booking-fields"><label>Your name<input name="visitorName" autocomplete="name" required></label><label>Your email<input name="visitorEmail" type="email" autocomplete="email" required></label><label>Date<input name="date" type="date" required></label><label>Time (IST)<input name="time" type="time" required></label></div>
        <label class="booking-extra">Role / meeting topic <input name="topic" placeholder="Optional"></label>
        <button class="booking-back" type="button">Back to assistant</button>
        <button type="submit">Request this time ↗</button>
      </form>
      <form class="freelance-form" hidden>
        <div class="booking-heading"><strong>Tell me about your project</strong><span>Your description will be added to an email draft for Mehul.</span></div>
        <div class="booking-fields"><label>Your name<input name="visitorName" autocomplete="name" required></label><label>Your email<input name="visitorEmail" type="email" autocomplete="email" required></label></div>
        <label class="project-description">What would you like to discuss?<textarea name="projectDetails" rows="5" placeholder="Describe the project, what you need help with, and your timeline…" required></textarea></label>
        <button class="freelance-back" type="button">Back to assistant</button>
        <button type="submit">Continue to email ↗</button>
      </form>
      <form class="chat-form"><label class="visually-hidden" for="chat-message">Ask a question</label><input id="chat-message" name="message" autocomplete="off" placeholder="Ask a question…"><button type="submit" aria-label="Send question">↑</button></form>
      <p class="chat-note">Replies use portfolio information. Interview requests open a prepared email for Mehul to confirm.</p>
    </section>
    <button class="chat-launch" type="button" aria-expanded="false" aria-controls="portfolio-chat-panel"><span class="chat-launch-mark">↗</span> Ask about Mehul</button>`;
  document.body.append(chat);

  const panel = chat.querySelector(".chat-panel");
  const launcher = chat.querySelector(".chat-launch");
  const chatTitle = chat.querySelector(".chat-header strong");
  const chatSubtitle = chat.querySelector(".chat-header span");
  const messages = chat.querySelector(".chat-messages");
  const form = chat.querySelector(".chat-form");
  const bookingForm = chat.querySelector(".booking-form");
  const freelanceForm = chat.querySelector(".freelance-form");
  const input = chat.querySelector("#chat-message");
  const email = "mehulpandey01@gmail.com";
  const answers = {
    about: "Mehul is an AI engineer working across Generative AI, retrieval, machine learning, and backend systems. His experience includes product engineering at Toss Solutions and 4th Orbit, plus ML research at IIST. See the About and Experience pages for details.",
    projects: "The portfolio covers product mapping and quality checks, semantic search, document AI, and ECG based stress research. Browse the project case studies for the architecture and outcomes.",
    interview: "Choose a date and time that suits you. This will send a request to Mehul for confirmation; it does not book the slot automatically.",
    freelance: "Tell me what project you’d like to discuss. Your description will be included in an email draft."
  };
  const addMessage = (text, kind = "bot", href = "") => {
    const bubble = document.createElement(href ? "a" : "p");
    bubble.className = `chat-bubble chat-${kind}`;
    bubble.textContent = text;
    if (href) {
      bubble.href = href;
      if (href.startsWith("https://")) { bubble.target = "_blank"; bubble.rel = "noopener noreferrer"; }
    }
    messages.append(bubble);
    messages.scrollTop = messages.scrollHeight;
  };
  const answerQuestion = (question) => {
    messages.querySelectorAll(".chat-bot, .chat-action").forEach((message) => message.remove());
    const q = question.toLowerCase();
    let key = "about";
    if (/project|work|build|search|rag|document|experience/.test(q)) key = "projects";
    if (/interview|hire|role|job|call|schedule|meeting/.test(q)) key = "interview";
    if (/freelance|client|contract|project inquiry|collaborat/.test(q)) key = "freelance";
    addMessage(answers[key]);
    if (key === "interview") {
      const dateInput = bookingForm.elements.date;
      const today = new Date();
      dateInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      bookingForm.hidden = false;
      chat.classList.add("is-booking");
      chatTitle.textContent = "Request a time";
      chatSubtitle.textContent = "Pending Mehul’s confirmation";
      bookingForm.scrollIntoView({ block: "nearest", behavior: "smooth" });
      dateInput.focus();
    } else if (key === "freelance") {
      chat.classList.remove("is-booking");
      bookingForm.hidden = true;
      freelanceForm.hidden = false;
      chat.classList.add("is-freelance");
      chatTitle.textContent = "Project inquiry";
      chatSubtitle.textContent = "Freelance inquiry";
      freelanceForm.querySelector("textarea").focus();
    } else if (key === "projects") {
      chat.classList.remove("is-booking");
      bookingForm.hidden = true;
      addMessage("Explore the project case studies", "action", "projects.html");
    } else {
      chat.classList.remove("is-booking");
      bookingForm.hidden = true;
      addMessage("Read more about Mehul", "action", "about.html");
    }
  };
  const openEmailDraft = (subject, body) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
    chat.classList.remove("is-booking", "is-freelance");
    bookingForm.hidden = true;
    freelanceForm.hidden = true;
    chatTitle.textContent = "Ask about Mehul";
    chatSubtitle.textContent = "Portfolio assistant";
    addMessage("If the Gmail draft didn’t open, choose an email option:");
    addMessage("Open Gmail draft ↗", "action", gmailUrl);
    addMessage("Open default email app ↗", "action", mailtoUrl);
  };
  const toggle = (open) => {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  };
  launcher.addEventListener("click", () => toggle(panel.hidden));
  chat.querySelector(".chat-close").addEventListener("click", () => toggle(false));
  chat.querySelector(".booking-back").addEventListener("click", () => {
    chat.classList.remove("is-booking");
    bookingForm.hidden = true;
    chatTitle.textContent = "Ask about Mehul";
    chatSubtitle.textContent = "Portfolio assistant";
    input.focus();
  });
  chat.querySelector(".freelance-back").addEventListener("click", () => {
    chat.classList.remove("is-freelance");
    freelanceForm.hidden = true;
    chatTitle.textContent = "Ask about Mehul";
    chatSubtitle.textContent = "Portfolio assistant";
    input.focus();
  });
  chat.querySelectorAll("[data-question]").forEach((button) => button.addEventListener("click", () => answerQuestion(button.dataset.question)));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    addMessage(question, "visitor");
    answerQuestion(question);
    input.value = "";
  });
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const data = new FormData(bookingForm);
    const subject = "Interview / meeting time request for Mehul Pandey";
    const body = [
      "Hello Mehul,",
      "",
      "I would like to request an interview or meeting at the following time:",
      `Date: ${data.get("date")}`,
      `Time: ${data.get("time")} IST (Raipur, India)`,
      `Name: ${data.get("visitorName")}`,
      `Reply email: ${data.get("visitorEmail")}`,
      `Role / meeting topic: ${data.get("topic") || "Not specified"}`,
      "",
      "Please let me know if this time is available. I understand the meeting is not confirmed until you reply.",
      "",
      "Thank you"
    ].join("\n");
    openEmailDraft(subject, body);
  });
  freelanceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!freelanceForm.reportValidity()) return;
    const data = new FormData(freelanceForm);
    const subject = "Freelance project inquiry for Mehul Pandey";
    const body = [
      "Hello Mehul,",
      "",
      "I’d like to discuss this project:",
      String(data.get("projectDetails")),
      "",
      `Name: ${data.get("visitorName")}`,
      `Reply email: ${data.get("visitorEmail")}`,
      "",
      "Please let me know if this is something you can help with.",
      "",
      "Thank you"
    ].join("\n");
    openEmailDraft(subject, body);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) { toggle(false); launcher.focus(); }
  });
}

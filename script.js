/* ============ EDIT HERE ============ */

// Skills (self-assessed percentages)
const SKILLS = [
  ["HTML", 85], ["CSS", 85], ["JavaScript", 75], ["Python", 50], ["C", 70],
  ["GitHub", 85], ["Cursor", 85], ["Antigravity", 75], ["Codex", 75], ["Gemini", 90]
];

// Projects. To add a real project: set status to "live", fill the fields, and add
// an image path (e.g. "images/my-project.jpg"). Leave demo/code empty to disable a button.
const PROJECTS = [
  { status: "soon", title: "Project One", category: "Web Development", description: "A real web project will be added here.", tags: ["HTML", "CSS", "JavaScript"], image: "", demo: "", code: "" },
  { status: "soon", title: "Project Two", category: "Cybersecurity", description: "A security learning project will be added here.", tags: ["Security", "Python"], image: "", demo: "", code: "" },
  { status: "soon", title: "Project Three", category: "Graphic Design", description: "A design or branding project will be added here.", tags: ["Branding", "Graphics"], image: "", demo: "", code: "" },
  { status: "soon", title: "Project Four", category: "Social Media", description: "A content or page management project will be added here.", tags: ["Content", "Planning"], image: "", demo: "", code: "" }
];

// WhatsApp (international format, no spaces): 03116269796 becomes 923116269796
const WHATSAPP_NUMBER = "923116269796";

// Contact form: paste a Formspree (or similar) endpoint to enable real sending.
// Example: "https://formspree.io/f/xxxxxxx". While empty, nothing is sent.
const FORM_ENDPOINT = "";

/* ============ Code ============ */
const $ = (s, r = document) => r.querySelector(s);
const root = document.documentElement;
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.textContent = html; return e; };

// Year, WhatsApp link
$("#year").textContent = new Date().getFullYear();
$("#wa").href = "https://wa.me/" + WHATSAPP_NUMBER;

// Theme
const themeBtn = $("#theme");
function currentTheme() {
  return root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function syncThemeBtn() {
  themeBtn.setAttribute("aria-label", currentTheme() === "dark" ? "Switch to light mode" : "Switch to dark mode");
}
themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
  syncThemeBtn();
});
syncThemeBtn();

// Mobile menu
const burger = $("#burger"), menu = $("#menu");
function setMenu(open) {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); burger.focus(); } });

// Skills
const grid = $("#skills-grid");
SKILLS.forEach(([name, pct]) => {
  const card = el("div", "card skill");
  const top = el("div", "skill-top");
  top.append(el("span", "", name), el("span", "", pct + "%"));
  const track = el("div", "track");
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-label", name + " proficiency");
  track.setAttribute("aria-valuenow", pct);
  track.setAttribute("aria-valuemin", 0);
  track.setAttribute("aria-valuemax", 100);
  const fill = el("div", "fill");
  fill.dataset.pct = pct;
  track.append(fill);
  card.append(top, track);
  grid.append(card);
});
const fills = document.querySelectorAll(".fill");
const fillIn = f => (f.style.width = f.dataset.pct + "%");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fillIn(e.target); io.unobserve(e.target); } }), { threshold: 0.4 });
  fills.forEach(f => io.observe(f));
} else fills.forEach(fillIn);

// Projects
const pg = $("#project-grid");
PROJECTS.forEach(p => {
  const soon = p.status !== "live";
  const card = el("article", "card project");
  const thumb = el("div", "thumb");
  if (p.image && !soon) { const img = el("img"); img.src = p.image; img.alt = p.title + " screenshot"; img.loading = "lazy"; thumb.append(img); }
  else thumb.append(el("span", "badge", "Coming Soon"));
  const tags = el("ul", "tags");
  p.tags.forEach(t => tags.append(el("li", "", t)));
  const acts = el("div", "proj-actions");
  [["Live Demo", p.demo, "btn-primary"], ["Source Code", p.code, "btn-soft"]].forEach(([label, url, cls]) => {
    const a = el("a", "btn " + cls, label);
    if (url && !soon) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else a.setAttribute("aria-disabled", "true");
    acts.append(a);
  });
  card.append(thumb, el("span", "cat", p.category), el("h3", "", p.title), el("p", "", p.description), tags, acts);
  pg.append(card);
});

// Active section highlight
const links = [...document.querySelectorAll("#menu a")];
const secs = links.map(a => $(a.getAttribute("href")));
function setActive() {
  const y = scrollY + 140;
  let cur = secs[0];
  secs.forEach(s => { if (s.offsetTop <= y) cur = s; });
  if (innerHeight + scrollY >= document.body.scrollHeight - 4) cur = secs[secs.length - 1];
  links.forEach(a => {
    const on = a.getAttribute("href") === "#" + cur.id;
    a.classList.toggle("active", on);
    on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
  });
}
addEventListener("scroll", setActive, { passive: true });
setActive();

// Contact form
const form = $("#form"), status = $("#status");
const rules = {
  name: v => v.trim().length >= 2 || "Enter your name.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Enter a valid email address.",
  subject: v => v.trim().length >= 3 || "Enter a subject.",
  message: v => v.trim().length >= 10 || "Write a message of at least 10 characters."
};
function validate() {
  let ok = true, first = null;
  Object.keys(rules).forEach(k => {
    const input = form.elements[k], res = rules[k](input.value);
    $("#e-" + k).textContent = res === true ? "" : res;
    input.setAttribute("aria-invalid", res !== true);
    if (res !== true) { ok = false; first = first || input; }
  });
  if (first) first.focus();
  return ok;
}
form.addEventListener("submit", async e => {
  e.preventDefault();
  status.textContent = "";
  if (!validate()) { status.textContent = "Please fix the highlighted fields."; return; }
  if (!FORM_ENDPOINT) {
    status.textContent = "Message not sent: the form isn't connected yet. Please use WhatsApp instead.";
    return;
  }
  try {
    status.textContent = "Sending…";
    const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
    if (!r.ok) throw new Error();
    form.reset();
    status.textContent = "Message sent. Thank you!";
  } catch (err) {
    status.textContent = "Sending failed. Please try again or use WhatsApp.";
  }
});

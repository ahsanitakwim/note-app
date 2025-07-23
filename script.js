const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const notesList = document.getElementById("notes-list");
const toggleTheme = document.getElementById("toggle-theme");
const icon = toggleTheme.querySelector("span");

// === THEME ===
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  icon.textContent = "light_mode";
}

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  icon.textContent = dark ? "light_mode" : "dark_mode";
});

// === LOAD SAVED NOTES ===
let notes = JSON.parse(localStorage.getItem("notes")) || [];
notes.forEach(renderNote);

// === FORM SUBMIT ===
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = noteInput.value.trim();
  if (!text) return;

  const note = { id: Date.now(), text };
  notes.push(note);
  saveNotes();
  renderNote(note);
  noteInput.value = "";
});

function renderNote(note) {
  const div = document.createElement("div");
  div.className = "note";
  div.dataset.id = note.id;
  div.innerHTML = `
    <div>${note.text}</div>
    <div class="actions">
      <button class="edit"><span class="material-icons">edit</span></button>
      <button class="delete"><span class="material-icons">delete</span></button>
    </div>
  `;

  // Delete
  div.querySelector(".delete").addEventListener("click", () => {
    notes = notes.filter(n => n.id !== note.id);
    saveNotes();
    div.remove();
  });

  // Edit
  div.querySelector(".edit").addEventListener("click", () => {
    const newText = prompt("Edit catatan:", note.text);
    if (newText) {
      note.text = newText;
      saveNotes();
      div.querySelector("div").textContent = newText;
    }
  });

  notesList.prepend(div);
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

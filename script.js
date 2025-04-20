const noteInput = document.getElementById("note-text");
const tagInput = document.getElementById("note-tag");
const addNoteBtn = document.getElementById("add-note");
const noteList = document.getElementById("note-list");
const tagSelect = document.getElementById("tag-select");
const toggleThemeBtn = document.getElementById("toggle-theme");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// === Инициализация ===
renderNotes();
updateTagOptions();
applySavedTheme();

// === Добавление заметки ===
addNoteBtn.addEventListener("click", () => {
    const text = noteInput.value.trim();
    const tag = tagInput.value.trim();
    if (!text) return;

    const newNote = {
        id: Date.now(),
        text,
        tag,
        done: false
    };
    notes.push(newNote);
    saveNotes();
    renderNotes();
    updateTagOptions();
    noteInput.value = "";
    tagInput.value = "";
});

// === Рендеринг списка заметок ===
function renderNotes(filterTag = "") {
    noteList.innerHTML = "";
    const filteredNotes = filterTag
        ? notes.filter(note => note.tag.toLowerCase() === filterTag.toLowerCase())
        : notes;

    filteredNotes.forEach(note => {
        const li = document.createElement("li");
        li.className = "note-item";

        const textSpan = document.createElement("span");
        textSpan.className = "note-text";
        textSpan.textContent = note.text;
        if (note.done) textSpan.style.textDecoration = "line-through";

        const tags = document.createElement("div");
        tags.className = "note-tags";
        tags.textContent = note.tag;

        const actions = document.createElement("div");
        actions.className = "note-actions";

        const checkBtn = document.createElement("button");
        checkBtn.innerHTML = "✔️";
        checkBtn.title = "Отметить как выполнено";
        checkBtn.addEventListener("click", () => {
            note.done = !note.done;
            saveNotes();
            renderNotes(tagSelect.value);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "❌";
        deleteBtn.title = "Удалить";
        deleteBtn.addEventListener("click", () => {
            notes = notes.filter(n => n.id !== note.id);
            saveNotes();
            renderNotes(tagSelect.value);
            updateTagOptions();
        });

        actions.appendChild(checkBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(actions);
        li.appendChild(tags);
        noteList.appendChild(li);
    });
}

// === Фильтрация по тегам ===
tagSelect.addEventListener("change", () => {
    const selectedTag = tagSelect.value;
    renderNotes(selectedTag);
});

// === Обновление списка тегов ===
function updateTagOptions() {
    const tags = [...new Set(notes.map(n => n.tag).filter(Boolean))];
    tagSelect.innerHTML = '<option value="">Все теги</option>';
    tags.forEach(tag => {
        const option = document.createElement("option");
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
    });
}

// === Сохранение в localStorage ===
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// === Темная/светлая тема ===
toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

function applySavedTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
    }
}

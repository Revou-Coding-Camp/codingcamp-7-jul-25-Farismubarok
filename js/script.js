// js/script.js

document.addEventListener("DOMContentLoaded", () => {
  // Element references
  const form = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const filterDate = document.getElementById("filter-date");
  const deleteAll = document.getElementById("delete-all");

  const pendingList = document.getElementById("pending-list");
  const doneList = document.getElementById("done-list");

  let todos = [];

  // Tambah tugas
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    const date = dateInput.value;

    if (!text || !date) {
      alert("Tugas dan tanggal wajib diisi.");
      return;
    }

    todos.push({
      id: Date.now(),
      text,
      date,
      done: false,
      reminded: false,
    });

    form.reset();
    renderTodos();
    checkReminders();
  });

  // Filter berdasarkan tanggal
  filterDate.addEventListener("input", renderTodos);

  // Hapus semua tugas
  deleteAll.addEventListener("click", () => {
    if (confirm("Yakin ingin menghapus semua tugas?")) {
      todos = [];
      renderTodos();
    }
  });

  // Render daftar tugas
  function renderTodos() {
    pendingList.innerHTML = "";
    doneList.innerHTML = "";

    const filtered = filterDate.value
      ? todos.filter((todo) => todo.date === filterDate.value)
      : todos;

    const pending = filtered.filter((todo) => !todo.done);
    const done = filtered.filter((todo) => todo.done);

    pendingList.innerHTML = pending.length
      ? ""
      : "<li>Tidak ada tugas.</li>";

    doneList.innerHTML = done.length
      ? ""
      : "<li>Belum ada yang selesai.</li>";

    pending.forEach((todo) => {
      pendingList.appendChild(createTodoItem(todo));
    });

    done.forEach((todo) => {
      doneList.appendChild(createTodoItem(todo));
    });
  }

  // Buat elemen <li> untuk setiap tugas
  function createTodoItem(todo) {
    const li = document.createElement("li");

    // Status deadline
    const statusSpan = document.createElement("span");
    const status = getDeadlineStatus(todo.date, todo.done);
    statusSpan.className = "status " + status.class;
    statusSpan.textContent = status.label;

    // Countdown
    const countdownSpan = document.createElement("small");
    countdownSpan.className = "countdown";
    countdownSpan.textContent = getCountdown(todo.date, todo.done);

    // Teks tugas
    const taskSpan = document.createElement("span");
    taskSpan.textContent = `${todo.text} (${todo.date})`;
    if (todo.done) taskSpan.classList.add("done");

    // Bungkus konten
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "task-wrapper";
    contentWrapper.appendChild(taskSpan);
    contentWrapper.appendChild(statusSpan);
    contentWrapper.appendChild(countdownSpan);

    // Tombol selesai/kembalikan
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = todo.done ? "⏪ Kembalikan" : "✅ Selesai";
    toggleBtn.onclick = () => {
      todo.done = !todo.done;
      renderTodos();
    };

    // Tombol hapus
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑 Hapus";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
      todos = todos.filter((t) => t.id !== todo.id);
      renderTodos();
    };

    // Gabungkan ke li
    li.appendChild(contentWrapper);
    li.appendChild(toggleBtn);
    li.appendChild(delBtn);

    return li;
  }

  // Menentukan status deadline
  function getDeadlineStatus(dateString, isDone) {
    if (isDone) return { label: "✔️ Selesai", class: "done-status" };

    const today = new Date();
    const deadline = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    if (deadline < today) return { label: "🔴 Terlambat", class: "late" };
    if (deadline.getTime() === today.getTime())
      return { label: "🟡 Hari Ini", class: "today" };
    return { label: "🟢 Masih Waktu", class: "ontime" };
  }

  // Hitung countdown deadline
  function getCountdown(dateString, isDone) {
    if (isDone) return "";

    const now = new Date();
    const deadline = new Date(dateString);
    const diff = deadline - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `⏳ Tersisa ${days} hari`;
    if (days === 0) return `📌 Deadline hari ini`;
    return `⚠️ Terlambat ${Math.abs(days)} hari`;
  }

  // Pengingat tugas deadline hari ini
  function checkReminders() {
    const today = new Date().toISOString().split("T")[0];
    todos.forEach((todo) => {
      if (!todo.done && todo.date === today && !todo.reminded) {
        alert(`🔔 Pengingat: Kamu punya tugas hari ini!\n\n📝 ${todo.text}`);
        todo.reminded = true;
      }
    });
  }

  // Jalankan saat awal
  renderTodos();
  checkReminders();
});
// StudentHub: simple student records using JavaScript and localStorage.
const STORAGE_KEY = "studentHubRecords";
const starterStudents = [
  { id: 1, name: "Aanya Sharma", email: "aanya@example.com", course: "B.Tech CSE", marks: 86 },
  { id: 2, name: "Rohan Verma", email: "rohan@example.com", course: "BBA", marks: 72 },
  { id: 3, name: "Meera Singh", email: "meera@example.com", course: "BCA", marks: 42 }
];

let students = loadStudents();

function loadStudents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved !== null) return JSON.parse(saved);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(starterStudents));
  return [...starterStudents];
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function renderStudents() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const visibleStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchText) ||
    student.course.toLowerCase().includes(searchText) ||
    student.email.toLowerCase().includes(searchText)
  );
  const table = document.getElementById("studentTable");
  table.innerHTML = "";

  visibleStudents.forEach(student => {
    const passed = student.marks >= 40;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><div class="student-cell"><span class="avatar">${escapeText(student.name.charAt(0).toUpperCase())}</span>
        <span>${escapeText(student.name)}<span class="sub-email">${escapeText(student.email)}</span></span></div></td>
      <td>${escapeText(student.course)}</td>
      <td><strong>${student.marks}%</strong></td>
      <td><span class="pill ${passed ? "pass" : "fail"}">${passed ? "Passed" : "Needs Improvement"}</span></td>
      <td><button class="delete" data-delete="${student.id}" aria-label="Delete ${escapeText(student.name)}">Delete</button></td>`;
    table.appendChild(row);
  });

  document.getElementById("emptyState").style.display = visibleStudents.length ? "none" : "block";
  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("passedStudents").textContent = students.filter(s => s.marks >= 40).length;
  const average = students.length ? Math.round(students.reduce((sum, s) => sum + s.marks, 0) / students.length) : 0;
  document.getElementById("averageMarks").textContent = average + "%";
}

// Escapes text before placing user-entered values into the table.
function escapeText(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

document.getElementById("studentForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const course = document.getElementById("studentCourse").value;
  const marks = Number(document.getElementById("studentMarks").value);

  if (!name || !email || !course || !Number.isFinite(marks) || marks < 0 || marks > 100) {
    alert("Please enter valid student details and marks between 0 and 100.");
    return;
  }

  students.unshift({ id: Date.now(), name, email, course, marks });
  saveStudents();
  renderStudents();
  this.reset();
});

document.getElementById("studentTable").addEventListener("click", function(event) {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  const id = Number(button.dataset.delete);
  students = students.filter(student => student.id !== id);
  saveStudents();
  renderStudents();
});

document.getElementById("searchInput").addEventListener("input", renderStudents);
document.getElementById("clearForm").addEventListener("click", () => document.getElementById("studentName").focus());
document.getElementById("addStudentTop").addEventListener("click", () => {
  document.getElementById("studentName").focus();
  document.getElementById("studentForm").scrollIntoView({ behavior: "smooth", block: "center" });
});

renderStudents();

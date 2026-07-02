var Admin = (function () {
  var editingId = null;

  function init() {
    renderProjects();
    renderMessages();
    updateCounts();
  }

  // ---- Tabs ----
  document.addEventListener("click", function (e) {
    var tab = e.target.closest(".admin-tab");
    if (!tab) return;
    document.querySelectorAll(".admin-tab").forEach(function (t) {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    document.querySelectorAll(".admin-panel").forEach(function (p) {
      p.classList.remove("active");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
  });

  // ---- Render Projects ----
  function renderProjects() {
    var projects = Store.getProjects();
    var tbody = document.getElementById("proj-tbody");
    var empty = document.getElementById("proj-empty");
    tbody.innerHTML = "";
    if (!projects.length) {
      empty.style.display = "";
      return;
    }
    empty.style.display = "none";
    projects.forEach(function (p) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td><a href="project-detail.html?id=' + p.id + '">' + escapeHtml(p.title) + "</a></td>" +
        "<td>" + (p.tags || []).map(function (t) { return '<span class="badge badge-tag">' + escapeHtml(t) + "</span>"; }).join(" ") + "</td>" +
        "<td>" + escapeHtml((p.technologies || []).join(", ")) + "</td>" +
        '<td class="col-actions">' +
        '<button class="btn-sm" onclick="Admin.editProject(\'' + p.id + '\')">Edit</button> ' +
        '<button class="btn-sm btn-danger" onclick="Admin.deleteProject(\'' + p.id + '\')">Delete</button>' +
        "</td>";
      tbody.appendChild(tr);
    });
  }

  // ---- Add / Edit Project ----
  function showProjectModal(data) {
    editingId = data ? data.id : null;
    document.getElementById("modal-title").textContent = data ? "Edit Project" : "Add Project";
    document.getElementById("modal-save-btn").textContent = data ? "Update Project" : "Save Project";
    document.getElementById("proj-id").value = data ? data.id : "";
    document.getElementById("proj-title").value = data ? data.title : "";
    document.getElementById("proj-desc").value = data ? data.description : "";
    document.getElementById("proj-fulldesc").value = data ? data.fullDescription || "" : "";
    document.getElementById("proj-tags").value = data ? (data.tags || []).join(", ") : "";
    document.getElementById("proj-image").value = data ? data.image || "" : "";
    document.getElementById("proj-repo").value = data ? data.repo || "" : "";
    document.getElementById("proj-tech").value = data ? (data.technologies || []).join(", ") : "";
    document.getElementById("proj-components").value = data ? (data.components || []).join(", ") : "";
    document.getElementById("proj-challenges").value = data ? data.challenges || "" : "";
    document.getElementById("proj-future").value = data ? data.futureImprovements || "" : "";
    document.getElementById("proj-code").value = data ? data.codeSample || "" : "";
    document.getElementById("project-modal").style.display = "flex";
  }

  function closeProjectModal() {
    document.getElementById("project-modal").style.display = "none";
    editingId = null;
  }

  function saveProject(e) {
    e.preventDefault();
    var data = {
      title: document.getElementById("proj-title").value.trim(),
      description: document.getElementById("proj-desc").value.trim(),
      fullDescription: document.getElementById("proj-fulldesc").value.trim(),
      tags: document.getElementById("proj-tags").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
      image: document.getElementById("proj-image").value.trim(),
      repo: document.getElementById("proj-repo").value.trim(),
      technologies: document.getElementById("proj-tech").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
      components: document.getElementById("proj-components").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
      challenges: document.getElementById("proj-challenges").value.trim(),
      futureImprovements: document.getElementById("proj-future").value.trim(),
      codeSample: document.getElementById("proj-code").value
    };
    if (!data.title || !data.description) return;
    if (editingId) {
      Store.updateProject(editingId, data);
    } else {
      Store.addProject(data);
    }
    closeProjectModal();
    renderProjects();
    updateCounts();
  }

  function editProject(id) {
    var p = Store.getProject(id);
    if (p) showProjectModal(p);
  }

  function deleteProject(id) {
    if (!confirm("Delete this project?")) return;
    Store.deleteProject(id);
    renderProjects();
    updateCounts();
  }

  // ---- Render Messages ----
  function renderMessages() {
    var messages = Store.getMessages();
    var tbody = document.getElementById("msg-tbody");
    var empty = document.getElementById("msg-empty");
    tbody.innerHTML = "";
    if (!messages.length) {
      empty.style.display = "";
      return;
    }
    empty.style.display = "none";
    messages.forEach(function (m) {
      var tr = document.createElement("tr");
      tr.className = m.read ? "" : "unread";
      var preview = m.message.length > 60 ? m.message.slice(0, 60) + "..." : m.message;
      var dateStr = new Date(m.date).toLocaleDateString();
      tr.innerHTML =
        "<td><strong>" + escapeHtml(m.name) + "</strong></td>" +
        "<td>" + escapeHtml(m.email) + "</td>" +
        "<td>" + dateStr + "</td>" +
        "<td>" + escapeHtml(preview) + "</td>" +
        '<td class="col-actions">' +
        '<button class="btn-sm" onclick="Admin.viewMessage(\'' + m.id + '\')">View</button> ' +
        '<button class="btn-sm btn-danger" onclick="Admin.deleteMsg(\'' + m.id + '\')">Delete</button>' +
        "</td>";
      tbody.appendChild(tr);
    });
  }

  function viewMessage(id) {
    Store.markMessageRead(id);
    var messages = Store.getMessages();
    var m = null;
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].id === id) { m = messages[i]; break; }
    }
    if (!m) return;
    document.getElementById("msg-view-name").textContent = m.name;
    document.getElementById("msg-view-email").textContent = m.email;
    document.getElementById("msg-view-date").textContent = new Date(m.date).toLocaleString();
    document.getElementById("msg-view-body").textContent = m.message;
    document.getElementById("msg-delete-btn").dataset.id = m.id;
    document.getElementById("message-modal").style.display = "flex";
    renderMessages();
    updateCounts();
  }

  function closeMessageModal() {
    document.getElementById("message-modal").style.display = "none";
  }

  function deleteMsg(id) {
    if (!confirm("Delete this message?")) return;
    Store.deleteMessage(id);
    closeMessageModal();
    renderMessages();
    updateCounts();
  }

  // ---- Settings ----
  function exportData() {
    var json = Store.exportData();
    var blob = new Blob([json], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "portfolio-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importData(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      if (Store.importData(e.target.result)) {
        alert("Data imported successfully.");
        renderProjects();
        renderMessages();
        updateCounts();
      } else {
        alert("Invalid file. Please upload a valid portfolio backup.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function resetData() {
    if (!confirm("Reset all data to defaults? This will delete all messages and restore the original 4 projects.")) return;
    Store.resetData();
    renderProjects();
    renderMessages();
    updateCounts();
    alert("Data reset to defaults.");
  }

  // ---- Helpers ----
  function updateCounts() {
    var projects = Store.getProjects();
    var messages = Store.getMessages();
    var unread = messages.filter(function (m) { return !m.read; }).length;
    document.getElementById("proj-count").textContent = projects.length + " project" + (projects.length !== 1 ? "s" : "");
    var label = document.getElementById("msg-count-label");
    label.textContent = messages.length + " message" + (messages.length !== 1 ? "s" : "");
    var badge = document.getElementById("msg-count");
    if (unread > 0) {
      badge.style.display = "inline";
      badge.textContent = unread;
    } else {
      badge.style.display = "none";
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    showProjectModal: showProjectModal,
    closeProjectModal: closeProjectModal,
    saveProject: saveProject,
    editProject: editProject,
    deleteProject: deleteProject,
    viewMessage: viewMessage,
    closeMessageModal: closeMessageModal,
    deleteMessage: deleteMsg,
    exportData: exportData,
    importData: importData,
    resetData: resetData
  };
})();

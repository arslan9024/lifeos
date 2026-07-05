const STORAGE_KEY = "lifeos-plans";
const ID_COUNTER_KEY = "lifeos-plan-id-counter";
const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

const form = document.querySelector("#planner-form");
const list = document.querySelector("#planner-list");
const emptyState = document.querySelector("#empty-state");
const summary = document.querySelector("#planner-summary");

let plans = loadPlans();

render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const priority = String(formData.get("priority") || "Medium");
  const notes = String(formData.get("notes") || "").trim();

  if (!title || !date) {
    return;
  }

  plans.push({
    id: createId(),
    title,
    date,
    time,
    priority,
    notes,
    completed: false,
  });

  persistPlans();
  form.reset();
  form.priority.value = "Medium";
  render();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const itemId = button.dataset.id;
  const action = button.dataset.action;

  if (action === "delete") {
    plans = plans.filter((plan) => plan.id !== itemId);
    persistPlans();
    render();
  }
});

list.addEventListener("change", (event) => {
  const checkbox = event.target.closest("input[data-action='toggle']");

  if (!checkbox) {
    return;
  }

  plans = plans.map((plan) =>
    plan.id === checkbox.dataset.id
      ? { ...plan, completed: checkbox.checked }
      : plan,
  );

  persistPlans();
  render();
});

function render() {
  const sortedPlans = [...plans].sort(comparePlans);

  list.replaceChildren(
    ...sortedPlans.map((plan) => {
      const item = document.createElement("li");
      item.className = `planner-item${plan.completed ? " is-complete" : ""}`;

      const topLine = document.createElement("div");
      topLine.className = "task-topline";

      const title = document.createElement("h3");
      title.className = "task-title";
      title.textContent = plan.title;

      const badge = document.createElement("span");
      badge.className = "task-badge";
      badge.dataset.priority = plan.priority;
      badge.textContent = `${plan.priority} priority`;

      topLine.append(title, badge);

      const meta = document.createElement("div");
      meta.className = "task-meta";
      meta.textContent = formatSchedule(plan.date, plan.time);

      const notes = document.createElement("p");
      notes.className = "task-notes";
      notes.textContent = plan.notes;
      notes.hidden = !plan.notes;

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const toggleLabel = document.createElement("label");
      toggleLabel.className = "task-toggle";

      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.checked = plan.completed;
      toggle.dataset.action = "toggle";
      toggle.dataset.id = plan.id;

      const toggleText = document.createElement("span");
      toggleText.textContent = plan.completed ? "Completed" : "Mark complete";

      toggleLabel.append(toggle, toggleText);

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "task-action delete";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.id = plan.id;
      deleteButton.textContent = "Delete";

      actions.append(toggleLabel, deleteButton);
      item.append(topLine, meta, notes, actions);

      return item;
    }),
  );

  emptyState.hidden = sortedPlans.length > 0;
  summary.textContent = buildSummary(sortedPlans);
}

function buildSummary(currentPlans) {
  if (currentPlans.length === 0) {
    return "No plans yet.";
  }

  const completed = currentPlans.filter((plan) => plan.completed).length;
  const remaining = currentPlans.length - completed;
  return `${remaining} remaining · ${completed} completed`;
}

function comparePlans(left, right) {
  const leftTime = `${left.date}T${left.time || "23:59"}`;
  const rightTime = `${right.date}T${right.time || "23:59"}`;

  if (leftTime !== rightTime) {
    return leftTime.localeCompare(rightTime);
  }

  if (left.priority !== right.priority) {
    return PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority];
  }

  return left.title.localeCompare(right.title);
}

function formatSchedule(date, time) {
  const dateValue = new Date(`${date}T${time || "09:00"}`);
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(dateValue);

  if (!time) {
    return formattedDate;
  }

  const formattedTime = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(dateValue);

  return `${formattedDate} at ${formattedTime}`;
}

function loadPlans() {
  try {
    const savedPlans = window.localStorage.getItem(STORAGE_KEY);
    return savedPlans ? JSON.parse(savedPlans) : [];
  } catch {
    return [];
  }
}

function persistPlans() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const nextId = Number(window.localStorage.getItem(ID_COUNTER_KEY) || "0") + 1;
  window.localStorage.setItem(ID_COUNTER_KEY, String(nextId));
  return `plan-${nextId}`;
}

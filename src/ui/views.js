import EditIcon from '../icons/square-edit-outline.svg';
import { formatWeekDay, formatDayMonth, isWithinWeek } from '../utils/date.js';

export function createProjectCard(project) {
    const components = [];
    const isSystem = project.type === "system"

    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card", "card");
    projectCard.dataset.id = project.id;

    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = project.name;
    components.push(title);

    const taskCounter = document.createElement("p");
    taskCounter.classList.add("task-counter");
    taskCounter.textContent = `Remaining's: ${project.remaining || "0"}`;
    components.push(taskCounter);

    createDelBtn(components);

    projectCard.append(...components);

    return projectCard;
}

export function createAllProjectsView(projects) {
    const todoView = document.createElement("div");
    todoView.classList.add("all-projects-view");
    todoView.dataset.id = "all projects";

    const titleContainer = document.createElement("div");
    titleContainer.classList.add("title-container");

    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = "My Projects";
    titleContainer.append(title);

    const line = document.createElement("hr");
    line.classList.add("line");

    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-container");

    projects.forEach(project => {
        projectContainer.append(createProjectCard(project));
    });

    const addProjectBtn = createAddItemBtn("New Project")
    todoView.append(titleContainer, line, projectContainer, addProjectBtn);

    return todoView;
}
export function createProjectView(project, tasks) {
    const components = [];
    const isSystem = project.type === "system";

    const projectView = document.createElement("div")
    projectView.classList.add("project-view");
    projectView.dataset.id = project.id;

    const titleContainer = document.createElement("div");
    titleContainer.classList.add("title-container");

    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = project.name;
    titleContainer.append(title);

    if (project.type !== "system") {
        const editBtn = createEditBtn();
        titleContainer.append(editBtn);
    }
    components.push(titleContainer);

    if (project.description) {
        const description = createDescription(project);
        components.push(description);
    }

    const line = document.createElement("hr");
    line.classList.add("line");
    components.push(line);

    const itemListWrapper = document.createElement("div");
    itemListWrapper.classList.add("list-container");

    const itemList = document.createElement("ul");
    itemList.classList.add("item-list");
    tasks.forEach(task => {
        itemList.append(createTaskItem(task));
    });
    itemListWrapper.append(itemList);
    components.push(itemListWrapper);

    const addTaskBtn = createAddItemBtn("Add Task")
    components.push(addTaskBtn);

    projectView.append(...components)

    return projectView;
}
export function createTaskView(task, handleUpdateNotes) {
    const taskView = document.createElement("div")
    taskView.classList.add("task-view");
    taskView.dataset.id = task.id;

    const upperSection = createUpper();

    const bottomSection = createBottom();

    taskView.append(upperSection, bottomSection)

    return taskView;

    function createBottom() {
        const bottomSection = document.createElement("div");
        bottomSection.classList.add("bottom-section");

        const itemListWrapper = document.createElement("div");
        itemListWrapper.classList.add("list-container");
        const itemList = document.createElement("ul");
        itemList.classList.add("item-list");
        const addChecklistBtn = createAddItemBtn("Add Checklist Item");
        itemListWrapper.append(itemList, addChecklistBtn);
        const checklistWrapper = document.createElement("div");
        checklistWrapper.append(itemListWrapper);
        bottomSection.append(checklistWrapper);

        const line = document.createElement("hr");
        line.classList.add("line");
        bottomSection.append(line);

        const notes = document.createElement("textarea");
        notes.classList.add("notes");
        notes.addEventListener("blur", (e) => {
            handleUpdateNotes(task.id, { notes: notes.value });
        });
        Object.assign(notes, {
            id: "notes",
            name: "notes",
            placeholder: "",
            maxLength: 240,
            required: true
        });
        notes.value = task.notes;
        const notesLabel = document.createElement("label");
        notesLabel.setAttribute("for", "notes");
        notesLabel.textContent = "Notes";
        notesLabel.classList.add("notes-label");
        const notesWrapper = document.createElement("div");
        notesWrapper.classList.add("notes-wrapper");
        notesWrapper.append(notesLabel, notes);
        bottomSection.append(notesWrapper)

        return bottomSection;
    }

    function createUpper() {
        const upperSection = document.createElement("div");
        upperSection.classList.add("upper-section");
        const titleContainer = document.createElement("div");
        titleContainer.classList.add("title-container");
        const title = document.createElement("h1");
        title.classList.add("title");
        title.textContent = task.name;
        titleContainer.append(title);
        if (task.dueDate) {
            const dueDate = createDueDate(task);
            titleContainer.append(dueDate);
        }
        if (task.isImportant) {
            const isImportant = createImportant();
            titleContainer.append(isImportant);
        }
        const editBtn = createEditBtn();
        titleContainer.append(editBtn);
        upperSection.append(titleContainer);

        if (task.description) {
            const description = createDescription(task);
            upperSection.append(description);
        }
        const line = document.createElement("hr");
        line.classList.add("line");
        upperSection.append(line);
        return upperSection;
    }
}


export function createTaskItem(task) {
    const components = [];
    const li = document.createElement("li");
    li.classList.add("list-item");
    li.dataset.id = task.id;

    const wrapper = document.createElement("button");
    wrapper.classList.add("item");

    const content = document.createElement("div");
    content.classList.add("item-content");

    const checkbox = document.createElement("input");
    Object.assign(checkbox, {
        id: "check",
        type: "checkbox",
    });

    if (task.isCompleted) {
        checkbox.checked = true;
        li.classList.add("completed");
    }
    components.push(checkbox);

    const name = document.createElement("p");
    name.classList.add("name");
    name.textContent = task.name;
    components.push(name);

    if (task.dueDate) {
        const dueDate = createDueDate(task);
        components.push(dueDate);
    }

    if (task.isImportant) {
        const isImportant = createImportant();
        components.push(isImportant);
    }

    createDelBtn(components);

    content.append(...components);
    wrapper.append(content);
    li.append(wrapper);

    return li;
}

function createAddItemBtn(text) {
    const addBtn = document.createElement("button");
    addBtn.classList.add("add-item-button");
    addBtn.textContent = text;
    return addBtn;
}
function createImportant() {
    const isImportant = document.createElement("p");
    isImportant.classList.add("is-important");
    isImportant.textContent = "Important";
    return isImportant;
}
function createDueDate(task) {
    const dueDate = document.createElement("p");
    dueDate.classList.add("due-date");
    isWithinWeek(task.dueDate)
        ? dueDate.textContent = formatWeekDay(task.dueDate)
        : dueDate.textContent = formatDayMonth(task.dueDate);
    return dueDate;
}
function createDescription(item) {
    const description = document.createElement("p");
    description.classList.add("description");
    description.textContent = item.description;
    return description;
}
function createDelBtn(components) {
    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-button");
    delBtn.textContent = "X";
    components.push(delBtn);
}
function createEditBtn() {
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-button");
    editBtn.innerHTML = EditIcon;
    return editBtn;
}
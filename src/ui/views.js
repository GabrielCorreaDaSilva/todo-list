import { el } from 'date-fns/locale';
import EditIcon from '../icons/square-edit-outline.svg';
import { formatWeekDay, formatDayMonth, isWithinWeek, parseInputToDate } from '../utils/date.js';

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

    components.push(createDelBtn());

    projectCard.append(...components);

    return projectCard;
}

export function createAllProjectsView(projects, onDelete, onAdd) {

    const todoView = document.createElement("div");
    todoView.classList.add("all-projects-view");
    todoView.dataset.id = "all projects";
    todoView.addEventListener("click", (e) => {
        const clickedDelete = e.target.closest(".delete-button");
        const clickedAddProject = e.target.closest(".add-item-button");
        const item = e.target.closest(".project-card");
        if (clickedDelete) {
            e.stopPropagation();
            onDelete(item);
            return;
        }
        if (clickedAddProject) {
            onAdd("project", null, projectContainer);
            return;
        }
    });

    const titleContainer = createTitleContainer("My Projects");

    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-container");

    projects.forEach(project => {
        projectContainer.append(createProjectCard(project));
    });

    const addProjectBtn = createAddItemBtn("New Project");

    todoView.append(titleContainer, createLine(), projectContainer, addProjectBtn);

    return todoView;
}

export function createProjectView(project, children, onAdd, onEdit, onDelete, onMove, toggleCheck) {
    const components = [];
    const isSystem = project.type === "system";

    const projectView = document.createElement("div");
    bindDraggableEvents(projectView, onMove);
    projectView.classList.add("project-view");
    projectView.dataset.id = project.id;
    projectView.addEventListener("click", (e) => {
        const clickedCheckbox = e.target.closest(".check");
        const clickedDelete = e.target.closest(".delete-button");
        const clickedAddtask = e.target.closest(".add-item-button");
        const clickedAddSection = e.target.closest(".add-section-button");
        const clickedEditProject = e.target.closest(".edit-button");
        const clickedEditSection = e.target.closest(".section-container .edit-button");
        const section = e.target.closest(".section-container");
        const wrapper = e.target.closest(".list-wrapper");
        const list = e.target.closest(".item-list") ?? wrapper?.querySelector("ul");
        const item = e.target.closest(".list-item");
        const container = e.target.closest(".container");
        if (clickedCheckbox) {
            e.stopPropagation();
            toggleCheck(item);
            return;
        }
        if (clickedDelete) {
            e.stopPropagation();
            onDelete(container);
            return;
        }
        if (clickedAddtask) {
            e.stopPropagation();
            onAdd("task", list);
            return;
        }
        if (clickedAddSection) {
            onAdd("section", project.id, projectView);
            return;
        }
        if (clickedEditSection) {
            onEdit(section);
            return;
        }
        if (clickedEditProject) {
            onEdit(projectView);
            return;
        }
    });

    const titleContainer = createTitleContainer(project.name);
    const upperSection = document.createElement("div");
    upperSection.classList.add("upper");
    upperSection.append(titleContainer);

    if (project.type !== "system") {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("buttons-container");
        upperSection.append(buttonContainer);
        buttonContainer.append(createEditBtn());
    }

    if (project.description) {
        const description = createDescription(project);
        upperSection.append(description);
    }
    const line = createLine();
    upperSection.append(line);
    components.push(upperSection);
    components.push(createAddSection());
    projectView.append(...components);
    children.forEach(child => projectView.append(createSection(child)));

    return projectView;

    function createAddSection() {
        const addSectionBtn = document.createElement("button");
        addSectionBtn.classList.add("add-section-button");
        const addSectionText = document.createElement("p");
        addSectionText.classList.add("text");
        addSectionText.textContent = "New Section";
        addSectionBtn.append(addSectionText);

        const addSectionWrapper = document.createElement("div");
        addSectionWrapper.classList.add("add-section-container");
        addSectionWrapper.append(addSectionBtn);
        return addSectionWrapper;
    }
}

export function createTaskView(task, onAdd, onEdit,onNotesEdit, onDelete, onMove) {

    const taskView = document.createElement("div");
    taskView.classList.add("task-view");
    taskView.dataset.id = task.id;
    taskView.addEventListener("click", (e) => {
        const clickedCheckbox = e.target.closest(".check");
        const clickedAddTask = e.target.closest(".add-item-button");
        const clickedEditBtn = e.target.closest(".edit-button");
        const wrapper = e.target.closest(".list-wrapper");
        const list = e.target.closest(".item-list") ?? wrapper?.querySelector("ul");
        const item = e.target.closest(".list-item")
        if (clickedCheckbox) {
            item.classList.add("completed");
            onDelete(item, task.id);
            return;
        }
        if (clickedAddTask) {
            onAdd("subtask", list, list.dataset.id)
        }
        if (clickedEditBtn) {
            onEdit(taskView);
        }
    });
    bindDraggableEvents(taskView, onMove)
    const upperSection = createUpper();
    const bottomSection = createBottom();
    taskView.append(upperSection, bottomSection)
    return taskView;

    function createBottom() {
        const bottomSection = document.createElement("div");
        bottomSection.classList.add("bottom-section");

        const wrapper = createList(task);
        bottomSection.append(wrapper);

        const line = document.createElement("hr");
        line.classList.add("line");
        bottomSection.append(line);

        const notes = document.createElement("textarea");
        notes.classList.add("notes");
        notes.addEventListener("blur", (e) => {
            onNotesEdit(task.id, { notes: notes.value });
        });
        Object.assign(notes, {
            id: "notes",
            name: "notes",
            placeholder: "",
            maxLength: 1200,
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
    li.classList.add("list-item", "container");
    li.dataset.id = task.id;
    li.draggable = "true";

    const wrapper = document.createElement("button");
    wrapper.classList.add("item");

    const content = document.createElement("div");
    content.classList.add("item-content");

    const checkbox = document.createElement("input");
    checkbox.classList.add("check");
    Object.assign(checkbox, {
        id: "check",
        type: "checkbox",
        class: "check"
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

    if (task.type === "task")
        components.push(createDelBtn());

    content.append(...components);
    wrapper.append(content);
    li.append(wrapper);

    return li;
}

export function createSection(section) {
    const container = document.createElement("div");
    container.classList.add("section-container", "container");
    container.dataset.id = section.id;

    if (section.name !== "default") {
        const titleContainer = createTitleContainer(section.name);
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("buttons-container");
        buttonContainer.append(createEditBtn(), createDelBtn());
        titleContainer.append(buttonContainer);

        container.append(titleContainer, createLine());
    }

    const wrapper = createList(section);
    container.append(wrapper);

    return container;
}

function createList(parent) {
    const list = document.createElement("ul");
    list.classList.add("item-list");
    list.dataset.id = parent.id;
    parent.children.forEach(item => list.append(createTaskItem(item)));
    const addBtn = wrapWithListItem(createAddItemBtn("Add Task", parent.id));
    addBtn.classList.add("add-row");
    const wrapper = document.createElement("ul");
    wrapper.append(list, addBtn);
    wrapper.classList.add("list-wrapper");
    return wrapper;
}

function wrapWithListItem(element) {
    const container = document.createElement("li");
    container.classList.add("list-item", "container");
    container.append(element);
    return container;
}
function createTitleContainer(titleName) {
    const titleContainer = document.createElement("div");
    titleContainer.classList.add("title-container");

    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = titleName;
    titleContainer.append(title);
    return titleContainer;
}
function createLine() {
    const line = document.createElement("hr");
    line.classList.add("line");
    return line;
}
function createAddItemBtn(text, parent = "none") {
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
function createDelBtn() {
    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-button");
    delBtn.textContent = "X";
    return delBtn;
}
function createEditBtn() {
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-button");
    editBtn.innerHTML = EditIcon;
    return editBtn;
}

function bindDraggableEvents(view, onMove) {
    let itemDragged;
    const saveState = onMove;
    const findClosestElementToMouse = (elementList, e) => {
        if (!elementList) return;
        const items = [...elementList];

        const nextToMouse = items.find(sibling => {
            const box = sibling.getBoundingClientRect();
            return e.clientY < box.top + box.height / 2;
        });
        return nextToMouse;
    }
    const initSiblingsList = (e) => {
        e.preventDefault();
        const itemDragged = document.querySelector(".dragging");

        const targetList = e.target.closest(".list-wrapper")?.querySelector(".item-list");
        if (!targetList) return;

        const nextSibling = findClosestElementToMouse(targetList.querySelectorAll(".list-item:not(.dragging):not(.add-row)"), e);
        if (!nextSibling) {
            targetList.append(itemDragged);
        } else {
            targetList.insertBefore(itemDragged, nextSibling);
        }
    }
    view.addEventListener("dragstart", (e) => {
        const item = e.target.closest?.(".list-item");
        if (!item) return;

        itemDragged = e.target;
        setTimeout(() => e.target.classList.add("dragging"), 0);
    });
    view.addEventListener("dragend", (e) => {
        const element = e.target;
        const item = e.target.closest?.(".list-item");
        if (!item) return;
        element.classList.remove("dragging");
    });
    view.addEventListener("dragover", e => {
        if (!itemDragged) return;
        e.preventDefault();
        initSiblingsList(e);
    }
    );

    view.addEventListener("drop", e => {
        const item = e.target.closest?.(".list-item");
        if (!item) return;
        e.preventDefault();
        const container = e.target.closest(".list-wrapper")?.querySelector(".item-list");
        const sibling = findClosestElementToMouse(container.querySelectorAll(".list-item:not(.dragging)"), e);
        if (sibling) {
            saveState(itemDragged, sibling, container);
        } else {
            saveState(itemDragged, null, container);
        }
    });
}

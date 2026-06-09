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
    taskCounter.textContent = `Remaining's: ${project.remaining}`;
    components.push(taskCounter);

    if (!isSystem) {
        const delBtn = document.createElement("button");
        delBtn.classList.add("delete-button");
        delBtn.textContent = "X";
        components.push(delBtn);
    }

    projectCard.append(...components);

    return projectCard;
}

export function createTodoView(projects) {
    const todoView = document.createElement("div");
    todoView.classList.add("todo-view");

    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-container");


    projects.forEach(project => {
        projectContainer.append(createProjectCard(project));
    });

    const addProjectBtn = document.createElement("button");
    addProjectBtn.classList.add("add-project-button");
    addProjectBtn.textContent = "New project";
    todoView.append(projectContainer, addProjectBtn);

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

    if (!isSystem) {
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-button", "edit-project");
        editBtn.innerHTML = EditIcon;
        titleContainer.append(editBtn);
    }
    components.push(titleContainer);

    const closeView = document.createElement("button");
    closeView.classList.add("close-project-view");
    closeView.textContent = "X";
    components.push(closeView);

    const itemListWrapper = document.createElement("div");
    itemListWrapper.classList.add("list-container");

    const itemList = document.createElement("ul");
    itemList.classList.add("item-list");
    tasks.forEach(task => {
        itemList.append(createTaskItem(task));
    });
    itemListWrapper.append(itemList);
    components.push(itemListWrapper);

    const addTaskBtn = document.createElement("button");
    addTaskBtn.classList.add("add-task-button");
    addTaskBtn.textContent = " Add Task";
    components.push(addTaskBtn);

    projectView.append(...components)

    return projectView;
}

export function createTaskItem(task) {
    const components = [];
    const li = document.createElement("li");
    li.classList.add("list-item");

    const wrapper = document.createElement("button");
    wrapper.classList.add("item");

    const content = document.createElement("div");
    content.classList.add("item-content");

    const checkbox = document.createElement("input");
    Object.assign(checkbox, {
        id: "check",
        type: "checkbox",
    });
    components.push(checkbox);

    const name = document.createElement("p");
    name.classList.add("name");
    name.textContent = task.name;
    components.push(name);

    if (task.dueDate) {
        const dueDate = document.createElement("p");
        dueDate.classList.add("due-date");
        isWithinWeek(task.dueDate)
            ? dueDate.textContent = formatWeekDay(task.dueDate)
            : dueDate.textContent = formatDayMonth(task.dueDate)
        components.push(dueDate);
    }

    if (task.isImportant) {
        const isImportant = document.createElement("p");
        isImportant.classList.add("is-important");
        isImportant.textContent = "Important";
        components.push(isImportant);
    }

    content.append(...components);
    wrapper.append(content);
    li.append(wrapper);

    return li;
}
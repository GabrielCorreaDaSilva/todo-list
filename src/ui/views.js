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

    const addProjectBtn = document.createElement("button");
    addProjectBtn.classList.add("add-project-button");
    addProjectBtn.textContent = "New project";
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
        const description = document.createElement("p");
        description.classList.add("description");
        description.textContent = project.description;
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
    
    createDelBtn(components);
    
    content.append(...components);
    wrapper.append(content);
    li.append(wrapper);
    
    return li;
}

function createDelBtn(components) {
    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-button");
    delBtn.textContent = "X";
    components.push(delBtn);
}
function createEditBtn() {
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-button", "edit-project");
    editBtn.innerHTML = EditIcon;
    return editBtn;
}
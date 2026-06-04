import EditIcon from '../icons/square-edit-outline.svg';

export function createProjectCard(project) {

    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card", "card");
    projectCard.dataset.id = project.id;

    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = project.name;

    const taskCounter = document.createElement("p");
    taskCounter.classList.add("task-counter");
    taskCounter.textContent = `Remaining's: ${project.remaining}`;

    const projectDuration = document.createElement("p");
    projectDuration.classList.add("project-duration");
    projectDuration.textContent = `Duration: ${project.duration} days`;

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-button");
    delBtn.textContent = "X";

    projectCard.append(title, taskCounter, projectDuration, delBtn);

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
    const projectView = document.createElement("div")
    projectView.classList.add("project-view");
    projectView.dataset.id = project.id;

    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = project.name;

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-button", "edit-project");
    editBtn.innerHTML = EditIcon;

    const titleContainer = document.createElement("div");
    titleContainer.classList.add("title-container");
    titleContainer.append(title, editBtn);

    const closeView = document.createElement("button");
    closeView.classList.add("close-project-view");
    closeView.textContent = "X";

    const addTaskBtn = document.createElement("button");
    addTaskBtn.classList.add("add-task-button");
    addTaskBtn.textContent = "New task";

    const itemListWrapper = document.createElement("div");
    itemListWrapper.classList.add("list-container");

    const itemList = document.createElement("ul");
    itemList.classList.add("item-list");
    tasks.forEach(task => {
        itemList.append(createTaskItem(task));
    });
    itemListWrapper.append(itemList);

    projectView.append(titleContainer, itemListWrapper, closeView, addTaskBtn)

    return projectView;
}

export function createTaskItem(task) {
    const li = document.createElement("li");
    li.classList.add("list-item");

    const wrapper = document.createElement("div");
    wrapper.classList.add("task-item", "item");

    const content = document.createElement("div");
    content.classList.add("item-content");

    const name = document.createElement("p");
    name.classList.add("name");

    name.textContent = "#" + task.name;
    const duration = document.createElement("p");
    duration.textContent = "Duration:  " + task.duration + " days";

    content.append(name, duration)
    wrapper.append(content);
    li.append(wrapper);

    return li;
}
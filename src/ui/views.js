export function createProjectCard(project) {

    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");
    projectCard.dataset.id = project.id;

    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = project.name;

    const taskCounter = document.createElement("p");
    taskCounter.classList.add("task-counter");
    taskCounter.textContent = `Tasks: ${project.tasks}`;

    const projectDuration = document.createElement("p");
    projectDuration.classList.add("project-duration");
    projectDuration.textContent = `Duration: ${project.duration}`;

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-button");
    delBtn.textContent = "X";

    projectCard.append(title, taskCounter, projectDuration, delBtn);

    return projectCard;
}
export function createTaskCard(task) {

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.dataset.id = task.id;

    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = task.name;

    const description = document.createElement("p");
    description.classList.add("title");
    description.textContent = `Description: ${task.description}`;

    const duration = document.createElement("p");
    duration.classList.add("title");
    duration.textContent = `Duration:  ${task.duration}`;

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-button");
    delBtn.textContent = "X";

    taskCard.append(title, description, duration, delBtn);

    return taskCard;
}

export function createTodoView(projects) {
    const todoView = document.createElement("div");
    todoView.classList.add("todo-container");
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
    projectView.classList.add("project-container");
    projectView.dataset.id = project.id;

    const title = document.createElement("h1");
    title.textContent = project.name;

    const closeView = document.createElement("button");
    closeView.classList.add("close-project-view");
    closeView.textContent = "Return";

    const addTaskBtn = document.createElement("button");
    addTaskBtn.classList.add("add-task-button");
    addTaskBtn.textContent = "New task";

    const tasksContainer = document.createElement("div");
    tasksContainer.classList.add("task-container");
    tasks.forEach(task => {
        tasksContainer.append(createTaskCard(task));
    });

    projectView.append(title, tasksContainer, closeView, addTaskBtn)

    return projectView;
}
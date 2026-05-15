export function UIController(service) {

    const content = document.querySelector("#content");

    function createProjectCard(project) {

        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card");
        projectCard.dataset.id = project.id;

        const title = document.createElement("h2");
        title.classList.add("title");
        title.textContent = project.name;

        const taskCounter = document.createElement("p");
        taskCounter.classList.add("task-counter");
        taskCounter.textContent = `Tasks: ${project.tasks}`;

        const delBtn = document.createElement("button");
        delBtn.classList.add("delete-button");
        delBtn.textContent = "X";

        projectCard.append(title, taskCounter, delBtn);

        return projectCard;
    }
    function createTaskCard(task) {

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

    function createTodoView(projects) {
        const todoView = document.createElement("div");
        todoView.classList.add("todo-container");

        projects.forEach(project => {
            todoView.append(createProjectCard(project));
        });

        return todoView;
    }
    function createProjectView(project) {
        const projectView = document.createElement("div")
        projectView.classList.add("project-container");
        projectView.dataset.id = project.id;

        const title = document.createElement("h1");
        title.textContent = project.name;

        const closeView = document.createElement("button");
        closeView.classList.add("close-project-view");
        closeView.textContent = "Return";
        closeView.addEventListener("click", () => {
            content.textContent = "";
            renderTodoView();
        });

        const tasksContainer = document.createElement("div");
        const tasks = service.getTasks(project.id);
        tasks.forEach(task => {
            tasksContainer.append(createTaskCard(task));
        });

        projectView.append(title, tasksContainer, closeView)

        return projectView;
    }

    function renderTodoView() {
        content.append(createTodoView(service.getProjects()));
    }
    function renderProjectView(projectId) {
        const project = service.getProject(projectId);
        content.textContent = "";
        content.append(createProjectView(project));
    }

    function handleDeleteProject(projectCard) {
        service.removeProject(projectCard.dataset.id);
        projectCard.remove();
    }
    function handleDeleteTask(projectView, taskCard) {
        service.removeTask(projectView.dataset.id, taskCard.dataset.id);
        taskCard.remove();
    }

    function bindEvents() {
        content.addEventListener("click", (e) => {
            const deleteButton = e.target.closest(".delete-button");
            const projectCard = e.target.closest(".project-card");
            const taskCard = e.target.closest(".task-card");

            if (deleteButton && projectCard) {
                handleDeleteProject(projectCard);
                return;
            }
            if (deleteButton && taskCard) {
                const projectView = e.target.closest(".project-container");
                handleDeleteTask(projectView, taskCard);
                return;
            }
            if (projectCard) {
                renderProjectView(projectCard.dataset.id);
                return;
            }
        });
    }

    function init() {
        renderTodoView();
        bindEvents();
    }

    document.addEventListener("DOMContentLoaded", () => {
        init();
    });
}
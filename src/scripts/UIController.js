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

        projectCard.append(title, taskCounter);

        return projectCard;
    }
    function createTaskCard(task) {

        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");

        const title = document.createElement("h2");
        title.classList.add("title");
        title.textContent = task.name;

        const description = document.createElement("p");
        description.classList.add("title");
        description.textContent = `Description: ${task.description}`;

        const duration = document.createElement("p");
        duration.classList.add("title");
        duration.textContent = `Duration:  ${task.duration}`;

        taskCard.append(title, description, duration);

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

        const title = document.createElement("h1");
        title.textContent = project.name;

        const closeView = document.createElement("button");
        closeView.classList.add("close-project-view");
        closeView.textContent = "Return";
        closeView.addEventListener("click",() => {
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

    function bindEvents() {
        content.addEventListener("click", (e) => {
            if (e.target.closest(".project-card")) {
                renderProjectView(e.target.closest(".project-card").dataset.id);
            }
        });
    }

    function init() {
        renderTodoView();
        bindEvents();
    }

    document.addEventListener("DOMContentLoaded", () => {
        console.log(service.getProjects());
        console.log(content);
        init();
    });
}
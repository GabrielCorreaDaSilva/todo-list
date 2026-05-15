export function UIController(service) {

    const content = document.querySelector("#content");
    const modal = createModal();

    function createModal() {
        const body = document.querySelector("body");
        const modal = document.createElement("dialog");
        body.append(modal);
        return modal;
    }
    function createProjectForm() {
        const form = document.createElement("form");
        form.classList.add("project-form");

        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");

        const nameInput = document.createElement("input");
        Object.assign(nameInput, {
            id: "project-name",
            type: "text",
            name: "name",
            placeholder: "Name (Max. 32)",
            size: 32,
            required: true
        });

        const nameInputLabel = document.createElement("label");
        nameInputLabel.setAttribute("for", "project-name");
        nameInputLabel.textContent = "Project name: "

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("buttons-container");

        const confirmBtn = document.createElement("button");
        confirmBtn.classList.add("confirm-button");
        confirmBtn.textContent = "Confirm";
        confirmBtn.type = "submit";

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancel-button");
        cancelBtn.textContent = "Cancel";

        inputContainer.append(nameInput, nameInputLabel);
        buttonsContainer.append(confirmBtn, cancelBtn);

        form.append(inputContainer, buttonsContainer);

        return form;
    }
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

        const addProjectBtn = document.createElement("button");
        addProjectBtn.classList.add("add-project-button");
        addProjectBtn.textContent = "New project";
        todoView.append(addProjectBtn);

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

        const addTaskBtn = document.createElement("button");
        addTaskBtn.classList.add("add-task-button");
        addTaskBtn.textContent = "New task";

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
    function handleAddBtn(form) {
        modal.showModal();
        modal.textContent = "";
        modal.append(form);
    }

    function bindEvents() {
        content.addEventListener("click", (e) => {
            const deleteButton = e.target.closest(".delete-button");
            const projectCard = e.target.closest(".project-card");
            const taskCard = e.target.closest(".task-card");
            const closeProjectView = e.target.closest(".close-project-view");
            const addProjectBtn = e.target.closest(".add-project-button");

            if (addProjectBtn) {
                handleAddBtn(createProjectForm());
                return;
            }
            if (closeProjectView) {
                content.textContent = "";
                renderTodoView();
                return;
            }
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
        modal.addEventListener("click", (e) => {
            const cancelBtn = e.target.closest(".cancel-button");

            if (cancelBtn) {
                modal.close();
                return;
            }

        });
        modal.addEventListener("submit", (e) => {
            const isProjectForm = e.target.classList.contains("project-form");

            e.preventDefault();
            const form = e.target;

            if (!form.checkValidity()) {
                form.reportValidity();
                return;

            }
            const formData = new FormData(form);
            if (isProjectForm) {
                const projectData = Object.fromEntries(formData.entries());
                const newProject = service.addProject(projectData);
                content.append(createProjectCard(newProject));
            }
            modal.close();
            return;

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
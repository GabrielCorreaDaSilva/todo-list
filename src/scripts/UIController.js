function UIController(service) {
    function createProjectCard(project) {

        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card");

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
}
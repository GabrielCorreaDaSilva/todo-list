import { createTaskCard, createProjectCard, createProjectView, createTodoView } from "./views.js";
import { createProjectForm, createTaskForm } from "./forms.js";
import { createModal, openModal } from "./modal.js";

export function UIController(service) {

    const content = document.querySelector("#content");
    const modal = createModal();

    function renderTodoView() {
        content.replaceChildren(createTodoView(service.getProjects()));
    }
    function renderProjectView(projectId) {
        const project = service.getProject(projectId);
        const tasks = service.getTasks(projectId);
        content.replaceChildren(createProjectView(project, tasks));
    }

    function handleDeleteProject(projectCard) {
        service.removeProject(projectCard.dataset.id);
        projectCard.remove();
    }
    function handleDeleteTask(projectView, taskCard) {
        service.removeTask(projectView.dataset.id, taskCard.dataset.id);
        taskCard.remove();
    }

    function handleEdit(e) {
        const isProject = e.target.closest(".title-container");
        const isTask = e.target.closest(".task-card");
        if (isProject) {

        }
        if (isTask) {

        }
    }
    function handleCreateProject(projectData) {
        const newProject = service.addProject(projectData);
        const projectContainer = content.querySelector(".project-container");
        projectContainer.append(createProjectCard(newProject));
    }
    function handleCreateTask(taskData, projectId) {
        const newTask = service.addTask(projectId, { ...taskData, duration: parseInt(taskData.duration) });
        const taskContainer = content.querySelector(".task-container");
        taskContainer.append(createTaskCard(newTask));
    }

    function handleAddTask(projectId) {
        openModal(
            createTaskForm({
                onSubmit: (taskData) => handleCreateTask(taskData, projectId)
            },
                projectId),
            modal
        );
    }

    function handleAddProject() {
        openModal(
            createProjectForm({
                onSubmit: handleCreateProject
            }),
            modal
        );
        return;
    }


    function bindEvents() {
        content.addEventListener("click", (e) => {
            const deleteButton = e.target.closest(".delete-button");
            const projectCard = e.target.closest(".project-card");
            const taskCard = e.target.closest(".task-card");
            const closeProjectView = e.target.closest(".close-project-view");
            const projectView = e.target.closest(".project-container");
            const addProjectBtn = e.target.closest(".add-project-button");
            const addTaskBtn = e.target.closest(".add-task-button");

            if (addProjectBtn) {
                handleAddProject();
                return;
            }
            if (addTaskBtn) {
                handleAddTask(projectView.dataset.id);
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

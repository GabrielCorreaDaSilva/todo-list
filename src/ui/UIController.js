import { createProjectCard, createProjectView, createTodoView, createTaskItem } from "./views.js";
import { createProjectForm, createTaskForm } from "./forms.js";
import { createModal, openModal } from "./modal.js";

export function UIController(service) {

    const content = document.querySelector("#content");
    const modal = createModal();

    function renderTodoView() {
        content.replaceChildren(createTodoView(service.getProjects()));
    }
    function renderProjectView(projectId) {
        const project = service.getItem(projectId);
        const items = service.getChildren(projectId);
        content.replaceChildren(createProjectView(project, items));
    }

    function handleDelete(element) {
        element.classList.add("fade-out");
        setTimeout(() => element.remove(), 300);
        service.removeItem(element.dataset.id);
    }

    function handleCreateProject(projectData) {
        const newProject = service.addProject(projectData);
        const projectContainer = content.querySelector(".project-container");
        projectContainer.append(createProjectCard(newProject));
    }
    function handleCreateTask(taskData, projectId) {
        const newTask = service.addTask(projectId, { ...taskData, duration: parseInt(taskData.duration) });
        const itemList = content.querySelector(".item-list");
        itemList.append(createTaskItem(newTask));
    }
    function handleEditProject(projectId, projectData, projectView) {
        const editedProject = service.editProject(projectId, projectData);
        const projectTitle = projectView.querySelector(".title");
        projectTitle.textContent = editedProject.name;
    }
    function handleEditTask(projectId, taskData, taskId, taskCard) {
        const editedTask = service.editTask(projectId, taskId, taskData);
        const editedCard = createTaskItem(editedTask);
        taskCard.replaceWith(editedCard);
    }

    function handleAddProjectBtn() {
        openModal(
            createProjectForm({
                onSubmit: handleCreateProject
            }),
            modal
        );
    }
    function handleAddTaskBtn(projectId) {
        openModal(
            createTaskForm({
                onSubmit: (taskData) => handleCreateTask(taskData, projectId)
            },
                projectId),
            modal
        );
    }
    function handleEditProjectBtn(projectView, projectId = projectView.dataset.id) {
        const project = service.getProject(projectId);
        openModal(
            createProjectForm({
                name: project.name,
                onSubmit: (projectData) => handleEditProject(projectId, projectData, projectView)
            }),
            modal
        );
    }
    function handleEditTaskBtn(projectId, taskCard, taskId = taskCard.dataset.id) {
        const task = service.getTask(projectId, taskId);
        openModal(
            createTaskForm({
                ...task,
                onSubmit: (taskData) => handleEditTask(projectId, taskData, taskId, taskCard)
            },
                projectId),
            modal
        );
    }

    function bindEvents() {
        content.addEventListener("click", (e) => {
            const deleteButton = e.target.closest(".delete-button");
            const projectCard = e.target.closest(".project-card");
            const taskCard = e.target.closest(".task-card");
            const closeProjectView = e.target.closest(".close-project-view");
            const projectView = e.target.closest(".project-view");
            const addProjectBtn = e.target.closest(".add-project-button");
            const addTaskBtn = e.target.closest(".add-task-button");
            const editProject = e.target.closest(".edit-project");
            const editTask = e.target.closest(".edit-task");

            if (addProjectBtn) {
                handleAddProjectBtn();
                return;
            }
            if (addTaskBtn) {
                handleAddTaskBtn(projectView.dataset.id);
                return;
            }
            if (editProject) {
                handleEditProjectBtn(projectView);
            }
            if (editTask) {
                handleEditTaskBtn(projectView.dataset.id, taskCard)
            }
            if (closeProjectView) {
                content.textContent = "";
                renderTodoView();
                return;
            }
            if (projectCard && deleteButton) {
                handleDelete(projectCard);
                return;
            }
            if (taskCard && deleteButton) {
                handleDelete(taskCard);
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

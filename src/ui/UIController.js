import { createProjectCard, createProjectView, createTodoView, createTaskItem } from "./views.js";
import { createProjectForm, createTaskForm } from "./forms.js";
import { createModal, openModal } from "./modal.js";

export function UIController(service) {

    const content = document.querySelector("#content");
    const nav = document.querySelector("#sidebar-nav");
    const modal = createModal();

    function renderAllProjectsView() {
        const projectList = service.getProjects();
        content.replaceChildren(createTodoView(projectList));
    }
    function renderProjectView(projectId) {
        const project = service.getItem(projectId);
        const items = service.getChildren(projectId);
        content.replaceChildren(createProjectView(project, items));
    }
    function renderNav() {
        const list = document.createElement("ul");
        list.id = "sidebar"
        const personal = createPersonalBtn();
        const AllProjects = createAllProjectsBtn();
        list.append(personal, AllProjects)
        nav.append(list);

        function changeCurrentNavItem(current) {
            const buttons = nav.querySelectorAll("button");
            buttons.forEach(button => button.classList.remove("current-view"));
            current.classList.add("current-view");
        }

        function createPersonalBtn() {
            const Btn = document.createElement("button");
            Btn.classList.add("open-personal");
            Btn.textContent = "My Tasks";
            Btn.addEventListener("click", (e) => {
                changeCurrentNavItem(e.target);
                renderProjectView("personal")
            });
            const li = document.createElement("li");
            li.classList.add("sidebar-item")
            li.append(Btn);
            return li;
        }

        function createAllProjectsBtn() {
            const Btn = document.createElement("button");
            Btn.classList.add("open-projects");
            Btn.textContent = "My Projects";
            Btn.addEventListener("click", (e) => {
                changeCurrentNavItem(e.target);
                renderAllProjectsView();
            });
            const li = document.createElement("li");
            li.classList.add("sidebar-item")
            li.append(Btn);
            return li;
        }
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
        const newTask = service.addTask(projectId, taskData);
        const itemList = content.querySelector(".item-list");
        itemList.append(createTaskItem(newTask));
    }
    function handleEditProject(projectId, projectData, projectView) {
        const editedProject = service.editItem(projectId, projectData);
        const projectTitle = projectView.querySelector(".title");
        projectTitle.textContent = editedProject.name;
    }
    function handleEditTask(taskData, taskId, taskCard) {
        console.log(taskData)
        const editedTask = service.editItem(taskId, taskData);
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
    function handleEditTaskBtn(taskCard, taskId = taskCard.dataset.id) {
        const task = service.getItem(taskId);
        openModal(
            createTaskForm({
                ...task,
                onSubmit: (taskData) => handleEditTask(taskData, taskId, taskCard)
            }),
            modal
        );
    }

    function bindEvents() {
        content.addEventListener("click", (e) => {
            const deleteButton = e.target.closest(".delete-button");
            const projectCard = e.target.closest(".project-card");
            const task = e.target.closest(".list-item");
            const closeProjectView = e.target.closest(".close-project-view");
            const projectView = e.target.closest(".project-view");
            const addProjectBtn = e.target.closest(".add-project-button");
            const addTaskBtn = e.target.closest(".add-task-button");
            const editProject = e.target.closest(".edit-project");
            const editTask = e.target.closest(".item");

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
                handleEditTaskBtn(task, task.dataset.id)
            }
            if (closeProjectView) {
                content.textContent = "";
                renderAllProjectsView();
                return;
            }
            if (projectCard && deleteButton) {
                handleDelete(projectCard);
                return;
            }
            if (projectCard) {
                renderProjectView(projectCard.dataset.id);
                return;
            }
        });
    }

    function init() {
        renderNav()
        renderProjectView("personal");
        bindEvents();
    }

    document.addEventListener("DOMContentLoaded", () => {
        init();
    });
}

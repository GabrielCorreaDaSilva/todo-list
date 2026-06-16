import { createProjectCard, createProjectView, createAllProjectsView, createTaskItem } from "./views.js";
import { createProjectForm, createTaskForm } from "./forms.js";
import { createModal, openModal } from "./modal.js";

export function UIController(service) {

    const content = document.querySelector("#content");
    const nav = document.querySelector("#sidebar-nav");
    const modal = createModal();

    function renderAllProjectsView() {
        const projectList = service.getProjects();
        content.replaceChildren(createAllProjectsView(projectList));
    }
    function renderProjectView(projectId) {
        const project = service.getItem(projectId);
        const items = service.getChildren(projectId);
        content.replaceChildren(createProjectView(project, items));
    }
    function renderNav(viewId = content.querySelector("div").dataset.id) {
        const list = document.createElement("ul");
        list.id = "sidebar"

        const personal = createPersonalBtn();

        const AllProjects = createAllProjectsBtn();

        const projects = createProjectsSection(service.getProjects().slice(0, 5));
        const addProject = createAddProject();

        list.append(personal, AllProjects, projects, addProject);
        nav.replaceChildren(list);
        changeCurrentNavItem(viewId);

        function changeCurrentNavItem(viewId) {
            const buttons = nav.querySelectorAll("button");
            buttons.forEach(button => {
                if (viewId === button.dataset.id) {
                    button.classList.add("current-view");
                } else {
                    button.classList.remove("current-view");
                }
            });

        }

        function createPersonalBtn() {
            const Btn = document.createElement("button");
            Btn.classList.add("open-personal", "current-view");
            Btn.textContent = "My Tasks";
            Btn.dataset.id = "personal";
            Btn.addEventListener("click", (e) => {
                changeCurrentNavItem(e.target.dataset.id);
                renderProjectView(Btn.dataset.id)
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
            Btn.dataset.id = "all projects"
            Btn.addEventListener("click", (e) => {
                changeCurrentNavItem(e.target.dataset.id);
                renderAllProjectsView();
            });
            const li = document.createElement("li");
            li.classList.add("sidebar-item")
            li.append(Btn);
            return li;
        }

        function createAddProject() {
            const Btn = document.createElement("button");
            Btn.classList.add("add-project");
            Btn.textContent = "+ New project";
            Btn.dataset.id = "new project"
            Btn.addEventListener("click", (e) => {
                handleAddProjectBtn();
                renderAllProjectsView();
            });
            const li = document.createElement("li");
            li.classList.add("sidebar-item")
            li.append(Btn);
            return li;
        }

        function createProjectsSection(projects) {
            const projectItem = (project) => {
                const Btn = document.createElement("button");
                Btn.dataset.id = project.id;
                const symbol = document.createElement("p");
                symbol.textContent = "#";
                const text = document.createElement("p");
                text.textContent = project.name;

                Btn.append(symbol, text);
                Btn.addEventListener("click", (e) => {
                    changeCurrentNavItem(e.target.dataset.id);
                    renderProjectView(project.id)
                });
                const li = document.createElement("li");
                li.classList.add("sidebar-item")
                li.append(Btn);
                return li;
            }

            const projectList = document.createElement("ul");
            projectList.classList.add("project-list");

            projects.forEach(project => projectList.append(projectItem(project)));
            return projectList;
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
        renderNav();
    }
    function handleCreateTask(taskData, projectId) {
        const newTask = service.addTask(projectId, taskData);
        const itemList = content.querySelector(".item-list");
        itemList.append(createTaskItem(newTask));
    }
    function handleEditProject(projectId, projectData, projectView) {
        const editedProject = service.editItem(projectId, projectData);
        renderProjectView(editedProject.id);
        renderNav(editedProject.id);
    }
    function handleEditTask(taskData, taskId, taskCard) {
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
        const project = service.getItem(projectId);
        console.log(project)
        openModal(
            createProjectForm({
                ...project,
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

    function handleCheck(item, id = item.dataset.id) {
        service.toggleComplete(id);
        if (item.classList.contains("completed")) {
            item.classList.remove("completed");
        }
        else item.classList.add("completed");
    }

    function bindEvents() {
        content.addEventListener("click", (e) => {
            const deleteButton = e.target.closest(".delete-button");
            const projectCard = e.target.closest(".project-card");
            const item = e.target.closest(".list-item");
            const projectView = e.target.closest(".project-view");
            const addProjectBtn = e.target.closest(".add-project-button");
            const addTaskBtn = e.target.closest(".add-task-button");
            const editProject = e.target.closest(".edit-project");
            const editTask = e.target.closest(".item");
            const checkItem = e.target.closest("#check");

            if (checkItem) {
                handleCheck(item);
                return;
            }
            if (item && deleteButton) {
                handleDelete(item);
                return;
            }
            if (projectCard && deleteButton) {
                handleDelete(projectCard);
                renderNav();
                return;
            }
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
                handleEditTaskBtn(item, item.dataset.id)
            }
            if (projectCard) {
                renderProjectView(projectCard.dataset.id);
                return;
            }
        });
    }

    function init() {
        renderProjectView("personal");
        bindEvents();
        renderNav();
    }

    document.addEventListener("DOMContentLoaded", () => {
        init();
    });
}

import { createProjectCard, createProjectView, createAllProjectsView, createTaskItem, createSection, createTaskView } from "./views.js";
import { createProjectForm, createTaskForm, createCheckListForm, createSectionForm } from "./forms.js";
import { createModal, openModal, confirmModal } from "./modal.js";
import { createHandlers } from "./handlers.js";

export function UIController(service) {

    const content = document.querySelector("#content");
    const nav = document.querySelector("#sidebar-nav");
    const modal = createModal();
    const formModal = createModal();

    const handlers = createHandlers({
        service,
        createTaskForm,
        createProjectForm,
        createCheckListForm,
        renderProjectView,
        renderNav,
        openModal,
        createTaskItem,
        createProjectCard,
        createSection,
        createSectionForm,
        modal: formModal,
    })

    function renderAllProjectsView() {
        const projectList = service.getProjects();
        content.replaceChildren(createAllProjectsView(projectList, {
            ...handlers, handleDelete: (projectCard) => {
                confirmModal(() => {
                    handlers.handleDelete(projectCard);
                    renderNav();
                });
            }

        }));
    }
    function renderProjectView(projectId) {
        const project = service.getItem(projectId);
        const items = service.getChildrenTree(projectId);
        content.replaceChildren(
            createProjectView(
                project,
                items,
                {
                    ...handlers,
                    handleDelete: (item) => {
                        confirmModal(() => handlers.handleDelete(item))
                    }
                }));
    }
    function renderTaskView(taskId) {
        const task = service.getItem(taskId);
        const view = createTaskView(
            task,
            {
                ...handlers,
                handleEditTaskBtn: (taskCard) => handlers.handleEditTaskBtn(
                    taskCard, () => renderTaskView(taskId)),
            });
        openModal(
            view,
            modal
        );
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
                handlers.handleAddProjectBtn();
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

    function bindEvents() {
        content.addEventListener("click", (e) => {
            const clickedProjectCard = e.target.closest(".project-card");
            const clickedItem = e.target.closest(".list-item");
            const projectView = e.target.closest(".project-view");
            if (clickedProjectCard) {
                renderProjectView(clickedProjectCard.dataset.id);
                renderNav(clickedProjectCard.dataset.id)
                return;
            }
            if (clickedItem) {
                renderTaskView(clickedItem.dataset.id);
                return;
            }
        });
    }

    function init() {
        renderProjectView("personal");
        renderNav();
        bindEvents();
    }

    document.addEventListener("DOMContentLoaded", () => {
        init();
    });
}

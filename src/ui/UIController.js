import { createProjectCard, createProjectView, createAllProjectsView, createTaskItem, createTaskView } from "./views.js";
import { createProjectForm, createTaskForm, createCheckListForm } from "./forms.js";
import { createModal, openModal, refreshModal } from "./modal.js";
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
        modal: formModal,
    })

    function renderAllProjectsView() {
        const projectList = service.getProjects();
        content.replaceChildren(createAllProjectsView(projectList));
    }
    function renderProjectView(projectId) {
        const project = service.getItem(projectId);
        const items = service.getChildren(projectId);
        content.replaceChildren(createProjectView(project, items));
    }
    function renderTaskView(taskCard) {
        const taskId = taskCard.dataset.id;
        const task = service.getItem(taskId);
        const view = createTaskView(task,
            {
                handleUpdateNotes: handlers.handleUpdateNotes,
                handleEdit: () => handlers.handleEditTaskBtn(taskCard, (editedCard) => renderTaskView(editedCard)),
                handleAddCheckListItem: (itemList) => handlers.handleAddChecklistBtn(taskId, itemList),
                handleCheck: handlers.handleCheck,
            }
        );
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
        document.addEventListener("click", (e) => {
            const deleteButton = e.target.closest(".delete-button");
            const projectCard = e.target.closest(".project-card");
            const item = e.target.closest(".list-item");
            const projectView = e.target.closest(".project-view");
            const allProjectsView = e.target.closest(".all-projects-view");
            const taskView = e.target.closest(".task-view");
            const addBtn = e.target.closest(".add-item-button");
            const editBtn = e.target.closest(".edit-button");
            const checkItem = e.target.closest("#check");

            if (checkItem && taskView) {
                handlers.handleCompleteCheckListItem(item, taskView);
                return;
            }
            if (checkItem) {
                handlers.handleCheck(item);
                return;
            }
            if (item && deleteButton && taskView) {
                handlers.handleDelete(item, () => service.removeChecklistItem(taskView.dataset.id, item.dataset.id));
                return;
            }
            if (item && deleteButton) {
                handlers.handleDelete(item);
                return;
            }
            if (projectCard && deleteButton) {
                handlers.handleDelete(projectCard);
                renderNav();
                return;
            }
            if (addBtn && allProjectsView) {
                handlers.handleAddProjectBtn();
                return;
            }
            if (addBtn && projectView) {
                handlers.handleAddTaskBtn(projectView.dataset.id);
                return;
            }
            if (editBtn && projectView) {
                handlers.handleEditProjectBtn(projectView);
                return;
            }
            if (projectCard) {
                renderProjectView(projectCard.dataset.id);
                return;
            }
            if (item && projectView) {
                renderTaskView(item);
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

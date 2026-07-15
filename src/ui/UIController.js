import { createProjectCard, createProjectView, createAllProjectsView, createTaskItem, createSection, createTaskView } from "./views.js";
import { createProjectForm, createTaskForm, createCheckListForm, createSectionForm } from "./forms.js";
import { createModal, openModal, confirmModal } from "./modal.js";
import { openCreateItemModal, openEditItemModal } from "./modalHandlers.js";

export function UIController(service) {

    const content = document.querySelector("#content");
    const nav = document.querySelector("#sidebar-nav");
    const modal = createModal();
    const formModal = createModal();

    const UI_STRATEGY = {
        project: {
            create: (data) => createProjectCard(data),
            afterEffect: (id, container) => {
                if (!container) {
                    renderProjectView(id);
                }
                else {
                    renderAllProjectsView();
                }
                renderNav(id);
            },
            updateUI: (editedItem, element) => {
                renderProjectView(editedItem.id);
                renderNav(editedItem.id);
            }
        },
        section: {
            create: (data) => createSection(data),
            updateUI: (editedItem, element) => element.replaceWith(createSection(editedItem))
        },
        task: {
            create: (data) => createTaskItem(data),
            updateUI: (editedItem, card) => {
                renderTaskView(editedItem.id);
                // const card = document.querySelector(`.item-list[data-id="${element.dataset.id}"]`);
                card.replaceWith(createTaskItem(editedItem));
            },

        },
        subtask: {
            create: (data) => createTaskItem(data),
        },
    };

    function createElement(item, container) {
        const config = UI_STRATEGY[item.type];
        if (!config) return;
        config.afterEffect?.(item.id, container);
        container?.append(config.create(item));
    }
    function updateElement(editedItem, element) {
        const config = UI_STRATEGY[editedItem.type];
        config.updateUI?.(editedItem, element);
        config.afterEffect?.(editedItem.id);
    }
    function deleteElement(element) {
        element.classList.add("fade-out");
        setTimeout(() => {
            element.remove();
        }, 300);
    }
    function toggleCheck(item, id = item.dataset.id) {
        service.toggleComplete(id);
        item.classList.toggle("completed");
    }

    const onAdd = (type, container, parentId = container.dataset.id) => {
        openCreateItemModal({
            type,
            modal: formModal,
            onSubmit: (data) => {
                const item = service.addItem({ ...data, parentId });
                createElement(item, container);
            }
        });
    };
    const onEdit = (element, id = element.dataset.id, card) => {
        const data = service.getItem(id);
        openEditItemModal({
            type: data.type,
            data,
            modal: formModal,
            onSubmit: (data) => {
                const editedItem = service.editItem(id, data);
                updateElement(editedItem, element, card);
            }
        });
    };
    const onDelete = (element) => {
        service.removeItem(element.dataset.id);
        deleteElement(element);
        renderNav();
    };
    const onMove = (draggedElement, previousElement, targetContainer) => {
        const draggedElementId = draggedElement.dataset.id;
        const previousElementId = previousElement?.dataset.id || null;
        const containerId = targetContainer.dataset.id;
        service.editChildren(draggedElementId, previousElementId, containerId);
    };
    const withConfirm = (onConfirm) => (...args) => confirmModal(() => onConfirm(...args));

    function renderAllProjectsView() {
        const projectList = service.getProjects();
        content.replaceChildren(createAllProjectsView(projectList, withConfirm(onDelete), onAdd));
    }
    function renderProjectView(projectId) {
        const project = service.getItem(projectId);
        const items = service.getChildrenTree(projectId);
        content.replaceChildren(
            createProjectView(
                project,
                items,
                onAdd,
                onEdit,
                withConfirm(onDelete),
                onMove,
                toggleCheck
            ));
    }
    function renderTaskView(taskId, card) {
        const task = service.getItem(taskId);
        const view = createTaskView(
            task,
            onAdd,
            () => onEdit(card),
            (id, data) => service.editItem(id, data),
            onDelete,
            onMove,
            toggleCheck
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
                const container = document.querySelector(".project-container");
                onAdd("project", container, null);
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
                renderTaskView(clickedItem.dataset.id, clickedItem);
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

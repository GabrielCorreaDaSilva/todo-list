import { th } from "date-fns/locale";

export function createHandlers({
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
    modal,
}) {
    function handleSaveState(draggedElement, previousElement, targetContainer) {
        const draggedElementId = draggedElement.dataset.id;
        const previousElementId = previousElement?.dataset.id || null;
        const containerId = targetContainer.dataset.id
        service.editChildren(draggedElementId, previousElementId, containerId);
    }
    function handleDelete(element, removeElement = () => service.removeItem(element.dataset.id)) {
        element.classList.add("fade-out");
        setTimeout(() => {
            element.remove();
            removeElement();
        }, 300);
    }
    function handleCreateProject(projectData) {
        const newProject = service.addItem(projectData);
        const projectContainer = content.querySelector(".project-container");
        projectContainer.append(createProjectCard(newProject));
        renderNav();
    }
    function handleCreateSection(sectionData, parent) {
        const newSection = service.addItem({ ...sectionData, parentId: parent });
        const container = content.querySelector(".project-view");
        container.append(createSection({
            ...newSection,
            children: service.getChildrenTree(newSection.id)
        }));
    }
    function handleCreateTask(taskData, parent, container) {
        const newTask = service.addItem({ ...taskData, parentId: parent });
        const addBtn = container.lastElementChild;
        addBtn.before(createTaskItem(newTask));
    }
    function handleCreateChecklistItem(data, taskId, container) {
        const newItem = service.addChecklistItem(taskId, data);
        const addBtn = container.lastElementChild;
        addBtn.before(createTaskItem(newItem));
    }

    function handleEditProject(projectId, projectData, projectView) {
        const editedProject = service.editItem(projectId, projectData);
        renderProjectView(editedProject.id);
        renderNav(editedProject.id);
    }
    function handleEditSection(data, sectionId, sectionView) {
        const editedSection = service.editItem(sectionId, data);
        sectionView.replaceWith(createSection({
            ...editedSection,
            children: service.getChildrenTree(editedSection.id)
        }));
    }
    function handleUpdateNotes(taskId, taskData) {
        service.editItem(taskId, taskData);
    }
    function handleEditTask(taskData, taskId, taskCard) {
        const editedTask = service.editItem(taskId, taskData);
        const editedCard = createTaskItem(editedTask);
        taskCard.replaceWith(editedCard);
        return editedCard;
    }
    function handleAddProjectBtn() {
        openModal(
            createProjectForm({
                onSubmit: handleCreateProject
            }),
            modal
        );
    }
    function handleAddTaskBtn(projectId, container) {
        openModal(
            createTaskForm({
                onSubmit: (taskData) => handleCreateTask(taskData, projectId, container)
            },
                projectId),
            modal
        );
    }
    function handleAddChecklistBtn(taskId, itemList) {
        openModal(
            createCheckListForm({
                onSubmit: (taskData) => handleCreateChecklistItem(taskData, taskId, itemList)
            }),
            modal
        );
    }
    function handleAddSectionBtn(projectId) {
        openModal(
            createSectionForm({
                onSubmit: (data) => handleCreateSection(data, projectId)
            }),
            modal
        );
    }
    function handleEditProjectBtn(projectView, projectId = projectView.dataset.id) {
        const project = service.getItem(projectId);
        openModal(
            createProjectForm({
                ...project,
                onSubmit: (projectData) => handleEditProject(projectId, projectData, projectView)
            }),
            modal
        );
    }
    function handleEditSectionBtn(sectionView, sectionId = sectionView.dataset.id) {
        const section = service.getItem(sectionId);
        openModal(
            createSectionForm({
                ...section,
                onSubmit: (data) => handleEditSection(data, sectionId, sectionView)
            }),
            modal
        );
    }
    function handleEditTaskBtn(taskCard, onFinish) {
        const taskId = taskCard.dataset.id;
        const task = service.getItem(taskId);
        openModal(
            createTaskForm({
                ...task,
                onSubmit: (taskData) => {
                    const editedCard = handleEditTask(taskData, taskId, taskCard);
                    onFinish?.(editedCard);
                }
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
    function handleCompleteCheckListItem(item, taskId) {
        const itemId = item.dataset.id;
        service.toggleCheckListItemComplete(taskId, itemId);
        item.classList.add("completed", "fade-out");
        setTimeout(() => item.remove(), 300);
        service.removeChecklistItem(taskId, itemId);
    }
    return {
        handleSaveState,
        handleDelete,
        handleCreateProject,
        handleCreateTask,
        handleCreateChecklistItem,
        handleEditProject,
        handleUpdateNotes,
        handleEditTask,
        handleAddProjectBtn,
        handleAddSectionBtn,
        handleEditSection,
        handleEditSectionBtn,
        handleAddTaskBtn,
        handleAddChecklistBtn,
        handleEditProjectBtn,
        handleEditTaskBtn,
        handleCheck,
        handleCompleteCheckListItem
    };
}
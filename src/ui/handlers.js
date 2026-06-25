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
    modal,
}) {
    function handleDelete(element, removeElement = service.removeItem(element.dataset.id)) {
        element.classList.add("fade-out");
        setTimeout(() => element.remove(), 300);
        removeElement();
    }
    function handleCreateProject(projectData) {
        const newProject = service.addItem(projectData);
        const projectContainer = content.querySelector(".project-container");
        projectContainer.append(createProjectCard(newProject));
        renderNav();
    }
    function handleCreateTask(taskData, projectId) {
        const newTask = service.addItem({ ...taskData, parentId: projectId });
        const itemList = content.querySelector(".item-list");
        itemList.append(createTaskItem(newTask));
    }
    function handleCreateChecklistItem(data, taskId, itemList) {
        const newItem = service.addChecklistItem(taskId, data);
        itemList.append(createTaskItem(newItem));
    }

    function handleEditProject(projectId, projectData, projectView) {
        const editedProject = service.editItem(projectId, projectData);
        renderProjectView(editedProject.id);
        renderNav(editedProject.id);
    }
    function handleUpdateNotes(taskId, taskData) {
        service.editItem(taskId, taskData);
    }
    function handleEditTask(taskData, taskId, taskCard) {
        const editedTask = service.editItem(taskId, taskData);
        const editedCard = createTaskItem(editedTask);
        taskCard.replaceWith(editedCard);
        return editedTask;
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
    function handleAddChecklistBtn(taskId, itemList) {
        const test = document.createElement("div");

        openModal(
            createCheckListForm({
                onSubmit: (taskData) => handleCreateChecklistItem(taskData, taskId, itemList)
            }),
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
    function handleEditTaskBtn(taskCard, onFinish) {
        const taskId = taskCard.dataset.id;
        const task = service.getItem(taskId);
        openModal(
            createTaskForm({
                ...task,
                onSubmit: (taskData) => {
                    const editedTask = handleEditTask(taskData, taskId, taskCard);
                    onFinish?.(editedTask);
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
    function handleCompleteCheckListItem(item, task) {
        const itemId = item.dataset.id;
        const id = task.dataset.id;
        service.toggleCheckListItemComplete(id, itemId);
        item.classList.add("completed", "fade-out");
        setTimeout(() => item.remove(), 300);
        service.removeChecklistItem(id, itemId);
    }
    return {
        handleDelete,
        handleCreateProject,
        handleCreateTask,
        handleCreateChecklistItem,
        handleEditProject,
        handleUpdateNotes,
        handleEditTask,
        handleAddProjectBtn,
        handleAddTaskBtn,
        handleAddChecklistBtn,
        handleEditProjectBtn,
        handleEditTaskBtn,
        handleCheck,
        handleCompleteCheckListItem
    };
}
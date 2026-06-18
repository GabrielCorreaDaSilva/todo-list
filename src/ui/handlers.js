export function createHandlers({
    service,
    createTaskForm,
    createProjectForm,
    renderProjectView,
    renderNav,
    openModal,
    createTaskItem,
    createProjectCard,
    modal,
}) {
    function handleDelete(element) {
        element.classList.add("fade-out");
        setTimeout(() => element.remove(), 300);
        service.removeItem(element.dataset.id);
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
    return {
        handleDelete,
        handleCreateProject,
        handleCreateTask,
        handleEditProject,
        handleEditTask,
        handleAddProjectBtn,
        handleAddTaskBtn,
        handleEditProjectBtn,
        handleEditTaskBtn,
        handleCheck,
    };
}
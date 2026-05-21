export function todoService(todo) {

    const mapProject = (project) => {
        const tasks = project.getTasks();
        return {
            id: project.getId(),
            name: project.getName(),
            tasks: tasks.length,
            duration: tasks.reduce((total, task) => total + task.getDuration(), 0)
        };
    };
    const mapTask = (task) => ({
        id: task.getId(),
        name: task.getName(),
        description: task.getDescription(),
        duration: task.getDuration(),
    });

    return {
        getProjects: () => todo.getProjects().map(mapProject),

        getProject: (id) => {
            const project = todo.getProject(id);
            if (!project) return null;

            return mapProject(project);
        },

        addProject: (data) => {
            const project = todo.addProject(data);

            return mapProject(project);
        },

        removeProject: (id) => {
            const removed = todo.removeProject(id);

            return removed ? mapProject(removed) : null;
        },

        getTasks: (projectId) => {
            const project = todo.getProject(projectId)
            if (!project) return [];

            return project.getTasks().map(mapTask);
        },
        getTask: (projectId, id) => {
            const project = todo.getProject(projectId)
            if (!project) return null;

            const task = project.getTask(id);

            return task ? mapTask(task) : null;
        },
        addTask: (projectId, data) => {
            const project = todo.getProject(projectId);
            if (!project) return null;

            const task = project.addTask(data);

            return mapTask(task);
        },
        removeTask: (projectId, id) => {
            const project = todo.getProject(projectId);
            if (!project) return null;

            const removed = project.removeTask(id);

            return removed ? mapTask(removed) : null;
        },
        editProject: (projectId, data) => {
            const project = todo.getProject(projectId);
            if (!project) return null;
            project.setName(data.name);
            return mapProject(project);
        },
        editTask: (projectId, taskId, data) => {
            const task = todo.getTask(projectId, taskId);
            if (!task) return null;
            task.setName(data.name);
            task.setDescription(data.description);
            task.setDuration(data.duration);
            return mapTask(task);
        },
    }
}
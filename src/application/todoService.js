export function todoService(todo) {

    const getTasks = () => {
        const items = todo.getItems();
        return items.filter(item => item.getType() === "task");
    };

    const mapProject = (project) => {
        const children = todo.getChildren(project.getId());
        const projectDuration = children
            .filter(item => ["task", "subtask"].includes(item.getType()))
            .reduce((total, item) => total + item.getDuration(), 0);
        const remainingTodos = children.filter(item => !item.getStatus())
        return {
            id: project.getId(),
            name: project.getName(),
            remaining: remainingTodos.length,
            duration: projectDuration
        };
    };
    const mapTask = (task) => ({
        id: task.getId(),
        name: task.getName(),
        description: task.getDescription(),
        duration: task.getDuration(),
        type: task.getType()
    });

    const mapItem = (item) => {
        const type = item.getType();
        if (type === "project") return mapProject(item);
        if (type === "task" || type === "subtask") return mapTask(item);
    }

    return {
        addProject: (data) => {
            const project = todo.addProject(data);

            return mapProject(project);
        },

        addTask: (parentId, data) => {
            const task = todo.addTask(parentId, data);

            return mapTask(task);
        },

        getProjects: () => {
            const items = todo.getItems();
            return items.filter(item => item.getType() === "project").map(mapItem);
        },

        getChildren: (parentId, type = null) => todo.getChildren(parentId, type).map(mapItem),

        getItem: (id) => {
            const item = todo.getItem(id);
            if (!item) return null;

            return mapItem(item);
        },

        removeItem: (id) => {
            const removed = todo.removeItem(id);

            return removed ? mapItem(removed) : null;
        },

        editItem: (itemId, data) => {
            const item = todo.getItem(itemId);
            if (!item) return null;
            item.update(data);
            return mapItem(item);
        },
    }
}
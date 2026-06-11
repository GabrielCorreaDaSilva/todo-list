export function createTodo(createProject, createTask) {
    const items = [];

    const personal = createProject({
        type: "system",
        name: "My Tasks",
        id: "personal"
    });

    items.push(personal);

    return {
        getItems: () => [...items],
        getItem: (id) => {
            const result = items.find(item => item.getId() === id);
            return result || null;
        },

        getChildren: (parentId, type = null) => {
            return items.filter(item => item.getParentId?.() === parentId && (type === null || item.getType() === type))
        },

        addProject: (data) => {
            const newProject = createProject(data);
            items.push(newProject);
            return newProject;
        },
        addTask: (parentId, data) => {
            const newTask = createTask(parentId, data);
            items.push(newTask);
            return newTask;
        },
        removeItem: (id) => {
            const index = items.findIndex(item => item.getId() === id);
            if (index >= 0) {
                const [removed] = items.splice(index, 1);
                return removed;
            }

            return null;
        },
    }
}
export function createProject({ name, id = crypto.randomUUID() }, createTask) {
    const tasks = [];

    return {

        getName: () => name,
        setName: (newName) => { name = newName },

        getTasks: () => [...tasks],

        getId: () => id,

        getTask: (id) => {
            const result = tasks.find(task => task.getId() === id);
            return result || null;
        },

        removeTask: (id) => {
            const index = tasks.findIndex(task => task.getId() === id);
            if (index >= 0) {
                const [removed] = tasks.splice(index, 1);
                return removed;
            }
            return null;
        },

        addTask: (data) => {
            const newTask = createTask(data);
            tasks.push(newTask);
            return newTask;
        },
    }

}
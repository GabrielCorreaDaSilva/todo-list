export function createProject({ name, id = crypto.randomUUID() }, createTask) {
    const tasks = [];

    return {

        getName: () => name,
        setName: (newName) => { name = newName },

        getTasks: () => [...tasks],
        getTasksData: () => tasks.map(task => task.getTask()),//to Service

        getId: () => id,

        getTask: (id) => {
            const result = tasks.find(task => task.getId() === id);
            return result || null;
        },
        getTaskData: (id) => {
            const result = tasks.find(task => task.getId() === id).getTask();
            return result || null;
        },// to Service

        removeTask: (id) => {
            const index = tasks.findIndex(task => task.getId() === id);
            if (index >= 0)
                return tasks.splice(index, 1);
            return null;
        },

        addTask: (data) => {
            const newTask = createTask(data);
            tasks.push(newTask);
            return newTask;
        },
    }

}
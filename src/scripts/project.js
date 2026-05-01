export function createProject(name, createTask) {
    const tasks = [];

    return {

        getName: () => name,
        setName: (newName) => { name = newName },

        getTasks: () => tasks.map(task => task.getTask()),

        getTask: (id) => tasks.find(task => task.getId() === id).getTask(),

        removeTask: (id) => {
            const index = tasks.findIndex(task => task.getId() === id);
            if (index >= 0)
                return tasks.splice(index, 1);
        },

        addTask: (data) => {
            const newTask = createTask(data);
            tasks.push(newTask);
            return newTask;
        },
    }

}
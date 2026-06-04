const sampleTasks = [
    {
        name: "a",
        description: "change z",
    },
    {
        name: "b",
        description: "develop x",
    },
    {
        name: "c",
        description: "finish y",
    },
];

const sampleProjects = [{ name: "proj1" }, { name: "proj2" }, { name: "proj3" }, { name: "proj4" }, { name: "proj5" },];

export function injectSampleData(todo) {
    sampleProjects.forEach(projectName => {

        const project = todo.addProject(projectName);

        const shuffledTasks = [...sampleTasks]
            .sort(() => Math.random() - 0.5);
        shuffledTasks.forEach(task => {
            const newTask = { ...task, duration: Math.floor(Math.random() * 50) }
            todo.addTask(project.getId(), newTask);
        });
    });
}

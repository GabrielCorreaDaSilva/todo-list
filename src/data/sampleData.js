const sampleTasks = [
    {
        name: "a",
        description: "change z",
        duration: 15
    },
    {
        name: "b",
        description: "develop x",
        duration: 12
    },
    {
        name: "c",
        description: "finish y",
        duration: 55
    },
];

const sampleProjects = [{ name: "proj1" }, { name: "proj2" }, { name: "proj3" }, { name: "proj4" }, { name: "proj5" },];

export function injectSampleData(todo) {
    sampleProjects.forEach(projectName => {

        const project = todo.addProject(projectName);

        const shuffledTasks = [...sampleTasks]
            .sort(() => Math.random() - 0.5);
        shuffledTasks.forEach(task => {
            project.addTask(task);
        });
    });
}

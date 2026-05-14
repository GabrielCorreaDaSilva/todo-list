const sampleTasks = [
    {
        name: "a",
        description: "change z",
        duration: "15 seconds"
    },
    {
        name: "b",
        description: "develop x",
        duration: "9000 seconds"
    },
    {
        name: "c",
        description: "finish y",
        duration: "2000 seconds"
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

        console.log(project)
    });
}

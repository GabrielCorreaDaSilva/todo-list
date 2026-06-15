import { parseInputToData } from "../utils/date.js";


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

const sampleProjects = [{ name: "proj1" }, { name: "proj2" }, { name: "proj3" }, { name: "proj4" }, { name: "proj5" }, { name: "proj6" }, { name: "proj7" }, { name: "proj8" }, { name: "proj9" },];

export function injectSampleData(todo) {

    const addTask = (project) => {
        const shuffledTasks = [...sampleTasks]
            .sort(() => Math.random() - 0.5);
        shuffledTasks.forEach(task => {
            todo.addTask(project.id, {
                ...task, dueDate: parseInputToData("2026-06-11"), isImportant: true
            });
        });
    }
    const personal = todo.getItem("personal");

    addTask(personal);


    sampleProjects.forEach(projectName => {

        const project = todo.addProject(projectName);

        addTask(project);
    });
}

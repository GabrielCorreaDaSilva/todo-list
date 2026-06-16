import { parseInputToData } from "../utils/date.js";


const sampleTasks = [
    {
        name: "a",
        description: "change z",
        isImportant: true,
        dueDate: Date.now()
    },
    {
        name: "b",
        description: "develop x",
        isImportant: true,
        dueDate: Date.now()
    },
    {
        name: "c",
        description: "finish y",
        isImportant: true,
        dueDate: Date.now()
    },
];

const sampleProjects = [{ name: "proj1" }, { name: "proj2" }, { name: "proj3" }, { name: "proj4" }, { name: "proj5" }, { name: "proj6" }, { name: "proj7" }, { name: "proj8" }, { name: "proj9" },];

export function injectSampleData(todo) {

    const addTask = (project, tasks = [...sampleTasks].sort(() => Math.random() - 0.5)) => {
        tasks.forEach(task => {
            todo.addTask(project.id, {
                ...task
            });
        });
    }
    const personal = todo.getItem("personal");

    addTask(
        personal,
        [
            {
                name: "local storage",
                description: " - ",
            },
            {
                name: "task view",
                description: " - ",
            },
            {
                name: "task view: notes",
                description: " - ",
            },
            {
                name: "task view: checklist",
                description: " - ",
            },
            {
                name: "confirm screen when deleting",
                description: " - ",
            },
            {
                name: "dueDate: Today e Tomorrow",
                description: " - ",
            },]
    );


    sampleProjects.forEach(projectName => {

        const project = todo.addProject(projectName);

        addTask(project);
    });
}

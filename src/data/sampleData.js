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

const sampleProjects = ["proj1", "proj2", "proj3", "proj4", "proj5", "proj6", "proj7", "proj8", "proj9"];

export function injectSampleData(todo) {

    const addTask = (project, tasks = [...sampleTasks].sort(() => Math.random() - 0.5)) => {
        tasks.forEach(task => {
            const newTask = {
                ...task,
                parentId: project.getId(),
                type: "task",
            }
            todo.addItem(newTask);
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

        const project = todo.addItem({ type: "project", name: projectName});

        addTask(project);
    });

}

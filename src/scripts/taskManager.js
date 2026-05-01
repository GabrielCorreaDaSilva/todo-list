import { loadSampleTaskData } from "./sampleData.js";
import { createTask } from "./task.js";
import { createProject } from "./project.js";

export default function start() {
    const newProject = createProject("Hello world", createTask);
    loadSampleTaskData(newProject);
    console.log(newProject.getName());
    console.log(newProject.getTasks());
}




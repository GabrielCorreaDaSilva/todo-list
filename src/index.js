import "./styles/styles.css";
import { createTask } from "./scripts/task.js";
import { createProject } from "./scripts/project.js";
import { createTodo } from "./scripts/todo.js";

import { sampleTasks } from "./scripts/sampleData.js";//testing

const projectFactory = (data) => createProject(data, createTask);

const todo = createTodo(projectFactory);

const project = createProject({ name: "Test" }, createTask);

sampleTasks.forEach(t => project.addTask(t));

console.log(project.getName());
console.log(project.getId());
console.log(project.getTasksData());



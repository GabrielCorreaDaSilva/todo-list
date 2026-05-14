import "./styles/styles.css";
import { createTask } from "./scripts/task.js";
import { createProject } from "./scripts/project.js";
import { createTodo } from "./scripts/todo.js";
import { todoService } from "./scripts/todoService.js";
import { UIController } from "./scripts/UIController.js";

import { injectSampleData } from "./scripts/sampleData.js";//testing

const projectFactory = (data) => createProject(data, createTask);

const todo = createTodo(projectFactory);

injectSampleData(todo)// test 

const service = todoService(todo);

const ui = UIController(service);




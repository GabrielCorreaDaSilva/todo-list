import "./styles/styles.css";
import "./styles/modal.css";
import "./styles/forms.css";
import "./styles/shadows.css";
import { createTask } from "./domain/task.js";
import { createProject } from "./domain/project.js";
import { createTodo } from "./domain/todo.js";
import { todoService } from "./application/todoService.js";
import { UIController } from "./ui/UIController.js";

import { injectSampleData } from "./data/sampleData.js";//testing

const projectFactory = (data) => createProject(data, createTask);

const todo = createTodo(projectFactory);

injectSampleData(todo)// test 

const service = todoService(todo);

const ui = UIController(service);




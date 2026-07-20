import "./styles/index.css";
import { createTask } from "./domain/task.js";
import { createProject } from "./domain/project.js";
import { createSection } from "./domain/section.js";
import { createTodo } from "./domain/todo.js";
import { todoService } from "./application/todoService.js";
import { UIController } from "./ui/UIController.js";
import { storage } from "./data/storage.js";


const todo = createTodo(
    createProject,
    createTask,
    createSection,
);
const service = todoService(todo, storage);

const savedData = storage.load();

if (savedData) {
    todo.import(savedData);
}

UIController(service);


import "./styles/index.css";
import { createTask } from "./domain/task.js";
import { createProject } from "./domain/project.js";
import { createTodo } from "./domain/todo.js";
import { todoService } from "./application/todoService.js";
import { UIController } from "./ui/UIController.js";
import { storage } from "./data/storage.js";
import { injectSampleData } from "./data/sampleData.js";

const todo = createTodo(
    createProject,
    createTask,
);
const service = todoService(todo, storage);

const savedData = storage.load();

if (savedData) {
    todo.import(savedData);
} else {
    injectSampleData(todo);
    storage.save(service.exportData());
}

UIController(service);

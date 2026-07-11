import "./styles/index.css";
import { createTask } from "./domain/task.js";
import { createProject } from "./domain/project.js";
import { createSection } from "./domain/section.js";
import { createTodo } from "./domain/todo.js";
import { todoService } from "./application/todoService.js";
import { UIController } from "./ui/UIController.js";
import { storage } from "./data/storage.js";
import { injectSampleData } from "./data/sampleData.js";

const todo = createTodo(
    createProject,
    createTask,
    createSection,
);
const service = todoService(todo, storage);

const savedData = storage.load();

if (savedData) {
    try {
        todo.import(savedData);
        console.log("Sucessful import");
    }
    catch {
        todo.importOld(savedData);
        console.log("Backup import");
    }
} else {
    injectSampleData(todo);
    storage.save(service.exportData());
}

UIController(service);


import { formatToInputString } from "../utils/date.js";
import { storage } from "../data/storage.js";

export function todoService(todo, storage) {

    const getTasks = () => {
        const items = todo.getItems();
        return items.filter(item => item.getType() === "task");
    };

    const mapProject = (project) => {
        const remainingTodos = todo.getChildren(project.getId()).filter(item => !item.getStatus())
        return {
            id: project.getId(),
            name: project.getName(),
            description: project.getDescription(),
            type: project.getType(),
            remaining: remainingTodos.length,
        };
    };
    const mapTask = (task) => ({
        id: task.getId(),
        name: task.getName(),
        description: task.getDescription(),
        dueDate: task.getDueDate(),
        type: task.getType(),
        isImportant: task.getIsImportant(),
        isCompleted: task.getStatus(),
    });
    const mapItem = (item) => {
        const type = item.getType();
        if (type === "project" || type === "system") return mapProject(item);
        if (type === "task" || type === "subtask") return mapTask(item);
        return "WRONG TYPE";
    }
    const mapItemForStorage = (item) => {
        const itemData = {
            id: item.getId(),
            name: item.getName(),
            description: item.getDescription(),
            type: item.getType(),
        }

        if (itemData.type === "task") {
            if(itemData.dueDate){
                itemData.dueDate = formatToInputString(item.getDueDate())
            }

            return {
                ...itemData,
                parentId: item.getParentId(),
                isImportant: item.getIsImportant(),
                isCompleted: item.getStatus(),
            }
        }
        return itemData;
    }

    const exportData = () => storage.save(todo.getItems().map(mapItemForStorage));

    return {

        exportData,
        addItem: (data) => {
            const item = todo.addItem(data);
            exportData();
            return mapItemForStorage(item);
        },

        getProjects: () => {
            const items = todo.getItems();
            return items.filter(item => ["project"].includes(item.getType())).map(mapItem);
        },

        getChildren: (parentId, type = null) => todo.getChildren(parentId, type).map(mapItem),

        getItem: (id) => {
            const item = todo.getItem(id);
            if (!item) return null;

            return mapItem(item);
        },

        removeItem: (id) => {
            const removed = todo.removeItem(id);
            exportData();
            return removed ? mapItem(removed) : null;
        },

        editItem: (id, data) => {
            const item = todo.getItem(id);
            if (!item) return null;
            item.update(data);
            exportData();
            return mapItem(item);
        },

        toggleComplete: (id) => {
            const item = todo.getItem(id);
            item.toggleComplete();
            exportData();
            return mapItem(item);
        }
    }
}
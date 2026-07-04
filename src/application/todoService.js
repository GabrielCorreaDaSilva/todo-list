import { formatToInputString } from "../utils/date.js";
import { storage } from "../data/storage.js";

export function todoService(todo, storage) {

    function getTasks() {
        const items = todo.getItems();
        return items.filter(item => item.getType() === "task");
    }
    function getTask(id) {
        const item = todo.getItem(id);
        return item?.getType() === "task" ? item : null;
    }

    const mapCheckListItem = (item) => ({
        id: item.getId(),
        name: item.getName(),
    });
    const mapProject = (project) => {
        const remainingTodos = todo.getChildren(project.getId()).filter(item => !item.getStatus?.());
        return {
            id: project.getId(),
            name: project.getName(),
            description: project.getDescription(),
            type: project.getType(),
            remaining: remainingTodos.length || 0,
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
        notes: task.getNotes(),
        checklist: task.getChecklist().map(mapItem),
    });

    const MAPPER_STRATEGY = {
        "task": mapTask,
        "project": mapProject,
        "system": mapProject,
        "checklist": mapCheckListItem,
    };

    const mapItem = (item) => {
        const type = item?.getType();
        const mapper = MAPPER_STRATEGY[type]
        if (!mapper) {
            throw new Error(`Unsupported item type: ${type}`);
        }
        return mapper(item);
    }
    const mapItemForStorage = (item) => {
        const itemData = {
            id: item.getId(),
            name: item.getName(),
            description: item.getDescription(),
            type: item.getType(),
        }

        if (itemData.type === "task") {
            if (item.getDueDate()) {
                itemData.dueDate = formatToInputString(item.getDueDate())
            }

            return {
                ...itemData,
                parentId: item.getParentId(),
                isImportant: item.getIsImportant(),
                isComplete: item.getStatus(),
                notes: item.getNotes(),
                checklist: item.getChecklist().map(mapItem),
            }
        }
        return itemData;
    }
    const exportData = () => {
        return todo.getItems().map(mapItemForStorage);
    }

    const saveData = (data, mapResult = (result) => Array.isArray(result) ? [...result].map(mapItem) : mapItem(result)) => {
        storage.save(exportData());
        return mapResult(data);
    }

    const withItem = (id, callback) => {
        const item = todo.getItem(id);
        if (!item) return null;
        callback?.(item);
        return saveData(item);
    };

    return {

        exportData,
        addItem: (data) => {
            const item = todo.addItem(data);
            return saveData(item);
        },

        getProjects: () => {
            const items = todo.getItems();
            return items.filter(item => ["project"].includes(item.getType())).map(mapItem);
        },

        getChildren: (parentId, type = null) => todo.getChildren(parentId, type).map(mapItem),

        getItem: (id) => todo.getItem(id) ? mapItem(todo.getItem(id)) : null,

        removeItem: (id) => {
            if (id === "personal") return;
            const removed = todo.removeItem(id);
            console.log(mapItem(removed))
            saveData(removed);
        },

        editItem: (id, data) => withItem(id, item => item.update(data)),
        toggleComplete: (id) => withItem(id, item => item.toggleComplete()),
        toggleCheckListItemComplete: (id, itemId) => withItem(id, (task) => task.toggleCompleteChecklistItem(itemId)),
        getChecklist: (id) => task.getChecklist().map(mapItem),
        addChecklistItem: (id, data) => withItem(id, task => task.addChecklistItem(data)),
        removeChecklistItem: (id, itemId) => withItem(id, task => task.removeChecklistItem(itemId)),
        updateChecklistItem: (id, itemId, data) => withItem(id, task => task.updateChecklistItem(itemId, data)),
    }
}
import { formatToInputString } from "../utils/date.js";
import { storage } from "../data/storage.js";

export function todoService(todo, storage) {


    const getTasks = () => {
        const items = todo.getItems();
        return items.filter(item => item.getType() === "task");
    };
    const getTask = (id) => {
        const item = todo.getItem(id);
        return item?.getType() === "task" ? item : null;
    };

    const mapCheckListItem = (item) => ({
        id: item.getId(),
        name: item.getName(),
    });
    const mapProject = (project) => {
        const remainingTodos = todo.getChildren(project.getId()).filter(item => !item.getStatus());
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

    const MAPPER_STRATEGY ={
        "task": mapTask,
        "project":mapProject,
        "system":mapProject,
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

    return {

        exportData,
        addItem: (data) => {
            const item = todo.addItem(data);
            storage.save(exportData());
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
            if (id === "personal") return;

            const children = todo.getChildren(id);
            children.forEach(child => {
                const target = child.getId();
                if (!target) return;
                todo.removeItem(child.getId());
            });
            const removed = todo.removeItem(id);
            storage.save(exportData());
            return removed ? mapItem(removed) : null;
        },

        editItem: (id, data) => {
            const item = todo.getItem(id);
            if (!item) return null;
            item.update(data);
            storage.save(exportData());
            return mapItem(item);
        },
        toggleCheckListItemComplete: (id, itemId) => {
            const task = getTask(id);
            if (!task) return null;
            const item = task.toggleCompleteChecklistItem(itemId);
            storage.save(exportData());
            return mapItem(item);
        },
        toggleComplete: (id) => {
            const item = todo.getItem(id);
            item.toggleComplete();
            storage.save(exportData());
            return mapItem(item);
        },
        getChecklist: (id) => {
            const task = getTask(id);
            if (!task) return null;
            const checklist = task.getChecklist();
            return [...checklist].map(mapItem);
        },
        addChecklistItem: (id, data) => {
            const task = getTask(id);
            if (!task) return null;
            const item = task.addChecklistItem(data)
            storage.save(exportData());
            return mapItem(item);
        },
        removeChecklistItem: (id, itemId) => {
            const task = getTask(id);
            if (!task) return null;
            const item = task.removeChecklistItem(itemId);
            storage.save(exportData());
            return mapItem(item);
        },
        updateChecklistItem: (id, itemId, data) => {
            const task = getTask(id);
            if (!task) return null;
            const item = task.updateChecklistItem(itemId, data);
            storage.save(exportData());
            return mapItem(item);
        },
    }
}
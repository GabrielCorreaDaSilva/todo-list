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
    const mapCheckListItem = (item) => ({
        id: item.getId(),
        name: item.getName(),
    });
    const mapProject = (project) => {
        const remainingTodos = todo.getChildren(project.getId()).filter(item => !item.getStatus?.() && item.getType() === "task");
        return {
            id: project.getId(),
            name: project.getName(),
            description: project.getDescription(),
            type: project.getType(),
            remaining: remainingTodos.length || 0,
        };
    };
    const mapSection = (section) => ({
        id: section.getId(),
        name: section.getName(),
        type: section.getType(),
    })

    const mapRecursive = (node) => {
        const mappedNode = mapItem(node.item);
        mappedNode.children = node.children.map(child =>
            mapRecursive(child)
        );
        return mappedNode;
    }
    const mapRecursiveForStorage = (node) => {
        const mappedNode = mapItemForStorage(node.item);
        mappedNode.children = node.children.map(child =>
            mapRecursiveForStorage(child)
        );
        return mappedNode;
    }

    const MAPPER_STRATEGY = {
        "task": mapTask,
        "project": mapProject,
        "system": mapProject,
        "checklist": mapCheckListItem,
        "section": mapSection,
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
            type: item.getType(),
        }

        if (item.getDescription?.()) {
            itemData.description = item.getDescription();
        }
        if (item.getParentId?.()) {
            itemData.parentId = item.getParentId();
        }
        if (itemData.type === "task") {
            if (item.getDueDate()) {
                itemData.dueDate = formatToInputString(item.getDueDate())
            }

            return {
                ...itemData,
                isImportant: item.getIsImportant(),
                isComplete: item.getStatus(),
                notes: item.getNotes(),
                checklist: item.getChecklist().map(mapItem),
            }
        }
        return itemData;
    }
    const getChildrenTree = (parentId, mapper = mapRecursive) => todo.getChildrenTree(parentId).map(mapper);

    const exportData = () => {
        return todo.getChildrenByParent()
            .filter(({ parentId }) => !(todo.getItem(parentId).getParentId?.()))
            .map(({ parentId }) => ({
                ...mapItemForStorage(todo.getItem(parentId)),
                children: getChildrenTree(parentId, mapRecursiveForStorage),
            }));
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

        getChildren: (parentId) => todo.getChildren(parentId).map(mapItem),

        getChildrenTree,

        getItem: (id) => todo.getItem(id) ? mapItem(todo.getItem(id)) : null,

        removeItem: (id) => {
            if (id === "personal") return;
            const removed = todo.removeItem(id);
            saveData(removed);
        },

        editItem: (id, data) => withItem(id, item => { item.update(data) }),
        toggleComplete: (id) => withItem(id, item => item.toggleComplete()),
        toggleCheckListItemComplete: (id, itemId) => withItem(id, (task) => task.toggleCompleteChecklistItem(itemId)),
        getChecklist: (id) => task.getChecklist().map(mapItem),
        removeChecklistItem: (id, itemId) => withItem(id, task => task.removeChecklistItem(itemId)),
        addChecklistItem: (id, data) => {
            const item = todo.getItem(id);
            if (!item) return null;
            const task = todo.getItem(id);
            const checklistItem = task.addChecklistItem(data);
            return saveData(checklistItem);
        },
        editChildren: (...args) => {
            todo.editChildren(...args, () => {
                storage.save(exportData());
            });
        },

    }
}
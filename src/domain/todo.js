import { storage } from "../data/storage.js";
import { parseInputToDate } from "../utils/date.js";

export function createTodo(createProject, createTask, createSection) {
    const items = [];
    const itemsById = new Map();
    const childrenByParent = new Map();

    function ensurePersonalProject() {
        if (itemsById.has("personal")) return;
        addItem({
            id: "personal",
            type: "system",
            name: "My Tasks",
        });
    }

    const CREATE_STRATEGY = {
        "task": createTask,
        "project": createProject,
        "system": createProject,
        "section": createSection,
    };

    function createItem(data) {
        const type = data.type;
        const create = CREATE_STRATEGY[type]
        if (!create) {
            throw new Error(`Unsupported item type: ${type}`);
        }
        return create(data);
    }
    const getItem = (id) => {
        const result = itemsById.get(id);
        return result || null;
    };
    const addItem = (item) => {
        const newItem = createItem(item);
        itemsById.set(newItem.getId(), newItem);
        if (newItem.getParentId?.()) {
            childrenByParent.has(newItem.getParentId())
                ? childrenByParent.get(newItem.getParentId()).push(newItem.getId())
                : childrenByParent.set(newItem.getParentId(), [newItem.getId()]);
        };
        return newItem;
    }
    const removeItem = (id) => {
        const removed = itemsById.get(id);
        if (!removed) return null;

        childrenByParent.get(id)?.forEach(removeItem);
        childrenByParent.delete(id);

        const parentId = removed.getParentId?.();
        if (parentId) {
            const updatedChildren =
                childrenByParent
                    .get(parentId)
                    .filter(childId => childId !== id);
            childrenByParent.set(parentId, updatedChildren);
        }
        itemsById.delete(id);

        return removed;
    }
    const getChildren = (parentId) => {
        if (!childrenByParent.has(parentId)) return [];
        const children = childrenByParent.get(parentId);
        return children.map(getItem);
    };
    const getChildrenTree = (parentId) => {
        if (!childrenByParent.has(parentId)) return [];
        const childrenIds = childrenByParent.get(parentId);
        return childrenIds.map(childId => {
            const item = getItem(childId);
            const child = { item };
            child.children = getChildrenTree(childId);
            return child;
        });
    }
    return {
        import: (savedData) => {
            ensurePersonalProject();
            savedData.forEach(item => {
                if (item.dueDate) {
                    item = {
                        ...item,
                        dueDate: parseInputToDate(item.dueDate)
                    };
                }
                addItem(item);
            });
        },
        getItemsById: () => itemsById,
        getItems: () => [...itemsById.values()],
        getItem,
        getChildren,
        getChildrenTree,
        addItem,
        removeItem,
    }
}
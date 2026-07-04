import { storage } from "../data/storage.js";
import { parseInputToDate } from "../utils/date.js";

export function createTodo(createProject, createTask) {
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

    function createItem(data) {
        if (data.type === "task") {
            return createTask(data);
        }
        if (data.type === "project" || data.type === "system") {
            return createProject(data);
        }
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
        getChildren: (parentId, type = null) => {
            if (!childrenByParent.has(parentId)) return [];
            const children = childrenByParent.get(parentId);
            return children.map(getItem);
        },
        addItem,
        removeItem: (id) => {
            const removed = itemsById.get(id);
            itemsById.delete(id);
            if (childrenByParent.has(id))
                childrenByParent.delete(id);
            const parentId = removed.getParentId?.();
            if (parentId) {
                const updatedChildren = childrenByParent.get(parentId).filter(id => id !== removed.getId());
                childrenByParent.set(parentId, [updatedChildren]);
            }
            console.log(itemsById.getItem?.(removed.getId()))
            console.log(childrenByParent.getItem?.(removed.getId()))
            return removed;
        },
    }
}
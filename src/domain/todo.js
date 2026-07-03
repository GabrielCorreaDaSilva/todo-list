import { storage } from "../data/storage.js";
import { parseInputToDate } from "../utils/date.js";

export function createTodo(createProject, createTask) {
    const items = [];
    const itemsById = new Map();
    const childrenByParent = new Map();

    function ensurePersonalProject() {
        const hasPersonal = items.some(
            item => item.getId() === "personal"
        );

        if (!hasPersonal) {
            items.unshift(
                createProject({
                    id: "personal",
                    type: "system",
                    name: "My Tasks",
                })
            );
        }
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
        if (item.parentId) {
            childrenByParent.has(item.parentId)
                ? childrenByParent.get(item.parentId).push(item.id)
                : childrenByParent.set(item.parentId, [item.id]);
        };
        return newItem;
    }

    return {

        import: (savedData) => {
            items.length = 0;
            savedData.forEach(item => {
                if (item.dueDate) {
                    item = {
                        ...item,
                        dueDate: parseInputToDate(item.dueDate)
                    };
                }
                addItem(item);
            });
            ensurePersonalProject();
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
            const parentId = removed.getParentId?.();
            if (parentId) {
                const updatedChildren = childrenByParent.get(parentId).filter(id => id !== removed.getId());
                childrenByParent.set(parentId, [updatedChildren]);
            }
        },
    }
}
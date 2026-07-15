import { storage } from "../data/storage.js";
import { parseInputToDate } from "../utils/date.js";

export function createTodo(createProject, createTask, createSection) {
    const items = [];
    const itemsById = new Map();
    const childrenByParent = new Map();

    const initDefault = (item) => {
        const id = item.getId();
        addItem({ parentId: id, id: id + "-default", name: "default", type: "section" });
    }

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
        "subtask": createTask,
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
        if (!item) return;
        if (item.dueDate) item.dueDate = parseInputToDate(item.dueDate);
        const newItem = createItem(item);
        const id = newItem.getId();
        itemsById.set(id, newItem);
        childrenByParent.set(id, [])
        const parentId = newItem.getParentId?.();
        if (parentId) {
            childrenByParent.has(parentId) && !childrenByParent.get(parentId).includes(id)
                ? childrenByParent.get(parentId).push(id)
                : childrenByParent.set(parentId, [id]);
        };
        if (["system", "project"].includes(newItem.getType())) {
            initDefault(newItem);
        }
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
    ensurePersonalProject();
    return {
        importOld: (savedData) => {
            ensurePersonalProject();
            savedData.itemsById.forEach(item => {
                if (item.dueDate) {
                    item = {
                        ...item,
                        dueDate: parseInputToDate(item.dueDate)
                    };
                }
                addItem(item);
            });
            savedData.childrenByParent.forEach(item => {
                const { parentId, children } = item;
                if (parentId && children.length === childrenByParent.get(parentId)?.length)
                    childrenByParent.set(parentId, children);
            });
        },
        import: (savedData) => {
            ensurePersonalProject();
            const recursiveAddItem = (item) => {
                addItem(item);
                item.children?.forEach(recursiveAddItem);
            }
            savedData.forEach(recursiveAddItem);
        },
        getChildrenByParent: () => {
            return Array.from(childrenByParent, ([key, value]) => ({
                parentId: key,
                children: value
            }));
        },
        editChildren: (draggedElementId, previousElementId, containerId, save) => {
            const item = itemsById.get(draggedElementId);
            const parentId = item.getParentId();
            const newChildren = childrenByParent.get(parentId).filter(childId => childId !== draggedElementId);
            childrenByParent.set(parentId, newChildren);

            const newParentChildren = childrenByParent.get(containerId);

            if (previousElementId) {
                const sibling = itemsById.get(previousElementId);
                const newPosition = newParentChildren.findIndex(childId => childId === sibling.getId());
                newParentChildren?.splice(newPosition, 0, draggedElementId)
            } else {
                newParentChildren.unshift(draggedElementId);
            }
            const newParent = itemsById.get(containerId)
            item.update({ parentId: newParent.getId() })
            save();
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
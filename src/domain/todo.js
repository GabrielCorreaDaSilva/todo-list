import { storage } from "../data/storage.js";
import { parseInputToDate } from "../utils/date.js";

export function createTodo(createProject, createTask) {
    const items = [];


    if (!storage.load()) {
        const personal = createProject({
            type: "system",
            name: "My Tasks",
            id: "personal"
        });
        items.push(personal);
    }

    function createItem(data) {
        if (data.type === "task") {
            return createTask(data);
        }
        if (data.type === "project" || data.type === "system") {
            return createProject(data);
        }
    }
    return {

        import: (savedData) => savedData.forEach(item => {
            if (item.dueDate) {
                item = {
                    ...item,
                    dueDate: parseInputToDate(item.dueDate)
                };
            }
            items.push(createItem(item))
        }),
        getItems: () => [...items],
        getItem: (id) => {
            const result = items.find(item => item.getId() === id);
            return result || null;
        },

        getChildren: (parentId, type = null) => {
            return items.filter(item => item.getParentId?.() === parentId && (type === null || item.getType() === type))
        },

        addItem: (data) => {
            const newItem = createItem(data);
            items.push(newItem);
            return newItem;
        },
        removeItem: (id) => {
            const index = items.findIndex(item => item.getId() === id);
            if (index >= 0) {
                const [removed] = items.splice(index, 1);
                return removed;
            }

            return null;
        },
    }
}
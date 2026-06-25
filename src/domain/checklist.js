export function createChecklist() {
    const checklist = [];

    const getItem = (id) => {
        const result = checklist.find(item => item.getId() === id);
        return result || null;
    }

    return {
        getChecklist: () => checklist,
        addItem: (data) => {
            const newItem = createItem(data);
            checklist.push(newItem);
            return newItem;
        },
        getItem,
        editItem: (id, data) => {
            const item = getItem(id);
            if (!item) return null;
            item.update(data);
            return item;
        },
        removeItem: (id) => {
            const index = checklist.findIndex(item => item.getId() === id);
            if (index >= 0) {
                const [removed] = checklist.splice(index, 1);
                return removed;
            }
            return null;
        },
        toggleComplete: (id) => {
            const item = getItem(id);
            if (!item) return null;
            item.toggleComplete();
            return item;
        },
    }
}

function createItem({ name, id = crypto.randomUUID() }, isComplete = false) {
    return {
        setName: (newName) => newName = name,
        getName: () => name,
        getId: () => id,
        getStatus: () => isComplete,
        toggleComplete: () => isComplete = !isComplete,
        update: (data) => {
            if ("name" in data) name = data.name;
            if ("description" in data) description = data.description;
        }
    }
}

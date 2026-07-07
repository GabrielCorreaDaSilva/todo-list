export function createSection({ type = "section", name, id = crypto.randomUUID(), parentId }) {

    return {
        getParentId: () => parentId,
        getName: () => name,
        getId: () => id,
        getType: () => type,
        update: (data) => {
            if ("name" in data) name = data.name;
            if ("parentId" in data) parentId = data.parentId;
        }
    }

}
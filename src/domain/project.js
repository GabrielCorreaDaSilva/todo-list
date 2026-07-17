export function createProject({ parentId, type = "project", name, description, id = crypto.randomUUID() }) {

    return {
        getParentId: () => parentId,
        getName: () => name,
        getDescription: () => description,
        getId: () => id,
        getType: () => type,
        update: (data) => {
            if ("name" in data) name = data.name;
            if ("description" in data) description = data.description;
        }
    }

}
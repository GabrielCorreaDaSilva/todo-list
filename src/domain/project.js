export function createProject({ type = "project", name, description, id = crypto.randomUUID() }) {

    return {
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
export function createProject({ type = "project", name,  description, id = crypto.randomUUID() }) {

    return {
        getName: () => name,
        getDescription: () => description,
        getId: () => id,
        getType: () => type,
        update: (data) => {
            name = data.name;
            description = data.description;
        }
    }

}
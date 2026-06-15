export function createProject({ type = "project", name, id = crypto.randomUUID() }) {

    return {
        getName: () => name,
        getId: () => id,
        getType: () => type,
        update: (data) => {
            name = data.name;
        }
    }

}
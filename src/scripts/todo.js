export function createTodo(createProject) {
    const projects = [];

    return {
        getProjects: () => [...projects],
        getProject: (id) => {
            const result = projects.find(project => project.getId() === id);
            return result || null;
        },

        addProject: (data) => {
            const newProject = createProject(data);
            projects.push(newProject);
            return newProject;
        },
        removeProject: (id) => {
            const index = projects.findIndex(project => project.getId() === id);
            if (index >= 0) {
                const [removed] = projects.splice(index, 1);
                return removed;
            }
                
            return null;
        },
    }
}
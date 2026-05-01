const sampleTasks = [
    {
        name: "start",
        description: "start the project",
        duration: "15 seconds"
    },
    {
        name: "middle",
        description: "develop",
        duration: "9000 seconds"
    },
    {
        name: "end",
        description: "finish the project",
        duration: "2000 seconds"
    },
];


export const loadSampleTaskData = (project) => {
    sampleTasks.forEach(item => {
        project.addTask(item);
    });
};
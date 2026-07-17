export const storage = {
    save: (data) => localStorage.setItem("todo", JSON.stringify(data)),
    // save: (data) => console.log("Saving is temporarily disabled"),

    load: () => {
        const data = localStorage.getItem("todo");
        if (!data || data === "undefined") return;
        return JSON.parse(data);
    },

}
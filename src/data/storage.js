export const storage = {
    save: (data) => localStorage.setItem("todo", JSON.stringify(data)),

    load: () => {
        const data = localStorage.getItem("todo");
        if (!data || data === "undefined") return;
        return JSON.parse(data);
    },

}
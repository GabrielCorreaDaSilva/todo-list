export const storage = {
    save: (data) => localStorage.setItem("todo", JSON.stringify(data)),

    load: () => JSON.parse(localStorage.getItem("todo")),

}
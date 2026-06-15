import { parseInputToData, formatToInputString } from "../utils/date.js";

export function createProjectForm({ name = "", onSubmit } = {}) {
    const form = document.createElement("form");
    form.classList.add("project-form", "form");

    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = name || "New Project";

    const line = document.createElement("hr");
    line.classList.add("line");

    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");

    const nameInput = document.createElement("input");
    Object.assign(nameInput, {
        id: "project-name",
        type: "text",
        name: "name",
        placeholder: "",
        value: name,
        maxlength: 32,
        required: true
    });

    const nameInputLabel = document.createElement("label");
    nameInputLabel.setAttribute("for", "project-name");
    nameInputLabel.textContent = "Project name (Max. 32):";
    nameInputLabel.classList.add("overhead");

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    const confirmBtn = document.createElement("button");
    confirmBtn.classList.add("confirm-button");
    confirmBtn.textContent = "Confirm";
    confirmBtn.type = "submit";

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-button");
    cancelBtn.textContent = "Cancel";

    inputContainer.append(nameInput, nameInputLabel);
    buttonsContainer.append(confirmBtn, cancelBtn);

    form.append(title, line, inputContainer, buttonsContainer);
    bindEvents(form, onSubmit);
    return form;
}
export function createTaskForm({ name = "", description = "", duration = "", dueDate, isImportant = false, onSubmit } = {}) {
    const form = document.createElement("form");
    form.classList.add("task-form", "form");

    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = name || "New Task";

    const line = document.createElement("hr");
    line.classList.add("line");

    const wrapper = document.createElement("div");
    wrapper.classList.add("input-container-wrapper");


    wrapper.append(
        createName(name),
        createDueDate(dueDate),
        createImportant(isImportant),
        createDescription(description),
    );

    form.append(title, line, wrapper, createButtons());
    bindEvents(form, onSubmit);
    return form;

    function createName(name) {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");

        const nameInput = document.createElement("input");
        Object.assign(nameInput, {
            id: "task-name",
            type: "text",
            name: "name",
            placeholder: "",
            value: name,
            maxLength: 32,
            required: true
        });
        const nameInputLabel = document.createElement("label");
        nameInputLabel.setAttribute("for", "task-name");
        nameInputLabel.textContent = "Name (Max. 32):";
        nameInputLabel.classList.add("overhead");

        inputContainer.append(nameInput, nameInputLabel);
        return inputContainer;
    }
    function createDescription(description) {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");

        const descriptionInput = document.createElement("textarea");
        Object.assign(descriptionInput, {
            id: "task-description",
            name: "description",
            placeholder: "",
            maxLength: 80,
            required: true
        });
        descriptionInput.value = description;

        const descriptionInputLabel = document.createElement("label");
        descriptionInputLabel.setAttribute("for", "task-description");
        descriptionInputLabel.textContent = "Task description: ";
        descriptionInputLabel.classList.add("overhead");

        inputContainer.append(descriptionInput, descriptionInputLabel);
        return inputContainer;
    }
    function createDueDate(dueDate) {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");

        const dateInput = document.createElement("input");
        Object.assign(dateInput, {
            id: "due-date",
            type: "date",
            name: "dueDate",
            value: dueDate
                ? formatToInputString(dueDate)
                : "",
        });
        const dateInputLabel = document.createElement("label");
        dateInputLabel.setAttribute("for", "due-date");
        dateInputLabel.textContent = "Date:";
        dateInputLabel.classList.add("overhead");

        inputContainer.append(dateInput, dateInputLabel);
        return inputContainer;
    }
    function createImportant(isImportant) {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");

        const IsImportantInput = document.createElement("input");
        Object.assign(IsImportantInput, {
            id: "is-important-checkbox",
            type: "checkbox",
            name: "isImportant",
            checked: isImportant,
        });
        const IsImportantInputLabel = document.createElement("label");
        IsImportantInputLabel.setAttribute("for", "is-important-checkbox");
        IsImportantInputLabel.textContent = "Important: ";
        IsImportantInputLabel.classList.add("is-important-label");

        inputContainer.append(IsImportantInputLabel, IsImportantInput);
        return inputContainer;
    }
}

function createButtons() {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    const confirmBtn = document.createElement("button");
    confirmBtn.classList.add("confirm-button");
    confirmBtn.textContent = "Confirm";
    confirmBtn.type = "submit";

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.type = "button";

    buttonsContainer.append(confirmBtn, cancelBtn);
    return buttonsContainer;
}

function bindEvents(form, onSubmit) {
    form.addEventListener("submit", (e) => {

        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;

        }
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.isImportant = data.isImportant === "on";
        if (data.dueDate) {
            data.dueDate = parseInputToData(data.dueDate);
        }
        onSubmit(data);
    });
}
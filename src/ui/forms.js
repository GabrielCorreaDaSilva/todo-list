export function createProjectForm({ name = "" , onSubmit} = {}) {
    const form = document.createElement("form");
    form.classList.add("project-form");

    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");

    const nameInput = document.createElement("input");
    Object.assign(nameInput, {
        id: "project-name",
        type: "text",
        name: "name",
        value: name,
        placeholder: "Name (Max. 32)",
        size: 32,
        required: true
    });

    const nameInputLabel = document.createElement("label");
    nameInputLabel.setAttribute("for", "project-name");
    nameInputLabel.textContent = "Project name: ";

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

    form.append(inputContainer, buttonsContainer);
    bindEvents(form, onSubmit);
    return form;
}
export function createTaskForm({ name = "", description = "", duration = "" , onSubmit} = {}) {
    const form = document.createElement("form");
    form.classList.add("task-form");

    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");

    const nameInputLabel = document.createElement("label");
    nameInputLabel.setAttribute("for", "task-name");
    nameInputLabel.textContent = "Task name: ";

    const nameInput = document.createElement("input");
    Object.assign(nameInput, {
        id: "task-name",
        type: "text",
        name: "name",
        value: name,
        placeholder: "Name (Max. 32)",
        size: 32,
        required: true
    });

    const descriptionInputLabel = document.createElement("label");
    descriptionInputLabel.setAttribute("for", "task-description");
    descriptionInputLabel.textContent = "Task description: ";

    const descriptionInput = document.createElement("textarea");
    Object.assign(descriptionInput, {
        id: "task-description",
        name: "description",
        placeholder: "Description...",
        size: 128,
        required: true
    });
    descriptionInput.textContent = description;

    const durationInputLabel = document.createElement("label");
    durationInputLabel.setAttribute("for", "task-duration");
    durationInputLabel.textContent = "Task duration: ";

    const durationInput = document.createElement("input");
    Object.assign(durationInput, {
        id: "task-duration",
        name: "duration",
        value: duration,
        type: "number",
        placeholder: "Duration...",
        max: 128,
        required: true
    });

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    const confirmBtn = document.createElement("button");
    confirmBtn.classList.add("confirm-button");
    confirmBtn.textContent = "Confirm";
    confirmBtn.type = "submit";

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-button");
    cancelBtn.textContent = "Cancel";

    inputContainer.append(nameInput, nameInputLabel, descriptionInput, descriptionInputLabel, durationInput, descriptionInputLabel);
    buttonsContainer.append(confirmBtn, cancelBtn);

    form.append(inputContainer, buttonsContainer);
    bindEvents(form, onSubmit);
    return form;
}

function bindEvents(form, onSubmit) {
    form.addEventListener("submit", (e) => {

        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;

        }
        const projectId = form.dataset.id;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        onSubmit(data);
    });
}
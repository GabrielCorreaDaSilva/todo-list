export function createProjectForm({ name = "", onSubmit } = {}) {
    const form = document.createElement("form");
    form.classList.add("project-form");

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
export function createTaskForm({ name = "", description = "", duration = "", onSubmit } = {}) {
    const form = document.createElement("form");
    form.classList.add("task-form");

    const wrapper = document.createElement("div");
    wrapper.classList.add("input-container-wrapper");

    const nameContainer = createName(name);
    const descriptionContainer = createDescription(description);
    const durationContainer = createDuration(duration);
    const buttonsContainer = createButtons();
    wrapper.append(nameContainer, durationContainer, descriptionContainer);

    form.append(wrapper, buttonsContainer);
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

        inputContainer.append(nameInput, nameInputLabel);
        return inputContainer;
    }
    function createDuration(duration) {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");

        const durationInput = document.createElement("input");
        Object.assign(durationInput, {
            id: "task-duration",
            name: "duration",
            value: duration,
            type: "number",
            placeholder: "",
            max: 128,
            required: true
        });

        const durationInputLabel = document.createElement("label");
        durationInputLabel.setAttribute("for", "task-duration");
        durationInputLabel.textContent = "Duration: ";
        inputContainer.append(durationInput, durationInputLabel);
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

        inputContainer.append(descriptionInput, descriptionInputLabel);
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
        const projectId = form.dataset.id;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        onSubmit(data);
    });
}
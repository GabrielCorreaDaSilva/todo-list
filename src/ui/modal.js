export function createModal({
    onProjectSubmit,
    onTaskSubmit
}) {
    const body = document.querySelector("body");
    const modal = document.createElement("dialog");
    bindEvents(modal, onProjectSubmit, onTaskSubmit);
    body.append(modal);
    return modal;
}

export function handleAddBtn(form, modal) {
    modal.replaceChildren(form);
    modal.showModal();
}

function bindEvents(modal, onProjectSubmit, onTaskSubmit) {
    modal.addEventListener("click", (e) => {
        const cancelBtn = e.target.closest(".cancel-button");

        if (cancelBtn) {
            modal.close();
            return;
        }

    });
    modal.addEventListener("submit", (e) => {
        const isProjectForm = e.target.classList.contains("project-form");
        const isTaskForm = e.target.classList.contains("task-form");

        e.preventDefault();
        const form = e.target;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;

        }
        const projectId = form.dataset.id;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (isProjectForm) {
            onProjectSubmit(data);
        }
        if (isTaskForm) {
            onTaskSubmit(data, projectId);
        }
        modal.close();
        return;
    });
}
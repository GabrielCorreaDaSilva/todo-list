export function createModal() {
    const body = document.querySelector("body");
    const modal = document.createElement("dialog");
    bindEvents(modal);
    body.append(modal);
    return modal;
}

export function openModal(form, modal) {
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
        modal.close();
    });
}
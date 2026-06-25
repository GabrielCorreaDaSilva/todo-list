export function createModal() {
    const body = document.querySelector("body");
    const modal = document.createElement("dialog");
    modal.classList.add("modal");
    bindEvents(modal);
    body.append(modal);
    return modal;
}

export function openModal( view, modal ) {
    modal.replaceChildren(view);
    const closeModalBtn = document.createElement("button");
    closeModalBtn.textContent = "x"
    closeModalBtn.classList.add("close-modal");
    modal.append(closeModalBtn);
    modal.showModal();
}

function bindEvents(modal) {
    modal.addEventListener("click", (e) => {
        const cancelBtn = e.target.closest(".cancel-button") || e.target.closest(".close-modal");
        if (cancelBtn) {
            modal.close();
            return;
        }
    });
    modal.addEventListener("submit", (e) => {
        modal.close();
    });
}
const areYouSureModal = createModal();
areYouSureModal.classList.add("confirm-modal");

export function createModal() {
    const body = document.querySelector("body");
    const modal = document.createElement("dialog");
    modal.classList.add("modal");
    bindEvents(modal);
    body.append(modal);
    return modal;
}

export function openModal(view, modal) {
    modal.replaceChildren(view);
    const closeModalBtn = createClose();
    modal.append(closeModalBtn);
    modal.showModal();
}

export function confirmModal(execute) {
    const view = document.createElement("div");
    const buttons = () => {
        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("buttons-container");

        const confirmBtn = document.createElement("button");
        confirmBtn.classList.add("confirm-button");
        confirmBtn.textContent = "Confirm";
        confirmBtn.type = "Yes";

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancel-button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.type = "No";

        buttonsContainer.append(confirmBtn, cancelBtn);
        return buttonsContainer;

    }

    const closeModalBtn = createClose();

    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = "Are you sure?"
    const line = document.createElement("hr");
    line.classList.add("line");

    view.addEventListener("click", (e) => {
        const clickedConfirm = e.target.closest(".confirm-button");
        if (clickedConfirm) {
            execute();
            areYouSureModal.close();
            return;
        }
    });

    view.append(closeModalBtn, title, line, buttons());
    bindEvents(areYouSureModal);
    areYouSureModal.replaceChildren(view);
    areYouSureModal.showModal();
}

function bindEvents(modal) {
    modal.addEventListener("click", (e) => {
        const clickedCancel = e.target.closest(".cancel-button") || e.target.closest(".close-modal");
        if (clickedCancel) {
            modal.close();
            return;
        }
    });
    modal.addEventListener("submit", (e) => {
        modal.close();
    });
}

function createClose() {
    const closeModalBtn = document.createElement("button");
    closeModalBtn.textContent = "x";
    closeModalBtn.classList.add("close-modal");
    return closeModalBtn;
}
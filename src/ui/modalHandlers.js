import { openModal } from "./modal.js";
import { createTaskForm, createCheckListForm, createProjectForm, createSectionForm } from "./forms.js";

const FORM_STRATEGY = {
    project: {
        createForm: ({ onSubmit }) => createProjectForm({ onSubmit }),
        editForm: ({ data, onSubmit }) => createProjectForm({ ...data, onSubmit }),
    },
    section: {
        createForm: ({ onSubmit }) => createSectionForm({ onSubmit }),
        editForm: ({ data, onSubmit }) => createSectionForm({ ...data, onSubmit }),
    },
    task: {
        createForm: ({ onSubmit }) => createTaskForm({ onSubmit }),
        editForm: ({ data, onSubmit }) => createTaskForm({ ...data, onSubmit }),
    },
    subtask: {
        createForm: ({ onSubmit }) => createCheckListForm({ onSubmit }),
    },
};

export function openEditItemModal({ type, data, onSubmit, modal },) {
    const config = FORM_STRATEGY[type];
    openModal(
        config.editForm({ data, onSubmit }),
        modal
    );
}
export function openCreateItemModal({ type, onSubmit, modal }) {
    const config = FORM_STRATEGY[type];
    if (!config) return;

    openModal(
        config.createForm({ onSubmit }),
        modal
    );
}

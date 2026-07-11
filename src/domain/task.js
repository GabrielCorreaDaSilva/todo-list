import { createChecklist } from "./checklist.js";
export function createTask({
   type = "task",
   parentId,
   notes = "",
   name,
   description,
   dueDate,
   isImportant,
   isComplete = false,
   id = crypto.randomUUID(),
   checklist,
}) {
   const _checklist = createChecklist();
   if(checklist) {
      checklist.forEach(item => {
         _checklist.addItem(item);
      });
   }

   const getChecklist = () => _checklist.getChecklist();

   const addChecklistItem = (data) => _checklist.addItem(data);
   const removeChecklistItem = (id) => _checklist.removeItem(id);
   const updateChecklistItem = (id, data) => _checklist.updateItem(id, data);
   const toggleCompleteChecklistItem = (id) => _checklist.toggleComplete(id);

   return {
      getParentId: () => parentId,
      setParentId: (newParentId) => {
         parentId = newParentId;
      },
      getId: () => id,
      getName: () => name,
      getDescription: () => description,
      getType: () => type,
      getStatus: () => isComplete,
      toggleComplete: () => isComplete = !isComplete,
      getIsImportant: () => isImportant,
      getDueDate: () => dueDate,
      getNotes: () => notes,
      update: (data) => {
         if ("notes" in data) notes = data.notes;
         if ("name" in data) name = data.name;
         if ("description" in data) description = data.description;
         if ("dueDate" in data) dueDate = data.dueDate;
         if ("isImportant" in data) isImportant = data.isImportant;
         if ("parentId" in data) parentId = data.parentId;
      },
      getChecklist,
      addChecklistItem,
      removeChecklistItem,
      updateChecklistItem,
      toggleCompleteChecklistItem,
   };
}

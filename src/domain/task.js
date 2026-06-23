export function createTask({ type = "task", isComplete = false, parentId = "personal", notes = "", name, description, dueDate, isImportant, id = crypto.randomUUID() }) {

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
      }
   };
}

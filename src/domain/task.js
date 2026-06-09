export function createTask(_parentId, { type = "task", isComplete = false, parentId = _parentId, name, description, dueDate, isImportant, id = crypto.randomUUID() }) {

   return {
      getParentId: () => parentId,
      setParentId: (newParentId) => {
         parentId = newParentId;
      },
      getId: () => id,
      getName: () => name,
      getDescription: () => description,
      getType: () => type,
      getStatus:() => isComplete,
      toggleComplete: () => isComplete = !isComplete,
      getIsImportant: () => isImportant,
      getDueDate: () => dueDate,
      update: (data) => {
         name = data.name;
         description = data.description;
         dueDate = data.dueDate;
         isImportant = data.isImportant;
      }
   };
}

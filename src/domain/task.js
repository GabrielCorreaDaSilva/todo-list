export function createTask(_parentId, { type = "task", isComplete = false, parentId = _parentId, name, description, dueDate, isImportant, id = crypto.randomUUID() }) {

   return {
      getParentId: () => parentId,
      getId: () => id,
      getName: () => name,
      getDescription: () => description,
      getType: () => type,
      getStatus:() => isComplete,
      toggleComplete: () => isComplete = !isComplete,
      toggleImportant: () => !isImportant,
      getIsImportant: () => isImportant,
      getDueDate: () => dueDate,
      update: (data) => {
         name = data.name;
         description = data.description;
         type = data.type;
         parentId = data.parentId;
         dueDate = data.dueDate;
      }
   };
}

export function createTask(_parentId, { type = "task", isComplete = false, parentId = _parentId, name, description, duration, id = crypto.randomUUID() }) {

   return {
      getParentId: () => parentId,
      getId: () => id,
      getName: () => name,
      getDescription: () => description,
      getDuration: () => duration,
      getType: () => type,
      getStatus:() => isComplete,
      toggleComplete: () => isComplete = !isComplete,
      update: (data) => {
         name = data.name;
         description = data.description;
         duration = data.duration;
         type = data.type;
         parentId = data.parentId;
      }
   };
}

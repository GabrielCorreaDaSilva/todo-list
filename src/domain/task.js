export function createTask({ name, description, duration, id = crypto.randomUUID() }) {

   return {
      getId: () => id,
      getName: () => name,
      getDescription: () => description,
      getDuration: () => duration,
      setName: (newName) => { name = newName; },
      setDescription: (newDescription) => { description = newDescription; },
      setDuration: (newDuration) => { duration = newDuration; },
   };
}

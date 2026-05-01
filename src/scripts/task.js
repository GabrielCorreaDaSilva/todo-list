export function createTask({ name, description, duration, id = crypto.randomUUID() }) {

   return {
      getId: () => id,
      getName: () => name,
      getDescription: () => description,
      getDuration: () => duration,
      setName: (newName) => { name = newName; },
      setDescription: (newDescription) => { description = newDescription; },
      setDuration: (newDuration) => { duration = newDuration; },
      getTask: () => {
         return {
            id,
            name,
            description,
            duration
         }
      }
   };
}

// export function createTask({ name = "test", description, duration, id = crypto.randomUUID() } = {}) {
//    this.name = name;
//    this.description = description;
//    this.duration = duration;
//    this.id = id;
// }
import React from 'react'; 

const EliminarTodasLasTareas = ({ toDoTasks, setToDoTasks, setEditIndex, setInputValue }) => {{/*desestructuración de las props que se pasan al componente. 
    En React, las props (propiedades) son los datos que un componente padre envía a un componente hijo.
    
    */}

    
    const eliminarTodasLasTareas = async () => {
        console.log("Eliminando todas las tareas..."); 

        try {
            // Recorremos la lista de tareas ("toDoTasks") y por cada tarea, hacemos una petición para eliminarla de la API.
            const tareasPromises = toDoTasks.map(tarea =>
                fetch(`https://playground.4geeks.com/todo/todos/${tarea.id}`, {
                    method: "DELETE", 
                })
            );
            await Promise.all(tareasPromises); // Espera a que todas las promesas (solicitudes de eliminación) se completen.

            setToDoTasks([]); // Después de eliminar todas las tareas, vaciamos la lista de tareas en el estado.
            setEditIndex(null); // Restablece el índice de edición (por si se estaba editando alguna tarea).
            setInputValue(''); // Limpia el valor del input (caja de texto).

            console.log("Todas las tareas han sido eliminadas exitosamente");
        } catch (error) {
            console.error("Error al eliminar todas las tareas:", error); 
        }
    };

    
    return (
        <button onClick={eliminarTodasLasTareas} className="delete-all">
            Eliminar todas las tareas
        </button>
    );
};


export default EliminarTodasLasTareas;

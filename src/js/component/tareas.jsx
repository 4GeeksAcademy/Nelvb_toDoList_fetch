import React, { useState, useEffect, useRef } from 'react';
import EliminarTodasLasTareas from './eliminarTodasLasTareas';

const Tareas = ({ toDoTasks, setToDoTasks }) => {
    const [inputValue, setInputValue] = useState(''); // Estado para controlar el valor del input.
    const [editIndex, setEditIndex] = useState(null); // Estado para almacenar el índice de la tarea que se está editando.

    const inputRef = useRef(null); // inputRef se utiliza para manejar el input de tareas, permitiendo que el campo de entrada (input) sea enfocado automáticamente cuando se edita una tarea. 

    useEffect(() => {
        cargarTareas(); // Cargar las tareas cuando el componente se monta.
    }, []);

    const cargarTareas = async () => {
        console.log("Cargando tareas desde la API...");
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/Nelvb"); // Petición para obtener las tareas.
            if (response.ok) {
                const data = await response.json(); // Parsear la respuesta en JSON.
                setToDoTasks(data.todos); // Actualizar el estado con las tareas obtenidas.
                //data.todos es el array de tareas que se ha extraído del objeto data que devuelve la API en json
                console.log("Tareas cargadas:", data.todos);
            } else {
                throw new Error("Error al cargar las tareas: " + response.status);
                //throw new Error es una característica básica de JavaScript. Se utiliza para generar (lanzar) una excepción que puede ser manejada con un bloque
            }
        } catch (error) {
            console.error("Error al cargar las tareas:", error); // Manejo de errores.
        }
    };

    const addToDoTask = async (e) => {
        if (e.key === 'Enter') { // Si se presiona la tecla Enter.
            const trimmedValue = inputValue.trim(); // Elimina espacios en blanco al inicio y al final.
            if (trimmedValue === '') { // Si el valor está vacío, muestra una alerta.
                alert('Por favor, escribe una tarea antes de añadirla.');
                return;
            }

            if (editIndex !== null) { // Si se está editando una tarea existente.
                console.log("Actualizando tarea en el índice:", editIndex);
                await actualizarTarea(editIndex, trimmedValue); // Actualiza la tarea.
            } else { // Si se está añadiendo una nueva tarea.
                const newTask = { label: trimmedValue, is_done: false }; // Crear una nueva tarea.
                console.log("Enviando tarea a la API:", trimmedValue);
                try {
                    const response = await fetch("https://playground.4geeks.com/todo/todos/Nelvb", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newTask) // Envía la nueva tarea al servidor.
                    });
                    if (response.ok) {
                        const task = await response.json(); // Añadir la tarea a la lista.
                        setToDoTasks([...toDoTasks, task]);
                        setInputValue(''); // Limpia el input.
                        console.log("Tarea añadida exitosamente:", task);
                    } else {
                        throw new Error("No se pudo añadir la tarea.");
                    }
                } catch (error) {
                    console.error("Error al añadir la tarea:", error);
                }
            }
        }
    };

    const eliminarTarea = async (index) => {
        const tareaId = toDoTasks[index]?.id; // Obtener el ID de la tarea.
        if (!tareaId) { // Si no hay ID, mostrar un error.
            console.error("ID de tarea no encontrado.");
            return;
        }

        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                const newToDoTasks = toDoTasks.filter((_, i) => i !== index); // Filtrar la tarea eliminada.
                setToDoTasks(newToDoTasks);

                if (editIndex === index) {
                    setEditIndex(null); // Restablece el índice de edición si se eliminó la tarea que estaba siendo editada.
                    setInputValue(''); // Limpia el input.
                }
                console.log("Tarea eliminada exitosamente");
            } else {
                throw new Error("No se pudo eliminar la tarea.");
            }
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    };

    const editarTarea = (index) => {
        setEditIndex(index); // Almacena el índice de la tarea que se está editando.
        setInputValue(toDoTasks[index]?.label || ''); // Rellena el input con el texto de la tarea.
        inputRef.current.focus(); // Enfoca el input para que el usuario pueda empezar a escribir.
        //permite acceder a elementos del DOM directamente. En este caso, inputRef es una referencia al campo de entrada (input) 
        console.log("Editando tarea en el índice:", index);
    };
 
    /*
    Esta función intenta verificar si se puede encontrar la tarea que el usuario quiere actualizar,
    Si la tarea no existe o no se puede identificar correctamente (porque no tiene un ID),
    el código muestra un error y detiene el proceso, para que no intente cambiar algo que no está allí.
    
    */
    const actualizarTarea = async (index, newLabel) => {
        const tareaId = toDoTasks[index]?.id; // Obtener el ID de la tarea.
        if (!tareaId) { // Si no hay ID, mostrar un error.
            console.error("ID de tarea no encontrado.");
            return;
        }

        const updatedTask = { ...toDoTasks[index], label: newLabel }; // Crea una copia de la tarea con el nuevo label. `...todoTasks` operador spread
        console.log("Actualizando tarea:", updatedTask);
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedTask) // Envía la tarea actualizada al servidor.
            });
            if (response.ok) {
                const newToDoTasks = [...toDoTasks];
                newToDoTasks[index] = updatedTask; // Actualiza la lista de tareas con la tarea modificada.
                setToDoTasks(newToDoTasks);// Actualiza el estado `toDoTasks` con el nuevo array `newToDoTasks` que ya no incluye la tarea eliminada o ha sido modificado.
                setEditIndex(null); // Restablece el índice de edición para poder seguir trabajando sin que de error
                setInputValue(''); // Limpia el input.
                console.log("Tarea actualizada exitosamente");
            } else {
                throw new Error("No se pudo actualizar la tarea.");
            }
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue); // Actualiza el valor del input.

        if (editIndex !== null) { // Si se está editando una tarea.
            const newToDoTasks = [...toDoTasks];
            if (newToDoTasks[editIndex]) { // Verifica que la tarea existe.
                newToDoTasks[editIndex] = { ...newToDoTasks[editIndex], label: newValue }; // Actualiza el label.
                setToDoTasks(newToDoTasks); // Actualiza la lista de tareas.
                console.log("Tarea editada en tiempo real:", newValue);
            }
        }
    };

    const handleInputClick = () => {
        setInputValue(''); // Limpia el valor del input cuando se hace clic en él.
    };

    return (
        <div className="toDoTask-list tarjeta">
            <input
                type="text"
                placeholder="Añade o edita una tarea"
                value={inputValue} // Valor del input.
                onChange={handleInputChange} // Maneja los cambios en el input.
                onKeyDown={addToDoTask} // Maneja la tecla Enter.
                onClick={handleInputClick} // Limpia el input cuando se hace clic.
                ref={inputRef} // Asigna la referencia al input.
            />
            {toDoTasks.length === 0 ? (
                <p>No hay tareas, añadir tareas</p> // Mensaje cuando no hay tareas.
            ) : (
                toDoTasks.map((task, index) => (
                    <div key={index} className="toDoTask-item">
                        {task?.label || ''} 
                        <div>
                            <button onClick={() => editarTarea(index)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => eliminarTarea(index)}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))
            )}
            {/* Usar el nuevo componente EliminarTodasLasTareas */}
            <EliminarTodasLasTareas
            //Se pasan los props desde EliminarTodasLasTareas
                toDoTasks={toDoTasks}
                setToDoTasks={setToDoTasks}
                setEditIndex={setEditIndex}
                setInputValue={setInputValue}
            />
        </div>
    );
};

export default Tareas;

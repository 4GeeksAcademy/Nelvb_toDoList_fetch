import React, { useState, useEffect, useRef } from 'react';

const Tareas = ({ toDoTasks, setToDoTasks }) => {
    const [inputValue, setInputValue] = useState(''); // Estado para almacenar el valor del input.
    const [editIndex, setEditIndex] = useState(null); // Estado para almacenar el índice de la tarea que se está editando.

    const inputRef = useRef(null); // Referencia para el input, utilizada para mover el foco.

    useEffect(() => {
        cargarTareas(); // Carga las tareas cuando el componente se monta.
    }, []); // La lista vacía como segundo argumento indica que este efecto solo se ejecuta una vez.

    const cargarTareas = async () => {
        console.log("Cargando tareas desde la API...");
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/Nelvb"); // Solicitud para obtener las tareas.
            if (response.ok) {
                const data = await response.json(); // Convierte la respuesta en un objeto JSON.
                setToDoTasks(data.todos); // Actualiza el estado con las tareas obtenidas.
                console.log("Tareas cargadas:", data.todos);
            } else {
                throw new Error("Error al cargar las tareas: " + response.status);
            }
        } catch (error) {
            console.error("Error al cargar las tareas:", error); // Muestra un error en la consola si la solicitud falla.
        }
    };

    const addToDoTask = async (e) => {
        if (e.key === 'Enter') { // Solo procede si la tecla presionada es 'Enter'.
            const trimmedValue = inputValue.trim(); // Elimina espacios en blanco al inicio y al final del texto.
            if (trimmedValue === '') { // Si el input está vacío, muestra una alerta.
                alert('Por favor, escribe una tarea antes de añadirla.');
                return;
            }

            if (editIndex !== null) { // Si se está editando una tarea existente...
                await updateTask(editIndex, trimmedValue); // Actualiza la tarea.
            } else { // Si es una nueva tarea...
                const newTask = { label: trimmedValue, is_done: false }; // Crea un nuevo objeto tarea.
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
                        const task = await response.json(); // Obtiene la tarea creada desde la respuesta.
                        setToDoTasks([...toDoTasks, task]); // Añade la nueva tarea al estado.
                        setInputValue(''); // Limpia el input después de añadir la tarea.
                        console.log("Tarea añadida exitosamente:", task);
                    } else {
                        throw new Error("No se pudo añadir la tarea.");
                    }
                } catch (error) {
                    console.error("Error al añadir la tarea:", error); // Muestra un error en la consola si la solicitud falla.
                }
            }
        }
    };

    const eliminarTarea = async (index) => {
        const tareaId = toDoTasks[index].id; // Obtiene el ID de la tarea a eliminar.
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
                method: "DELETE", // Solicitud para eliminar la tarea.
            });
            if (response.ok) {
                const newToDoTasks = toDoTasks.filter((_, i) => i !== index); // Elimina la tarea del estado.
                setToDoTasks(newToDoTasks); // Actualiza el estado con las tareas restantes.
                console.log("Tarea eliminada exitosamente");
            } else {
                throw new Error("No se pudo eliminar la tarea.");
            }
        } catch (error) {
            console.error("Error al eliminar la tarea:", error); // Muestra un error en la consola si la solicitud falla.
        }
    };

    const eliminarTodasLasTareas = async () => {
        console.log("Eliminando todas las tareas...");
        const eliminarTareaPorId = async (tareaId) => {
            try {
                const response = await fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
                    method: "DELETE", // Solicitud para eliminar cada tarea.
                });
                if (!response.ok) {
                    throw new Error("No se pudo eliminar la tarea con id: " + tareaId);
                }
            } catch (error) {
                console.error("Error al eliminar la tarea:", error); // Muestra un error en la consola si la solicitud falla.
            }
        };

        const tareasPromises = toDoTasks.map(tarea => eliminarTareaPorId(tarea.id)); // Crea una lista de promesas para eliminar todas las tareas.
        await Promise.all(tareasPromises); // Espera a que todas las tareas sean eliminadas.

        setToDoTasks([]); // Limpia la lista de tareas en el estado.
        console.log("Todas las tareas han sido eliminadas exitosamente");
    };

    const editarTarea = (index) => {
        setEditIndex(index); // Establece el índice de la tarea que se va a editar.
        setInputValue(toDoTasks[index].label); // Muestra el texto de la tarea en el input para que pueda ser editado.
        inputRef.current.focus(); // Mueve el foco al input automáticamente.
    };

    const updateTask = async (index, newLabel) => {
        const tareaId = toDoTasks[index].id; // Obtiene el ID de la tarea a actualizar.
        const updatedTask = { ...toDoTasks[index], label: newLabel }; // Crea una nueva tarea con el texto actualizado.
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedTask) // Envía la tarea actualizada al servidor.
            });
            if (response.ok) {
                const newToDoTasks = [...toDoTasks]; // Crea una nueva lista de tareas.
                newToDoTasks[index] = updatedTask; // Reemplaza la tarea vieja con la nueva.
                setToDoTasks(newToDoTasks); // Actualiza el estado con la lista de tareas actualizada.
                setEditIndex(null); // Reinicia el índice de edición.
                setInputValue(''); // Limpia el input después de la edición.
                console.log("Tarea actualizada exitosamente");
            } else {
                throw new Error("No se pudo actualizar la tarea.");
            }
        } catch (error) {
            console.error("Error al actualizar la tarea:", error); // Muestra un error en la consola si la solicitud falla.
        }
    };

    const handleInputClick = () => {
        setInputValue(''); // Limpia el input cuando se hace clic en él.
    };

    return (
        <div className="toDoTask-list tarjeta">
            <input
                type="text"
                placeholder="Añade o edita una tarea"
                value={inputValue} // Valor del input.
                onChange={(e) => setInputValue(e.target.value)} // Actualiza el estado cuando el usuario escribe.
                onKeyDown={addToDoTask} // Llama a addToDoTask cuando se presiona una tecla.
                onClick={handleInputClick} // Limpia el input cuando se hace clic.
                ref={inputRef} // Conecta el input con la referencia para poder mover el foco.
            />
            {toDoTasks.length === 0 ? (
                <p>No hay tareas, añadir tareas</p> // Muestra este mensaje si no hay tareas.
            ) : (
                toDoTasks.map((task, index) => (
                    <div key={index} className="toDoTask-item">
                        {task.label} {/* Muestra el texto de la tarea */}
                        <div>
                            <button onClick={() => editarTarea(index)}> {/* Llama a editarTarea cuando se hace clic en el botón de editar */}
                                <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => eliminarTarea(index)}> {/* Llama a eliminarTarea cuando se hace clic en el botón de eliminar */}
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))
            )}
            <button onClick={eliminarTodasLasTareas} className="delete-all">
                Eliminar todas las tareas {/* Llama a eliminarTodasLasTareas cuando se hace clic en este botón */}
            </button>
        </div>
    );
};

export default Tareas;

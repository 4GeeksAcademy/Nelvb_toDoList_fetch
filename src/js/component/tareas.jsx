import React, { useState, useEffect } from 'react';

const Tareas = ({ toDoTasks, setToDoTasks }) => {
    const [inputValue, setInputValue] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        cargarTareas();
    }, []);

    const cargarTareas = async () => {
        console.log("Cargando tareas desde la API...");
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/Nelvb");
            if (!response.ok) {
                if (response.status === 404) {
                    console.log("Usuario no encontrado. Creando usuario...");
                    await crearUsuario();
                } else {
                    throw new Error("Error al cargar las tareas: " + response.status);
                }
            } else {
                const data = await response.json();
                setToDoTasks(data.todos);
                console.log("Tareas cargadas:", data.todos);
            }
        } catch (error) {
            console.error("Error al cargar las tareas:", error);
        }
    };

    const crearUsuario = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/Nelvb", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([])
            });
            if (response.ok) {
                console.log("Usuario creado exitosamente");
                cargarTareas();  // Cargar las tareas después de crear el usuario
            } else {
                throw new Error("No se pudo crear el usuario.");
            }
        } catch (error) {
            console.error("Error al crear el usuario:", error);
        }
    };

    const addToDoTask = async (e) => {
        if (e.key === 'Enter') {
            const trimmedValue = inputValue.trim();
            if (trimmedValue === '') {
                alert('Por favor, escribe una tarea antes de añadirla.');
                return;
            }

            if (editIndex !== null) {
                await updateTask(editIndex, trimmedValue);
            } else {
                const newTask = { label: trimmedValue, is_done: false };
                console.log("Enviando tarea a la API:", trimmedValue);
                try {
                    const response = await fetch("https://playground.4geeks.com/todo/todos/Nelvb", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newTask)
                    });
                    if (response.ok) {
                        const task = await response.json();
                        setToDoTasks([...toDoTasks, task]);
                        setInputValue(''); // Limpia el valor del input.
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
        const tareaId = toDoTasks[index].id;
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                const newToDoTasks = toDoTasks.filter((_, i) => i !== index);
                setToDoTasks(newToDoTasks);
                console.log("Tarea eliminada exitosamente");
            } else {
                throw new Error("No se pudo eliminar la tarea.");
            }
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    };

    const editarTarea = (index) => {
        setEditIndex(index);
        setInputValue(toDoTasks[index].label);
    };

    const updateTask = async (index, newLabel) => {
        const tareaId = toDoTasks[index].id;
        const updatedTask = { ...toDoTasks[index], label: newLabel };
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedTask)
            });
            if (response.ok) {
                const newToDoTasks = [...toDoTasks];
                newToDoTasks[index] = updatedTask;
                setToDoTasks(newToDoTasks);
                setEditIndex(null);
                setInputValue('');  // Limpia el valor del input después de la edición.
                console.log("Tarea actualizada exitosamente");
            } else {
                throw new Error("No se pudo actualizar la tarea.");
            }
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    };

    return (
        <div className="toDoTask-list tarjeta">
            <input
                type="text"
                placeholder="Añade o edita una tarea"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} // Actualiza el estado cuando el usuario escribe.
                onKeyDown={addToDoTask} // Llama a addToDoTask cuando se presiona una tecla.
            />
            {toDoTasks.length === 0 ? (
                <p>No hay tareas, añadir tareas</p>
            ) : (
                toDoTasks.map((task, index) => (
                    <div key={index} className="toDoTask-item">
                        {task.label}
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
        </div>
    );
};

export default Tareas;

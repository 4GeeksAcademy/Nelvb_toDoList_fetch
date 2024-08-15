import { useState, useEffect } from "react";

const Tareas = () => {
    const [toDoTasks, setToDoTasks] = useState([]);
    const [inputValue, setInputValue] = useState('')

    // useEffect que se ejecuta cuando el componente se monta por primera vez
    useEffect(() => {
        // Aquí puedes agregar cualquier lógica que necesites ejecutar cuando el componente se monte
    }, []); // El array vacío significa que el efecto solo se ejecuta una vez cuando el componente se monta

    // Función para agregar una nueva tarea
    const addToDoTask = (task) => {
        setToDoTasks([...toDoTasks, task]); // Agrega la nueva tarea al estado actual
    };

    // Función para eliminar una tarea específica
    const removeToDoTask = (index) => {
        const newToDoTask = toDoTasks.filter((_, i) => i !== index); // Crea una nueva lista filtrando la tarea a eliminar
        setToDoTasks(newToDoTask); // Actualiza el estado con la nueva lista
    };

    // Función para eliminar todas las tareas
    const deleteAllTasks = async () => {
        const response = await fetch('https://playground.4geeks.com/todo/user/Nelvb', {
            method: 'PUT', // Se usa para actualizar
            body: JSON.stringify([]), // Envía una lista vacía al servidor
            headers: {
                'Content-Type': 'application/json' // Indica que el cuerpo de la solicitud es JSON
            }
        });

        if (response.ok) {
            setToDoTasks([]); // Limpiar la lista de tareas si la solicitud fue exitosa
            console.log('Todas las tareas fueron eliminadas');
        } else {
            console.error('Hubo un error al intentar eliminar las tareas');
        }
    };

    // Renderizado del componente
    return (
        <div className='toDoTasks-list tarjeta'>
            <input
                type='text'
                placeholder='Añade una nueva tarea'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} // Actualiza el estado inputValue cuando el usuario escribe
                onKeyDown={(e) => { if ( e.key === 'Enter') addToDoTask(inputValue); }} // Agrega la tarea cuando se presiona Enter
            />
            {toDoTasks.length === 0 ? (
                <p>No hay tareas, añadir tareas</p>
            ) : (
                toDoTasks.map((task, index) => (
                    <div key={index} className="toDoTask-item">
                        {task}
                        <button onClick={() => removeToDoTask(index)}>
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                ))
            )}
            <button onClick={deleteAllTasks}>
                Eliminar todas las tareas
            </button>
        </div>
    );
};

export default Tareas;

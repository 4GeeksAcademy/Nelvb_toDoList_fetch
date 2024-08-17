import React, { useState } from "react";
import Tareas from "./tareas";
import CrearUsuario from "./crearUsuario";

const Home = () => {
    const [usuarioCreado, setUsuarioCreado] = useState(false);
    const [toDoTasks, setToDoTasks] = useState([]);

    return (
        <div className="container">
            <h1>TO DO LIST</h1>
            {!usuarioCreado && <CrearUsuario setUsuarioCreado={setUsuarioCreado} />}
            {usuarioCreado && <Tareas toDoTasks={toDoTasks} setToDoTasks={setToDoTasks} />}
            {usuarioCreado && (
                <p className='contador'>
                    Tengo {toDoTasks.length} {toDoTasks.length === 1 ? 'tarea' : 'tareas'} por realizar.
                </p>
            )}
        </div>
    );
};

export default Home;

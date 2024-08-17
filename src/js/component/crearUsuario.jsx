import React, { useEffect } from "react";

const CrearUsuario = ({ setUsuarioCreado }) => {
    const nombreUsuario = "Nelvb"; // El nombre del usuario a crear

    useEffect(() => {
        verificarOcrearUsuario();
    }, []);

    const verificarOcrearUsuario = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${nombreUsuario}`);
            if (response.ok) {
                console.log("Usuario ya existe.");
                setUsuarioCreado(true);
            } else if (response.status === 404) {
                console.log("Usuario no encontrado. Creando usuario...");
                await crearUsuario();
            } else {
                throw new Error("Error al verificar el usuario: " + response.status);
            }
        } catch (error) {
            console.error("Error en la verificación o creación del usuario:", error);
        }
    };

    const crearUsuario = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${nombreUsuario}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([]) // Se crea el usuario con una lista de tareas vacía
            });
            if (response.ok) {
                console.log("Usuario creado exitosamente.");
                setUsuarioCreado(true);
            } else {
                throw new Error("No se pudo crear el usuario.");
            }
        } catch (error) {
            console.error("Error al crear el usuario:", error);
        }
    };

    return null; // Este componente no necesita renderizar nada visible
};

export default CrearUsuario;

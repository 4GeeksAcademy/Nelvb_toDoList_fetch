import React, { useEffect } from "react";

// Define el componente CrearUsuario, que recibe una prop llamada setUsuarioCreado
const CrearUsuario = ({ setUsuarioCreado }) => {
    
    const nombreUsuario = "Nelvb";

    // useEffect es un hook que se ejecuta después de que el componente se monta (se renderiza por primera vez)
    // Aquí se usa para verificar o crear un usuario cuando el componente se monta
    useEffect(() => {
        verificarOcrearUsuario(); // Llama a la función para verificar o crear el usuario
    }, []); // El array vacío [] significa que este efecto solo se ejecutará una vez, después del primer renderizado

    // Función que verifica si el usuario ya existe o lo crea si no existe
    const verificarOcrearUsuario = async () => {
        try {
            
            const response = await fetch(`https://playground.4geeks.com/todo/users/${nombreUsuario}`);
            if (response.ok) { 
                console.log("Usuario ya existe."); 
                setUsuarioCreado(true); // Actualiza el estado para indicar que el usuario fue creado o encontrado
            } else if (response.status === 404) { // Si la respuesta es 404, significa que el usuario no existe
                console.log("Usuario no encontrado. Creando usuario..."); 
                await crearUsuario(); // Llama a la función para crear el usuario
            } else { // Si la respuesta es otra cosa (un error diferente)
                throw new Error("Error al verificar el usuario: " + response.status); // Lanza un error con el estado de la respuesta
            }
        } catch (error) { // Si hay un error en el bloque try
            console.error("Error en la verificación o creación del usuario:", error);
        }
    };

    // Función que crea un nuevo usuario si no existe
    const crearUsuario = async () => {
        try {
            
            const response = await fetch(`https://playground.4geeks.com/todo/users/${nombreUsuario}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify([]) // Envía un cuerpo vacío (una lista vacía) como el contenido del nuevo usuario
            });
            if (response.ok) { // Si la respuesta es valida (usuario creado)
                console.log("Usuario creado exitosamente."); 
                setUsuarioCreado(true); // Actualiza el estado para indicar que el usuario fue creado
            } else {
                throw new Error("No se pudo crear el usuario."); // Lanza un error
            }
        } catch (error) { // Si hay un error en el bloque try
            console.error("Error al crear el usuario:", error); 
        }
    };

    // El componente no necesita renderizar nada visible, por lo que retorna null
    return null;
};


export default CrearUsuario;

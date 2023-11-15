require("dotenv").config();


const express = require("express");

const {leerTareas,crearTarea,editarTextoTarea,borrarTarea} = require("./db");

const servidor = express();

servidor.use("/pruebas-api",express.static("./pruebas_api"));


servidor.get("/tareas", async (peticion,respuesta) => {
    let [error, tareas] = await leerTareas();
    
    if (!error) {
        return respuesta.json(tareas);
    }
    


});

servidor.use((error,peticion,respuesta,siguiente) => {
    // cualquier excepción que envíe el sistema (throw) será capturada por este middleware
    console.log(error);
    respuesta.send("...ocurrió un error");
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "recurso no encontrado "});
});





servidor.listen(process.env.PORT);
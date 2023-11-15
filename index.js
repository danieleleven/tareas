require("dotenv").config();


const express = require("express");

const {leerTareas,crearTarea,editarTextoTarea,borrarTarea} = require("./db");

const servidor = express();

servidor.use("/pruebas-api",express.static("./pruebas_api"));


servidor.get("/tareas", async (peticion,respuesta,siguiente) => {
   
    let [error,tareas] = await leerTareas();

    if(error){
        /*return siguiente(error);*/
        return siguiente(2);
    }
    respuesta.json(tareas);

});

servidor.use((error,peticion,respuesta,siguiente) => {
    // cualquier excepción que envíe el sistema (throw) será capturada por este middleware
    switch(error){
        case 1: return respuesta.send("...error en la petición");
        case 2: 
            respuesta.status(500);
            return respuesta.json({ error : "error en el servidor"});
    }
    
    /*console.log(error);
    respuesta.send("...ocurrió un error");*/
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "recurso no encontrado "});
});





servidor.listen(process.env.PORT);
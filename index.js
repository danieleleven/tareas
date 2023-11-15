require("dotenv").config();


const express = require("express");
const {leerTareas,crearTarea,editarTextoTarea,borrarTarea} = require("./db");
const {json} = require("body-parser");

const servidor = express();

servidor.use(json());

servidor.use("/pruebas-api",express.static("./pruebas_api"));


servidor.get("/tareas", async (peticion,respuesta,siguiente) => {
   
    let [error,tareas] = await leerTareas();

    if(error){
        /*return siguiente(error);*/
        return siguiente(2);
    }
    respuesta.json(tareas);

});

servidor.post("/nueva", async (peticion,respuesta,siguiente) => {
    let {tarea} = peticion.body;

    if(!tarea){
        return siguiente(1);
    }
    let [error,id] = await crearTarea(tarea);

    if(error){
        return siguiente(2);
    }

    respuesta.json({ resultado : "ok", id});
});

servidor.use((error,peticion,respuesta,siguiente) => {
    // cualquier excepción que envíe el sistema (throw) será capturada por este middleware
    switch(error){
        case 1: 
            respuesta.status(400);
            return respuesta.json({error : "error en la petición, faltan parametros"});
        case 2: 
            respuesta.status(500);
            return respuesta.json({ error : "error en el servidor"});
        default:
            respuesta.status(400);
            return respuesta.json({error : "error en la petición, objeto JSON mal formado"});
    }
    
    /*console.log(error);
    respuesta.send("...ocurrió un error");*/
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "recurso no encontrado "});
});





servidor.listen(process.env.PORT);
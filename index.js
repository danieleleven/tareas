require("dotenv").config();


const express = require("express");
const {leerTareas,crearTarea,editarTextoTarea,borrarTarea, editarEstadoTarea} = require("./db");
const {json} = require("body-parser");

const servidor = express();

servidor.use(json());

servidor.use("/",express.static("./TODO_front"));

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


servidor.delete("/eliminar/:id([0-9]{1,9})", async (peticion, respuesta,siguiente) => {
    let id = Number(peticion.params.id);
    let [error,count] = await borrarTarea(id);

    if(error){
        return siguiente(2);
    }

    respuesta.json({ resultado : count > 0 ? "ok" : "ko" });
  }); 
  

servidor.put("/actualizar/:accion(1|2)/:id([0-9]{1,9})", async (peticion,respuesta,siguiente) => {
    let accion = Number(peticion.params.accion);
    let id = Number(peticion.params.id);

    switch(accion){
        case 1:
            let {tarea} = peticion.body;
            
            if(!tarea || tarea.trim() == ""){
                return siguiente(1);
            }
            // usamos VAR para evitar conflicto de variables LET y facilitar la legibilidad si se crean estas variables las otras dos no se crearán las del caso dos, ambas variables serán desechadas al terminar la función, no estoy modificando el scope global
            var [error,count] = await editarTextoTarea(id,tarea);

            if(error){
                return siguiente(2);
            }
        
            return respuesta.json({ resultado : count > 0 ? "ok" : "ko" });

        case 2:
            
            // usamos VAR para evitar conflicto de variables LET y facilitar la legibilidad si se crean estas variables las otras dos no se crearán las del caso uno
            var [error,count] = await editarEstadoTarea(id);
            console.log(count)
            if(error){
                return siguiente(2);
            }
        
            return respuesta.json({ resultado : count > 0 ? "ok" : "ko" });

        
    }

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
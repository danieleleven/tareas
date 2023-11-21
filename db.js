//require("dotenv").config();

const postgres = require("postgres");


function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
    });
}

function leerTareas(){
    return new Promise( async callback => {

        let conexion = conectar();

        try{
            let tareas = await conexion `SELECT * FROM tareas`;
            callback([null,tareas]);

        }catch(error){
            callback([error])

        }finally{
            conexion.end();
        }
        
    });
}  





/*
function leerTareas(){                                         // hay que refactorizar pa ra que no retorne callback([null,tareas]); si no que si sale bien que invoque el primero y que si sale mal invocar el segundo. ( hay que revisar promesas). Una vez que hayamos hecho eso ( refactorizado), cuando intentemos leer tareas salgamos por el middleware de "ocurrio un error"
    return new Promise(async callback => {
        let conexion = conectar();

        try{

            let tareas = await conexion `SELECT * FROM pareas`;

           

            callback([null,tareas]);

        }catch(error){

            callback([error]);

        }finally{
            conexion.end();
        }
    });
}
*/



/*leerTareas().then(arrayResultado => {
    console.log(arrayResultado);
}); */


function crearTarea(textoTarea){
    return new Promise(async callback => {
        let conexion = conectar();

        try{

            let [{id}] = await conexion `INSERT INTO tareas (tarea) VALUES (${textoTarea}) RETURNING id`;

            

            callback([null,id]);

        }catch(error){
            
            callback([error]);

        }finally{
            conexion.end();
        }
    });
}

/*
crearTarea("texto de la tarea").then(arrayResultado => {
    console.log(arrayResultado);
}); 
*/

function editarTextoTarea(id,textoTarea){
    return new Promise(async callback => {
        let conexion = conectar();

        try{

            let {count} = await conexion `UPDATE tareas SET tarea = ${textoTarea} WHERE id = ${id}`;

            

            callback([null,count]);

        }catch(error){
            
            callback([error]);

        }finally{
            conexion.end();
        }
    });
}


/* editarTextoTarea(1,"terminar Express").then(arrayResultado => {
    console.log(arrayResultado);
}); */

function editarEstadoTarea(id){
    return new Promise(async callback => {
        let conexion = conectar();

        try{

            let {count} = await conexion `UPDATE tareas SET terminada = NOT terminada WHERE id = ${id}`;

            

            callback([null,count]);

        }catch(error){
            
            callback([error]);

        }finally{
            conexion.end();
        }
    });
}


/*editarEstadoTarea(4).then(arrayResultado => {
    console.log(arrayResultado);
});*/
   

function borrarTarea(id){
    return new Promise(async callback => {
        let conexion = conectar();

        try{

            let {count} = await conexion `DELETE FROM tareas WHERE id = ${id}`;

            

            callback([null,{count}]);

        }catch(error){
            
            callback([error]);

        }finally{
            conexion.end();
        }
    });
}


/* borrarTarea(2).then(arrayResultado => {
    console.log(arrayResultado);
}); */


module.exports = {leerTareas,crearTarea,editarEstadoTarea,editarTextoTarea,borrarTarea};




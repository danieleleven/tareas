const contenedorTareas = document.querySelector(".tareas");
const formulario = document.querySelector("form");
const inputTexto = document.querySelector('form input[type="text"]');


//leer tareas

ajax("/tareas").then(tareas => {
    tareas.sort((a,b) => a.id - b.id); // Esto es para que al darle a guardar se quede la tarea en la posicion que está. Si no estuviese esto, las que se editan pasan a estar al final
    tareas.forEach(({id,tarea,terminada}) => {
        new Tarea(id,tarea,terminada,contenedorTareas);
    });
});


//crear tareas
formulario.addEventListener("submit", evento => {
    evento.preventDefault();


    if(inputTexto.value.trim() != ""){
        return ajax("/nueva","POST", { tarea : inputTexto.value.trim() })
        .then(respuesta => {
            let {id} = respuesta;
            if(id){
                new Tarea(id,inputTexto.value.trim(),false,contenedorTareas);
                return inputTexto.value = "";
            }
            console.log("...error al usuario al momento de crear tarea");
        });
     
    }
    console.log("...error al usuario de validación");

    
});











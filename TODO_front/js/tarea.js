class Tarea{
    constructor(id,textoTarea,estado,contenedor){
        this.id = id;
        this.textoTarea = textoTarea;
        this.editando = false; // esta variable representa un ESTADO interno del componente TAREA
        this.DOM = null;
        this.crearDom(estado,contenedor);
    }
    crearDom(estado,contenedor){
        this.DOM = document.createElement("div");
        this.DOM.className = "tarea";

        // texto tarea

        let textoTarea = document.createElement("h2");
        textoTarea.className = "visible";
        textoTarea.innerHTML = this.textoTarea;


        //editor tarea
        let editorTarea = document.createElement("input");
        editorTarea.setAttribute("type","text");
        editorTarea.value = this.textoTarea;

        //boton editar

        let botonEditar = document.createElement("button");
        botonEditar.className = "boton";
        botonEditar.innerHTML = "editar";

        botonEditar.addEventListener("click", () => {
            this.editarTexto();
        });

      
        //boton borrar

        let botonBorrar = document.createElement("button");
        botonBorrar.className = "boton";
        botonBorrar.innerHTML = "borrar";

        //click en boton borrar, se dispara el método borrarTarea

        botonBorrar.addEventListener("click", () =>{
           this.borrarTarea();
           
        });

        //boton estado

        let botonEstado = document.createElement("button");
        botonEstado.className = `estado ${ estado ? "terminada" : ""}`;
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click", () => {
            this.editarEstado().then(({resultado}) => {
                console.log(resultado)
                if(resultado == "ok"){
                    return botonEstado.classList.toggle("terminada");
                }
                console.log("mostrar error al usuario");
                //botonEstado.classList.toggle("terminada");
            });
            
        });


        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(editorTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);
        contenedor.appendChild(this.DOM);

    }

    async borrarTarea(){
        let {resultado} = await ajax(`/eliminar/${this.id}`,"DELETE");

        if(resultado == "ok"){
            return this.DOM.remove();
        }
        console.log("mostrar error a usuario");
    }
    
    editarEstado(){
        return ajax(`/actualizar/2/${this.id}`,"PUT");
    }

    async editarTexto(){
        if(this.editando){

            let nuevoTexto = this.DOM.children[1].value.trim();// lo que ha escrito el usuario

            if(nuevoTexto != "" && nuevoTexto != this.textoTarea){
                let {resultado} = await ajax(`/actualizar/1/${this.id}`,"PUT", { tarea : nuevoTexto });
                if(resultado == "ok"){
                    return this.textoTarea = nuevoTexto;
                }else{
                    console.log("mostrar error a usuario");
                }
                
            }

            //quitar la clase visible al input
            this.DOM.children[1].classList.remove("visible");
            //input debe recuperar o actualizar su valor
            this.DOM.children[1].value = this.textoTarea;
            //poner la calse visible al h2, actualizar su valor
            this.DOM.children[0].innerHTML = this.textoTarea; // solo sera importante al actualizar
            this.DOM.children[0].classList.add("visible")
            //cambiar el texto del boton
            this.DOM.children[2].innerHTML = "editar";
            this.editando = false;
        }else{
            //quitar la clase visible al h2
            this.DOM.children[0].classList.remove("visible");
            //poner la clase visible al input
            this.DOM.children[1].classList.add("visible");
            //cambiar el texto del boton
            this.DOM.children[2].innerHTML = "guardar";
            this.editando = true;
        }

    }

}
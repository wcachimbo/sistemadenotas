// ===============================
// INICIALIZACIÓN DEL SISTEMA
// ===============================

// Crear admin por defecto si no existe
if (!localStorage.getItem("usuarios")) {
    const usuariosIniciales = [
        {
            usuario: "admin",
            contrasena: "1234",
            rol: "admin",
            nombreCompleto: "Administrador General"
        }
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
}


// ===============================
// LOGIN
// ===============================
document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();

    const rolSeleccionado = document.getElementById("rol").value;
    const usuarioIngresado = document.getElementById("usuario").value;
    const contrasenaIngresada = document.getElementById("contrasena").value;

    if (rolSeleccionado === "") {
        alert("Debes seleccionar un rol");
        return;
    }

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios"));

    const usuarioEncontrado = usuariosGuardados.find(function(u){
        return u.usuario === usuarioIngresado &&
               u.contrasena === contrasenaIngresada &&
               u.rol === rolSeleccionado;
    });

    if(usuarioEncontrado){
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

        if(rolSeleccionado === "admin") window.location.href = "panelAdmin.html";
        else if(rolSeleccionado === "profesor") window.location.href = "panelProfesor.html";
        else if(rolSeleccionado === "estudiante") window.location.href = "panelEstudiante.html";

    } else {
        alert("Usuario, contraseña o rol incorrecto");
    }
});


// ===============================
// PANEL ADMIN
// ===============================
const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

if(usuarioActivo && usuarioActivo.rol === "admin"){

    // Mostrar nombre en bienvenida
    const bienvenida = document.getElementById("bienvenida");
    if(bienvenida){
        bienvenida.textContent = "Bienvenido, " + usuarioActivo.nombreCompleto;
    }

    // Cargar usuarios en tabla
    mostrarUsuarios();

    // Crear usuario
    const formCrear = document.getElementById("formCrearUsuario");
    if(formCrear){
        formCrear.addEventListener("submit", function(event){
            event.preventDefault();

            const nombre = document.getElementById("nombreCompleto").value;
            const usuario = document.getElementById("nuevoUsuario").value;
            const contrasena = document.getElementById("nuevaContrasena").value;
            const rol = document.getElementById("nuevoRol").value;

            if(rol === ""){
                alert("Selecciona un rol válido");
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem("usuarios"));
            usuarios.push({
                nombreCompleto: nombre,
                usuario: usuario,
                contrasena: contrasena,
                rol: rol
            });

            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            alert("Usuario creado correctamente");
            formCrear.reset();
            mostrarUsuarios();
        });
    }
}

// Mostrar usuarios en tabla
function mostrarUsuarios(){
    const tabla = document.getElementById("tablaUsuarios");
    if(!tabla) return;

    tabla.innerHTML = "";

    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    usuarios.forEach(function(u){
        const fila = `
            <tr>
                <td>${u.nombreCompleto}</td>
                <td>${u.usuario}</td>
                <td>${u.rol}</td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}

// Cerrar sesión admin
function cerrarSesion(){
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}


// ===============================
// PANEL PROFESOR (AHORA CON CAMPO PROFESOR)
// ===============================
if(usuarioActivo && usuarioActivo.rol === "profesor"){

    const bienvenidaProfesor = document.getElementById("bienvenidaProfesor");
    if(bienvenidaProfesor){
        bienvenidaProfesor.textContent = "Bienvenido, " + usuarioActivo.nombreCompleto;
    }

    const selectEstudiante = document.getElementById("selectEstudiante");
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const estudiantes = usuarios.filter(u => u.rol === "estudiante");

    estudiantes.forEach(e => {
        const opcion = document.createElement("option");
        opcion.value = e.usuario;
        opcion.textContent = e.nombreCompleto;
        selectEstudiante.appendChild(opcion);
    });

    if(!localStorage.getItem("notas")) localStorage.setItem("notas", JSON.stringify([]));

    mostrarNotasProfesor();

    const formAgregarNota = document.getElementById("formAgregarNota");
    formAgregarNota.addEventListener("submit", function(event){
        event.preventDefault();

        const estudiante = document.getElementById("selectEstudiante").value;
        const materia = document.getElementById("materia").value;
        const nota = parseFloat(document.getElementById("nota").value);

        const notas = JSON.parse(localStorage.getItem("notas"));

        // Guardar nota con referencia al profesor
        notas.push({
            estudiante: estudiante,
            materia: materia,
            nota: nota,
            profesor: usuarioActivo.usuario
        });

        localStorage.setItem("notas", JSON.stringify(notas));

        formAgregarNota.reset();
        mostrarNotasProfesor();
    });
}

function mostrarNotasProfesor(){
    const tabla = document.getElementById("tablaNotas");
    tabla.innerHTML = "";

    const notas = JSON.parse(localStorage.getItem("notas"));

    notas.forEach((n, index) => {
        const fila = document.createElement("tr");

        // Mostrar nombre completo del profesor si está en usuarios
        const usuarios = JSON.parse(localStorage.getItem("usuarios"));
        const profObj = usuarios.find(u => u.usuario === n.profesor);
        const nombreProfesor = profObj ? profObj.nombreCompleto : n.profesor || "Sin profesor";

        fila.innerHTML = `
            <td>${n.estudiante}</td>
            <td>${n.materia}</td>
            <td>${n.nota}</td>
            <td>${nombreProfesor}</td>
            <td>
                <button onclick="editarNota(${index})">Editar</button>
                <button onclick="eliminarNota(${index})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function editarNota(index){
    const notas = JSON.parse(localStorage.getItem("notas"));
    const n = notas[index];

    const nuevoNota = prompt(`Editar nota de ${n.estudiante} en ${n.materia}:`, n.nota);
    if(nuevoNota !== null){
        notas[index].nota = parseFloat(nuevoNota);
        localStorage.setItem("notas", JSON.stringify(notas));
        mostrarNotasProfesor();
    }
}

function eliminarNota(index){
    const notas = JSON.parse(localStorage.getItem("notas"));
    if(confirm("¿Deseas eliminar esta nota?")){
        notas.splice(index, 1);
        localStorage.setItem("notas", JSON.stringify(notas));
        mostrarNotasProfesor();
    }
}

function cerrarSesionProfesor(){
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}


// ===============================
// PANEL ESTUDIANTE (MEJORADO CON FILTROS)
// ===============================
if(usuarioActivo && usuarioActivo.rol === "estudiante"){

    const bienvenidaEstudiante = document.getElementById("bienvenidaEstudiante");
    if(bienvenidaEstudiante){
        bienvenidaEstudiante.textContent = "Bienvenido, " + usuarioActivo.nombreCompleto;
    }

    mostrarNotasEstudiante(); // Mostrar todas al cargar
}

function mostrarNotasEstudiante(filtroMateria = "", filtroProfesor = ""){
    const tabla = document.getElementById("tablaMisNotas");
    const promedioP = document.getElementById("promedio");

    tabla.innerHTML = "";
    let suma = 0;
    let cantidad = 0;

    const notas = JSON.parse(localStorage.getItem("notas"));
    if(!notas) return;

    const usuarios = JSON.parse(localStorage.getItem("usuarios"));

    notas.forEach(n => {
        if(n.estudiante === usuarioActivo.usuario){
            const profesorObj = usuarios.find(u => u.usuario === n.profesor);
            const nombreProfesor = profesorObj ? profesorObj.nombreCompleto : n.profesor || "Sin profesor";

            if((filtroMateria === "" || n.materia.toLowerCase().includes(filtroMateria.toLowerCase())) &&
               (filtroProfesor === "" || nombreProfesor.toLowerCase().includes(filtroProfesor.toLowerCase()))){

                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${n.materia}</td>
                    <td>${n.nota}</td>
                    <td>${nombreProfesor}</td>
                `;
                tabla.appendChild(fila);

                suma += n.nota;
                cantidad++;
            }
        }
    });

    if(cantidad > 0){
        const prom = (suma / cantidad).toFixed(2);
        promedioP.textContent = "Promedio: " + prom;
    } else {
        promedioP.textContent = "No se encontraron notas";
    }
}

function filtrarNotas(){
    const filtroMateria = document.getElementById("buscarMateria").value;
    const filtroProfesor = document.getElementById("buscarProfesor").value;

    mostrarNotasEstudiante(filtroMateria, filtroProfesor);
}

function cerrarSesionEstudiante(){
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("login.html") || window.location.pathname.endsWith("/")) {
        iniciarLogin();
    }

    if (window.location.pathname.includes("lista.html")) {
        cargarUsuarios();

        document.getElementById("btnBuscar").addEventListener("click", function () {
            const filtro = document.getElementById("buscar").value.trim();
            cargarUsuarios(filtro);
        });
    }
});

//  login
function iniciarLogin() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 

        const usuario = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!usuario || !password) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const url = `http://181.111.166.250:8081/tp/login.php?user=${usuario}&pass=${password}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return response.json();
            })
            .then(data => {
                console.log("Respuesta del servidor:", data);

                if (data.respuesta === "OK") {
                    alert(data.mje);
                    window.location.href = "lista.html";
                } else {
                    alert(data.mje);
                }
            })
            .catch(error => {
                console.error("Error en la petición:", error);
                alert("Hubo un problema con la conexión al servidor.");
            });
    });
}

// cargar lista de usuarios
function cargarUsuarios(filtro = "") {
    let url = "http://181.111.166.250:8081/tp/lista.php?action=BUSCAR";
    if (filtro) {
        url += `&usuario=${filtro}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById("tablaUsuarios");
            tabla.innerHTML = ""; // Se limpia la tabla

            if (!Array.isArray(data) || data.length === 0) {
                tabla.innerHTML = "<tr><td colspan='7'>No hay usuarios</td></tr>";
                return;
            }

            data.forEach(usuario => {
                const fila = document.createElement("tr");

                
                if (usuario.bloqueado === "Y") {
                    fila.classList.add("bloqueado");
                } else {
                    fila.classList.add("desbloqueado");
                }

                fila.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.bloqueado}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.nombre}</td>
                    <td>
                        <button class="btn-icon red" onclick="cambiarEstado(${usuario.id}, 'Y')">
                            👎
                        </button>
                    </td>
                    <td>
                        <button class="btn-icon green" onclick="cambiarEstado(${usuario.id}, 'N')">
                            👍
                        </button>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error obteniendo usuarios:", error);
            alert("Error cargando usuarios.");
        });
}

// Función para bloquear/desbloquear usuarios
function cambiarEstado(id, estado) {
    const url = `http://181.111.166.250:8081/tp/lista.php?action=BLOQUEAR&idUser=${id}&estado=${estado}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            alert(data.mje);
            cargarUsuarios(); 
        })
        .catch(error => {
            console.error("Error cambiando estado:", error);
            alert("No se pudo cambiar el estado.");
        });
}

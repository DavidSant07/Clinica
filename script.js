let consultas = [];
let farmacia = [];

let indiceEdicionConsulta = -1;
let indiceEdicionFarmacia = -1;

function registrarConsulta() {
    const nombre = document.getElementById('nombreConsulta').value.trim();
    const dni = document.getElementById('dniConsulta').value.trim();
    const motivo = document.getElementById('motivoConsulta').value.trim();

    if (!validarCampos(nombre, dni, motivo)) return;

    if (indiceEdicionConsulta >= 0) {
        consultas[indiceEdicionConsulta] = { nombre, dni, motivo };
        indiceEdicionConsulta = -1;
        document.querySelector('[onclick="registrarConsulta()"]').textContent = "Registrar Consulta";
    } else {
        consultas.push({ nombre, dni, motivo });
    }

    mostrarConsultas();
    actualizarListaPacientesFarmacia();
    limpiarCampos(['nombreConsulta', 'dniConsulta', 'motivoConsulta']);
}

function editarConsulta(index) {
    const c = consultas[index];
    document.getElementById('nombreConsulta').value = c.nombre;
    document.getElementById('dniConsulta').value = c.dni;
    document.getElementById('motivoConsulta').value = c.motivo;
    indiceEdicionConsulta = index;
    document.querySelector('[onclick="registrarConsulta()"]').textContent = "Actualizar Consulta";
}

function eliminarConsulta(index) {
    const paciente = consultas[index];
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar al paciente ${paciente.nombre}? Esta acción eliminará también su registro en farmacia si existe.`);
    
    if (confirmar) {
        // Eliminar consulta
        consultas.splice(index, 1);
        // Eliminar de la farmacia si existe el mismo paciente
        farmacia = farmacia.filter(f => f.dni !== paciente.dni);
        mostrarConsultas();
        mostrarFarmacia();
        actualizarListaPacientesFarmacia();
    }
}

function registrarFarmacia() {
    const nombre = document.getElementById('nombreFarmacia').value;
    const dni = document.getElementById('dniFarmacia').value.trim();
    const medicamento = document.getElementById('medicamento').value;

    if (!validarCampos(nombre, dni, medicamento)) return;

    if (indiceEdicionFarmacia >= 0) {
        farmacia[indiceEdicionFarmacia] = { nombre, dni, medicamento };
        indiceEdicionFarmacia = -1;
        document.querySelector('[onclick="registrarFarmacia()"]').textContent = "Registrar Entrega";
    } else {
        farmacia.push({ nombre, dni, medicamento });
    }

    mostrarFarmacia();
    limpiarCampos(['nombreFarmacia', 'dniFarmacia', 'medicamento']);
    actualizarListaPacientesFarmacia();
}

function editarFarmacia(index) {
    const f = farmacia[index];
    document.getElementById('nombreFarmacia').value = f.nombre;
    document.getElementById('dniFarmacia').value = f.dni;
    document.getElementById('medicamento').value = f.medicamento;
    indiceEdicionFarmacia = index;
    document.querySelector('[onclick="registrarFarmacia()"]').textContent = "Actualizar Entrega";
}

function eliminarFarmacia(index) {
    const entrega = farmacia[index];
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar la entrega de medicamento para ${entrega.nombre}?`);
    
    if (confirmar) {
        // Eliminar entrega de medicamento
        farmacia.splice(index, 1);
        mostrarFarmacia();
    }
}

function mostrarConsultas() {
    const tabla = document.getElementById('tablaConsulta');
    tabla.innerHTML = '';
    consultas.forEach((c, i) => {
        tabla.innerHTML += `<tr>
            <td>${c.nombre}</td>
            <td>${c.dni}</td>
            <td>${c.motivo}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarConsulta(${i})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarConsulta(${i})">Eliminar</button>
            </td>
        </tr>`;
    });
}

function mostrarFarmacia() {
    const tabla = document.getElementById('tablaFarmacia');
    tabla.innerHTML = '';
    farmacia.forEach((f, i) => {
        tabla.innerHTML += `<tr>
            <td>${f.nombre}</td>
            <td>${f.dni}</td>
            <td>${f.medicamento}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarFarmacia(${i})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarFarmacia(${i})">Eliminar</button>
            </td>
        </tr>`;
    });
}

function validarCampos(nombre, dni, campoExtra) {
    if (nombre === '' || dni === '' || campoExtra === '') {
        alert("Todos los campos son obligatorios.");
        return false;
    }
    if (dni.length !== 8 || isNaN(dni)) {
        alert("DNI inválido. Debe tener 8 dígitos numéricos.");
        return false;
    }
    return true;
}

function limpiarCampos(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (id === 'dniFarmacia') {
            el.value = '';
        } else if (el.tagName === 'SELECT') {
            el.selectedIndex = 0;
        } else {
            el.value = '';
        }
    });
}

function actualizarListaPacientesFarmacia() {
    const select = document.getElementById('nombreFarmacia');
    const nombresUnicos = new Set();
    select.innerHTML = '<option value="">Seleccione un paciente</option>';
    consultas.forEach(c => {
        if (!nombresUnicos.has(c.nombre)) {
            nombresUnicos.add(c.nombre);
            const option = document.createElement('option');
            option.value = c.nombre;
            option.textContent = c.nombre;
            select.appendChild(option);
        }
    });
}

function actualizarDniFarmacia() {
    const nombreSeleccionado = document.getElementById('nombreFarmacia').value;
    const paciente = consultas.find(c => c.nombre === nombreSeleccionado);
    document.getElementById('dniFarmacia').value = paciente ? paciente.dni : '';
}

// Inicializar
mostrarConsultas();
mostrarFarmacia();

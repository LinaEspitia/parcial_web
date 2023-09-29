
let empleadoId = 1; 
let listaEmpleados = [];


function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNac = fechaNac.getMonth();

  if (mesActual < mesNac || (mesActual === mesNac && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }

  return edad;
}
function guardarEmpleado(empleado) {
  empleado.edad = calcularEdad(empleado.fechaNacimiento);
  empleado.id = empleadoId;
  empleadoId++; 


  const departamentoSeleccionado = departments.find(department => department.code === empleado.departamento);
  const municipioSeleccionado = towns.find(town => town.code === empleado.municipio);

  if (departamentoSeleccionado) {
    empleado.departamento = departamentoSeleccionado.name;
  }

  if (municipioSeleccionado) {
    empleado.municipio = municipioSeleccionado.name;
  }

  listaEmpleados.push(empleado); 
}



function actualizarTabla() {
  const tbody = document.getElementById('employee-table-body');
  tbody.innerHTML = ''; 

  listaEmpleados.forEach((empleado) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${empleado.id}</td>
      <td>${empleado.apellidos}</td>
      <td>${empleado.nombres}</td>
      <td>${empleado.departamento}</td>
      <td>${empleado.municipio}</td>
      <td>${empleado.fechaNacimiento}</td>
      <td>${empleado.edad}</td>
      <td>${empleado.salario}</td>
    `;
    tbody.appendChild(fila);
  });
}



const employeeForm = document.getElementById('employee-form');


employeeForm.addEventListener('submit', function (event) {
  event.preventDefault();


  const apellidos = document.getElementById('apellidos').value;
  const nombres = document.getElementById('nombres').value;
  const departamento = document.getElementById('departamento').value;
  const municipio = document.getElementById('municipio').value;
  const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
  const salario = document.getElementById('salario').value;

  const nuevoEmpleado = {
    apellidos,
    nombres,
    departamento,
    municipio,
    fechaNacimiento,
    salario,
  };

  const nuevoEmpleadoId = guardarEmpleado(nuevoEmpleado);
  console.log('Empleado guardado con ID:', nuevoEmpleadoId);

 
  actualizarTabla();


  employeeForm.reset();
});




fetch('./recursos/departments.json')
  .then(response => response.json())
  .then(departments => {

    window.departments = departments;
    // Llena el select de departamentos con los datos cargados
    const departamentoSelect = document.getElementById('departamento');
    departments.forEach(department => {
      const option = document.createElement('option');
      option.value = department.code;
      option.text = department.name;
      departamentoSelect.appendChild(option);
    });
  })
  .catch(error => console.error('Error al cargar departamentos', error));





fetch('./recursos/towns.json')
  .then(response => response.json())
  .then(towns => {
    window.towns = towns;
  })
  .catch(error => console.error('Error al cargar municipios', error));


const departamentoSelect = document.getElementById('departamento');
const municipioSelect = document.getElementById('municipio');

departamentoSelect.addEventListener('change', function () {
  const selectedDepartment = departamentoSelect.value;

  cargarMunicipiosPorDepartamento(selectedDepartment);
});


function cargarMunicipiosPorDepartamento(departmentCode) {

  const municipiosFiltrados = towns.filter(town => town.department === departmentCode);

  municipioSelect.innerHTML = '';


  municipiosFiltrados.forEach(town => {
    const option = document.createElement('option');
    option.value = town.code;
    option.text = town.name;
    municipioSelect.appendChild(option);
  });
}



const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const searchId = parseInt(document.getElementById('search-id').value);

  buscarEmpleadoPorId(searchId);
});



function buscarEmpleadoPorId(id) {

  const empleadoEncontrado = listaEmpleados.find(empleado => empleado.id === id);

  if (empleadoEncontrado) {
   
    alert("Empleado encontrado\n" 
    + "Apellidos: " + empleadoEncontrado.apellidos + "\n"
    + "Nombres: " + empleadoEncontrado.nombres + "\n"
    + "Departamento: " + empleadoEncontrado.departamento + "\n"
    + "Municipio: " + empleadoEncontrado.municipio + "\n"
    + "Fecha de nacimiento: " + empleadoEncontrado.fechaNacimiento + "\n"
    + "Edad: " + empleadoEncontrado.edad + "\n"
    + "Salario: " + empleadoEncontrado.salario + "\n"
    );
  } else {
    alert('Empleado no encontrado');
  }
}
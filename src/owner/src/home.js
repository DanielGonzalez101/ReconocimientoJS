document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Cargar las propiedades desde el backend
    const response = await fetch('http://localhost:3000/properties');
    const properties = await response.json();
    displayProperties(properties);
  } catch (error) {
    console.error("Error al cargar propiedades:", error);
  }
});

// Función para obtener propiedades y mostrarlas en el DOM
async function fetchProperties() {
  try {
    // Solicitud al backend para obtener las propiedades
    const response = await fetch('http://localhost:3000/properties');
    
    if (!response.ok) {
      throw new Error('Error al obtener las propiedades');
    }

    const properties = await response.json();
    displayProperties(properties);
  } catch (error) {
    console.error("Error al cargar propiedades:", error);
    alert("No se pudieron cargar las propiedades.");
  }
}

// Función para mostrar las propiedades en el contenedor
function displayProperties(properties) {
  const container = document.querySelector('#property-list'); // Asegúrate de tener un contenedor con este ID
  container.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas tarjetas

  properties.forEach(property => {
    const statusClass = property.status === "avaible" ? "status available" :
      property.status === "reserved" ? "status reserved" :
        "status occupied";

    const card = `
      <div class="col-md-3">
        <div class="card p-3">
          <p><strong>Nombre:</strong> ${property.property_name}</p>
          <p><strong>Dirección:</strong> ${property.address}</p>
          <p><strong>Tipo:</strong> ${property.property_type}</p>
          ${property.apartment_number ? `<p><strong>Número apartamento:</strong> ${property.apartment_number}</p>` : ""}
          <p><strong>Estado:</strong> <span class="${statusClass}">${property.status.toUpperCase()}</span></p>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', card);
  });
}

// Llama a la función al cargar la página
document.addEventListener("DOMContentLoaded", fetchProperties);

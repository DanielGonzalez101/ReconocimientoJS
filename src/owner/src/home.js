document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('http://localhost:3000/properties');
    const properties = await response.json();

    const cardsContainer = document.querySelector(".row.g-3");

    properties.forEach(property => {
      const statusClass = property.status === "avaible" ? "status available" :
        property.status === "reserved" ? "status reserved" :
          "status occupied";

      const propertyCard = `
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

      cardsContainer.insertAdjacentHTML("beforeend", propertyCard);
    });
  } catch (error) {
    console.error("Error al cargar propiedades:", error);
  }
});

function displayProperties(properties) {
  const container = document.querySelector('.row.g-3');
  container.innerHTML = ''; // Limpia las propiedades existentes antes de renderizar

  properties.forEach(property => {
    const card = `
      <div class="col-md-3">
    <div class="card p-3">
      <p><strong>Nombre:</strong> ${property.property_name}</p>
      <p><strong>Dirección:</strong> ${property.address}</p>
      <p><strong>Tipo:</strong> ${property.property_type}</p>
      ${property.apartment_number ? `<p><strong>Número apartamento:</strong> ${property.apartment_number}</p>` : ""}
      <p><strong>Estado:</strong> <span class="${statusClass}">${property.status.toUpperCase()}</span></p>
      <button class="btn btn-primary btn-sm edit-btn mt-2" data-id="${property.id}">Editar</button>
      <button class="btn btn-danger btn-sm delete-btn mt-2" data-id="${property.id}">Eliminar</button>
    </div>
  </div>
    `;
    container.insertAdjacentHTML('beforeend', card);
  });

  // Añadir eventos a los botones
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', handleEditProperty);
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', handleDeleteProperty);
  });
}

async function handleEditProperty(event) {
  const propertyId = event.target.dataset.id;

  const updatedProperty = {
    address: prompt('Nueva dirección:', ''),
    property_name: prompt('Nuevo nombre de propiedad:', ''),
    property_type: prompt('Nuevo tipo de propiedad (unit/house):', ''),
    status: prompt('Nuevo estado (reserved/occupied/avaible):', ''),
    apartment_number: prompt('Nuevo número de apartamento (opcional):', ''),
    RNT: prompt('Nuevo RNT (opcional):', ''),
    check_in_date: prompt('Nueva fecha de entrada (YYYY-MM-DD):', ''),
    check_out_date: prompt('Nueva fecha de salida (YYYY-MM-DD):', '')
  };

  try {
    const response = await fetch(`http://localhost:3000/properties/${propertyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProperty)
    });

    if (response.ok) {
      alert('Propiedad actualizada exitosamente.');
      location.reload(); // Recargar la página para mostrar los cambios
    } else {
      alert('Error al actualizar la propiedad.');
    }
  } catch (error) {
    console.error('Error al actualizar la propiedad:', error);
  }
}

async function handleDeleteProperty(event) {
  const propertyId = event.target.dataset.id;

  if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) return;

  try {
    const response = await fetch(`http://localhost:3000/properties/${propertyId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Propiedad eliminada exitosamente.');
      location.reload(); // Recargar la página para mostrar los cambios
    } else {
      alert('Error al eliminar la propiedad.');
    }
  } catch (error) {
    console.error('Error al eliminar la propiedad:', error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('http://localhost:3000/properties');
    const properties = await response.json();
    displayProperties(properties);
  } catch (error) {
    console.error("Error al cargar propiedades:", error);
  }
});
function displayProperties(properties) {
  const container = document.querySelector('.row.g-3');
  container.innerHTML = ''; // Limpia las propiedades existentes antes de renderizar

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
          <button class="btn btn-primary btn-sm edit-btn mt-2" data-id="${property.id}">Editar</button>
          <button class="btn btn-danger btn-sm delete-btn mt-2" data-id="${property.id}">Eliminar</button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', card);
  });

  // Agrega eventos de click a botones
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', handleEditProperty);
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', handleDeleteProperty);
  });
}

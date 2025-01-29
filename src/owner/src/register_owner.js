document.querySelector('#owner-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Recopila los datos del formulario
  const formData = {
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    age: document.getElementById('age').value,
    id_number: document.getElementById('id_number').value,
    email: document.getElementById('email').value,
    phone_number: document.getElementById('phone_number').value,
    password: document.getElementById('password').value,
  };

  try {
    // Solicitud para registrar al propietario
    const response = await fetch('http://localhost:3000/register-owner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);

      // Crear el objeto owner con los datos del formulario y el ID generado
      const owner = {
        id: result.id,  // ID devuelto por la base de datos
        ...formData
      };

      console.log('Propietario registrado:', owner);
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    alert('Error al registrar usuario.');
  }
});

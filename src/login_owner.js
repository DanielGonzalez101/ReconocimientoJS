document.querySelector('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/owners/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Guardamos el email en localStorage
      localStorage.setItem('owner_email', data.ownerEmail);
      localStorage.setItem('ownerId', data.ownerId);
      

      alert('Inicio de sesión exitoso', data.ownerEmail);
      window.location.href = './home.html'; // Redireccionar a home
    } else {
      alert(data.error || 'Error en el inicio de sesión');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
  }
});

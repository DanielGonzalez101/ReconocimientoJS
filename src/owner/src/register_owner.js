document.querySelector('#owner-form').addEventListener('submit', async (e) => {
  e.preventDefault();

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
    } else {
      alert(result.error);
    }
  } catch (error) {
    alert('Error al registrar usuario.');
  }
});

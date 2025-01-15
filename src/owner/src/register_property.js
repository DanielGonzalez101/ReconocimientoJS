async function registerProperty() {
    const propertyData = {
        address: document.getElementById('address').value,
        property_name: document.getElementById('property_name').value,
        property_type: document.getElementById('property_type').value,
        owner_id: document.getElementById('owner_id').value,
        apartment_number: document.getElementById('apartment_number').value,
        RNT: document.getElementById('RNT').value,
        check_in_date: document.getElementById('check_in_date').value,
        check_out_date: document.getElementById('check_out_date').value
    };

    try {
        const response = await fetch('http://localhost:3000/register-property', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propertyData)
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        alert('Error registering property');
    }
}
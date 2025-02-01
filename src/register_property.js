async function registerProperty() {
    const ownerEmail = localStorage.getItem("owner_email"); // 🔥 Obtener email

    if (!ownerEmail) {
        alert("Error: No owner email found. Please log in.");
        console.error("Owner email is missing. Make sure you are logged in.");
        return;
    }

    const propertyData = {
        address: document.getElementById("address").value,
        property_name: document.getElementById("property_name").value,
        property_type: document.getElementById("property_type").value,
        owner_email: ownerEmail, // ✅ Ahora se usa correctamente
        apartment_number: document.getElementById("apartment_number").value || null,
        RNT: document.getElementById("RNT").value || null,
        check_in_date: document.getElementById("check_in_date").value,
        check_out_date: document.getElementById("check_out_date").value,
        status: "available"
    };

    console.log("Datos enviados:", propertyData); // 🔥 Verifica que el email se está enviando

    try {
        const response = await fetch("http://localhost:3000/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(propertyData),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Property registered successfully!");
            console.log(result);
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error registering property:", error);
    }
}


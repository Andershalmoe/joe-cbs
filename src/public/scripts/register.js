document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const phone = urlParams.get("phone");

    if (phone) {
        document.getElementById("phone").value = phone;
    }
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const email = document.getElementById("regEmail").value;
    const birthdate = document.getElementById("regBirthdate").value;
    const phone = document.getElementById("phone").value;

    if (password.length < 10) {
        alert("Password must be at least 10 characters long");
        return;
    }

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email, birthdate, phone }),
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = data.redirectUrl;
        } else {
            const data = await response.json();
            alert(data.message || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Error registering user:", error);
        alert("An error occurred. Please check your connection and try again.");
    }
});
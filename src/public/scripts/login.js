document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("logPhone").value;
    const password = document.getElementById("logPassword").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password }),
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = data.redirectUrl;
        } else {
            const data = await response.json();
            alert(data.message || "Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please check your connection and try again.");
    }
});

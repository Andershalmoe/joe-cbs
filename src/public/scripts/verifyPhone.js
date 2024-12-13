document.getElementById("phoneVerificationForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("phone").value;

    try {
        const response = await fetch("/sendCode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
        });

        if (response.ok) {
            sessionStorage.setItem("phone", phone);
            window.location.href = "verifyCode.html";
        } else {
            const data = await response.json();
            alert(data.message || "Failed to send verification code. Please try again.");
        }
    } catch (error) {
        console.error("Error sending code:", error);
        alert("An error occurred. Please check your connection and try again.");
    }
});

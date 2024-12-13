const codeInputs = document.querySelectorAll(".code-input");

codeInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
        if (input.value.length === 1 && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && index > 0) {
            codeInputs[index - 1].focus(); 
        }
    });
});

document.getElementById("codeVerificationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const verificationCode = Array.from(codeInputs).map(input => input.value).join("");

    try {
        const response = await fetch("/verifyCode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verificationCode }),
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = data.redirectUrl;
        } else {
            const data = await response.json();
            alert(data.message || "Verification failed. Please try again.");
        }
    } catch (error) {
        console.error("Error verifying code:", error);
        alert("An error occurred. Please check your connection and try again.");
    }
});

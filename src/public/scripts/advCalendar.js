const openedDays = new Set();

async function openDay(day) {
    if (openedDays.has(day)) {
        alert("You have already opened this door!");
        return;
    }

    try {
        const response = await fetch("/api/advent/openDay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day }),
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            openedDays.add(day); 
            const dayElement = document.getElementById(`day-${day}`);
            dayElement.classList.add("opened");

            document.getElementById(`surprise-${day}`).textContent =
                data.surprise || surprises[day];
        } else {
        
            alert(data.message || "Could not open the door.");
        }
    } catch (error) {
        console.error("Error opening door:", error);
        alert("Failed to open the door. Please try again.");
    }
}









const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let snowflakes = [];


function createSnowflakes() {
    for (let i = 0; i < 100; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 4 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 2 + 1,
        });
    }
}

function updateSnowflakes() {
    for (let i = 0; i < snowflakes.length; i++) {
        const flake = snowflakes[i];
        flake.x += flake.speedX;
        flake.y += flake.speedY;

        if (flake.y > canvas.height) {
            flake.y = 0;
            flake.x = Math.random() * canvas.width;
        }
    }
}


function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.beginPath();
    for (let i = 0; i < snowflakes.length; i++) {
        const flake = snowflakes[i];
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    }
    ctx.fill();
}


function animateSnow() {
    updateSnowflakes();
    drawSnowflakes();
    requestAnimationFrame(animateSnow);
}


window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    snowflakes = [];
    createSnowflakes();
});

createSnowflakes();
animateSnow();

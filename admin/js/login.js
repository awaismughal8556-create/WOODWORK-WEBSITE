const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Logging in...";

    try {
        const response = await fetch(
           "http://127.0.0.1:5000/api/admin/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent =
                data.message || "Login failed.";
            return;
        }

        loginMessage.textContent = "Login successful!";

        window.location.href = "panel.html";

    } catch (error) {
        console.error("Login Error:", error);

        loginMessage.textContent =
            "Server se connection nahi ho raha.";
    }
});
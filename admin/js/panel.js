// ================= MOBILE MENU =================

document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");

    if (menuBtn && sidebar) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.toggle("mobile-open");

            if (sidebar.classList.contains("mobile-open")) {
                menuBtn.textContent = "✕";
            } else {
                menuBtn.textContent = "☰";
            }

        });


        // Close menu after selecting a page
        document.querySelectorAll(".nav-item").forEach(item => {

            item.addEventListener("click", () => {

                sidebar.classList.remove("mobile-open");

                menuBtn.textContent = "☰";

            });

        });

    }


    // ================= THEME =================

    const themeBtn = document.getElementById("themeBtn");

    const savedTheme = localStorage.getItem("adminTheme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        if (themeBtn) {
            themeBtn.textContent = "☀️";
        }

    } else {

        document.body.classList.remove("dark-mode");

        if (themeBtn) {
            themeBtn.textContent = "🌙";
        }

    }


    if (themeBtn) {

        themeBtn.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains("dark-mode");

            if (isDark) {

                themeBtn.textContent = "☀️";

                localStorage.setItem(
                    "adminTheme",
                    "dark"
                );

            } else {

                themeBtn.textContent = "🌙";

                localStorage.setItem(
                    "adminTheme",
                    "light"
                );

            }

        });

    }

});
const API = "http://127.0.0.1:5000";

let orders = [];


// ================= CHECK LOGIN =================

async function checkLogin() {

    try {

        const response = await fetch(
            `${API}/api/admin/check`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {

            window.location.href = "index.html";
            return;

        }

        // Login successful
        // Home is already the default page

        loadOrders();

    } catch (error) {

        console.error("Login Check Error:", error);

        window.location.href = "index.html";

    }
}


// ================= LOAD ORDERS =================

async function loadOrders() {

    const container =
        document.getElementById("ordersContainer");

    if (!container) return;

    container.innerHTML = "Loading orders...";

    try {

        const response = await fetch(
            `${API}/api/orders`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {

            if (response.status === 401) {

                window.location.href = "index.html";
                return;

            }

            throw new Error("Failed to load orders");

        }

        const data = await response.json();

        orders = data.orders || [];

        updateDashboard();

        displayOrders();

        displayRecentOrders();

    } catch (error) {

        console.error("Orders Error:", error);

        container.innerHTML =
            `<p class="error">Unable to load orders.</p>`;

    }
}


// ================= DASHBOARD =================

function updateDashboard() {

    const total = orders.length;

    const pending =
        orders.filter(order =>
            order.status === "Pending"
        ).length;

    const completed =
        orders.filter(order =>
            order.status === "Completed"
        ).length;


    const totalElement =
        document.getElementById("totalOrders");

    const pendingElement =
        document.getElementById("pendingOrders");

    const completedElement =
        document.getElementById("completedOrders");


    if (totalElement)
        totalElement.textContent = total;

    if (pendingElement)
        pendingElement.textContent = pending;

    if (completedElement)
        completedElement.textContent = completed;

}


// ================= DISPLAY ORDERS =================

function displayOrders() {

    const container =
        document.getElementById("ordersContainer");

    if (!container) return;


    if (orders.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No orders yet.
            </div>
        `;

        return;

    }


    container.innerHTML = orders.map(order => {

        const date =
            new Date(order.createdAt)
                .toLocaleString();


        return `

            <div class="order-card">

                <div class="order-main">

                    <h3>
                        ${escapeHTML(order.fullName)}
                    </h3>

                    <p>
                        📞 ${escapeHTML(order.phone)}
                    </p>

                    <p>
                        📧 ${escapeHTML(order.email)}
                    </p>

                    <p>
                        🪵 ${escapeHTML(order.projectType)}
                    </p>

                    <p>
                        💰 ${escapeHTML(order.budget)}
                    </p>

                    <small>
                        ${date}
                    </small>

                </div>


                <div class="order-actions">

                    <span class="status ${order.status.toLowerCase()}">
                        ${escapeHTML(order.status)}
                    </span>


                    <button
                        class="view-btn"
                        onclick="viewOrder('${order._id}')">

                        View

                    </button>


                    ${
                        order.status === "Pending"
                        ?
                        `<button
                            class="complete-btn"
                            onclick="completeOrder('${order._id}')">

                            Complete

                        </button>`
                        :
                        ""
                    }


                    <button
                        class="delete-btn"
                        onclick="deleteOrder('${order._id}')">

                        Delete

                    </button>

                </div>

            </div>

        `;

    }).join("");

}


// ================= RECENT ORDERS =================

function displayRecentOrders() {

    const container =
        document.getElementById("recentOrders");

    if (!container) return;


    const recent =
        orders.slice(0, 5);


    if (recent.length === 0) {

        container.innerHTML =
            "<p>No orders yet.</p>";

        return;

    }


    container.innerHTML =
        recent.map(order => `

            <div class="recent-order">

                <strong>
                    ${escapeHTML(order.fullName)}
                </strong>

                <span>
                    ${escapeHTML(order.projectType)}
                </span>

                <span class="status ${order.status.toLowerCase()}">
                    ${escapeHTML(order.status)}
                </span>

            </div>

        `).join("");

}


// ================= VIEW ORDER =================

function viewOrder(id) {

    const order =
        orders.find(item => item._id === id);

    if (!order) return;


    document.getElementById("orderDetails").innerHTML = `

        <div class="detail">
            <strong>Name</strong>
            <span>
                ${escapeHTML(order.fullName)}
            </span>
        </div>

        <div class="detail">
            <strong>Email</strong>
            <span>
                ${escapeHTML(order.email)}
            </span>
        </div>

        <div class="detail">
            <strong>Phone</strong>
            <span>
                ${escapeHTML(order.phone)}
            </span>
        </div>

        <div class="detail">
            <strong>Project Type</strong>
            <span>
                ${escapeHTML(order.projectType)}
            </span>
        </div>

        <div class="detail">
            <strong>Budget</strong>
            <span>
                ${escapeHTML(order.budget)}
            </span>
        </div>

        <div class="detail">
            <strong>Status</strong>
            <span>
                ${escapeHTML(order.status)}
            </span>
        </div>

        <div class="detail">
            <strong>Project Details</strong>

            <p>
                ${escapeHTML(order.projectDetails)}
            </p>
        </div>

    `;


    document
        .getElementById("orderModal")
        .classList.add("show");

}


// ================= CLOSE MODAL =================

function closeModal() {

    document
        .getElementById("orderModal")
        .classList.remove("show");

}


// ================= COMPLETE ORDER =================

async function completeOrder(id) {

    try {

        const response = await fetch(
            `${API}/api/orders/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    status: "Completed"
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed"
            );

            return;

        }


        await loadOrders();

    } catch (error) {

        console.error(error);

        alert("Server connection error.");

    }

}


// ================= DELETE ORDER =================

async function deleteOrder(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this order?"
        );


    if (!confirmDelete) return;


    try {

        const response = await fetch(
            `${API}/api/orders/${id}`,
            {
                method: "DELETE",

                credentials: "include"
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed"
            );

            return;

        }


        await loadOrders();

    } catch (error) {

        console.error(error);

        alert("Server connection error.");

    }

}


// ================= NAVIGATION =================

function showPage(page) {

    const pages = [
        "home",
        "dashboard",
        "orders",
        "profile",
        "settings"
    ];


    // Hide all pages

    pages.forEach(name => {

        const element =
            document.getElementById(
                name + "Page"
            );

        if (element) {

            element.classList.add("hidden");

        }

    });


    // Show selected page

    const selected =
        document.getElementById(
            page + "Page"
        );


    if (selected) {

        selected.classList.remove("hidden");

    }


    // Remove active state

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    // Find matching navigation button

    const navButtons =
        document.querySelectorAll(".nav-item");


    const pageIndex = {

        home: 0,
        dashboard: 1,
        orders: 2,
        profile: 3,
        settings: 4

    };


    if (
        pageIndex[page] !== undefined &&
        navButtons[pageIndex[page]]
    ) {

        navButtons[pageIndex[page]]
            .classList.add("active");

    }


    // Load orders when opening dashboard/orders

    if (
        page === "dashboard" ||
        page === "orders"
    ) {

        loadOrders();

    }

}


// ================= LOGOUT =================

async function logout() {

    try {

        await fetch(
            `${API}/api/admin/logout`,
            {
                method: "POST",
                credentials: "include"
            }
        );

    } catch (error) {

        console.error("Logout Error:", error);

    }


    window.location.href = "index.html";

}


// ================= SECURITY =================

function escapeHTML(value) {

    if (!value) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ================= START =================

// Check authentication first
// Home remains the default page

checkLogin();

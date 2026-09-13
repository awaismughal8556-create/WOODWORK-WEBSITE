
/* =========================================================
   WOODCRAFT WEBSITE
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ================= MOBILE MENU ================= */

    const menuBtn = document.getElementById("menuBtn");
    const navbar = document.getElementById("navbar");

    if (menuBtn && navbar) {

        menuBtn.addEventListener("click", () => {

            navbar.classList.toggle("active");

            const icon = menuBtn.querySelector("i");

            if (navbar.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });


        /* Close menu when a link is clicked */

        const navLinks = navbar.querySelectorAll("a");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                navbar.classList.remove("active");

                const icon = menuBtn.querySelector("i");

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            });

        });

    }


    /* ================= ACTIVE NAVIGATION ================= */

    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".nav-link");

    function updateActiveNav() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }

        });

        links.forEach(link => {

            link.classList.remove("active");

            if (
                link.getAttribute("href") === "#" + currentSection
            ) {
                link.classList.add("active");
            }

        });

    }

    window.addEventListener("scroll", updateActiveNav);

    updateActiveNav();


    /* ================= HEADER SCROLL ================= */

    const header = document.querySelector(".header");

    function headerScroll() {

        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    window.addEventListener("scroll", headerScroll);

    headerScroll();


    /* ================= BACK TO TOP ================= */

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 500) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }

        });


        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* ================= CURRENT YEAR ================= */

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* ================= FILE UPLOAD ================= */

    const designInput = document.getElementById("design");

    if (designInput) {

        designInput.addEventListener("change", function () {

            const uploadBox = this.closest(".file-upload");

            if (!uploadBox) return;

            const label = uploadBox.querySelector("label");

            if (!label) return;

            if (this.files.length > 0) {

                const fileName = this.files[0].name;

                label.classList.add("selected");

                label.querySelector("span").textContent =
                    fileName;

            } else {

                label.classList.remove("selected");

                label.querySelector("span").textContent =
                    "Click to upload a photo";

            }

        });

    }

/* ================= ORDER FORM ================= */

const orderForm = document.getElementById("orderForm");

if (orderForm) {

    orderForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // ================= GET FORM VALUES =================

        const name =
            document.getElementById("fullName")?.value.trim() || "";

        const email =
            document.getElementById("email")?.value.trim() || "";

        const phone =
            document.getElementById("phone")?.value.trim() || "";

        const projectType =
            document.getElementById("projectType")?.value || "";

        const city =
            document.getElementById("city")?.value.trim() || "";

        const width =
            document.getElementById("width")?.value.trim() || "";

        const length =
            document.getElementById("length")?.value.trim() || "";

        const height =
            document.getElementById("height")?.value.trim() || "";

        const budget =
            document.getElementById("budget")?.value || "";

        const details =
            document.getElementById("details")?.value.trim() || "";


        // ================= VALIDATION =================

        if (!name || !phone || !projectType || !budget || !details) {

            showMessage(
                "Please fill in all required fields.",
                "error"
            );

            return;
        }


        // ================= EMAIL =================
        // Agar email field nahi hai to N/A save hoga

        const customerEmail = email || "N/A";


        // ================= PHONE VALIDATION =================

        const phonePattern =
            /^[0-9+\-\s()]{10,16}$/;

        if (!phonePattern.test(phone)) {

            showMessage(
                "Please enter a valid phone number.",
                "error"
            );

            return;
        }


        // ================= PROJECT DETAILS =================
        // City + dimensions + customer details
        // sab ek hi field mein save honge

        const projectDetails = `
City: ${city || "Not provided"}

Width: ${width || "Not provided"}

Length: ${length || "Not provided"}

Height: ${height || "Not provided"}

Customer Details:
${details}
        `.trim();


        // ================= ORDER DATA =================

        const orderData = {

            fullName: name,

            email: customerEmail,

            phone: phone,

            projectType: projectType,

            budget: budget,

            projectDetails: projectDetails

        };


        console.log("Order Data:", orderData);


        // ================= BUTTON =================

        const submitBtn =
            orderForm.querySelector(".submit-btn");

        const originalText =
            submitBtn ? submitBtn.innerHTML : "Submit";

        if (submitBtn) {

            submitBtn.disabled = true;

            submitBtn.innerHTML = `
                <span>
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Sending...
                </span>
            `;

        }


        // ================= SEND TO BACKEND =================

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(orderData)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                console.error(
                    "Backend Error:",
                    data
                );

                throw new Error(
                    data.message ||
                    "Order submission failed."
                );

            }


            // ================= SUCCESS =================

            showMessage(
                "Your order request has been received! We will contact you soon.",
                "success"
            );


            // ================= RESET FORM =================

            orderForm.reset();


            // ================= RESET UPLOAD TEXT =================

            const uploadLabel =
                document.querySelector(
                    ".file-upload label"
                );

            if (uploadLabel) {

                uploadLabel.classList.remove("selected");

                const span =
                    uploadLabel.querySelector("span");

                if (span) {

                    span.textContent =
                        "Click to upload a photo";

                }

            }


        } catch (error) {

            console.error(
                "Order Error:",
                error
            );

            showMessage(
                error.message ||
                "Unable to send order. Please make sure the backend is running.",
                "error"
            );

        } finally {

            if (submitBtn) {

                submitBtn.disabled = false;

                submitBtn.innerHTML = originalText;

            }

        }

    });

}
    /* ================= FORM MESSAGE ================= */

    function showMessage(message, type) {

        /* Remove existing message */

        const oldMessage =
            document.querySelector(".form-message");

        if (oldMessage) {
            oldMessage.remove();
        }


        const messageBox =
            document.createElement("div");

        messageBox.className =
            `form-message ${type}`;

        messageBox.innerHTML = `
            <i class="fa-solid ${
                type === "success"
                    ? "fa-circle-check"
                    : "fa-circle-exclamation"
            }"></i>

            <span>${message}</span>

            <button type="button" aria-label="Close">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;


        if (orderForm) {

            orderForm.insertBefore(
                messageBox,
                orderForm.firstChild
            );

        }


        const closeBtn =
            messageBox.querySelector("button");

        closeBtn.addEventListener("click", () => {
            messageBox.remove();
        });


        /* Automatically remove */

        setTimeout(() => {

            if (messageBox) {
                messageBox.remove();
            }

        }, 6000);

    }


    /* ================= SCROLL REVEAL ================= */

    const revealElements = document.querySelectorAll(
        ".service-card, .work-card, .price-card, .step, .contact-card, .why-item"
    );


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });


    /* ================= BUTTON RIPPLE ================= */

    const buttons =
        document.querySelectorAll(
            ".btn, .price-btn, .nav-order-btn, .submit-btn"
        );


    buttons.forEach(button => {

        button.addEventListener("click", function (event) {

            const ripple =
                document.createElement("span");

            ripple.classList.add("ripple");

            const rect =
                this.getBoundingClientRect();

            const size =
                Math.max(
                    rect.width,
                    rect.height
                );


            ripple.style.width = size + "px";
            ripple.style.height = size + "px";

            ripple.style.left =
                event.clientX -
                rect.left -
                size / 2 +
                "px";

            ripple.style.top =
                event.clientY -
                rect.top -
                size / 2 +
                "px";


            this.appendChild(ripple);


            setTimeout(() => {
                ripple.remove();
            }, 600);

        });

    });


    /* ================= IMAGE PLACEHOLDER ================= */

    /*
        When you add real images later,
        these placeholders can simply be replaced
        with <img> elements.
    */


    /* ================= ESC KEY ================= */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (navbar) {

                navbar.classList.remove("active");

                if (menuBtn) {

                    const icon =
                        menuBtn.querySelector("i");

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");

                }

            }

        }

    });


    /* ================= PHONE INPUT ================= */

    const phoneInput =
        document.getElementById("phone");

    if (phoneInput) {

        phoneInput.addEventListener("input", function () {

            /*
                Allow only:
                numbers
                +
                -
                spaces
                brackets
            */

            this.value =
                this.value.replace(
                    /[^0-9+\-\s()]/g,
                    ""
                );

        });

    }

});
/* ================= THEME TOGGLE ================= */

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {

    const savedTheme = localStorage.getItem("theme");

    // Default = LIGHT MODE
    if (savedTheme !== "dark") {
        document.body.classList.add("light-mode");
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        const isLight = document.body.classList.contains("light-mode");

        localStorage.setItem("theme", isLight ? "light" : "dark");

        themeBtn.innerHTML = isLight
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
    });
}
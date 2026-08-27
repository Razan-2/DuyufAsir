"use strict";

const pageName = document.body.dataset.page;

const pageLinks = {
    home: "/",
    agents: "/agents.html",
    services: "/#services",
    about: "/about.html",
    contact: "/contact.html"
};

// Load the main page layout.
fetch("/")
    .then((response) => {
        // Check the response before reading it.
        if (!response.ok) {
            throw new Error("تعذر تحميل الصفحة");
        }

        return response.text();
    })
    .then((html) => {
        const source = new DOMParser().parseFromString(
            html,
            "text/html"
        );

        source
            .querySelectorAll("script")
            .forEach((script) => script.remove());

        document.body.replaceChildren(
            ...source.body.children
        );

        document.body.className =
            `section-page ${pageName}-only-page`;

        document.body.dataset.page = pageName;

        const brand = document.querySelector(
            ".navbar .brand"
        );

        if (brand) {
            brand.href = pageLinks.home;
        }

        const navRoutes = [
            ["الرئيسية", "home"],
            ["الوكلاء", "agents"],
            ["الخدمات", "services"],
            ["عن المنصة", "about"],
            ["الدعم الفني", "contact"]
        ];

        document
            .querySelectorAll(".nav-links a")
            .forEach((link) => {
                const route = navRoutes.find(
                    ([label]) =>
                        label === link.textContent.trim()
                );

                if (!route) {
                    return;
                }

                const routeName = route[1];

                link.href = pageLinks[routeName];

                link.classList.toggle(
                    "active",
                    routeName === pageName
                );
            });

        document
            .querySelectorAll(".footer-links a")
            .forEach((link) => {
                const label = link.textContent.trim();

                if (label === "الرئيسية") {
                    link.href = pageLinks.home;
                }

                if (label === "الوكلاء") {
                    link.href = pageLinks.agents;
                }

                if (label === "الخدمات") {
                    link.href = pageLinks.services;
                }
            });

        if (pageName === "contact") {
            const footer = document.querySelector("footer");

            if (footer) {
                const contactPanel =
                    document.createElement("section");

                contactPanel.className =
                    "contact-page-panel";

                contactPanel.innerHTML = `
                    <span class="mini-title">
                        الدعم الفني
                    </span>

                    <h1>
                        نسعد بخدمتكم في عسير
                    </h1>

                    <p>
                        اختر وسيلة التواصل المناسبة،
                        وسنرد عليك في أقرب وقت.
                    </p>

                    <div class="contact-options">
                        <a href="tel:+966556202380">
                            <i class="fa-solid fa-phone"></i>
                            <strong>اتصل بنا</strong>
                            <span dir="ltr">
                                0556202380
                            </span>
                        </a>

                        <a href="mailto:razanalqobti@gmail.com">
                            <i class="fa-solid fa-envelope"></i>
                            <strong>
                                البريد الإلكتروني
                            </strong>
                            <span>
                                razanalqobti@gmail.com
                            </span>
                        </a>

                        <div>
                            <i class="fa-solid fa-location-dot"></i>
                            <strong>الموقع</strong>
                            <span>
                                أبها، منطقة عسير
                            </span>
                        </div>
                    </div>
                `;

                footer.before(contactPanel);
            }
        }

        const script = document.createElement("script");

        script.src = "/main.js?v=247";
        script.defer = true;

        document.body.appendChild(script);
    })
    .catch((error) => {
        console.error(error);

        const loadingMessage =
            document.querySelector(".page-loading");

        if (loadingMessage) {
            loadingMessage.textContent =
                "تعذر تحميل الصفحة. حدّث المتصفح وحاول مرة أخرى.";
        }
    });

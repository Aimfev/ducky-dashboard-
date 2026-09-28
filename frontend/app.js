document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // DASHBOARD STATS
    // =========================

    const memberCount = document.getElementById("memberCount");
    const onlineCount = document.getElementById("onlineCount");
    const messageCount = document.getElementById("messageCount");
    const botUptime = document.getElementById("botUptime");

    if (memberCount) memberCount.textContent = "0";
    if (onlineCount) onlineCount.textContent = "0";
    if (messageCount) messageCount.textContent = "0";
    if (botUptime) botUptime.textContent = "0h";


    // =========================
    // SIDEBAR NAVIGATION
    // =========================

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            navItems.forEach(nav => {
                nav.classList.remove("active");
            });

            item.classList.add("active");

        });

    });


    // =========================
    // QUICK ACTIONS
    // =========================

    const actionCards = document.querySelectorAll(".action-card");

    actionCards.forEach(card => {

        card.addEventListener("click", () => {

            const text = card.innerText.toLowerCase();

            if (text.includes("moderation")) {
                location.hash = "moderation";
            }

            else if (text.includes("announcement")) {
                location.hash = "announcements";
            }

            else if (text.includes("giveaway")) {
                location.hash = "giveaways";
            }

            else if (text.includes("ticket")) {
                location.hash = "tickets";
            }

        });

    });


    // =========================
    // SAVE BUTTONS
    // =========================

    const saveButtons = document.querySelectorAll(".save-btn");

    saveButtons.forEach(button => {

        button.addEventListener("click", () => {

            const originalText = button.textContent;

            button.textContent = "✓ Saved";

            setTimeout(() => {
                button.textContent = originalText;
            }, 1500);

        });

    });


    // =========================
    // CHECKBOX SETTINGS
    // =========================

    const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]'
    );

    checkboxes.forEach(checkbox => {

        checkbox.addEventListener("change", () => {

            const enabled = checkbox.checked;

            console.log(
                "Setting changed:",
                enabled ? "Enabled" : "Disabled"
            );

        });

    });


    // =========================
    // API CONFIGURATION
    // =========================

   

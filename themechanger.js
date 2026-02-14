(function () {
    // Remove old UI/style if re‑run
    document.getElementById("blacket-theme-switcher")?.remove();
    document.getElementById("blacket-theme-style")?.remove();

    const themes = {
        Default: {
            "--bg": "#18181b",
            "--panel": "#27272f",
            "--accent": "#00aaff",
            "--text": "#ffffff",
            "--soft": "#3f3f46"
        },
        Dark: {
            "--bg": "#020617",
            "--panel": "#020617",
            "--accent": "#6366f1",
            "--text": "#e5e7eb",
            "--soft": "#111827"
        },
        Neon: {
            "--bg": "#020617",
            "--panel": "#020617",
            "--accent": "#22c55e",
            "--text": "#e0f2fe",
            "--soft": "#0f172a"
        },
        Sunset: {
            "--bg": "#1f0a17",
            "--panel": "#2b1021",
            "--accent": "#fb923c",
            "--text": "#fee2e2",
            "--soft": "#4c1d2f"
        },
        Ocean: {
            "--bg": "#020617",
            "--panel": "#0b1120",
            "--accent": "#38bdf8",
            "--text": "#e0f2fe",
            "--soft": "#1e293b"
        },
        Matrix: {
            "--bg": "#020d07",
            "--panel": "#02130b",
            "--accent": "#22c55e",
            "--text": "#bbf7d0",
            "--soft": "#052e16"
        },
        Pastel: {
            "--bg": "#f5f3ff",
            "--panel": "#e5e7eb",
            "--accent": "#a855f7",
            "--text": "#1f2937",
            "--soft": "#d4d4d8"
        }
    };

    // Inject base CSS that uses variables
    const style = document.createElement("style");
    style.id = "blacket-theme-style";
    style.textContent = `
        :root {
            --bg: #18181b;
            --panel: #27272f;
            --accent: #00aaff;
            --text: #ffffff;
            --soft: #3f3f46;
        }

        body, .app, #root {
            background-color: var(--bg) !important;
            color: var(--text) !important;
        }

        [class*="navbar"], [class*="panel"], [class*="card"], [class*="container"],
        [class*="sidebar"], [class*="menu"], [class*="modal"], .blacket-panel {
            background-color: var(--panel) !important;
            border-color: var(--soft) !important;
            color: var(--text) !important;
        }

        button, [role="button"] {
            border-radius: 999px;
        }

        a, a span {
            color: var(--accent) !important;
        }
    `;
    document.head.appendChild(style);

    let currentTheme = localStorage.getItem("blacketTheme") || "Default";

    function applyTheme(name) {
        const theme = themes[name];
        if (!theme) return;
        currentTheme = name;
        Object.entries(theme).forEach(([k, v]) =>
            document.documentElement.style.setProperty(k, v)
        );
        localStorage.setItem("blacketTheme", name);
        updateActiveButtons();
    }

    function resetTheme() {
        Object.keys(themes.Default).forEach(k =>
            document.documentElement.style.removeProperty(k)
        );
        currentTheme = "Site";
        localStorage.removeItem("blacketTheme");
        updateActiveButtons();
    }

    function randomTheme() {
        const keys = Object.keys(themes);
        const choice = keys[Math.floor(Math.random() * keys.length)];
        applyTheme(choice);
    }

    // UI container
    const box = document.createElement("div");
    box.id = "blacket-theme-switcher";
    box.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 260px;
        background: rgba(15,23,42,0.96);
        border-radius: 16px;
        padding: 10px 12px;
        z-index: 9999;
        font-family: "Inter", system-ui, sans-serif;
        font-size: 12px;
        color: #e5e7eb;
        box-shadow: 0 18px 50px rgba(0,0,0,0.75);
        backdrop-filter: blur(18px);
        border: 1px solid rgba(148,163,184,0.7);
    `;

    box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-size:14px;">🎨</span>
                <div style="display:flex;flex-direction:column;">
                    <span style="font-weight:600;font-size:13px;">Blacket Theme Manager</span>
                    <span id="theme-current" style="font-size:11px;color:#9ca3af;">Current: ...</span>
                </div>
            </div>
            <div style="display:flex;gap:4px;align-items:center;">
                <button id="theme-collapse" style="border:none;border-radius:999px;padding:3px 8px;font-size:11px;background:rgba(15,23,42,0.9);color:#cbd5f5;cursor:pointer;">–</button>
                <button id="theme-close" style="border:none;border-radius:999px;padding:3px 8px;font-size:11px;background:rgba(148,163,184,0.2);color:#e5e7eb;cursor:pointer;">×</button>
            </div>
        </div>
        <div id="theme-body" style="margin-top:8px;">
            <div id="theme-buttons" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;"></div>
            <div style="display:flex;gap:6px;margin-top:4px;">
                <button id="theme-random" style="flex:1;border:none;border-radius:999px;padding:4px 8px;font-size:11px;background:rgba(56,189,248,0.2);color:#7dd3fc;cursor:pointer;">Random</button>
                <button id="theme-reset" style="flex:1;border:none;border-radius:999px;padding:4px 8px;font-size:11px;background:rgba(239,68,68,0.18);color:#fecaca;cursor:pointer;">Reset</button>
            </div>
        </div>
    `;
    document.body.appendChild(box);

    const btnContainer = document.getElementById("theme-buttons");

    // Create theme buttons with preview dot
    Object.entries(themes).forEach(([name, vars]) => {
        const btn = document.createElement("button");
        btn.className = "theme-btn";
        btn.dataset.theme = name;

        const accent = vars["--accent"];
        const bg = vars["--panel"];

        btn.style.cssText = `
            border:none;
            border-radius:999px;
            padding:4px 8px 4px 6px;
            cursor:pointer;
            background:rgba(15,23,42,0.9);
            color:#e5e7eb;
            font-size:11px;
            display:flex;
            align-items:center;
            gap:6px;
            border:1px solid transparent;
        `;

        btn.innerHTML = `
            <span style="
                width:10px;
                height:10px;
                border-radius:999px;
                background:linear-gradient(135deg, ${accent}, ${bg});
                box-shadow:0 0 6px ${accent}80;
            "></span>
            <span>${name}</span>
        `;

        btn.onclick = () => applyTheme(name);
        btnContainer.appendChild(btn);
    });

    function updateActiveButtons() {
        document.getElementById("theme-current").textContent =
            "Current: " + currentTheme;

        document.querySelectorAll(".theme-btn").forEach(btn => {
            const name = btn.dataset.theme;
            if (name === currentTheme) {
                btn.style.borderColor = "rgba(59,130,246,0.9)";
                btn.style.boxShadow = "0 0 10px rgba(59,130,246,0.6)";
            } else {
                btn.style.borderColor = "transparent";
                btn.style.boxShadow = "none";
            }
        });
    }

    // Controls
    document.getElementById("theme-close").onclick = () => box.remove();

    let collapsed = false;
    document.getElementById("theme-collapse").onclick = () => {
        collapsed = !collapsed;
        const body = document.getElementById("theme-body");
        body.style.display = collapsed ? "none" : "block";
        document.getElementById("theme-collapse").textContent = collapsed ? "+" : "–";
    };

    document.getElementById("theme-random").onclick = randomTheme;
    document.getElementById("theme-reset").onclick = resetTheme;

    // Apply saved or default theme
    if (themes[currentTheme]) applyTheme(currentTheme);
    else updateActiveButtons();

    console.log("🎨 Enhanced Blacket Theme Manager loaded.");
})();

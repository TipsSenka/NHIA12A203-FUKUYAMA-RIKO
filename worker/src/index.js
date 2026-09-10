const courses = [
    { id: "basic", name: "基礎コース", description: "Cloudflareの基本を学ぶコース" },
    { id: "practice", name: "実践コース", description: "WorkersとPagesを連携するコース" },
];

const events = [
    { id: "cloudflare-workshop", name: "Cloudflare活用講座", date: "2026-09-20" },
];

function json(data, status = 200, origin = null) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "content-type": "application/json; charset=UTF-8",
            "access-control-allow-origin": origin || "null",
            "access-control-allow-methods": "GET, OPTIONS",
            "access-control-allow-headers": "Content-Type",
            "vary": "Origin",
        },
    });
}

function allowedOrigin(request, env) {
    const origin = request.headers.get("Origin");
    const allowed = (env.ALLOWED_ORIGINS || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    return origin && allowed.includes(origin) ? origin : null;
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const origin = allowedOrigin(request, env);

        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: {
                "access-control-allow-origin": origin || "null",
                "access-control-allow-methods": "GET, OPTIONS",
                "access-control-allow-headers": "Content-Type",
                "vary": "Origin",
            } });
        }

        if (request.method !== "GET") return json({ error: "Method not allowed" }, 405, origin);
        if (url.pathname === "/api" || url.pathname === "/api/") {
            return json({ status: "ok", service: "senka-api" }, 200, origin);
        }
        if (url.pathname === "/api/course") return json({ courses }, 200, origin);
        if (url.pathname === "/api/events") return json({ events }, 200, origin);
        if (url.pathname === "/api/fortune") {
            return json({ fortune: "今日は新しいことを始めるのに良い日です。" }, 200, origin);
        }
        if (url.pathname === "/api/hello") {
            const name = url.searchParams.get("name")?.trim();
            if (!name) return json({ error: "name is required" }, 400, origin);
            return json({ message: `Hello, ${name}!` }, 200, origin);
        }
        return json({ error: "Not found" }, 404, origin);
    },
};
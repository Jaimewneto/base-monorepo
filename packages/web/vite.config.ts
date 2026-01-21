import path from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        svelte(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg"],
            manifest: {
                name: "Gestão de estoque",
                short_name: "Gestão de estoque",
                description: "Sistema de gestão de estoque",
                theme_color: "#020617",
                background_color: "#020617",
                display: "standalone",
                id: "/",
                start_url: "/",
                icons: [
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
                screenshots: [
                    {
                    src: "/screenshots/desktop.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "wide",
                    },
                    {
                    src: "/screenshots/mobile.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "narrow",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            $lib: path.resolve(__dirname, "./src/lib"),
        },
    },
    server: {
        host: "0.0.0.0",
        port: 5173,
    },
});

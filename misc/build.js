#!/usr/bin/env node

require("esbuild")
    .build({
        logLevel: "info",
        entryPoints: ["src/index.js"],
        bundle: true,
        format: "cjs",
        minify: true,
        sourcemap: false,
        target: ['chrome100', 'firefox100', 'safari11', 'edge100'],
        outfile: "dist/index.js",
    })
    .catch(() => console.log());


require("esbuild")
    .build({
        logLevel: "info",
        entryPoints: ["src/index.js"],
        bundle: true,
        format: "esm",
        minify: true,
        sourcemap: false,
        target: ['chrome100', 'firefox100', 'safari11', 'edge100'],
        outfile: "esm/index.js",
    })
    .catch(() => process.exit(1));
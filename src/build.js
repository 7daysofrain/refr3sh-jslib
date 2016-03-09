({
    baseUrl: "content/script",
    mainConfigFile: 'content/script/main.js',
    include: ['requireLib','main'],
    name: "main",
    out: "content/script/main-built.js",
    paths: {
        requireLib: "require"
    }
})
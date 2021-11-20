const liveServer = require("live-server");

const params = {
    port: 8000,
    host: "127.0.0.1",
    open: true,
    file: "index.html"
};

liveServer.start(params);
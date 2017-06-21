/**
 *
 */

const http  = require("http"),
      https = require("https"),
      fs    = require("fs"),
      path  = require("path");

const mimeTypes = {
  html: "text/html",
  js:   "text/javascript",
  png:  "image/png",
};

const storage = [];

const controllers = {
  // `notfound` just handles case 404
  notfound: (req, res, message = "Not Found") => {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write(message);
    res.end();
  },
  file: (req, res) => {
    const ext = path.extname(req.url).replace(/^\./, "");
    const fpath = path.join(".", ext, req.url);
    if (!fs.existsSync(fpath)) return controllers.notfound(req, res);
    res.writeHead(200, {"Content-Type": mimeTypes[ext]});
    const stream = fs.createReadStream(fpath);
    stream.pipe(res);
  },
  mainjs: (req, res) => {
    res.writeHead(200, {"Content-Type": "text/javascript"});
    const contents = fs.readFileSync("./js/main.js");
    res.end(String(contents).replace("{{GCM_SENDER_ID}}", process.env.GCM_SENDER_ID));
  },
  serviceworker: (req, res) => {
    res.writeHead(200, {"Content-Type": "text/javascript"});
    const contents = fs.readFileSync("./js/firebase-messaging-sw.js");
    res.end(String(contents).replace("{{GCM_SENDER_ID}}", process.env.GCM_SENDER_ID));
  },
  register: (req, res) => {
    let body = [];
    req.on("data", chunk => body.push(chunk));
    req.on("end", () => {
      body = JSON.parse(Buffer.concat(body).toString());
      storage.push(body);
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(body));
      console.log(storage);
    });
  },
  trigger: (req, res) => {
    const notification = {
      "title": "Message from Your Server",
      "body":  "Hey, what's up doing?",
      "icon":  `/${Math.floor(Math.random(2))}.png`,
    };
    Promise.all(storage.map(user => {
      return new Promise((resolve, reject) => {
        https.request({
          method:"POST", host: "fcm.googleapis.com", path: "/fcm/send",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `key=${process.env.FCM_SERVER_KEY}`,
          },
        }, response => {
          resolve({});
          let data = [];
          response.on("data", chunk => data.push(chunk))
          response.on("end",  ()    => resolve(JSON.parse(Buffer.concat(data).toString())));
          response.on("error", err  => reject(err));
        }).end(JSON.stringify({notification, to: user.token, content_available: true}));
      });
    })).then(result => {
      res.writeHead(200);
      res.end(JSON.stringify(result));
    }).catch(err => {
      res.writeHead(500);
      res.end(JSON.stringify(result));
    });
  },
};

const simpleserver = http.createServer((req, res) => {
  console.log(req.method, req.url);
  switch(req.url) {
  case "/": req.url += "index.html";
  case "/manifest.json":
  case "/0.png": case "/1.png": case "/2.png":
    return controllers.file(req, res);
  case "/main.js":
    return controllers.mainjs(req, res);
  case "/firebase-messaging-sw.js":
    return controllers.serviceworker(req, res);
  case "/register":
    return controllers.register(req, res);
  case "/trigger":
    return controllers.trigger(req, res);
  default:
    return controllers.notfound(req, res, `Controller not found for requested URL: ${req.url}`);
  }
});

const port = process.env.PORT || 8080;
simpleserver.listen(port);
console.log(`Server listening ${port}`);

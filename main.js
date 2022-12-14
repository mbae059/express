import express from "express";
import fs from "fs";
import template from "./lib/template.js";
import path from "path";
import sanitizeHtml from "sanitize-html";
import qs from "querystring";
const app = express();
const portNumber = 8000;
app.get("/", (request, response) => {
  fs.readdir("./data", function (err, filelist) {
    if (err) throw err;
    const title = "Welcome";
    const description = "Hello, Node.js";
    const list = template.list(filelist);
    const html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.send(html);
  });
});
app.get("/page/:pageId", (request, response) => {
  fs.readdir(`./data`, "utf8", (err, filelist) => {
    if (err) throw err;

    fs.readFile(
      `./data/${request.params["pageId"]}`,
      "utf8",
      (err, description) => {
        if (err) throw err;
        const filteredId = path.parse(request.params.pageId).base;
        console.log(`is at /data/${request.params[filteredId]}`);
        const title = request.params.pageId;
        const sanitizedTitle = sanitizeHtml(title);
        const sanitizedDescription = sanitizeHtml(description);
        const list = template.list(filelist);
        const html = template.HTML(
          sanitizedTitle,
          list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` 
          <a href="/create">create</a>
          <a href="/update?id=${sanitizedTitle}">update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>
          `
        );
        response.send(html);
      }
    );
  });
});

app.get(`/create`, (request, response) => {
  fs.readdir("./data", function (err, filelist) {
    if (err) throw err;
    var title = "create";
    var list = template.list(filelist);
    var html = template.HTML(
      title,
      list,
      `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      ""
    );
    response.send(html);
  });
});

app.post("/create_process", (request, response) => {
  var body = "";
  request.on("data", (data) => {
    body = body + data;
  });
  request.on("end", () => {
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, "utf8", function (err) {
      response.writeHead(302, { Location: `/page/${title}` });
      response.end();
    });
  });
});
/*
  
  } else if (pathname === "/create_process") {
    
  } else if (pathname === "/update") {
    fs.readdir("./data", function (error, filelist) {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.HTML(
          title,
          list,
          `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(portNumber);
*/

app.listen(portNumber, () => {
  console.log(`Example app listenig on port ${portNumber}`);
});

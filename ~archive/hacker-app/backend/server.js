const express = require("express");
const cors = require("cors");
const app = express();
const port = 2001;

app.use(cors());
app.use(express.json());

const path = require("path");

let visitors = [
  {
    ip: "192.168.1.1",
    name: "Alice",
    dateVisited: "2023-10-01T09:00:00.000Z",
  },
  {
    ip: "192.168.1.2",
    name: "Bob",
    dateVisited: "2023-10-02T10:30:00.000Z",
  },
  {
    ip: "192.168.1.3",
    name: "Charlie",
    dateVisited: "2023-10-03T14:45:00.000Z",
  },
];

function getClientIp(req) {
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "";

  ip = ip.split(",")[0];

  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    ip = "127.0.0.1";
  }

  return ip;
}

app.get("/image", (req, res) => {
  const ip = getClientIp(req);
  
  const name = req.query.name || "N/A";

  const dateVisited = new Date().toISOString();

  const newVisitor = {
    ip: ip,
    name: name, 
    dateVisited: dateVisited,
  };

  console.log(
    `--- New visitor ---\nIP: ${newVisitor.ip}\nName: ${newVisitor.name}\nTime: ${newVisitor.dateVisited}`
  );
  
  visitors.push(newVisitor);

  visitors.sort((a, b) => new Date(a.dateVisited) - new Date(b.dateVisited));

  res.sendFile(path.join(__dirname, "apps/data/image.png"));
});


app.get("/visitors", (req, res) => {
  res.json(visitors);
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});

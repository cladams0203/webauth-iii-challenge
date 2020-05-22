const request = require("supertest");
const server = require("../server");
const db = require("../data/dbConfig");

beforeEach(() => {
  return db.migrate
    .rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run());
});

test("POST /api/users/register to be successful", async () => {
  const res = await request(server)
    .post("/api/users/register")
    .send({ username: "devin", password: "hotsauce", department: "student" });
  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({
    message: "register successful",
    username: "devin",
  });
});

test("POST /api/users/login to be successful", async () => {
  const register = await request(server)
    .post("/api/users/register")
    .send({ username: "devin", password: "hotsauce", department: "student" });
  const res = await request(server)
    .post("/api/users/login")
    .send({ username: "devin", password: "hotsauce" });
  expect(res.type).toBe("application/json");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("token");
  expect(res.body).toMatchObject({ username: "devin" });
});

test("GET /api/users to get all users", async () => {
  const register = await request(server)
    .post("/api/users/register")
    .send({ username: "devin", password: "hotsauce", department: "student" });
  const login = await request(server)
    .post("/api/users/login")
    .send({ username: "devin", password: "hotsauce" });
  const res = await request(server)
    .get("/api/users")
    .set("authorization", login.body.token);
  expect(res.body).toHaveLength(3);
  expect(res.body[0]).toHaveProperty("id");
  expect(res.body[0]).toMatchObject({ id: 2 });
});

test("environment test", () => {
  expect(process.env.DB_ENV).toBe("testing");
});

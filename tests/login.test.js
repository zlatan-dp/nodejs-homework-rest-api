require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose");
const { app } = require("./../app");
const { User } = require("./../models/user");

mongoose.set("strictQuery", false);
const { DB_HOST_TEST } = process.env;

describe("signup", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect(DB_HOST_TEST);
  });

  it("sign up user", async () => {
    const response = await supertest(app).post("/api/users/signup").send({
      email: "test01@gmail.com",
      password: "123456",
      subscription: "pro",
    });

    expect(response.statusCode).toBe(201);

    expect(response.body.user).toEqual(
      expect.objectContaining({
        avatarURL: expect.any(String),
        email: expect.any(String),
        subscription: expect.any(String),
      })
    );
    expect(response.body.user.email).toBe("test01@gmail.com");
    expect(response.body.user.subscription).toBe("pro");
  });

  it("login user", async () => {
    await supertest(app).post("/api/users/signup").send({
      email: "test02@gmail.com",
      password: "123456",
      subscription: "pro",
    });

    const response = await supertest(app).post("/api/users/login").send({
      email: "test02@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.token).toEqual(expect.any(String));
  });
});

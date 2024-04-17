import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { CatsModule } from "../../src/cats/cats.module";
import { AuthModule } from "../../src/auth/auth.module";
import { Cat } from "../../src/entities/cat.entity";
import { User } from "../../src/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../src/auth/constants";

describe("App (e2e)", () => {
  let app: INestApplication;

  let admin_access_token: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        CatsModule,
        AuthModule,
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "1d" },
        }),
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [Cat, User],
          logging: true,
          synchronize: true,
        }),
      ],
      providers: [JwtService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/cats (GET) no cats at app startup", async () => {
    return await request(app.getHttpServer())
      .get("/cats")
      .expect(200)
      .expect([]);
  });

  it("/cats (POST) can't create cat if logged out", async () => {
    return await request(app.getHttpServer())
      .post("/cats")
      .send({ name: "Jim", age: 10, breed: "small" })
      .expect(401);
  });

  it("/auth/register (POST) register basic user", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ username: "TEST", password: "TEST" })
      .expect(200);
    expect(response.body.username).toEqual("TEST");
  });

  it("/auth/login (POST) login basic user", async () => {
    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "TEST", password: "TEST" })
      .expect(200);
  });

  it("/auth/register admin (POST) register admin", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/register-admin")
      .send({ username: "admin", password: "admin" })
      .expect(200);
    expect(response.body.username).toEqual("admin");
  });

  it("/auth/login admin (POST) login admin and save JWT token", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ username: "admin", password: "admin" })
      .expect(200);
    admin_access_token = response.body.access_token;
  });

  it("/cats admin (POST) only admin can create cats", async () => {
    return await request(app.getHttpServer())
      .post("/cats")
      .set("Authorization", "Bearer " + admin_access_token)
      .send({ name: "Jim", age: 10, breed: "small" })
      .expect(201);
  });

  it("/cats admin (POST) create cat 2", async () => {
    return await request(app.getHttpServer())
      .post("/cats")
      .set("Authorization", "Bearer " + admin_access_token)
      .send({ name: "Tim", age: 9, breed: "big" })
      .expect(201);
  });

  it("/cats admin (POST) create cat 3", async () => {
    return await request(app.getHttpServer())
      .post("/cats")
      .set("Authorization", "Bearer " + admin_access_token)
      .send({ name: "Bim", age: 6, breed: "orange" })
      .expect(201);
  });

  it("/cats/1 (GET) view cat by id", async () => {
    return await request(app.getHttpServer())
      .get("/cats/1")
      .expect(200)
      .expect({ id: 1, name: "Jim", age: 10, breed: "small" });
  });

  it("/cats (GET) show all 3 cats", async () => {
    const response = await request(app.getHttpServer())
      .get("/cats")
      .expect(200);
    expect(Object.keys(response.body).length).toEqual(3);
  });

  it("/cats/2 (DELETE) can't delete a cat while logged out", async () => {
    return await request(app.getHttpServer()).delete("/cats/2").expect(401);
  });

  it("/cats/2 (DELETE) delete a cat as admin", async () => {
    await request(app.getHttpServer())
      .delete("/cats/2")
      .set("Authorization", "Bearer " + admin_access_token)
      .expect(200);
  });

  it("/cats (GET) show only 2 cats left", async () => {
    const response = await request(app.getHttpServer())
      .get("/cats")
      .expect(200);
    expect(Object.keys(response.body).length).toEqual(2);
  });

  afterAll(async () => {
    await app.close();
  });
});

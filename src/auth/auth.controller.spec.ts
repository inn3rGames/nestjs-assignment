import { Test } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "../entities/user.entity";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";

const moduleMocker = new ModuleMocker(global);

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        const results = ["test1", "test2"];
        if (token === AuthService) {
          return {
            logIn: jest.fn().mockResolvedValue(results),
            register: jest.fn().mockResolvedValue(results),
            registerAdmin: jest.fn().mockResolvedValue(results),
          };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe("logIn", () => {
    it("should return a JWT token", async () => {
      const user: User = {
        id: 1,
        username: "Bob",
        password: "demo",
        roles: ["user"],
        favorites: [],
      };
      const result = { access_token: "123" };
      jest.spyOn(authService, "logIn").mockImplementation(async () => result);

      expect(await authController.logIn(user)).toBe(result);
    });
  });

  describe("register", () => {
    it("should register a basic user", async () => {
      const user: User = {
        id: 1,
        username: "Bob",
        password: "demo",
        roles: ["user"],
        favorites: [],
      };
      jest.spyOn(authService, "register").mockImplementation(async () => user);

      expect(await authController.register(user)).toBe(user);
    });
  });

  describe("registerAdmin", () => {
    it("should register an admin user", async () => {
      const admin = {
        id: 1,
        username: "admin",
        password: "admin",
        roles: ["user", "admin"],
        favorites: [],
      };
      jest.spyOn(authService, "register").mockImplementation(async () => admin);

      expect(await authController.registerAdmin(admin)).toBe(admin);
    });
  });
});

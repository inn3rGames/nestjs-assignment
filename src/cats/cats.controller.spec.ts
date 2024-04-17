import { Test } from "@nestjs/testing";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";
import { Cat } from "../entities/cat.entity";
import { User } from "../entities/user.entity";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";

const moduleMocker = new ModuleMocker(global);

describe("CatsController", () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
    })
      .useMocker((token) => {
        const results = ["test1", "test2"];
        if (token === CatsService) {
          return {
            findAll: jest.fn().mockResolvedValue(results),
            findOne: jest.fn().mockResolvedValue(results),
            create: jest.fn().mockResolvedValue(results),
            update: jest.fn().mockResolvedValue(results),
            delete: jest.fn().mockResolvedValue(results),
            addFavoriteCat: jest.fn().mockResolvedValue(results),
            deleteFavoriteCat: jest.fn().mockResolvedValue(results),
            viewFavoriteCats: jest.fn().mockResolvedValue(results),
          };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsController = moduleRef.get<CatsController>(CatsController);
  });

  describe("findAll", () => {
    it("should return an array of cats", async () => {
      const result: Array<Cat> = [
        {
          id: 1,
          name: "Bob",
          age: 12,
          breed: "small",
          users: [],
        },
      ];
      jest.spyOn(catsService, "findAll").mockImplementation(async () => result);

      expect(await catsController.findAll()).toBe(result);
    });
  });

  describe("findOne", () => {
    it("should return a cat", async () => {
      const result: Cat = {
        id: 1,
        name: "Bob",
        age: 12,
        breed: "small",
        users: [],
      };
      jest.spyOn(catsService, "findOne").mockImplementation(async () => result);

      expect(await catsController.findOne(1)).toBe(result);
    });
  });

  describe("create", () => {
    it("should return a cat", async () => {
      const result: Cat = {
        id: 1,
        name: "Bob",
        age: 12,
        breed: "small",
        users: [],
      };
      jest.spyOn(catsService, "create").mockImplementation(async () => result);

      expect(await catsController.create(result)).toBe(result);
    });
  });

  describe("update", () => {
    it("update cat", async () => {
      const updatedResult: Cat = {
        id: 1,
        name: "Bob",
        age: 12,
        breed: "big",
        users: [],
      };
      jest
        .spyOn(catsService, "update")
        .mockImplementation(async () => updatedResult);

      expect(await catsController.update(1, updatedResult)).toBe(updatedResult);
    });
  });

  describe("delete", () => {
    it("should delete a cat", async () => {
      jest.spyOn(catsService, "delete").mockImplementation(async () => {});

      expect(await catsController.delete(1)).toBe(undefined);
    });
  });

  describe("addFavoriteCat", () => {
    it("should add favorite cat", async () => {
      const user: User = {
        id: 1,
        username: "Bob",
        password: "demo",
        roles: ["user"],
        favorites: [],
      };
      const addedCat: Cat = {
        id: 1,
        name: "Bob",
        age: 12,
        breed: "big",
        users: [],
      };
      const result: User = {
        id: 1,
        username: "Bob",
        password: "demo",
        roles: ["user"],
        favorites: [addedCat],
      };
      const request = {
        user: user,
      };
      jest
        .spyOn(catsService, "addFavoriteCat")
        .mockImplementation(async () => result);

      expect(await catsController.addFavorite(request, 1)).toBe(result);
    });
  });

  describe("deleteFavoriteCat", () => {
    it("should delete favorite cat", async () => {
      const result: User = {
        id: 1,
        username: "Bob",
        password: "demo",
        roles: ["user"],
        favorites: [],
      };
      const deletedCat: Cat = {
        id: 1,
        name: "Bob",
        age: 12,
        breed: "big",
        users: [],
      };
      const user: User = {
        id: 1,
        username: "Bob",
        password: "demo",
        roles: ["user"],
        favorites: [deletedCat],
      };
      const request = {
        user: user,
      };
      jest
        .spyOn(catsService, "deleteFavoriteCat")
        .mockImplementation(async () => result);

      expect(await catsController.deleteFavorite(request, 1)).toBe(result);
    });
  });

  describe("viewFavoriteCats", () => {
    it("should return favorite cats", async () => {
      const user: User = {
        id: 1,
        username: "Bob",
        password: "demo",
        roles: ["user"],
        favorites: [
          {
            id: 1,
            name: "Bob",
            age: 12,
            breed: "big",
            users: [],
          },
          { id: 2, name: "Jim", age: 10, breed: "small", users: [] },
        ],
      };

      const request = {
        user: user,
      };
      jest
        .spyOn(catsService, "viewFavoriteCats")
        .mockImplementation(async () => user.favorites);

      expect(await catsController.viewFavorites(request)).toBe(user.favorites);
    });
  });
});

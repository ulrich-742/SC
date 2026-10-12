import databaseClient from "../database/client";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-only-secret-never-used-in-production";
jest.retryTimes(3);

afterAll(async () => {
  await databaseClient.end();
});

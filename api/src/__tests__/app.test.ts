import {
  app,
  teardownFastify,
  setupFastify,
} from "../__fixtures__/fastifyFixture";

describe("Build Fastify App", () => {
  beforeAll(async () => {
    await setupFastify();
  });
  afterAll(async () => {
    await teardownFastify();
  });
  it("should build app", async () => {
    expect(app).toBeDefined();
  });
});

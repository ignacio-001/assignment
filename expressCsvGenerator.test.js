const request = require("supertest");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

let serverProcess;

describe("Express.js CSV Generator API", () => {
  beforeAll((done) => {
    // Get the correct absolute path of expressCsvGenerator.js
    const serverPath = path.join(__dirname, "expressCsvGenerator.js");

    // Start the server process
    serverProcess = spawn("node", [serverPath]);

    // Wait for the server to be ready
    setTimeout(done, 1000);
  });

  afterAll(() => {
    // Kill the server process after tests
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it("should return a file path when /generate-csv is called", async () => {
    const response = await request("http://localhost:3000").get("/generate-csv");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("filePath");
    expect(fs.existsSync(response.body.filePath)).toBe(true);
  });

  it("should return a 404 error for invalid endpoints", async () => {
    const response = await request("http://localhost:3000").get("/invalid-endpoint");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Invalid endpoint. Only /generate-csv is available." });
  });
});

import { expect } from "chai";
const app = require("../../src/index.ts");
import dotenv from "dotenv";
import req from "supertest";
import path from "path";
import fs from "fs";
dotenv.config();
/**
 * 지난 알림 목록 조회
 */
describe("GET /push/list/last", () => {
  // 성공 케이스
  it("지난 알림 목록 조회", (done) => {
    const res = req(app)
      .get("/push/list/last")
      .set("Content-Type", "application/json")
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(200)
      .then((res) => {
        expect(res.body.data.push).to.have.lengthOf(1);
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  });
});

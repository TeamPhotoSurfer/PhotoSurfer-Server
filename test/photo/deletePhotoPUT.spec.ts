import { expect } from "chai";
const app = require("../../src/index.ts");
import dotenv from "dotenv";
import req from "supertest";
import path from "path";
import fs from "fs";
dotenv.config();

/**
 * 사진 삭제 테스트
 * 200, 400 케이스
 */
describe("PUT /photo?id=11", () => {
  it("사진 삭제 테스트", (done) => {
    const photoId = 89;
    const res = req(app)
      .put(`/photo?id=${photoId}`)
      .set("Content-Type", "application/json")
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(200)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  });
  it("사진 삭제 테스트 - 400", (done) => {
    const photoId = 90;
    const res = req(app)
      .put(`/photo?id=${photoId}`)
      .set("Content-Type", "application/json")
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(400)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  });
});

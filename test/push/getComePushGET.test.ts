import { expect } from 'chai';
const app = require('../../src/index.ts');
import dotenv from 'dotenv';
import req from 'supertest';
import path from 'path';
import fs from 'fs';
dotenv.config();
/**
 * 다가오는 알림 목록 조회
 */
describe("GET /push/list/come", () => {
  // 성공 케이스
  it("다가오는 알림 목록 조회", (done) => {
    const res = req(app).get("/push/list/come")
      .set("Content-Type", "application/json")
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(200)
      .then(res => {
        expect(res.body.data.push).to.have.lengthOf(6);
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  });
});
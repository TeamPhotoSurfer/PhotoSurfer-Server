import { expect } from 'chai';
const app = require('../../src/index.ts');
import dotenv from 'dotenv';
import req from 'supertest';
import path from 'path';
import fs from 'fs';
dotenv.config();
/**
 * 알림 확인 조회
 */
describe("GET /push/:pushId", () => {
  // 성공 케이스
  it("알림 확인 조회", (done) => {
    const pushId = 5;
    const res = req(app).get(`/push/${pushId}`)
      .set("Content-Type", "application/json")
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(200)
      .then(res => {
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  });
  it("알림 확인 조회 실패 - 404", (done) => {
    const pushId = 90;
    const res = req(app).get(`/push/${pushId}`)
      .set("Content-Type", "application/json")
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(404)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  });
});
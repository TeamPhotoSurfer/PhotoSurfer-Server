const app = require("../../src/index.ts");
const req = require("supertest");
import { expect } from "chai";
describe("POST /push/:photoId", () => {
  it("푸시 알림 설정 - 성공", (done) => {
    const photoId = 156;
    req(app)
      .post(`/push/${photoId}`) // api 요청
      .set("Content-Type", "application/json")
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({
        memo: "메모메모메모메모",
        pushDate: "2022-07-23",
        tagIds: [2, 26, 24],
      }) // request body
      .expect(200) // 예측 상태 코드
      .expect("Content-Type", /json/) // 예측 content-type
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  });
  it("푸시 알림 설정 - 409 사진에 해당하는 푸시알림이 이미 존재", (done) => {
    const photoId = 150;
    req(app)
      .post(`/push/${photoId}`) // api 요청
      .set("Content-Type", "application/json")
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({
        memo: "메모메모메모메모",
        pushDate: "2022-07-23",
        tagIds: [2, 26, 24],
      }) // request body
      .expect(409) // 예측 상태 코드
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  });
  it("푸시 알림 설정 - 400 푸시알림 대표 태그는 1개 이상 3개 이하", (done) => {
    const photoId = 153;
    req(app)
      .post(`/push/${photoId}`) // api 요청
      .set("Content-Type", "application/json")
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({
        memo: "메모메모메모메모",
        pushDate: "2022-07-23",
        tagIds: [2, 26, 24, 27],
      })
      .expect(400)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  });
  it("푸시 알림 설정- 404 사진을 찾을 수 없음", (done) => {
    const photoId = 404;
    req(app)
      .post(`/push/${photoId}`)
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
  it("푸시 알림 설정 - 403 푸시알림 설정 날짜는 오늘 날짜 이후", (done) => {
    const photoId = 4;
    req(app)
      .post(`/push/${photoId}`) // api 요청
      .set("Content-Type", "application/json")
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({
        memo: "메모메모메모메모",
        pushDate: "2022-07-20",
        tagIds: [2, 26, 24],
      }) // request body
      .expect(403) // 예측 상태 코드
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error("######Error >>", err);
        done(err);
      });
  });
});


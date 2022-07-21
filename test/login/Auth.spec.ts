import authTest from "../../src/controllers/AuthController";
import assert from "assert";
import dotenv from "dotenv";
const req = require('supertest');
const { app } = require('../../src/index.ts');


describe('POST /auth/user', () => {
it('카카오 로그인 - 성공', (done) => {
    req(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({
            socialToken: process.env.TEST_TOKEN,
            socialType: 'kakao'
        })
        .expect(200)
        .expect('Content-type', /json/)
        .then((res) => {
            done();
        })
        .catch((err) => {
            console.log('error', err);
            done(err);
        });
});
})
import { expect } from 'chai';
const app = require('../../src/index.ts');
import dotenv from 'dotenv';
import req from 'supertest';
import path from 'path';
import fs from 'fs';
dotenv.config();
/**
 * 북마크 삭제 테스트
 * 200, 400 케이스
 */
 describe('DELETE tag/bookmark/:tagId', () => {
    it('북마크 삭제 테스트', (done) => {
        const tagId = 38;
        const res = req(app).delete(`/tag/bookmark/${tagId}`)
        .set('Content-Type', 'application/json').set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .expect(200)
        .then(res => {
            done();
        })
        .catch(err => {
            console.error("######Error >>", err);
            done(err);
        });
    });

    it('북마크 삭제 테스트 실패 - 400', (done) => {
        const tagId = 37;
        const res = req(app).delete(`/tag/bookmark/${tagId}`)
        .set('Content-Type', 'application/json').set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .expect(400)
        .then(res => {
            done();
        })
        .catch(err => {
            console.error("######Error >>", err);
            done(err);
        });
    });
});
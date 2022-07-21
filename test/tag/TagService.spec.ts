import { expect } from 'chai';
const app = require('../../src/index.ts');
import dotenv from 'dotenv';
import req from 'supertest';
import path from 'path';
import fs from 'fs';
dotenv.config();

/**
 * 최근 추가한 태그, 자주 추가한 태그, 플랫폼 유형 태그 조회 성공
 * 200 케이스
 */
 describe('GET /tag/main', () => {
    // 최근 추가한 태그, 자주 추가한 태그, 플랫폼 유형 태그 조회 성공 케이스
    it('최근 추가한 태그, 자주 추가한 태그, 플랫폼 유형 태그 조회 - 성공', (done) => {
        const res = req(app).get('/tag/main')
        .set('Content-Type', 'application/json').set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .expect(200)
        .then(res => {
            expect(res.body.data.recent.tags).to.have.lengthOf(6);
            expect(res.body.data.often.tags).to.have.lengthOf(6);
            expect(res.body.data.platform.tags).to.have.lengthOf(5);
            //expect(res.body.data.recent.tags[0].id).to.equal(108);
            done();
        })
        .catch(err => {
            console.error("######Error >>", err);
            done(err);
        });
    });
});

/**
 * 자주 검색한 태그 조회 성공
 * 200 케이스
 */
 describe('GET /tag/search', () => {
    // 자주 검색한 태그 조회 성공 케이스
    it('자주 검색한 태그 조회 - 성공', (done) => {
        const res = req(app).get('/tag/search')
        .set('Content-Type', 'application/json').set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .expect(200)
        .then(res => {
            expect(res.body.data.tags).to.have.lengthOf(6);
            expect(res.body.data.tags[0].id).to.equal(34);
            done();
        })
        .catch(err => {
            console.error("######Error >>", err);
            done(err);
        });
    });
});

/**
 * 태그 앨범 조회 성공
 * 200 케이스
 */
 describe('GET /tag', () => {
    it('태그 앨범 조회 - 성공', (done) => {
        const res = req(app).get('/tag')
        .set('Content-Type', 'application/json').set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .expect(200)
        .then(res => {
            expect(res.body.data.bookmarked.tags).to.have.lengthOf(7);
            expect(res.body.data.notBookmarked.tags).to.have.lengthOf(23);

            done();
        })
        .catch(err => {
            console.error("######Error >>", err);
            done(err);
        });
    });
});

/**
 * 태그명 수정 성공
 * 200, 400, 404 케이스
 */
 describe('PUT /tag/:tagId', () => {
    it('태그 앨범 수정 성공 - 200', (done) => {
        const tagId = 18;
        const res = req(app).put(`/tag/${tagId}`)
        .set('Content-Type', 'application/json').set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .send({ "name" : "모카테스트으으"})
        .expect(200)
        .then(res => {
            done();
        })
        .catch(err => {
            console.error("######Error >>", err);
            done(err);
        });
    });

    it('태그 앨범 수정 실패 - 400 (플랫폼 태그 업데이트 불가)', (done) => {
        const tagId = 2;
        const res = req(app).put(`/tag/${tagId}`)
        .set('Content-Type', 'application/json').set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .send({ "name" : "모카테스트으으"})
        .expect(400)
        .then(res => {
            done();
        })
        .catch(err => {
            console.error("######Error >>", err);
            done(err);
        });
    });

    it('태그 앨범 수정 실패 - 404 (태그 없음)', (done) => {
        const tagId = 32;
        const res = req(app).put(`/tag/${tagId}`)
        .set('Content-Type', 'application/json').set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .send({ "name" : "모카테스트으으"})
        .expect(404)
        .then(res => {
            done();
        })
        .catch(err => {
            console.error("######Error >>", err);
            done(err);
        });
    });
});

/**
 * 태그명 삭제 성공
 * 200, 404 케이스
 */
 describe('DELETE /tag/:tagId', () => {
    it('태그 앨범 삭제 성공 - 200', (done) => {
        const tagId = 18;
        const res = req(app).delete(`/tag/${tagId}`)
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

    it('태그 앨범 삭제 실패 - 404 (존재하지 않는 태그)', (done) => {
        const tagId = 17;
        const res = req(app).delete(`/tag/${tagId}`)
        .set('Content-Type', 'application/json').set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .expect(404)
        .then(res => {
            done();
        })
        .catch(err => {
            console.error("######Error >>", err);
            done(err);
        });
    });
});

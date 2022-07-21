import { expect } from 'chai';
const app = require('../../src/index.ts');
import dotenv from 'dotenv';
import req from 'supertest';
import path from 'path';
import fs from 'fs';
dotenv.config();

/**
 * 최근 추가한 태그, 자주 추가한 태그, 플랫폼 유형 태그 조회 성공
 * 200, 500 케이스
 */
 describe('GET /tag/main', () => {
    // 최근 추가한 태그, 자주 추가한 태그, 플랫폼 유형 태그 조회 성공 케이스
    it('최근 추가한 태그, 자주 추가한 태그, 플랫폼 유형 태그 조회 - 성공', (done) => {
        
      req(app)
        .get('/tag/main')
        .set('Content-Type', 'application/json')
        .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
            
          done();
        })
        .catch((err) => {
          console.error('######Error >>', err);
          done(err);
        });
    });
    
  });
import path from 'path';
import { expect } from 'chai';
const app = require('../../src/index.ts');
const req = require('supertest');
import dotenv from 'dotenv';

dotenv.config();

describe('GET photo/search', () => {
  it('태그로 사진검색 - 성공', done => {
    const query = '?id=34';
    req(app)
      .get(`/photo/search/${query}`) // api 요청
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({}) // request body
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/) // 예측 content-type
      .then(res => {
        expect(res.body.data.tags).to.have.lengthOf(1);
        expect(res.body.data.photos).to.have.lengthOf(8);
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  it('태그로 사진검색 - 400', done => {
    req(app)
      .get('/photo/search')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(400)
      .then(res => {
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('POST /photo/menu/tag', () => {
  it('사진에 태그 추가 - 성공', done => {
    req(app)
      .post(`/photo/menu/tag`) // api 요청
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({
        photoId: [1, 2],
        name: '가나다ㅏㄹ2dkdkdk',
        type: 'general',
      }) // request body
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/) // 예측 content-type
      .then(res => {
        expect(res.body.data.name).to.equal('가나다ㅏㄹ2dkdkdk');
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  it('사진에 태그 추가 - 400', done => {
    req(app)
      .post(`/photo/menu/tag`) // api 요청
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({
        photoId: [101],
        name: '포토서퍼아22앙33',
        type: 'general',
      })
      .expect(400)
      .then(res => {
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  it('사진에 태그 추가 - 404', done => {
    req(app)
      .post(`/photo/menu/tag`) // api 요청
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({
        photoId: [1000],
        name: '모카테스트하는즁',
        type: 'general',
      })
      .expect(404)
      .then(res => {
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('GET photo/tag', () => {
  it('검색시 태그 조회 - 성공', done => {
    req(app)
      .get(`/photo/tag`) // api 요청
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/) // 예측 content-type
      .then(res => {
        expect(res.body.data).to.have.lengthOf(74);
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('PUT /menu/tag/:tagId', () => {
  const tagId = 2;
  it('사진의 태그 수정 - 성공', done => {
    req(app)
      .put(`/photo/menu/tag/${tagId}`) // api 요청
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({
        name: '기획',
        tagType: 'general',
        photoIds: [121, 148],
      })
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/) // 예측 content-type
      .then(res => {
        expect(res.body.data.id).to.equal(18);
        expect(res.body.data.name).to.equal('기획');
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  it('사진의 태그 수정 - 400', done => {
    const tagId = 10000;
    req(app)
      .put(`/photo/menu/tag/${tagId}`) // api 요청
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({
        name: '기획',
        tagType: 'general',
        photoIds: [2, 118],
      })
      .expect(400) // 예측 상태 코드
      .expect('Content-Type', /json/) // 예측 content-type
      .then(res => {
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('DELETE photo/menu/tag', () => {
  const tagId = 2;
  it('사진의 태그 삭제 - 성공', done => {
    req(app)
      .delete(`/photo/menu/tag/${tagId}`) // api 요청
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .send({
        photoIds: [145, 167],
      })
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/) // 예측 content-type
      .then(res => {
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('GET photo/detail/:photoId', () => {
  const photoId = 2;
  it('사진상세조회 - 성공', done => {
    req(app)
      .get(`/photo/detail/${photoId}`) // api 요청
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(200) // 예측 상태 코드
      .expect('Content-Type', /json/) // 예측 content-type
      .then(res => {
        expect(res.body.data.id).to.equal(2);
        expect(res.body.data.imageUrl).to.equal('https://photosurfer.s3.ap-northeast-2.amazonaws.com/1657816813206_20201118135612_0.png');
        expect(res.body.data.tags).to.have.lengthOf(7);
        expect(res.body.data.push).to.equal(null);
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });

  it('사진상세조회 - 404', done => {
    const photoId = 1000;
    req(app)
      .get(`/photo//detail/${photoId}`) // api 요청
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .expect(404) // 예측 상태 코드
      .expect('Content-Type', /json/) // 예측 content-type
      .then(res => {
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

describe('POST /photo', () => {
  it('사진태그 저장 - 성공', done => {
    req(app)
      .post('/photo')
      .set('Content-Type', 'multipart/form-data')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .attach('file', path.resolve(__dirname, '../../image', 'test.png'))
      .field('tags[0][name]', '포토서퍼')
      .field('tags[0][type]', 'general')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.data.tags).to.have.lengthOf(1);
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

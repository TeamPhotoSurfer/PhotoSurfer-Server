const { app } = require('../../src/index.ts');
const req = require('supertest');

describe('POST /photo', () => {
  it('사진태그 저장 - 성공', done => {
    req(app)
      .post('/photo')
      .set('Content-Type', 'multipart/form-data')
      .set({ Authorization: `Bearer ${process.env.TEST_TOKEN}` })
      .field('tags[0][name]', '인스타그램')
      .field('tags[0][type]', 'platform')
      .field('tags[1][name]', '포토서퍼')
      .field('tags[1][type]', 'general')
      .attach('image', path.resolve('../image', 'file', 'test.png'))
      .expect(200)
      .then(res => {
        done();
      })
      .catch(err => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

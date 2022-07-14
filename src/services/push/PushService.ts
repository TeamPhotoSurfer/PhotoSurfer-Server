import { PushCreateRequest } from '../../interfaces/push/request/PushCreateRequest';
import connection from '../../loaders/db';

const test = async () => {
  connection.connect();
  const testQuery = 'SELECT * FROM photo;';

  var test222 = connection.query(testQuery, function (err: any, results: any, fields: any) {
    // testQuery 실행
    if (err) {
      console.log(err);
    }
    console.log(results);
  });
  connection.end(); //꼭!!!!!!!!!!!
  return test222;
};

export default {
  test,
};

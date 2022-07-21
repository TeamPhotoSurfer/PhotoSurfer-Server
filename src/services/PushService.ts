import { PushCreateRequest } from '../interfaces/push/request/PushCreateRequest';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { convertDateForm } from '../modules/convertDateForm';

const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const createPush = async (client: any, userId: number, photoId: number, pushCreateRequest: PushCreateRequest) => {
  //====에러처리
  //오늘 날짜보다 이후인지 에러처리
  const date2 = new Date();
  date2.setDate(date2.getDate());
  date2.setHours(0, 0, 0, 0);

  if (dayjs(pushCreateRequest.pushDate) <= dayjs(date2)) {
    throw 403;
  }

  //사진에 대한 푸시가 존재하는지 에러처리
  const { rows: checkPushExist } = await client.query(
    `
      SELECT *
      FROM push
      WHERE user_id = $1 AND photo_id = $2 AND is_deleted = false
    `,
    [userId, photoId],
  );
  if (checkPushExist[0]) {
    throw 409;
  }

  //사진 존재하는지 에러처리
  const { rows: checkPhotoExist } = await client.query(
    `
      SELECT count(*)
      FROM photo
      WHERE id = $1 AND user_id = $2 AND is_deleted = false
    `,
    [photoId, userId],
  );

  if ((checkPhotoExist[0].count as number) <= 0) {
    throw 404;
  }

  //대표 태그는 무조건 1개~3개로
  if (!(1 <= pushCreateRequest.tagIds.length && pushCreateRequest.tagIds.length <= 3)) {
    throw 400;
  }
  //====에러처리 끝

  const { rows: push } = await client.query(
    `
      INSERT INTO push (memo, push_date, user_id, photo_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [pushCreateRequest.memo, new Date(pushCreateRequest.pushDate), userId, photoId],
  );
  console.log(push);

  for (let i of pushCreateRequest.tagIds) {
    const { rows: tags } = await client.query(
      `
      UPDATE photo_tag SET is_represent = true
      WHERE tag_id = $1;
      `,
      [i],
    );
  }
  // const data = {
  //   pushDate: dayjs(push[0].push_date).format("YYYY-MM-DD"),
  //   tagIds: pushCreateRequest.tagIds,
  //   memo: push[0].memo,
  // };
  let result = [];
  pushCreateRequest.tagIds.map(x => {
    result.push({ id: x });
  });

  const data = {
    pushDate: dayjs(push[0].push_date).format('YYYY-MM-DD'),
    tags: result,
    memo: push[0].memo,
  };
  return data;
};

const getPushDetail = async (client: any, userId: number, pushId: number) => {
  const { rows: push } = await client.query(
    `
      SELECT * 
      FROM push
      where push.is_deleted = false AND push.id = $1;
    `,
    [pushId],
  );
  if (!push[0]) {
    throw 404;
  }
  const photoId = push[0].photo_id;

  const { rows: tags } = await client.query(
    `
      SELECT photo_tag.tag_id, tag.name
      FROM photo_tag, tag
      where photo_tag.is_deleted = false 
      AND photo_tag.photo_id = $1 AND photo_tag.is_represent = true
      AND photo_tag.tag_id = tag.id;
    `,
    [photoId],
  );
  console.log(tags);
  var tagReturn: any;
  //isRepresent = true 인 것이 0개이면 -> 태그들 중에서 created_at, limit 3으로 세 개 추가하기
  if (tags.length == 0) {
    const { rows: tagsNotRepresent } = await client.query(
      `
        SELECT photo_tag.tag_id, tag.name
        FROM photo_tag, tag
        where photo_tag.is_deleted = false 
        AND photo_tag.photo_id = $1
        AND photo_tag.tag_id = tag.id
        ORDER BY photo_tag.created_at
        LIMIT 3;
      `,
      [photoId],
    );
    tagReturn = tagsNotRepresent.map(x => {
      return {
        id: x.tag_id,
        name: x.name,
      };
    });
  } else {
    tagReturn = tags.map(x => {
      return {
        id: x.tag_id,
        name: x.name,
      };
    });
  }

  const data = {
    id: push[0].id,
    pushDate: dayjs(push[0].push_date).format('YYYY-MM-DD'),
    tags: tagReturn,
    memo: push[0].memo,
  };
  return data;
};

//push테이블에서 오늘 날짜인거 받아와서 -> user_id로 user에서 fcm토큰 받아오기
//photo_id로 photo_tag에서 tag_id, is_represent 받아오기 => tag_id로 tag name 받아오기
//(대표태그 3개, 대표태그 없으면 일반 중에 orderby 해서 고르기)
//photo_id로 photo에서 image_url 받아오기
//
const pushPlan = async (client, date1, date2) => {
  const { rows: tokenAndImage } = await client.query(
    ` 
          SELECT u.fcm_token, photo.id, photo.image_url, push.id as pushId, push.memo
          FROM push, "user" u, photo
          WHERE $1 <= push.push_date AND push.push_date < $2 AND push.is_deleted = false
          AND push.user_id = u.id AND photo.user_id = u.id 
          AND push.photo_id = photo.id AND photo.is_deleted = false
          `,
    [date1, date2],
  );
  //console.log(tokenAndImage);
  const photoIds = tokenAndImage.map(x => x.id);

  //오늘에 해당하는 많은 알림들이 존재할텐데, (한 user에도 많은 photo들이 존재하기 때문) -> 모든 photo의 id들을 받아와서 거기에 딸린 태그들을 받아오기
  const { rows: tags } = await client.query(
    `
          SELECT photo_tag.photo_id, tag.name
          FROM photo_tag, tag
          WHERE photo_tag.photo_id IN (${photoIds}) AND photo_tag.is_represent = true
          AND photo_tag.is_deleted = false
          AND photo_tag.tag_id = tag.id AND tag.is_deleted = false
          `,
  );

  const tagMap = new Map<number, Array<string>>();
  tags.map(x => {
    if (typeof tagMap.get(x.photo_id) === 'undefined') {
      var arr = [];
      arr.push(x.name);
      tagMap.set(x.photo_id, arr);
    } else if (tagMap.get(x.photo_id).length < 3) {
      var arr: any[] = tagMap.get(x.photo_id);
      arr.push(x.name);
      tagMap.set(x.photo_id, arr);
    }
  });
  console.log('+++' + tagMap);

  //photo의 태그 갯수가 0개면 orderby created_at, limit 3하기
  for (let i = 0; i < photoIds.length; i++) {
    if (typeof tagMap.get(photoIds[i]) === 'undefined') {
      console.log('대표태그없음');
      const { rows: tagsNotRepresent } = await client.query(
        `
          SELECT photo_tag.tag_id, tag.name
          FROM photo_tag, tag
          where photo_tag.is_deleted = false 
          AND photo_tag.photo_id = $1
          AND photo_tag.tag_id = tag.id
          ORDER BY photo_tag.created_at
          LIMIT 3;
        `,
        [photoIds[i]],
      );

      var arr = [];
      tagsNotRepresent.map(x => {
        arr.push(x.name);
      });
      tagMap.set(photoIds[i], arr);
    }
  }

  const data = tokenAndImage.map(x => {
    var tagString: string = '';
    tagMap.get(x.id).map(y => {
      tagString += '#' + y;
      tagString += ' ';
    });
    return {
      push_id: x.pushid,
      fcm_token: x.fcm_token,
      photo_tag: tagString,
      image_url: x.image_url,
      memo: x.memo,
    };
  });

  return data;
};

//지난 알림목록 조회
const getLastPush = async (client: any, userId: number) => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(0, 0, 0, 0);

  const { rows } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
      FROM push, photo
      WHERE push.user_id = $1
      AND push.push_date <= $2 AND push.photo_id = photo.id
      ORDER BY push.push_date ASC
      `,
    [userId, date],
  );
  for (let i of rows) {
    const photoId = i.photo_id;
    const { rows: tags } = await client.query(
      `SELECT tag.id ,tag.name
          FROM photo_tag, tag
          WHERE photo_tag.photo_id = $1
          AND photo_tag.is_represent = true
          AND photo_tag.tag_id = tag.id
          `,
      [photoId],
    );
    i.tags = [];
    i.tags = tags;
  }

  let totalCount = rows.length;
  rows.map(x => (x.push_date = convertDateForm(x.push_date)));

  const data = {
    push: convertSnakeToCamel.keysToCamel(rows),
    totalCount,
  };

  return convertSnakeToCamel.keysToCamel(data);
};

// 다가오는 알림 조회
const getComePush = async (client: any, userId: number) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);

  const date2 = new Date();
  date2.setDate(date2.getDate() + 5);
  date2.setHours(0, 0, 0, 0);

  const { rows } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date <= $3 AND push.photo_id = photo.id
    ORDER BY push.push_date ASC
    `,
    [userId, date, date2],
  );
  console.log(rows);

  for (let i of rows) {
    const photoId = i.photo_id;
    const { rows: tags } = await client.query(
      `SELECT tag.id ,tag.name
        FROM photo_tag, tag
        WHERE photo_tag.photo_id = $1
        AND photo_tag.is_represent = true
        AND photo_tag.tag_id = tag.id
        `,
      [photoId],
    );
    const result = tags.map((x) => x.name);
    i.tags = result;
  }

  let totalCount = rows.length;
  rows.map(x => (x.push_date = convertDateForm(x.push_date)));

  const data = {
    push: convertSnakeToCamel.keysToCamel(rows),
    totalCount,
  };

  return convertSnakeToCamel.keysToCamel(data);
};

// 임박한 목록 조회
const getTodayPush = async (client: any, userId: number) => {
  const today = new Date();
  today.setDate(today.getDate());
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(0, 0, 0, 0);

  let todayPush = [];
  let tomorrowPush = [];
  //다가오는 알림 "오늘"
  const { rows } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date < $3 AND push.photo_id = photo.id 
    ORDER BY push.push_date ASC
    `,
    [userId, today, tomorrow],
  );

  for (let i of rows) {
    const photoId = i.photo_id;
    const { rows: tags } = await client.query(
      `SELECT tag.id, tag.name
        FROM photo_tag, tag
        WHERE photo_tag.photo_id = $1
        AND photo_tag.is_represent = true
        AND photo_tag.tag_id = tag.id
        `,
      [photoId],
    );
    const result = tags.map((x) => x.name);
    i.tags = result;
    todayPush.push(convertSnakeToCamel.keysToCamel(rows));
  }

  //다가오는 알림 "내일"
  const { rows: pushTomorrow } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date < $3 AND push.photo_id = photo.id 
    ORDER BY push.push_date ASC
    `,
    [userId, tomorrow, dayAfterTomorrow],
  );

  for (let i of pushTomorrow) {
    const photoId = i.photo_id;
    const { rows: tags } = await client.query(
      `SELECT tag.id, tag.name
        FROM photo_tag, tag
        WHERE photo_tag.photo_id = $1
        AND photo_tag.is_represent = true
        AND photo_tag.tag_id = tag.id
        `,
      [photoId],
    );
    const result = tags.map((x) => x.name);
    i.tags = result;
    const data = {
      push: i,
    };
    console.log(result);
    
   const asd =convertSnakeToCamel.keysToCamel(tomorrowPush.push(convertSnakeToCamel.keysToCamel(data)));
  }

  //지난 알림목록 개수
  const dateCount = new Date();
  dateCount.setDate(dateCount.getDate() - 1);

  const { rows: last } = await client.query(
    `SELECT count(*)
    FROM push, photo
    WHERE push.user_id = $1
    AND push.push_date <= $2 AND push.photo_id = photo.id
    `,
    [userId, dateCount],
  );

  //다가오는 알림 개수
  const dateCome = new Date();
  dateCome.setDate(dateCome.getDate() + 1);
  dateCome.setHours(0, 0, 0, 0);

  const dateCome2 = new Date();
  dateCome2.setDate(dateCome2.getDate() + 5);
  dateCome2.setHours(0, 0, 0, 0);

  const { rows: come } = await client.query(
    `SELECT count(*)
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date <= $3 AND push.photo_id = photo.id
    `,
    [userId, dateCome, dateCome2],
  );
  console.log(come);

  let todayTomorrowCount = rows.length + pushTomorrow.length;
  rows.map(x => (x.push_date = convertDateForm(x.push_date)));
  pushTomorrow.map(x => (x.push_date = convertDateForm(x.push_date)));

  const data = {
    today: { push: convertSnakeToCamel.keysToCamel(rows) },
    tomorrow: { push: convertSnakeToCamel.keysToCamel(pushTomorrow) },
    todayTomorrowCount,
    lastCount: +last[0].count,
    comingCount: +come[0].count,
  };
  console.log(+last[0].count);

  console.log(data);

  return convertSnakeToCamel.keysToCamel(data);
};

export default {
  createPush,
  getPushDetail,
  pushPlan,
  getComePush,
  getTodayPush,
  getLastPush,
};

const admin = require('firebase-admin');

const sendPushAlarm = async (title, photoTag, memo, imageUrl, receiverToken, photoId) => {
  if (!receiverToken.length) {
    return 0;
  }
  try {
    const message = {
      android: {
        data: {
          "title": title,
          "body": photoTag + "\n" + memo,
          "imageUrl": imageUrl,
          "photoId" : String(photoId)
        },
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1,
            alert: {
              "title": title,
              "body": photoTag + "\n" + memo,
              "imageUrl": imageUrl,
              "photoId" : String(photoId)
            },
          },
        },
        fcm_options: {
          "image": imageUrl
        }
      },
      "tokens": receiverToken,
    };
    console.log(message);

    admin
      .messaging()
      .sendMulticast(message)
      .then(function (response) {
        console.log('Successfully sent message: : ', response);
        return 1;
      })
      .catch(function (err) {
        console.log('Error Sending message!!! : ', err);
        return 0;
      });
  } catch (error) {
    console.log('Error Sending message!!! : ', error);
    return 0;
  } finally {
  }
};

const sendPushAlarmWithId = async (title, body, id, receiverToken) => {
  if (!receiverToken.length) {
    return 0;
  }
  try {
    const message = {
      android: {
        data: {
          title,
          body,
          id
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title,
              body,
              id
            },
          },
        },
      },

      tokens: receiverToken,
    };

    admin
      .messaging()
      .sendMulticast(message)
      .then(function (response) {
        console.log('Successfully sent message: : ', response);
        return 1;
      })
      .catch(function (err) {
        console.log('Error Sending message!!! : ', err);
        return 0;
      });
  } catch (error) {
    console.log('Error Sending message!!! : ', error);
    return 0;
  } finally {
  }
};

module.exports = {
  sendPushAlarm,
  sendPushAlarmWithId
};
const admin = require('firebase-admin');

const sendPushAlarm = async (title, body, imageUrl, receiverToken) => {
  if (!receiverToken.length) {
    return 0;
  }
  try {
    const message = {
      android: {
        notification: {
          title: title,
          body: body,
          imageUrl: imageUrl
        },
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1,
            alert: {
              title: title,
              body: body,
            },
          },
        },
        fcm_options: {
          image: imageUrl
        }
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
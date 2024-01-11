'use strict';
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.sendPush = functions.firestore
  .document('posts/{post_id}')
  .onCreate((snap, context) => {
    const newValue = snap.data();
    const postType = newValue.post_type
    const pushMode = newValue.post_send_push;
    const pushStyle = newValue.post_push_style;
    var title;
     console.log("post_data: " + newValue.post_title + "push_type: " + pushStyle);

    if (pushMode === 0) {
      return true;
    }

    const payload = {
      notification: {
        title: newValue.post_cat_name,
        body: newValue.post_title,
        sound: 'default',
        tag: newValue.post_cat_name



      },
      data: {
        title: newValue.post_cat_name,
        body: newValue.post_title,
        postId: newValue.post_id,
        postType: newValue.post_type,
        image: newValue.post_image_url,
        pushStyle: String(pushStyle)
      }
    };

    switch (postType) {

      case 'quote':
        title = newValue.post_quote_type + " " + newValue.post_cat_name;
        payload.data.title = title;
        payload.notification.title = title;
        payload.notification.body = newValue.post_title;
        payload.data.body = newValue.post_title;
        break;
      case 'fact':
        title = newValue.post_cat_name;
        payload.data.title = title;
        payload.notification.title = title;
        payload.notification.body = newValue.post_push_title;
        payload.data.body = newValue.post_push_title;
        break;

      default:
        if (pushStyle === 1) {
          payload.notification.image = newValue.post_image_url;
        }
        break;
    }




    /* Create an options object that contains the time to live for the notification and the priority. */
    const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 4 // 4 hours

    };
    return admin.messaging().sendToTopic("test", payload, options);

  });

var channelToken = "XXXXXXXXXXXXXXXX";//https://developers.line.biz/console/
var gdrivefolderId = "XXXXXXXXXXXXXXX";//https://drive.google.com/drive/my-drive/
var ss = SpreadsheetApp.openByUrl("XXXXXXXXXXXXXXXX"); //https://docs.google.com/spreadsheets/d/1fsadsadsaddsadsadasdasdS24-fh9Hhc8/edit#gid=0
var NotifyToken = "XXXXXXXXXXXXX"; //https://notify-bot.line.me/my/
var notiOpen = false; //Line Notify (In Group) true = เปิด / false = ปิด
var sheet1 = ss.getSheetByName("ระยะทาง");
var sheet2 = ss.getSheetByName("บันทึกการส่ง");
var sheet3 = ss.getSheetByName("ทีม");



function notiMsg(by, dis, step, cal, img, NotifyToken) {
  var url = 'https://notify-api.line.me/api/notify';
  var opt = {
  'method' : 'post',
  'contentType': 'application/x-www-form-urlencoded',
  'headers':{'Authorization': 'Bearer '+ NotifyToken},//test
    'payload' : {'message': 'By : '+by+'\nDistance : '+dis+' km\nSteps : '+step+' steps\nCalories : '+cal+' Cal','imageThumbnail':img,'imageFullsize':img}
};
 UrlFetchApp.fetch(url, opt);
}


function pushMsg(uid, pmess, channelToken) {
  var url = 'https://api.line.me/v2/bot/message/push';
  var opt = {
    'headers': {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + channelToken,
  },
  'method': 'post',
  'payload': JSON.stringify({
    'to': uid,
    'messages': pmess
  })
 };
 UrlFetchApp.fetch(url, opt);
}


function replyMsg(replyToken, mess, channelToken) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var opt = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': mess
    })
  };
  UrlFetchApp.fetch(url, opt);
}



function doPost(e) {
        var value = JSON.parse(e.postData.contents);
        var events = value.events;
        var event = events[0];
        var type = event.type;
        var replyToken = event.replyToken;
        var sourceType = event.source.type;
        var userId = event.source.userId;
        var groupId = event.source.groupId;
        var timeStamp = event.timestamp;
        var url = "https://api.line.me/v2/bot/profile/"+userId;
        var headers = {
             "contentType": "application/json",
    "headers":{"Authorization": "Bearer "+channelToken}
             };
        var getprofile = UrlFetchApp.fetch(url, headers);
        var profiledata = JSON.parse(getprofile.getContentText());
        var displayName = profiledata.displayName;
        var statusMessage = profiledata.statusMessage;
        var pictureUrl = profiledata.pictureUrl;
        var sumtotal = sheet1.getRange(1,26).getValue();
  
        switch (type) {
          case 'follow':
            var uid = sheet1.getRange(2, 1, sheet1.getLastRow(),sheet1.getLastColumn()).getValues();
                for(var i = 0;i<uid.length; i++){
                   if(userId == uid[i][0]){
                    var already = true;
                    sheet1.getRange(i+2,2).setValue(displayName);
                    sheet1.getRange(i+2,3).setValue('=IMAGE("'+pictureUrl+'")');
                   }
                }
                   if(!already){
                    var img = '=IMAGE("'+pictureUrl+'")';
                    var sumnewuser = sumtotal+2;
                    sheet1.appendRow([userId, displayName, img, "0", "0", "0", "", "", "", "", "", "", "", "", "", "", "", "", "", "team", "", "", "", "", '=RANK(D'+sumnewuser+',D2:D1000)']);
var mess = [{'type': 'text', 'text': 'กรุณาระบุ ชื่อ/ชื่อทีม เป็นตัวอักษรหรือตัวเลขเท่านั้น (ไม่สามรถแก้ไขได้ภายหลัง)'}];
                    replyMsg(replyToken, mess, channelToken);
                   }
            break;
            //End//Case New follower//
          case 'message':
            var messageType = event.message.type;
            var messageId = event.message.id;
            var messageText = event.message.text;

            var uid = sheet1.getRange(2, 1, sheet1.getLastRow(),sheet1.getLastColumn()).getValues();
                for(var i = 0;i<uid.length; i++){
                   if(userId == uid[i][0]){
                    var usermode = sheet1.getRange(i+2,20).getValue(); 
                     var usersum = sheet1.getRange(i+2,4).getValue(); 
                     var stepsum = sheet1.getRange(i+2,5).getValue();
                     var calsum = sheet1.getRange(i+2,6).getValue();
                     var usteam = sheet1.getRange(i+2,7).getValue();
                 if(messageText == "ส่งผลกิจกรรม" && usteam !== ""){
                    sheet1.getRange(i+2,20).setValue("imgmode");
var mess = [{'type': 'text', 'text': "กรุณาส่งรูปผลกิจกรรมจากแอพเพียง 1 รูป","quickReply": { 
    "items": [
      {
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type":"cameraRoll",
          "label":"เลือกรูปภาพเพื่อส่ง"
        }
      },{
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type": "message",
          "label": "ยกเลิก",
          "text": "exit"
        }
      }]}}];
                     replyMsg(replyToken, mess, channelToken);
              }
               else if(messageText == "สรุปผลกิจกรรม" && usteam !== "" && usermode == "normal"){
                var uid = sheet1.getRange(2, 1, sheet1.getLastRow(),sheet1.getLastColumn()).getValues();
                for(var i = 0;i<uid.length; i++){
                   if(userId == uid[i][0]){
                     var usersum = sheet1.getRange(i+2,4).getValue(); 
                     var stepsum = sheet1.getRange(i+2,5).getValue();
                     var calsum = sheet1.getRange(i+2,6).getValue();
                     var usteam = sheet1.getRange(i+2,7).getValue();
                     var yourrank = sheet1.getRange(i+2,25).getValue(); 
                     var todaydate = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy");
                     var ds = new Date();
                     var nmonth = ds.getMonth();
                     if(nmonth == "0"){
                       var usersumxmonth = sheet1.getRange(i+2,8).getValue(); 
                     }
                     else if(nmonth == "1"){
                       var usersumxmonth = sheet1.getRange(i+2,9).getValue(); 
                     }
                     else if(nmonth == "2"){
                       var usersumxmonth = sheet1.getRange(i+2,10).getValue(); 
                     }
                     else if(nmonth == "3"){
                       var usersumxmonth = sheet1.getRange(i+2,11).getValue(); 
                     }
                     else if(nmonth == "4"){
                       var usersumxmonth = sheet1.getRange(i+2,12).getValue(); 
                     }
                     else if(nmonth == "5"){
                       var usersumxmonth = sheet1.getRange(i+2,13).getValue(); 
                     }
                     else if(nmonth == "6"){
                       var usersumxmonth = sheet1.getRange(i+2,14).getValue(); 
                     }
                     else if(nmonth == "7"){
                       var usersumxmonth = sheet1.getRange(i+2,15).getValue(); 
                     }
                     else if(nmonth == "8"){
                       var usersumxmonth = sheet1.getRange(i+2,16).getValue(); 
                     }
                     else if(nmonth == "9"){
                       var usersumxmonth = sheet1.getRange(i+2,17).getValue(); 
                     }
                     else if(nmonth == "10"){
                       var usersumxmonth = sheet1.getRange(i+2,18).getValue(); 
                     }
                     else if(nmonth == "11"){
                       var usersumxmonth = sheet1.getRange(i+2,19).getValue(); 
                     }
                     
                     
var mess = [
{
  "type": "flex",
  "altText": "Running",
  "contents": {
  "type": "bubble",
  "size": "kilo",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "สรุปการส่งผลกิจกรรม",
        "align": "center",
        "size": "xl",
        "weight": "bold"
      },
      {
        "type": "separator",
        "margin": "md"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "ทีม "+usteam,
            "align": "center",
            "weight": "bold",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "คุณ "+displayName,
            "weight": "bold",
            "align": "center",
            "margin": "sm"
          },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "url": pictureUrl,
            "size": "sm",
            "margin": "md"
          }
        ]
      },
          {
            "type": "text",
            "text": "เดือนนี้ "+usersumxmonth.toFixed(2)+" กม.",
            "size": "sm",
            "align": "center",
            "decoration": "underline",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "จำนวนก้าว(รวม) "+stepsum+" ก้าว",
            "size": "sm",
            "align": "center",
            "decoration": "underline",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "แคลลอรี่(รวม) "+calsum+" kcal",
            "size": "sm",
            "align": "center",
            "decoration": "underline",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "รวมทั้งหมด "+usersum.toFixed(2)+" กม.",
            "size": "sm",
            "align": "center",
            "decoration": "underline",
            "margin": "sm"
          },
          {
            "type": "text",
            "text": "คุณอยู่อันดับที่ #"+yourrank+" / "+sumtotal+" (ทั้งหมด)",
            "size": "sm",
            "align": "center",
            "decoration": "underline",
            "margin": "sm"
          }
        ],
        "margin": "md"
      },
      {
        "type": "separator",
        "margin": "md"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "อัพเดท : "+todaydate,
            "size": "sm"
          }
        ],
        "margin": "md"
      }
    ]
  }
}
}];
      replyMsg(replyToken, mess, channelToken);
                   }
                }
               } //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
               else if(usermode == "team"){
                 if(messageType == "text" && messageText !== "" && messageText !== "ส่งผลกิจกรรม" && messageText !== "สรุปผลกิจกรรม"){
                 sheet1.getRange(i+2,20).setValue('normal');
                 sheet1.getRange(i+2,7).setValue(messageText);
            var uteam = sheet3.getRange(2, 1, sheet1.getLastRow(),sheet1.getLastColumn()).getValues();
            var sumttotal = sheet3.getRange(1,6).getValue();
                for(var i = 0;i<uteam.length; i++){
                   if(messageText == uteam[i][0]){
                     var futeam = true;
                   }
                }
                if(!futeam){
                  var sumtnewuser = sumttotal+2;
sheet3.appendRow([messageText, "0", "0", "0", '=RANK(B'+sumtnewuser+',B2:B1000)']);
                }
                 var mess = [{'type': 'text', 'text': 'หากต้องการส่งผลกิจกรรมสามารถกดปุ่ม "ส่งผลกิจกรรม" ที่เมนูด้านล่างได้เลยครับ ',"quickReply": { 
    "items": [
      {
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type": "message",
          "label": "ส่งผลกิจกรรม",
          "text": "ส่งผลกิจกรรม"
        }
      }]}}];
                    replyMsg(replyToken, mess, channelToken);
                 }else{
                   var mess = [{'type': 'text', 'text': "กรุณาระบุ ชื่อ/ชื่อทีม เป็นตัวอักษรหรือตัวเลขเท่านั้น"}];
            replyMsg(replyToken, mess, channelToken);
                 }
               }
               //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                       else if(usermode == "imgmode"){
                       if(messageType == "image"){
            sheet1.getRange(i+2,20).setValue('nummode');
            var url = "https://api-data.line.me/v2/bot/message/"+messageId+"/content";
            var headers = {
              "headers":{"Authorization": "Bearer "+channelToken}
            };
            var getcontent = UrlFetchApp.fetch(url, headers);
            var blob = getcontent.getBlob();
            var fileBlob = Utilities.newBlob(blob.getBytes(), 'image/jpeg', messageId+'.jpg');
            var imgid = DriveApp.getFolderById(gdrivefolderId).createFile(fileBlob).getId();
            sheet1.getRange(i+2,21).setValue('https://drive.google.com/uc?id='+imgid);
            var mess = [{'type': 'text', 'text': "เฉพาะกีฬาวิ่ง * กรุณาระบุระยะทางเฉพาะตัวเลข เช่น 4 หรือ 4.1 หรือ 4.01 (หากไม่มีให้ใส่ 0)","quickReply": { 
    "items": [
      {
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type": "message",
          "label": "ยกเลิก",
          "text": "exit"
        }
      }]}}];
            replyMsg(replyToken, mess, channelToken);
                       }else if(messageText == "exit"){
                     sheet1.getRange(i+2,20).setValue('normal');
                     sheet1.getRange(i+2,21).setValue('');
                     sheet1.getRange(i+2,22).setValue('');
                     var mess = [{'type': 'text', 'text': "ยกเลิกการบันทึกเรียบร้อยแล้ว"}];
                     replyMsg(replyToken, mess, channelToken);
                   }
                       else{
                       var mess = [{'type': 'text', 'text': "กรุณาส่งรูปผลกิจกรรมจากแอพเพียง 1 รูป","quickReply": { 
    "items": [
      {
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type":"cameraRoll",
          "label":"เลือกรูปภาพเพื่อส่ง"
        }
      },{
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type": "message",
          "label": "ยกเลิก",
          "text": "exit"
        }
      }]}}];
                         replyMsg(replyToken, mess, channelToken);
                       }
                     }
                       else if(usermode == "nummode"){
  if(isNaN(messageText) == false){
                       sheet1.getRange(i+2,22).setValue(messageText);
                       sheet1.getRange(i+2,20).setValue('stepmode');
                       var mess = [{'type': 'text', 'text': "กรุณาระบุจำนวนก้าว (เฉพาะตัวเลข) เช่น 10 (หากไม่มีให้ใส่ 0)","quickReply": { 
    "items": [
      {
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type": "message",
          "label": "ยกเลิก",
          "text": "exit"
        }
      }]}}];
                       replyMsg(replyToken, mess, channelToken);
                       }else{
  if(messageText == "exit"){
                     sheet1.getRange(i+2,20).setValue('normal');
                     sheet1.getRange(i+2,21).setValue('');
                     sheet1.getRange(i+2,22).setValue('');
                     sheet1.getRange(i+2,23).setValue('');
                     sheet1.getRange(i+2,24).setValue('');
                     var mess = [{'type': 'text', 'text': "ยกเลิกการบันทึกเรียบร้อยแล้ว"}];
                     replyMsg(replyToken, mess, channelToken);
                   }else{
            var mess = [{'type': 'text', 'text': "เฉพาะกีฬาวิ่ง * กรุณาระบุระยะทางเฉพาะตัวเลข เช่น 4 หรือ 4.1 หรือ 4.01 (หากไม่มีให้ใส่ 0)","quickReply": { 
    "items": [
      {
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type": "message",
          "label": "ยกเลิก",
          "text": "exit"
        }
      }]}}];
            replyMsg(replyToken, mess, channelToken);
            }
                       }
                     }
                      else if(usermode == "stepmode"){
  if(isNaN(messageText) == false){
                       sheet1.getRange(i+2,23).setValue(messageText);
                       sheet1.getRange(i+2,20).setValue('calmode');
                       var mess = [{'type': 'text', 'text': "กรุณาระบุจำนวนแคลลอรี่ (เฉพาะตัวเลข) เช่น 10 (หากไม่มีให้ใส่ 0)","quickReply": { 
    "items": [
      {
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type": "message",
          "label": "ยกเลิก",
          "text": "exit"
        }
      }]}}];
                       replyMsg(replyToken, mess, channelToken);
                       }else{
  if(messageText == "exit"){
                     sheet1.getRange(i+2,20).setValue('normal');
                     sheet1.getRange(i+2,21).setValue('');
                     sheet1.getRange(i+2,22).setValue('');
                     sheet1.getRange(i+2,23).setValue('');
                     sheet1.getRange(i+2,24).setValue('');
                     var mess = [{'type': 'text', 'text': "ยกเลิกการบันทึกเรียบร้อยแล้ว"}];
                     replyMsg(replyToken, mess, channelToken);
                   }else{
                       var mess = [{'type': 'text', 'text': "กรุณาระบุจำนวนก้าว (เฉพาะตัวเลข) เช่น 10 (หากไม่มีให้ใส่ 0)","quickReply": { 
    "items": [
      {
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type": "message",
          "label": "ยกเลิก",
          "text": "exit"
        }
      }]}}];
            replyMsg(replyToken, mess, channelToken);
            }
                       }
                     }
                                            else if(usermode == "calmode"){
  if(isNaN(messageText) == false){
                       sheet1.getRange(i+2,24).setValue(messageText);
                       sheet1.getRange(i+2,20).setValue('conmode');
                       var nowimg = sheet1.getRange(i+2,21).getValue(); 
                       var nowdis = sheet1.getRange(i+2,22).getValue(); 
                       var nowstep = sheet1.getRange(i+2,23).getValue(); 
                       var nowcal = sheet1.getRange(i+2,24).getValue(); 
                                   var mess = [
{
  "type": "flex",
  "altText": "Running",
  "contents": {
  "type": "bubble",
  "size": "kilo",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "image",
        "url": nowimg,
        "size": "full",
        "margin": "none",
        "aspectMode": "cover"
      },
      {
        "type": "text",
        "text": "Distance "+nowdis+" km",
        "align": "center",
        "margin": "md",
        "weight": "bold"
      },
      {
        "type": "text",
        "text": "Steps "+nowstep+" steps",
        "align": "center",
        "margin": "md",
        "weight": "bold"
      },
      {
        "type": "text",
        "text": "Calories "+nowcal+" kcal",
        "align": "center",
        "margin": "md",
        "weight": "bold"
      },
      {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "button",
            "action": {
              "type": "message",
              "label": "ส่งผล",
              "text": "confirm"
            },
            "style": "primary",
            "height": "sm"
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "button",
            "action": {
              "type": "message",
              "label": "แก้ไข",
              "text": "edit"
            },
            "style": "primary",
            "height": "sm",
            "color": "#f5d762"
          }
        ],
        "spacing": "md",
        "margin": "md"
      },
      {
        "type": "box",
        "layout": "horizontal",
        "contents": [
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "button",
            "action": {
              "type": "message",
              "label": "ยกเลิก",
              "text": "exit"
            },
            "style": "secondary",
            "height": "sm"
          },
          {
            "type": "separator",
            "margin": "md"
          }
        ],
        "spacing": "md",
        "margin": "md"
      }
    ]
  }
}
}];
                       
                       
                       replyMsg(replyToken, mess, channelToken);
                       }else{
  if(messageText == "exit"){
                     sheet1.getRange(i+2,20).setValue('normal');
                     sheet1.getRange(i+2,21).setValue('');
                     sheet1.getRange(i+2,22).setValue('');
                     sheet1.getRange(i+2,23).setValue('');
                     sheet1.getRange(i+2,24).setValue('');
                     var mess = [{'type': 'text', 'text': "ยกเลิกการบันทึกเรียบร้อยแล้ว"}];
                     replyMsg(replyToken, mess, channelToken);
                   }else{
                       var mess = [{'type': 'text', 'text': "กรุณาระบุจำนวนแคลลอรี่ (เฉพาะตัวเลข) เช่น 10 (หากไม่มีให้ใส่ 0)","quickReply": { 
    "items": [
      {
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type": "message",
          "label": "ยกเลิก",
          "text": "exit"
        }
      }]}}];
            replyMsg(replyToken, mess, channelToken);
            }
                       }
                     }
                   else if(usermode == "conmode"){
                   if(messageText == "confirm"){
                       var nowimg = sheet1.getRange(i+2,21).getValue(); 
                       var nowdis = sheet1.getRange(i+2,22).getValue(); 
                       var nowstep = sheet1.getRange(i+2,23).getValue(); 
                       var nowcal = sheet1.getRange(i+2,24).getValue(); 
                     var todaydate = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy' เวลา 'HH:mm:ss");
                     var ds = new Date();
                     var nmonth = ds.getMonth();
                     
                     var usersumxresult = usersum+nowdis;
                     var stepsumxresult = stepsum+nowstep;
                     var calsumxresult = calsum+nowcal;
                     //var ximg = '=IMAGE("'+nowimg+'")';
                     var img = '=IMAGE("'+pictureUrl+'")';
                     sheet1.getRange(i+2,4).setValue(usersum+nowdis);
                     sheet1.getRange(i+2,5).setValue(stepsum+nowstep);
                     sheet1.getRange(i+2,6).setValue(calsum+nowcal);
                     if(nmonth == "0"){
                       var usersumxmonth = sheet1.getRange(i+2,8).getValue(); 
                       sheet1.getRange(i+2,8).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "1"){
                       var usersumxmonth = sheet1.getRange(i+2,9).getValue(); 
                       sheet1.getRange(i+2,9).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "2"){
                       var usersumxmonth = sheet1.getRange(i+2,10).getValue(); 
                       sheet1.getRange(i+2,10).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "3"){
                       var usersumxmonth = sheet1.getRange(i+2,11).getValue(); 
                       sheet1.getRange(i+2,11).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "4"){
                       var usersumxmonth = sheet1.getRange(i+2,12).getValue(); 
                       sheet1.getRange(i+2,12).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "5"){
                       var usersumxmonth = sheet1.getRange(i+2,13).getValue(); 
                       sheet1.getRange(i+2,13).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "6"){
                       var usersumxmonth = sheet1.getRange(i+2,14).getValue(); 
                       sheet1.getRange(i+2,14).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "7"){
                       var usersumxmonth = sheet1.getRange(i+2,15).getValue(); 
                       sheet1.getRange(i+2,15).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "8"){
                       var usersumxmonth = sheet1.getRange(i+2,16).getValue(); 
                       sheet1.getRange(i+2,16).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "9"){
                       var usersumxmonth = sheet1.getRange(i+2,17).getValue(); 
                       sheet1.getRange(i+2,17).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "10"){
                       var usersumxmonth = sheet1.getRange(i+2,18).getValue(); 
                       sheet1.getRange(i+2,18).setValue(usersumxmonth+nowdis);
                     }
                     else if(nmonth == "11"){
                       var usersumxmonth = sheet1.getRange(i+2,19).getValue(); 
                       sheet1.getRange(i+2,19).setValue(usersumxmonth+nowdis);
                     }
                     
                     sheet2.appendRow([userId, displayName, img, nowimg, nowdis, nowstep, nowcal, usteam, todaydate]);
              var xuteam = sheet3.getRange(2, 1, sheet1.getLastRow(),sheet1.getLastColumn()).getValues();
                for(var xx = 0;xx<xuteam.length; xx++){
                   if(usteam == xuteam[xx][0]){
                     var teusersum = sheet3.getRange(xx+2,2).getValue(); 
                     var testepsum = sheet3.getRange(xx+2,3).getValue();
                     var tecalsum = sheet3.getRange(xx+2,4).getValue();
                     sheet3.getRange(xx+2,2).setValue(teusersum+nowdis);
                     sheet3.getRange(xx+2,3).setValue(testepsum+nowstep);
                     sheet3.getRange(xx+2,4).setValue(tecalsum+nowcal);
                   }
                }
            var mess = [
{
  "type": "flex",
  "altText": "Running",
  "contents": {
  "type": "bubble",
  "size": "kilo",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "บันทึกการส่งผล",
        "align": "center",
        "size": "xl"
      },
      {
        "type": "separator",
        "margin": "md"
      },
      {
        "type": "text",
        "text": "โดย : "+displayName,
        "align": "center"
      },
      {
        "type": "text",
        "text": "ทีม : "+usteam,
        "align": "center"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "url": pictureUrl,
            "size": "sm"
          }
        ]
      },
      {
        "type": "separator",
        "margin": "md"
      },
      {
        "type": "image",
        "url": nowimg,
        "size": "full",
        "margin": "md",
        "aspectMode": "cover",
        "action": {
          "type": "uri",
          "label": "action",
          "uri": nowimg
        }
      },
      {
        "type": "separator",
        "margin": "md"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Distance "+nowdis+" km",
            "size": "sm"
          },
          {
            "type": "text",
            "text": "Steps "+nowstep+" steps",
            "size": "sm"
          },
          {
            "type": "text",
            "text": "Calories "+nowcal+" kcal",
            "size": "sm"
          },
      {
        "type": "separator",
        "margin": "md"
      },
          {
            "type": "text",
            "text": "Total.Dis "+usersumxresult.toFixed(2)+" km",
            "size": "sm"
          },
          {
            "type": "text",
            "text": "Total.Steps "+stepsumxresult+" steps",
            "size": "sm"
          },
          {
            "type": "text",
            "text": "Total.Cal "+calsumxresult+" kcal",
            "size": "sm"
          }
        ],
        "spacing": "none",
        "margin": "md"
      },
      {
        "type": "separator",
        "margin": "md"
      }
    ]
  }
}
}];       
                    if(notiOpen){
                     notiMsg(displayName, nowdis, nowstep, nowcal, nowimg, NotifyToken);
                     }
                     replyMsg(replyToken, mess, channelToken);
                     sheet1.getRange(i+2,20).setValue('normal');
                     sheet1.getRange(i+2,21).setValue('');
                     sheet1.getRange(i+2,22).setValue('');
                     sheet1.getRange(i+2,23).setValue('');
                     sheet1.getRange(i+2,24).setValue('');
                   } 
                   else if(messageText == "exit"){
                     sheet1.getRange(i+2,20).setValue('normal');
                     sheet1.getRange(i+2,21).setValue('');
                     sheet1.getRange(i+2,22).setValue('');
                     sheet1.getRange(i+2,23).setValue('');
                     sheet1.getRange(i+2,24).setValue('');
                     var mess = [{'type': 'text', 'text': "ยกเลิกการบันทึกผลเรียบร้อยแล้ว"}];
                     replyMsg(replyToken, mess, channelToken);
                   }
                     else if(messageText == "edit"){
                     sheet1.getRange(i+2,20).setValue('nummode');
                     sheet1.getRange(i+2,22).setValue('');
                     sheet1.getRange(i+2,23).setValue('');
                     sheet1.getRange(i+2,24).setValue('');
                     var mess = [{'type': 'text', 'text': "เฉพาะกีฬาวิ่ง * กรุณาระบุระยะทางเฉพาะตัวเลข เช่น 4 หรือ 4.1 หรือ 4.01 (หากไม่มีให้ใส่ 0)","quickReply": { 
    "items": [
      {
        "type": "action",
        "imageUrl": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
        "action": {
          "type": "message",
          "label": "ยกเลิก",
          "text": "exit"
        }
      }]}}];
                     replyMsg(replyToken, mess, channelToken);
                   }
                     else{
                   var mess = [{'type': 'text', 'text': "กรุณากดบันทึกหรือยกเลิก"}];
                     replyMsg(replyToken, mess, channelToken);
                   }
                   }
                   }
                }

            break;
          default:
            break;
        }
    }

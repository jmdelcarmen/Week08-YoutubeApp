'use strict';

////TESTING CLIENT-SERVER/////


var videoData = {};

function getUploadData (dataObject) {
  videoData.url = dataObject.url;
}

$('#upload').on('click', function (e) {
  e.preventDefault();

  videoData.title = $('#videoTitle').val();
  videoData.desc = $('#videoDesc').val();
  videoData.published_at = new Date().toDateString();

  console.log(videoData);
  $.ajax({
    url: '/videos/upload',
    type: 'POST',
    data: videoData,
    dataType: 'json',
    success: function () {
      console.log('Data sent to server');
    }
  });
});

//
// function saveFile (dataObject) {
//   $.ajax({
//     url: '/video/upload',
//     type: 'POST',
//     data: dataObject,
//     dataType: 'json',
//     success: function () {
//       console.log('hi');
//     }
//   })
// }

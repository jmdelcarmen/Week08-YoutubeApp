'use strict';

let videoData = {};

function getUploadData (dataObject) {
  videoData.url = dataObject.url;
}

$('#upload').on('click', function (e) {
  //prevent form submission
  e.preventDefault();
  videoData.title = $('#videoTitle').val();
  videoData.desc = $('#videoDesc').val();
  videoData.published_at = Date.now;
  videoData.category = $('#uploadVideo').children('select').val();
  //Send data to server
  $.ajax({
    url: '/videos/upload',
    type: 'POST',
    data: videoData,
    dataType: 'json',
    success: function (message) {
      console.log(message);
    }
  });

  window.location.href = '/';

});

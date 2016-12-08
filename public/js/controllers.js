'use strict';

(function () {
  angular.module('vload', [])
    .controller('mainCtrl', ['$scope', '$http', function ($scope, $http) {

      //add comment to main video
      $scope.addComment = function (path) {
        $http({
          url: path,
          method: 'POST',
          data: {
            comment_body: $scope.comment_body,
            id: path.replace('/video/addcomment/', ''),
            comment_date: new Date()
          }
        })
        .success( comment => {
          $scope.comments.unshift(comment);
          $scope.comment_body = '';
        })
        .error( err => {
          window.location.href = '/users/login';
        });
      }

      //get main video comments
      if (window.location.pathname.search('video/') == true) {
        let id = window.location.pathname.replace('/video/', '');
        $http({
          url: `/api/getcomments/${id}`,
          method: 'GET',
          data: {
            id: id
          }
        })
        .success( comments => {
          $scope.comments = comments.reverse();
        })
        .error( err => {
          console.log('hi');
        });
      }



    }])
}());


// //- Display all comments
// each comment, i in mainVideo.comments.reverse()
// div.comment-container.py-2.px-1
//   //- a(href="/#{comment}") profile page
//   img(src="/#{comment.profileImage}")
//   strong.mx-1
//     span#comment-username #{comment.username}
//   span #{comment.comment_date.toDateString().slice(3).replace(' 201', ', 201')}
// p.py-1.px-1 #{comment.comment_body}
//   hr

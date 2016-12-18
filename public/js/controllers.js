'use strict';

(function () {
  angular.module('vload', ['ngAnimate'])
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

    }]) //mainCtrl
}());

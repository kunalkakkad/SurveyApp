angular.module('MyApp')
    .controller('LoginCtrl', function($scope, $location, $auth, toastr) {
    $scope.login = function() {
        $auth.login($scope.user)
        .then(function(res) {
//            console.log('Login response',res);
            if(res.data == "UNAUTHORIZED"){
                toastr.error('Please check the login information you have provided!','Incorrect username or password');
                return 0;    
            }
            if(res.data.token == "user"){
                toastr.success('You have successfully signed in!');
            }
            $location.path('/dashboard');
        })
        .catch(function(error) {
            toastr.error(error.data.message, error.status);
      });
    };
    $scope.authenticate = function(provider) {
        $auth.authenticate(provider)
        .then(function() {
            toastr.success('You have successfully signed in with ' + provider + '!');
            $location.path('/');
        })
        .catch(function(error) {
          if (error.message) {
              // Satellizer promise reject error.
              toastr.error(error.message);
          } else if (error.data) {
              // HTTP response error from server
              toastr.error(error.data.message, error.status);
          } else {
              toastr.error(error);
          }
        });
    };
});

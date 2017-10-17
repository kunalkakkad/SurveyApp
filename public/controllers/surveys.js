angular.module('MyApp')
    .controller('surveys', function($scope,$http,$uibModal,MDL,toastr) {

    console.log('Within surveys controller')       

    //---For Insurer Master
    $scope.insurerMaster = function() {   
        $uibModal.open({
            animation:true,              
            templateUrl: 'insurerMaster.html',
            controller: 'insurerMaster',
            size: 'lg',
            resolve: { 
                // schoolId : function () { return $scope.schoolId; },                                  
                //   user_id : function () { return $scope.user._id; }
            }
        })
        .result.then(
            function () { /*alert("OK");*/ }, 
            function () { /*alert("Cancel");*/ }
        );
    };

    //---For Vehicle Master
    $scope.vehicleMaster = function() {                   
        $uibModal.open({
            animation:true,              
            templateUrl: 'vehicleMaster.html',
            controller: 'vehicleMaster',
            size: 'lg',
            resolve: { 
                // schoolId : function () { return $scope.schoolId; },                                  
                  // user_id : function () { return $scope.user_id; }
            }
        })
        .result.then(
            function () { /*alert("OK");*/ }, 
            function () { /*alert("Cancel");*/ }
        );
    };

    //---For Branch Master

    $scope.branchMaster = function() {   
        $uibModal.open({
            animation:true,              
            templateUrl: 'branchMaster.html',
            controller: 'branchMaster',
            size: 'lg',
            resolve: { 
                  // user_id : function () { return $scope.user_id; }
            }
        })
        .result.then(
            function () { /*alert("OK");*/ }, 
            function () { /*alert("Cancel");*/ }
        );
    };

    $scope.bankMaster = function() {   
        $uibModal.open({
            animation:true,              
            templateUrl: 'bankMaster.html',
            controller: 'bankMaster',
            size: 'lg',
            resolve: { 
                  // user_id : function () { return $scope.user_id; }
            }
        })
        .result.then(
            function () { /*alert("OK");*/ }, 
            function () { /*alert("Cancel");*/ }
        );
    };

    $scope.garageMaster = function() {   

        $uibModal.open({
            animation:true,              
            templateUrl: 'garageMaster.html',
            controller: 'garageMaster',
            size: 'lg',
            resolve: { 
                // schoolId : function () { return $scope.schoolId; },                                  
                // user_id : function () { return $scope.user_id; }
            }
        })
        .result.then(
            function () { /*alert("OK");*/ }, 
            function () { /*alert("Cancel");*/ }
        );
    }; 
});
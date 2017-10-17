angular.module('MyApp')
    .controller('finalReportSurvey',function($rootScope, $scope, $http, $uibModal,toastr,$interval,$timeout,uiGridConstants){
            
    $scope.accident_date_dpick_open = function() {
        $scope.accident_date_date.opened = true;
    };
    
    $scope.accident_date_date = {
        opened: false
    };

    //DATES START      
    $scope.survey_allotment_date_dpick_open = function() {
        $scope.survey_allotment_date_date.opened = true;
    };
    $scope.survey_allotment_date_date = {
        opened: false
    };


    $scope.survey_inspection_dpick_open = function() {
        $scope.survey_inspection_date.opened = true;
    };
    $scope.survey_inspection_date = {
        opened: false
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
angular.module('MyApp')
    .controller('finalReportSummary', function($rootScope, $scope, $http, $uibModal,toastr,$interval,$timeout,uiGridConstants) {

    console.log('Within finalReportSummary controller');

    $scope.binary_choices = [
        { choice: "Yes"},
        { choice: "No"}
    ];

    $scope.repair_photo_date_dpick_open = function() {
        $scope.repair_photo_date_date.opened = true;
    };
    $scope.repair_photo_date_date = {
      opened: false
    };

    $scope.reinspection_date_dpick_open = function() {
        $scope.reinspection_date_date.opened = true;
    };
    $scope.reinspection_date_date = {
      opened: false
    };

});


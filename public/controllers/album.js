angular.module('MyApp')
    .controller('album', function($rootScope, $scope, $http, $uibModal,toastr,$interval,$timeout,uiGridConstants, Account, IMGData, Upload) {
                 
    $scope.reportList = function() {   
        console.log('insurance report Master open sesame');

        //Update to use correct factory, FRData no longer exists TODO
        //11/9/17 New factory with same name has been created
        FRData.surveysRetriever();        
        // $http.get('/api/surveys/Final')
        //     .then(function(response) {
        //     console.log("Getting all insurance reports",response);
        //     $rootScope.finalReports = response.data.result;                
        //     console.log("Insurance reports",$rootScope.finalReports);      
        // }, function (response) {
        //         console.log('errors', response);
        // });
        $uibModal.open({
            animation:true,              
            templateUrl: 'insuranceReportMaster.html',
            controller: 'insuranceReportMasterAlbum',
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

    $scope.album = {};
    $rootScope.reportSelected = 0;
       
    $scope.uploadPic = function(file, errFiles){

        $scope.f = file;
        console.log('File to be uploaded', $scope.f);        
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/survey_album_photos/',
                data: {
                    photo: file, 
                    survey_id:$rootScope.selectedInsuranceReportAlbum._id,
                    Description: 'New img',
                    // Photo_Path: 'uploads/1/'+file.name
                    }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        } 
        if ($rootScope.selectedInsuranceReportAlbum == {})
        {
            swal('Oops','You need to select an insurance report first...','error');
        }        
    }

    $scope.getPic = function()
    {
        $http.get('/api/survey_album_photos/')
        .then(function(response) {
            console.log('Photos retrieved',response.data.result);
            $scope.gallery_photos = response.data.result;
            // $scope.vehicleTableGridOptions.data = $rootScope.vehicleData;
        },
        function (response) {
            console.log('errors', response);
    });
    }

});

angular.module('MyApp').controller("insuranceReportMasterAlbum", function ($rootScope, $scope, $http, $uibModalInstance, $timeout, toastr) {           

    $rootScope.selectedInsuranceReportAlbum = {};
    
    $scope.insSel = function(index)
    {      
        $rootScope.reportSelected = 1;
        $rootScope.selectedInsuranceReportAlbum = $rootScope.finalReports[index];
        console.log("An insurance report was selected - ", $rootScope.selectedInsuranceReportAlbum);      
    };

    $scope.sClose = function(index)
    {
        $rootScope.reportSelected = 1;        
        $rootScope.selectedInsuranceReportAlbum = $rootScope.finalReports[index];
        console.log("An insurance report was selected - ", $rootScope.selectedInsuranceReportAlbum);      
        $uibModalInstance.close();
    };
        
    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
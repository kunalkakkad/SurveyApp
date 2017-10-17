angular.module('MyApp')
    .factory('FRData', function($rootScope,$http) {

        var storageService = {};

        storageService.finalReportListRetriever = function(report_type){
            return $http({method : "GET", url : "http://125.99.24.66:8081/api/final_report?surveyType="+report_type})
        };

        storageService.finalReportRetriever = function(id){
            return $http({method : "GET", url : "http://125.99.24.66:8081/api/final_report?surveyId="+id})
        };

        storageService.finalReportPartDeleter = function(id){
            return $http({method : "DELETE", url : "http://125.99.24.66:8081/api/final_report?surveyPartsDetailId="+id})
        };

        storageService.finalReportCabinDetailDeleter = function(id){
            return $http({method : "DELETE", url : "http://125.99.24.66:8081/api/final_report?surveyCabinDetailId="+id})
        };

        storageService.finalReportCheckListDeleter = function(id){
            return $http({method : "DELETE", url : "http://125.99.24.66:8081/api/final_report?surveyCheckListId="+id})
        };

        storageService.finalReportSaver = function(report){
            return $http({method : "POST", url : "http://125.99.24.66:8081/api/final_report/", data : report})
        };
        
        return storageService;
});

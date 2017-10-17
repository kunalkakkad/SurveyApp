angular.module('MyApp')
    .factory('ADData', function($rootScope,$http) {

        var storageService = {};

        storageService.addendumReportListRetriever = function(report_type){
            return $http({method : "GET", url : "http://125.99.24.66:8081/api/addendum?surveyType="+report_type})
        };

        storageService.addendumReportDetailsRetriever = function(id){
            return $http({method : "GET", url : "http://125.99.24.66:8081/api/addendum?surveyId="+id})
        };

        storageService.addendumReportDeleter = function(id){
            return $http({method : "DELETE", url : "http://125.99.24.66:8081/api/addendum?surveyAddendumId="+id})
        };

        storageService.addendumReportPartDeleter = function(id){
            return $http({method : "DELETE", url : "http://125.99.24.66:8081/api/addendum?surveyAddendumPartId="+id})
        };

        storageService.addendumReportDepriciationDeleter = function(id){
            return $http({method : "DELETE", url : "http://125.99.24.66:8081/api/addendum?surveyAddendumDepriciationId="+id})
        };

        storageService.addendumReportSaver = function(report){
            return $http({method : "POST", url : "http://125.99.24.66:8081/api/addendum/", data : report})
        };
        
        return storageService;
});

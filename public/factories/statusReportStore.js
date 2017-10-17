angular.module('MyApp')
    .factory('STSData', function($rootScope, $http, $q) {

        var storageService = {};
                                
        storageService.dummy = function() {
            console.log('Hello world from STSData factory/service!');
        };
        
        storageService.statusReportRetriever = function(type){
            return $http.get('http://125.99.24.66:8081/api/status_report?surveyType='+type);
        };

        storageService.statusReportDetailsRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/status_report?surveyId='+id);
        };                    

        storageService.statusReportSaver = function(data){            
        	return $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/status_report/",
                data : data 
            })                                                                                                      
        };
                
        storageService.statusReportDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/status_report?surveyId='+id);
        };

        storageService.statusStatusDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/status_report?surveyStatusId='+id);
        };

        storageService.statusStatusDamageDetailDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/status_report?surveyStatusDamageDetailId='+id);
        };        
        
                                                       

        return storageService;
});

angular.module('MyApp')
    .factory('STSData', function($rootScope, $http, $q) {

        var storageService = {};
                                
        storageService.dummy = function() {
            console.log('Hello world from STSData factory/service!');
        };
        
        storageService.statusReportRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_status?surveyId='+id);
        };

        storageService.statusReportRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_status?surveyId='+id);
        };

        storageService.statusReportDamageDetailsRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_status_damage_details?surveyId='+id);
        };
        
        storageService.statusReportUpdater = function(data){
            return $http({
                method : "PUT",
                url : "http://125.99.24.66:8081/api/survey_status/",
                data : data 
            })                
        };

        storageService.statusReportDamageDetailsUpdater = function(data){
            return $http({
                method : "PUT",
                url : "http://125.99.24.66:8081/api/survey_status_damage_details/",
                data : data 
            })
        };

        storageService.statusReportSaver = function(data){            
        	return $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/survey_status/",
                data : data 
            })                                                                                                      
        };
        
        storageService.statusReportDamageDetailsSaver = function(data){            
        	return $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/survey_status_damage_details/",
                data : data
            })                                                                                                      
        };

        storageService.statusReportDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/survey_status?surveyId='+id);
        };        
        
        storageService.statusReportDamageDetailsDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/survey_status_damage_details?id='+id);
        };                                               

        return storageService;
});

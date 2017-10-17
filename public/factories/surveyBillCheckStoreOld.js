angular.module('MyApp')
    .factory('BLCHKData', function($rootScope, $http, $q) {

        var storageService = {};

        this.index = '';
                                
        storageService.dummy = function() {
            console.log('Hello world from BLCHKData factory/service!');
        };
        
        storageService.billCheckRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_bill_check?surveyId='+id);
        };

        storageService.billCheckUpdater = function(data){
            return $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/survey_bill_check/",
                    data : data 
                })                
        }

        storageService.billCheckSaver = function(data){            
        	return $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/survey_bill_check/",
                data : data 
            })                                                                                                      
        };
               
        storageService.billCheckDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/survey_bill_check?surveyId='+id);
        };
        
        
        storageService.billCheckDepriciationRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_bill_check_depriciation?surveyId='+id);
        };

        storageService.billCheckDepriciationUpdater = function(data){
            return $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/survey_bill_check_depriciation/",
                    data : data 
                })
        }

        storageService.billCheckDepriciationSaver = function(data){            
        	return $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/survey_bill_check_depriciation/",
                data : data 
            })                                                                                                      
        };
               
        storageService.billCheckDepriciationDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/survey_bill_check_depriciation?id='+id);
        };
        
        storageService.billCheckPartsRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_bill_check_parts?surveyId='+id);
        };

        storageService.billCheckPartUpdater = function(data){
            return $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/survey_bill_check_parts/",
                    data : data 
                })                
        }

        storageService.billCheckPartSaver = function(data){            
        	return $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/survey_bill_check_parts/",
                data : data 
            })                                                                                                      
        };
               
        storageService.billCheckPartDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/survey_bill_check_parts?id='+id);
        };

        return storageService;
});

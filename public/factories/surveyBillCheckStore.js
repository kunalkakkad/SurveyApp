angular.module('MyApp')
    .factory('BLCHKData', function($rootScope, $http, $q) {

        var storageService = {};

        this.index = '';
                                
        storageService.dummy = function() {
            console.log('Hello world from BLCHKData factory/service!');
        };
        
        storageService.billCheckSurveysRetriever = function(type){
            return $http.get('http://125.99.24.66:8081/api/bill_check?surveyType='+type);
        };

        storageService.billCheckRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/bill_check?surveyId='+id);
        };

        // storageService.billCheckUpdater = function(data){
        //     return $http({
        //             method : "PUT",
        //             url : "http://125.99.24.66:8081/api/survey_bill_check/",
        //             data : data 
        //         })                
        // }

        storageService.billCheckSaver = function(data){            
        	return $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/bill_check/",
                data : data 
            })                                                                                                      
        };
               
        storageService.billCheckDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/bill_check?surveyBillCheckId='+id);
        };                    
               
        storageService.billCheckDepriciationDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/bill_check?surveyBillCheckDepriciationId='+id);
        };
        
        storageService.billCheckPartDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/bill_check?surveyBillCheckPartId='+id);
        };

        return storageService;
});

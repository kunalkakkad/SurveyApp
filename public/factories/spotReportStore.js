angular.module('MyApp')
    .factory('SPOTData', function($rootScope, $http, $q) {

        var storageService = {};
                
        storageService.dummy = function() {
            console.log('Hello world from SPOTData factory/service!');
        };

        storageService.spotDataRetriever = function(type){
            return $http.get('http://125.99.24.66:8081/api/spot_report?surveyType='+type);
        };

        storageService.spotDataDetailsRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/spot_report?surveyId='+id);
        };        

        storageService.spotDataSaver = function(report){
            
            return $http({ method : "POST", url : "http://125.99.24.66:8081/api/spot_report/", data : report })            
        };
        
        return storageService;
});

angular.module('MyApp')
    .factory('SRVLTRData', function($rootScope,$http) {

        var storageService = {};
                
        storageService.dummy = function() {
            console.log('Hello world from SRVLTR factory/service!');
        };

        storageService.surveyLetterRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_letter?surveyId='+id);
        };

        storageService.surveyLetterUpdater = function(data){
            return $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/survey_letter/",
                    data : data 
                })                
        }

        storageService.surveyLetterSaver = function(data){            
        	return $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/survey_letter/",
                data : data 
            })                                                                                                      
        };
               
        storageService.surveyLetterDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/survey_letter?id='+id);
        };
    
        return storageService;
});

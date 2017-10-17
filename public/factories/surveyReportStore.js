angular.module('MyApp')
    .factory('SRVData', function($rootScope, $http, $q) {

        var storageService = {};
                
        storageService.dummy = function() {
            console.log('Hello world from SRVData factory/service!');
        };
        
        storageService.surveysRetriever = function(type){
            // return $http.get('http://125.99.24.66:8081/api/surveys/'+type);
            return $http.get('http://125.99.24.66:8081/api/surveys?surveyType='+type);
        };

        storageService.reportUpdater = function(report){
            var reportUpdate = $q.defer();            
//            console.log('Survey detail to be updated',report);            
            $http({
                    method : "PUT",
                    // url : "http://125.99.24.66:8081/api/surveys/"+report._id,                    
                    url : "http://125.99.24.66:8081/api/surveys?surveyId="+report._id,
                    data : report 
                })
                .then(function(response) {
//                	15.09.17
//                	Removed this log as this is resolved and can be seen from finalReport.policy itself
                    console.log("Survey updated",response);     
                    reportUpdate.resolve(response);                    
                }, 
                function (response){
                    console.log('An Error occured while updating', response);
                    reportUpdate.reject(response);
                });
                return reportUpdate.promise;
        }

        storageService.reportSaver = function(report){
            var reportSave = $q.defer();
            console.log('Survey detail to be saved',report);            
            $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/surveys/",
                data : report 
            })
            .then(function(response) {
                console.log("Survey added",response);
                reportSave.resolve(response);
            }, 
            function (response){
                console.log('An Error occured while saving', response);
                reportSave.reject(response);
            });         
            return reportSave.promise;                               
        };

        // This was the previous method of retrieving data

        // 01.09.17 The deferred variable should have been within the function, not outside.

        //var reports = $q.defer();  //Part of old code below
        
        // storageService.surveysRetriever = function(type){
        //     $http.get('http://125.99.24.66:8081/api/surveys/'+type)
        //     .then(function(response) {
        //         console.log("Getting reports for type",type);
        //         $rootScope.finalReports = response.data.result;

        //         reports.resolve();                
        //         console.log("Final reports have been received", $rootScope.finalReports);    
        //     }, 
        //     function (response){
        //         console.log('errors', response);
        //         reports.reject(response);
        //     }); 
        //     return reports.promise;               
        // };
                        
        return storageService;
});

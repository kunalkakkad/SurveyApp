angular.module('MyApp')
    .factory('SPOTData', function($rootScope, $http, $q) {

        var storageService = {};
                
        storageService.dummy = function() {
            console.log('Hello world from SPOTData factory/service!');
        };

        storageService.spotDataRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_spot/'+id);
        };        

        storageService.spotDataUpdater = function(report){
            var reportUpdate = $q.defer();
            
            console.log('Spot Details to be updated',report);            

            $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/survey_spot/"+report._id,
                    data : report 
                })
                .then(function(response) {
                    console.log("Updated spot details",response);     
                    reportUpdate.resolve(response);
                }, 
                function (response){
                    console.log('An Error occured while updating the spot details', response);
                    reportUpdate.reject(response);
                });
                return reportUpdate.promise;
        }

        storageService.spotDataSaver = function(report){
            var reportSave = $q.defer();

            console.log('Spot details to be saved',report);
            
            $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/survey_spot/",
                data : report 
            })
            .then(function(response) {
                console.log("Added spot details",response);
                reportSave.resolve(response);
            }, 
            function (response){
                console.log('An Error occured while saving the spot details', response);
                reportSave.reject(response);
            });         
            return reportSave.promise;                               
        };

        storageService.damageDetailsRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_damage_details/'+id);
        };        

        storageService.damageDetailUpdater = function(report){
            var reportUpdate = $q.defer();            
            console.log('Survey damage details to be updated',report);            

            $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/survey_damage_details/"+report._id,
                    data : report 
                })
                .then(function(response) {
                    console.log("Updated a survey damage detail",response);     
                    reportUpdate.resolve(response);
                }, 
                function (response){
                    console.log('An Error occured while saving survey damage detail', response);
                    reportUpdate.reject(response);
                });
                return reportUpdate.promise;
        }

        storageService.damageDetailSaver = function(report){
            var reportSave = $q.defer();

            console.log('Survey damage details to be updated',report);
            
            $http({
                method : "POST",
                url : "http://125.99.24.66:8081/api/survey_damage_details/",
                data : report 
            })
            .then(function(response) {
                console.log("Added a survey damage detail",response);
                reportSave.resolve(response);
            }, 
            function (response){
                console.log('An Error occured while adding survey damage detail', response);
                reportSave.reject(response);
            });         
            return reportSave.promise;                               
        };

        return storageService;
});

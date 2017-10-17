angular.module('MyApp')
    .factory('SRVCBNData', function($rootScope, $http, $q) {

        var PRT = this;
        var storageService = {};

        this.index = '';

        //For java
        // var indexRetriever = function(){
        //     return $http.get('http://125.99.24.66:8081/api/surveys/listsize')            
        // }
        
        var indexRetriever = function(){
            return $http.get('http://125.99.24.66:8081/api/surveys_list/all')            
        }

        storageService.dummy = function() {
            console.log('Hello world from SRVCBNData factory/service!');
        };
        
        storageService.surveyCabinDetailRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_cabin_details?surveyId='+id);
            // return $http.get('http://125.99.24.66:8081/api/survey_cabin_details/'+id);
        };

        storageService.surveyCabinDetailUpdater = function(detail){
//            console.log('Survey cabin details to be updated',detail);            
            return $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/survey_cabin_details/",
                    // url : "http://125.99.24.66:8081/api/survey_cabin_details/"+detail._id,
                    data : detail 
                })
        }

        storageService.surveyCabinDetailSaver = function(report){            
            return $http({ method : "POST", url : "http://125.99.24.66:8081/api/survey_cabin_details/", data : report })                                                 
        };

        storageService.surveyCabinDetailSaverOld = function(report){
            var surveyCabinDetailSave = $q.defer();
            console.log('Survey cabin details to be saved',report);            
            if(report.survey_id == null){
                indexRetriever()
                    .then(function(response){
                        
                        // PRT.index = response.data.result[response.data.result.length - 1]._id;

                        //Uncomment when on Java
                        PRT.index = response.data.max_id;                    
                        report.survey_id = PRT.index;                        
                        
                        $http({
                            method : "POST",
                            url : "http://125.99.24.66:8081/api/survey_cabin_details/",
                            data : report 
                        })
                        .then(function(response) {
                            console.log("Survey cabin details added",response);
                            surveyCabinDetailSave.resolve(response);
                        }, 
                        function (response){
                            console.log('An Error occured while saving', response);
                            surveyCabinDetailSave.reject(response);
                        });
                    }).catch(function(error){
                        console.log('Error retrieving index of last saved survey',error);
                    });  
            }
            else{
                $http({
                    method : "POST",
                    url : "http://125.99.24.66:8081/api/survey_cabin_details/",
                    data : report 
                })
                .then(function(response) {
                    console.log("Survey cabin details added",response);
                    surveyCabinDetailSave.resolve(response);
                }, 
                function (response){
                    console.log('An Error occured while saving', response);
                    surveyCabinDetailSave.reject(response);
                });
            }
                     
            return surveyCabinDetailSave.promise;                               
        };

        storageService.surveyCabinMasterRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_cabin_master?surveyId='+id);
        };

        // storageService.surveyCabinMasterSaverOld = function(report){
        //         $http({
        //             method : "POST",
        //             url : "http://125.99.24.66:8081/api/survey_cabin_master/",
        //             data : report 
        //         })
        // }

        storageService.surveyCabinMasterSaverOld = function(report){
            var surveyCabinMasterSave = $q.defer();            
            console.log('Survey cabin detail masters to be saved',report);            
            
            if(report.survey_id == null){

                indexRetriever()
                    .then(function(response){
                        
                        // PRT.index = response.data.result[response.data.result.length - 1]._id;

                        //Uncomment when on Java
                        PRT.index = response.data.max_id;                    
                        
                        console.log("Got all insurance reports to find newest _id which was",PRT.index,response);
                        report.survey_id = PRT.index;

                        $http({
                                method : "POST",
                                url : "http://125.99.24.66:8081/api/survey_cabin_master/",
                                data : report 
                            })
                            .then(function(response) {
                                console.log("Survey cabin master updated",response);     
                                surveyCabinMasterSave.resolve(response);                    
                            }, 
                            function (response){
                                console.log('An Error occured while updating', response);
                                surveyCabinMasterSave.reject(response);
                            });
                    }).catch(function(error){
                        console.log('Error retrieving index of last saved survey',error);
                    })                    
            }
            else{
                $http({
                    method : "POST",
                    url : "http://125.99.24.66:8081/api/survey_cabin_master/",
                    data : report 
                })
                .then(function(response) {
                    console.log("Survey cabin master saved",response);     
                    surveyCabinMasterSave.resolve(response);                    
                }, 
                function (response){
                    console.log('An Error occured while saving', response);
                    surveyCabinMasterSave.reject(response);
                });
            }
            return surveyCabinMasterSave.promise;
        }

        storageService.surveyCabinMasterUpdater = function(report){
            var surveyCabinMasterUpdate = $q.defer();
//            console.log('Survey cabin detail masters to be updated',report);            
            $http({
                method : "PUT",
                url : "http://125.99.24.66:8081/api/survey_cabin_master/",
                // url : "http://125.99.24.66:8081/api/survey_cabin_master/"+report._id,
                data : report 
            })
            .then(function(response) {
                console.log("Survey cabin master updated",response);
                surveyCabinMasterUpdate.resolve(response);
            }, 
            function (response){
                console.log('An Error occured while updating', response);
                surveyCabinMasterUpdate.reject(response);
            });         
            return surveyCabinMasterUpdate.promise;                               
        };
        
        storageService.surveyCabinDetailDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/survey_cabin_details?id='+id)            
        }              

        return storageService;
});

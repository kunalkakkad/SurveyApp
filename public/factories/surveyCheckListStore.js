angular.module('MyApp')
    .factory('SRCHKData', function($rootScope, $http, $q) {

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
            console.log('Hello world from SRCHKData factory/service!');
        };
        
        storageService.surveyCheckListRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_check_list?surveyId='+id);
            // return $http.get('http://125.99.24.66:8081/api/survey_check_list/'+id);
        };

        storageService.surveyCheckListUpdater = function(checkListItem){
            var surveyCheckListUpdate = $q.defer();            
            console.log('Check List Item to be updated',checkListItem);            
            $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/survey_check_list/",
                    // url : "http://125.99.24.66:8081/api/survey_check_list/"+checkListItem._id,
                    data : checkListItem 
                })
                .then(function(response) {
                    console.log("CheckList Item updated",response);     
                    surveyCheckListUpdate.resolve(response);                    
                }, 
                function (response){
                    console.log('An Error occured while updating', response);
                    surveyCheckListUpdate.reject(response);
                });
                return surveyCheckListUpdate.promise;
        }

        storageService.surveyCheckListSaver = function(checkListItem){
            console.log('Check List Item to be saved',checkListItem);            
            
            	return $http({
                    method : "POST",
                    url : "http://125.99.24.66:8081/api/survey_check_list/",
                    data : checkListItem 
                })                                                                                                      
        };
        
        storageService.surveyCheckListSaverOld = function(checkListItem){
            var surveyCheckListSave = $q.defer();
            console.log('Check List Item to be saved',checkListItem);            
            
            if(checkListItem.survey_id == null){
                indexRetriever()
                .then(function(response) {
                    // PRT.index = response.data.result[response.data.result.length - 1]._id;

                    //Uncomment when on Java
                    PRT.index = response.data.max_id;                    
                    
                    console.log("Got all insurance reports to find newest _id which was",PRT.index,response);
                    checkListItem.survey_id = PRT.index;
                    
                    $http({
                        method : "POST",
                        url : "http://125.99.24.66:8081/api/survey_check_list/",
                        data : checkListItem 
                    })
                    .then(function(response) {
                        console.log("CheckList Item added",response);
                        surveyCheckListSave.resolve(response);
                    }, 
                    function (response){
                        console.log('An Error occured while saving', response);
                        surveyCheckListSave.reject(response);
                    });            
                })
                .catch(function (response){
                console.log('Errors while retrieving all insurance reports to find the index', response);
                }); 
            }
            else{                
                $http({
                    method : "POST",
                    url : "http://125.99.24.66:8081/api/survey_check_list/",
                    data : checkListItem 
                })
                .then(function(response) {
                    console.log("CheckList Item added",response);
                    surveyCheckListSave.resolve(response);
                }, 
                function (response){
                    console.log('An Error occured while saving', response);
                    surveyCheckListSave.reject(response);
                });
            }                                            
            return surveyCheckListSave.promise;                               
        };

        storageService.surveyCheckListDeleter = function(id){
            return $http.delete('http://125.99.24.66:8081/api/survey_check_list/'+id);
        };
                        
        return storageService;
});

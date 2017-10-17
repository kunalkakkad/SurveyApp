angular.module('MyApp')
    .factory('SVDData', function($rootScope, $http, $q) {

        var PRT = this;
        var storageService = {};

        this.index = '';

        storageService.dummy = function() {
            console.log('Hello world from SVDData factory/service!');
        };
        
        //For java
        // var indexRetriever = function(){
        //     return $http.get('http://125.99.24.66:8081/api/surveys/listsize')            
        // }
        
        var indexRetriever = function(){
            return $http.get('http://125.99.24.66:8081/api/surveys_list/all')            
        }

        storageService.surveysVehicleDetailsRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/survey_vehicle_details?surveyId='+id)                        
            // return $http.get('http://125.99.24.66:8081/api/survey_vehicle_details/'+id)                        
        };
        
        storageService.surveysVehicleDetailsStorer = function(SVD){
            var vehicleDetailStore = $q.defer();

            //02.09.17
            //When survey_id is null, either we're creating a new report, or we're exporting the report.
            //If the survey_id isn't null, it means we already have the _id of the survey, which means when it was created, 
            //the vehicle details weren't saved. Normally, this definitely shouldn't be happening as we require the user to input his 
            //reg no if he's creating a new report and that gets saved in the vehicle_details table. On the off chance that a user
            //managed to save the final report without saving the (reg no)vehicle details too, then this will come into play.

            if(SVD.survey_id == null)
            {
                indexRetriever()
                    .then(function(response) {
                    // PRT.index = response.data.result[response.data.result.length - 1]._id;

                    //Uncomment when on Java
                    PRT.index = response.data.max_id;                    
                    
                    console.log("Got all insurance reports to find newest _id which was",PRT.index,response);
                    SVD.survey_id = PRT.index;                        
                    console.log('Vehicle Details to be added',SVD);

                    $http({
                        method : "POST",
                        url : "http://125.99.24.66:8081/api/survey_vehicle_details/",
                        data : SVD 
                    })
                    .then(function(response) {
                        console.log("Added vehicle details",response);
                        vehicleDetailStore.resolve(response);                          
                    }, 
                    function (response){
                        console.log('Errors while saving vehicle details', response);
                        vehicleDetailStore.reject(response);
                    });                        
                }, 
                function (response){
                    console.log('Errors while retrieving all insurance reports to find the index', response);
                }).catch(function (response){
                    console.log('Errors while retrieving all insurance reports to find the index', response);
                });                
            }
            else{

                console.log('Vehicle Details to be added',SVD);
                
                $http({
                    method : "POST",
                    url : "http://125.99.24.66:8081/api/survey_vehicle_details/",
                    data : SVD 
                })
                .then(function(response) {
                    console.log("Added vehicle details",response);
                    vehicleDetailStore.resolve(response);                          
                }, 
                function (response){
                    console.log('Errors while saving vehicle details', response);
                    vehicleDetailStore.reject(response);
                });
            }
            
            return vehicleDetailStore.promise;
        };
        
        storageService.surveysVehicleDetailsUpdater = function(SVD){
            var vehicleDetailsUpdate = $q.defer();
            console.log('Vehicle Details to be updated',SVD);
            
            $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/survey_vehicle_details/",
                    // url : "http://125.99.24.66:8081/api/survey_vehicle_details/"+SVD.survey_id,
                    data : SVD 
                })
                .then(function(response) {
                    console.log("Vehicle details updated",response);                          
                    vehicleDetailsUpdate.resolve(response);    
                }, 
                function (response){
                    console.log('Errors occured while updating the vehicle details', response);
                    vehicleDetailsUpdate.reject(response);
                });                        
                return vehicleDetailsUpdate.promise;
        };
        
        return storageService;
});

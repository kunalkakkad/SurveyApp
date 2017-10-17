angular.module('MyApp')
    .factory('BNKData', function($rootScope,$http,$log,$q) {

        var storageService = {};

        storageService.bankRetriever = function(){
            // console.info('Bank retrieval');
            return $http.get('http://125.99.24.66:8081/api/banks/')
        };

        var bankCreator = $q.defer();
        storageService.bankCreator = function(data){
            console.log('New bank being created',data);
            
            $http({
                    method : "POST",
                    url : "http://125.99.24.66:8081/api/banks/",
                    data : data 
                })
                .then(function(response) {
                    console.log("Created bank",response);                          
                    bankCreator.resolve();    
                }, 
                function (response){
                    console.log('Errors', response);
                    bankCreator.reject();
                });                        
                return bankCreator.promise;
        };

        var bankUpdater = $q.defer();
        storageService.bankUpdater = function(data){
            console.log('Bank being updated',data);
            
            $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/banks/" + data._id,
                    data : data 
                })
                .then(function(response) {
                    console.log("Updating bank details",response);                          
                    bankUpdater.resolve();    
                }, 
                function (response){
                    console.log('Errors', response);
                    bankUpdater.reject();
                });                        
                return bankUpdater.promise;
        };
        
        storageService.bankDeleter = function(bank){
            return $http.delete('http://125.99.24.66:8081/api/banks/'+bank._id)
        };
        
        return storageService;
});

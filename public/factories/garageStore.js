angular.module('MyApp')
    .factory('GRGData', function($rootScope,$http,$log) {

        var garageData = this;
        var storageService = {};
        var insBranch;

        storageService.dummy = function() {
            console.log('Hello world from GRGData factory/service!');
        };

        storageService.garageRetriever = function(){
            // console.info('Garage retrieval');
            return $http.get('http://125.99.24.66:8081/api/garages/')
        };
                
        return storageService;
});

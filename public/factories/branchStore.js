angular.module('MyApp')
    .factory('BRCHData', function($rootScope,$http,$log) {

        var BranchData = this;
        var storageService = {};
        var insBranch;

        storageService.dummy = function() {
            console.log('Hello world from BRCHData factory/service!');
        };

        storageService.branchRetriever = function(id){
            // console.info('Branch Retrieval');
            return $http.get('http://125.99.24.66:8081/api/branches?insurerId='+id)
            // return $http.get('http://125.99.24.66:8081/api/branches/'+id)
        };
                
        return storageService;
});

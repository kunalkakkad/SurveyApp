angular.module('MyApp')
    .factory('MDL', function(VCLData,INSData,BNKData,GRGData,BRCHData,$rootScope,$http,$q) {

        var PRT = this;
        var storageService = {};
                
        storageService.dummy = function() {
            console.log('Hello world from VCLData factory!');
        };
        
        storageService.loadVehicles = function(){
            return VCLData.vehicleRetriever();                                   
        };

        storageService.loadInsurers = function(){
            return INSData.insurerRetriever();
        };
        
        storageService.loadBanks = function(){
            return BNKData.bankRetriever();            
        };

        storageService.loadGarages = function(){
            return GRGData.garageRetriever();                   
        };
        
        storageService.vehicleHandler = function(){
            storageService.loadVehicles()
                .then(function(response){
                    // console.info('Vehicle data',response);
                     $rootScope.masterVehiclesList = response.data;
//                    $rootScope.masterVehiclesList = response.data.result;
                    $rootScope.masterVehiclesListLoaded = true;
                     console.info('Vehicles loaded',response.data);                    
//                    console.info('Vehicles loaded',response.data.result);                    
                },function(error){
                    console.info('An error occured while retrieving the vehicles',error);
                    $rootScope.masterVehiclesListLoaded = false;                    
                }).catch(function(error){
                    console.error('Error retrieving Vehicles data',error);
                });                   
        };
        storageService.insurerHandler = function(){
            storageService.loadInsurers()
                .then(function(res){
                    // console.info('Insurer data',res)
                     $rootScope.masterInsurersList = res.data;
//                    $rootScope.masterInsurersList = res.data.result;
                    $rootScope.masterInsurersListLoaded = true;
                     console.info('Master Insurer data',res.data);                
//                    console.info('Master Insurer data',res.data.result);                
                },function(err){
                    console.info('An error occured while retrieving the insurers',err)
                    $rootScope.masterInsurersListLoaded = false;
                }).catch(function(error){
                    console.error('Error retrieving Insurers data',error);
                });                   
        };
        storageService.garageHandler = function(){
            storageService.loadGarages()
                .then(function(response){
                     $rootScope.masterGaragesList = response.data;
//                    $rootScope.masterGaragesList = response.data.result;
                    $rootScope.masterGaragesListLoaded = true;
                     console.info('Garages loaded',response.data);
//                    console.info('Garages loaded',response.data.result);
                },function(err){
                    console.info('An error occured while retrieving the garages',error);
                    $rootScope.masterGaragesListLoaded = false;
                }).catch(function(error){
                    console.error('Error retrieving Garages data',error);
                });                   
        };
        storageService.bankHandler = function(){
            storageService.loadBanks()
                .then(function(response){
                     $rootScope.masterBanksList = response.data;
//                    $rootScope.masterBanksList = response.data.result;
                    $rootScope.masterBanksListLoaded = true;
                     console.info('Banks loaded',response.data);
//                    console.info('Banks loaded',response.data.result);
                },function(err){
                    console.info('An error occured while retrieving the banks',error);
                    $rootScope.masterBanksListLoaded = false;
                }).catch(function(error){
                    console.error('Error retrieving Banks data',error);
                });                   
        };
        storageService.load = function(){
            
            storageService.vehicleHandler();
            storageService.insurerHandler();	
            storageService.garageHandler();
            storageService.bankHandler();                                                
                        
        }

        if($rootScope.masterVehiclesListLoaded){  
            console.info('The Vehicles data was loaded previously, using that');
            return;        
        }else{
            console.info('Retrieving Vehicles data from DB');
            storageService.vehicleHandler();
        }
        
        if($rootScope.masterInsurersListLoaded){  
            console.info('The Insurers data was loaded previously, using that');
            return;        
        }else{
            console.info('Retrieving Insurers data from DB');
            storageService.insurerHandler();
        }
        
        if($rootScope.masterBanksListLoaded){  
            console.info('The Banks data was loaded previously, using that');
            return;        
        }else{
            console.info('Retrieving Banks data from DB');
            storageService.garageHandler();
        }

        if($rootScope.masterGaragesListLoaded){  
            console.info('The Garages data was loaded previously, using that');
            return;        
        }else{
            console.info('Retrieving Garages data from DB');
            storageService.bankHandler();
        }

        return storageService;
});

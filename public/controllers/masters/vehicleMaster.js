angular.module('MyApp').controller("vehicleMaster", function ($rootScope, $scope, $http, $uibModalInstance, $timeout, toastr, VCLData, Account, $q) {
    
    console.log('Live from new Vehicle Master!');

    // Flag for button which calls add part button
    $scope.vehicleHasBeenSelected = false; 
    $scope.vehiclePartHasBeenSelected = false;
    $rootScope.selectedVehicle = {};    

    // 29.08.17 Another flag to track if a part is currently being added. If true, then user cannot click the add button. Set to
    // false once a repsonse is received upon either failure or success.    
    $scope.partAdditionInProgress = false;
    $scope.savingVehicleData = false;
    $scope.selectedVehiclePart = {}; 

    $scope.newPart = {      
        Sr_No: '',
        Part_Name: '',
        Rate: '',
        Part_Type: '',
        user_id: '',
        vehicle_id:''                
    };

    $scope.clearSelection = function(){
        console.log('Clearing all data');
        $scope.vehiclePartHasBeenSelected = false; 
        $scope.vehicleHasBeenSelected = false;         
        $rootScope.selectedVehicle = {};    
        $scope.selectedVehiclePart = {}; 
        // $scope.loadVehiclePartsData();           
    }

    $scope.addVehicle = function(){
        toastr.info('Enter data in the fields and click Create Vehicle');
        $scope.clearSelection(); 
    }

    $scope.loadVehiclesData = function(){
        if($rootScope.masterVehiclesListLoaded)
            $scope.vehicleTableGridOptions.data = $rootScope.masterVehiclesList;
        else{
            MDL.loadVehicles()
                .then(function(res){
                    $scope.vehicleTableGridOptions.data = res.data.result;
                    console.log('Master vehicles loaded promise',res);                
                },function(err){
                    console.log('Error retrieving Vehicles',err);
                }).catch(function(error){
                    console.log('Error retrieving Vehicles',error)
            });
        }
        
    }    
    
    $scope.loadVehiclesPartsData = function(id){
        VCLData.vehiclePartsRetriever(id)
            .then(function(response) {
                $scope.vehiclePartsTableGridOptions.data = angular.copy(response.data);
                $scope.originalPartsData = angular.copy($scope.vehiclePartsTableGridOptions.data);
                console.log('Vehicle Parts retrieved',$scope.vehiclePartsTableGridOptions.data);                        
            },function (response) {
                console.log('Errors', response);
            }).catch(function(error){
                console.log('Error retrieving Vehicle Parts',error)
        });
    }    

    $scope.saveVehicle = function(){
        $scope.savingVehicleData = true;

        if($rootScope.selectedVehicle.Vehicle_Name != '' && $rootScope.selectedVehicle.Vehicle_Name != undefined){
            if($rootScope.selectedVehicle.Make_Model != '' && $rootScope.selectedVehicle.Make_Model != undefined){
                if($rootScope.selectedVehicle.Body_Type != '' && $rootScope.selectedVehicle.Body_Type != undefined){
                    
                    if($rootScope.selectedVehicle.hasOwnProperty('_id')){
                            
                            $rootScope.selectedVehicle.updated_at = moment($rootScope.selectedVehicle.updated_at).format("YYYY-MM-DD hh:mm:ss");
                            $rootScope.selectedVehicle.created_at = moment($rootScope.selectedVehicle.created_at).format("YYYY-MM-DD hh:mm:ss");
                
                            VCLData.vehicleUpdater($rootScope.selectedVehicle)
                                .then(function(response){
                                    $rootScope.selectedVehicle = {};
                                    $scope.loadVehiclesData();
                                    //29.08.17 Data has updated, user can call this function to update data again
                                    $scope.savingVehicleData = false;                                
                                },function(error){
                                    //29.08.17 Data hasn't updated, user can call this function to try updating data again                                    
                                    $scope.savingVehicleData = false;                                
                            })
                        }
                        else{
                            VCLData.vehicleCreator($rootScope.selectedVehicle)
                                .then(function(response){
                                    $rootScope.selectedVehicle = {};
                                    $scope.loadVehiclesData();
                                    $scope.savingVehicleData = false;
                                    //29.08.17 Data has saved, user can call this function to save data again                                                                                                        
                                },function(error){
                                    //29.08.17 Data hasn't saved, user can call this function to try saving data again                                                                        
                                    $scope.savingVehicleData = false;                                
                            });
                        }
                }
                else
                    toastr.error('Please enter a valid Body Type','Vehicle Name')            
            }
            else
                toastr.error('Please enter a valid Make & Model','Vehicle Name')                                    
        }
        else    
            toastr.error('Please enter a valid Vehicle Name','Vehicle Name')
    }

    $scope.addPart = function(newPart)
    {   

        if(!$scope.vehicleHasBeenSelected){
            toastr.warning('You need to select a vehicle first...');
            return 0;              
        }

        console.log('Inputs',newPart);      
        if(newPart.Part_Name == '' || newPart.Part_Name == undefined)
            toastr.warning('Please enter the part description!');  
        if(newPart.Rate == '' || newPart.Rate == undefined)
            toastr.warning('Please enter the rate for that part!');          
        if(newPart.Part_Type == '' || newPart.Part_Type == undefined)
            toastr.warning('Please enter the type of that part!');  

        if(Number.parseFloat($scope.newPart.Rate) == NaN)
            toastr.warning('The Rate must be a number!');  
        
        if(newPart.Part_Name != '' && newPart.Part_Name != undefined && newPart.Rate != '' && Number.parseFloat(newPart.Rate) != NaN && newPart.Rate != undefined && newPart.Part_Type != '' && newPart.Part_Type != undefined)
            {   
                $scope.partAdditionInProgress = true;                
                
                newPart.Sr_No = $scope.vehiclePartsTableGridOptions.data.length + 1;
                newPart.vehicle_id = $rootScope.selectedVehicle._id;
                
                console.log('New part is',newPart);
                
                newPart.Rate = Number.parseFloat(newPart.Rate);

                VCLData.vehiclePartStorer(newPart)
                .then(function(){
                    
                    $scope.newPart = {      
                        Sr_No: '',
                        Part_Name: '',
                        Rate: '',
                        Part_Type: '',
                        user_id: '',
                        vehicle_id:''                
                    };
        
                    $scope.partAdditionInProgress = false;   
                    $scope.loadVehiclesPartsData($rootScope.selectedVehicle._id);                                                                                             
                })                                                                                                       
            }
    };

    //Unused
    $scope.addParts123123 = function(data)
    {   
        console.log('Inputs',data);      
        
                    

        if(data.Start == '')
            toastr.warning('The from field can\'t be empty!');  
        if(data.End == '')
            toastr.warning('The to field can\'t be empty!');          
        if(data.Amount == '')
            toastr.warning('Please enter an amount!');  

        if(Number.parseFloat(data.Start) == NaN)
            toastr.warning('The from field must be a number!');  
        if(Number.parseFloat(data.End) == NaN)
            toastr.warning('The to field must be a number!');          
        if(Number.parseFloat(data.Amount) == NaN)
            toastr.warning('The Amount must be a number!');  
        
        console.log('Reached here');

        if(data.Start != '' && data.End != '' && data.Amount != '' && Number.parseFloat(data.Start) != NaN && Number.parseFloat(data.End) != NaN && Number.parseFloat(data.Amount) != NaN)
            {   
                $scope.feeAdditionInProgress = true;                
                data.Sr_No = $scope.insurerFeesTableGridOptions.data.length + 1;
                data.insurer_id = $rootScope.selectedInsurer._id;                
                
                console.log('Data to save', data);

                data.Start = Number.parseFloat(data.Start);
                data.End = Number.parseFloat(data.End);
                data.Amount = Number.parseFloat(data.Amount);
                
                INSData.insurerFeeCreator(data)
                    .then(function(res){
                        $scope.data = {      
                            Sr_No: '',
                            Start: '',
                            End: '',
                            Amount: '',
                            insurer_id:''                
                        };
                        $scope.feeAdditionInProgress = false;                        
                        $scope.loadVehiclesPartsData($rootScope.selectedVehicle._id);                                        
                    },function(err){
                        console.error('There was an error',err);
                });    
            }
    
        console.log('Reached here');
            
    };

    $scope.updateParts = function(){			  

        $scope.noChanges = true;

        if(!$scope.vehicleHasBeenSelected){
            toastr.warning('You need to select a vehicle!', 'Warning');            
            return 0;
        }

        if($scope.vehiclePartsTableGridOptions.data.length == 0){            
            toastr.info('No data to update...', 'Information');        
            console.log('No data to update...');
            return 0;
        }

        console.log('To update',$scope.vehiclePartsTableGridOptions.data);
        $scope.vehiclePartsTableGridOptions.data.forEach(function(part,index){
            if(part.Part_Name != $scope.originalPartsData[index].Part_Name || part.Rate != $scope.originalPartsData[index].Rate || part.Part_Type != $scope.originalPartsData[index].Part_Type)
            {   
                $scope.noChanges = false;                
                // console.log('Fee',fee);
                // console.log('Fee 2',$scope.originalFeesData[index]);            
                console.log('The element ',part,' at index ',index,' needs to be updated');
                part.updated_at = (part.updated_at == null) ? null : moment(part.updated_at).format("YYYY-MM-DD hh:mm:ss");
                part.created_at = (part.created_at == null) ? null : moment(part.created_at).format("YYYY-MM-DD hh:mm:ss");
                console.log('The element ',part,' at index ',index,' will be updated');                
                VCLData.vehiclePartUpdater(part)
                    .then(function(response){
                        console.log('Succesfully updated a record',response);
                        toastr.success('A record was successfully updated!')
                    },function(err){
                        console.error('There was an error',err)
                });                
            }
            console.log('Element No', index, part);
        })  
        if($scope.noChanges)
            toastr.info('No changes to update...');                          
    };
    
    $scope.deleteVehicle = function(){			
        console.log("To delete", $rootScope.selectedVehicle);        
        // VCLData.vehicleDeleter($rootScope.selectedVehicle)
        //     .then(function(response){
        //         console.log('Vehicle deleted',response);
        //         toastr.success('The Vehicle was successfully deleted','Vehicle deleted')
        //     })
    };

    $scope.deletePart = function(index){

        if($scope.vehiclePartHasBeenSelected){
            console.log("To delete", $scope.selectedVehiclePart);        
            VCLData.vehiclePartDeleter($scope.selectedVehiclePart)
                .then(function(response){
                    console.log('Vehicle part deleted',response);
                    toastr.success('The part was Successfully deleted','Part deleted');
                    $scope.selectedVehiclePart = {};    
                    $scope.vehiclePartsTableGridOptions.data = {};
                    $scope.vehiclePartHasBeenSelected = false;                                 
                    $scope.loadVehiclesPartsData($rootScope.selectedVehicle._id);
                });
        }
        else
            toastr.warning('You must select a part in order to delete it..','No Part Selected');
    };

    $scope.vehicleTableGridColumns = [
    { name: "Vehicle Name",field: "Vehicle_Name", width: "100" },
    { name: "Make",field: "Make_Model",width: "250" },
    { name: "Vehicle Type", field: "Vehicle_Class", width: "100", /*enableCellEdit: true*/ },
    { name: "Body", field: "Body_Type",width: "120", /*enableCellEdit: true*/ },    
    { name: "Tax", field: "Tax_Particulars",width: "100", /*enableCellEdit: true*/ },
    { name: "Authorization", field: "Authorization", width: "100", /* enableCellEdit: true */ },
    { name: "Cubic Capacity", field: "Cubic_Capacity", width: "90" }];

    $scope.msg = {};
    $scope.rowSelected = 0;

    $scope.vehicleTableGridOptions = {  
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.vehicleTableGridColumns,
        // data : VCLData.vehicleRetriever(),
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){   
                $scope.vehicleHasBeenSelected = true;                 
                $rootScope.selectedVehicle = angular.copy(row.entity);
                console.log('Vehicle Selected',$rootScope.selectedVehicle);
                $scope.loadVehiclesPartsData($rootScope.selectedVehicle._id);                
            });            
        }				  
    };

    $scope.vehiclePartsTableGridColumns = [
    { name: "Part Description",field: "Part_Name", width: "270" },
    { name: "Rate",field: "Rate",width: "200" },
    { name: "Type", field: "Part_Type", width: "250", /*enableCellEdit: true*/ }];

    // $scope.msg = {};
    $scope.rowSelected = 0;

    $scope.vehiclePartsTableGridOptions = {  
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.vehiclePartsTableGridColumns,
        // data : VCLData.vehicleRetriever(),
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){                                
                $scope.selectedVehiclePart = row.entity;
                $scope.vehiclePartHasBeenSelected = true;                
                console.log('Vehicle Part Selected',$scope.selectedVehiclePart);                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('After table edit',$scope.vehiclePartsTableGridOptions.data);  
            });
        }				  
    };
    
    if($rootScope.masterVehiclesListLoaded)
        $scope.vehicleTableGridOptions.data = $rootScope.masterVehiclesList;
    else{  
        $scope.loadVehiclesData();                  
    }    

    $scope.newPart = {};
    
    $scope.showChange = function(){
        console.log('New part is',$rootScope.selectedVehicle.parts);        
    };

    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
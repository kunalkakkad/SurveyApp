angular.module('MyApp').controller("insurerMaster", function ($rootScope, $scope, $http, $uibModalInstance, $timeout, toastr, INSData, MDL) {
    
    console.log('Live from new Insurer Master!');

    // Flag for button which calls add fee button
    $scope.insurerHasBeenSelected = false; 
    $scope.insurerFeesHasBeenSelected = false;

    // 25.08.17 Another flag to track if a fee is currently being added. If true, then user cannot click the add button. Set to
    // false once a repsonse is received upon either failure or success.    
    $scope.feeAdditionInProgress = false;
 
    $scope.savingInsurerData = false;

    // $rootScope.selectedInsurer = {};    
    $scope.selectedInsurerFees = {};    

    $scope.data = {      
        Sr_No: '',
        Start: '',
        End: '',
        Amount: '',
        Insurer_id:''                
    };

    $scope.showChange = function(){};

    $scope.clearSelection = function(){
        console.log('Clearing all data');
        $scope.insurerFeesHasBeenSelected = false; 
        $scope.insurerHasBeenSelected = false;         
        $rootScope.selectedInsurer = {};    
        $scope.selectedInsurerFees = {}; 
        // $scope.loadInsurersFeeData();           
    }

    $scope.addInsurer = function(){
        toastr.info('Enter data in the fields and click Create Insurer');
        $scope.clearSelection(); 
    }
        
    $scope.saveInsurer = function(){
        //25.08.17 Flag - Insurer data is in the process of saving, so prevent another call to this method
        $scope.savingInsurerData = true;    
        console.log('Saving data',$rootScope.selectedInsurer);
        
        if($rootScope.selectedInsurer.Insurer_Name != '' && $rootScope.selectedInsurer.Insurer_Name != undefined && $rootScope.selectedInsurer.Insurer_Name != null)
        {   
            console.log('Insurer Name alright');
            if($rootScope.selectedInsurer.Short_Name != '' && $rootScope.selectedInsurer.Short_Name != undefined && $rootScope.selectedInsurer.Short_Name != null)
            {   
                console.log('Insurer Short Name alright');                
                if($rootScope.selectedInsurer.Fee_Based != '' && $rootScope.selectedInsurer.Fee_Based != undefined && $rootScope.selectedInsurer.Fee_Based != null)
                {
                    console.log('Insurer Fee Basis alright');                                
                    if($rootScope.selectedInsurer.bank_id != '' && $rootScope.selectedInsurer.bank_id != undefined && $rootScope.selectedInsurer.bank_id != null)
                    {           
                        $rootScope.selectedInsurer.bank_id = $rootScope.selectedInsurer.bank_id._id;
                        console.log('Insurer bank id alright, Beginning save/update');

                        if($rootScope.selectedInsurer.hasOwnProperty('_id')){
                            
                            $rootScope.selectedInsurer.updated_at = moment($rootScope.selectedInsurer.updated_at).format("YYYY-MM-DD hh:mm:ss");
                            $rootScope.selectedInsurer.created_at = moment($rootScope.selectedInsurer.created_at).format("YYYY-MM-DD hh:mm:ss");
                
                            INSData.insurerUpdater($rootScope.selectedInsurer)
                                .then(function(response){
                                    $rootScope.selectedInsurer = {};
                                    $scope.loadInsurersData();
                                    //25.08.17 Data has updated, user can call this function to update data again
                                    $scope.savingInsurerData = false;                                
                                },function(error){
                                    //25.08.17 Data hasn't updated, user can call this function to try updating data again                                    
                                    $scope.savingInsurerData = false;                                
                            })
                        }
                        else{
                            INSData.insurerCreator($rootScope.selectedInsurer)
                                .then(function(response){
                                    $rootScope.selectedInsurer = {};
                                    $scope.loadInsurersData();
                                    $scope.savingInsurerData = false;
                                    //25.08.17 Data has saved, user can call this function to save data again                                                                                                        
                                },function(error){
                                    //25.08.17 Data hasn't saved, user can call this function to try saving data again                                                                        
                                    $scope.savingInsurerData = false;                                
                            });
                        }
                    }
                }        
            }            
        }
    }

    $scope.addFees = function(data)
    {   
        console.log('Inputs',data);      
        
        if(!$scope.insurerHasBeenSelected){
            toastr.warning('You need to select an insurer first...');
            return 0;              
        }            

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
                data.Insurer_id = {'_id': $rootScope.selectedInsurer._id};
                
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
                        $scope.loadInsurersFeeData($rootScope.selectedInsurer._id);                                        
                    },function(err){
                        console.error('There was an error',err);
                });    
            }
    
        console.log('Reached here');
            
    };        

    $scope.loadInsurersData = function(){
        if($rootScope.masterInsurersListLoaded)
            $scope.insurerTableGridOptions.data = $rootScope.masterInsurersList;
        else{
            MDL.loadInsurers()
                .then(function(res){
                    $scope.insurerTableGridOptions.data = res.data;
                    console.log('Master insurers loaded promise',res);                
                },function(err){
                    console.log('Error retrieving Insurers',err);
                }).catch(function(error){
                    console.log('Error retrieving Insurers',err)
            });
        }
        
    }    
    
    $scope.loadInsurersFeeData = function(id){
        INSData.insurerFeeRetriever(id)
            .then(function(response) {
                $scope.insurerFeesTableGridOptions.data = angular.copy(response.data);
                $scope.originalFeesData = angular.copy($scope.insurerFeesTableGridOptions.data);
                console.log('Insurer fees retrieved',$scope.insurerFeesTableGridOptions.data);                        
            },function (response) {
                console.log('Errors', response);
            }).catch(function(error){
                console.log('Error retrieving Insurer Fees',err)
        });
    } 

    $scope.updateFees = function(){			  

        $scope.noChanges = true;

        if(!$scope.insurerHasBeenSelected){
            toastr.warning('You need to select an insurer!', 'Warning');            
            return 0;
        }

        if($scope.insurerFeesTableGridOptions.data.length == 0){            
            toastr.info('No data to update...', 'Information');        
            console.log('No data to update...');
            return 0;
        }

        console.log('To update',$scope.insurerFeesTableGridOptions.data);
        $scope.insurerFeesTableGridOptions.data.forEach(function(fee,index){
            if(fee.Amount != $scope.originalFeesData[index].Amount || fee.Start != $scope.originalFeesData[index].Start || fee.End != $scope.originalFeesData[index].End)
            {   
                $scope.noChanges = false;                
                // console.log('Fee',fee);
                // console.log('Fee 2',$scope.originalFeesData[index]);            
                console.log('The element ',fee,' at index ',index,' needs to be updated');
                fee.updated_at = moment(fee.updated_at).format("YYYY-MM-DD hh:mm:ss");
                fee.created_at = moment(fee.created_at).format("YYYY-MM-DD hh:mm:ss");
                console.log('The element ',fee,' at index ',index,' will be updated');                
                INSData.insurerFeeUpdater(fee)
                    .then(function(response){
                        console.log('Succesfully updated a record',response);
                        toastr.success('A record was successfully updated!')
                    },function(err){
                        console.error('There was an error',err)
                });                
            }
            console.log('Element No', index, fee);
        })  
        if($scope.noChanges)
            toastr.info('No changes to update...');                          
    };

    $scope.deleteInsurer = function(){			  
        console.log('To delete',$rootScope.selectedInsurer);
        
        // TODO Enable when API made and tested on Ashish side
        
        // INSData.insurerDeleter($scope.selectedInsurer._id)
        //     .then(function(res){
        //         $rootScope.selectedInsurer = {};    
        //         $scope.selectedInsurerFees = {};    
        //         $scope.insurerFeesTableGridOptions.data = {};
        //         $scope.insurerFeesHasBeenSelected = false;                                 
        //         $scope.loadInsurersData();
        //     },function(err){
        //         console.log('An error occured',err);
        //     });                          
    };

    $scope.deleteFee = function(){			  
        console.log('To delete',$scope.selectedInsurerFees);
        INSData.insurerFeeDeleter($scope.selectedInsurerFees._id)
            .then(function(res){
                $scope.selectedInsurerFees = {};    
                $scope.insurerFeesTableGridOptions.data = {};
                $scope.insurerFeesHasBeenSelected = false;                                 
                $scope.loadInsurersFeeData($rootScope.selectedInsurer._id);
            },function(err){
                console.log('An error occured',err);
                $scope.loadInsurersFeeData($rootScope.selectedInsurer._id);
            });                          
    };
    
    $scope.insurerTableGridColumns = [
      {
        name: "Insurer Name",
        field: "Insurer_Name",
        width: "350"
      },
      {
        name: "Acronym",
        field: "Short_Name",
        width: "100"
      },
      {
        name: "Fee Based",
        field: "Fee_Based",
        width: "100",
        // enableCellEdit: true
      },
      {
        name: "TAT",
        field: "TAT",
        width: "100",
        // enableCellEdit: true
      },
      {
        name: "Spot Fee",
        field: "Spot_Fee",
        width: "100",
        // enableCellEdit: true
      },
      {
        name: "KM Rate",
        field: "KM_Rate",
        width: "100",
        // enableCellEdit: true
      }
    ];
    
    $scope.insurerTableGridOptions = {
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.insurerTableGridColumns,
        // data: $scope.data,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.insurerHasBeenSelected = true; 
                $scope.insurerFeesHasBeenSelected = false;
                $scope.insurerCreateMode = false;

                $rootScope.selectedInsurer = angular.copy(row.entity);
                console.log('Insurer Selected',$rootScope.selectedInsurer);
                if($rootScope.selectedInsurer.Active = 1)
                    $rootScope.selectedInsurer.Active = true;
                $scope.loadInsurersFeeData($rootScope.selectedInsurer._id);                
            });
            
            // gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            //     $scope.$apply();
            //     console.log('After table edit',$scope.insurerTableGridOptions.data);  
            // });
        }				  
    };

    $scope.insurerFeesTableGridColumns = [
      {
        name: "#",
        field: "Sr_No",
        width: "75"
      },
      {
        name: "From",
        field: "Start",
        width: "204"
      },
      {
        name: "To",
        field: "End",
        width: "204",
        // enableCellEdit: true
      },
      {
        name: "Amount",
        field: "Amount",
        width: "300",
        // enableCellEdit: true
      }];

    $scope.insurerFeesTableGridOptions = {
        enableRowSelection: false,
        multiSelect : false,
        columnDefs: $scope.insurerFeesTableGridColumns,
        // data: $scope.data,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.insurerFeesHasBeenSelected = true; 
                $scope.selectedInsurerFees = angular.copy(row.entity);
                console.log('Insurer Fees Selected',$scope.selectedInsurerFees);                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('After table edit',$scope.insurerFeesTableGridOptions.data);  
                console.log('After table edit',rowEntity);  
            });
        }				  
    };

    if($rootScope.masterInsurersListLoaded)
        $scope.insurerTableGridOptions.data = $rootScope.masterInsurersList;
    else{        
        $scope.loadInsurersData();
    }

    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
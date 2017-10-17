angular.module('MyApp').controller("bankMaster", function ($rootScope, $scope, $http, $uibModalInstance, $timeout, toastr,MDL, BNKData) {
    
    console.log('Live from new Bank Master!');


    $rootScope.selectedBank = {};
    $scope.bankHasBeenSelected = false;  

    $scope.loadBanks = function(){
        if($rootScope.masterBanksListLoaded)
            $scope.bankTableGridOptions.data = $rootScope.masterBanksList;
        else{
            MDL.loadBanks()
                .then(function(res){
                    $scope.bankTableGridOptions.data = $rootScope.masterBanksList;
                    console.log('Master banks list loaded',$rootScope.masterBanksList);                
                },function(err){
                    console.log('Error retrieving banks list',err);
                }).catch(function(error){
                    console.log('Error retrieving Vehicles',error)
            });
        }    
    }   

    $scope.bankTableGridColumns = [
    {
        name: "Bank Name",
        field: "Bank_Name",
        width: "150"
    },
    {
        name: "Address",
        field: "Address",
        width: "300"
    },
    {
        name: "Phone",
        field: "Office",
        width: "100",
        // enableCellEdit: true
    },
    {
        name: "Contact Person",
        field: "Contact_Person",
        width: "150",
        // enableCellEdit: true
    },
    {
        name: "Email",
        field: "EMail",
        width: "200",
        // enableCellEdit: true
    },
    {
        name: "Mobile",
        field: "Mobile",
        width: "100",
        // enableCellEdit: true
    }];

    $scope.bankTableGridOptions = {
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.bankTableGridColumns,
        // data: banks,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.bankHasBeenSelected = true; 
                $rootScope.selectedBank = row.entity;
                console.log('Insurer Bank Selected',$rootScope.selectedBank);
                if($rootScope.selectedBank.Active = 1)
                    $rootScope.selectedBank.Active = true;                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('After table edit',$scope.insurerBranchTableGridOptions.data);  
            });
        }				  
    };

    $scope.addBank = function(selectedBank){
        if(selectedBank.Bank_Name != '' && selectedBank.Bank_Name != undefined)
        {
            if(selectedBank.Contact_Person != '' && selectedBank.Contact_Person != undefined)
            {
                if(selectedBank.Office != '' && selectedBank.Office != undefined)
                {
                    if(selectedBank.hasOwnProperty('_id'))
                    {
                        selectedBank.created_At = (selectedBank.created_At == null) ? null : moment(selectedBank.created_At).format("YYYY-MM-DD hh:mm:ss");
                        selectedBank.updated_At = (selectedBank.updated_At == null) ? null : moment(selectedBank.updated_At).format("YYYY-MM-DD hh:mm:ss");
                        
                        BNKData.bankUpdater(selectedBank).then(function(res){
                            toastr.success('The bank\'s details were succesfully updated','Success');
                            $rootScope.selectedBank = {};
                            $scope.loadBanks();
                        });
                    }
                    else{
                        BNKData.bankCreator(selectedBank).then(function(res){
                            toastr.success('The bank was succesfully Created','Success');
                            $rootScope.selectedBank = {};
                            $scope.loadBanks();
                        });
                    }
                }
                else{
                    toastr.error('Please enter the Bank\'s Phone Number','Phone Number');                                    
                }
            }
            else{
                toastr.error('Please enter the Bank\'s Contact Person','Contact Person');                    
            }
        }
        else{
            toastr.error('Please enter the Bank\'s Name','Bank Name');
        }
    }

    $scope.deleteBank = function(){
        BNKData.bankDeleter($rootScope.selectedBank).then(function(res){
            toastr.success('The bank was succesfully deleted','Success')
        });
    }    

    if($rootScope.masterBanksListLoaded)
        $scope.bankTableGridOptions.data = $rootScope.masterBanksList;
    else{
        $scope.loadBanks();
    }

    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
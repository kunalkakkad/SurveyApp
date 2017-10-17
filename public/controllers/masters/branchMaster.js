angular.module('MyApp').controller("branchMaster", function ($rootScope, $scope, $http, $uibModalInstance, $timeout,BRCHData,toastr) {
    
    console.log('Live from new Branch Master!');


    $rootScope.selectedInsurerBranch = {};
    $scope.insurerBranchHasBeenSelected = false;     

    $scope.insurerBranchTableGridColumns = [
    {
        name: "Branch Name",
        field: "Branch_Name",
        width: "150"
    },
    {
        name: "Address",
        field: "Address",
        width: "200"
    },
    {
        name: "Contact Person",
        field: "Contact_Person",
        width: "100",
        // enableCellEdit: true
    },
    {
        name: "Designation",
        field: "Designation",
        width: "100",
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
    },
    {
        name: "Office",
        field: "Office",
        width: "100",
        // enableCellEdit: true
    },
    {
        name: "Fax",
        field: "Fax",
        width: "100",
        // enableCellEdit: true
    }];

    $scope.insurerBranchTableGridOptions = {
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.insurerBranchTableGridColumns,
        // data: branches,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.insurerBranchHasBeenSelected = true; 
                $rootScope.selectedInsurerBranch = row.entity;
                console.log('Insurer Branch Selected',$rootScope.selectedInsurerBranch);
                if($rootScope.selectedInsurerBranch.Active = 1)
                    $rootScope.selectedInsurerBranch.Active = true;                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('After table edit',$scope.insurerBranchTableGridOptions.data);  
            });
        }				  
    };

    if($rootScope.selectedInsurer != undefined)
    {
        BRCHData.branchRetriever($rootScope.selectedInsurer._id)        
            .then(function(response) {
                $scope.insurerBranchTableGridOptions.data = response.data;
                console.log("Branches have been received",$scope.insurerBranchTableGridOptions.data);  
            }, 
            function (response){
                console.log('errors', response);
        });
    }
    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
angular.module('MyApp').controller("garageMaster", function ($rootScope, $scope, $http, $uibModalInstance, $timeout, toastr,GRGData) {
    
    console.log('Live from new Garage Master!');
    
    $rootScope.selectedGarage = {};
    $scope.garageHasBeenSelected = false;
    $scope.newGarage = {
    };

    $scope.garageTableGridColumns = [
    {
        name: "Garage Name",
        field: "Garage_Name",
        width: "200",
        enableCellEdit: false
 },    
    {
        name: "Contact Person",
        field: "Contact_Person",
        width: "150",
        enableCellEdit: false
    },
    {
        name: "Contact No",
        field: "Contact_No",
        width: "130",
        enableCellEdit: false
        // enableCellEdit: true
    },
    {
        name: "Authorised",
        field: "Authorised",
        width: "100",
        enableCellEdit: false
        // enableCellEdit: true
    },
    {
        name: "Remark",
        field: "Remark",
        width: "150",
        enableCellEdit: false
        // enableCellEdit: true
    },
    {
        name: "Active",
        field: "Active",
        width: "100",
        enableCellEdit: false
        // enableCellEdit: true
    }];

    $scope.garageTableGridOptions = {
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.garageTableGridColumns,
        // data: branches,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.garageHasBeenSelected = true; 
                $rootScope.selectedGarage = row.entity;
                console.log('Garage Selected',$rootScope.selectedGarage);
                
                //In the table, yes or no is displayed for the active and authorised columns. 
                //When we select an extry, the selection gets populated with those values. 
                //If we change the value in the variable in which we store the selection, it affect the table as well.
                //Therefore, the selection must be copied completely instead of just referring to the object in the table data array.
                //TODO

                // if($rootScope.selectedGarage.Active = 1)
                //     $rootScope.selectedGarage.Active = true;
                // if($rootScope.selectedGarage.Authorised = 1)
                //     $rootScope.selectedGarage.Authorised = true;                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('After table edit',$scope.garageTableGridOptions.data);  
            });
        }				  
    };

    GRGData.garageRetriever()
        .then(function(response) {
            console.log("Getting garages",response.data);
            response.data.forEach(function(element) {
                if(element.Authorised == 1)
                    element.Authorised = true;
                else if(element.Authorised == 0)
                    element.Authorised = false;
                if(element.Active == 1)
                    element.Active = true;
                else if(element.Active == 0)
                    element.Active = false;                    
                
                console.log(element);
            });
            $scope.garageTableGridOptions.data = response.data;
            
            $scope.garageTableGridOptions.data.forEach(function(element) {
                if(element.Authorised == 1)
                    element.Authorised = 'Yes';
                else if(element.Authorised == 0)
                    element.Authorised = 'No';
                if(element.Active == 1)
                    element.Active = 'Yes';
                else if(element.Active == 0)
                    element.Active = 'No';                    
                
                console.log(element);
            });
            console.log("Garages have been received",$scope.garageTableGridOptions.data);  
        }, 
        function (response){
            console.log('errors', response);
    });
    
    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
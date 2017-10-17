angular.module('MyApp').controller("insuranceReportMasterSpotReport", function ($rootScope, $scope, $http, $uibModalInstance, $timeout, toastr,PRTData,SRVData,SVDData,SPOTData) {           

    $scope.filterByDate = false;
    $scope.from_date = '';
    $scope.to_date = '';

    $scope.spotReportsTableGridColumns = [
    { name: "Survey Ref.",field: "Survey_Ref", width: "200" },
    { name: "Insurer", field: "Survey_Insurer_ID", width: "100", /*enableCellEdit: true*/ },
    { name: "Insured", field: "Insured_Name",width: "100", /*enableCellEdit: true*/ },
    { name: "Insurance Office",field: "Survey_Branch_ID",width: "250" },
    { name: "Vehicle", field: "Survey_Vehicle_ID" ,width: "120", /*enableCellEdit: true*/ },    
    { name: "Vehicle Name", field: "Survey_Vehicle_ID", width: "100", /* enableCellEdit: true */ }]
    $scope.msg = {};
    $scope.rowSelected = 0;

    $scope.spotReportsTableGridOptions = {  
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.spotReportsTableGridColumns,
        // data : VCLData.vehicleRetriever(),
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){   
                $rootScope.spotReportSelected = true;
                var intermediary = angular.copy(row.entity);
                console.log('Spot Report Raw Data(Main)',intermediary);
                intermediary.Appointing_Office = [];  
                intermediary.HPA = [];  

                intermediary.Survey_Date = moment(row.entity.Survey_Date).toDate();
                intermediary.Insurance_from = moment(row.entity.Insurance_from).toDate();
                intermediary.Insurance_to = moment(row.entity.Insurance_to).toDate();
                intermediary.Accident_Date = moment(row.entity.Accident_Date).toDate();
                intermediary.Allowtment_Date = moment(row.entity.Allowtment_Date).toDate();
                intermediary.Inspection_Date = moment(row.entity.Inspection_Date).toDate();
                intermediary.Repairing_Photo_Date = moment(row.entity.Repairing_Photo_Date).toDate();
                intermediary.Reinspection_Date = moment(row.entity.Reinspection_Date).toDate();       

                intermediary.Total = intermediary.Assessed_Labour - intermediary.Excess - intermediary.Excess_I;

                if(row.entity.Appointing_Office != ''){
                    intermediary.Appointing_Office.push({
                        text: row.entity.Appointing_Office
                    });
                }

                if(row.entity.HPA != ''){
                    intermediary.HPA.push({
                        text: row.entity.HPA
                    });
                }

                if(row.entity.Photo_Qty){
                    intermediary.Photo_Present = true;
                }else{
                    intermediary.Photo_Present = false;
                }

                if(row.entity.Submitted){
                    intermediary.Submitted = true;
                }else{
                    intermediary.Submitted = false;
                }

                if(row.entity.CD){
                    intermediary.CD = true;
                }else{
                    intermediary.CD = false;
                }

                if(row.entity.Cash_Less){
                    intermediary.Cash_Less = true;
                }else{
                    intermediary.Cash_Less = false;
                }

                intermediary.Address = row.entity.Address + ' ' +row.entity.Address_2;

                //SPOT VIEWDATA
                $rootScope.spotReport.Main = angular.copy(intermediary);
                console.log('Spot Report Data(Main) :-',$rootScope.spotReport.Main);
                
                SPOTData.damageDetailsRetriever($rootScope.spotReport.Main._id)
                    .then(function(response) {
                        $rootScope.spotReportDamages = (response.data.result.length > 0) ? response.data.result: [];                
                        console.log("Spot Report Data(Damage Details)",$rootScope.spotReportDamages);    
                    }, 
                    function (response){
                        console.log('errors', response);
                    }); 
                                
                $scope.getVehicleDetail($rootScope.spotReport.Main._id);
                $scope.getSpotDetail($rootScope.spotReport.Main._id);
                console.log('ID for vehicle and spot details retrieval',$rootScope.spotReport.Main._id);                                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('Data after table edit',$scope.vehicleTableGridOptions.data);  
            });
        }				  
    };

    if($rootScope.spotReportDataLoadedOnce == false){
        SRVData.surveysRetriever('Spot').then(function(res){
            
            $rootScope.spotReportDataLoadedOnce = true;

            //SPOT VIEWDATA
            $scope.spotReportsTableGridOptions.data = angular.copy(res.data.result);
            $rootScope.spotReports = angular.copy(res.data.result);
            console.log('Spot reports :-',$scope.spotReportsTableGridOptions.data);        
        },function(err){
            console.log('Error retrieving Spot Reports',err);
        }).catch(function(err){
            console.log('Error retrieving Spot Reports',err);
        });                            
    }
    else if ($rootScope.spotReportDataLoadedOnce == true){
        //SPOT VIEWDATA
        $scope.spotReportsTableGridOptions.data = $rootScope.spotReports;
    }
    
    $scope.getVehicleDetail = function(id){    
        SVDData.surveysVehicleDetailsRetriever(id)
            .then(function(response){                
                if(response.data.result != null){
                    console.log('Spot Report Raw Data(Vehicle Details)',response.data.result);

                    var vehicleIntermediary = angular.copy(response.data.result);
                    vehicleIntermediary.Remark_Vehicle = [];                 
                    
                    vehicleIntermediary.Date_Purchase = moment(response.data.Date_Purchase).toDate(); 
                    vehicleIntermediary.Date_Reg_Purchase = moment(response.data.Date_Reg_Purchase).toDate(); 
                    vehicleIntermediary.LIC_Issue_Date = moment(response.data.LIC_Issue_Date).toDate(); 
                    vehicleIntermediary.LIC_Valid_to = moment(response.data.LIC_Valid_to).toDate(); 
                    vehicleIntermediary.LIC_Valid_from = moment(response.data.LIC_Valid_from).toDate(); 
                    vehicleIntermediary.LIC_ReNewal_Date = moment(response.data.LIC_ReNewal_Date).toDate(); 
                    vehicleIntermediary.Fitness_from = moment(response.data.Fitness_from).toDate(); 
                    vehicleIntermediary.Fitness_to = moment(response.data.Fitness_to).toDate(); 
                    vehicleIntermediary.Permit_from = moment(response.data.Permit_from).toDate(); 
                    vehicleIntermediary.Permit_to = moment(response.data.Permit_to).toDate(); 
                    vehicleIntermediary.Driver_DOB = moment(response.data.Driver_DOB).toDate(); 
                    
                    if(response.data.result.Remark_Vehicle != '' && response.data.result.Remark_Vehicle != undefined && response.data.result.Remark_Vehicle != null){
                        vehicleIntermediary.Remark_Vehicle.push({
                            text: response.data.result.Remark_Vehicle   
                        });
                    }

                    if(response.data.Chassis_Phy){
                        vehicleIntermediary.Chassis_Phy = true;
                    }
                    else{
                        vehicleIntermediary.Chassis_Phy = false;
                    }

                    if(response.data.Engine_Phy){
                        vehicleIntermediary.Engine_Phy = true;        
                    }
                    else{
                        vehicleIntermediary.Engine_Phy = false;            
                    }

                    //SPOT VIEWDATA
                    $rootScope.spotReport.Vehicle_Details = vehicleIntermediary;                                                
                }
                else{                    
                    //SPOT VIEWDATA
                    $rootScope.spotReport.Vehicle_Details = {};
                }
                console.log("Spot Report Data(Vehicle Details)",$rootScope.spotReport.Vehicle_Details);                
            },function (response) {
                console.log('Failed to fetch vehicle info', response);
        });
    }

    $scope.getSpotDetail = function(id){    
        SPOTData.spotDataRetriever(id)
            .then(function(response){                
                if(response.data.result != null){
                    console.log('Spot Report Raw Data(Spot Details)',response.data.result);
                    var spotIntermediary = angular.copy(response.data.result);
                    // vehicleIntermediary.Remark_Vehicle = [];                                                         
                    $rootScope.spotReport.Spot_Details = spotIntermediary;
                }
                else{                                        
                    //SPOT VIEWDATA
                    $rootScope.spotReport.Spot_Details = {};
                }
                console.log("Spot Report Data(Spot Details)",$rootScope.spotReport.Spot_Details);                
            },function (response) {
                console.log('Failed to fetch spot info', response);
        });
    }
           
    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
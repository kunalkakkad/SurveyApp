angular.module('MyApp').controller("insuranceReportMasterInterimReport", function ($rootScope, $scope, $http, $uibModalInstance, $timeout, toastr, PRTData, SRVData, SVDData) {           

    console.log('Within Controller insuranceReportMasterInterimReport');

    $scope.filterByDate = false;
    $scope.from_date = '';
    $scope.to_date = '';

    $scope.interimReportsTableGridColumns = [
    { name: "Survey Ref.",field: "Survey_Ref", width: "200" },
    { name: "Insurer", field: "Survey_Insurer_ID", width: "100", /*enableCellEdit: true*/ },
    { name: "Insured", field: "Insured_Name",width: "100", /*enableCellEdit: true*/ },
    { name: "Insurance Office",field: "Survey_Branch_ID",width: "250" },
    { name: "Vehicle", field: "Survey_Vehicle_ID" ,width: "120", /*enableCellEdit: true*/ },    
    { name: "Vehicle Name", field: "Survey_Vehicle_ID", width: "100", /* enableCellEdit: true */ }]
    $scope.msg = {};
    $scope.rowSelected = 0;

    $scope.interimReportsTableGridOptions = {  
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.interimReportsTableGridColumns,
        // data : VCLData.vehicleRetriever(),
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){   
                var intermediary = angular.copy(row.entity);
                console.log('Intermediary',intermediary);
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

                //INTERIM VIEWDATA
                $rootScope.interimReport.Main = intermediary;
                console.log('Interim Report Data(Main) :-',$rootScope.interimReport.Main);
                
                PRTData.surveysPartsRetriever($rootScope.interimReport.Main._id)
                    .then(function(response) {
                        $rootScope.interimReportNewParts = response.data.result;                
                        console.log("Parts data has been received",$rootScope.interimReportNewParts);                              
                    }, 
                    function (response){
                        console.log('errors', response);
                    }); 
                
                $scope.getVehicleDetail($rootScope.interimReport.Main._id);
                console.log('ID sent for Interim Report vehicle details data retrieval',$rootScope.interimReport.Main._id);                                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('Data after table edit',$scope.vehicleTableGridOptions.data);  
            });
        }				  
    };

    if($rootScope.interimReportDataLoadedOnce == false){
        SRVData.surveysRetriever('Interim').then(function(res){
            
            //The res doesn't hold anything at the moment, the promise is just used to know when the results have been retrieved.
            // console.log('Surveys received',res.data);
            console.log('Interim Reports received by new method',res);
            $rootScope.interimReportDataLoadedOnce = true;

            //INTERIM VIEWDATA
            $scope.interimReportsTableGridOptions.data = angular.copy(res.data.result);
            $rootScope.interimReports = angular.copy(res.data.result);
            console.log('Interim Reports :-',$scope.interimReportsTableGridOptions.data);        
        },function(err){
            console.log('Error retrieving Interim Reports',err);
        });                            
    }
    else if ($rootScope.interimReportDataLoadedOnce == true){
        //INTERIM VIEWDATA
        $scope.interimReportsTableGridOptions.data = $rootScope.interimReports;
    }
    
    $scope.getVehicleDetail = function(id){    
        SVDData.surveysVehicleDetailsRetriever(id)
            .then(function(response){
                
                if(response.data.result != null)
                {
                    console.log('Interim Reports Vehicle data',response.data.result);

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
                    
                    if(response.data.Remark_Vehicle != '')
                    {
                        vehicleIntermediary.Remark_Vehicle.push({
                            text: response.data.Remark_Vehicle   
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

                    //INTERIM VIEWDATA
                    $rootScope.interimReport.Vehicle_Details = vehicleIntermediary;                                                
                }
                else
                {
                    //INTERIM VIEWDATA
                    $rootScope.interimReport.Vehicle_Details = {};
                }
                console.log("Received vehicle info for the report",$rootScope.interimReport.Vehicle_Details);                
            },function (response) {
                console.log('Failed to fetch vehicle info', response);
        });
    }

    // $scope.insSel = function(index)
    // {      
    //     var intermediary = angular.copy($rootScope.interimReports[index]);
        
    //     intermediary.Appointing_Office = [];  
    //     intermediary.HPA = [];  

    //     intermediary.Survey_Date = moment($rootScope.interimReports[index].Survey_Date).toDate();
    //     intermediary.Insurance_from = moment($rootScope.interimReports[index].Insurance_from).toDate();
    //     intermediary.Insurance_to = moment($rootScope.interimReports[index].Insurance_to).toDate();
    //     intermediary.Accident_Date = moment($rootScope.interimReports[index].Accident_Date).toDate();
    //     intermediary.Allowtment_Date = moment($rootScope.interimReports[index].Allowtment_Date).toDate();
    //     intermediary.Inspection_Date = moment($rootScope.interimReports[index].Inspection_Date).toDate();
    //     intermediary.Repairing_Photo_Date = moment($rootScope.interimReports[index].Repairing_Photo_Date).toDate();
    //     intermediary.Reinspection_Date = moment($rootScope.interimReports[index].Reinspection_Date).toDate();       

    //     intermediary.Total = intermediary.Assessed_Labour - intermediary.Excess - intermediary.Excess_I;

    //     if($rootScope.interimReports[index].Appointing_Office != ''){
    //         intermediary.Appointing_Office.push({
    //             text: $rootScope.interimReports[index].Appointing_Office
    //         });
    //     }

    //     if($rootScope.interimReports[index].HPA != ''){
    //         intermediary.HPA.push({
    //             text: $rootScope.interimReports[index].HPA
    //         });
    //     }

    //     if($rootScope.interimReports[index].Photo_Qty){
    //         intermediary.Photo_Present = true;
    //     }else{
    //         intermediary.Photo_Present = false;
    //     }

    //     if($rootScope.interimReports[index].Submitted){
    //         intermediary.Submitted = true;
    //     }else{
    //         intermediary.Submitted = false;
    //     }

    //     if($rootScope.interimReports[index].CD){
    //         intermediary.CD = true;
    //     }else{
    //         intermediary.CD = false;
    //     }

    //     if($rootScope.interimReports[index].Cash_Less){
    //         intermediary.Cash_Less = true;
    //     }else{
    //         intermediary.Cash_Less = false;
    //     }

    //     intermediary.Address = $rootScope.interimReports[index].Address + ' ' +$rootScope.interimReports[index].Address_2;


    //     console.log('Selected data intermediary',intermediary);
    //     //   $rootScope.interimReport.Main = $rootScope.interimReports[index];
    //     $rootScope.interimReport.Main = intermediary;
    //     console.log('Selected data',$rootScope.interimReport.Main);
    //     PRTData.surveysPartsRetriever($rootScope.interimReport.Main._id);
    //     //   console.log('Does the selected insurance report have an _id?',$rootScope.selectedInsuranceReport.hasOwnProperty('_id'));
    //     //   $rootScope.report._id = $rootScope.selectedInsuranceReport._id;
    //     $scope.getVehicleDetail($rootScope.interimReport.Main._id);
    // };            
            
    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
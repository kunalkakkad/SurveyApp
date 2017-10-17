angular.module('MyApp').controller("insuranceReportMasterFinalReport", function ($rootScope, $scope, $http, $uibModalInstance, $timeout, toastr,MDL,BRCHData,FRData) {           

    $scope.filterByDate = false;
    $scope.from_date = '';
    $scope.to_date = '';

    $scope.finalReportsTableGridColumns = [
    { name: "Survey Ref.",field: "Survey_Ref", width: "200" },
    { name: "Insurer", field: "Survey_Insurer_ID", width: "100", /*enableCellEdit: true*/ },
    { name: "Insured", field: "Insured_Name",width: "100", /*enableCellEdit: true*/ },
    { name: "Insurance Office",field: "Survey_Branch_ID",width: "250" },
    { name: "Vehicle", field: "Survey_Vehicle_ID" ,width: "120", /*enableCellEdit: true*/ },    
    { name: "Vehicle Name", field: "Survey_Vehicle_ID", width: "100", /* enableCellEdit: true */ }]
    
    $scope.finalReportsTableGridOptions = {  
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.finalReportsTableGridColumns,
        // data : VCLData.vehicleRetriever(),
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){   
                var intermediary = angular.copy(row.entity);
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

                $rootScope.finalReport.Main = intermediary;
                console.log('Final Report Data(Main) :-',$rootScope.finalReport.Main);

                $scope.vehicleSet = function(){
                	$rootScope.masterVehiclesList.forEach(function(vehicle){
                        if(vehicle._id == $rootScope.finalReport.Main.Survey_Vehicle_ID){
                            $rootScope.finalReport.Main.Survey_Vehicle_ID = vehicle;
                            console.log('True');
                        }
                    });
                }
                
                if($rootScope.masterVehiclesListLoaded && $rootScope.masterInsurersListLoaded){
                	$scope.vehicleSet();
                    console.log('Final Report Vehicle',$rootScope.finalReport.Main.Survey_Vehicle_ID);            
                }
                else{
                    MDL.loadVehicles()
                    .then(function(response){
                        $rootScope.masterVehiclesList = response.data;
                        $rootScope.masterVehiclesListLoaded = true;
                        console.info('Vehicles loaded',response.data);                    
                        $scope.vehicleSet();
                    },function(error){
                        console.info('An error occured while retrieving the vehicles',error);
                        $rootScope.masterVehiclesListLoaded = false;                    
                    }).catch(function(error){
                        $log.error('Error retrieving Vehicles data',error);
                    });
                }
                
                $scope.insurerSet = function(){
                	$rootScope.masterInsurersList.forEach(function(insurer){
                        if(insurer._id == $rootScope.finalReport.Main.Survey_Insurer_ID){
                            $rootScope.finalReport.Main.Survey_Insurer_ID = insurer;
                        }
                    });                    
                }
                
                if($rootScope.masterInsurersListLoaded){                    

                	$scope.insurerSet();
                    console.log('Final Report Insurer',$rootScope.finalReport.Main.Survey_Insurer_ID);            
                }
                else{
                    MDL.loadInsurers()
                    .then(function(res){
                        $rootScope.masterInsurersList = res.data;
                        $rootScope.masterInsurersListLoaded = true;
                        console.info('Master Insurer data',res.data);                
                        $scope.insurerSet();
                    },function(err){
                        console.info('An error occured while retrieving the insurers',err)
                        $rootScope.masterInsurersListLoaded = false;
                    }).catch(function(error){
                        $log.error('Error retrieving Insurers data',error);
                    });
                }                                  
                
                $scope.branches = [];                
                
                $scope.insuranceOfficeAndAppointingOfficeSet = function(){
                    console.log('Insurer ',$rootScope.finalReport.Main.Survey_Insurer_ID,"\nBranch ID",$rootScope.finalReport.Main.Survey_Branch_ID,"\nAppointing Office",$rootScope.finalReport.Main.Appointing_Office);
                    if($rootScope.finalReport.Main.Survey_Insurer_ID != '' && typeof($rootScope.finalReport.Main.Survey_Insurer_ID) != undefined)
                    {
                    	if($rootScope.finalReport.Main.Survey_Branch_ID != '' && typeof($rootScope.finalReport.Main.Survey_Branch_ID) != undefined)
                        {
	                    	BRCHData.branchRetriever($rootScope.finalReport.Main.Survey_Insurer_ID._id)                   
		                    .then(function(response){
		                        console.log('Branches received, setting insurer &/or appointing office',response.data);
		                        $scope.branches = response.data;
		                        $scope.branches.forEach(function(element){
		                        	if(element._id == $rootScope.finalReport.Main.Survey_Branch_ID)
		                        		$rootScope.finalReport.Main.Survey_Branch_ID = element;
		                        });
		                        
		                        if($rootScope.finalReport.Main.Appointing_Office != '' && typeof($rootScope.finalReport.Main.Appointing_Office) != undefined){
		                        	$scope.branches.forEach(function(element){
			                        	if(element._id == $rootScope.finalReport.Main.Appointing_Office)
			                        		$rootScope.finalReport.Main.Appointing_Office = element;
			                        });
		                        }
		                      	console.log("New Branch ID",$rootScope.finalReport.Main.Survey_Branch_ID,"\nNew Appointing Office",$rootScope.finalReport.Main.Appointing_Office);	                        		                        
		                    });
	                    }
                    }
                }
                
                $scope.insuranceOfficeAndAppointingOfficeSet();

                FRData.finalReportRetriever($rootScope.finalReport.Main._id).then(function(res){

                    console.log('Final Report other data',res);          

                    $rootScope.finalReport.NewParts = res.data.SurveyPartsDetail;                    

                    if(res.data.SurveyCabinDetail.length > 0){
                            $rootScope.finalReport.Commercial_vehicle = true;
                        res.data.SurveyCabinDetail.forEach(function(detail){                        
                            if(detail.Type == "Cabin Assembly")
                                $rootScope.finalReport.CabinAssembly.push(detail);
                            else if(detail.Type == "Load Body")
                                $rootScope.finalReport.LoadBody.push(detail);                                
                        });
                    }

                    res.data.SurveyCabinMaster.forEach(function(detail){
                        if(detail.Type == "Cabin Assembly")
                            $rootScope.finalReport.CabinAssemblyMaster = detail;
                        else if(detail.Type == "Load Body")
                            $rootScope.finalReport.LoadBodyMaster = detail;
                    });

                    $scope.setVehicleDetail(res.data.surveyVehicleDetail[0]);

                },function(err){
                    console.log('Error retrieving Final Reports',err);
                });
                                                 
                console.log('ID sent for Final Report vehicle details data retrieval',$rootScope.finalReport.Main._id);                                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('Data after table edit',$scope.vehicleTableGridOptions.data);  
            });
        }				  
    };
    
    if($rootScope.finalReportDataLoadedOnce == false){
        FRData.finalReportListRetriever('Final').then(function(res){

            console.log(res);            
            $rootScope.finalReportDataLoadedOnce = true;
            $scope.finalReportsTableGridOptions.data = res.data;
            $rootScope.finalReports = res.data;
            console.log('Final reports :-',$scope.finalReportsTableGridOptions.data);        
        },function(err){
            console.log('Error retrieving Final Reports',err);
        });                            
    }
    else if ($rootScope.finalReportDataLoadedOnce == true){
        $scope.finalReportsTableGridOptions.data = $rootScope.finalReports;
    }
    
    $scope.setVehicleDetail = function(vehicleDetail){    
        
        var vehicleIntermediary = angular.copy(vehicleDetail);
        vehicleIntermediary.Remark_Vehicle = [];                 
        
        vehicleIntermediary.Survey_id = $rootScope.finalReport.Main._id;
        vehicleIntermediary.Date_Purchase = moment(vehicleDetail.Date_Purchase).toDate(); 
        vehicleIntermediary.Date_Reg_Purchase = moment(vehicleDetail.Date_Reg_Purchase).toDate(); 
        vehicleIntermediary.LIC_Issue_Date = moment(vehicleDetail.LIC_Issue_Date).toDate(); 
        vehicleIntermediary.LIC_Valid_to = moment(vehicleDetail.LIC_Valid_to).toDate(); 
        vehicleIntermediary.LIC_Valid_from = moment(vehicleDetail.LIC_Valid_from).toDate(); 
        vehicleIntermediary.LIC_ReNewal_Date = moment(vehicleDetail.LIC_ReNewal_Date).toDate(); 
        vehicleIntermediary.Fitness_from = moment(vehicleDetail.Fitness_from).toDate(); 
        vehicleIntermediary.Fitness_to = moment(vehicleDetail.Fitness_to).toDate(); 
        vehicleIntermediary.Permit_from = moment(vehicleDetail.Permit_from).toDate(); 
        vehicleIntermediary.Permit_to = moment(vehicleDetail.Permit_to).toDate(); 
        vehicleIntermediary.Driver_DOB = moment(vehicleDetail.Driver_DOB).toDate(); 
        
        if(vehicleDetail.Remark_Vehicle != '' && vehicleDetail.Remark_Vehicle != undefined && vehicleDetail.Remark_Vehicle != null){
            vehicleIntermediary.Remark_Vehicle.push({
                text: vehicleDetail.result.Remark_Vehicle   
            });
        }

        if(vehicleDetail.Chassis_Phy){
            vehicleIntermediary.Chassis_Phy = true;
        }
        else{
            vehicleIntermediary.Chassis_Phy = false;
        }

        if(vehicleDetail.Engine_Phy){
            vehicleIntermediary.Engine_Phy = true;        
        }
        else{
            vehicleIntermediary.Engine_Phy = false;            
        }

        $rootScope.finalReport.Vehicle_Details = vehicleIntermediary;                                                        
        console.log('Vehicle details',$rootScope.finalReport.Vehicle_Details);
        $uibModalInstance.close();
    }
                 
    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
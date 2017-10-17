angular.module('MyApp').controller("insuranceReportMasterSpotReport", function ($rootScope, $scope, $http, $uibModalInstance, $timeout, toastr,PRTData,SRVData,SVDData,SPOTData,MDL,BRCHData) {           

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
                
                $scope.vehicleSet = function(){
                	$rootScope.masterVehiclesList.forEach(function(vehicle){
                        if(vehicle._id == $rootScope.spotReport.Main.Survey_Vehicle_ID){
                            $rootScope.spotReport.Main.Survey_Vehicle_ID = vehicle;                        
                        }
                    });
                }
                
                if($rootScope.masterVehiclesListLoaded && $rootScope.masterInsurersListLoaded){
                	$scope.vehicleSet();
                    console.log('Spot Report Vehicle',$rootScope.spotReport.Main.Survey_Vehicle_ID);            
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
                        if(insurer._id == $rootScope.spotReport.Main.Survey_Insurer_ID){
                            $rootScope.spotReport.Main.Survey_Insurer_ID = insurer;
                        }
                    });                    
                }
                
                if($rootScope.masterInsurersListLoaded){                    

                	$scope.insurerSet();
                    console.log('Spot Report Insurer',$rootScope.spotReport.Main.Survey_Insurer_ID);            
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
                    console.log('Insurer ',$rootScope.spotReport.Main.Survey_Insurer_ID,"\nBranch ID",$rootScope.spotReport.Main.Survey_Branch_ID,"\nAppointing Office",$rootScope.spotReport.Main.Appointing_Office);
                    if($rootScope.spotReport.Main.Survey_Insurer_ID != '' && typeof($rootScope.spotReport.Main.Survey_Insurer_ID) != undefined)
                    {
                    	if($rootScope.spotReport.Main.Survey_Branch_ID != '' && typeof($rootScope.spotReport.Main.Survey_Branch_ID) != undefined)
                        {
	                    	BRCHData.branchRetriever($rootScope.spotReport.Main.Survey_Insurer_ID._id)                   
		                    .then(function(response){
		                        console.log('Branches received, setting insurer &/or appointing office',response.data);
		                        $scope.branches = response.data;
		                        $scope.branches.forEach(function(element){
		                        	if(element._id == $rootScope.spotReport.Main.Survey_Branch_ID)
		                        		$rootScope.spotReport.Main.Survey_Branch_ID = element;
		                        });
		                        
		                        if($rootScope.spotReport.Main.Appointing_Office != '' && typeof($rootScope.spotReport.Main.Appointing_Office) != undefined){
		                        	$scope.branches.forEach(function(element){
			                        	if(element._id == $rootScope.spotReport.Main.Appointing_Office)
			                        		$rootScope.spotReport.Main.Appointing_Office = element;
			                        });
		                        }
		                      	console.log("New Branch ID",$rootScope.spotReport.Main.Survey_Branch_ID,"\nNew Appointing Office",$rootScope.spotReport.Main.Appointing_Office);	                        		                        
		                    });
	                    }
                    }
                }
                
                $scope.insuranceOfficeAndAppointingOfficeSet();

                SPOTData.spotDataDetailsRetriever($rootScope.spotReport.Main._id)
                    .then(function(response) {
                        console.log('Data',response);
                        $rootScope.spotReport.Damages = (response.data.surveyDamageDetail.length > 0) ? response.data.surveyDamageDetail: [];                
                        $rootScope.spotReport.Spot_Details = response.data.surveySpot[0];
                        $scope.setVehicleDetail(response.data.surveyVehicleDetail[0]);                        
                    }, 
                    function (response){
                        console.log('errors', response);
                    }); 
                                
                console.log('ID for vehicle and spot details retrieval',$rootScope.spotReport.Main._id);                                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('Data after table edit',$scope.vehicleTableGridOptions.data);  
            });
        }				  
    };

    if($rootScope.spotReportDataLoadedOnce == false){
        SPOTData.spotDataRetriever('Spot').then(function(res){            
            $rootScope.spotReportDataLoadedOnce = true;
            //SPOT VIEWDATA
            $scope.spotReportsTableGridOptions.data = angular.copy(res.data);
            $rootScope.spotReports = angular.copy(res.data);
            console.log('Spot reports :-',$scope.spotReportsTableGridOptions.data);        
        },function(err){
            console.log('Error retrieving Spot Reports',err);
        }).catch(function(err){
            console.log('Error retrieving Spot Reports',err);
        });                            
    }
    else if ($rootScope.spotReportDataLoadedOnce == true){
        $scope.spotReportsTableGridOptions.data = $rootScope.spotReports;
    }
    
    $scope.setVehicleDetail = function(vehicleDetail){    
        
        var vehicleIntermediary = angular.copy(vehicleDetail);
        vehicleIntermediary.Remark_Vehicle = [];                 
        
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
                text: vehicleDetail.Remark_Vehicle   
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

        //SPOT VIEWDATA
        $rootScope.spotReport.Vehicle_Details = vehicleIntermediary;

    }
               
    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
angular.module('MyApp').controller("insuranceReportMasterStatusReport", function ($rootScope,$scope,$http,$uibModalInstance,$timeout,toastr,SRVData,MDL,BRCHData,STSData) {           
    
    $scope.statusReportSurveyInsurerId = '';

    $scope.statusReportsTableGridColumns = [
    { name: "Survey Ref.",field: "Survey_Ref", width: "200" },
    { name: "Survey Type",field: "Survey_Type", width: "200" },
    { name: "Insurer", field: "Survey_Insurer_ID", width: "100", /*enableCellEdit: true*/ },
    { name: "Insured", field: "Insured_Name",width: "100", /*enableCellEdit: true*/ },
    { name: "Insurance Office",field: "Survey_Branch_ID",width: "250" },
    { name: "Vehicle", field: "Survey_Vehicle_ID" ,width: "120", /*enableCellEdit: true*/ },    
    { name: "Vehicle Name", field: "Survey_Vehicle_ID", width: "100", /* enableCellEdit: true */ }]

    $scope.statusReportsTableGridOptions = {  
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.statusReportsTableGridColumns,
        // data : VCLData.vehicleRetriever(),
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){   
                $rootScope.statusReport = {};
                $rootScope.statusReport.Main = {};
                $rootScope.statusReport.Status = {}; 
                $rootScope.statusReport.Status_Damage_Details = []; 
                $rootScope.$broadcast('newReportSelectedForStatusReport');                
    
                $rootScope.statusReport.Main = angular.copy(row.entity);
                $rootScope.statusReport.Main.Accident_Date = angular.copy(moment(row.entity.Accident_Date).toDate());
                $rootScope.statusReport.Main.Allowtment_Date = angular.copy(moment(row.entity.Allowtment_Date).toDate());
                
                console.log('Status Report Data(Main) :-',$rootScope.statusReport.Main);
                
                //Set Vehicle with this method. Checks the id against the ids of the insurers in the master list, assigns the object
                $scope.vehicleSet = function(){
                    console.log('Hello',$rootScope.masterVehiclesList);
                	$rootScope.masterVehiclesList.forEach(function(vehicle){
                        if(vehicle._id == $rootScope.statusReport.Main.Survey_Vehicle_ID){
                            $rootScope.statusReport.Main.Survey_Vehicle_ID = vehicle.Vehicle_Name;
                            console.log('Vehicle Name',$rootScope.statusReport.Main.Survey_Vehicle_ID);
                        }
                    });
                }

                //??Why do I need the 2nd condition TODO QUESTION                
                // if($rootScope.masterVehiclesListLoaded && $rootScope.masterInsurersListLoaded){
                if($rootScope.masterVehiclesListLoaded){
                	$scope.vehicleSet();
                    console.log('Vehicle data',$rootScope.statusReport.Main.Survey_Vehicle_ID);            
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
                
                //Set Insurer with this method. Checks the id against the ids of the insurers in the master list, assigns the object
                $scope.insurerSet = function(){
                	$rootScope.masterInsurersList.forEach(function(insurer){
                        if(insurer._id == $rootScope.statusReport.Main.Survey_Insurer_ID){
                            $scope.statusReportSurveyInsurerId = angular.copy($rootScope.statusReport.Main.Survey_Insurer_ID);
                            console.log('Insurer id',$scope.statusReportSurveyInsurerId);
                            $rootScope.statusReport.Main.Survey_Insurer_ID = insurer.Insurer_Name;
                        }
                    });                    
                }
                
                if($rootScope.masterInsurersListLoaded){                    
                	$scope.insurerSet();
                    console.log('Insurer data',$rootScope.statusReport.Main.Survey_Insurer_ID);            
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
                    console.log('Insurer ',$rootScope.statusReport.Main.Survey_Insurer_ID,'\nInsurer ID',$scope.statusReportSurveyInsurerId,"\nBranch ID",$rootScope.statusReport.Main.Survey_Branch_ID,"\nAppointing Office",$rootScope.statusReport.Main.Appointing_Office);
                    if($rootScope.statusReport.Main.Survey_Insurer_ID != '' && typeof($rootScope.statusReport.Main.Survey_Insurer_ID) != undefined)
                    {
                    	if($rootScope.statusReport.Main.Survey_Branch_ID != '' && typeof($rootScope.statusReport.Main.Survey_Branch_ID) != undefined)
                        {
                            console.log('Survey Insurer Id',$scope.statusReportSurveyInsurerId);
	                    	BRCHData.branchRetriever($scope.statusReportSurveyInsurerId)                   
		                    .then(function(response){
		                        console.log('Branches received, setting insurer &/or appointing office',response.data);
		                        $scope.branches = response.data;
		                        $scope.branches.forEach(function(element){
		                        	if(element._id == $rootScope.statusReport.Main.Survey_Branch_ID)
		                        		$rootScope.statusReport.Main.Survey_Branch_ID = element.Branch_Name;
		                        });
		                        
		                        // if($rootScope.statusReport.Main.Appointing_Office != '' && typeof($rootScope.statusReport.Main.Appointing_Office) != undefined){
		                        // 	$scope.branches.forEach(function(element){
			                    //     	if(element._id == $rootScope.statusReport.Main.Appointing_Office)
			                    //     		$rootScope.statusReport.Main.Appointing_Office = element;
			                    //     });
		                        // }
		                      	console.log("New Branch ID",$rootScope.statusReport.Main.Survey_Branch_ID,"\nNew Appointing Office",$rootScope.statusReport.Main.Appointing_Office);	                        		                        
		                    });
	                    }
                    }
                }
                                                
                $scope.insuranceOfficeAndAppointingOfficeSet();

                STSData.statusReportDetailsRetriever($rootScope.statusReport.Main._id)
                    .then(function(res){
                        console.log('Status Report Received',res);
                        $rootScope.statusReport.Status = res.data.surveyStatus[0];
                        $rootScope.statusReport.Status_Damage_Details = res.data.surveyStatusDamageDetail;
                        $rootScope.$broadcast('statusReportDamageDetailsReceived');
                    },function(error){
                        console.error('An Error ocured while retrieving the Status Report',error);                    
                    })
                    .catch(function(error){
                        console.log('An Error ocured while retrieving the Status Report',error);                                        
                    })

            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('Data after table edit',$scope.statusReportsTableGridOptions.data);  
            });
        }				  
    };
    
    if($rootScope.statusReportDataLoadedOnce == false){
        STSData.statusReportRetriever('Final')
            .then(function(res){
                console.log('Received final reports',res.data);        
                //FINAL REPORT DATA
                $scope.statusReportsTableGridOptions.data = res.data;
                $rootScope.statusReports = res.data;            
            
                },function(err){
                    console.log('Error retrieving Final Reports',err);
                })
            .then(function(){
                STSData.statusReportRetriever('Interim')
                    .then(function(res){
                    console.log('Received interim reports',res.data);                
                    //INTERIM REPORT DATA
                    res.data.forEach(function(element){
                    $rootScope.statusReports.push(element);                        
                    })
                    $rootScope.statusReportDataLoadedOnce = true;
                    },function(err){
                        console.log('Error retrieving Interim Reports',err);
                    });                            
                })            
            .catch(function(error){
        	console.log('An error occured while retrieving the data',error);
        });                            
    }
    else if ($rootScope.statusReportDataLoadedOnce == true){        
        $scope.statusReportsTableGridOptions.data = $rootScope.statusReports;
    }    

    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
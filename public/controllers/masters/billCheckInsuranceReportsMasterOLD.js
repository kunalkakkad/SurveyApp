angular.module('MyApp').controller("insuranceReportMasterBillCheck", function ($rootScope, $scope, $http, $uibModalInstance, $timeout,toastr,PRTData,SRVData,SVDData,MDL,SRVCBNData,SRCHKData,BRCHData,BLCHKData) {           

    $scope.filterByDate = false;
    $scope.from_date = '';
    $scope.to_date = '';

    $scope.billCheckReportsTableGridColumns = [
    { name: "Survey Ref.",field: "Survey_Ref", width: "200" },
    { name: "Survey Type",field: "Survey_Type", width: "200" },
    { name: "Insurer", field: "Survey_Insurer_ID", width: "100", /*enableCellEdit: true*/ },
    { name: "Insured", field: "Insured_Name",width: "100", /*enableCellEdit: true*/ },
    { name: "Insurance Office",field: "Survey_Branch_ID",width: "250" },
    { name: "Vehicle", field: "Survey_Vehicle_ID" ,width: "120", /*enableCellEdit: true*/ },    
    { name: "Vehicle Name", field: "Survey_Vehicle_ID", width: "100", /* enableCellEdit: true */ }]
    
    $scope.billCheckReportsTableGridOptions = {  
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.billCheckReportsTableGridColumns,
        // data : VCLData.vehicleRetriever(),
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){   
                console.log('Survey selected',row.entity);
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

                //FINAL VIEWDATA
                $rootScope.billCheckReport.Main = intermediary;
                console.log('Bill Check Report Data(Main) :-',$rootScope.billCheckReport.Main);
                
                //Set Vehicle with this method. Checks the id against the ids of the insurers in the master list, assigns the object
                $scope.vehicleSet = function(){
                	$rootScope.masterVehiclesList.forEach(function(vehicle){
                        if(vehicle._id == $rootScope.billCheckReport.Main.Survey_Vehicle_ID){
                            $rootScope.billCheckReport.Main.Survey_Vehicle_ID = vehicle;
//                            console.log('True');
                        }
                    });
                }
                
                if($rootScope.masterVehiclesListLoaded && $rootScope.masterInsurersListLoaded){
                	$scope.vehicleSet();
                    console.log('Vehicle data',$rootScope.billCheckReport.Main.Survey_Vehicle_ID);            
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
                        if(insurer._id == $rootScope.billCheckReport.Main.Survey_Insurer_ID){
                            $rootScope.billCheckReport.Main.Survey_Insurer_ID = insurer;
                        }
                    });                    
                }
                
                if($rootScope.masterInsurersListLoaded){                    

                	$scope.insurerSet();
                    console.log('Insurer data',$rootScope.billCheckReport.Main.Survey_Insurer_ID);            
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
                    console.log('Insurer ',$rootScope.billCheckReport.Main.Survey_Insurer_ID,"\nBranch ID",$rootScope.billCheckReport.Main.Survey_Branch_ID,"\nAppointing Office",$rootScope.billCheckReport.Main.Appointing_Office);
                    if($rootScope.billCheckReport.Main.Survey_Insurer_ID != '' && typeof($rootScope.billCheckReport.Main.Survey_Insurer_ID) != undefined)
                    {
                    	if($rootScope.billCheckReport.Main.Survey_Branch_ID != '' && typeof($rootScope.billCheckReport.Main.Survey_Branch_ID) != undefined)
                        {
                            //Get list of branches first for that particular insurer, then check branch IDs against the 
                            //Insurance Office and Appointing office and set accordingly
	                    	BRCHData.branchRetriever($rootScope.billCheckReport.Main.Survey_Insurer_ID._id)                   
		                    .then(function(response){
		                        console.log('Branches received, setting insurer &/or appointing office',response.data);
		                        $scope.branches = response.data;
		                        $scope.branches.forEach(function(element){
		                        	if(element._id == $rootScope.billCheckReport.Main.Survey_Branch_ID)
		                        		$rootScope.billCheckReport.Main.Survey_Branch_ID = element;
		                        });
		                        
		                        if($rootScope.billCheckReport.Main.Appointing_Office != '' && typeof($rootScope.billCheckReport.Main.Appointing_Office) != undefined){
		                        	$scope.branches.forEach(function(element){
			                        	if(element._id == $rootScope.billCheckReport.Main.Appointing_Office)
			                        		$rootScope.billCheckReport.Main.Appointing_Office = element;
			                        });
		                        }
		                      	console.log("New Branch ID",$rootScope.billCheckReport.Main.Survey_Branch_ID,"\nNew Appointing Office",$rootScope.billCheckReport.Main.Appointing_Office);	                        		                        
		                    });
	                    }
                    }
                }
                
                BLCHKData.billCheckRetriever($rootScope.billCheckReport.Main._id)
                	.then(function(response){
                		console.info('Bill Check Report Data:-',response.data)
                        // $rootScope.billCheckReport.billCheckDetails = response.data;
                        // setTimeout(function () {
                        //     $rootScope.$apply(function () {
                        //         // $scope.message = "Timeout called!";
                        //         console.log('Applying');
                        //     });
                        // }, 2000);
                        // $timeout($scope.$apply(),100);                        
        
                        $rootScope.billCheckReport.billCheckDetails = angular.copy(response.data.surveyBillCheck[0]);
                        $rootScope.billCheckReport.billCheckDepriciation = angular.copy(response.data.surveyBillCheckDepriciation); 
                        $rootScope.billCheckReport.billCheckParts = angular.copy(response.data.surveyBillCheckDepriciation);
                        $scope.setVehicleDetail(response.data.surveyVehicleDetail[0]);
                        console.log('Bill check report',$rootScope.billCheckReport);
                        },
                        function(error){
                            console.log('Failed to retrieve Bill Check Details',error);
                            $rootScope.billCheckReport.billCheckDetails = {};
                        })
                        .catch(function(error){
                            console.log('Failed to retrieve Bill Check Details',error);
                            $rootScope.billCheckReport.billCheckDetails = {};                        
                        })

                // BLCHKData.billCheckRetriever($rootScope.billCheckReport.Main._id)
                // 	.then(function(response){
                // 		console.info('Bill Check Report Data(Bill Check Details) :-',response.data)
                // 		$rootScope.billCheckReport.billCheckDetails = response.data;
                //         setTimeout(function () {
                //             $rootScope.$apply(function () {
                //                 // $scope.message = "Timeout called!";
                //                 console.log('Applying');
                //             });
                //         }, 2000);
                //         // $timeout($scope.$apply(),100);                        
                // 	},
        		// 	function(error){
                // 		console.log('Failed to retrieve Bill Check Details',error);
                //         $rootScope.billCheckReport.billCheckDetails = {};
                // 	})
        		// 	.catch(function(error){
        		// 		console.log('Failed to retrieve Bill Check Details',error);
                //         $rootScope.billCheckReport.billCheckDetails = {};                        
        		// 	})
                
                // BLCHKData.billCheckDepriciationRetriever($rootScope.billCheckReport.Main._id)
            	// .then(function(response){
            	// 	console.info('Bill Check Report Data(Bill Check Depriciation Details) :-',response.data)
            	// 	$rootScope.billCheckReport.billCheckDepriciation = angular.copy(response.data);                    
                //     $rootScope.$broadcast('billCheckDepriciationReceived');
            	// },
    			// function(error){
            	// 	console.log('Failed to retrieve Bill Check Depriciation Details',error);
                //     $rootScope.billCheckReport.billCheckDepriciation = [];
            	// })
    			// .catch(function(error){
    			// 	console.log('Failed to retrieve Bill Check Depriciation Details',error);
                //     $rootScope.billCheckReport.billCheckDepriciation = [];                    
    			// })
                
                // BLCHKData.billCheckPartsRetriever($rootScope.billCheckReport.Main._id)
            	// .then(function(response){
            	// 	console.info('Bill Check Report Data(Bill Check Parts Details) :-',response.data)
            	// 	$rootScope.billCheckReport.billCheckParts = response.data;
            	// },
    			// function(error){
            	// 	console.log('Failed to retrieve Bill Check Parts Details',error);
            	// 	$rootScope.billCheckReport.billCheckParts = [];
            	// })
    			// .catch(function(error){
    			// 	console.log('Failed to retrieve Bill Check Parts Details',error);
            	// 	$rootScope.billCheckReport.billCheckParts = [];
    			// })
                
                $scope.insuranceOfficeAndAppointingOfficeSet();
                
//                PRTData.surveysPartsRetriever($rootScope.billCheckReport.Main._id)
//                    .then(function(response) {
//                        $rootScope.billCheckReport.NewParts = response.data;                
//                        // $rootScope.billCheckReport.NewParts = response.data.result;                
//                        console.log("Parts data has been received",$rootScope.billCheckReport.NewParts);    
//                        // $rootScope.indexOfLastRep = $rootScope.billCheckReports[$rootScope.billCheckReports.length - 1]._id;
//                        // console.log('_id of last entry',$rootScope.indexOfLastRep);  
//                    }, 
//                    function (response){
//                        console.log('errors', response);
//                });
               
                // $scope.getVehicleDetail($rootScope.billCheckReport.Main._id);
                console.log('ID sent for Final Report vehicle details data retrieval',$rootScope.billCheckReport.Main._id);                                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('Data after table edit',$scope.vehicleTableGridOptions.data);  
            });
        }				  
    };

//     if($rootScope.billCheckReportDataLoadedOnce == false){
//         SRVData.surveysRetriever('Final')
//           .then(function(res){
//     	    console.log('Received final reports',res.data);        
//             //FINAL REPORT DATA
//             $scope.billCheckReportsTableGridOptions.data = res.data;
//             $rootScope.billCheckReports = res.data;            
            
//         },function(err){
//             console.log('Error retrieving Final Reports',err);
//         }).then(function(){
//         	SRVData.surveysRetriever('Interim').then(function(res){
                
//                 $rootScope.billCheckReportDataLoadedOnce = true;

//                 //INTERIM REPORT DATA
//                 console.log('Received interim reports',res.data);
//                 res.data.forEach(function(element){
// //                	$scope.billCheckReportsTableGridOptions.data.push(element);
//                 	$rootScope.billCheckReports.push(element);
                    
//                 })
//                 console.log('All Final and Interim reports :-',$scope.billCheckReportsTableGridOptions.data,$rootScope.billCheckReports);        
//             },function(err){
//                 console.log('Error retrieving Interim Reports',err);
//             });                            
//         }).catch(function(error){
//         	console.log('An error occured while retrieving the data',error);
//         });                            
//     }
//     else if ($rootScope.billCheckReportDataLoadedOnce == true){        
//         $scope.billCheckReportsTableGridOptions.data = $rootScope.billCheckReports;
//     }

    if($rootScope.billCheckReportDataLoadedOnce == false){
        BLCHKData.billCheckSurveysRetriever('Final')
          .then(function(res){
    	    console.log('Received final reports',res.data);        
            //FINAL REPORT DATA
            $scope.billCheckReportsTableGridOptions.data = res.data;
            $rootScope.billCheckReports = res.data;            
            
        },function(err){
            console.log('Error retrieving Final Reports',err);
        }).then(function(){
        	BLCHKData.billCheckSurveysRetriever('Interim').then(function(res){
                
                $rootScope.billCheckReportDataLoadedOnce = true;

                //INTERIM REPORT DATA
                console.log('Received interim reports',res.data);
                res.data.forEach(function(element){
//                	$scope.billCheckReportsTableGridOptions.data.push(element);
                	$rootScope.billCheckReports.push(element);
                    
                })
                console.log('All Final and Interim reports :-',$scope.billCheckReportsTableGridOptions.data,$rootScope.billCheckReports);        
            },function(err){
                console.log('Error retrieving Interim Reports',err);
            });                            
        }).catch(function(error){
        	console.log('An error occured while retrieving the data',error);
        });                            
    }
    else if ($rootScope.billCheckReportDataLoadedOnce == true){        
        $scope.billCheckReportsTableGridOptions.data = $rootScope.billCheckReports;
    }
    
    $scope.setVehicleDetail = function(vehicleDetails){    
        console.log('VehicleDetails',vehicleDetails);
        var vehicleIntermediary = angular.copy(vehicleDetails);
        
        vehicleIntermediary.Remark_Vehicle = [];                         
        vehicleIntermediary.Survey_id = vehicleDetails._id;
        vehicleIntermediary.Date_Purchase = moment(vehicleDetails.Date_Purchase).toDate(); 
        vehicleIntermediary.Date_Reg_Purchase = moment(vehicleDetails.Date_Reg_Purchase).toDate(); 
        vehicleIntermediary.LIC_Issue_Date = moment(vehicleDetails.LIC_Issue_Date).toDate(); 
        vehicleIntermediary.LIC_Valid_to = moment(vehicleDetails.LIC_Valid_to).toDate(); 
        vehicleIntermediary.LIC_Valid_from = moment(vehicleDetails.LIC_Valid_from).toDate(); 
        vehicleIntermediary.LIC_ReNewal_Date = moment(vehicleDetails.LIC_ReNewal_Date).toDate(); 
        vehicleIntermediary.Fitness_from = moment(vehicleDetails.Fitness_from).toDate(); 
        vehicleIntermediary.Fitness_to = moment(vehicleDetails.Fitness_to).toDate(); 
        vehicleIntermediary.Permit_from = moment(vehicleDetails.Permit_from).toDate(); 
        vehicleIntermediary.Permit_to = moment(vehicleDetails.Permit_to).toDate(); 
        vehicleIntermediary.Driver_DOB = moment(vehicleDetails.Driver_DOB).toDate(); 
        
        if(vehicleDetails.Remark_Vehicle != '' && vehicleDetails.Remark_Vehicle != undefined && vehicleDetails.Remark_Vehicle != null){
            vehicleIntermediary.Remark_Vehicle.push({
                text: vehicleDetails.result.Remark_Vehicle   
            });
        }

        if(vehicleDetails.Chassis_Phy){
            vehicleIntermediary.Chassis_Phy = true;
        }
        else{
            vehicleIntermediary.Chassis_Phy = false;
        }

        if(vehicleDetails.Engine_Phy){
            vehicleIntermediary.Engine_Phy = true;        
        }
        else{
            vehicleIntermediary.Engine_Phy = false;            
        }

        $rootScope.billCheckReport.Vehicle_Details = vehicleIntermediary;                 
        console.log('Vehicle Details',$rootScope.billCheckReport.Vehicle_Details);                                                                 

    }
                 
    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
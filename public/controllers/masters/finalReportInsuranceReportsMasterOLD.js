angular.module('MyApp').controller("insuranceReportMasterFinalReport", function ($rootScope, $scope, $http, $uibModalInstance, $timeout, toastr, PRTData, SRVData, SVDData, MDL, SRVCBNData, SRCHKData,BRCHData,FRData) {           

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
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.finalReportsTableGridColumns,
        // data : VCLData.vehicleRetriever(),
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){   
                var intermediary = angular.copy(row.entity);
                // console.log('Intermediary',intermediary);
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
                $rootScope.finalReport.Main = intermediary;
                // console.log('Final Report Intermediary :-',intermediary);                
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
                
                PRTData.surveysPartsRetriever($rootScope.finalReport.Main._id)
                    .then(function(response) {
                        $rootScope.finalReport.NewParts = response.data;                
                        // $rootScope.finalReport.NewParts = response.data.result;                
                        console.log("Parts data has been received",$rootScope.finalReport.NewParts);    
                        // $rootScope.indexOfLastRep = $rootScope.finalReports[$rootScope.finalReports.length - 1]._id;
                        // console.log('_id of last entry',$rootScope.indexOfLastRep);  
                    }, 
                    function (response){
                        console.log('errors', response);
                });

                SRVCBNData.surveyCabinDetailRetriever($rootScope.finalReport.Main._id)
                    .then(function(response){
                        console.log("Cabin Details have been received",response); 
                        if(response.data.length)
                        // if(response.data.result.length)
                            $rootScope.finalReport.Commercial_vehicle = true;
                        response.data.forEach(function(detail){
                        // response.data.result.forEach(function(detail){

                            if(detail.Type == "Cabin Assembly")
                                $rootScope.finalReport.CabinAssembly.push(detail);
                            else if(detail.Type == "Load Body")
                                $rootScope.finalReport.LoadBody.push(detail);                                
                        });
                        console.log('Cabin assembly data',$rootScope.finalReport.CabinAssembly,'\nLoad body data',$rootScope.finalReport.LoadBody);

                    }, 
                    function (response){
                        console.log('errors', response);
                });

                SRVCBNData.surveyCabinMasterRetriever($rootScope.finalReport.Main._id)
                    .then(function(response){                        
                        console.log("Cabin master data has been received",response);
                        response.data.forEach(function(detail){
                        // response.data.result.forEach(function(detail){
                            if(detail.Type == "Cabin Assembly")
                                $rootScope.finalReport.CabinAssemblyMaster = detail;
                            else if(detail.Type == "Load Body")
                                $rootScope.finalReport.LoadBodyMaster = detail;
                        });
                        console.log('Cabin assembly master data',$rootScope.finalReport.CabinAssemblyMaster,'\nLoad body master data',$rootScope.finalReport.LoadBodyMaster);                        
                    }, 
                    function (response){
                        console.log('errors', response);
                });

                SRCHKData.surveyCheckListRetriever($rootScope.finalReport.Main._id)
                    .then(function(response){                        

                        response.data.forEach(function(element){
                        // response.data.result.forEach(function(element){
                            if(element.Status == 0)
                                element.Status = false;
                            else
                                element.Status = true;                            
                        });
                        $rootScope.finalReport.Check_List = response.data; 
                        // $rootScope.finalReport.Check_List = response.data.result; 
                        console.log("Check List has been received",$rootScope.finalReport.Check_List);
                        }, 
                    function (response){
                        console.log('errors', response);
                }); 
                
                //19/08/17 
                //Below comment is old, code that it's referring to (*1) is used again as the service otherwise was setting 
                // the data into a particular variable. Using it in the current form makes it so that we can use it with different
                // controllers.  

                //See Survey New Parts store for more. The below(PRTData) is code that also functions but isn't used  
                //as the code it worked with sent data here to process which is unrequired. Survey parts details can be 
                //displayed as is without having to store in an intermediary and modify the data structure of the variables 
                //so that it works with tags-input for ex. Currently code in surveyPartsStore, fetches the survey parts 
                //details and stores it in $rootScope.finalReport.NewParts  
                
                //Another approach was to use $q but using it with  with Survey_Vehicle_Details didn't work as the response 
                //didn't change after one call to a the API with a particular ID. It repeated the same response for subsequent calls.
                //Therefore, the current approach is to use a structure like - 

                // storageService.surveysRetriever = function(type){
                //     return $http.get('/api/surveys/'+type);
                // };

                //And process that with

                // SRVData.surveysRetriever('Final')
                //     .then(function(response){
                //         console.log('Success',response);
                //     },function(err){       
                //         console.log('Failure',err);                        
                // });

                //*1e
                // PRTData.surveysPartsRetriever($rootScope.finalReport.Main._id).then(function(response){
                //     console.log('Final Report New Parts data',response.data);
                // },function(err){
                //     console.log('Error retrieving parts details',err);
                // });

                $scope.getVehicleDetail($rootScope.finalReport.Main._id);
                console.log('ID sent for Final Report vehicle details data retrieval',$rootScope.finalReport.Main._id);                                
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('Data after table edit',$scope.vehicleTableGridOptions.data);  
            });
        }				  
    };

    // if($rootScope.finalReportDataLoadedOnce == false){
    //     SRVData.surveysRetriever('Final').then(function(res){
            
    //         $rootScope.finalReportDataLoadedOnce = true;

    //         //FINAL VIEWDATA
    //         $scope.finalReportsTableGridOptions.data = res.data;
    //         // $scope.finalReportsTableGridOptions.data = res.data.result;
    //         $rootScope.finalReports = res.data;
    //         // $rootScope.finalReports = res.data.result;
    //         console.log('Final reports :-',$scope.finalReportsTableGridOptions.data);        
    //     },function(err){
    //         console.log('Error retrieving Final Reports',err);
    //     });                            
    // }
    // else if ($rootScope.finalReportDataLoadedOnce == true){
    //     //FINAL VIEWDATA
    //     $scope.finalReportsTableGridOptions.data = $rootScope.finalReports;
    // }

    if($rootScope.finalReportDataLoadedOnce == false){
        FRData.finalReportRetriever('Final').then(function(res){

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
        //FINAL VIEWDATA
        $scope.finalReportsTableGridOptions.data = $rootScope.finalReports;
    }
    
    $scope.getVehicleDetail = function(id){    
        SVDData.surveysVehicleDetailsRetriever(id)
            .then(function(response){
                if(response.data != null){
                // if(response.data.result != null){
                    // console.log('Final Reports Vehicle data',response.data.result);

                    var vehicleIntermediary = angular.copy(response.data);
                    // var vehicleIntermediary = angular.copy(response.data.result);
                    vehicleIntermediary.Remark_Vehicle = [];                 
                    
                    vehicleIntermediary.Survey_id = id;
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
                    
                    if(response.data.Remark_Vehicle != '' && response.data.Remark_Vehicle != undefined && response.data.Remark_Vehicle != null){
                    // if(response.data.result.Remark_Vehicle != '' && response.data.result.Remark_Vehicle != undefined && response.data.result.Remark_Vehicle != null){
                        vehicleIntermediary.Remark_Vehicle.push({
                            text: response.data.result.Remark_Vehicle   
                        });
                    }

                    if(response.data.Chassis_Phy){
                    // if(response.data.result.Chassis_Phy){
                        vehicleIntermediary.Chassis_Phy = true;
                    }
                    else{
                        vehicleIntermediary.Chassis_Phy = false;
                    }

                    // if(response.data.result.Engine_Phy){
                    if(response.data.Engine_Phy){
                        vehicleIntermediary.Engine_Phy = true;        
                    }
                    else{
                        vehicleIntermediary.Engine_Phy = false;            
                    }

                    //FINAL VIEWDATA
                    $rootScope.finalReport.Vehicle_Details = vehicleIntermediary;                                                
                }
                else
                {
                    //FINAL VIEWDATA
                    $rootScope.finalReport.Vehicle_Details = {};
                }
                console.log("Received vehicle info for the report",$rootScope.finalReport.Vehicle_Details);                
            },function (response) {
                console.log('Failed to fetch vehicle info', response);
        });
    }
                 
    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
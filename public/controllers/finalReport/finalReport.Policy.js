angular.module('MyApp')
    .controller('finalReportPolicy', function($rootScope, $scope, Account, $http, $uibModal,toastr,$interval,$timeout,uiGridConstants,BRCHData,VCLData,INSData,FRData,$q) {
    
    $scope.tinymceOptions = {
        statusbar: false,
        menubar: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table contextmenu paste code'
        ],
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
    }
            
    $scope.binary_choices = [
        { choice: "Yes"},
        { choice: "No"}
    ];

    $rootScope.unit_types = [
        { unit: "CC" },
        { unit: "BHP" }
    ]; 

    $rootScope.anti_theft_types = [
        { type: "Company Fitted" },
        { type: "Others" },
        { type: "No" }
    ];
    
    $scope.dropdownItems = ['dropdown 1', 'dropdown 2', 'dropdown 3'];

    $scope.vehicle_details_remark = '';
    $scope.vehicleRemarkGet = function(userInput) {
          $rootScope.finalReport.Vehicle_Details.Remark_Vehicle = userInput;
    };

    //DATE CONFIG
    $scope.formats = ['dd-MMMM-yyyy', 'dd/MM/yyyy', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.dateOptions = {
        // dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2666, 5, 22),
        // minDate: new Date(),
        startingDay: 1
    };

    $scope.dpick_open = function() {
        $scope.p_date_1.opened = true;
    };

    $scope.p_date_1 = {
      opened: false
    };

    $scope.loadBranches = function(){
        console.log('Insurer selected',$rootScope.finalReport.Main.Survey_Insurer_ID);
        BRCHData.branchRetriever($rootScope.finalReport.Main.Survey_Insurer_ID._id)
        .then(function(response){
            console.log('Branches received',response.data);
            $scope.branches = response.data;
        });
    }

    $scope.insOfficeSel = function(){
        console.log('Branch selected',$rootScope.finalReport.Main.Survey_Branch_ID);
        $rootScope.finalReport.Main.Appointing_Office = $rootScope.finalReport.Main.Survey_Branch_ID;
    }

    //Dummy function to check outpout
    $scope.saveHandler = function(report){
        console.log('Contents',$rootScope.finalReport);

        if((report != 'Final') && !$rootScope.finalReport.Main.hasOwnProperty('_id')){
            toastr.warning('You must save the current report or load a report in order to export','Error')
            return 0;
        }
        else if(report != 'Final' && $rootScope.finalReport.Main.hasOwnProperty('_id'))
            $scope.exportData(report);
        else if(report == 'Final'){
            if($rootScope.finalReport.Main.hasOwnProperty('_id'))
                $scope.updateData();
            else    
                $scope.saveData();
        }
    };

    $scope.exportData = function(report_type){
        console.log('Final Report contents to export',$rootScope.finalReport);
    }

    $scope.saveData = function(){
        console.log('Final report contents',$rootScope.finalReport);      
    
        if($rootScope.finalReport.Main.Survey_Insurer_ID == '' || $rootScope.finalReport.Main.Survey_Insurer_ID == undefined){
            toastr.warning('You need to select an Insurer', 'Data not entered!');
            console.log('Data Missing!');
            return 0;
        }
        if($rootScope.finalReport.Main.Survey_Branch_ID == '' || $rootScope.finalReport.Main.Survey_Branch_ID == undefined){
            toastr.warning('You need to select the Branch of your Insurer', 'Data not entered!');
            console.log('Data Missing!');
            return 0;
        }
        if($rootScope.finalReport.Main.Survey_Vehicle_ID == '' || $rootScope.finalReport.Main.Survey_Vehicle_ID == undefined){
            toastr.warning('You need to select a Vehicle', 'Data not entered!');
            console.log('Data Missing!');
            return 0;
        }        
        if($rootScope.finalReport.Vehicle_Details.Reg_No == '' || $rootScope.finalReport.Vehicle_Details.Reg_No == undefined){
            toastr.warning('You need to enter the vehicle\'s registration number', 'Data not entered!');
            console.log('Data Missing!');
            return 0;
        }
        if($rootScope.finalReport.Main.Insurance_from == '' || $rootScope.finalReport.Main.Insurance_from == undefined){
            toastr.warning('You need to select the start date for the Insurance Policy', 'Data not entered!');
            console.log('Data Missing!');
            return 0;
        }
        if($rootScope.finalReport.Main.Insurance_to == '' || $rootScope.finalReport.Main.Insurance_to == undefined){
            toastr.warning('You need to select the end date for the Insurance Policy', 'Data not entered!');
            console.log('Data Missing!');
            return 0;
        }                

        if(($rootScope.finalReport.Main.Survey_Insurer_ID != '' && $rootScope.finalReport.Main.Survey_Insurer_ID != undefined) && ($rootScope.finalReport.Main.Survey_Branch_ID != '' && $rootScope.finalReport.Main.Survey_Branch_ID != undefined) && ($rootScope.finalReport.Main.Survey_Vehicle_ID != '' && $rootScope.finalReport.Main.Survey_Vehicle_ID != undefined) && ($rootScope.finalReport.Vehicle_Details.Reg_No != '' && $rootScope.finalReport.Vehicle_Details.Reg_No != undefined) && ($rootScope.finalReport.Main.Insurance_from != '' && $rootScope.finalReport.Main.Insurance_from != undefined) && ($rootScope.finalReport.Main.Insurance_to != '' && $rootScope.finalReport.Main.Insurance_to != undefined))  
        {   
            
            //Assigning of data from various variables to final variables to be used for final output object
            var finalReportSurveyDetails = angular.copy($rootScope.finalReport.Main);

            var finalReportVehicleDetails = angular.copy($rootScope.finalReport.Vehicle_Details);
            finalReportVehicleDetails.Data_Exists = true;
            
            var finalReportNewPartsDetails = [];
            var finalReportCabinDetails = [];
            var finalReportCabinMasterDetails = [];
            // var finalReportCheckList = [];
            

            // if($rootScope.finalReport.CabinAssembly.length || $rootScope.finalReport.LoadBody.length){        
                if($rootScope.finalReport.CabinAssembly.length){
                    $rootScope.finalReport.CabinAssembly.forEach(function(element){
                        // element.Data_Exists = true;
                        finalReportCabinDetails.push(element);
                    });    
                }
                
                if($rootScope.finalReport.LoadBody.length){
                    $rootScope.finalReport.LoadBody.forEach(function(element){
                        // element.Data_Exists = true;                        
                        finalReportCabinDetails.push(element);                    
                    });    
                }                
            // }            
            
            finalReportCabinMasterDetails.push($rootScope.finalReport.CabinAssemblyMaster);
            finalReportCabinMasterDetails.push($rootScope.finalReport.LoadBodyMaster);            

            //Check list has separate URL to call (finalReport/Upload)
            // if($rootScope.finalReport.Check_List.length){
            //     $rootScope.finalReport.Check_List.forEach(function(element){
            //         element.Data_Exists = true;                    
            //         element.Status = (element.Status == true) ? 1 : 0;                    
            //     })
            //     finalReportCheckList = angular.copy($rootScope.finalReport.Check_List);
            // }
            // else{
            //     finalReportCheckList.push({"Data_Exists":false});
            // }

            
            if($rootScope.finalReport.NewParts.length){
                $rootScope.finalReport.NewParts.forEach(function(element){
                    // if(element.hasOwnProperty('index'))
                    //     delete element.index;
                    element.IMT_23 = (element.IMT_23 == false) ? 0 : 1;
                    // element.Data_Exists = true;
                })
                finalReportNewPartsDetails = angular.copy($rootScope.finalReport.NewParts);
            }
            else{
                finalReportNewPartsDetails = [];
            }

            if(finalReportSurveyDetails.hasOwnProperty('Appointing_Office'))
                finalReportSurveyDetails.Appointing_Office = $rootScope.finalReport.Main.Appointing_Office._id;

            finalReportSurveyDetails.Survey_Insurer_ID = $rootScope.finalReport.Main.Survey_Insurer_ID.hasOwnProperty('_id') ? $rootScope.finalReport.Main.Survey_Insurer_ID._id : $rootScope.finalReport.Main.Survey_Insurer_ID;
            finalReportSurveyDetails.Survey_Vehicle_ID = $rootScope.finalReport.Main.Survey_Vehicle_ID.hasOwnProperty('_id') ? $rootScope.finalReport.Main.Survey_Vehicle_ID._id : $rootScope.finalReport.Main.Survey_Vehicle_ID;
            finalReportSurveyDetails.Survey_Branch_ID = $rootScope.finalReport.Main.Survey_Branch_ID.hasOwnProperty('_id') ? $rootScope.finalReport.Main.Survey_Branch_ID._id : $rootScope.finalReport.Main.Survey_Branch_ID;
            finalReportSurveyDetails.Insurance_to = moment($rootScope.finalReport.Main.Insurance_to).format("YYYY-MM-DD");
            finalReportSurveyDetails.Insurance_from = moment($rootScope.finalReport.Main.Insurance_from).format("YYYY-MM-DD");
            finalReportSurveyDetails.CD = finalReportSurveyDetails.hasOwnProperty('CD') ? ($rootScope.finalReport.Main.CD == true ? 1 : 0) : 0;
            finalReportSurveyDetails.IMT_23 =  finalReportSurveyDetails.hasOwnProperty('IMT_23') ? ($rootScope.finalReport.Main.IMT_23 == true ? 1 : 0) : 0;
            finalReportSurveyDetails.Submitted =  finalReportSurveyDetails.hasOwnProperty('Submitted') ? ($rootScope.finalReport.Main.Submitted == true ? 1 : 0) : 0;
            finalReportSurveyDetails.Cash_Less =  finalReportSurveyDetails.hasOwnProperty('Cash_Less') ? ($rootScope.finalReport.Main.Cash_Less == true ? 1 : 0) : 0;
            finalReportSurveyDetails.Estimate_Without_Tax_Labour =  finalReportSurveyDetails.hasOwnProperty('Estimate_Without_Tax_Labour') ? ($rootScope.finalReport.Main.Estimate_Without_Tax_Labour == true ? 1 : 0) : 0;
            finalReportSurveyDetails.Estimate_Without_Tax =  finalReportSurveyDetails.hasOwnProperty('Estimate_Without_Tax') ? ($rootScope.finalReport.Main.Estimate_Without_Tax == true ? 1 : 0) : 0;
            finalReportSurveyDetails.Total_Loss =  finalReportSurveyDetails.hasOwnProperty('Total_Loss') ? ($rootScope.finalReport.Main.Total_Loss == true ? 1 : 0) : 0;
            finalReportSurveyDetails.Commercial =  finalReportSurveyDetails.hasOwnProperty('Commercial') ? ($rootScope.finalReport.Main.Commercial == true ? 1 : 0) : 0;
            finalReportSurveyDetails.Paint_Seprate =  finalReportSurveyDetails.hasOwnProperty('Paint_Seprate') ? ($rootScope.finalReport.Main.Paint_Seprate == true ? 1 : 0) : 0;
            finalReportSurveyDetails.Seprate_VAT_Srv_Tax =  finalReportSurveyDetails.hasOwnProperty('Seprate_VAT_Srv_Tax') ? ($rootScope.finalReport.Main.Seprate_VAT_Srv_Tax == true ? 1 : 0) : 0;
          
            finalReportVehicleDetails.vehicle_id = finalReportSurveyDetails.Survey_Vehicle_ID;
            finalReportVehicleDetails.Chassis_Phy =  finalReportVehicleDetails.hasOwnProperty('Chassis_Phy') ? ($rootScope.finalReport.Main.Chassis_Phy == true ? 1 : 0) : 0;
            finalReportVehicleDetails.Engine_Phy =  finalReportSurveyDetails.hasOwnProperty('Engine_Phy') ? ($rootScope.finalReport.Main.Engine_Phy == true ? 1 : 0) : 0;
                                                    
            if($rootScope.finalReport.Main.hasOwnProperty('HPA'))
                finalReportSurveyDetails.HPA = $rootScope.finalReport.Main.HPA.length > 0 ? $rootScope.finalReport.Main.HPA[0].text : ''; 

            if($rootScope.finalReport.Vehicle_Details.hasOwnProperty('Remark_Vehicle'))
                finalReportVehicleDetails.Remark_Vehicle = $rootScope.finalReport.Vehicle_Details.Remark_Vehicle.length > 0 ?  $rootScope.finalReport.Vehicle_Details.Remark_Vehicle[0].text : ''; 


            // var finalReportIMT23 = angular.copy($rootScope.finalReport.???);
            
            finalReportSurveyDetails.Survey_Type = "Final";

            var finalReport = {
                'surveys' : finalReportSurveyDetails,
                'surveyVehicleDetail' : finalReportVehicleDetails,
                // 'surveyCheckList' : finalReportCheckList,
                'surveyPartsDetail' : finalReportNewPartsDetails,
                'surveyCabinDetail' : finalReportCabinDetails,
                'surveyCabinMaster' : finalReportCabinMasterDetails
            }
            console.log('Final Report',finalReport);

            FRData.finalReportSaver(finalReport)
                .then(function(res){
                    console.log('Response',res);

                    $rootScope.finalReport = {};
                    $rootScope.finalReport.Main = {};
                    $rootScope.finalReport.Vehicle_Details = {}; 
                    $rootScope.finalReport.Check_List = []; 
                    $rootScope.finalReport.NewParts = [];
                    $rootScope.finalReport.CabinAssembly = [];
                    $rootScope.finalReport.CabinAssemblyMaster = {
                        'Estimated':'',
                        'Assessed':'',
                        'Dep_Percent':'',
                        'Dep_Amount':'',
                        'Salvage_Percent':'',
                        'Salvage_Amount':'',
                        'Cabin_Glass':'',
                        'Labour':'',
                        'Type':'Cabin Assembly'
                    };    
                    $rootScope.finalReport.LoadBody = [];
                    $rootScope.finalReport.LoadBodyMaster = {
                        'Estimated':'',
                        'Assessed':'',
                        'Dep_Percent':'',
                        'Dep_Amount':'',
                        'Salvage_Percent':'',
                        'Salvage_Amount':'',
                        'Labour':'',
                        'Type':'Load Body'        
                    };

                    // $rootScope.finalReport.Main = res.data.surveys; 
                    // $rootScope.finalReport.NewParts = res.data.SurveyPartsDetail;                    
                    // $rootScope.finalReport.CabinAssembly = [];
                    // $rootScope.finalReport.LoadBody = [];

                    // if(res.data.SurveyCabinDetail.length > 0){
                    //         $rootScope.finalReport.Commercial_vehicle = true;
                    //     res.data.SurveyCabinDetail.forEach(function(detail){                        
                    //         if(detail.Type == "Cabin Assembly")
                    //             $rootScope.finalReport.CabinAssembly.push(detail);
                    //         else if(detail.Type == "Load Body")
                    //             $rootScope.finalReport.LoadBody.push(detail);                                
                    //     });
                    // }

                    // res.data.SurveyCabinMaster.forEach(function(detail){
                    //     if(detail.Type == "Cabin Assembly")
                    //         $rootScope.finalReport.CabinAssemblyMaster = detail;
                    //     else if(detail.Type == "Load Body")
                    //         $rootScope.finalReport.LoadBodyMaster = detail;
                    // });

                    // $scope.setVehicleDetail(res.data.surveyVehicleDetail[0]);
                    // $scope.setSurveysDetail(res.data.surveys);

                    toastr.success('The Final Report was saved','Success')
            })

        }
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

        $rootScope.finalReport.Vehicle_Details = vehicleIntermediary;                                                        
        console.log('Vehicle details',$rootScope.finalReport.Vehicle_Details);
    }

    $scope.setSurveysDetail = function(survey){

        var intermediary = angular.copy(survey);
        intermediary.HPA = [];  

        intermediary.Survey_Date = moment(survey.Survey_Date).toDate();
        intermediary.Insurance_from = moment(survey.Insurance_from).toDate();
        intermediary.Insurance_to = moment(survey.Insurance_to).toDate();
        intermediary.Accident_Date = moment(survey.Accident_Date).toDate();
        intermediary.Allowtment_Date = moment(survey.Allowtment_Date).toDate();
        intermediary.Inspection_Date = moment(survey.Inspection_Date).toDate();
        intermediary.Repairing_Photo_Date = moment(survey.Repairing_Photo_Date).toDate();
        intermediary.Reinspection_Date = moment(survey.Reinspection_Date).toDate();       

        intermediary.Total = intermediary.Assessed_Labour - intermediary.Excess - intermediary.Excess_I;
        
        if(survey.HPA != ''){
            intermediary.HPA.push({
                text: survey.HPA
            });
        }

        if(survey.Photo_Qty){
            intermediary.Photo_Present = true;
        }else{
            intermediary.Photo_Present = false;
        }

        if(survey.Submitted){
            intermediary.Submitted = true;
        }else{
            intermediary.Submitted = false;
        }

        if(survey.CD){
            intermediary.CD = true;
        }else{
            intermediary.CD = false;
        }

        if(survey.Cash_Less){
            intermediary.Cash_Less = true;
        }else{
            intermediary.Cash_Less = false;
        }

        intermediary.Address = survey.Address + ' ' +survey.Address_2;
                        
        console.log('Intermediary',intermediary);        
        
        $rootScope.finalReport.Main = intermediary;

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
    }

    $scope.surveyCheckListUpdate = function(surveyId,report){
        if($rootScope.finalReport.Check_List.length){
            $rootScope.finalReport.Check_List.forEach(function(element,index){
                if(element.hasOwnProperty('_id')){
                	
                	if(element.hasOwnProperty('Data_Exists')){
                		element.Data_Exists = true;
                	}
                    if(element.Status == false)
                        element.Status = 0;
                    else
                        element.Status = 1;

                    if(element.updated_at != null)
                        element.updated_at = moment(element.updated_at).format("YYYY-MM-DD hh:mm:ss");
                    if(element.created_at != null)
                        element.created_at = moment(element.created_at).format("YYYY-MM-DD hh:mm:ss");

                    SRCHKData.surveyCheckListUpdater(element)
                        .then(function(response){
                            console.log('Check List element update response',response);
                    });
                }
            })
        }
        else{
            console.info('Nothing in the checklist to update');
            toastr.info('No data to update...','Checklist')
        } 
    }
    
	$scope.vehicleChange = function(){
		console.log('A new Vehicle has been selected',$rootScope.finalReport.Main.Survey_Vehicle_ID);
		$rootScope.finalReportTemp.newPartTypes = [];
	    $rootScope.finalReportTemp.newPartNames = [];	    
	    
	    var v = $rootScope.finalReport.Main.Survey_Vehicle_ID;
	    
	    if(v.hasOwnProperty('Make_Model')){$rootScope.finalReport.Vehicle_Details.Make_Model = angular.copy(v.Make_Model)}
	    if(v.hasOwnProperty('Fuel_Used')){$rootScope.finalReport.Vehicle_Details.Fuel_Used = angular.copy(v.Fuel_Used)}
	    if(v.hasOwnProperty('Body_Type')){$rootScope.finalReport.Vehicle_Details.Body_Type = angular.copy(v.Body_Type)}
	    if(v.hasOwnProperty('Vehicle_Class')){$rootScope.finalReport.Vehicle_Details.Vehicle_Class = angular.copy(v.Vehicle_Class)}
	    if(v.hasOwnProperty('Pre_Accident_Condition')){$rootScope.finalReport.Vehicle_Details.Pre_Accident_Condition = angular.copy(v.Pre_Accident_Condition)}
	    if(v.hasOwnProperty('Reg_Laden_Wt')){$rootScope.finalReport.Vehicle_Details.Reg_Laden_Wt = angular.copy(v.Reg_Laden_Wt)}
	    if(v.hasOwnProperty('UnLaden_Wt')){$rootScope.finalReport.Vehicle_Details.UnLaden_Wt = angular.copy(v.UnLaden_Wt)}
	    if(v.hasOwnProperty('Seating_Capacity')){$rootScope.finalReport.Vehicle_Details.Seating_Capacity = angular.copy(v.Seating_Capacity)}
	    if(v.hasOwnProperty('Cubic_Capacity')){$rootScope.finalReport.Vehicle_Details.Cubic_Capacity = angular.copy(v.Cubic_Capacity)}
	    if(v.hasOwnProperty('Fitness_Certificate')){$rootScope.finalReport.Vehicle_Details.Fitness_Certificate = angular.copy(v.Fitness_Certificate)}
	    if(v.hasOwnProperty('Permit_No')){$rootScope.finalReport.Vehicle_Details.Permit_No = angular.copy(v.Permit_No)}
	    if(v.hasOwnProperty('Permit_Type')){$rootScope.finalReport.Vehicle_Details.Permit_Type = angular.copy(v.Permit_Type)}
	    if(v.hasOwnProperty('Route_Area')){$rootScope.finalReport.Vehicle_Details.Route_Area = angular.copy(v.Route_Area)}
	    if(v.hasOwnProperty('Tax_Particulars')){$rootScope.finalReport.Vehicle_Details.Tax_Particulars = angular.copy(v.Tax_Particulars)}
	    if(v.hasOwnProperty('Authorization')){$rootScope.finalReport.Vehicle_Details.Authorization = angular.copy(v.Authorization)} 
	}
    
    $scope.setRegOwner = function(){
        console.log('Hello');
        swal({
                title: "Are you sure?",
                text: "Do you want to set this person as the registered owner?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, change it!",
                closeOnConfirm: false
            },
              function(){
                swal("Done!", "The registered owner has been changed.", "success");
                $scope.chOwn();
            });
    };
    
    $scope.chOwn = function(){
      console.log('pOwner',$rootScope.finalReport.Main.Insured_Name);      
      $rootScope.finalReport.Vehicle_Details.Reg_Owner = $rootScope.finalReport.Main.Insured_Name;
      $timeout(function() {
                 $scope.$apply();              
            });
      console.log('A change has occured!');
    }  
    
    //POLICY TYPE LOGIC INCLUDING POPOVER        
    $scope.pt_assess = function(){
    	
        console.log('Assessment of policy type start');
        console.log('Assessment of policy type sr no',$rootScope.finalReportTemp.pTypeSrNo);
        console.log('Assessment of policy type cv',$rootScope.finalReportTemp.pTypeCV);
        console.log('Assessment of policy type ot',$rootScope.finalReportTemp.pTypeOT);
        
        if($rootScope.finalReportTemp.pTypeSrNo < 3 && !$rootScope.finalReportTemp.pTypeCV && !$rootScope.finalReportTemp.pTypeOT)
            $rootScope.finalReport.Main.Policy_Type = $rootScope.policy_types[1].type;
        else if($rootScope.finalReportTemp.pTypeSrNo > 2 || $rootScope.finalReportTemp.pTypeCV || $rootScope.finalReportTemp.pTypeOT)
            $rootScope.finalReport.Main.Policy_Type = $rootScope.policy_types[2].type;        
    }

    $scope.pt_detect = function(){
        console.log('Change of value',$rootScope.finalReport.Main.Policy_Type);
        var c_value = $rootScope.finalReport.Main.Policy_Type;
        if(c_value == "Regular")
        {
            console.log('Policy type change', $rootScope.finalReport.Main.Policy_Type);
            $scope.closePType();
        }
        if(c_value == "Add on policy" || c_value == "Add on policy(Not effective)")
        {
            console.log('Policy type change', $rootScope.finalReport.Main.Policy_Type);
            $scope.openPType();
        }
        if(c_value == "Add on policy" && ($rootScope.finalReportTemp.pTypeSrNo > 2 || $rootScope.finalReportTemp.pTypeCV || $rootScope.finalReportTemp.pTypeOT))
        {
            $rootScope.finalReport.Main.Policy_Type = $rootScope.policy_types[2].type;
        }
    }

    $scope.openPType = function(){	
        $scope.pTypePopover.popoverIsOpen = true;
    }
    $scope.closePType = function(){	
        $scope.pTypePopover.popoverIsOpen = false;
    }

    $scope.pTypePopover = {    
        popoverIsOpen : false,
        templateUrl: 'policyTypeAssessor.html'   
    };
        
    $scope.insurance_from_dpick_open = function() {
        $scope.insurance_from_date.opened = true;
    };
  
    $scope.insurance_from_date = {
      opened: false
    };

    $scope.setPInsuranceToDate = function()
    {
        //To Date is required or we get an object instead. Can also get the date using  ...add(11,'M')._d   
        $rootScope.finalReport.Main.Insurance_to = moment($rootScope.finalReport.Main.Insurance_from).add(364,'d').toDate(); 
        console.log('11 M+ insurance from -',$rootScope.finalReport.Main.Insurance_to);
    }
  
    $scope.insurance_to_dpick_open = function() {
        $scope.insurance_to_date.opened = true;
    };


    $scope.insurance_to_date = {
        opened: false
    };
  
    $scope.insurance_offices = [
        {text: "Office A"},
        {text: "Office B"},
        {text: "Office C"},
        {text: "Office D"},
        {text: "Office E"},
        {text : "Office F"},
    ];

    $scope.insuranceOfficeChange = function(){

        console.log('insurance office',$rootScope.policy.insurance_office);
        if($rootScope.policy.appointing_office.length < 1)
        {
            $rootScope.policy.appointing_office.push(
              {
                text: $rootScope.policy.insurance_office
              }
            );
        }
    }
    //---------------INSURANCE OFFICE END--------------------------------        
    //---------------APPOINTING OFFICE-----------------------------------    
    // $scope.policy.appointing_office = [];
            
    $scope.hpa_options = [
        {text: 'Option 1'},
        {text: 'Option 2'},
        {text: 'Option 3'},
        {text: 'Option 4'}
    ];

    //Since HPA is supposed to be a single select dropdown with input, only one input is allowed. This function checks and splices the Array at index 1.
    $scope.checkHPA = function(){
    	console.log('Checking',$rootScope.finalReport.Main);
        if($rootScope.finalReport.Main.HPA.length > 1)
            {
                console.log('Too many tags');
                $rootScope.finalReport.Main.HPA.splice(1,1);
            }
    }

    $scope.loadHPAList = function(query){

        return $scope.hpa_options;

    }

    //------------------------------//

    //PURCHASE DATE SECTION
  
    $scope.dt_purchase_dpick_open = function() {
        $scope.dt_purchase_date.opened = true;
    };


    $scope.dt_purchase_date = {
      opened: false
    };
    
    //REGISTRATION DATE SECTION
  
    $scope.dt_regis_dpick_open = function() {
        $scope.dt_regis_date.opened = true;
    };


    $scope.dt_regis_date = {
      opened: false
    };
        
    $rootScope.finalReport.Vehicle_Details.Remark_Vehicle = [];

    $scope.checkVDR = function(){
        if($rootScope.finalReport.Vehicle_Details.Remark_Vehicle.length > 1)
            {
                console.log('Too many tags up in here',$rootScope.finalReport.Vehicle_Details.Remark_Vehicle);
                $rootScope.finalReport.Vehicle_Details.Remark_Vehicle.splice(1,1);
            }
    }

    $scope.loadPolicyRemarksList = function(){
        return $scope.policy.VDRemarksList;  
    }  
  
    $scope.date_of_birth_dpick_open = function() {
        $scope.date_of_birth_date.opened = true;
    };


    $scope.date_of_birth_date = {
      opened: false
    };

  
    $scope.issue_date_dpick_open = function() {
        $scope.issue_date_date.opened = true;
    };


    $scope.issue_date_date = {
        opened: false
    };


    $scope.upto_ntv_dpick_open = function() {
        $scope.upto_ntv_date.opened = true;
    };


    $scope.upto_ntv_date = {
        opened: false
    };

    $scope.valid_from_dpick_open = function() {
        $scope.valid_from_date.opened = true;
    };

    $scope.valid_from_date = {
        opened: false
    };


    $scope.upto_tv_dpick_open = function() {
        $scope.upto_tv_date.opened = true;
    };

    $scope.upto_tv_date = {
        opened: false
    };

    //FITNESS DATES
    $scope.setPFitnessToDate = function()
    {
      //To Date is required or we get an object instead. Can also get the date using  ...add(11,'M')._d   
      $scope.policy.fitness_to = moment($scope.policy.fitness_from).add(11,'M').toDate(); 
      console.log('11 M+ fitness from -',$scope.policy.fitness_to);
    }

    $scope.fitness_from_dpick_open = function() {
        $scope.fitness_from_date.opened = true;
    };
    $scope.fitness_to_dpick_open = function() {
        $scope.fitness_to_date.opened = true;
    };

    $scope.fitness_from_date = {
      opened: false
    };
    $scope.fitness_to_date = {
      opened: false
    };
    
    //PERMIT DATES
 
    $scope.setPPermitToDate = function()
    {
      //To Date is required or we get an object instead. Can also get the date using  ...add(11,'M')._d   
      $scope.policy.permit_to = moment($scope.policy.permit_from).add(5,'Y').toDate(); 
      console.log('5 Y+ permit from -',$scope.policy.permit_to);
    }

    $scope.permit_from_dpick_open = function() {
        $scope.permit_from_date.opened = true;
    };
    $scope.permit_to_dpick_open = function() {
        $scope.permit_to_date.opened = true;
    };

    $scope.permit_from_date = {
      opened: false
    };
    $scope.permit_to_date = {
      opened: false
    };

    //---For Policy tab's Checklist
    $scope.policyChecklist = function() {   
        $uibModal.open({
            animation:true,              
            templateUrl: 'policyChecklist.html',
            controller: 'finalReportPolicyChecklist',
            // size: 'lg',
            resolve: { 
                // schoolId : function () { return $scope.schoolId; },                                  
                // user_id : function () { return $scope.user_id; }
            }
         })
        .result.then(
            function () { /*alert("OK");*/ }, 
            function () { /*alert("Cancel");*/ }
        );
    };

    //---For Insurer Master
    $scope.insurerMaster = function() {   

        $uibModal.open({
              animation:true,              
              templateUrl: 'insurerMaster.html',
              controller: 'insurerMaster',
              size: 'lg',
              resolve: { 
                  // schoolId : function () { return $scope.schoolId; },                                  
                    // user_id : function () { return $scope.user._id; }
                }
         })
        .result.then(
            function () { /*alert("OK");*/ }, 
            function () { /*alert("Cancel");*/ }
        );
    };

    //---For Vehicle Master

    $scope.vehicleMaster = function() {                   

        $uibModal.open({
              animation:true,              
              templateUrl: 'vehicleMaster.html',
              controller: 'vehicleMaster',
              size: 'lg',
              resolve: { 
                  // schoolId : function () { return $scope.schoolId; },                                  
                    // user_id : function () { return $scope.user_id; }
                }
         })
        .result.then(
            function () { /*alert("OK");*/ }, 
            function () { /*alert("Cancel");*/ }
        );
    };
    
    $scope.branchMaster = function() {   
        $uibModal.open({
              animation:true,              
              templateUrl: 'branchMaster.html',
              controller: 'branchMaster',
              size: 'lg',
              resolve: { 
                    // user_id : function () { return $scope.user_id; }
                }
         })
        .result.then(
            function () { /*alert("OK");*/ }, 
            function () { /*alert("Cancel");*/ }
        );
    }; 

    $scope.getReportList = function() {   
        $uibModal.open({
            animation:true,              
            templateUrl: 'insuranceReportListMaster.html',
            controller: 'insuranceReportMasterFinalReport',
            size: 'lg',
            resolve: {}
            })
            .result.then(
                function () { /*alert("OK");*/ }, 
                function () { /*alert("Cancel");*/ }
            );
    };    
});

angular.module('MyApp').controller("finalReportPolicyChecklist", function ($rootScope,$scope,$http, $uibModalInstance,$timeout,toastr,SRCHKData) {

    $rootScope.policyChecklist = [
        { checked: false, particular_name: 'Claim Form'},
        { checked: false, particular_name: 'R.C. Book'},
        { checked: false, particular_name: 'Driving License'},
        { checked: false, particular_name: 'Estimate'},
        { checked: false, particular_name: 'FIRs/Police Panchnama'},
        { checked: false, particular_name: 'Tax Particulars'}
    ];

    $scope.chkLst = {
        'Status' : 0,
        'Description' : '',
        'Attached_File' : ''        
    }

    $scope.addPCLItem = function(){		
        if(!$rootScope.finalReport.Main.hasOwnProperty('_id')){
            toastr.error('Please load a report first in order to add checklist items or attachments')
            return 0;
        }
        
        if($scope.chkLst.Description == ''){
            toastr.warning('Please enter the item name');
            return 0;
        }
        
        if($scope.chkLst.Description != '' )
        {
        	console.log('CL',$scope.chkLst);

        	var fd = new FormData();
        	fd.append("survey_id", $rootScope.finalReport.Main._id);
        	fd.append("status", $scope.chkLst.Status);
        	fd.append("description", $scope.chkLst.Description);          
        	for (i=0; i<$scope.chkLst.Attached_File.length; i++) {
                fd.append("file", $scope.chkLst.Attached_File[i]);
            };        	            
            
        	var config = { headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }

        	console.log('FD1',fd);

            //OLD REQ
        	// $http.post("http://125.99.24.66:8081/api/survey_check_list/", fd, {
            //     transformRequest: angular.identity,
            //     headers: {'Content-Type': undefined}
            // })

            $http.post("http://125.99.24.66:8081/api/final_report/upload", fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })

            // $http({
            //     method : "POST",
            //     url : "/api/survey_check_list/",
            //     data : fd,
            //     config:{
            //         transformRequest: angular.identity,
            //         headers: {'Content-Type': undefined}
            //     }
                // config: { 
                // 	transformRequest: angular.identity,
                // 	headers: {'Content-Type': undefined}
                // }
                // transformRequest: function (fd, headersGetter) {
                //     var formData = new FormData();
                //     angular.forEach(fd, function (value, key) {
                //         formData.append(key, value);
                //     });

                //     var headers = headersGetter();
                //     delete headers['Content-Type'];

                //     return formData;
                // }
            // })    
        	.then(function(response) {
                console.log("CheckList Item added",response);
            }, 
            function (response){
                console.log('An Error occured while saving', response);
            });
            console.log("Item added", $rootScope.finalReport.Check_List);
        }

        $scope.chkLst = {
	        'Status':0,
	        'Description':'',
	        'Attached_File' : ''        
        }
    };
        
    $scope.removePCLItem = function(index){

        if(!$rootScope.finalReport.Check_List[index].hasOwnProperty('_id')){
            $rootScope.finalReport.Check_List.splice(index,1);
            return 0;                            
        }

        console.log('Id of item to delete',$rootScope.finalReport.Check_List[index]._id);
        SRCHKData.surveyCheckListDeleter($rootScope.finalReport.Check_List[index]._id)
            .then(function(response){
                toastr.success('The item was deleted','Success');
                $rootScope.finalReport.Check_List.splice(index,1);                
            })
            .catch(function(error){
                toastr.error('An error occured while deleting the Item, please try again','Error')
            });
    };

    $scope.ok = function () {  $uibModalInstance.close();  };
    $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
});
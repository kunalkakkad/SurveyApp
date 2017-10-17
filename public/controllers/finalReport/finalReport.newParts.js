angular.module('MyApp')
    .controller('finalReportNewParts', function($rootScope, $scope, $http, $uibModal,toastr,$interval,$timeout,uiGridConstants,VCLData,$sce,FRData) {
        
    console.log('Within finalReportNewParts controller');    

    $scope.index = 1;
    $scope.ca_index = 1;
    $scope.lb_index = 1;
    $scope.selectedNewPart = {};
    $scope.selectedCabinAssemblyData = {};
    $scope.selectedLoadBodyData = {};    
    $scope.lb_selected = false;
    $scope.ca_selected = false;

    $scope.calculations = {
        'Estimate_Total' : 0,
        'Assessed_Total' : 0,
        'Difference' : 0,
        'Painting_Total' : 0,
        'Denting_Total' : 0,
        'Removing_Refitting_Total' : 0        
    }

    $scope.newPart = {
	    'Depriciation'  : 0,
	    'Part_Name'     : '',
	    'HSN_No'   : '',
	    'Damage'   : '',
	    'Sr_No'    : '',
	    'HC'       : 0,
	    'Estimated' : 0,
	    'Assessed' : 0,
	    'GST'  : 0,
	    'Part_Type'     : '',  
	    'IMT_23'   : false,
	    'Denting'  : 0,
	    'Removing_Refitting'  : 0,
	    'Painting' : 0,
	    'Labour'   : 0,
	    'Garage_ID'   : 0
    };


    $scope.cbdata = {
        'Parts_Name':'',
        'Estimated':0,
        'Assessed':0,
        'Type' : 'Cabin Assembly'
    };
    $scope.lbdata = {
        'Parts_Name':'',
        'Estimated':0,
        'Assessed':0,
        'Type' : 'Load Body'
    };

    $scope.remark_choices = [
        { choice: "Broken"},
        { choice: "Pressed"}
    ];
    
    $scope.showVal = function(){
        console.log('Value of ',$rootScope.finalReport);        
    }    
    
    $scope.partNameSelectPopover = $sce.trustAsHtml('<div class="input-group input-group-sm">' +    		
		        	'<select name="part_name" ng-model="newPart.Part_Name" class="form-control" ng-options="part.Part_Name for part in finalReportTemp.newPartNames">' +
		            	'<option value="" selected="selected">Select</option>'+
		            '</select>'+        
        	'</div>');
    
    $scope.printToCart = function(printSectionId) {
        var innerContents = document.getElementById(printSectionId).innerHTML;
        var popupWinindow = window.open('', '_blank', 'width=700,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
        popupWinindow.document.close();
    }
                 
    $rootScope.finalReportTemp.newPartNames = [];
    
    $scope.getPartsInfo = function(){
        console.log('Attempting to retrieve parts list');
        if($rootScope.finalReport.Main.hasOwnProperty('Survey_Vehicle_ID'))
        {
        	if($rootScope.finalReport.Main.Survey_Vehicle_ID.hasOwnProperty('_id')){
	        	VCLData.vehiclePartsRetriever($rootScope.finalReport.Main.Survey_Vehicle_ID._id)
	                .then(function(response){
	                     console.log('Parts retrieved',response.data);
	                     
	                     $rootScope.finalReportTemp.newPartNames = response.data; 
	                     
	                    console.log('Part Names',$rootScope.finalReportTemp.newPartNames);
	                })
        		}
        	else{
        		VCLData.vehiclePartsRetriever($rootScope.finalReport.Main.Survey_Vehicle_ID)
	                .then(function(response){
	                     console.log('Parts retrieved',response.data);
	                     
	                     $rootScope.finalReportTemp.newPartNames = response.data; 
	                     
	                    console.log('Part Names',$rootScope.finalReportTemp.newPartNames);
	                })    		
        	}
        }
    }

    $scope.getPartsInfo();
    
    $scope.setPartType = function(){
    	console.log('Part Selected',$scope.newPart.Part_Name);
    	$scope.newPart.Part_Type = $scope.newPart.Part_Name.Part_Type;
    	
    }

    $scope.surveyFormatter = function(){
        
        var finalReportSurveyDetails = 0;

        if($rootScope.finalReport.Main.hasOwnProperty('_id')){

        var finalReportSurveyDetails = angular.copy($rootScope.finalReport.Main);
        
        finalReportSurveyDetails.Survey_Insurer_ID = $rootScope.finalReport.Main.Survey_Insurer_ID.hasOwnProperty('_id') ? $rootScope.finalReport.Main.Survey_Insurer_ID._id : $rootScope.finalReport.Main.Survey_Insurer_ID;
        finalReportSurveyDetails.Survey_Vehicle_ID = $rootScope.finalReport.Main.Survey_Vehicle_ID.hasOwnProperty('_id') ? $rootScope.finalReport.Main.Survey_Vehicle_ID._id : $rootScope.finalReport.Main.Survey_Vehicle_ID;
        finalReportSurveyDetails.Survey_Branch_ID = $rootScope.finalReport.Main.Survey_Branch_ID.hasOwnProperty('_id') ? $rootScope.finalReport.Main.Survey_Branch_ID._id : $rootScope.finalReport.Main.Survey_Branch_ID;
        
        if(finalReportSurveyDetails.hasOwnProperty('Appointing_Office'))
            finalReportSurveyDetails.Appointing_Office = $rootScope.finalReport.Main.Appointing_Office._id;
        
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
                            
        if($rootScope.finalReport.Main.hasOwnProperty('HPA'))
            finalReportSurveyDetails.HPA = $rootScope.finalReport.Main.HPA.length > 0 ? $rootScope.finalReport.Main.HPA[0].text : '';    
        }
    
        return finalReportSurveyDetails;

    };

    //TODO
    //Add a function to make calculations again 
    
    $scope.partsTableGridColumns = [
      {name: "Dep %", field: "Depriciation", width: "80" },
      {name: "Part Name",field: "Part_Name",width: "100",enableCellEdit: true,
    	  editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownOptionsArray: $rootScope.finalReportTemp.newPartNames,
          editDropdownIdLabel: 'Part_Name',
          editDropdownValueLabel: 'Part_Name',
        
      },      
      {name: "HSN No",field: "HSN_No",width: "100",enableCellEdit: true},
      {name: "Remark",field: "Damage",width: "100",enableCellEdit: true},
      {name: "Sr No",field: "Sr_No", width: "80" },
      {name: "(Hc) (in %)",field: "HC",width: "90",enableCellEdit: true},
      {name: "Estimated",field: "Estimated",width: "100",enableCellEdit: true},
      {name: "Assessed",field: "Assessed",width: "100",enableCellEdit: true},                        
      {name: "Gst Tax (in %)",field: "GST",width: "120",type: 'number',enableCellEdit: true},
      {name: "Total",field: "Total",width: "120",enableCellEdit: false},
    //   {name: "Metal",field: "Metal",width: "100",enableCellEdit: true},
    //   {name: "Salvage",field: "Salvage",width: "100",enableCellEdit: true},
      {name: "Type",field: "Part_Type",width: "125", enableCellEdit: false,
		  editableCellTemplate: 'ui-grid/dropdownEditor',
		  editDropdownOptionsArray: $rootScope.finalReportTemp.newPartTypes,
		  editDropdownIdLabel: 'Part_Type',
          editDropdownValueLabel: 'Part_Type',
        // cellFilter: 'partType'
      },
      {name: "Imt 23",field: "IMT_23",width: "80",type: 'boolean',enableCellEdit: true},
      {name: "Denting",field: "Denting",width: "90",type: 'number',enableCellEdit: true},
      {name: "Removing/Refitting",field: "Removing_Refitting",width: "145",type: 'number',enableCellEdit: true},
      {name: "Painting",field: "Painting",width: "100",type: 'number',enableCellEdit: true},      
      {name: "Labour",field: "Labour",width: "90",type: 'number',enableCellEdit: true},
      {name: "Grand Total",field: "Grand_Total",width: "120",visible: true ,enableCellEdit: false},
      {name: "Garage",field: "Garage_ID",width: "120",visible: false,enableCellEdit: true},
    ];

    $scope.partsTableGridOptions = {
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.partsTableGridColumns,
        data: $rootScope.finalReport.NewParts,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.selectedNewPart = row.entity;
                console.log('selectedNewPart',$scope.selectedNewPart);
            });
            
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('After table edit',$scope.partsTableGridOptions.data);  
                console.log('Row data -',rowEntity);
                
                rowEntity.Total = (parseFloat(rowEntity.GST/100) * parseFloat(rowEntity.Assessed)) + parseFloat(rowEntity.Assessed);
                rowEntity.Grand_Total = parseFloat(rowEntity.Total) + parseFloat(rowEntity.Painting) + parseFloat(rowEntity.Denting) + parseFloat(rowEntity.Labour) + parseFloat(rowEntity.Removing_Refitting);
            	
            	
            });
        }				  
    };    
    
    $scope.activateGarageColumn = function(){
        console.log('Trying to show garage column');
        $scope.partsTableGridOptions.columnDefs[10].visible = !($scope.partsTableGridOptions.columnDefs[10].visible || $scope.partsTableGridOptions.columnDefs[10].visible === undefined);
			  $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);  
    };
        
    var lastP = 0;
    var valid_est = 0;
    var valid_ass = 0;
    var valid_gst = 0;
    var valid_hc = 0;

    $scope.addPartsData = function() {                        
            console.log('Adding part');
            //TODO
            //Calculations have to be added when the grid is edited.
            // $scope.calculations.Estimate_Total = parseFloat($scope.calculations.Estimate_Total) + parseFloat($scope.newPart.Estimated);  
            // $scope.calculations.Assessed_Total = parseFloat($scope.calculations.Assessed_Total) + parseFloat($scope.newPart.Assessed);  
            // $scope.calculations.Difference = parseFloat($scope.calculations.Estimate_Total) - parseFloat($scope.calculations.Assessed_Total);  
            // $scope.calculations.Painting_Total = parseFloat($scope.calculations.Painting_Total) + parseFloat($scope.newPart.Painting);  
            // $scope.calculations.Denting_Total = parseFloat($scope.calculations.Denting_Total) + parseFloat($scope.newPart.Denting);  
            // $scope.calculations.Removing_Refitting_Total = parseFloat($scope.calculations.Removing_Refitting_Total) + parseFloat($scope.newPart.Removing_Refitting);  
            
            // var Total = (parseFloat($scope.newPart.GST/100) * parseFloat($scope.newPart.Assessed)) + parseFloat($scope.newPart.Assessed);
            // var grandTotal = parseFloat(Total) + parseFloat($scope.newPart.Painting) + parseFloat($scope.newPart.Denting) + parseFloat($scope.newPart.Labour) + parseFloat($scope.newPart.Removing_Refitting);
            
            
            $rootScope.finalReport.NewParts.push({
                'index': $scope.index,
                'Depriciation'  : 0,
                'Part_Name'     : '',
                'Damage'   : '',
                'Estimated' : 0,
                'Assessed' : 0,
                'Sr_No'  : '',
                'HC'       : 0,
                'GST'  : 0,
                'IMT_23'  : false,
                'Removing_Refitting'  : 0,
                'Denting'  : 0,
                'Painting'  : 0,
                'Part_Type'     : '',    
                'HSN_No'     : 0,
                'Labour'     : 0,
                'Total': 0,
                'Grand_Total': 0,
                'Garage_ID'   : 0
            });

            $scope.index = $scope.index + 1;
            // toastr.success('The New Part was added','Success');        
    };

    $scope.finalReportNewPartsDataToSave = {
        'surveys' : $scope.surveyFormatter(),
        'surveyPartsDetail': [],
    }
    
    $scope.updateNewParts = function(){
        // $scope.finalReportNewPartsDataToSave.surveyPartsDetail = [];
    	if(!$rootScope.finalReport.Main.hasOwnProperty('_id')){
            toastr.error('Please load a report first');
            return 0;
        }
        
        if($rootScope.finalReport.NewParts.length){
            $scope.finalReportNewPartsDataToSave.surveyPartsDetail = $rootScope.finalReport.NewParts;            
            $scope.finalReportNewPartsDataToSave.surveyPartsDetail.forEach(function(element){
                element.IMT_23 = (element.IMT_23 == false) ? 0 : 1;
    		})
            FRData.finalReportSaver($scope.finalReportNewPartsDataToSave)
                .then(function(response) {
                    console.log("New Parts Data updated",response);                    
                    var tempNP = response.data.SurveyPartsDetail;
                    tempNP.forEach(function(element){
                        element.IMT_23 = (element.IMT_23 == 0) ? false : true;
                    })
                    $rootScope.finalReport.NewParts = [];
                    $rootScope.finalReport.NewParts = tempNP;     
                    $scope.partsTableGridOptions.data = $rootScope.finalReport.NewParts;                
                    toastr.success('The New Parts data was updated','Success',{ progressBar:true,maxOpened:1});
                },
                function (response){
                    console.log('An Error occured while updating', response);
                });
    	} else{
    		toastr.info('There is no New Parts data to update','Nothing to update');
    	}
    };

    $scope.deleteSelectedPart = function(){
        if(!$scope.selectedNewPart.hasOwnProperty('_id') && !$scope.selectedNewPart.hasOwnProperty('index'))                    
            toastr.info('Please select a part in order to delete it','No Part Selected');

        if($scope.selectedNewPart.hasOwnProperty('_id')){
            FRData.finalReportPartDeleter($scope.selectedNewPart._id)
                .then(function(response){
                	
                	$rootScope.finalReport.NewParts.forEach(function(part,index){
                        if($scope.selectedNewPart._id == part._id){
                            console.log('Index of part to be deleted',$scope.selectedNewPart._id,'\nCurrent Index',index);                            
                            $rootScope.finalReport.NewParts.splice(index,1);
                            $scope.selectedNewPart = {};               
                        }
                	});
                	
                    $scope.calculations.Estimate_Total = parseFloat($scope.calculations.Estimate_Total) - parseFloat($scope.selectedNewPart.Estimated);  
                    $scope.calculations.Assessed_Total = parseFloat($scope.calculations.Assessed_Total) - parseFloat($scope.selectedNewPart.Assessed);  
                    $scope.calculations.Difference = parseFloat($scope.calculations.Estimate_Total) - parseFloat($scope.calculations.Assessed_Total);  
                    $scope.calculations.Painting_Total = parseFloat($scope.calculations.Painting_Total) - parseFloat($scope.selectedNewPart.Painting);  
                    $scope.calculations.Denting_Total = parseFloat($scope.calculations.Denting_Total) - parseFloat($scope.selectedNewPart.Denting);  
                    $scope.calculations.Removing_Refitting_Total = parseFloat($scope.calculations.Removing_Refitting_Total) - parseFloat($scope.selectedNewPart.Removing_Refitting);  

                    toastr.success('The Part was deleted','Success');
                    $scope.selectedNewPart = {};                    
                })
                .catch(function(response){
                    toastr.error('There was an error deleting the part','Error')                    
                })
        }
        else if($scope.selectedNewPart.hasOwnProperty('index'))
        {
            $rootScope.finalReport.NewParts.forEach(function(part,index){
                if($scope.selectedNewPart.index == part.index){
                    console.log('Index of part to be deleted',$scope.selectedNewPart.index);
                    console.log('Current Index',index);
                    
                    $scope.calculations.Estimate_Total = parseFloat($scope.calculations.Estimate_Total) - parseFloat($scope.selectedNewPart.Estimated);  
                    $scope.calculations.Assessed_Total = parseFloat($scope.calculations.Assessed_Total) - parseFloat($scope.selectedNewPart.Assessed);  
                    $scope.calculations.Difference = parseFloat($scope.calculations.Estimate_Total) - parseFloat($scope.calculations.Assessed_Total);  
                    $scope.calculations.Painting_Total = parseFloat($scope.calculations.Painting_Total) - parseFloat($scope.selectedNewPart.Painting);  
                    $scope.calculations.Denting_Total = parseFloat($scope.calculations.Denting_Total) - parseFloat($scope.selectedNewPart.Denting);  
                    $scope.calculations.Removing_Refitting_Total = parseFloat($scope.calculations.Removing_Refitting_Total) - parseFloat($scope.selectedNewPart.Removing_Refitting);  
                    
                    $rootScope.finalReport.NewParts.splice(index,1);
                    $scope.selectedNewPart = {};                    
                }
            })
            console.log("Part removed", $rootScope.finalReport.NewParts);        
        }        
    };    

    $scope.cabinAssemblyTableGridColumns = [
        {name: "#",field: "Sr_No",width: "40"},
        {name: "Description",field: "Parts_Name",width: "400"},
        {name: "Estimated",field: "Estimated",width: "300",enableCellEdit: true},
        {name: "Assessed",field: "Assessed",width: "300",enableCellEdit: true}];

    $scope.cabinAssemblyTableGridOptions = {
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.cabinAssemblyTableGridColumns,
        data: $rootScope.finalReport.CabinAssembly,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                console.log(row.entity);
                $scope.selectedCabinAssemblyData = row.entity;
                $scope.ca_selected = true;
            });

            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('After table edit',$rootScope.finalReport.CabinAssembly);
            });
        }
    };

    $scope.loadBodyTableGridColumns = [
        {name: "#",field: "Sr_No",width: "40"},
        {name: "Description",field: "Parts_Name",width: "400"},
        {name: "Estimated",field: "Estimated",width: "300",enableCellEdit: true},
        {name: "Assessed",field: "Assessed",width: "300",enableCellEdit: true}];

    $scope.loadBodyTableGridOptions = {
        enableRowSelection: true,
        multiSelect : false,
        columnDefs: $scope.loadBodyTableGridColumns,
        data: $rootScope.finalReport.LoadBody,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                console.log(row.entity);
                $scope.selectedLoadBodyData = row.entity;
                $scope.lb_selected = true;
            });

            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                $scope.$apply();
                console.log('After table edit',$rootScope.finalReport.LoadBody);
            });
        }
    };

    $scope.addCabinAssemblyData = function(){

        if($scope.cbdata.Parts_Name == '' || $scope.cbdata.Estimated == '' || $scope.cbdata.Assessed == ''){
            toastr.error('Please fill in the data','Data missing');
            return 0;
        }
                       
        $rootScope.finalReport.CabinAssembly.push({
            'Sr_No': $rootScope.finalReport.CabinAssembly.length + 1,
            'Parts_Name' : $scope.cbdata.Parts_Name,
            'Estimated' : $scope.cbdata.Estimated,
            'Assessed' : $scope.cbdata.Assessed,
            'Type' : 'Cabin Assembly',
            'index' : $scope.ca_index
        });
           
        $rootScope.finalReport.CabinAssemblyMaster.Estimated = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Estimated) + parseFloat($scope.cbdata.Estimated);
        $rootScope.finalReport.CabinAssemblyMaster.Assessed = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Assessed) + parseFloat($scope.cbdata.Assessed);         
        $scope.ca_index = $scope.ca_index + 1;
    };

    $scope.addLoadBodyData = function() {
        
        if($scope.lbdata.Parts_Name == '' || $scope.lbdata.Estimated == '' || $scope.lbdata.Assessed == ''){
            toastr.error('Please fill in the data','Data missing');
            return 0;
        }
        
        $rootScope.finalReport.LoadBody.push({
            'Sr_No': $rootScope.finalReport.LoadBody.length + 1,
            'Parts_Name' : $scope.lbdata.Parts_Name,
            'Estimated' : $scope.lbdata.Estimated,
            'Assessed' : $scope.lbdata.Assessed,
            'Type' : 'Load Body',
            'index' : $scope.lb_index
        });
        
        $rootScope.finalReport.LoadBodyMaster.Estimated = parseFloat($rootScope.finalReport.LoadBodyMaster.Estimated) + parseFloat($scope.lbdata.Estimated);
        $rootScope.finalReport.LoadBodyMaster.Assessed = parseFloat($rootScope.finalReport.LoadBodyMaster.Assessed) + parseFloat($scope.lbdata.Assessed);
        $scope.lb_index = $scope.lb_index + 1;            
        
    };

    $scope.finalReportCADDataToSave = {
        'surveys' : $scope.surveyFormatter(),
        'surveyCabinDetail' : [],
        'surveyCabinMaster' : []
    }
    $scope.finalReportCADDataToSave.surveyCabinMaster.push($rootScope.finalReport.CabinAssemblyMaster);
    
    $scope.updateCAD = function(){
    	if(!$rootScope.finalReport.Main.hasOwnProperty('_id')){
            toastr.error('Please load a report first');
            return 0;
        }
        
        if($rootScope.finalReport.CabinAssembly.length){
    		$scope.finalReportCADDataToSave.surveyCabinDetail = $rootScope.finalReport.CabinAssembly;
                        
            FRData.finalReportSaver($scope.finalReportCADDataToSave)
                .then(function(response) {
                    console.log("Cabin Assembly Detail updated",response);     
                    $rootScope.finalReport.CabinAssembly = [];
                    response.data.SurveyCabinDetail.forEach(function(element){
                        if(element.Type == "Cabin Assembly")
                            $rootScope.finalReport.CabinAssembly.push(element);
                    })
                    $scope.cabinAssemblyTableGridOptions.data = $rootScope.finalReport.CabinAssembly;
                    toastr.success('The Cabin Assembly detail was updated','Success',{ progressBar:true,maxOpened:1});
                }, 
                function (response){
                    console.log('An Error occured while updating', response);
                });    
    	} else{
    		toastr.info('There are no Cabin Assembly details to update','Nothing to update');
    	}
    };
    
    $scope.finalReportLBDDataToSave = {
        'surveys' : $scope.surveyFormatter(),
        'surveyCabinDetail' : [],
        'surveyCabinMaster' : []
    }
    $scope.finalReportLBDDataToSave.surveyCabinMaster.push($rootScope.finalReport.LoadBodyMaster);
    
    $scope.updateLBD = function(){
        if(!$rootScope.finalReport.Main.hasOwnProperty('_id')){
            toastr.error('Please load a report first');
            return 0;
        }

    	if($rootScope.finalReport.LoadBody.length){
            $scope.finalReportLBDDataToSave.surveyCabinDetail = $rootScope.finalReport.LoadBody;

            FRData.finalReportSaver($scope.finalReportLBDDataToSave)
                .then(function(response) {
                    console.log("Load Body Detail updated",response);
                    $rootScope.finalReport.LoadBody = [];
                    response.data.SurveyCabinDetail.forEach(function(element){
                        if(element.Type == "Load Body")
                            $rootScope.finalReport.LoadBody.push(element);
                    })
                    $scope.loadBodyTableGridOptions.data = $rootScope.finalReport.LoadBody;                    
                    toastr.success('The Load Body detail was updated','Success',{ progressBar:true,maxOpened:1});
                }, 
                function (response){
                    console.log('An Error occured while updating', response);
                });
    	} else{
    		toastr.info('There are no Load Body details to update','Nothing to update');
    	}
    };
    
    $scope.deleteCAD = function(){
        if(!$scope.selectedCabinAssemblyData.hasOwnProperty('_id') && !$scope.selectedCabinAssemblyData.hasOwnProperty('index'))                    
            toastr.info('Please select a detail in order to delete it','No detail Selected');

        if($scope.selectedCabinAssemblyData.hasOwnProperty('_id')){
            FRData.finalReportCabinDetailDeleter($scope.selectedCabinAssemblyData._id)
                .then(function(response){
                    $scope.ca_selected = false;
                	$rootScope.finalReport.CabinAssembly.forEach(function(part,index){
                        if($scope.selectedCabinAssemblyData._id == part._id){
                            console.log('Index of part to be deleted',$scope.selectedCabinAssemblyData._id,'\nCurrent Index',index);                            
                            $rootScope.finalReport.CabinAssembly.splice(index,1);
                            $scope.selectedCabinAssemblyData = {};               
                        }
                	});
                	
                	$rootScope.finalReport.CabinAssemblyMaster.Estimated = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Estimated) - parseFloat($scope.selectedCabinAssemblyData.Estimated);
                    $rootScope.finalReport.CabinAssemblyMaster.Assessed = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Assessed) - parseFloat($scope.selectedCabinAssemblyData.Assessed);

                    toastr.success('The Part was deleted','Success');
                    $scope.selectedCabinAssemblyData = {};                    
                })
                .catch(function(response){
                    toastr.error('There was an error deleting the part','Error')                    
                })
        }
        else if($scope.selectedCabinAssemblyData.hasOwnProperty('index'))
        {
            $rootScope.finalReport.CabinAssembly.forEach(function(part,index){
                if($scope.selectedCabinAssemblyData.index == part.index){
                    console.log('Index of part to be deleted',$scope.selectedCabinAssemblyData.index);
                    console.log('Current Index',index);
                    
                    $rootScope.finalReport.CabinAssemblyMaster.Estimated = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Estimated) - parseFloat($scope.selectedCabinAssemblyData.Estimated);
                    $rootScope.finalReport.CabinAssemblyMaster.Assessed = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Assessed) - parseFloat($scope.selectedCabinAssemblyData.Assessed);

                    
                    $rootScope.finalReport.CabinAssembly.splice(index,1);
                    $scope.selectedCabinAssemblyData = {};
                    $scope.ca_selected = false;
                }
            })
        }
        console.log("Part removed", $rootScope.finalReport.CabinAssembly);        
    };   
    
    $scope.deleteLBD = function(){  
        if(!$scope.selectedLoadBodyData.hasOwnProperty('_id') && !$scope.selectedLoadBodyData.hasOwnProperty('index'))                    
            toastr.info('Please select a detail in order to delete it','No detail Selected');

        if($scope.selectedLoadBodyData.hasOwnProperty('_id')){
            FRData.finalReportCabinDetailDeleter($scope.selectedLoadBodyData._id)
                .then(function(response){                	                	
                	$scope.lb_selected = false;
                	$rootScope.finalReport.LoadBody.forEach(function(part,index){
                        if($scope.selectedLoadBodyData._id == part._id){
                            console.log('Index of part to be deleted',$scope.selectedLoadBodyData._id,'\nCurrent Index',index);                            
                            $rootScope.finalReport.LoadBody.splice(index,1);
                            $scope.selectedLoadBodyData = {};                           
                        }
                	});
                	
                	$rootScope.finalReport.LoadBodyMaster.Estimated = parseFloat($rootScope.finalReport.LoadBodyMaster.Estimated) - parseFloat($scope.selectedLoadBodyData.Estimated);
                    $rootScope.finalReport.LoadBodyMaster.Assessed = parseFloat($rootScope.finalReport.LoadBodyMaster.Assessed) - parseFloat($scope.selectedLoadBodyData.Assessed);

                    toastr.success('The Part was deleted','Success');
                    $scope.selectedLoadBodyData = {};                    
                })
                .catch(function(response){
                    toastr.error('There was an error deleting the part','Error')                    
                })
        }
        else if($scope.selectedLoadBodyData.hasOwnProperty('index'))
        {
            $rootScope.finalReport.LoadBody.forEach(function(part,index){
                if($scope.selectedLoadBodyData.index == part.index){
                    console.log('Index of part to be deleted',$scope.selectedLoadBodyData.index);
                    console.log('Current Index',index);
                    
                    $rootScope.finalReport.LoadBodyMaster.Estimated = parseFloat($rootScope.finalReport.LoadBodyMaster.Estimated) - parseFloat($scope.selectedLoadBodyData.Estimated);
                    $rootScope.finalReport.LoadBodyMaster.Assessed = parseFloat($rootScope.finalReport.LoadBodyMaster.Assessed) - parseFloat($scope.selectedLoadBodyData.Assessed);

                    
                    $rootScope.finalReport.LoadBody.splice(index,1);
                    $scope.selectedLoadBodyData = {};
                    $scope.lb_selected = false;
                }
            })
        }
        console.log("Part removed", $rootScope.finalReport.LoadBody);      
    };
    
    $scope.cabinAssemblyDepPerChange = function(){        
        $rootScope.finalReport.CabinAssemblyMaster.Dep_Amount = parseFloat(($rootScope.finalReport.CabinAssemblyMaster.Dep_Percent/100)) * parseFloat($rootScope.finalReport.CabinAssemblyMaster.Assessed);
    }

    $scope.loadBodySalvagePerChange = function(){        
        $rootScope.finalReport.LoadBodyMaster.Dep_Amount = parseFloat(($rootScope.finalReport.LoadBodyMaster.Dep_Percent/100)) * parseFloat($rootScope.finalReport.LoadBodyMaster.Assessed);
    }

    $scope.cabinAssemblyDepPerChange = function(){        
        $rootScope.finalReport.CabinAssemblyMaster.Salvage_Amount = parseFloat(($rootScope.finalReport.CabinAssemblyMaster.Salvage_Percent/100)) * parseFloat($rootScope.finalReport.CabinAssemblyMaster.Assessed);
    }

    $scope.loadBodySalvagePerChange = function(){        
        $rootScope.finalReport.LoadBodyMaster.Salvage_Amount = parseFloat(($rootScope.finalReport.LoadBodyMaster.Salvage_Percent/100)) * parseFloat($rootScope.finalReport.LoadBodyMaster.Assessed);
    }


    $scope.cabinSubTotal = function(){  
        var A = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Assessed);
        var B = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Dep_Amount);
        var C = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Salvage_Amount);        
        return ((A)-(B+C))
    }

    $scope.cabinNetTotal = function(){    
        var A = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Assessed);
        var B = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Dep_Amount);
        var C = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Salvage_Amount);    
        var D = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Cabin_Glass);
        var E = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Labour);
        return (((A)-(B+C))+(D+E))
    }

    $scope.loadBodySubTotal = function(){    
        var A = parseFloat($rootScope.finalReport.LoadBodyMaster.Assessed);
        var B = parseFloat($rootScope.finalReport.LoadBodyMaster.Dep_Amount);
        var C = parseFloat($rootScope.finalReport.LoadBodyMaster.Salvage_Amount);        
        return ((A)-(B+C))
    }

    $scope.loadBodyNetTotal = function(){    
        var A = parseFloat($rootScope.finalReport.LoadBodyMaster.Assessed);
        var B = parseFloat($rootScope.finalReport.LoadBodyMaster.Dep_Amount);
        var C = parseFloat($rootScope.finalReport.LoadBodyMaster.Salvage_Amount);            
        var E = parseFloat($rootScope.finalReport.LoadBodyMaster.Labour);
        return (((A)-(B+C))+(E))
    }

});



angular.module('MyApp').filter('partType', function() {
    var partsList = {
        1: 'Disallowed',
        2: 'Glass',
        3: 'Kept Open',
        4: 'Metal',
        5: 'Plastic',
        6: 'Rubber'
    };

    console.log('In filter for vehicle part type');

    return function(input) {
        if(!input){
            return '';
        }
        else{
            return partsList[input];
        }
    };
});
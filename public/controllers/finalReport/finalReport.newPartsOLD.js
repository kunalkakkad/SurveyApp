angular.module('MyApp')
    .controller('finalReportNewParts', function($rootScope, $scope, $http, $uibModal,toastr,$interval,$timeout,uiGridConstants,SRVCBNData,PRTData,VCLData,$sce) {
        
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
    
    // $scope.deleteSelectedRow = function(){
    //     // console.log('Selected rows',$scope.gridApi.selection.getSelectedRows()); 
    //     //Can apply check to tell the user to select a row first       
    //     angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
    //         console.log('Selected rows',$scope.gridApi.selection.getSelectedRows());
    //         $scope.partsTableGridOptions.data.splice($scope.partsTableGridOptions.data.lastIndexOf(data), 1);
    //     });
    // }

    var lastP = 0;
    var valid_est = 0;
    var valid_ass = 0;
    var valid_gst = 0;
    var valid_hc = 0;

    $scope.addPartsData = function() {
        console.log('New Part',$scope.newPart);
        if($rootScope.finalReport.Main.hasOwnProperty('_id')){
            $scope.newPart.survey_id = {"_id": $rootScope.finalReport.Main._id}; 
            $scope.newPart.IMT_23 = ($scope.newPart.IMT_23 == false)? 0:1;
            PRTData.surveysPartsSaver($scope.newPart)
            .then(function(response){
                    toastr.success('The New Part was added','Success');
                    console.log("Added a new part",response);
                    
                    $scope.calculations.Estimate_Total = parseFloat($scope.calculations.Estimate_Total) + parseFloat($scope.newPart.Estimated);  
                    $scope.calculations.Assessed_Total = parseFloat($scope.calculations.Assessed_Total) + parseFloat($scope.newPart.Assessed);  
                    $scope.calculations.Difference = parseFloat($scope.calculations.Estimate_Total) - parseFloat($scope.calculations.Assessed_Total);  
                    $scope.calculations.Painting_Total = parseFloat($scope.calculations.Painting_Total) + parseFloat($scope.newPart.Painting);  
                    $scope.calculations.Denting_Total = parseFloat($scope.calculations.Denting_Total) + parseFloat($scope.newPart.Denting);  
                    $scope.calculations.Removing_Refitting_Total = parseFloat($scope.calculations.Removing_Refitting_Total) + parseFloat($scope.newPart.Removing_Refitting);  
                    
                    var Total = (parseFloat($scope.newPart.GST/100) * parseFloat($scope.newPart.Assessed)) + parseFloat($scope.newPart.Assessed);
                	var grandTotal = parseFloat(Total) + parseFloat($scope.newPart.Painting) + parseFloat($scope.newPart.Denting) + parseFloat($scope.newPart.Labour) + parseFloat($scope.newPart.Removing_Refitting);
                	
                    
                    $rootScope.finalReport.NewParts.push({
                        // 'Serial' : n,
                        // 'dep_percent'   : '7%',
                        'Part_Name'     :  $scope.newPart.Part_Name.Part_Name,
                        'Damage'   :  $scope.newPart.Damage,
                        'Estimated' :  $scope.newPart.Estimated,
                        'Assessed' :  $scope.newPart.Assessed,
                        'Sr_No'  :  $scope.newPart.Sr_No,
                        'HC'       :  $scope.newPart.HC,
                        'GST'  :  $scope.newPart.GST,
                        'IMT_23'  :   $scope.newPart.IMT_23,
                        'Removing_Refitting'  :  $scope.newPart.Removing_Refitting,
                        'Denting'  :  $scope.newPart.Denting,
                        'Painting'  :  $scope.newPart.Painting,
                        'Part_Type'     :  $scope.newPart.Part_Type,    
                        'HSN_No'     :  $scope.newPart.HSN_No,
                        'Labour'     :  $scope.newPart.Labour,
                        'Total': Total,
                	    'Grand_Total': grandTotal
                    });

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

                }, 
                function (err){
                    console.log('There was an error saving the part', err);                    
                }).catch(function(error){
                    toastr.error('There was an error saving the Part','Error')
                });

        }
        else{
            
        	var Total = (parseFloat($scope.newPart.GST/100) * parseFloat($scope.newPart.Assessed)) + parseFloat($scope.newPart.Assessed);
        	var grandTotal = parseFloat(Total) + parseFloat($scope.newPart.Painting) + parseFloat($scope.newPart.Denting) + parseFloat($scope.newPart.Labour) + parseFloat($scope.newPart.Removing_Refitting);
        	
        	
            $rootScope.finalReport.NewParts.push({
                'index': $scope.index,
                'Part_Name'     :  $scope.newPart.Part_Name.Part_Name,
                'Damage'   :  $scope.newPart.Damage,
                'Estimated' :  $scope.newPart.Estimated,
                'Assessed' :  $scope.newPart.Assessed,
                'Sr_No'  :  $scope.newPart.Sr_No,
                'HC'       :  $scope.newPart.HC,
                'GST'  :  $scope.newPart.GST,
                'IMT_23'  :   $scope.newPart.IMT_23,
                'Removing_Refitting'  :  $scope.newPart.Removing_Refitting,
                'Denting'  :  $scope.newPart.Denting,
                'Painting'  :  $scope.newPart.Painting,
                'Part_Type'     :  $scope.newPart.Part_Type,    
                'HSN_No'     :  $scope.newPart.HSN_No,
                'Labour'     :  $scope.newPart.Labour,
                'Total'	: Total,
                'Grand_Total': grandTotal
                
            });

                $scope.calculations.Estimate_Total = parseFloat($scope.calculations.Estimate_Total) + parseFloat($scope.newPart.Estimated);  
                $scope.calculations.Assessed_Total = parseFloat($scope.calculations.Assessed_Total) + parseFloat($scope.newPart.Assessed);  
                $scope.calculations.Difference = parseFloat($scope.calculations.Estimate_Total) - parseFloat($scope.calculations.Assessed_Total);  
                $scope.calculations.Painting_Total = parseFloat($scope.calculations.Painting_Total) + parseFloat($scope.newPart.Painting);  
                $scope.calculations.Denting_Total = parseFloat($scope.calculations.Denting_Total) + parseFloat($scope.newPart.Denting);  
                $scope.calculations.Removing_Refitting_Total = parseFloat($scope.calculations.Removing_Refitting_Total) + parseFloat($scope.newPart.Removing_Refitting);  
                console.log('Calculations',$scope.calculations);

            $scope.index = $scope.index + 1;

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
        }        
    };

    $scope.deleteSelectedPart = function(){
        if(!$scope.selectedNewPart.hasOwnProperty('_id') && !$scope.selectedNewPart.hasOwnProperty('index'))                    
            toastr.info('Please select a part in order to delete it','No Part Selected');

        if($scope.selectedNewPart.hasOwnProperty('_id')){
            PRTData.surveysPartsDeleter($scope.selectedNewPart._id)
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
                    toastr.success('There was an error deleting the part','Error')                    
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
      {
        name: "#",
        field: "Sr_No",
        width: "40"
      },
      {
        name: "Description",
        field: "Parts_Name",
        width: "400"
      },
      {
        name: "Estimated",
        field: "Estimated",
        width: "300",
        enableCellEdit: true
      },
      {
        name: "Assessed",
        field: "Assessed",
        width: "300",
        enableCellEdit: true
      }];

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
      {
        name: "#",
        field: "Sr_No",
        width: "40"
      },
      {
        name: "Description",
        field: "Parts_Name",
        width: "400"
      },
      {
        name: "Estimated",
        field: "Estimated",
        width: "300",
        enableCellEdit: true
      },
      {
        name: "Assessed",
        field: "Assessed",
        width: "300",
        enableCellEdit: true
      }];

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

    $scope.addCabinAssemblyData = function() {

        if($scope.cbdata.Parts_Name == '' || $scope.cbdata.Estimated == '' || $scope.cbdata.Assessed == ''){
            toastr.error('Please fill in the data','Data missing');
            return 0;
        }

        if($rootScope.finalReport.Main.hasOwnProperty('_id')){

            $scope.cbdata.Survey_ID = $rootScope.finalReport.Main._id;
            SRVCBNData.surveyCabinDetailSaver($scope.cbdata)
                .then(function(response){
                    console.log('CAD save Response',response);                    
                    toastr.success('The Cabin Assembly Detail was added','Success')
               
                    $rootScope.finalReport.CabinAssembly.push({
                        'Sr_No': $rootScope.finalReport.CabinAssembly.length + 1,
                        'Parts_Name' : $scope.cbdata.Parts_Name,
                        'Estimated' : $scope.cbdata.Estimated,
                        'Assessed' : $scope.cbdata.Assessed,
                        'Type' : 'Cabin Assembly'
                    });
                    
                    $scope.cbdata = {
                        'Sr_No': '',
                        'Parts_Name' : '',
                        'Estimated' : 0,
                        'Assessed' : 0,
                        'Type' : 'Cabin Assembly'                
                    };
                    
                    $rootScope.finalReport.CabinAssemblyMaster.Estimated = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Estimated) + parseFloat($scope.cbdata.Estimated);
                    $rootScope.finalReport.CabinAssemblyMaster.Assessed = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Assessed) + parseFloat($scope.cbdata.Assessed);

                }).catch(function(error){
                    toastr.error('There was an error adding the Cabin Assembly Detail','Error')                    
                });
        }
        else{
            
            var n = $scope.cabinAssemblyTableGridOptions.data.length + 1;
            $rootScope.finalReport.CabinAssembly.push({
                'Sr_No': n,
                'Parts_Name' : $scope.cbdata.Parts_Name,
                'Estimated' : $scope.cbdata.Estimated,
                'Assessed' : $scope.cbdata.Assessed,
                'Type' : 'Cabin Assembly',
                'index' : $scope.ca_index
            });

            $scope.ca_index = $scope.ca_index + 1;
            $rootScope.finalReport.CabinAssemblyMaster.Estimated = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Estimated) + parseFloat($scope.cbdata.Estimated);
            $rootScope.finalReport.CabinAssemblyMaster.Assessed = parseFloat($rootScope.finalReport.CabinAssemblyMaster.Assessed) + parseFloat($scope.cbdata.Assessed);

            $scope.cbdata = {
                'Sr_No': '',
                'Parts_Name' : '',
                'Estimated' : 0,
                'Assessed' : 0,
                'Type' : 'Cabin Assembly'                
            };
        }

    };

    $scope.addLoadBodyData = function() {
        if($scope.lbdata.Parts_Name == '' || $scope.lbdata.Estimated == '' || $scope.lbdata.Assessed == ''){
                toastr.error('Please fill in the data','Data missing');
                return 0;
        }

        if($rootScope.finalReport.Main.hasOwnProperty('_id')){
            $scope.lbdata.Survey_ID = $rootScope.finalReport.Main._id;
            SRVCBNData.surveyCabinDetailSaver($scope.lbdata)
                .then(function(response){
                    console.log('LBD save Response',response);
                    toastr.success('The Load Body Detail was added','Success')
        
                    $rootScope.finalReport.LoadBody.push({
                        'Sr_No': $rootScope.finalReport.LoadBody.length + 1,
                        'Parts_Name' : $scope.lbdata.Parts_Name,
                        'Estimated' : $scope.lbdata.Estimated,
                        'Assessed' : $scope.lbdata.Assessed,
                        'Type' : 'Load Body'
                    });
                    
                    $scope.lbdata = {
                        'Sr_No' : '',
                        'Parts_Name' : '',
                        'Estimated' : 0,
                        'Assessed' : 0,
                        'Type' : 'Load Body'                
                    };
                    
                    $rootScope.finalReport.LoadBodyMaster.Estimated = parseFloat($rootScope.finalReport.LoadBodyMaster.Estimated) + parseFloat($scope.lbdata.Estimated);
                    $rootScope.finalReport.LoadBodyMaster.Assessed = parseFloat($rootScope.finalReport.LoadBodyMaster.Assessed) + parseFloat($scope.lbdata.Assessed);

                }).catch(function(error){
                    toastr.error('There was an error adding the Load Body Detail','Error')                    
                });
        
        }
        else{
            var n = $scope.loadBodyTableGridOptions.data.length + 1;
            $rootScope.finalReport.LoadBody.push({
                'Sr_No' : n,
                'Parts_Name' : $scope.lbdata.Parts_Name,
                'Estimated' : $scope.lbdata.Estimated,
                'Assessed' : $scope.lbdata.Assessed,
                'Type' : 'Load Body',
                'index' : $scope.lb_index
            });
            
            $scope.lb_index = $scope.lb_index + 1;            
            $rootScope.finalReport.LoadBodyMaster.Estimated = parseFloat($rootScope.finalReport.LoadBodyMaster.Estimated) + parseFloat($scope.lbdata.Estimated);
            $rootScope.finalReport.LoadBodyMaster.Assessed = parseFloat($rootScope.finalReport.LoadBodyMaster.Assessed) + parseFloat($scope.lbdata.Assessed);

            $scope.lbdata = {
                'Sr_No' : '',
                'Parts_Name' : '',
                'Estimated' : 0,
                'Assessed' : 0,
                'Type' : 'Load Body'                
            };
        }        
    };

    $scope.updateCAD = function(){
    	if($rootScope.finalReport.CabinAssembly.length){
    		$rootScope.finalReport.CabinAssembly.forEach(function(element){
                if(element.hasOwnProperty('_id')){
                    SRVCBNData.surveyCabinDetailUpdater(element)
                    .then(function(response) {
                        console.log("Cabin Assembly Detail updated",response);     
                        toastr.success('The Cabin Assembly detail was updated','Success',{ progressBar:true,maxOpened:1});
                    }, 
                    function (response){
                        console.log('An Error occured while updating', response);
                    });
                }
    		})
    	} else{
    		toastr.info('There are no Cabin Assembly details to update','Nothing to update');
    	}
    };
    
    $scope.updateLBD = function(){
    	if($rootScope.finalReport.LoadBody.length){
    		$rootScope.finalReport.LoadBody.forEach(function(element){    			
                if(element.hasOwnProperty('_id')){
                    SRVCBNData.surveyCabinDetailUpdater(element)
                    .then(function(response) {
                        console.log("Load Body Detail updated",response);
                        toastr.success('The Load Body detail was updated','Success',{ progressBar:true,maxOpened:1});
                    }, 
                    function (response){
                        console.log('An Error occured while updating', response);
                    });
                }                
    		})
    	} else{
    		toastr.info('There are no Load Body details to update','Nothing to update');
    	}
    };
    
    $scope.deleteCAD = function(){
        if(!$scope.selectedCabinAssemblyData.hasOwnProperty('_id') && !$scope.selectedCabinAssemblyData.hasOwnProperty('index'))                    
            toastr.info('Please select a detail in order to delete it','No detail Selected');

        if($scope.selectedCabinAssemblyData.hasOwnProperty('_id')){
            SRVCBNData.surveyCabinDetailDeleter($scope.selectedCabinAssemblyData._id)
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
                    toastr.success('There was an error deleting the part','Error')                    
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
            SRVCBNData.surveyCabinDetailDeleter($scope.selectedLoadBodyData._id)
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
                    toastr.success('There was an error deleting the part','Error')                    
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
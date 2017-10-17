angular.module('MyApp')
  .controller('DashboardCtrl', function($scope, $http, Account,uiGridConstants,toastr) {
      //
      console.log('in dashboard');



			jQuery(function($) {
				 //flot chart resize plugin, somehow manipulates default browser resize event to optimize it!
			  //but sometimes it brings up errors with normal resize event handlers
			  $.resize.throttleWindow = false;
			

				  var placeholder = $('#piechart-placeholder').css({'width':'90%' , 'min-height':'150px'});
			  var data = [
				{ label: "Total pending",  data: 1255, color: "#FEE074"},
				{ label: "Total Count",  data: 941, color: "#68BC31"},
				{ label: "Total Average",  data: 1050, color: "#2091CF"},
				
			  ]
			  function drawPieChart(placeholder, data, position) {
			 	  $.plot(placeholder, data, {
					series: {
						pie: {
							show: true,
							tilt:0.8,
							highlight: {
								opacity: 0.25
							},
							stroke: {
								color: '#fff',
								width: 2
							},
							startAngle: 2
						}
					},
					legend: {
						show: true,
						position: position || "ne", 
						labelBoxBorderColor: null,
						margin:[-30,15]
					}
					,
					grid: {
						hoverable: true,
						clickable: true
					}
				 })
			 }
			 drawPieChart(placeholder, data);
			
			 /**
			 we saved the drawing function and the data to redraw with different position later when switching to RTL mode dynamically
			 so that's not needed actually.
			 */
			 placeholder.data('chart', data);
			 placeholder.data('draw', drawPieChart);
			
			  //pie chart tooltip example
			  var $tooltip = $("<div class='tooltip top in'><div class='tooltip-inner'></div></div>").hide().appendTo('body');
			  var previousPoint = null;
			
			  placeholder.on('plothover', function (event, pos, item) {
				if(item) {
					if (previousPoint != item.seriesIndex) {
						previousPoint = item.seriesIndex;
						var tip = item.series['label'] + " : " + item.series['percent']+'%';
						$tooltip.show().children(0).text(tip);
					}
					$tooltip.css({top:pos.pageY + 10, left:pos.pageX + 10});
				} else {
					$tooltip.hide();
					previousPoint = null;
				}
				
			 });

       	$('.dialogs,.comments').ace_scroll({
					size: 300
			    });
				

			

		});
	
		var colCount = 10;
		var rowCount = 15;
		var gridOptions = {
			onRegisterApi: function(gridApi) {
     			 $scope.gridApi = gridApi;
    		}
		};
		
		function generateColumns() {
			for (var colIndex = 0; colIndex < colCount; colIndex++) {
			gridOptions.columnDefs.push({
				name: 'col' + colIndex,
				width: Math.floor(Math.random() * (120 - 50 + 1)) + 50
			});
			}
		}
		
		function generateData() {
			for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
			var row = {};
		
			for (var colIndex = 0; colIndex < colCount; colIndex++) {
				row['col' + colIndex] = 'r' + rowIndex + 'c' + colIndex;
			}
		
			gridOptions.data.push(row);
			}
		}
		
		datas = [{

		}];

		function initialize() {
			gridOptions_user = 
			{
				enableSorting: true,
				fastWatch: true,
				onRegisterApi: function(gridApi) {
					$scope.gridApi = gridApi;
				},
				columnDefs: 
					[
						{
							name: "Ref #",	//If there is no field, name will point to key in data. Can change to claim # to display claim instead
							//field: "Claim #", // Refers to key in the object in data. Name can be changed to whatever. If this and name are different, name will be column heading and field will determine what data is to be displayed.
							width: 275,
							//visible: false // If you want to hide/show the particular column 
						},
						{
							name: "Policy #",
							width: 275 
						},
						{
							name: "Vehicle",
							width: 275 
						},
						{
							name: "Status",
							width: 275 
						}
					],
				data: 
					[
						{
							"Ref #":"VM/9CJ3231/06-17/F/00001",
							"Policy #":"MP095454878454",
							"Vehicle":"Ashok Leyland",
							"Status":"Waiting",
							"Claim #":"123",
							"Branch Name":"XYZ"
						},
						{
							"Ref #":"VM/9CJ3231/06-17/F/00002",
							"Policy #":"MP095454878455",
							"Vehicle":"Hero",
							"Status":"Pending",
							"Claim #":"456",
							"Branch Name":"ABC"
						},
						{
							"Ref #":"VM/9CJ3231/06-17/F/00003",
							"Policy #":"MP095454878456",
							"Vehicle":"Bajaj",
							"Status":"Pending",
							"Claim #":"122",
							"Branch Name":"HID"
						},
						{
							"Ref #":"VM/9CJ3231/06-17/F/00004",
							"Policy #":"MP095454878457",
							"Vehicle":"Apache",
							"Status":"Approved",
							"Claim #":"123",
							"Branch Name":"XYZ"
						},
						{
							"Ref #":"VM/9CJ3231/06-17/F/00005",
							"Policy #":"MP095454878458",
							"Vehicle":"Tata",
							"Status":"Approved",
							"Claim #":"126",
							"Branch Name":"XRZ"
						},
						{
							"Ref #":"VM/9CJ3231/06-17/F/00006",
							"Policy #":"MP095454878459",
							"Vehicle":"Lexus",
							"Status":"Rejected",
							"Claim #":"666",
							"Branch Name":"AAA"
						}
					]
			};

			gridOptions_insurer = 
			{
				enableSorting: true,
				fastWatch: true,
				onRegisterApi: function(gridApi) {
					$scope.gridApi = gridApi;
				},
				//If column defs aren't supplied, the columns names come automatically from the keys in data
				columnDefs: 
					[
						{
							name: "Ref #",
							//display name can be anything, name must match key name in data
							displayName: 'Reference #',
							width: 275 
						},
						{
							name: "Policy #",
							width: 275 
						},
						{
							name: "Vehicle",
							width: 275 
						},
						{
							name: "Status",
							width: 275 
						},
						{
							name: "Claim #",
							width:  275
						},
						{
							name: "Branch Name",
							width: 250 
						}
					],
				data: 
					[
						{
							"Ref #":"VM/9CJ3231/06-17/F/00001",
							"Policy #":"MP095454878454",
							"Vehicle":"Ashok Leyland",
							"Status":"Waiting",
							"Claim #":"123",
							"Branch Name":"XYZ"
						},
						{
							"Ref #":"VM/9CJ3231/06-17/F/00002",
							"Policy #":"MP095454878455",
							"Vehicle":"Hero",
							"Status":"Pending",
							"Claim #":"456",
							"Branch Name":"ABC"
						},
						{
							"Ref #":"VM/9CJ3231/06-17/F/00003",
							"Policy #":"MP095454878456",
							"Vehicle":"Bajaj",
							"Status":"Pending",
							"Claim #":"122",
							"Branch Name":"HID"
						},
						{
							"Ref #":"VM/9CJ3231/06-17/F/00004",
							"Policy #":"MP095454878457",
							"Vehicle":"Apache",
							"Status":"Approved",
							"Claim #":"123",
							"Branch Name":"XYZ"
						},
						{
							"Ref #":"VM/9CJ3231/06-17/F/00005",
							"Policy #":"MP095454878458",
							"Vehicle":"Tata",
							"Status":"Approved",
							"Claim #":"126",
							"Branch Name":"XRZ"
						},
						{
							"Ref #":"VM/9CJ3231/06-17/F/00006",
							"Policy #":"MP095454878459",
							"Vehicle":"Lexus",
							"Status":"Rejected",
							"Claim #":"666",
							"Branch Name":"AAA"
						}
					]
			};
			// generateColumns();
			// generateData();
		
			$scope.gridOptions_user = gridOptions_user;
			$scope.gridOptions_insurer = gridOptions_insurer;
		}

		//Change column data to point to such a function, in case no hardcoded data
		$scope.dummy = function(){
			return 5;
		}

		$scope.toggleVisible = function() {
			$scope.gridOptions_user.columnDefs[3].visible = !($scope.gridOptions_user.columnDefs[3].visible || $scope.gridOptions_user.columnDefs[3].visible === undefined);
			$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
		}

		initialize();
		console.log(gridOptions.data);
});
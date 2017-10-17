angular.module("MyApp")
	.directive("filesInput", function() {
		return {
			require: "ngModel",
			link: function postLink(scope,elem,attrs,ngModel) {
				elem.on("change", function(e) {
					var files = elem[0].files;
					ngModel.$setViewValue(files);
				})
			}
		}
	});

// angular.module("MyApp").directive('filesInput', ['$parse', function ($parse) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             var model = $parse(attrs.fileModel);
//             var modelSetter = model.assign;
            
//             element.bind('change', function(){
//                 scope.$apply(function(){
//                     modelSetter(scope, element[0].files[0]);
//                 });
//             });
//         }
//     };
// }]);
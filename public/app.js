var app = angular.module('MyApp', ['ngResource', 'ngMessages','ngSanitize','ngAnimate', 'toastr', 'ui.router','ui.router.stateHelper','satellizer','ui.bootstrap','ui.tinymce','ui.grid','smart-table','ui.mask','ui.grid.selection','ui.grid.autoResize','ui.grid.edit','inputDropdown','ngTagsInput','ngFadeImgLoading','ngFileUpload','ui.select','cp.ngConfirm','angularModalService'])

.run(function($state, $rootScope,$uiRouter,$trace,$transitions,VCLData) {
    $rootScope.$state = $state;
    // $trace.enable('TRANSITION');

    $rootScope.report = {
        _id : ''
    };    
    
    $rootScope.APIPath = 'http://125.99.24.66:8081';

    $rootScope.vehiclesDataLoaded = false;
    $rootScope.insurersDataLoaded = false;
    $rootScope.banksDataLoaded = false;
    $rootScope.garagesDataLoaded = false;

    $rootScope.finalReport = [];    
    $rootScope.finalReports = {};  
    // 13/09/17 
    // For temporary variables 
    $rootScope.finalReportTemp = {};
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

    $rootScope.interimReport = [];    
    $rootScope.interimReports = {};    
    $rootScope.interimReport.Main = {};
    $rootScope.interimReport.Vehicle_Details = {}; 
    $rootScope.interimReport.NewParts = [];
    $rootScope.interimReportCabin = [];
    $rootScope.interimReportCabinDetails = {};
    $rootScope.interimReportLoadBody = [];
    $rootScope.interimReportLoadBodyDetails = {};

    $rootScope.spotReport = {};    
    $rootScope.spotReports = {};    
    $rootScope.spotReport.Main = {};
    $rootScope.spotReport.Vehicle_Details = {}; 
    $rootScope.spotReport.Spot_Details = {};
    $rootScope.spotReport.Damages = [];

    $rootScope.statusReport = {};    
    $rootScope.statusReports = {};    
    $rootScope.statusReport.Main = {};
    $rootScope.statusReport.Status = {}; 
    $rootScope.statusReport.Status_Damage_Details = []; 
    $rootScope.statusReport_Status_Damage_Details_Table_index = 1; 
    
    $rootScope.addendumReportTemp = {};    
    $rootScope.addendumReports = [];
    $rootScope.addendumReport = {};
    $rootScope.addendumReport.Main = {};
    $rootScope.addendumReport.Vehicle_Details = {};
    $rootScope.addendumReport.Depriciations = [];
    $rootScope.addendumReport.Addendum = {};
    $rootScope.addendumReport.addendumParts = [];
    $rootScope.addendumReport_Parts_Table_index = 1; 


    // $rootScope.valuationReport = {};    
    // $rootScope.valuationReports = {};    
    // $rootScope.valuationReport.Main = {};
    // $rootScope.valuationReport.Vehicle_Details = {}; 
    // $rootScope.valuationReportNewParts = [];

    // $rootScope.reInspectionReport = {};    
    // $rootScope.reInspectionReports = {};    
    // $rootScope.reInspectionReport.Main = {};
    // $rootScope.reInspectionReport.Vehicle_Details = {}; 
    // $rootScope.reInspectionReportNewParts = [];

    $rootScope.billCheckReport = {};    
    $rootScope.finalReports = {};  
    $rootScope.billCheckReportTemp = {};
    $rootScope.billCheckReport.Main = {};
    $rootScope.billCheckReport.billCheckDetails = {}; 
    $rootScope.billCheckReport.billCheckDepriciation = []; 
    $rootScope.billCheckReport.billCheckParts = [];
    
    $rootScope.settlementLetterReport = {};
    $rootScope.settlementLetterReport.Main = {};
    $rootScope.settlementLetterReport.Letter = {};

    $rootScope.commonLetterReport = {};
    $rootScope.commonLetterReport.Main = {};
    $rootScope.commonLetterReport.Letter = {};

    //Flag used by finalReportInsuranceReportsMaster to check if call has already been made, if true then just load data from rootScope
    $rootScope.spotReportDataLoadedOnce = false;
    $rootScope.interimReportDataLoadedOnce = false
    $rootScope.finalReportDataLoadedOnce = false;
    $rootScope.billCheckReportDataLoadedOnce = false;
    $rootScope.statusReportDataLoadedOnce = false;
    $rootScope.settlementLetterReportDataLoadedOnce = false;
    $rootScope.commonLetterReportDataLoadedOnce = false;
    $rootScope.addendumReportDataLoadedOnce = false;

    // OLD 01.09.17 Made spotReportSelected flag for adding the damages in the damages tab. If a report isn't selected, then
    // addition shouldn't be allowed. Same mechanism can be used for parts in final and intrerim reports.

    // NEW 01.09.17 - Ignore above - User needs to be able to enter whenever, otherwise no new damage data..
    
    $rootScope.spotReportSelected = false;
    $rootScope.interimReportSelected = false;
    $rootScope.finalReportSelected = false;

    
    $rootScope.indexOfLastRep = '';

    $rootScope.selectedInsuranceReport = '';

    $rootScope.selectedInsurer = {};    
    
    $rootScope.policy_types = [
        {type: "Regular"},
        {type: "Add on policy"},
        {type: "Add on policy(Not effective)"}
    ]; 
    
    // VCLData.dummy();

    console.log('Within run');
    // window['ui-router-visualizer'].visualizer($uiRouter);
})
.config(function($stateProvider, $urlRouterProvider, $authProvider,stateHelperProvider, toastrConfig) {

    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,    
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body',
        messageClass: 'toast-message',
        onHidden: null,
        onShown: null,
        onTap: null,
        progressBar: false,
        tapToDismiss: true,
        templates: {
            toast: 'directives/toast/toast.html',
            progressbar: 'directives/progressbar/progressbar.html'
        },
        timeOut: 5000,
        titleClass: 'toast-title',
        toastClass: 'toast'
    });    

    /**
    * Helper auth functions
    */
    var skipIfLoggedIn = ['$q', '$auth', function($q, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.reject();
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }];

    var loginRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
          // console.log('auth',$auth);
            deferred.resolve();
        } else {
            $location.path('/login');
        }
        return deferred.promise;
    }];

    /**
     * App routes
     */
    //  $authProvider.baseUrl = 'http://192.168.0.5:8081/ctl/';
     $authProvider.baseUrl = 'http://125.99.24.66:8081/ctl/';
//    $authProvider.baseUrl = '/api/';
    $authProvider.tokenType = 'JWT';
    //$authProvider.signupUrl = '/api/auth/signup';
    //$authProvider.profileUrl = '/api/auth/profile';

    $stateProvider
    .state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'partials/home.html',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
    })
    .state('dashboard', {
        url: '/dashboard',        
        controller: 'DashboardCtrl',
        templateUrl: 'partials/dashboard.html',
        resolve: {
          loginRequired: loginRequired
        }
    })
    .state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
    })
    .state('signup', {
        url: '/signup',
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
    })
    .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
    })

    .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
    })
    
    .state('surveys', {
        url: '/surveys',        
        controller: 'surveys',
        templateUrl: 'partials/surveys/index.html',
        resolve: {
          loginRequired: loginRequired
        }       
    })          
    
    //SPOT REPORT STATES---------------------------------------------------------------------------------------------------------    
    .state('surveys.spotReport', {
        url: '/spotReport',        
        // controller: 'spotReport',
        views:{'spotReport@surveys':{ templateUrl: 'partials/surveys/spotReport/index.html', controller: 'spotReport'}},        
        resolve: {
          loginRequired: loginRequired
        }       
    })

    .state('surveys.spotReport.policy', {
        url: '/policy',
        views:{'policy@surveys.spotReport':{ templateUrl: 'partials/surveys/spotReport/policy.html', controller: 'spotReportPolicy'}},
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.spotReport.survey', {
        url: '/survey',
        views:{'survey@surveys.spotReport':{ templateUrl: 'partials/surveys/spotReport/survey.html', controller: 'spotReportSurvey'}},  
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.spotReport.damages', {
        url: '/damages',
        views:{'damages@surveys.spotReport':{ templateUrl: 'partials/surveys/spotReport/damages.html', controller: 'spotReportDamages'}},  
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.spotReport.notes', {
        url: '/notes',
        views:{'notes@surveys.spotReport':{ templateUrl: 'partials/surveys/spotReport/notes.html', controller: 'spotReportNotes'}},  
        //resolve: { loginRequired: loginRequired }
    })        

    //INTERIM REPORT STATES---------------------------------------------------------------------------------------------------------        
    .state('surveys.interimReport', {
        url: '/interimReport',        
        // controller: 'interimReport',
        views:{'interimReport@surveys':{ templateUrl: 'partials/surveys/interimReport/index.html', controller:'interimReport'}},        
        resolve: {
          loginRequired: loginRequired
        }       
    })
    
    .state('surveys.interimReport.policy', {
        url: '/policy',
        views:{'policy@surveys.interimReport':{ templateUrl: 'partials/surveys/interimReport/policy.html', controller: 'interimReportPolicy'}},
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.interimReport.survey', {
        url: '/survey',
        views:{'survey@surveys.interimReport':{ templateUrl: 'partials/surveys/interimReport/survey.html', controller: 'interimReportSurvey'}},  
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.interimReport.newparts', {
        url: '/newParts',
        views:{'newparts@surveys.interimReport':{ templateUrl: 'partials/surveys/interimReport/newparts.html', controller: 'interimReportNewParts'}},  
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.interimReport.labour', {
        url: '/labour',
        views:{'labour@surveys.interimReport':{ templateUrl: 'partials/surveys/interimReport/labour.html', controller: 'interimReportPolicy'}},  
        //resolve: { loginRequired: loginRequired }
    })        
    
    .state('surveys.interimReport.summary', {
        url: '/summary',
        views:{'summary@surveys.interimReport':{ templateUrl: 'partials/surveys/interimReport/summary.html', controller: 'interimReportSummary'}},  
        //resolve: { loginRequired: loginRequired }
    })
        
    //FINAL REPORT STATES---------------------------------------------------------------------------------------------------------
    //This state isn't utilized. Clicking on the final report tab takes us directly to the policy tab. However, this shouldn't
    //be deleted as it may be used in the future. 
    .state('surveys.finalReport', {
        url: '/finalReport',        
        // sticky: true,
        // dsr: true,
        views:{'finalReport@surveys':{ templateUrl: 'partials/surveys/finalReport/index.html', controller: 'finalReport'}},        
        // controller: 'FinalReportCtrl',
        // templateUrl: 'partials/surveys/index.html',
        resolve: {
          loginRequired: loginRequired
        }       
    })
    
    .state('surveys.finalReport.policy', {
        url: '/policy',
        views:{'policy@surveys.finalReport':{ templateUrl: 'partials/surveys/finalReport/policy.html', controller: 'finalReportPolicy'}},
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.finalReport.survey', {
        url: '/survey',
        views:{'survey@surveys.finalReport':{ templateUrl: 'partials/surveys/finalReport/survey.html', controller: 'finalReportSurvey'}},  
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.finalReport.newparts', {
        url: '/newParts',
        views:{'newparts@surveys.finalReport':{ templateUrl: 'partials/surveys/finalReport/newparts.html', controller: 'finalReportNewParts'}},  
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.finalReport.labour', {
        url: '/labour',
        views:{'labour@surveys.finalReport':{ templateUrl: 'partials/surveys/finalReport/labour.html', controller: 'finalReportPolicy'}},  
        //resolve: { loginRequired: loginRequired }
    })        
    
    .state('surveys.finalReport.summary', {
        url: '/summary',
        views:{'summary@surveys.finalReport':{ templateUrl: 'partials/surveys/finalReport/summary.html', controller: 'finalReportSummary'}},  
        //resolve: { loginRequired: loginRequired }
    })
    
    //STATUS REPORT STATE----------------------------------------------------------------------------------------------------------    
    .state('surveys.statusReport', {
        url: '/statusReport',        
        // controller: 'interimReport',
        views:{'statusReport@surveys':{ templateUrl: 'partials/surveys/statusReport/statusReport.html', controller: 'statusReport'}},        
        resolve: {
          loginRequired: loginRequired
        }       
    })

    //ADDENDUM STATES---------------------------------------------------------------------------------------------------------    
    .state('surveys.addendum', {
        url: '/addendum',        
        // controller: 'interimReport',
        views:{'addendum@surveys':{ templateUrl: 'partials/surveys/addendum/index.html'}},        
        resolve: {
          loginRequired: loginRequired
        }       
    })

    .state('surveys.addendum.policy', {
        url: '/policy',
        views:{'policy@surveys.addendum':{ templateUrl: 'partials/surveys/addendum/policy.html', controller: 'addendumPolicy'}},
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.addendum.newparts', {
        url: '/newParts',
        views:{'newparts@surveys.addendum':{ templateUrl: 'partials/surveys/addendum/newparts.html', controller: 'addendumNewParts'}},  
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.addendum.labour', {
        url: '/labour',
        views:{'labour@surveys.addendum':{ templateUrl: 'partials/surveys/addendum/labour.html', controller: 'addendumLabour'}},  
        //resolve: { loginRequired: loginRequired }
    })

    //REINSPECTION STATES---------------------------------------------------------------------------------------------------------    
    .state('surveys.reinspection', {
        url: '/reInspection',        
        // controller: 'interimReport',
        views:{'reinspection@surveys':{ templateUrl: 'partials/surveys/reinspection/index.html'}},        
        resolve: {
          loginRequired: loginRequired
        }       
    })

    .state('surveys.reinspection.policy', {
        url: '/policy',
        views:{'policy@surveys.reinspection':{ templateUrl: 'partials/surveys/reinspection/policy.html', controller: 'reinspectionPolicy'}},
        //resolve: { loginRequired: loginRequired }
    })
    
    .state('surveys.reinspection.partsdetails', {
        url: '/partsDetails',
        views:{'partsdetails@surveys.reinspection':{ templateUrl: 'partials/surveys/reinspection/partsDetails.html', controller: 'reinspectionPartsDetails'}},  
        //resolve: { loginRequired: loginRequired }
    })

    //VALUATION STATES---------------------------------------------------------------------------------------------------------    
    .state('surveys.valuation', {
        url: '/valuation',        
        views:{'valuation@surveys':{ templateUrl: 'partials/surveys/valuation/index.html'}},        
        resolve: {
          loginRequired: loginRequired
        }       
    })

    .state('surveys.valuation.policy', {
        url: '/policy',
        views:{'policy@surveys.valuation':{ templateUrl: 'partials/surveys/valuation/policy.html', controller: 'valuationPolicy'}},
    })
    
    .state('surveys.valuation.otherdetails', {
        url: '/otherDetails',
        views:{'otherdetails@surveys.valuation':{ templateUrl: 'partials/surveys/valuation/otherDetails.html', controller: 'valuationOtherDetails'}},  
    })

    //BILL CHECK STATES---------------------------------------------------------------------------------------------------------    
    .state('surveys.billcheck', {
        url: '/billCheck',        
        views:{'billcheck@surveys':{ templateUrl: 'partials/surveys/billcheck/index.html'}},        
        resolve: {
          loginRequired: loginRequired
        }       
    })

    .state('surveys.billcheck.policy', {
        url: '/policy',
        views:{'policy@surveys.billcheck':{ templateUrl: 'partials/surveys/billcheck/policy.html', controller: 'billCheckPolicy'}},
    })
    
    .state('surveys.billcheck.newparts', {
        url: '/newParts',
        views:{'newparts@surveys.billcheck':{ templateUrl: 'partials/surveys/billcheck/newparts.html', controller: 'billCheckNewParts'}},  
    })
    
    .state('surveys.billcheck.labour', {
        url: '/labour',
        views:{'labour@surveys.billcheck':{ templateUrl: 'partials/surveys/billcheck/labour.html', controller: 'billCheckLabour'}},  
    })

    //BILLS STATES---------------------------------------------------------------------------------------------------------    
    .state('surveys.bills', {
        url: '/bills',        
        views:{'bills@surveys':{ templateUrl: 'partials/surveys/bills/billcreation.html', controller: 'billsMain'}},        
        resolve: {
          loginRequired: loginRequired
        }       
    })

    //RECEIPT STATES---------------------------------------------------------------------------------------------------------    
    .state('surveys.receipt', {
        url: '/receipt',        
        views:{'receipt@surveys':{ templateUrl: 'partials/surveys/receipt/receipt.html', controller: 'receiptMain'}},        
        resolve: {
          loginRequired: loginRequired
        }       
    })    

    //SETTLEMENT LETTER STATE----------------------------------------------------------------------------------------------------------    
    .state('surveys.settlementLetter', {
        url: '/settlementLetter',
        views:{'settlementLetter@surveys':{ templateUrl: 'partials/surveys/letter/settlementLetter.html', controller: 'settlementLetter'}},  
        //resolve: { loginRequired: loginRequired }
    })
    .state('surveys.commonLetter', {
        url: '/commonLetter',
        views:{'commonLetter@surveys':{ templateUrl: 'partials/surveys/letter/commonLetter.html', controller: 'commonLetter'}},  
        //resolve: { loginRequired: loginRequired }
    })
    
    //ALBUM STATE----------------------------------------------------------------------------------------------------------    
    .state('surveys.album', {
        url: '/album',
        views:{'album@surveys':{ templateUrl: 'partials/surveys/album/album.html', controller: 'album'}},  
        //resolve: { loginRequired: loginRequired }
       })

    //NONMOTOR STATES---------------------------------------------------------------------------------------------------------    
    .state('surveys.nonmotor', {
        url: '/nonmotor',        
        views:{'nonmotor@surveys':{ templateUrl: 'partials/surveys/nonmotor/policy.html', controller: 'nonMotorPolicy'}},        
        resolve: {
          loginRequired: loginRequired
        }       
    });    

    // $stickyStateProvider.enableDebug(true);
    $urlRouterProvider.otherwise('/');

  
});

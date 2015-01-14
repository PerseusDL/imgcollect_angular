// annotations

appControllers.controller( 'AnnotationListCtrl', ['$scope','$injector', 'user', '$rootScope', 'onto',
  function( $scope, $injector, user, $rootScope, onto ){
    
    // Start once user event fires 
    
    $rootScope.$on( user.events.ok, function(){ go() });
    
    function go(){
      $scope.type = "annotation";
      $scope.title = "Annotation List";
      $scope.keys = [ 'urn','label','desc','user','time' ];
                  var label = onto.with_prefix('label');  
                  var desc = onto.with_prefix('description');
      $injector.invoke( ListCtrl, this, { $scope: $scope } );
      $scope.init([label,desc]);
      
      // The fields you allow users to filter
      // are set with object keys in $scope.filter
      //
      // See lib/list_ctr.js: filter()
      
      $scope.filter = {};
      $scope.filter[label] = null;
      $scope.filter[desc] = null;
      
      // Applying the filter is the same as initializing..
      
      $scope.apply_filter = function(){
        $injector.invoke( ListCtrl, this, { $scope: $scope } );
        $scope.init([label,desc]);
      }
    }
  }
]);


// annotation/:urn

appControllers.controller( 'AnnotationCtrl', ['$scope','$injector','annotation', 'user', '$rootScope', 'onto', 
  function( $scope, $injector, annotation, user, $rootScope, onto ){
    
    // Start once user event fires 
    
    $rootScope.$on( user.events.ok, function(){ go() });
    
    $scope.title = "Annotation";
                var label = onto.with_prefix('label');  
                var desc = onto.with_prefix('desc');
                var keyword = onto.with_prefix('subject');
    $scope.form = {};
    $scope.form[label] = "";
    $scope.form[desc] = "";
    $scope.form[keyword] = [];
    
    
    // Run once data is retrieved
    
    $scope.run = function(){
      
      // Item URN
      
      $scope.items = [];
      $scope.items[0] = { urn: $scope.json[onto.with_prefix('memberOf')]['@id'] };
      
      // Get the upload
      
      annotation.upload_src( $scope.urn ).then(
        function( data ){
          $scope.src = data[0].src;
        }
      );
    }
    
    $injector.invoke( EditCtrl, this, { $scope: $scope } );
    
    function go(){
      $scope.init([label,desc]);
    }
  }
]);

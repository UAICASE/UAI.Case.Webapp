app.controller('useCaseController', ['$', '$scope',  '$rootScope','uaiCaseService',
function ($, $scope, $rootScope, uaiCaseService) {
        

    $scope.scenarioTypes = ['P', 'A','E'];


    $scope.triggerTypes = ['A', 'S'];

    $scope.scenario = {};
    $scope.step = {};
    

    $scope.iconScenario= function (i) {

        if (i === 'A')
            return "<i class='md  md-call-split'></i>";
        else
        if (i === 'E')
            return "<i class='md  md-error'></i>";
        else
            return "<i class='md md-favorite'></i>";

    }



    $scope.iconInitiator= function(i)
    {
        if (i === 'S')
            return "<i class='md md-laptop-mac'></i>";
        else
            return "<i class='md md-person'></i>";
    }

    $scope.useCase = $rootScope.selectedModel;

    var spec;
    try {
        spec= JSON.parse($scope.useCase.get("specification"));
    } catch (e) {

        spec = $scope.useCase.get("specification");
    }
    

    $scope.specification = angular.copy(spec);
    if (!$scope.specification.scenarios)
        $scope.specification.scenarios = [];
            
    

    $scope.newStep = function () {
        if (!$scope.selectedScenario.steps)
            $scope.selectedScenario.steps = [];

        
        $scope.selectedScenario.steps.push({editable:true})
        
    }




    $scope.newScenario = function ()
    {
        $scope.specification.scenarios.push({ editable: true })
   
    }
   
    $scope.save = function () {
            

        //meto el objeto dentro del Elemento Usecase de Joint y se guarda por emision de evento "change"
            $scope.useCase.set("specification", JSON.stringify($scope.specification));
          
        };
}]);

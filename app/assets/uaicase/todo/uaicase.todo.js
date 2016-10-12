

var app = angular.module('uaicase.todo',[]);


app.controller('TodoController', ['$scope',  function($scope){

}]);

﻿app.directive('todo', function ($rootScope,ENV) {

    var controller = function ($rootScope, $scope, $timeout, $http,AuthService) {
        $scope.input = angular.element('#todo-title');


        var newTodo = {
            Title: '',
            Done: false,
            editing: false
        };


        var esta = false;
        $rootScope.$on("todo:received", function (event, todo) {
            esta = false;

            if ($scope.canal == todo.ChannelId) {

                $scope.todos.forEach(function (e) {
                    if (e.Id == todo.Id) {
                        e.Done = todo.Done;
                        e.EstadoAnterior = todo.EstadoAnterior;
                        e.Title = todo.Title;
                        esta = true;
                    }
                })


                if (!esta) {
                    $scope.todos.push(todo);
                    esta = true;

                }

            }

        });


        $scope.restore = function (focus) {
            focus = typeof focus !== 'undefined' ? focus : true;

            $scope.todo = angular.copy(newTodo);
            $scope.input.val('');

            //  if (focus === true)
            //   $scope.input.focus();
        };


        $scope.loadData = function () {
            if ($scope.canal != undefined) {
                var res = $http.get(ENV.apiEndpoint+"/todo/" + $scope.canal);
                $scope.todos = [];
                res.then(function (data) {
                    $scope.todos = data.data;
                    //$rootScope.$broadcast('grupo:pendientes:event');

                }, function () { }).finally(function () {         });




            }
        }


        $scope.loadData();
        $scope.restore();



        $scope.addTodo = function () {
            if ($scope.todo.Title !== '' && $scope.todo.Title !== undefined) {
                var editing = this.todo.editing;

                this.todo.ChannelId = $scope.canal;
                $http.put(ENV.apiEndpoint+"/todo/", $scope.todo).then(function (response) {

                    $scope.todo = response.data;



                }, function (error) {
                }).finally(function () {
                    $scope.restore();

                });



                $scope.restore();
            }
        };

        $scope.updateTodo = function () {
            $scope.restore();
        };




        $scope.saveTodo = function (todo) {
            if (todo != undefined)
                this.todo = todo;
            this.addTodo();

        };

        $scope.editTodo = function (todo) {
            $scope.todo = todo;
            $scope.todo.editing = true;

            $scope.input.focus();
        };

        $scope.toggleDone = function (todo) {
            //xtodo.Done = !xtodo.Done;
            todo.editing = true;
            $scope.saveTodo(todo);


        };

        $scope.clearCompleted = function () {
            $scope.todos = $scope.completedTodos();
            $scope.restore();
        };

        $scope.count = function () {
            c = $scope.completedTodos();
            return c.length;
        };






    };


    return {
        restrict: 'EA',
        templateUrl: 'assets/uaicase/todo/todo.html',
        replace: true,
        controller: controller,
        scope: {
            canal: "@",


        }



    };

});




app.factory('todoService', [ '$rootScope', '$filter','$http', 'ENV',function ($rootScope, $filter,$http,ENV) {

    function Todo($scope) {
    this.$scope = $scope;
    this.todoFilter = {};
    this.activeFilter = 0;

    this.input = angular.element('#todo-title');

    this.filters = [
      {
        'title': 'Todas',
        'method': 'all'
      },
      {
        'title': 'Pendientes',
        'method': 'active'
      },
      {
        'title': 'Finalizadas',
        'method': 'completed'
      }
    ];

    this.newTodo = {
      Title: '',
      Done: false,
      editing: false
    };



    this.completedTodos = function () {



        return $filter('filter')(this.$scope.todos, { Done: !true });
    };


   this.loadData=function()
    {
        var res = $http.get(ENV.apiEndpoint+"/todo");

        $scope.todos = [];
        res.then(function (data) {
            $scope.todos = data.data;
            var pendientes = ($filter('filter')($scope.todos, { Done: !true }));
            $rootScope.$broadcast('todos:count', pendientes.length);




        }, function () { }).finally(function () {

        });
        //$rootScope.$broadcast('todos:count', this.count());
        this.restore();


    }
    this.loadData();
    this.restore();









    this.addTodo = function() {
        if (this.todo.Title !== '' && this.todo.Title !== undefined) {
            var editing = this.todo.editing;
          $http.put(ENV.apiEndpoint+"/todo", this.todo).then(function (response) {

              this.todo = response.data;
              if (!editing)
              $scope.todos.push(this.todo);
              var pendientes = ($filter('filter')($scope.todos, { Done: !true }));
              console.log(pendientes);
              $rootScope.$broadcast('todos:count', pendientes.length);


          }, function (error) {
            }).finally(function () {

          });



        this.restore();
      }
    };

    this.updateTodo = function() {
      this.restore();
    };
  }

  Todo.prototype.saveTodo = function(todo) {
      if (todo!=undefined)
        this.todo = todo;
      this.addTodo();

  };

  Todo.prototype.editTodo = function(todo) {
    this.todo = todo;
    this.todo.editing = true;
    this.input.focus();
  };

  Todo.prototype.toggleDone = function (todo) {
      //todo.Done = !todo.Done;
      todo.editing = true;
      this.saveTodo(todo);
          $rootScope.$broadcast('todos:count', this.count());

  };

  Todo.prototype.clearCompleted = function() {
    this.$scope.todos = this.completedTodos();
    this.restore();
  };

  Todo.prototype.count = function() {
    c = this.completedTodos();
    return c.length;
  };

  Todo.prototype.restore = function(focus) {
    focus = typeof focus !== 'undefined' ? focus : true;

    this.todo = angular.copy(this.newTodo);
    this.input.val('');

    if ( focus === true )
      this.input.focus();
  };

  Todo.prototype.filter = function(filter) {
    if ( filter === 'active' ) {
      this.activeFilter = 1;
      this.todoFilter = { Done: false };
    } else if ( filter === 'completed' ) {
      this.activeFilter = 2;
      this.todoFilter = { Done: true };
    } else {
      this.activeFilter = 0;
      this.todoFilter = {};
    }
  };

  return Todo;
}]);

app.directive('todoWidget', ['todoService', function(todoService) {
  return {
    restrict: 'EA',
    templateUrl: 'assets/uaicase/todo/todo-widget.html',
    replace: true,
    link: function($scope, $element) {
      $scope.todoService = new todoService($scope);
    }
  };
}]);

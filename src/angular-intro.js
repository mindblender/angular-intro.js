var ngIntroDirective = angular.module('angular-intro', []);


ngIntroDirective.directive('ngIntroOptions', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',
        scope: {
            ngIntroMethod: "=",
            ngIntroOptions: '=',
            ngIntroOncomplete: '=',
            ngIntroOnexit: '=',
            ngIntroOnchange: '=',
            ngIntroOnbeforechange: '=',
            ngIntroOnafterchange: '=',
            ngIntroAutostart: '&',
            ngIntroAutorefresh: '='
        },
        link: function(scope, element, attrs) {
            scope.ngIntroMethod = function(step) {

                var intro;
                var navigationWatch = scope.$on('$locationChangeStart', function(){
                  intro.exit();
                });

                if (typeof(step) === 'string') {
                    intro = introJs(step);

                } else {
                    intro = introJs();
                }

                intro.setOptions(scope.ngIntroOptions);
                
                if (scope.ngIntroAutorefresh) {
                  scope.$watch(function(){
                    intro.refresh();
                  });
                }
                
                if (scope.ngIntroOncomplete) {
                    intro.oncomplete(function() {
                        scope.ngIntroOncomplete.call(this, scope);
                        scope.$digest();
                        navigationWatch();
                    });
                }

                if (scope.ngIntroOnexit) {
                    intro.onexit(function() {
                        scope.ngIntroOnexit.call(this, scope);
                        scope.$digest();
                        navigationWatch();
                    });
                }

                if (scope.ngIntroOnchange) {
                    intro.onchange(function(targetElement){
                        $timeout(scope.ngIntroOnchange.bind(this, targetElement, scope));
                    });
                }

                if (scope.ngIntroOnbeforechange) {
                    intro.onbeforechange(function(targetElement) {
                        $timeout(scope.ngIntroOnbeforechange.bind(this, targetElement, scope));
                    });
                }

                if (scope.ngIntroOnafterchange) {
                    intro.onafterchange(function(targetElement){
                        $timeout(scope.ngIntroOnafterchange.bind(this, targetElement, scope));
                    });
                }

                if (typeof(step) === 'number') {
                    intro.goToStep(step).start();
                } else {
                    intro.start();
                }
            };

            if (scope.ngIntroAutostart()) {
                $timeout(function() {
                    scope.ngIntroMethod();
                });
            }
        }
    };
}]);

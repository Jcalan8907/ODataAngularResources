/// <reference path="references.d.ts" />

module OData {
    export interface MethodCallFactory{
        new (methodName: string,...args):MethodCall
    }
    
    export class MethodCall implements IExecutable {
        private methodName: string;
        private params: IExecutable[];

        public execute(): string {
            var invocation = this.methodName + "(";
            for (var i = 0; i < this.params.length; i++) {
                if (i > 0) {
                    invocation += ",";
                }

                invocation += this.params[i].execute();
            }
            invocation += ")";
            return invocation;
        }

        constructor(methodName: string,...args) {
            if (methodName === undefined || methodName === "")
                throw "Method name should be defined";

            this.params = [];

            if (arguments.length < 2)
                throw "Method should be invoked with arguments";

            for (var i = 1; i < arguments.length; i++) {
                var value = arguments[i];
                if (angular.isFunction(value.execute)) {
                    this.params.push(value);
                } else {
                    //We assume the first one is the object property;
                    if (i == 1) {
                        this.params.push(new OData.Property(value));
                    } else {
                        this.params.push(new OData.Value(value));
                    }
                }
            }

            this.methodName = methodName;
        }
    }

    angular.module('ODataResources').
        factory('$odataMethodCall', ['$odataProperty', '$odataValue',
        ()=>MethodCall
    ]);

}
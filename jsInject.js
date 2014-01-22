var WintellectJs;
(function (WintellectJs) {

    'use strict';

    var $$jsInject = (function () {
        function $$jsInject() {
            var _this = this;
            this.maxRecursion = 20;
            this.errorRecursion = "Maximum recursion at ";
            this.errorArray = "Must pass array.";
            this.errorRegistration = "Already registered.";
            this.errorFunction = "Must pass function to invoke.";
            this.errorService = "Service does not exist.";
            this.isArray = function (arr) {
                return Object.prototype.toString.call(arr) === '[object Array]';
            };
            this.invoke = function (fn, deps, instance, level) {
                var i = 0,
                    args = [],
                    lvl = level || 0;
                if (lvl > _this.maxRecursion) {
                    throw _this.errorRecursion + lvl;
                }
                for (; i < deps.length; i += 1) {
                    args.push(_this.get(deps[i], lvl + 1));
                }
                return fn.apply(instance, args);
            };
            this.get = function (name, level) {
                var wrapper = _this.container[name],
                    lvl = level || 0;
                if (wrapper) {
                    return wrapper(lvl);
                }
                throw _this.errorService;
            };
            this.register = function (name, annotatedArray) {
                if (!_this.isArray(annotatedArray)) {
                    throw _this.errorArray;
                }
                if (_this.container[name]) {
                    throw _this.errorRegistration;
                }
                if (typeof annotatedArray[annotatedArray.length - 1] !== 'function') {
                    throw _this.errorFunction;
                }
                _this.container[name] = function (level) {
                    var lvl = level || 0,
                        Template = function () {}, result = {}, instance, fn = annotatedArray[annotatedArray.length - 1],
                        deps = annotatedArray.length === 1 ? (annotatedArray[0].$$deps || []) : annotatedArray.slice(0, annotatedArray.length - 1),
                        injected;
                    Template.prototype = fn.prototype;
                    instance = new Template();
                    injected = _this.invoke(fn, deps, instance, lvl + 1);
                    result = injected || instance;

                    // don't evaluate again (lazy-load)
                    _this.container[name] = function () {
                        return result;
                    };
                    return result;
                };
            };
            var ioc = {
                get: _this.get,
                register: _this.register,
                "ERROR_ARRAY": this.errorArray,
                "ERROR_RECURSION": this.errorRecursion + (this.maxRecursion + 1),
                "ERROR_FUNCTION": this.errorFunction,
                "ERROR_REGISTRATION": this.errorRegistration,
                "ERROR_SERVICE": this.errorService
            };
            this.container = {
                "$$jsInject": function () {
                    return ioc;
                }
            };
            return ioc;
        }
        return $$jsInject;
    })();
    WintellectJs.$$jsInject = $$jsInject;
})(WintellectJs || (WintellectJs = {}));
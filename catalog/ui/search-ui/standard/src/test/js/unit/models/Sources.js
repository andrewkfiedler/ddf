/*jslint node: true */
/* global describe, it, require */
'use strict';

var Squire;
(function setupSquire() {
    var requirejs = require('requirejs');
    requirejs.config({
        baseUrl: '.',
        nodeRequire: require,
        packages: [
            {
                name: 'squirejs',
                location: 'node_modules/squirejs',
                main: 'src/Squire'
            }
        ]
    });
    Squire = requirejs('squirejs');
})();
var $;
(function setup$() {
    var document = require('jsdom').jsdom();
    var window = document.defaultView;
    require('jquery')(window);
    $ = window.$;
})();
var Backbone;
(function replaceBackboneJquery() {
    Backbone = require('backbone');
    Backbone.$ = $;
})();

var expect = require('chai').expect;
var sinon = require('sinon');
var tryAssertions = require('../../shared/utility.js').tryAssertions;

describe('Sources', function () {
    var sourcesModelPath = 'src/main/webapp/rearchitecture/js/models/Sources';
    var injector = new Squire();
    injector.mock('jquery', $).mock('backbone', Backbone);
    var response;
    var deferred;
    var clock = sinon.useFakeTimers();
    sinon.stub($, 'ajax', function (options) {
        return deferred.always(function(response, success){
            if (success) {
                options.success(response);
            } else {
                options.error(response);
            }
        });
    });

    before(function fetchDependencies(done) {
        injector.require(['src/main/webapp/rearchitecture/js/models/Source'], function (SourceModel) {
            injector.mock('rearchitecture/js/models/Source', SourceModel);
            done();
        });
    });

    beforeEach(function resetDeferred(){
        deferred = $.Deferred();
    });

    afterEach(function resolveHangingRequests(){
        deferred.resolve();
    });

    after(function restoreTimers(){
        clock.restore();
    });


    it('should initialize empty and immediately start polling', function(done){
        response = [
            {
                available: true,
                id: "source1",
                contentTypes: [ ],
                version: "2.9.0-SNAPSHOT"
            },
            {
                available: true,
                id: "source2",
                contentTypes: [ ],
                version: "2.0"
            },
            {
                available: false,
                id: "source3",
                contentTypes: [ ],
                version: "2.0"
            }
        ];
        injector.require([sourcesModelPath], function (Sources) {
            try {
                expect(Sources.length).to.equal(0);
                Sources.on('update', function () {
                    done(tryAssertions(function () {
                        expect(Sources.length).to.equal(3);
                    }));
                });
                deferred.resolve(response, true);
            } catch (err){
                done(err);
            }
        });
    });

    it('should pick up any changes', function(done){
        response = [
            {
                available: true,
                id: "source1",
                contentTypes: [ ],
                version: "2.9.0-SNAPSHOT"
            },
            {
                available: true,
                id: "source2",
                contentTypes: [ ],
                version: "2.0"
            },
            {
                available: true,
                id: "source3",
                contentTypes: [ ],
                version: "2.0"
            }
        ];
        injector.require([sourcesModelPath], function (Sources) {
            try {
                expect(Sources.length).to.equal(3);
                Sources.on('change', function () {
                    done(tryAssertions(function () {
                        expect(Sources.length).to.equal(3);
                    }));
                });
                deferred.resolve(response, true);
                clock.tick(10000);
            } catch (err){
                done(err);
            }
        });
    });
});
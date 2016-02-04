/*jslint node: true */
/* global describe, it, require */
'use strict';

var utility = require('../../shared/utility.js');
var Squire = utility.getSquire();
var $ = utility.getJquery();
var Backbone = utility.getBackbone($);

var expect = require('chai').expect;
var sinon = require('sinon');
var tryAssertions = utility.tryAssertions;
var clock = sinon.useFakeTimers();

describe('Sources', function () {
    var injector, ajaxMock, clock, Sources, Source, serverResponses;

    function resetServerResponses() {
        serverResponses = [
            [
                {
                    available: true,
                    id: "source1",
                    contentTypes: [],
                    version: "2.9.0-SNAPSHOT"
                },
                {
                    available: true,
                    id: "source2",
                    contentTypes: [],
                    version: "2.0"
                },
                {
                    available: false,
                    id: "source3",
                    contentTypes: [],
                    version: "2.0"
                }
            ],
            [
                {
                    available: true,
                    id: "source1",
                    contentTypes: [],
                    version: "2.9.0-SNAPSHOT"
                },
                {
                    available: true,
                    id: "source2",
                    contentTypes: [],
                    version: "2.0"
                },
                {
                    available: true,
                    id: "source3",
                    contentTypes: [],
                    version: "2.0"
                }
            ]
        ];
    }

    before(function setupAll(done) {
        injector = new Squire();
        injector.mock('backbone', Backbone);
        ajaxMock = utility.mockAjax($);
        clock = sinon.useFakeTimers();
        injector.require(['src/main/webapp/rearchitecture/js/models/Source'], function (SourceModel) {
            Source = SourceModel;
            injector.mock('rearchitecture/js/models/Source', Source);
            injector.require(['src/main/webapp/rearchitecture/js/models/Sources'], function (SourcesSingleton) {
                Sources = SourcesSingleton;
                done();
            });
        });
    });

    beforeEach(function setupIndividual() {
        Sources.reset();
        resetServerResponses();
        ajaxMock.resetDeferred();
    });

    after(function tearDownAll() {
        clock.restore();
        ajaxMock.destroy();
    });


    it('should initialize empty and immediately start polling', function (done) {
        try {
            expect(Sources.length).to.equal(0);
            Sources.once('update', function () {
                done(tryAssertions(function () {
                    expect(Sources.length).to.equal(3);
                }));
            });
            ajaxMock.resolveDeferred(serverResponses[0], true);
            clock.tick(10000);
        } catch (err) {
            done(err);
        }
    });

    it('should pick up any changes to existing models', function (done) {
        try {
            Sources.once('sync', function () {
                expect(Sources.get('source3').get('available')).to.equal(false);
                Sources.once('sync', function () {
                    done(tryAssertions(function () {
                        expect(Sources.get('source3').get('available')).to.equal(true);
                    }));
                });
                ajaxMock.resolveDeferred(serverResponses[1], true);
                clock.tick(10000);
            });
            ajaxMock.resolveDeferred(serverResponses[0], true);
            clock.tick(10000);
        } catch (err) {
            done(err);
        }
    });

    it('should repoll upon a fetch error', function (done) {
        try {
            Sources.once('error', function () {
                expect(Sources.length).to.equal(0);
                Sources.once('sync', function () {
                    done(tryAssertions(function () {
                        expect(Sources.length).to.equal(3);
                    }));
                });
                ajaxMock.resolveDeferred(serverResponses[1], true);
                clock.tick(10000);
            });
            ajaxMock.resolveDeferred(serverResponses[0], false);
            clock.tick(10000);
        } catch (err) {
            done(err);
        }
    });

    it('should keep old results upon a fetch error', function (done) {
        try {
            Sources.once('error',function(){
                done(tryAssertions(function () {
                    expect(Sources.length).to.equal(3);
                }));
            });
            Sources.once('sync', function () {
                expect(Sources.length).to.equal(3);
                ajaxMock.resolveDeferred(serverResponses[0], false);
                clock.tick(10000);
            });
            ajaxMock.resolveDeferred(serverResponses[0], true);
            clock.tick(10000);
        } catch (err) {
            done(err);
        }
    });
});
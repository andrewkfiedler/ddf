/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'wreqr',
    'js/model/Metacard',
    'js/model/Query',
    'js/model/Workspace',
    'js/model/QueryResult'
], function ($, _, Backbone, wreqr, Metacard, Query, Workspace, QueryResult) {

    return Backbone.AssociatedModel.extend({
        relations: [
            {
                type: Backbone.One,
                key: 'currentQuery',
                relatedModel: Query.Model
            },
            {
                type: Backbone.One,
                key: 'currentWorkspace',
                relatedModel: Workspace
            },
            {
                type: Backbone.Many,
                key: 'selectedResults',
                relatedModel: Metacard
            },
            {
                type: Backbone.Many,
                key: 'results',
                relatedModel: Metacard
            },
            {
                type: Backbone.Many,
                key: 'activeSearchResults',
                relatedModel: QueryResult
            },
            {
                type: Backbone.Many,
                key: 'completeActiveSearchResults',
                relatedModel: QueryResult
            }
        ],
        defaults: {
            currentWorkspace: undefined,
            selectedResults: [],
            queryId: undefined,
            savedItems: undefined,
            query: undefined,
            results: [],  //list of metacards
            activeSearchResults: [],
            activeSearchResultsAttributes: [],
            completeActiveSearchResults: [],
            completeActiveSearchResultsAttributes: []
        },
        initialize: function(){
            this.listenTo(this.get('activeSearchResults'), 'update add remove reset', this.updateActiveSearchResultsAttributes);
            this.listenTo(this.get('completeActiveSearchResults'), 'update add remove reset', this.updateActiveSearchResultsFullAttributes);
        },
        updateActiveSearchResultsFullAttributes: function() {
            var availableAttributes = this.get('completeActiveSearchResults').reduce(function(currentAvailable, result) {
                currentAvailable = _.union(currentAvailable, Object.keys(result.get('metacard').get('properties').toJSON()));
                return currentAvailable;
            }, []).sort();
            this.set('completeActiveSearchResultsAttributes', availableAttributes);
        },
        getCompleteActiveSearchResultsAttributes: function(){
            return this.get('completeActiveSearchResultsAttributes');
        },
        getCompleteActiveSearchResults: function(){
            return this.get('completeActiveSearchResults');
        },
        setCompleteActiveSearchResults: function(results){
            this.get('completeActiveSearchResults').reset(results.models || results);
        },
        updateActiveSearchResultsAttributes: function(){
            var availableAttributes = this.get('activeSearchResults').reduce(function(currentAvailable, result) {
                currentAvailable = _.union(currentAvailable, Object.keys(result.get('metacard').get('properties').toJSON()));
                return currentAvailable;
            }, []).sort();
            this.set('activeSearchResultsAttributes', availableAttributes);
        }, 
        getActiveSearchResultsAttributes: function(){
            return this.get('activeSearchResultsAttributes');
        },
        getQuery: function(){
            return this.get('query');
        },
        setQuery: function(queryRef){
            this.set('query', queryRef);
        },
        getActiveSearchResults: function(){
            return this.get('activeSearchResults');
        },
        setActiveSearchResults: function(results){
            this.get('activeSearchResults').reset(results.models || results);
        },
        addToActiveSearchResults: function(results){
            this.get('activeSearchResults').add(results.models || results);
        },
        getSelectedResults: function(){
            return this.get('selectedResults');
        },
        clearSelectedResults: function(){
            this.getSelectedResults().reset();
        },
        addSelectedResult: function(metacard){
            this.getSelectedResults().add(metacard);
        },
        removeSelectedResult: function(metacard){
            this.getSelectedResults().remove(metacard);
        },
        setCurrentQuery: function(query){
            this.set('currentQuery', query);
        },
        getCurrentQuery: function(){
            return this.get('currentQuery');
        }
    });
});
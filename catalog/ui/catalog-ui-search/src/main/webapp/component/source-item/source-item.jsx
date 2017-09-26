/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import React from 'react';
import {render} from 'react-dom';
import CustomElements from 'js/CustomElements';
import Marionette from 'marionette';

const ElementName = CustomElements.register('source-item');

const SourceItem = ({id, available}) => {
    const symbol = available ? 'fa-exchange' : 'fa-bolt';
    const availableClass = available ? 'is-available': 'is-not-available';

    return (
        <ElementName class={`${availableClass}`}>
            <div className="source-available">
                <span className={`${availableClass} fa ${symbol}`}></span>
            </div>
            <div className="source-name" title={id}>
                {id}
            </div>
        </ElementName>
    );
}

module.exports = Marionette.ItemView.extend({
    modelEvents: {
        'change': 'render' 
    },
    render: function(){
        render(<SourceItem {...this.model.toJSON()} />, this.el);
    }
});
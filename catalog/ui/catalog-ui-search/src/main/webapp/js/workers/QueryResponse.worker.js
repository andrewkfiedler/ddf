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
var availableFunctions = {
    parse: function (data) {
        reply({
            id: data.id,
            method: data.method,
            arguments: data.arguments
        })
    },
    collapseDuplicates: function () {

    },
    filter: function () {

    }
};

function defaultReply(message) {
    console.log(message);
}

function reply(data) {
    if (data instanceof Object && data.hasOwnProperty('id') && data.hasOwnProperty('method') && data.hasOwnProperty('arguments')) {
        postMessage({
            'id': data.id,
            'method': data.method,
            'arguments': data.arguments
        });
    } else {
        throw new TypeError('reply - not enough arguments');
        return;
    }
}

onmessage = function (oEvent) {
    if (oEvent.data instanceof Object && oEvent.data.hasOwnProperty('id') && oEvent.data.hasOwnProperty('method') && oEvent.data.hasOwnProperty('arguments')) {
        availableFunctions[oEvent.data.method](oEvent.data);
    } else {
        defaultReply(oEvent.data);
    }
};
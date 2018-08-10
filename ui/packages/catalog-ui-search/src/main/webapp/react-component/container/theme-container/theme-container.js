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
import React from 'react';
import {ThemeProvider} from 'styled-components'
const user = require('component/singletons/user-instance');

const sizing = {
    comfortable: {
        minimumButtonSize: '2.75rem',
        minimumLineSize: '1.875rem',
        minimumSpacing: '0.625rem'
    },
    cozy: {
        minimumButtonSize: '2.275rem',
        minimumLineSize: '1.6875rem',
        minimumSpacing: '0.4625rem'
    },
    compact: {
        minimumButtonSize: '1.8rem',
        minimumLineSize: '1.5rem',
        minimumSpacing: '0.3rem'
    }
}

const borderRadius = {
    borderRadius: '1px'
}

const screenSizes = {
    minimumScreenSize: '20rem',
    mobileScreenSize: '26.25rem',
    smallScreenSize: '58.75rem',
    mediumScreenSize: '90rem'
}

const zIndexes = {
    zIndexMenubar: 101,
    zIndexLightbox: 101,
    zIndexLoadingCompanion: 101,
    zIndexSlideout: 103,
    zIndexContent: 101,
    zIndexConfirmation: 103,
    zIndexHelp: 104,
    zIndexVerticalMenu: 101,
    zIndexDropdown: 103,
    zIndexMenuItem: 102,
    zIndexBlocking: 105
}

const transitions = {
    transitionTime: '0s',
    coreTransitionTime: '0.250s'
}

const fontSizes = {
    minimumFontSize: '1rem',
    mediumFontSize: '1.2rem',
    largeFontSize: '1.4rem'
}

const spacing = (minSpacing) => {
    return {
        minimumSpacing: `${minSpacing}rem`,
        mediumSpacing: `${2*minSpacing}rem`,
        largeSpacing: `${3*minSpacing}rem`
    };
}

const dividers = (minSpacing) => {
    return {
        dividerHeight: `${minSpacing}rem`,
        minimumDividerSize: `${3*minSpacing}rem`
    };
}

const opacity = {
    minimumOpacity: 0.6
}

const themes = {
    dark: {
        primaryColor: '#3c6dd5',
        positiveColor: '#428442',
        negativeColor: '#8a423c',
        warningColor: '#c89600',
        favoriteColor: '#d1d179',
        backgroundNavigation: '#252529',
        backgroundAccentContent: '#2A2A2E',
        backgroundDropdown: '#35353a',
        backgroundContent: '#35353a',
        backgroundModal: '#252529',
        backgroundSlideout: '#252529'
    },
    sea: {
        primaryColor: '#32a6ad',
        positiveColor: '#154e7d',
        negativeColor: '#a32c00',
        warningColor: '#b65e1f',
        favoriteColor: '#709e33',
        backgroundNavigation: '#0f3757',
        backgroundAccentContent: '#ffffff',
        backgroundDropdown: '#ffffff',
        backgroundContent: '#ffffff',
        backgroundModal: '#e5e6e6',
        backgroundSlideout: '#e5e6e6'
    },
    light: {
        primaryColor: '#3c6dd5',
        positiveColor: '#428442',
        negativeColor: '#8a423c',
        warningColor: '#c89600',
        favoriteColor: '#d1d179',
        backgroundNavigation: '#3c6dd5',
        backgroundAccentContent: '#edf9fc',
        backgroundDropdown: '#f3fdff',
        backgroundContent: '#f3fdff',
        backgroundModal: '#edf9fc',
        backgroundSlideout: '#edf9fc'
    },
    custom: {
        primaryColor: '#3c6dd5',
        positiveColor: '#428442',
        negativeColor: '#8a423c',
        warningColor: '#c89600',
        favoriteColor: '#d1d179',
        backgroundNavigation: '#252529',
        backgroundAccentContent: '#2A2A2E',
        backgroundDropdown: '#35353a',
        backgroundContent: '#35353a',
        backgroundModal: '#252529',
        backgroundSlideout: '#252529'
    }
}

function updateTheme(userTheme) {
    let relevantColorTheme = themes[userTheme.theme];
    if (userTheme.theme === 'custom') {
        relevantColorTheme = Object.keys(relevantColorTheme).reduce((newMap, key) => {
            newMap[key] = userTheme[`custom${key.replace(/^\w/, c => c.toUpperCase())}`];
            return newMap;
        }, {})
    }
    let sizingTheme = sizing[userTheme.spacingMode];
    return {
        ...relevantColorTheme,
        ...userTheme,
        ...sizingTheme,
        ...borderRadius,
        ...screenSizes,
        ...zIndexes,
        ...transitions,
        ...fontSizes,
        ...spacing(parseFloat(sizingTheme.minimumSpacing)),
        ...dividers(parseFloat(sizingTheme.minimumSpacing)),
        ...opacity,
        multiple: (multiplier, variable, unit) => {
            return `${multiplier * parseFloat(variable)}${unit ? unit : 'rem'}`
        }
    }
}
class ThemeContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            ...updateTheme(user.get('user').get('preferences').get('theme').getTheme())
        }
    }
    componentDidMount() {
        user.get('user').get('preferences').on('change:theme', this.updateTheme.bind(this));
    }
    updateTheme() {
        this.setState(updateTheme(user.get('user').get('preferences').get('theme').getTheme()))
    }
    render() {
        return (
            <ThemeProvider theme={this.state}>
                {this.props.children}
            </ThemeProvider>
        )
    }
}

export default ThemeContainer
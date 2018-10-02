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
import * as React from 'react'
import styled from '../../../react-component/styles/styled-components'
import MarionetteRegionContainer from '../../../react-component/container/marionette-region-container'
const AboutView = require('dev/component/about/about.view')
const VideosView = require('dev/component/videos/videos.view')
import Tabs from '../../../react-component/presentation/tabs'
import Guide from '../guide'
import Section from '../../../react-component/presentation/section'

import { hot } from 'react-hot-loader'

const Root = styled.div`
  height: 100%;
  overflow: auto;

  .content {
    height: 100%;
  }

  .section {
    padding: ${props => props.theme.minimumSpacing};
  }
  .is-header {
    text-align: left;
    padding: ${props => props.theme.minimumSpacing} 0px;
  }
  .example,
  .instance {
    margin: ${props => props.theme.minimumSpacing};
  }
  .example .title {
    font-size: ${props => props.theme.mediumFontSize};
    padding: ${props => props.theme.minimumSpacing} 0px;
  }
  .limit-to-center {
    max-width: 800px;
    margin: auto;
    padding: ${props => props.theme.minimumSpacing};
  }
  .pad-bottom {
    padding-bottom: 30%;
  }
  .editor + .editor {
    margin-top: ${props => props.theme.minimumSpacing};
  }

  .editor[data-html]::before,
  .editor[data-js]::before,
  .editor[data-css]::before {
    padding: 0px ${props => props.theme.minimumSpacing};
    opacity: ${props => props.theme.minimumOpacity};
  }

  .editor[data-html]::before {
    content: 'HTML';
  }

  .editor[data-js]::before {
    content: 'Javascript';
  }

  .editor[data-css]::before {
    content: 'CSS';
  }
`

const Dev = (props: any) => {
  return (
    <Root {...props}>
      <div className="limit-to-center">
        <Section>
          <Tabs
            tabs={[
              {
                title: 'About',
                content: <MarionetteRegionContainer view={AboutView} />,
              },
              {
                title: 'Guide',
                content: (
                  <Section>
                    <Guide />
                  </Section>
                ),
              },
              {
                title: 'Videos',
                content: <MarionetteRegionContainer view={VideosView} />,
              },
            ]}
            active="About"
            sticky
            gaseous
            className="limit-to-center"
          />
        </Section>
      </div>
    </Root>
  )
}

export default hot(module)(Dev)

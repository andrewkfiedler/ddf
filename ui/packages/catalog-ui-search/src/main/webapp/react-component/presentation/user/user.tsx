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
import styled from '../../styles/styled-components'
import { hot } from 'react-hot-loader'

const Root = styled<{}, 'div'>('div')`
    width: 100%;
    height: 100%;
`

type Props = {
  username: string
  email: string
}

export default hot(module)(({ username, email }: Props) => {
  return (
    <Root>
      <div className="is-guest">
            <div className="user-info">
                <input placeholder="Username" type="text" id="username" name="username" />
                <input placeholder="Password" type="password" id="password" name="password" />
            </div>
            <div className="is-divider">
            </div>
            <button id="sign-in" className="is-primary">Sign In</button>
        </div>
        <div className="is-idp">
            <div className="user-info">
                <div className="info-username is-large-font is-bold">
                    {username}
                </div>
                <div className="info-email is-medium-font">
                    {email}
                </div>
            </div>
            <div className="is-divider"></div>
            <button id="sign-out" className="is-negative">Sign Out</button>
        </div>
    </Root>
  )
})
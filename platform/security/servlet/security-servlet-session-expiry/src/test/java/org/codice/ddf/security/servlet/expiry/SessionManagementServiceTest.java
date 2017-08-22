/**
 * Copyright (c) Codice Foundation
 * <p>
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 * <p>
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 */
package org.codice.ddf.security.servlet.expiry;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.isA;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Collections;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Response;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.io.IOUtils;
import org.apache.cxf.helpers.DOMUtils;
import org.apache.cxf.ws.security.tokenstore.SecurityToken;
import org.apache.shiro.subject.PrincipalCollection;
import org.codice.ddf.security.handler.api.SAMLAuthenticationToken;
import org.junit.Before;
import org.junit.Test;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import ddf.security.SecurityConstants;
import ddf.security.Subject;
import ddf.security.assertion.SecurityAssertion;
import ddf.security.common.SecurityTokenHolder;
import ddf.security.service.SecurityManager;
import ddf.security.service.SecurityServiceException;

public class SessionManagementServiceTest {
    private HttpServletRequest request;

    private SecurityToken token;

    private SecurityTokenHolder tokenHolder;

    private SecurityToken securityToken;

    private SecurityManager manager;

    private SessionManagementService sessionManagementService;

    @Before
    public void setup() throws ParserConfigurationException, SAXException, IOException,
            SecurityServiceException {
        request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        tokenHolder = mock(SecurityTokenHolder.class);
        token = mock(SecurityToken.class);
        securityToken = mock(SecurityToken.class);
        SecurityAssertion principal = mock(SecurityAssertion.class);
        PrincipalCollection principalCollection = mock(PrincipalCollection.class);
        Subject subject = mock(Subject.class);
        manager = mock(SecurityManager.class);

        when(principal.getSecurityToken()).thenReturn(securityToken);
        when(principalCollection.asList()).thenReturn(Collections.singletonList(principal));
        when(subject.getPrincipals()).thenReturn(principalCollection);
        when(manager.getSubject(isA(SAMLAuthenticationToken.class))).thenReturn(subject);
        when(token.getToken()).thenReturn(readXml(this.getClass()
                .getClassLoader()
                .getResourceAsStream("saml.xml")).getDocumentElement());
        when(tokenHolder.getRealmTokenMap()).thenReturn(Collections.singletonMap("idp", token));
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute(SecurityConstants.SAML_ASSERTION)).thenReturn(tokenHolder);
        sessionManagementService = new SessionManagementService();
        sessionManagementService.setSecurityManager(manager);
    }

    @Test
    public void testGetExpiry()
            throws ParserConfigurationException, SAXException, IOException, ServletException {
        SessionManagementService sessionManagementService = new SessionManagementService();
        sessionManagementService.setClock(Clock.fixed(Instant.EPOCH, ZoneId.of("UTC")));
        Response expiry = sessionManagementService.getExpiry(request);
        assertThat(expiry.getStatus(), is(200));
        assertThat(IOUtils.toString(new InputStreamReader((ByteArrayInputStream) expiry.getEntity())),
                is("4522435794788"));
    }

    @Test
    public void testGetExpirySoonest()
            throws ServletException, IOException, ParserConfigurationException, SAXException {
        SessionManagementService sessionManagementService = new SessionManagementService();
        sessionManagementService.setClock(Clock.fixed(Instant.EPOCH, ZoneId.of("UTC")));
        SecurityToken soonerToken = mock(SecurityToken.class);
        String saml = IOUtils.toString(new InputStreamReader(this.getClass()
                .getClassLoader()
                .getResourceAsStream("saml.xml")));
        saml = saml.replace("2113", "2103");
        when(soonerToken.getToken()).thenReturn(readXml(IOUtils.toInputStream(saml,
                "UTF-8")).getDocumentElement());
        SecurityToken laterToken = mock(SecurityToken.class);
        saml = IOUtils.toString(new InputStreamReader(this.getClass()
                .getClassLoader()
                .getResourceAsStream("saml.xml")));
        saml = saml.replace("2113", "2213");
        when(laterToken.getToken()).thenReturn(readXml(IOUtils.toInputStream(saml,
                "UTF-8")).getDocumentElement());
        HashMap<String, SecurityToken> tokenMap = new HashMap<>();
        tokenMap.put("jaas", laterToken);
        tokenMap.put("idp", token);
        tokenMap.put("karaf", soonerToken);
        when(tokenHolder.getRealmTokenMap()).thenReturn(tokenMap);
        Response expiry = sessionManagementService.getExpiry(request);
        assertThat(expiry.getStatus(), is(200));
        assertThat(IOUtils.toString(new InputStreamReader((ByteArrayInputStream) expiry.getEntity())),
                is("4206816594788"));
    }

    @Test
    public void testGetRenewal() throws ServletException, IOException {
        Response renewal = sessionManagementService.getRenewal(request);
        assertThat(renewal.getStatus(), is(200));
        verify(tokenHolder).addSecurityToken("idp", securityToken);
    }

    @Test
    public void testGetRenewalFails() throws SecurityServiceException {
        when(manager.getSubject(isA(SAMLAuthenticationToken.class))).thenThrow(new SecurityServiceException());
        Response renewal = sessionManagementService.getRenewal(request);
        assertThat(renewal.getStatus(), is(500));
    }

    @Test
    public void testGetInvalidateNoQueryString() {
        SessionManagementService sessionManagementService = new SessionManagementService();
        when(request.getRequestURL()).thenReturn(new StringBuffer(
                "https://localhost:8993/services/session/invalidate"));
        when(request.getQueryString()).thenReturn(null);
        Response invalidate = sessionManagementService.getInvalidate(request);
        assertThat(invalidate.getStatus(), is(307));
        assertThat(invalidate.getLocation(),
                is(equalTo(URI.create("https://localhost:8993/logout?noPrompt=true"))));
    }

    @Test
    public void testGetInvalidateWithQueryString() {
        SessionManagementService sessionManagementService = new SessionManagementService();
        when(request.getRequestURL()).thenReturn(new StringBuffer(
                "https://localhost:8993/services/session/invalidate?prevurl=/admin/"));
        when(request.getQueryString()).thenReturn("prevurl=/admin/");
        Response invalidate = sessionManagementService.getInvalidate(request);
        assertThat(invalidate.getStatus(), is(307));
        assertThat(invalidate.getLocation(),
                is(equalTo(URI.create("https://localhost:8993/logout?noPrompt=true&prevurl=/admin/"))));
    }

    private static Document readXml(InputStream is)
            throws SAXException, IOException, ParserConfigurationException {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

        dbf.setValidating(false);
        dbf.setIgnoringComments(false);
        dbf.setIgnoringElementContentWhitespace(true);
        dbf.setNamespaceAware(true);

        DocumentBuilder db = dbf.newDocumentBuilder();
        db.setEntityResolver(new DOMUtils.NullResolver());

        return db.parse(is);
    }
}
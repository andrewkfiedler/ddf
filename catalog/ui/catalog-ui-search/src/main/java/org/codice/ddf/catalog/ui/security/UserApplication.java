/**
 * Copyright (c) Codice Foundation
 *
 * <p>This is free software: you can redistribute it and/or modify it under the terms of the GNU
 * Lesser General Public License as published by the Free Software Foundation, either version 3 of
 * the License, or any later version.
 *
 * <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public
 * License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 */
package org.codice.ddf.catalog.ui.security;

import static org.boon.HTTP.APPLICATION_JSON;
import static spark.Spark.exception;
import static spark.Spark.get;
import static spark.Spark.path;
import static spark.Spark.put;

import com.asual.lesscss.LessException;
import com.google.common.collect.ImmutableMap;
import ddf.security.Subject;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.apache.shiro.SecurityUtils;
import org.boon.json.JsonFactory;
import org.codice.ddf.catalog.ui.metacard.EntityTooLargeException;
import org.codice.ddf.catalog.ui.util.EndpointUtil;
import org.codice.ddf.catalog.ui.util.UserUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import spark.servlet.SparkApplication;

public class UserApplication implements SparkApplication {

  private static final Logger LOGGER = LoggerFactory.getLogger(UserApplication.class);

  private final EndpointUtil util;

  private final UserUtil userUtil;

  public UserApplication(EndpointUtil util, UserUtil userUtil) throws LessException {
    this.util = util;
    this.userUtil = userUtil;
  }

  @Override
  public void init() {
    path(
        "/internal",
        () -> {
          get(
              "/user/css/*",
              (req, res) -> {
                //                res.header("Cache-Control", "no-cache, no-store,
                // must-revalidate"); // HTTP 1.1.
                //                res.header("Pragma", "no-cache"); // HTTP 1.0.
                //                res.header("Expires", "0"); // Proxies.
                res.type("text/css");
                res.header("Content-Encoding", "gzip");
                return userUtil.getBaseUserTheme();
              });
          get(
              "/user",
              (req, res) -> {
                res.type(APPLICATION_JSON);
                return userUtil.getSubjectAttributes();
              },
              util::getJson);

          put(
              "/user/preferences",
              APPLICATION_JSON,
              (req, res) -> {
                Subject subject = (Subject) SecurityUtils.getSubject();

                if (subject.isGuest()) {
                  res.status(401);
                  return ImmutableMap.of("message", "Guest cannot save preferences.");
                }

                Map<String, Object> preferences =
                    JsonFactory.create().parser().parseMap(util.safeGetBody(req));

                if (preferences == null) {
                  preferences = new HashMap<>();
                }

                userUtil.setUserPreferences(subject, preferences);
                return preferences;
              },
              util::getJson);

          exception(EntityTooLargeException.class, util::handleEntityTooLargeException);

          exception(IOException.class, util::handleIOException);

          exception(RuntimeException.class, util::handleRuntimeException);
        });
  }
}

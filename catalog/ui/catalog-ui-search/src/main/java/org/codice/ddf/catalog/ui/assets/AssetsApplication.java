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
package org.codice.ddf.catalog.ui.assets;

import static spark.Spark.exception;
import static spark.Spark.get;

import com.asual.lesscss.LessException;
import java.io.IOException;
import java.nio.charset.Charset;
import org.apache.commons.io.IOUtils;
import org.codice.ddf.catalog.ui.metacard.EntityTooLargeException;
import org.codice.ddf.catalog.ui.security.UserApplication;
import org.codice.ddf.catalog.ui.util.EndpointUtil;
import org.codice.ddf.catalog.ui.util.UserUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import spark.servlet.SparkApplication;

public class AssetsApplication implements SparkApplication {

  private static final Logger LOGGER = LoggerFactory.getLogger(AssetsApplication.class);

  private final EndpointUtil util;

  private final UserUtil userUtil;

  private static String homePage;

  private static String versionHash;

  private static void extractVersionHash() {
    int startIndex = homePage.indexOf("styles.") + 7;
    int endIndex = homePage.indexOf(".css");
    versionHash = homePage.substring(startIndex, endIndex);
  }

  static {
    try {
      homePage =
          IOUtils.toString(
              UserApplication.class.getResourceAsStream("/static/home.html"),
              Charset.defaultCharset());
      extractVersionHash();
    } catch (IOException e) {
      throw new RuntimeException();
    }
  }

  public AssetsApplication(EndpointUtil util, UserUtil userUtil) throws LessException {
    this.util = util;
    this.userUtil = userUtil;
  }

  @Override
  public void init() {
    get(
        "/",
        (req, res) -> {
          res.type("text/html");
          String themeKey = userUtil.getThemeKey();
          String theme = userUtil.getBaseUserTheme();
          if (theme.equals("")) {
            /*
             This will only happen for user themes that are different from anything the admin has setup.  Since we
             currently don't precompile or cache these anywhere server side, this will ensure the browser can cache
             a blank filler for the request and not block important client side rendering.
            */
            return homePage.replace("baseTheme", "custom/blank");
          }
          return homePage.replace("baseTheme", themeKey + "?" + versionHash);
        });

    exception(EntityTooLargeException.class, util::handleEntityTooLargeException);

    exception(IOException.class, util::handleIOException);

    exception(RuntimeException.class, util::handleRuntimeException);
  }
}

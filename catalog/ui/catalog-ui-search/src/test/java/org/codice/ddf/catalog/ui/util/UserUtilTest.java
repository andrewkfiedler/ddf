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
package org.codice.ddf.catalog.ui.util;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

import com.google.common.collect.Maps;
import java.util.Map;
import org.codice.ddf.catalog.ui.config.ConfigurationApplication;
import org.codice.ddf.persistence.PersistentStore;
import org.junit.After;
import org.junit.BeforeClass;
import org.junit.Test;

public class UserUtilTest {

  static UserUtil userUtil;
  static ConfigurationApplication configurationApplication;
  static Map<String, Object> preferences = Maps.newHashMap();
  static Map<String, Object> subjectAttributes = Maps.newHashMap();
  static Map<String, Object> theme = Maps.newHashMap();
  static String defaultCustomPrimaryColor;
  static String defaultTheme;

  @BeforeClass
  public static void setUp() throws Exception {
    // mocks

    configurationApplication = new ConfigurationApplication();
    PersistentStore persistentStoreMock = mock(PersistentStore.class);

    // constructor
    userUtil = spy(new UserUtil(persistentStoreMock, configurationApplication));
    subjectAttributes.put("preferences", preferences);
    doReturn(subjectAttributes).when(userUtil).getSubjectAttributes();

    defaultCustomPrimaryColor = configurationApplication.getCustomPrimaryColor();
    defaultTheme = configurationApplication.getTheme();
  }

  @After
  public void cleanUp() throws Exception {
    configurationApplication.setTheme(defaultTheme);
    configurationApplication.setCustomPrimaryColor(defaultCustomPrimaryColor);
    theme.keySet().removeAll(theme.keySet());
    preferences.remove("theme");
  }

  @Test
  public void testAdminThemeKey() throws Exception {
    configurationApplication.setTheme("sea");
    String themeKey = userUtil.getThemeKey();
    assertThat(themeKey, is("sea"));
  }

  @Test
  public void testAdminCustomThemeKey() throws Exception {
    configurationApplication.setTheme("custom");
    configurationApplication.setCustomPrimaryColor("#3c6dd5");
    String themeKey = userUtil.getThemeKey();
    assertThat(themeKey, is(not(equalTo("custom"))));
  }

  @Test
  public void testAdminCustomThemeKeyUpdated() throws Exception {
    configurationApplication.setTheme("custom");
    String initialThemeKey = userUtil.getThemeKey();
    configurationApplication.setCustomPrimaryColor("#ffffff");
    String modifiedThemeKey = userUtil.getThemeKey();
    assertThat(initialThemeKey, is(not(equalTo(modifiedThemeKey))));
  }

  @Test
  public void testUserThemeKey() throws Exception {
    theme.put("theme", "sea");
    preferences.put("theme", theme);
    String themeKey = userUtil.getThemeKey();
    assertThat(themeKey, is("sea"));
  }

  @Test
  public void testUserThemeCustomKey() throws Exception {
    theme.put("theme", "custom");
    preferences.put("theme", theme);
    String themeKey = userUtil.getThemeKey();
    assertThat(themeKey, is(not(equalTo("custom"))));
  }

  @Test
  public void adminThemeSeaCached() throws Exception {
    configurationApplication.setTheme("sea");
    String compiledCss = userUtil.getBaseUserTheme();
    assertThat(compiledCss, is(not(equalTo(""))));
  }

  @Test
  public void adminThemeDarkCached() throws Exception {
    configurationApplication.setTheme("dark");
    String compiledCss = userUtil.getBaseUserTheme();
    assertThat(compiledCss, is(not(equalTo(""))));
  }

  @Test
  public void adminThemeLightCached() throws Exception {
    configurationApplication.setTheme("light");
    String compiledCss = userUtil.getBaseUserTheme();
    assertThat(compiledCss, is(not(equalTo(""))));
  }

  @Test
  public void adminThemeCustomCached() throws Exception {
    configurationApplication.setTheme("custom");
    String compiledCss = userUtil.getBaseUserTheme();
    assertThat(compiledCss, is(not(equalTo(""))));
  }

  @Test
  public void userThemeDarkCached() throws Exception {
    theme.put("theme", "sea");
    preferences.put("theme", theme);
    String compiledCss = userUtil.getBaseUserTheme();
    assertThat(compiledCss, is(not(equalTo(""))));
  }

  @Test
  public void userThemeLightCached() throws Exception {
    theme.put("theme", "sea");
    preferences.put("theme", theme);
    String compiledCss = userUtil.getBaseUserTheme();
    assertThat(compiledCss, is(not(equalTo(""))));
  }

  @Test
  public void userThemeSeaCached() throws Exception {
    theme.put("theme", "sea");
    preferences.put("theme", theme);
    String compiledCss = userUtil.getBaseUserTheme();
    assertThat(compiledCss, is(not(equalTo(""))));
  }

  @Test
  public void userThemeCustomCached() throws Exception {
    preferences.put("theme", configurationApplication.getConfig());
    ((Map) preferences.get("theme")).put("theme", "custom");
    String compiledCss = userUtil.getBaseUserTheme();
    assertThat(compiledCss, is(not(equalTo(""))));
  }

  @Test
  public void userThemeCustomUncached() throws Exception {
    theme.put("theme", "custom");
    preferences.put("theme", configurationApplication.getConfig());
    ((Map) preferences.get("theme")).put("customPrimaryColor", "blue");
    ((Map) preferences.get("theme")).put("theme", "custom");
    String compiledCss = userUtil.getBaseUserTheme();
    assertThat(compiledCss, is(""));
  }

  @Test
  public void updateAdminConfig() throws Exception {
    configurationApplication.setCustomPrimaryColor("#ffffff");
    userUtil.updateAdminConfig(configurationApplication.getConfig());
    preferences.put("theme", configurationApplication.getConfig());
    String compiledCss = userUtil.getBaseUserTheme();
    assertThat(compiledCss, is(not(equalTo(""))));
  }
}

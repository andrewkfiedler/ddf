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

import com.asual.lesscss.LessEngine;
import com.asual.lesscss.LessException;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.collect.ImmutableMap;
import ddf.security.Subject;
import ddf.security.SubjectUtils;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.shiro.SecurityUtils;
import org.boon.json.JsonFactory;
import org.codice.ddf.catalog.ui.config.ConfigurationApplication;
import org.codice.ddf.catalog.ui.security.Constants;
import org.codice.ddf.persistence.PersistenceException;
import org.codice.ddf.persistence.PersistentItem;
import org.codice.ddf.persistence.PersistentStore;
import org.codice.ddf.persistence.PersistentStore.PersistenceType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserUtil {

  private static final Logger LOGGER = LoggerFactory.getLogger(UserUtil.class);

  private final PersistentStore persistentStore;

  private final ConfigurationApplication configuration;

  private static String uncompiledLess;

  private static final Pattern HEX_PATTERN = Pattern.compile("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");

  protected Cache<String, String> themeCache =
      CacheBuilder.newBuilder().maximumSize(4096).initialCapacity(64).build();

  private static final List<String> PREDEFINED_THEMES =
      new ArrayList<>(Arrays.asList("dark", "sea", "light"));

  static {
    try {
      uncompiledLess =
          IOUtils.toString(
              UserUtil.class.getResourceAsStream("/static/styles/uncompiledLess.less"),
              Charset.defaultCharset());
    } catch (IOException e) {
      throw new RuntimeException();
    }
  }

  public UserUtil(PersistentStore persistentStore, ConfigurationApplication configuration)
      throws LessException {
    this.persistentStore = persistentStore;
    this.configuration = configuration;
    primeCache();
  }

  private Map<String, String> getMapOfStrings(Map<String, Object> originalMap) {
    Map<String, String> stringOnlyMap = new HashMap<>();
    for (Map.Entry<String, Object> entry : originalMap.entrySet()) {
      if (entry.getValue() instanceof String) {
        stringOnlyMap.put(entry.getKey(), (String) entry.getValue());
      }
    }
    return stringOnlyMap;
  }

  public void updateAdminConfig(Map<String, Object> updatedProperties) throws LessException {
    cacheAdminTheme(getMapOfStrings(updatedProperties));
  }

  private void cachePredefinedThemes() throws LessException {
    for (String theme : PREDEFINED_THEMES) {
      ArrayList<ImmutablePair<String, String>> predefinedTheme = new ArrayList<>();
      predefinedTheme.add(new ImmutablePair<>("theme", theme));
      cacheTheme(predefinedTheme);
    }
  }

  private void cacheCustomTheme() throws LessException {
    ArrayList<ImmutablePair<String, String>> customTheme = getThemeFromAdmin();
    customTheme.remove(0);
    customTheme.add(0, new ImmutablePair<>("theme", "custom"));
    cacheTheme(customTheme);
  }

  private void primeCache() throws LessException {
    cachePredefinedThemes();
    cacheCustomTheme();
  }

  private String getValidColor(final String hexColorCode) {
    if (hexColorCode == null) {
      return "white";
    }
    Matcher matcher = HEX_PATTERN.matcher(hexColorCode);
    return matcher.matches() ? hexColorCode : "white";
  }

  private ArrayList<ImmutablePair<String, String>> getThemeFromAdmin() {
    ArrayList<ImmutablePair<String, String>> theme = new ArrayList<>();
    theme.add(new ImmutablePair("theme", configuration.getTheme()));
    theme.add(
        new ImmutablePair(
            "customPrimaryColor", getValidColor(configuration.getCustomPrimaryColor())));
    theme.add(
        new ImmutablePair(
            "customPositiveColor", getValidColor(configuration.getCustomPositiveColor())));
    theme.add(
        new ImmutablePair(
            "customNegativeColor", getValidColor(configuration.getCustomNegativeColor())));
    theme.add(
        new ImmutablePair(
            "customWarningColor", getValidColor(configuration.getCustomWarningColor())));
    theme.add(
        new ImmutablePair(
            "customFavoriteColor", getValidColor(configuration.getCustomFavoriteColor())));
    theme.add(
        new ImmutablePair(
            "customBackgroundNavigation",
            getValidColor(configuration.getCustomBackgroundNavigation())));
    theme.add(
        new ImmutablePair(
            "customBackgroundAccentContent",
            getValidColor(configuration.getCustomBackgroundAccentContent())));
    theme.add(
        new ImmutablePair(
            "customBackgroundDropdown",
            getValidColor(configuration.getCustomBackgroundDropdown())));
    theme.add(
        new ImmutablePair(
            "customBackgroundContent", getValidColor(configuration.getCustomBackgroundContent())));
    theme.add(
        new ImmutablePair(
            "customBackgroundModal", getValidColor(configuration.getCustomBackgroundModal())));
    theme.add(
        new ImmutablePair(
            "customBackgroundSlideout",
            getValidColor(configuration.getCustomBackgroundSlideout())));
    return theme;
  }

  private ArrayList<ImmutablePair<String, String>> getThemeFromMap(Map<String, String> themeMap) {
    ArrayList<ImmutablePair<String, String>> theme = new ArrayList<>();
    theme.add(new ImmutablePair("theme", themeMap.get("theme")));
    theme.add(
        new ImmutablePair("customPrimaryColor", getValidColor(themeMap.get("customPrimaryColor"))));
    theme.add(
        new ImmutablePair(
            "customPositiveColor", getValidColor(themeMap.get("customPositiveColor"))));
    theme.add(
        new ImmutablePair(
            "customNegativeColor", getValidColor(themeMap.get("customNegativeColor"))));
    theme.add(
        new ImmutablePair("customWarningColor", getValidColor(themeMap.get("customWarningColor"))));
    theme.add(
        new ImmutablePair(
            "customFavoriteColor", getValidColor(themeMap.get("customFavoriteColor"))));
    theme.add(
        new ImmutablePair(
            "customBackgroundNavigation",
            getValidColor(themeMap.get("customBackgroundNavigation"))));
    theme.add(
        new ImmutablePair(
            "customBackgroundAccentContent",
            getValidColor(themeMap.get("customBackgroundAccentContent"))));
    theme.add(
        new ImmutablePair(
            "customBackgroundDropdown", getValidColor(themeMap.get("customBackgroundDropdown"))));
    theme.add(
        new ImmutablePair(
            "customBackgroundContent", getValidColor(themeMap.get("customBackgroundContent"))));
    theme.add(
        new ImmutablePair(
            "customBackgroundModal", getValidColor(themeMap.get("customBackgroundModal"))));
    theme.add(
        new ImmutablePair(
            "customBackgroundSlideout", getValidColor(themeMap.get("customBackgroundSlideout"))));
    return theme;
  }

  private ArrayList<ImmutablePair<String, String>> getThemeFromPreferences() {
    Map preferences = (Map) getSubjectAttributes().get("preferences");
    Map<String, String> theme = (Map<String, String>) preferences.get("theme");
    if (theme != null) {
      return getThemeFromMap(theme);
    } else {
      return getThemeFromAdmin();
    }
  }

  public String getThemeKey() {
    return getThemeKey(getThemeFromPreferences());
  }

  private String getThemeKey(ArrayList<ImmutablePair<String, String>> theme) {
    String themeName = theme.get(0).getRight();
    if (themeName.equals("custom")) {
      return theme.toString();
    } else {
      return themeName;
    }
  }

  private String cacheTheme(ArrayList<ImmutablePair<String, String>> theme) throws LessException {
    String customLess = uncompiledLess;
    String themeKey = getThemeKey(theme);
    String existingCompiledCss = themeCache.getIfPresent(themeKey);
    if (existingCompiledCss != null) {
      return existingCompiledCss;
    }
    for (ImmutablePair<String, String> themePair : theme) {
      customLess =
          customLess.replaceAll(
              "@" + themePair.getLeft() + "(.*:[^;]*)",
              "@" + themePair.getLeft() + ": " + themePair.getRight());
    }
    LessEngine compiler = new LessEngine();
    String compiledCss = compiler.compile(customLess, null, true);
    themeCache.put(themeKey, compiledCss);
    return compiledCss;
  }

  private void cacheAdminTheme(Map<String, String> theme) throws LessException {
    cacheTheme(getThemeFromMap(theme));
  }

  public String getBaseUserTheme() {
    ArrayList<ImmutablePair<String, String>> theme = getThemeFromPreferences();
    String cachedBaseTheme = themeCache.getIfPresent(getThemeKey(theme));
    if (cachedBaseTheme != null) {
      return cachedBaseTheme;
    } else {
      return "";
    }
  }

  public void setUserPreferences(Subject subject, Map<String, Object> preferences) {
    String json = JsonFactory.create().toJson(preferences);

    LOGGER.trace("preferences JSON text:\n {}", json);

    String username = SubjectUtils.getName(subject);
    PersistentItem item = new PersistentItem();
    item.addIdProperty(username);
    item.addProperty("user", username);
    item.addProperty(
        "preferences_json",
        "_bin",
        Base64.getEncoder().encodeToString(json.getBytes(Charset.defaultCharset())));

    try {
      persistentStore.add(PersistenceType.PREFERENCES_TYPE.toString(), item);
    } catch (PersistenceException e) {
      LOGGER.info(
          "PersistenceException while trying to persist preferences for user {}", username, e);
    }
  }

  private Set<String> getSubjectRoles(Subject subject) {
    return new TreeSet<>(SubjectUtils.getAttribute(subject, Constants.ROLES_CLAIM_URI));
  }

  private Map getSubjectPreferences(Subject subject) {
    String username = SubjectUtils.getName(subject);

    try {
      String filter = String.format("user = '%s'", username);
      List<Map<String, Object>> preferencesList =
          persistentStore.get(PersistenceType.PREFERENCES_TYPE.toString(), filter);
      if (preferencesList.size() == 1) {
        byte[] json = (byte[]) preferencesList.get(0).get("preferences_json_bin");

        return JsonFactory.create().parser().parseMap(new String(json, Charset.defaultCharset()));
      }
    } catch (PersistenceException e) {
      LOGGER.info(
          "PersistenceException while trying to retrieve persisted preferences for user {}",
          username,
          e);
    }

    return Collections.emptyMap();
  }

  public Map<String, Object> getSubjectAttributes() {
    Subject subject = (Subject) SecurityUtils.getSubject();
    // @formatter:off
    Map<String, Object> required =
        ImmutableMap.of(
            "username", SubjectUtils.getName(subject),
            "isGuest", subject.isGuest(),
            "roles", getSubjectRoles(subject),
            "preferences", getSubjectPreferences(subject));
    // @formatter:on

    String email = SubjectUtils.getEmailAddress(subject);

    if (StringUtils.isEmpty(email)) {
      return required;
    }

    return ImmutableMap.<String, Object>builder().putAll(required).put("email", email).build();
  }
}

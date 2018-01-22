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
package org.codice.ddf.catalog.ui.metacard.workspace;

import ddf.catalog.data.Attribute;
import ddf.catalog.data.Metacard;
import ddf.catalog.data.impl.MetacardImpl;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ListMetacardImpl extends MetacardImpl {
  private static final ListMetacardTypeImpl TYPE = new ListMetacardTypeImpl();

  public ListMetacardImpl() {
    super(TYPE);
    setTags(Collections.singleton(ListMetacardTypeImpl.LIST_TAG));
  }

  public ListMetacardImpl(String title) {
    this();
    setTitle(title);
  }

  public ListMetacardImpl(Metacard wrappedMetacard) {
    super(wrappedMetacard, TYPE);
    setTags(Collections.singleton(ListMetacardTypeImpl.LIST_TAG));
  }

  public static ListMetacardImpl from(Metacard metacard) {
    return new ListMetacardImpl(metacard);
  }

  /**
   * Get a list of the types.
   *
   * @return list of type (always non-null)
   */
  public List<String> getTypes() {
    Attribute attribute = getAttribute(ListMetacardTypeImpl.LIST_LIMITING_ATTRIBUTE_VALUES);
    if (attribute == null) {
      return Collections.emptyList();
    }
    return attribute
        .getValues()
        .stream()
        .filter(String.class::isInstance)
        .map(String.class::cast)
        .collect(Collectors.toList());
  }

  public void setTypes(List<String> types) {
    setAttribute(ListMetacardTypeImpl.LIST_LIMITING_ATTRIBUTE_VALUES, new ArrayList<>(types));
  }

  /**
   * Get a list of the content.
   *
   * @return list of content (always non-null)
   */
  public List<String> getMetacards() {
    Attribute attribute = getAttribute(ListMetacardTypeImpl.LIST_BOOKMARKS);
    if (attribute == null) {
      return Collections.emptyList();
    }
    return attribute
        .getValues()
        .stream()
        .filter(String.class::isInstance)
        .map(String.class::cast)
        .collect(Collectors.toList());
  }

  public void setMetacards(List<String> metacards) {
    setAttribute(ListMetacardTypeImpl.LIST_BOOKMARKS, new ArrayList<>(metacards));
  }
}

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

import ddf.catalog.data.AttributeDescriptor;
import ddf.catalog.data.Metacard;
import ddf.catalog.data.impl.AttributeDescriptorImpl;
import ddf.catalog.data.impl.BasicTypes;
import ddf.catalog.data.impl.MetacardTypeImpl;
import java.util.HashSet;
import java.util.Set;

public class ListMetacardTypeImpl extends MetacardTypeImpl {

  public static final String LIST_TAG = "list";

  public static final String LIST_METACARD_TYPE_NAME = "metacard.list";

  public static final String LIST_LIMITING_ATTRIBUTE = "limitingAttribute";

  public static final String LIST_LIMITING_ATTRIBUTE_VALUES = "limitingAttributeValues";

  public static final String LIST_ICON = "icon";

  public static final String LIST_BOOKMARKS = "bookmarks";

  private static final Set<AttributeDescriptor> DESCRIPTORS;

  static {
    DESCRIPTORS = new HashSet<>();

    DESCRIPTORS.add(
        new AttributeDescriptorImpl(
            Metacard.ID,
            true /* indexed */,
            true /* stored */,
            false /* tokenized */,
            false /* multivalued */,
            BasicTypes.STRING_TYPE));

    DESCRIPTORS.add(
        new AttributeDescriptorImpl(
            Metacard.TITLE,
            true /* indexed */,
            true /* stored */,
            false /* tokenized */,
            false /* multivalued */,
            BasicTypes.STRING_TYPE));

    DESCRIPTORS.add(
        new AttributeDescriptorImpl(
            LIST_LIMITING_ATTRIBUTE,
            false /* indexed */,
            true /* stored */,
            false /* tokenized */,
            false /* multivalued */,
            BasicTypes.STRING_TYPE));

    DESCRIPTORS.add(
        new AttributeDescriptorImpl(
            LIST_LIMITING_ATTRIBUTE_VALUES,
            false /* indexed */,
            true /* stored */,
            false /* tokenized */,
            true /* multivalued */,
            BasicTypes.STRING_TYPE));

    DESCRIPTORS.add(
        new AttributeDescriptorImpl(
            LIST_ICON,
            false /* indexed */,
            true /* stored */,
            false /* tokenized */,
            false /* multivalued */,
            BasicTypes.STRING_TYPE));

    DESCRIPTORS.add(
        new AttributeDescriptorImpl(
            LIST_BOOKMARKS,
            false /* indexed */,
            true /* stored */,
            false /* tokenized */,
            true /* multivalued */,
            BasicTypes.STRING_TYPE));
  }

  public ListMetacardTypeImpl() {
    this(LIST_METACARD_TYPE_NAME, DESCRIPTORS);
  }

  public ListMetacardTypeImpl(String name, Set<AttributeDescriptor> descriptors) {
    super(name, descriptors);
  }
}

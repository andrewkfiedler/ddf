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
package org.codice.ddf.admin.insecure.defaults.service;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.codice.ddf.admin.insecure.defaults.service.Alert.Level;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ddf.security.PropertiesLoader;

public abstract class PropertiesFileValidator implements Validator {

    protected static final String GENERIC_INSECURE_DEFAULTS_MSG = "Unable to determine if [%s] is using insecure defaults. ";

    private static final Logger LOGGER = LoggerFactory.getLogger(PropertiesFileValidator.class);

    protected Path path;

    protected List<Alert> alerts;

    public PropertiesFileValidator() {
        alerts = new ArrayList<>();
    }

    public void setPath(Path path) {
        this.path = path;
    }

    public abstract List<Alert> validate();

    protected Properties readFile() {

        Properties properties = PropertiesLoader.loadProperties(path.toString());
        if (properties.isEmpty()) {
            String msg = String.format(GENERIC_INSECURE_DEFAULTS_MSG, path.toString());
            LOGGER.warn(msg);
            alerts.add(new Alert(Level.WARN, msg));
        }

        return properties;
    }

    protected void resetAlerts() {
        alerts = new ArrayList<>();
    }

}

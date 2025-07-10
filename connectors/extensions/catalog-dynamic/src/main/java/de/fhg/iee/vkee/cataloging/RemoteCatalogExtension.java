package de.fhg.iee.vkee.cataloging;

import org.eclipse.edc.crawler.spi.TargetNodeDirectory;
import org.eclipse.edc.runtime.metamodel.annotation.Inject;
import org.eclipse.edc.runtime.metamodel.annotation.Provider;
import org.eclipse.edc.runtime.metamodel.annotation.Setting;
import org.eclipse.edc.spi.EdcException;
import org.eclipse.edc.spi.monitor.Monitor;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;
import org.eclipse.edc.spi.types.TypeManager;

import java.net.MalformedURLException;
import java.net.URL;

import static java.lang.String.format;
import static java.util.Optional.ofNullable;

public class RemoteCatalogExtension implements ServiceExtension {

    @Setting
    private static final String FCC_DIRECTORY_URL = "fcc.directory.url";

    @Inject
    private TypeManager typeManager;


    @Provider
    public TargetNodeDirectory targetNodeDirectory(ServiceExtensionContext context) {

        final Monitor monitor = context.getMonitor();
        monitor.info("RemoteCatalogExtension - federatedCacheNodeDirectory");

        var urlSetting = ofNullable(context.getSetting(FCC_DIRECTORY_URL, null))
                .orElseThrow(() -> new EdcException(
                                format("Config property [%s] not found, will ABORT!", FCC_DIRECTORY_URL)
                        )
                );

        try {
            URL url = new URL(urlSetting);
            return new RemoteTargetNodeDirectory(url, typeManager.getMapper());

        } catch (MalformedURLException e) {
            throw new EdcException("Invalid URL: " + urlSetting, e);
        }


    }

}

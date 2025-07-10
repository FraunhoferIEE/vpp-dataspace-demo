plugins {
    `java-library`
}

dependencies {
    api(libs.edc.federated.catalog.spi)
    api(libs.edc.crawler.spi)
    api(libs.edc.util)
}

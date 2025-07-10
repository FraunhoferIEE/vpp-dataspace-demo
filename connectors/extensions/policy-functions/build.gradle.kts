plugins {
    `java-library`
}

dependencies {
    api(libs.edc.spi.policy.engine)
    api(libs.edc.spi.contract)
    api(libs.edc.json.ld.spi)

    // api(libs.edc.data.plane.spi)
    // implementation(libs.edc.control.plane.core)
}

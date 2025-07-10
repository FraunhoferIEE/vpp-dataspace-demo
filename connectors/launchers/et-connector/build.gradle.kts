plugins {
    `java-library`
    id("application")
    alias(libs.plugins.shadow)
}

repositories {
    mavenCentral()
}

dependencies {

    // ADDS FCC CAPABILITIES
    runtimeOnly(project(":extensions:catalog-dynamic"))

    // federated catalog api
    runtimeOnly(libs.edc.federated.catalog.core)
    runtimeOnly(libs.edc.federated.catalog.api)


    // extension that adds policy to restrict offers to certain counterparties
    runtimeOnly(project(":extensions:policy-functions"))

    // control plane
    runtimeOnly(libs.edc.control.plane.api.client)
    runtimeOnly(libs.edc.control.plane.api)
    runtimeOnly(libs.edc.control.plane.core)

    // data space protocol
    runtimeOnly(libs.edc.dsp)

    // extensions that allows picking up configurations from the file system
    runtimeOnly(libs.edc.configuration.filesystem)

    // filesystem based vault to store secrets. needed for http pull
    runtimeOnly(libs.edc.vault.filesystem)

    // to mock the IAM
    runtimeOnly(libs.edc.iam.mock)

    // management api
    runtimeOnly(libs.edc.management.api)

    // extension that allows to configure EDR receiver endpoint dynamically
    runtimeOnly(libs.edc.transfer.data.plane)
    runtimeOnly(libs.edc.transfer.pull.http.dynamic.receiver)

    // data plane selector
    runtimeOnly(libs.edc.data.plane.selector.api)
    runtimeOnly(libs.edc.data.plane.selector.core)

    // data plane
    runtimeOnly(libs.edc.data.plane.control.api)
    runtimeOnly(libs.edc.data.plane.public.api)
    runtimeOnly(libs.edc.data.plane.core)
    runtimeOnly(libs.edc.data.plane.http)

    // add health checks
    runtimeOnly(libs.edc.api.observability)

}

application {
    mainClass.set("org.eclipse.edc.boot.system.runtime.BaseRuntime")
}

var distTar = tasks.getByName("distTar")
var distZip = tasks.getByName("distZip")

// build connector as a single jar that will be available in `build/libs/connector.jar`
tasks.withType<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar> {
    mergeServiceFiles()
    archiveFileName.set("connector.jar")
    dependsOn(distTar, distZip)
}

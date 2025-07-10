rootProject.name = "connectors"

pluginManagement {
    repositories {
        mavenLocal()
        maven {
            url = uri("https://oss.sonatype.org/content/repositories/snapshots/")
        }
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositories {
        mavenLocal()
        maven {
            url = uri("https://oss.sonatype.org/content/repositories/snapshots/")
        }
        mavenCentral()
    }
}

include(":extensions:catalog-file-based")
include(":extensions:catalog-dynamic")
include(":extensions:policy-functions")

include(":launchers:fc-broker")
include(":launchers:generic-connector")
include(":launchers:et-connector")
include(":launchers:der-connector")


plugins {
    `java-library`
}

repositories {
    mavenCentral()
}

allprojects {

    // EdcRuntimeExtension uses this to determine the runtime classpath of the module to run.
    tasks.register("printClasspath") {
        doLast {
            println(sourceSets["main"].runtimeClasspath.asPath)
        }
    }
}

tasks.test {
    useJUnitPlatform()
}
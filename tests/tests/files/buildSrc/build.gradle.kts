plugins {
    `kotlin-dsl`
}

repositories {
    mavenCentral()
}

dependencies {
    compileOnly("org.scip-code:scip-kotlin-analysis:0.14.2")
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:2.4.21")
}

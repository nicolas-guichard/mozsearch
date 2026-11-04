import java.nio.file.Paths
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.scip_code.scip_java.kotlin_analysis.KotlinAnalysisIndexer

interface ScipKotlinAnalysisParameters : WorkParameters {
    val sourceroot: Property<String>
    val destinationDirectory: DirectoryProperty
    val libraries: ConfigurableFileCollection
    val sources: ConfigurableFileCollection
}

abstract class ScipKotlinAnalysisAction : WorkAction<ScipKotlinAnalysisParameters> {
    override fun execute() {
        KotlinAnalysisIndexer(
            sourceroot = Paths.get(parameters.sourceroot.get()),
            targetroot = parameters.destinationDirectory.get().getAsFile().toPath(),
            sourceRoots = parameters.sources.map { it.toPath() },
            classpath = parameters.libraries.map { it.toPath() },
        ).run()
    }
}

abstract class ScipKotlinAnalysisTask : DefaultTask() {
    @get:Inject
    abstract val executor: WorkerExecutor

    @get:Classpath
    abstract val analysisClasspath: ConfigurableFileCollection

    @get:Input
    abstract val sourceroot: Property<String>

    @get:OutputDirectory
    abstract val destinationDirectory: DirectoryProperty

    @get:CompileClasspath
    abstract val libraries: ConfigurableFileCollection

    @get:InputFiles
    @get:PathSensitive(PathSensitivity.RELATIVE)
    abstract val sources: ConfigurableFileCollection

    @TaskAction
    fun run() {
        val task = this

        executor.processIsolation {
            classpath.from(analysisClasspath)
        }.submit(ScipKotlinAnalysisAction::class.java) {
            sourceroot.set(task.sourceroot)
            destinationDirectory.set(task.destinationDirectory)
            libraries.from(task.libraries)
            sources.from(task.sources)
        }
    }
}

var topsrcdir = rootProject.projectDir.getCanonicalPath()
var targetdir = rootProject.layout.buildDirectory.file("scip-targetroot").get()

val scipJavacConfig = project.configurations.register("scipJavac")
val scipKotlinAnalysisConfig = project.configurations.register("scipKotlinAnalysis")
dependencies {
    scipJavacConfig("org.scip-code:scip-javac:0.14.2")
    scipKotlinAnalysisConfig("org.scip-code:scip-kotlin-analysis:0.14.2")
}

fun JavaCompile.getScipTargetDir(): Provider<Directory> = project.layout.buildDirectory.dir("scip/${name}")

val collectJavaScip = project.tasks.register("collectJavaScip", Copy::class.java) {
    from(project.tasks.withType(JavaCompile::class.java).map { it.getScipTargetDir() })
    into(targetdir)
    duplicatesStrategy = DuplicatesStrategy.INCLUDE
}

project.tasks.withType(JavaCompile::class.java).configureEach {
    val pluginClasspath = project.files(scipJavacConfig)
    inputs.files(pluginClasspath).withNormalizer(ClasspathNormalizer::class.java)

    val scipTargetDir = getScipTargetDir()
    outputs.dir(scipTargetDir)

    doFirst {
        classpath += pluginClasspath
        options.compilerArgs.add("-Xplugin:scip -sourceroot:${topsrcdir} -targetroot:${scipTargetDir.get()}")
    }

    finalizedBy(collectJavaScip)
}

val collectKotlinScipTask = project.tasks.register("collectKotlinScip", Copy::class.java) {
    from(project.tasks.withType(ScipKotlinAnalysisTask::class.java).map { it.destinationDirectory.get().getAsFile().toPath() })
    into(targetdir)
    duplicatesStrategy = DuplicatesStrategy.INCLUDE
}

project.tasks.withType(KotlinCompile::class.java) {
    val compileTask = this

    val scipTask = tasks.register("${name}Scip", ScipKotlinAnalysisTask::class.java) {
        analysisClasspath.from(scipKotlinAnalysisConfig)

        sourceroot.set(topsrcdir)
        destinationDirectory.set(project.layout.buildDirectory.dir("scip/${compileTask.name}"))
        libraries.from(compileTask.libraries)
        sources.from(compileTask.sources + compileTask.javaSources)

        finalizedBy(collectKotlinScipTask)
    }

    finalizedBy(scipTask)
}

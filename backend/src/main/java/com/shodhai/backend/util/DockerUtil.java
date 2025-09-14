package com.shodhai.backend.util;

import java.io.File;
import java.nio.file.Path;
import java.io.IOException;
import java.nio.file.Files;

public class DockerUtil {

    public static void deleteDirectoryRecursively(File directory) throws IOException {
        if (directory.exists()) {
            Files.walk(directory.toPath())
                    .sorted((p1, p2) -> -p1.compareTo(p2)) // reverse order to delete children first
                    .map(Path::toFile)
                    .forEach(File::delete);
        }
    }
}
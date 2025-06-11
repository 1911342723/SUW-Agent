package org.xhy.infrastructure.storage;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import jakarta.annotation.PostConstruct;

/**
 * 本地存储服务实现
 */
@Service
public class LocalStorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(LocalStorageService.class);

    @Value("${local.storage.base-path:uploads}")
    private String basePath;

    @Value("${local.storage.url-prefix:http://localhost:8080/files}")
    private String urlPrefix;

    @PostConstruct
    public void init() {
        // 确保基础存储目录存在
        try {
            Path baseDir = Paths.get(basePath);
            if (!Files.exists(baseDir)) {
                Files.createDirectories(baseDir);
                logger.info("创建本地存储目录: {}", baseDir);
            }
        } catch (IOException e) {
            logger.error("创建本地存储目录失败", e);
            throw new RuntimeException("创建本地存储目录失败", e);
        }
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public UploadResult uploadFile(File file, String objectKey) {
        return uploadFile(file, objectKey, null);
    }

    @Override
    public UploadResult uploadFile(File file, String objectKey, String bucketName) {
        try {
            // 生成存储路径
            String finalPath = generateStoragePath(objectKey, bucketName);
            Path targetPath = Paths.get(basePath, finalPath);

            // 确保目标目录存在
            Files.createDirectories(targetPath.getParent());

            // 复制文件，如果目标文件存在则替换
            Files.copy(file.toPath(), targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // 生成访问URL
            String accessUrl = generateAccessUrl(finalPath);

            return new UploadResult(
                    UUID.randomUUID().toString(),
                    file.getName(),
                    finalPath,
                    file.length(),
                    getContentType(file.getName()),
                    bucketName,
                    finalPath,
                    accessUrl,
                    null,
                    null);
        } catch (IOException e) {
            logger.error("本地文件上传失败: {}", e.getMessage(), e);
            throw new RuntimeException("本地文件上传失败: " + e.getMessage(), e);
        }
    }

    @Override
    public UploadResult uploadStream(InputStream inputStream, String objectKey, long contentLength) {
        return uploadStream(inputStream, objectKey, contentLength, null);
    }

    @Override
    public UploadResult uploadStream(InputStream inputStream, String objectKey, long contentLength, String bucketName) {
        try {
            // 生成存储路径
            String finalPath = generateStoragePath(objectKey, bucketName);
            Path targetPath = Paths.get(basePath, finalPath);

            // 确保目标目录存在
            Files.createDirectories(targetPath.getParent());

            // 写入文件
            try (FileOutputStream fos = new FileOutputStream(targetPath.toFile())) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    fos.write(buffer, 0, bytesRead);
                }
            }

            // 生成访问URL
            String accessUrl = generateAccessUrl(finalPath);

            return new UploadResult(
                    UUID.randomUUID().toString(),
                    extractFileName(objectKey),
                    finalPath,
                    contentLength,
                    getContentType(objectKey),
                    bucketName,
                    finalPath,
                    accessUrl,
                    null,
                    null);
        } catch (IOException e) {
            logger.error("本地文件上传失败", e);
            throw new RuntimeException("本地文件上传失败", e);
        }
    }

    @Override
    public boolean deleteFile(String objectKey) {
        return deleteFile(objectKey, null);
    }

    @Override
    public boolean deleteFile(String objectKey, String bucketName) {
        try {
            String finalPath = generateStoragePath(objectKey, bucketName);
            Path targetPath = Paths.get(basePath, finalPath);
            return Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            logger.error("本地文件删除失败", e);
            return false;
        }
    }

    @Override
    public boolean fileExists(String objectKey) {
        return fileExists(objectKey, null);
    }

    @Override
    public boolean fileExists(String objectKey, String bucketName) {
        String finalPath = generateStoragePath(objectKey, bucketName);
        Path targetPath = Paths.get(basePath, finalPath);
        return Files.exists(targetPath);
    }

    @Override
    public String generateObjectKey(String originalFileName, String folder) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomStr = UUID.randomUUID().toString().substring(0, 8);
        String extension = getFileExtension(originalFileName);
        return String.format("%s/%s_%s%s", folder, timestamp, randomStr, extension);
    }

    /**
     * 生成存储路径
     */
    private String generateStoragePath(String objectKey, String bucketName) {
        // 生成日期路径
        String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));

        // 生成唯一文件名
        String fileName = objectKey;
        if (!StringUtils.hasText(fileName)) {
            String extension = "";
            int lastDotIndex = objectKey.lastIndexOf('.');
            if (lastDotIndex > 0) {
                extension = objectKey.substring(lastDotIndex);
            }
            fileName = UUID.randomUUID().toString() + extension;
        }

        // 组合最终路径
        if (StringUtils.hasText(bucketName)) {
            return String.format("%s/%s/%s", bucketName, datePath, fileName);
        } else {
            return String.format("%s/%s", datePath, fileName);
        }
    }

    /**
     * 生成访问URL
     */
    private String generateAccessUrl(String storagePath) {
        return urlPrefix + "/" + storagePath;
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.'));
    }

    /**
     * 从对象键中提取文件名
     */
    private String extractFileName(String objectKey) {
        if (objectKey == null) {
            return null;
        }
        int lastSlashIndex = objectKey.lastIndexOf('/');
        return lastSlashIndex == -1 ? objectKey : objectKey.substring(lastSlashIndex + 1);
    }

    /**
     * 获取文件内容类型
     */
    private String getContentType(String fileName) {
        String extension = getFileExtension(fileName).toLowerCase();
        switch (extension) {
            case ".jpg":
            case ".jpeg":
                return "image/jpeg";
            case ".png":
                return "image/png";
            case ".gif":
                return "image/gif";
            case ".pdf":
                return "application/pdf";
            case ".doc":
                return "application/msword";
            case ".docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default:
                return "application/octet-stream";
        }
    }
}
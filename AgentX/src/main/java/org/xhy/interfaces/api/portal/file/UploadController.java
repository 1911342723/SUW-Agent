package org.xhy.interfaces.api.portal.file;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.xhy.infrastructure.storage.LocalStorageService;
import org.xhy.infrastructure.storage.UploadResult;
import org.xhy.interfaces.api.common.Result;

/**
 * 文件上传控制器
 */
@RestController
@RequestMapping("/upload")
public class UploadController {

    private final LocalStorageService storageService;

    public UploadController(LocalStorageService storageService) {
        this.storageService = storageService;
    }

    /**
     * 文件上传接口
     */
    @PostMapping
    public Result<UploadResult> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // 创建临时文件
            String originalFilename = file.getOriginalFilename();
            File tempFile = File.createTempFile("upload_", "_" + originalFilename);
            file.transferTo(tempFile);

            try {
                // 生成对象键
                String objectKey = storageService.generateObjectKey(originalFilename, "uploads");

                // 上传文件
                UploadResult result = storageService.uploadFile(tempFile, objectKey);

                return Result.success(result);
            } finally {
                // 删除临时文件
                tempFile.delete();
            }
        } catch (IOException e) {
            return Result.serverError("文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 获取上传凭证（兼容前端OSS直传模式）
     */
    @GetMapping("/credential")
    public Result<UploadCredential> getUploadCredential() {
        // 创建一个模拟的上传凭证，实际使用本地存储
        UploadCredential credential = new UploadCredential(
                "/upload", // 上传地址
                "local", // 模拟的AccessKeyId
                "", // Policy（本地存储不需要）
                "", // 签名（本地存储不需要）
                "uploads/", // 对象键前缀
                "/files/", // 访问URL前缀
                null, // 过期时间（本地存储不需要）
                10 * 1024 * 1024 // 最大文件大小（10MB）
        );

        return Result.success(credential);
    }

    /**
     * 上传凭证（兼容前端OSS直传模式）
     */
    public static class UploadCredential {
        private final String uploadUrl;
        private final String accessKeyId;
        private final String policy;
        private final String signature;
        private final String keyPrefix;
        private final String accessUrlPrefix;
        private final java.util.Date expiration;
        private final long maxFileSize;

        public UploadCredential(String uploadUrl, String accessKeyId, String policy, String signature,
                String keyPrefix, String accessUrlPrefix, java.util.Date expiration, long maxFileSize) {
            this.uploadUrl = uploadUrl;
            this.accessKeyId = accessKeyId;
            this.policy = policy;
            this.signature = signature;
            this.keyPrefix = keyPrefix;
            this.accessUrlPrefix = accessUrlPrefix;
            this.expiration = expiration;
            this.maxFileSize = maxFileSize;
        }

        public String getUploadUrl() {
            return uploadUrl;
        }

        public String getAccessKeyId() {
            return accessKeyId;
        }

        public String getPolicy() {
            return policy;
        }

        public String getSignature() {
            return signature;
        }

        public String getKeyPrefix() {
            return keyPrefix;
        }

        public String getAccessUrlPrefix() {
            return accessUrlPrefix;
        }

        public java.util.Date getExpiration() {
            return expiration;
        }

        public long getMaxFileSize() {
            return maxFileSize;
        }
    }
}
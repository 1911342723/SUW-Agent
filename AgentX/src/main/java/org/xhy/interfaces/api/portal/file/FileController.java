package org.xhy.interfaces.api.portal.file;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.xhy.infrastructure.storage.LocalStorageService;
import org.xhy.infrastructure.storage.UploadResult;
import org.xhy.interfaces.api.common.Result;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 文件控制器
 * 处理文件上传和访问
 */
@RestController
@RequestMapping("/files")
public class FileController {

    @Value("${local.storage.base-path:uploads}")
    private String basePath;

    private final LocalStorageService storageService;

    public FileController(LocalStorageService storageService) {
        this.storageService = storageService;
    }

    /**
     * 文件访问接口
     */
    @GetMapping("/**")
    public ResponseEntity<Resource> serveFile(HttpServletRequest request) {
        try {
            // 获取请求路径
            String requestPath = request.getRequestURI();
            String filePath = requestPath.substring("/files/".length());

            // 构建完整的文件路径
            Path path = Paths.get(basePath).resolve(filePath).normalize();
            Resource resource = new UrlResource(path.toUri());

            // 检查文件是否存在且可读
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // 获取文件的MIME类型
            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // 返回文件
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
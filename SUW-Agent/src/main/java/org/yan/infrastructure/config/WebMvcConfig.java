package org.yan.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.yan.infrastructure.auth.UserAuthInterceptor;

/** Web MVC 配置类 用于配置拦截器、跨域等 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final UserAuthInterceptor userAuthInterceptor;

    @Value("${local.storage.base-path:uploads}")
    private String uploadPath;

    public WebMvcConfig(UserAuthInterceptor userAuthInterceptor) {
        this.userAuthInterceptor = userAuthInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userAuthInterceptor)
                .addPathPatterns("/**") // 拦截所有请求
                .excludePathPatterns( // 不拦截以下路径
                        "/login", // 登录接口
                        "/register", // 注册接口
                        "/send-email-code",
                        "/verify-email-code",
                        "/get-captcha",
                        "/reset-password",
                        "/send-reset-password-code",
                        "/oauth/github/authorize",
                        "/oauth/github/callback",
                        "/upload/**" // 文件上传相关接口
                );
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置上传文件的访问路径
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:" + uploadPath + "/")
                .setCachePeriod(3600) // 缓存一小时
                .resourceChain(true); // 开启资源链优化
    }
}
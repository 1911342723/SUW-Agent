// 文件上传服务
import { toast } from '@/hooks/use-toast'
import { httpClient } from '@/lib/http-client'

// OSS上传凭证接口
export interface OssUploadCredential {
  uploadUrl: string
  accessKeyId: string
  policy: string
  signature: string
  keyPrefix: string
  accessUrlPrefix: string
  expiration: string
  maxFileSize: number
}

// 后端响应格式
interface UploadCredentialResponse {
  code: number
  message: string
  data: OssUploadCredential
  timestamp: number
}

// 上传结果
export interface UploadResult {
  url: string
  fileName: string
  fileSize: number
  fileType: string
}

// 上传文件信息
export interface UploadFileInfo {
  file: File
  fileName: string
  fileType: string
  fileSize: number
}

/**
 * 获取OSS上传凭证
 */
export async function getUploadCredential(): Promise<OssUploadCredential> {
  try {
    const response = await httpClient.get<UploadCredentialResponse>('/upload/credential')

    if (response.code !== 200) {
      throw new Error(response.message || '获取上传凭证失败')
    }

    return response.data
  } catch (error) {
    console.error('获取上传凭证失败:', error)
    throw new Error(error instanceof Error ? error.message : '获取上传凭证失败')
  }
}

/**
 * 上传文件到服务器
 */
export async function uploadFileToServer(
  fileInfo: UploadFileInfo,
  credential: OssUploadCredential,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    // 构建FormData
    const formData = new FormData()
    formData.append('file', fileInfo.file)

    // 创建XMLHttpRequest以支持进度回调
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // 进度回调
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress(progress)
          }
        })
      }

      // 完成回调
      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            if (response.code === 200 && response.data) {
              resolve({
                url: response.data.url,
                fileName: fileInfo.fileName,
                fileSize: fileInfo.fileSize,
                fileType: fileInfo.fileType
              })
            } else {
              reject(new Error(response.message || '上传失败'))
            }
          } catch (e) {
            reject(new Error('解析响应失败'))
          }
        } else {
          reject(new Error(`上传失败: HTTP ${xhr.status}`))
        }
      })

      // 错误回调
      xhr.addEventListener('error', () => {
        reject(new Error('网络错误，上传失败'))
      })

      // 超时回调
      xhr.addEventListener('timeout', () => {
        reject(new Error('上传超时'))
      })

      // 设置超时时间（30秒）
      xhr.timeout = 30000

      // 发送请求
      xhr.open('POST', credential.uploadUrl.startsWith('http') ? credential.uploadUrl : httpClient.getBaseUrl() + credential.uploadUrl)
      xhr.send(formData)
    })
  } catch (error) {
    console.error('上传文件失败:', error)
    throw new Error(error instanceof Error ? error.message : '上传文件失败')
  }
}

/**
 * 批量上传文件
 */
export async function uploadMultipleFiles(
  files: UploadFileInfo[],
  onProgress?: (fileIndex: number, progress: number) => void,
  onFileComplete?: (fileIndex: number, result: UploadResult) => void,
  onError?: (fileIndex: number, error: Error) => void
): Promise<UploadResult[]> {
  try {
    // 获取上传凭证
    const credential = await getUploadCredential()

    // 检查文件大小
    const oversizedFiles = files.filter(file => file.fileSize > credential.maxFileSize)
    if (oversizedFiles.length > 0) {
      throw new Error(`以下文件超过大小限制(${credential.maxFileSize / 1024 / 1024}MB): ${oversizedFiles.map(f => f.fileName).join(', ')}`)
    }

    const results: UploadResult[] = []

    // 逐个上传文件
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFileToServer(
          files[i],
          credential,
          (progress) => onProgress?.(i, progress)
        )

        results.push(result)
        onFileComplete?.(i, result)
      } catch (error) {
        const uploadError = error instanceof Error ? error : new Error('上传失败')
        onError?.(i, uploadError)
        throw uploadError
      }
    }

    return results
  } catch (error) {
    console.error('批量上传失败:', error)
    throw error
  }
}

/**
 * 简化的单文件上传接口
 */
export async function uploadSingleFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const fileInfo: UploadFileInfo = {
    file,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size
  }

  try {
    const credential = await getUploadCredential()

    // 检查文件大小
    if (file.size > credential.maxFileSize) {
      throw new Error(`文件大小超过限制(${credential.maxFileSize / 1024 / 1024}MB)`)
    }

    return await uploadFileToServer(fileInfo, credential, onProgress)
  } catch (error) {
    console.error('上传文件失败:', error)
    throw error
  }
} 
// 文件上传服务
import { toast } from '@/hooks/use-toast'
import { httpClient } from '@/lib/http-client'

// 后端上传结果接口
interface ServerUploadResult {
  fileId: string
  originalName: string
  storageName: string
  fileSize: number
  contentType: string
  bucketName: string
  filePath: string
  accessUrl: string
  md5Hash: string
  etag: string
  createdAt: string
}

// 后端响应格式
interface UploadResponse {
  code: number
  message: string
  data: ServerUploadResult
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
 * 上传文件到服务器
 */
export async function uploadFileToServer(
  fileInfo: UploadFileInfo,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    // 构建FormData
    const formData = new FormData()
    formData.append('file', fileInfo.file)

    console.log('开始上传文件:', {
      fileName: fileInfo.fileName,
      fileType: fileInfo.fileType,
      fileSize: fileInfo.fileSize
    })

    // 创建XMLHttpRequest以支持进度回调
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // 进度回调
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            console.log('上传进度:', progress)
            onProgress(progress)
          }
        })
      }

      // 完成回调
      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          try {
            console.log('收到服务器响应:', xhr.responseText)
            const response = JSON.parse(xhr.responseText) as UploadResponse
            console.log('解析后的响应:', response)

            if (response.code === 200 && response.data) {
              if (!response.data.accessUrl) {
                console.error('服务器响应缺少accessUrl字段:', response)
                reject(new Error('服务器响应缺少访问URL'))
                return
              }

              const result = {
                url: response.data.accessUrl,
                fileName: response.data.originalName,
                fileSize: response.data.fileSize,
                fileType: response.data.contentType
              }

              console.log('生成的上传结果:', result)
              resolve(result)
            } else {
              const errorMessage = response.message || '上传失败'
              console.error('服务器返回错误:', errorMessage)
              reject(new Error(errorMessage))
            }
          } catch (e) {
            console.error('解析响应失败:', e)
            console.error('原始响应内容:', xhr.responseText)
            reject(new Error('解析响应失败'))
          }
        } else {
          const errorMessage = `上传失败: HTTP ${xhr.status}`
          console.error(errorMessage)
          console.error('响应内容:', xhr.responseText)
          reject(new Error(errorMessage))
        }
      })

      // 错误回调
      xhr.addEventListener('error', (e) => {
        console.error('网络错误:', e)
        reject(new Error('网络错误，上传失败'))
      })

      // 超时回调
      xhr.addEventListener('timeout', () => {
        console.error('请求超时')
        reject(new Error('上传超时'))
      })

      // 设置超时时间（30秒）
      xhr.timeout = 30000

      // 发送请求
      const uploadUrl = `${httpClient.getBaseUrl()}/upload`
      console.log('上传URL:', uploadUrl)
      xhr.open('POST', uploadUrl)

      // 设置认证头
      const token = localStorage.getItem('auth_token')
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    })
  } catch (error) {
    console.error('上传文件失败:', error)
    throw error
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
    const results: UploadResult[] = []

    // 逐个上传文件
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFileToServer(
          files[i],
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
    return await uploadFileToServer(fileInfo, onProgress)
  } catch (error) {
    console.error('文件上传失败:', error)
    throw error
  }
} 
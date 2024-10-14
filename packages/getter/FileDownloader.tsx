import type { ApiResponse, FileInfo, Headers } from './types'

export class FileDownloader {
  private headerLogined: Headers
  private baseUrl: string
  constructor(headerLogined: Headers, baseUrl?: string) {
    this.headerLogined = headerLogined
    this.baseUrl = baseUrl || 'https://www.123pan.com'
  }

  async link(file: FileInfo): Promise<string | undefined> {
    const downRequestUrl = `${this.baseUrl}/a/api/file/download_info`
    const downRequestData = {
      driveId: 0,
      etag: file.Etag,
      fileId: file.FileId,
      s3keyFlag: file.S3KeyFlag,
      type: file.Type,
      fileName: file.FileName,
      size: file.Size,
    }

    const linkRes = await fetch(downRequestUrl, {
      method: 'POST',
      headers: {
        ...this.headerLogined,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(downRequestData),
    })

    const linkResJson: ApiResponse = await linkRes.json()

    if (linkResJson.code !== 0) {
      console.error('API Error:', linkResJson.code)
      throw new Error(linkResJson.code.toString())
    }

    const downloadUrl = linkResJson.data.DownloadUrl

    if (!downloadUrl) {
      console.error('DownloadUrl is null', downloadUrl)
      return;
    }

    return downloadUrl!
  }
}

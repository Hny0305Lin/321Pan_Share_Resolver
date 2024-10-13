import type { ApiResponse, DirOptions, FileInfo, Headers } from '../types'

export class FileExplorer {
  private loggedHeader: Headers
  private baseUrl: string

  constructor(loggedHeader: Headers) {
    this.loggedHeader = loggedHeader
    this.baseUrl = 'https://www.123865.com/b/api/share/get'
  }

  async getDir(options: DirOptions): Promise<FileInfo[]> {
    const {
      shareKey,
      parentFileId = 0,
      sharePwd,
      page = 1,
      depth = 0,
      limit = 100,
      orderBy = 'file_name',
      orderDirection = 'asc',
    } = options

    const params: any = {
      limit,
      next: -1,
      orderBy,
      orderDirection,
      SharePwd: sharePwd || '',
      ParentFileId: parentFileId,
      Page: page,
      event: 'homeListFile',
      operateType: parentFileId === 0 ? 1 : 4,
    }

    if (shareKey) {
      params.shareKey = shareKey
    }

    params[Math.floor(Math.random() * 1000000000)] = `${Math.floor(Math.random() * 1000000000)}-${Math.floor(Math.random() * 10000000)}-${Math.floor(Math.random() * 10000000000)}`

    const url = `${this.baseUrl}?${new URLSearchParams(params).toString()}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.loggedHeader,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.code !== 0) {
        throw new Error(`API error! code: ${data.code}, message: ${data.message}`)
      }

      const fileList = data.data.InfoList

      if (depth > 0) {
        for (const file of fileList) {
          if (file.Type === 1) {
            file.ContainFiles = await this.getDir({
              ...options,
              parentFileId: file.FileId,
              depth: depth - 1,
            })
          }
        }
      }

      return fileList
    }
    catch (error) {
      console.error('Error in getDir:', error)
      throw error
    }
  }
}

// types.ts

export interface FileInfo {
  FileId: string
  FileName: string
  Type: number
  Size: number
  Etag?: string
  S3KeyFlag?: number
  ContainFiles?: FileInfo[]
}

export interface ApiResponse {
  code: number
  message: string
  data: {
    InfoList: FileInfo[]
    DownloadUrl?: string
  }
}

export interface DirOptions {
  shareKey?: string
  parentFileId?: string | number
  sharePwd?: string
  page?: number
  depth?: number
  limit?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

export interface Headers {
  [key: string]: string
}

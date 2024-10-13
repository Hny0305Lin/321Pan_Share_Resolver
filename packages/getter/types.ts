import {z} from 'zod'

export interface FileInfo {
  FileId: string
  FileName: string
  Type: number
  Size: number
  Etag?: string
  S3KeyFlag?: number
  ContainFiles?: FileInfo[]
}

// zod fileinfo schema
/*
{"FileId":1627142,"FileName":"22000.318.211110-0800.co_refresh_clientcombinedchina_fre_zh-cn_04a77a7a.iso","Type":0,"Size":4851013632,"ContentType":"0","S3KeyFlag":"1625770-0","CreateAt":"2021-11-11T01:05:27+08:00","UpdateAt":"2023-05-27T10:12:17+08:00","Etag":"2c9a170e776dcd236369ab4fca8b3676","DownloadUrl":"","Status":2,"ParentFileId":1627141,"Category":0,"PunishFlag":0,"StorageNode":"m4","PreviewType":0}
*/
export const fileInfoSchema = z.object({
  FileId: z.union([z.string(), z.number()]).transform(val => String(val)),
  FileName: z.string(),
  Etag: z.string(),
  S3KeyFlag: z.string(),
  Type: z.number(),
  Size: z.number(),
});

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

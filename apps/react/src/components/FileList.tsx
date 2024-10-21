import type { FileInfo } from 'getter/types'
import { Checkbox, Tree, Typography } from 'antd'
import { forwardRef } from 'react'

interface FileListProps {
  fileList: FileInfo[]
  selectedFiles: Set<number>
  toggleFileSelection: (fileId: number) => void
}

const FileList = forwardRef<HTMLDivElement, FileListProps>(({ fileList, selectedFiles, toggleFileSelection }, ref) => {
  const renderTreeNodes = (files: FileInfo[]): { title: JSX.Element, key: number, children: any[] }[] =>
    files.map(file => ({
      title: (
        <span>
          <Checkbox
            checked={selectedFiles.has(~~file.FileId)}
            onChange={() => toggleFileSelection(~~file.FileId)}
            disabled={file.Type !== 0}
          />
          {file.FileName}
        </span>
      ),
      key: ~~file.FileId,
      children: file.Type === 1 && file.ContainFiles ? renderTreeNodes(file.ContainFiles) : [],
    }))

  return (
    <div ref={ref}>
      {fileList.length === 0
        ? (
            <Typography>
              <Typography.Text
                strong
                style={{
                  textAlign: 'center',
                }}
              >
                等待获取文件

              </Typography.Text>

            </Typography>
          )
        : (
            <Tree
              style={
                {
                  height: '100%',
                  maxWidth: '100%',
                  overflow: 'auto',
                }
              }
              treeData={renderTreeNodes(fileList)}
              selectable={false}
              defaultExpandAll
            />
          )}
    </div>
  )
})

export default FileList

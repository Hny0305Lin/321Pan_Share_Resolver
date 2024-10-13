import { List, Typography } from 'antd'
import React, { forwardRef } from 'react'

const { Text } = Typography

interface DownloadLinksProps {
  downloadLinks: React.JSX.Element[]
}

const DownloadLinks = forwardRef<HTMLDivElement, DownloadLinksProps>(({ downloadLinks }, ref) => {
  return (
    <List
      header={<Text>下载链接们</Text>}
      bordered
      dataSource={downloadLinks}
      renderItem={item => <List.Item>{item}</List.Item>}
      style={{ marginTop: '20px' }}
      ref={ref}
    />
  )
})

export default DownloadLinks

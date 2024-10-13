import { Typography } from 'antd'
import { forwardRef } from 'react'

const { Text, Paragraph, Link } = Typography

const Footer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Typography
      ref={ref}
      style={{
        marginTop: '20px',
      }}
    >
      <Text strong>
        Powered by
        {' '}
        <Link href="https://github.com/Hny0305Lin/Pan123_Share" target="_blank">
          Lin.Meng
        </Link>
        .
        {' '}
        <Text strong style={{ marginLeft: '4px' }}>
          Click
          {' '}
          <Text keyboard>Star</Text>
          {' '}
          to support me.
        </Text>
        <Paragraph
          strong
          style={{
            fontSize: '9px',
            marginTop: 10,
          }}
        >
          <Text mark>
            浩瀚银河提示，仅限用于学习和研究目的；不得将上述内容用于商业或者非法用途，否则，一切后果请用户自负。版权争议与本站无关，您必须在下载后的24个小时之内，从您的电脑中彻底删除上述内容。访问和下载本站内容，说明您已同意上述条款。本网站拒绝为违法违规内容服务，请自觉遵守中国大陆相关法律法规。
          </Text>
        </Paragraph>
      </Text>
    </Typography>
  )
})

export default Footer

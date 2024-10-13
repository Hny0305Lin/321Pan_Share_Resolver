import { Form, Input, Typography } from 'antd'
import React, { forwardRef } from 'react'

const { Text } = Typography

interface ShareKeyInputProps {
  shareKey: string
  sharePwd: string
  onShareKeyChange: (value: string) => void
  onSharePwdChange: (value: string) => void
}

const ShareKeyInput = forwardRef<HTMLDivElement, ShareKeyInputProps>(({
  shareKey,
  sharePwd,
  onShareKeyChange,
  onSharePwdChange,
}, ref) => {
  const [form] = Form.useForm()

  const validateShareKey = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入分享链接或密钥'))
    }

    if (/^https?:\/\/www\.123pan\.com\/s\/[\w-]+$/.test(value)) {
      return Promise.resolve()
    }

    if (/^[\w-]+$/.test(value)) {
      return Promise.resolve()
    }

    return Promise.reject(new Error('无效的分享链接或密钥格式'))
  }

  const handleShareKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const match = input.match(/\/s\/([^/?]+)/)
    if (match) {
      onShareKeyChange(match[1])
      form.setFieldsValue({ shareKey: match[1] })
    }
    else {
      onShareKeyChange(input)
      form.setFieldsValue({ shareKey: input })
    }
  }

  return (
    <div ref={ref}>
      <Form form={form} layout="vertical" style={{ marginBottom: '2rem' }}>
        <Form.Item
          label="分享链接或密钥"
          required
          name="shareKey"
          rules={[{ validator: validateShareKey }]}
          validateTrigger="onChange"
        >
          <Input
            placeholder="请输入分享链接或密钥"
            value={shareKey}
            onChange={handleShareKeyChange}
          />
        </Form.Item>
        <Form.Item
          label="提取码"
          name="sharePwd"
          validateTrigger="onChange"
        >
          <Input
            placeholder="请输入提取码"
            value={sharePwd}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSharePwdChange(e.target.value)}
          />
        </Form.Item>
        <Text type="secondary" style={{ textAlign: 'center' }}>
          请输入完整的分享链接（如 https://www.123pan.com/s/HQeA-0KBSh）或直接输入密钥（如 HQeA-0KBSh），然后输入提取码（如果有的话）
        </Text>
      </Form>

    </div>
  )
})

export default ShareKeyInput

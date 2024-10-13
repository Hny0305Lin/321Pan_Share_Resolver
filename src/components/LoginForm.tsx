import { Button, Input, message } from 'antd'
import { forwardRef } from 'react'

interface LoginFormProps {
  username: string
  password: string
  setUsername: (username: string) => void
  setPassword: (password: string) => void
  login: () => Promise<boolean>
}

const LoginForm = forwardRef<HTMLDivElement, LoginFormProps>(({ username, password, setUsername, setPassword, login }, ref) => {
  return (
    <div ref={ref}>
      <Input
        placeholder="用户名"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Input.Password
        placeholder="密码"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button
        type="dashed"
        onClick={async () => {
          if (await login())
            message.success('账号信息无误')
        }}
        style={{ marginBottom: '10px', textAlign: 'right' }}
      >
        测试是否可以正常登录
      </Button>
    </div>
  )
})

export default LoginForm

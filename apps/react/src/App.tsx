import type { FileInfo, Headers } from 'getter/types'
import { LinkOutlined } from '@ant-design/icons'
import { Button, message, Space, Spin, Switch, Typography } from 'antd'
import { FileDownloader } from 'getter/FileDownloader'
import { FileExplorer } from 'getter/FileExplorer'
import LoginManager from 'getter/Login'
import { encode } from 'js-base64'
import React, { Suspense, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import config from './config'
import './App.css'

const ShareKeyInput = React.lazy(() => import('./components/ShareLinkInput'))
const Footer = React.lazy(() => import('./components/Footer'))
const LoginForm = React.lazy(() => import('./components/LoginForm'))
const FileList = React.lazy(() => import('./components/FileList'))
const DownloadLinks = React.lazy(() => import('./components/DownloadLinks'))
const ArtPlums = React.lazy(() => import('./components/ArtPlums'))
const TourButton = React.lazy(() => import('./components/Tour'))

const { Title, Text } = Typography

const BASE_HEADER = {
  'user-agent': '123pan/v2.4.0(Android_7.1.2;Xiaomi)',
  'accept-encoding': 'gzip',
  'content-type': 'application/json',
  'osversion': 'Android_7.1.2',
  'loginuuid': uuidv4(),
  'platform': 'android',
  'devicetype': 'M2101K9C',
  'x-channel': '1004',
  'devicename': 'Xiaomi',
  'host': 'www.123pan.com',
  'app-version': '61',
  'x-app-version': '2.4.0',
}

const App: React.FC = () => {
  const [shareKey, setShareKey] = useState<string>('')
  const [sharePwd, setSharePwd] = useState<string>('')
  const [fileList, setFileList] = useState<FileInfo[]>([])
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set())
  const [downloadLinks, setDownloadLinks] = useState<React.JSX.Element[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [usePersonalAccount, setUsePersonalAccount] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isTourOpen, setIsTourOpen] = useState(false)
  const loginSwitchRef = useRef(null)
  const shareKeyInputRef = useRef(null)
  const fetchFilesButtonRef = useRef(null)
  const fileListRef = useRef(null)
  const fetchDownloadLinksButtonRef = useRef(null)
  const downloadLinksRef = useRef(null)
  const [headers, setHeaders] = useState<Headers>(BASE_HEADER)

  const login = async () => {
    setLoading(true)
    try {
      const loginManager = new LoginManager(BASE_HEADER, config.BASE_URL)
      const token = await loginManager.login(username, password)
      setHeaders(token)
      return true
    }
    catch (error) {
      console.error('Login error:', error)
      message.error(`登录失败: ${(error as Error).message}`)
      return false
    }
    finally {
      setLoading(false)
    }
  }

  const fetchFiles = async () => {
    setLoading(true)
    const explorer = new FileExplorer(headers, config.BASE_URL)
    try {
      if (usePersonalAccount) {
        const loginSuccess = await login()
        if (!loginSuccess) {
          throw new Error('Login failed')
        }
      }
      const files = await explorer.getDir({ shareKey, sharePwd, depth: 10 })
      setFileList(files)
      message.success('成功拉取分享文件列表！')
    }
    catch (error) {
      message.error(`拉取文件列表失败: ${(error as Error).message}`)
      console.error('Failed to fetch files:', error)
    }
    finally {
      setLoading(false)
    }
  }

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles((prevSelected) => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(fileId)) {
        newSelected.delete(fileId)
      }
      else {
        newSelected.add(fileId)
      }
      return newSelected
    })
  }

  const getAllSelectedFiles = (files: FileInfo[], selected: Set<number>): FileInfo[] => {
    return files.flatMap((file) => {
      if (file.Type === 1 && file.ContainFiles) {
        return getAllSelectedFiles(file.ContainFiles, selected)
      }
      return selected.has(~~file.FileId) ? [file] : []
    })
  }

  const fetchDownloadLinks = async () => {
    setLoading(true)
    const downloader = new FileDownloader(headers, config.BASE_URL)
    const allSelectedFiles = getAllSelectedFiles(fileList, selectedFiles)
    try {
      const links = await Promise.all(
        allSelectedFiles.map(async (file) => {
          try {
            const link = await downloader.link(file)
            return link
              ? (
                  <Space
                    key={file.FileId}
                  >
                    <div style={{
                      width: '100%',
                      maxHeight: '16em',
                      textOverflow: 'ellipsis',
                      overflow: 'auto',
                    }}
                    >
                      <Text
                        mark
                      >
                        {file.FileName}
                      </Text>
                      :
                      {' '}
                      <Text
                        copyable
                      >
                        {link}

                      </Text>
                    </div>
                    <Button
                      icon={<LinkOutlined />}
                      onClick={() => window.open(link, '_blank')}
                      size="small"
                    >
                      在新页面打开
                    </Button>
                    <Button
                      icon={<LinkOutlined />}
                      onClick={() => {
                        const directLink = `${config.API_URL || 'https://api.what-the-fuck.sbs'}/get-link?config=${encode(JSON.stringify(file))}`

                        navigator.clipboard.writeText(directLink).then(() => {
                          message.success(`直链已复制到剪贴板`)
                        }, () => {
                          message.error(`复制失败，请手动复制`)
                          // eslint-disable-next-line no-alert
                          alert(directLink)
                        })
                      }}
                      size="small"
                    >
                      生成直链
                    </Button>
                  </Space>
                )
              : (
                  <Text key={file.FileId} type="danger">
                    {file.FileName}
                    : Error - 无可用地址 (尝试登录账号以解决问题)
                  </Text>
                )
          }
          catch (error) {
            console.error(`Error fetching link for ${file.FileName}:`, error)
            return (
              <Text key={file.FileId} type="danger">
                {file.FileName}
                : Error -
                {' '}
                {(error as Error).message}
              </Text>
            )
          }
        }),
      )

      setDownloadLinks(links.filter(Boolean))
    }
    catch (error) {
      console.error('Error fetching download links:', error)
      message.error(`Failed to fetch download links: ${(error as Error).message}`)
    }
    finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      title: '登录账号',
      description: '登录自己的123云盘账号,以防止被拦截',
      target: () => loginSwitchRef.current,
    },
    {
      title: '输入分享链接',
      description: '复制链接中的s后面的字符串,如1d8a-3zj9; 或直接粘贴完整链接, 程序会自动获取',
      target: () => shareKeyInputRef.current,
    },
    {
      title: '获取文件列表',
      description: '点击按钮从 123 云盘获取分享文件列表',
      target: () => fetchFilesButtonRef.current,
    },
    {
      title: '选择文件',
      description: '等待获取完成后,勾选需要下载的文件',
      target: () => fileListRef.current,
    },
    {
      title: '获取下载链接',
      description: '点击按钮从 123 云盘获取下载链接',
      target: () => fetchDownloadLinksButtonRef.current,
    },
    {
      title: '下载文件',
      description: '可以选择复制或直接打开下载链接',
      target: () => downloadLinksRef.current,
    },
  ]

  return (
    <Suspense fallback={<Spin fullscreen tip="加载页面组件中..." />}>
      <ArtPlums />
      <div style={{ padding: '20px' }}>
        <Typography>
          <Title level={1}>自动绕过并获取 123 云盘分享内容</Title>
          <Text>仅勾选文件，多个文件的打包下载因 123 云盘限制无法实现。部分情况下可能被 123 云盘风控请求，请使用自己的账号登录以规避问题</Text>
        </Typography>
        <TourButton onButtonClick={() => setIsTourOpen(true)} open={isTourOpen} onClose={() => setIsTourOpen(false)} steps={steps} />
        <Switch
          ref={loginSwitchRef}
          checked={usePersonalAccount}
          onChange={setUsePersonalAccount}
          checkedChildren="使用自己的 123 云盘账号"
          unCheckedChildren="不使用账号"
          style={{ marginBottom: '10px', marginTop: '10px' }}
        />
        {usePersonalAccount && (
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            login={login}
          />
        )}
        <ShareKeyInput
          ref={shareKeyInputRef}
          shareKey={shareKey}
          sharePwd={sharePwd}
          onShareKeyChange={setShareKey}
          onSharePwdChange={setSharePwd}
        />
        <Button ref={fetchFilesButtonRef} type="primary" onClick={fetchFiles} style={{ marginBottom: '20px' }}>
          获取分享文件列表
        </Button>
        <Spin spinning={loading}>
          <FileList
            ref={fileListRef}
            fileList={fileList}
            selectedFiles={selectedFiles}
            toggleFileSelection={toggleFileSelection}
          />
          <Button ref={fetchDownloadLinksButtonRef} type="primary" onClick={fetchDownloadLinks} style={{ marginTop: '20px', marginBottom: '20px' }}>
            获取勾选文件的下载链接
          </Button>
          <DownloadLinks ref={downloadLinksRef} downloadLinks={downloadLinks} />
        </Spin>
      </div>
      <Footer />
    </Suspense>
  )
}

export default App

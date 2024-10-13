import { Hono } from 'hono'
import { FileDownloader } from 'getter/FileDownloader'
import LoginManager from 'getter/Login'
import { ZodError } from 'zod'
import { fileInfoSchema } from 'getter/types'
import { decode } from 'js-base64';

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', (c) => {
  return c.text('Nothing here')
})

app.get('/get-link', async (c) => {
  const config = c.req.query('config')
  if (!config) return c.json({ error: 'Missing required parameters' }, 400)
  const decoded = JSON.parse(decode(config))

  try {

    const parsedConfig = fileInfoSchema.parse(decoded)
    if (parsedConfig.Type === 1) return c.json({ error: 'Invalid config', msg: 'Folder not supported', config: decoded }, 400)

    const headers = await new LoginManager().login(c.env.USERNAME, c.env.PASSWORD)
    const linker = new FileDownloader(headers)
    //@ts-expect-error
    const link = await linker.link(parsedConfig)

    if (!link) return c.json({ error: 'Invalid config', msg: 'No link found', config: decoded }, 400)

    return c.redirect(link)
  } catch (error) {
    console.error('Error parsing config:', error)
    if (error instanceof ZodError) {
      return c.json({ error: 'Invalid config', details: error.errors, config: decoded }, 400)
    }
    return c.json({ error: 'Invalid config', msg: (error as Error).message, config: decoded }, 400)
  }
})

export default app

import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { FileDownloader } from 'getter/FileDownloader';
import LoginManager from 'getter/Login';
import { ZodError } from 'zod';
import { fileInfoSchema } from 'getter/types';
import { decode } from 'js-base64';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', (c) => c.text('Nothing here'));

app.get('/get-link', async (c) => {
  const config = c.req.query('config');
  if (!config) return c.json({ error: 'Missing required parameters' }, 400);

  try {
    const decoded = JSON.parse(decode(config));
    const parsedConfig = fileInfoSchema.parse(decoded);
    if (parsedConfig.Type === 1) {
      return c.json({ error: 'Invalid config', msg: 'Folder not supported', config: decoded }, 400);
    }

    const headers = c.env.AUTH_TOKEN
      ? {
          Authorization: `Bearer ${c.env.AUTH_TOKEN}`,
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
      : await new LoginManager().login(c.env.USERNAME, c.env.PASSWORD);

    const linker = new FileDownloader(headers, c.env.BASE_URL);
    //@ts-expect-error
    const link = await linker.link(parsedConfig);

    if (!link) {
      return c.json({ error: 'Invalid config', msg: 'No link found', config: decoded }, 400);
    }

    return c.redirect(link);
  } catch (error) {
    console.error('env', c.env);
    console.error('Error parsing config:', error);
    if (error instanceof ZodError) {
      return c.json({ error: 'Invalid config', details: error.errors }, 400);
    }
    return c.json({ error: 'Invalid config', msg: (error as Error).message }, 400);
  }
});

export default app;

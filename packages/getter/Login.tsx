import { v4 as uuidv4 } from 'uuid'
import { Headers } from './types';

interface LoginResponse {
  code: number;
  message?: string;
  data?: {
    token: string;
  };
}

class LoginManager {
  private baseHeaders: Record<string, string>;
  private apiUrl: string;

  constructor(baseHeaders?: Record<string, string>, apiUrl?: string) {
    this.baseHeaders = baseHeaders || {
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
    };
    this.apiUrl = apiUrl || 'https://www.123pan.com/b/api/user/sign_in';
  }

  async login(username: string, password: string): Promise<Headers> {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.baseHeaders,
        },
        body: JSON.stringify({
          type: 1,
          passport: username,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (data.code !== 200) {
        throw new Error(data.message || 'Login failed');
      }

      const newHeaders: Headers = {
        ...this.baseHeaders,
        authorization: `Bearer ${data.data?.token}`,
      };

      return newHeaders;
  }
}

export default LoginManager

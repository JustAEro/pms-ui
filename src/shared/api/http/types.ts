export type Method = 'get' | 'delete' | 'post' | 'put';
export type ResponseType =
  | 'text'
  | 'json'
  | 'formData'
  | 'blob'
  | 'arrayBuffer';

export interface HttpRequestOptions extends Omit<RequestInit, 'body'> {
  url: string;
  method: Method;
  data?: unknown;
  responseType?: ResponseType;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

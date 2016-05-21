declare module 'react-loading' {
  var _temp: any;
  export = _temp;
}

declare module 'react-relay' {
  var _temp: any;
  export = _temp;
}

declare module 'react-router-relay' {
  var _temp: any;
  export = _temp;
}

declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
}

declare var analytics: any;
declare var __BACKEND_ADDR__: any;

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

declare module 'react-relay' {

  // fragments are a hash of functions
  interface Fragments {
    [query: string]: ((variables?: RelayVariables) => string)
  }

  interface CreateContainerOpts {
    initialVariables?: Object
    prepareVariables?(prevVariables: RelayVariables): RelayVariables
    fragments: Fragments
  }

  interface RelayVariables {
    [name: string]: any
  }

  // add static getFragment method to the component constructor
  interface RelayContainerClass<T> extends __React.ComponentClass<T> {
    getFragment: ((q: string) => string)
  }

  interface RelayQueryRequestResolve {
    response: any
  }

  interface RelayMutationRequest {
    getQueryString(): string
    getVariables(): RelayVariables
    resolve(result: RelayQueryRequestResolve)
    reject(errors: any)
  }

  interface RelayQueryRequest {
    resolve(result: RelayQueryRequestResolve)
    reject(errors: any)

    getQueryString(): string
    getVariables(): RelayVariables
    getID(): string
    getDebugName(): string
  }

  interface RelayNetworkLayer {
    supports(...options: string[]): boolean
  }

  class DefaultNetworkLayer implements RelayNetworkLayer {
    constructor(host: string, options: any)
    supports(...options: string[]): boolean
  }

  function createContainer<T>(component: __React.ComponentClass<T>, params?: CreateContainerOpts): RelayContainerClass<any>
  function injectNetworkLayer(networkLayer: RelayNetworkLayer)
  function isContainer(component: __React.ComponentClass<any>): boolean
  function QL(...args: any[]): string

  class Route {
    constructor(params?: RelayVariables)
  }

  // Relay Mutation class, where T are the props it takes and S is the returned payload from Relay.Store.update.
  // S is typically dynamic as it depends on the data the app is currently using, but it's possible to always
  // return some data in the payload using REQUIRED_CHILDREN which is where specifying S is the most useful.
  class Mutation<T,S> {
    props: T

    constructor(props: T)
    static getFragment(q: string): string
  }

  interface Transaction {
    getError(): Error
  }

  interface StoreUpdateCallbacks<T> {
    onFailure?(transaction: Transaction)
    onSuccess?(response: T)
  }

  interface Store {
    commitUpdate(mutation: Mutation<any,any>, callbacks?: StoreUpdateCallbacks<any>)
  }

  var Store: Store

  class RootContainer extends __React.Component<RootContainerProps,any> {}

  interface RootContainerProps extends __React.Props<RootContainer>{
    Component: RelayContainerClass<any>
    route: Route
    renderLoading?(): JSX.Element
    renderFetched?(data: any): JSX.Element
    renderFailure?(error: Error, retry: Function): JSX.Element
  }

  interface RelayProp {
    variables: any
    setVariables(variables: Object)
  }
}

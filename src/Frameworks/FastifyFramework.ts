import { IFramework, IFrameworkHandler } from "../Interfaces";
import fastify, { FastifyInstance } from "fastify";

function updateHandler( handler: any ) {
  // Add Express function in to the Fastify request and response
  return ( req: any, res: any, next: any ) => {
    // Request
    req.get = (headerName: string) => req.getHeader(headerName);
    
    // Response
    res.json = res.send;
    res.setHeader = (name: string, value: string) => res.header(name, value);

    handler(req, res, next);
  }
}

function updateReqResToExpressish(middlewares: any, handler: any){ 
  middlewares= updateHandler(Array.isArray(middlewares) ? middlewares[0] : middlewares);

  if(handler){
    handler = updateHandler(handler);
  }
  return [middlewares, handler];
}

class FastifyFramework implements IFramework {
  client: FastifyInstance;
  _name: string;
  constructor() {
    this.client = fastify();
    this._name = "fastify";
  }

  private handleMethod(method: string, url:string, middlewares: any, handler: any){
    const [_handler, _middleware] = updateReqResToExpressish(middlewares, handler);
    if (_handler) {
      // @ts-ignore
      this.client[method](url, { preHandler: _middleware as any }, _handler as any);
    } else {
      // @ts-ignore
      this.client[method](url, _middleware as any);
    }
  }

  get(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('get', url, middleware, handler);
  }
  post(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('post', url, middleware, handler);
  }
  put(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('put', url, middleware, handler);
  }
  delete(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('delete', url, middleware, handler);
  }
  patch(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler | undefined) {
    this.handleMethod('patch', url, middleware, handler);
  }
  use(middleware: IFrameworkHandler) {
    this.client.register(import('@fastify/middie')).then(() => {
      // @ts-ignore
      return this.client.use(middleware);
    })
  }
  listen(port: number, fn: () => void) {
    return this.client.listen({ port }, fn);
  }
  kill(): void {
    throw new Error("Method not implemented.");
  }


}

export default FastifyFramework;

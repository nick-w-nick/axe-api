import { IFramework, IFrameworkHandler } from "../Interfaces";
import express, { Express } from "express";

class ExpressFramework implements IFramework {
  client: Express;
  _name: string;

  constructor() {
    this.client = express();
    this._name = "express";
  }

  get(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler) {
    if (handler) {
      this.client.get(url, middleware, handler)
    } else {
      this.client.get(url, middleware)
    }
  }

  // post(url: string, handler: IFrameworkHandler){
  //     this.client.post(url, handler);
  // }
  post(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler) {
    if (handler) {
      this.client.post(url, middleware, handler)
    } else {
      this.client.post(url, middleware)
    }
  }
  // put(url: string, handler: IFrameworkHandler){
  //     this.client.put(url, handler);
  // }
  put(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler) {
    if (handler) {
      this.client.put(url, middleware, handler)
    } else {
      this.client.put(url, middleware)
    }
  }
  // delete(url: string, handler: IFrameworkHandler){
  //     this.client.delete(url, handler);
  // }
  delete(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler) {
    if (handler) {
      this.client.delete(url, middleware, handler)
    } else {
      this.client.delete(url, middleware)
    }
  }
  // patch(url: string, handler: IFrameworkHandler){
  //     this.client.patch(url, handler);
  // }
  patch(url: string, middleware: IFrameworkHandler | IFrameworkHandler[], handler?: IFrameworkHandler) {
    if (handler) {
      this.client.patch(url, middleware, handler)
    } else {
      this.client.patch(url, middleware)
    }
  }
  use(middleware: IFrameworkHandler): any {
    return this.client.use(middleware);
  }
  listen(port: number, fn: () => void): any {
    return this.client.listen(port, fn);
  }
  kill(): void {
    throw new Error("Method not implemented.");
  }

}

export default ExpressFramework
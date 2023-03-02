import { NextFunction } from "express";
import { QueryFeature } from "../../../../../../src/Enums";
import Model from "../../../../../../src/Model";
import { allow } from "../../../../../../src/Services";
import {
  IRequest,
  IResponse,
} from "../../../../../../src/Interfaces";

class Comment extends Model {
  get middlewares(): ((
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ) => void)[] {
    return [
      (req: IRequest, res: IResponse, next: NextFunction) => {
        next();
      },
    ];
  }

  get transaction(): null {
    return null;
  }

  get limits() {
    return [allow(QueryFeature.All)];
  }

  author() {
    return this.hasOne("Author", "comment_id", "id");
  }
}

export default Comment;

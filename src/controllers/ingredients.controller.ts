import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { MongooseController } from './mongoose.controller.js';

export class IngredientController<T> extends MongooseController<T> {
    constructor(public model: Model<T>) {
        super(model);
    }
    getAllController = async (req: Request, resp: Response) => {
        req;
        resp.setHeader('Content-type', 'application/json');
        resp.send(await this.model.find());
    };
    getController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        let result;
        try {
            resp.setHeader('Content-type', 'application/json');
            result = await this.model.findById(req.params.id);

            if (!result) {
                resp.status(406);
                resp.end(JSON.stringify({}));

                throw new Error('Id not found');
            } else {
                resp.end(JSON.stringify(result));
            }
        } catch (err) {
            next(err);
        }
    };
}

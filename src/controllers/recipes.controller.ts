import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { MongooseController } from './mongoose.controller.js';

export class RecipesController<T> extends MongooseController<T> {
    constructor(public model: Model<T>) {
        super(model);
    }

    getAllController = async (req: Request, resp: Response) => {
        req;
        resp.setHeader('Content-type', 'application/json');
        resp.send(
            await this.model
                .find()
                .populate('ingredients')
                .populate({ path: 'ingredients', populate: 'ingredient' })
        );
    };
    getController = async (
        req: Request,
        resp: Response,
        next: NextFunction
    ) => {
        let result;
        try {
            resp.setHeader('Content-type', 'application/json');
            if (req.params.id.length !== 24) {
                resp.status(404);
                resp.end(JSON.stringify({}));
                throw new Error('Id not found');
            }
            result = await this.model
                .findById(req.params.id)
                .populate('ingredients')
                .populate({ path: 'ingredients', populate: 'ingredient' });

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

import * as aut from '../services/authorization.js';
import { User } from '../models/user.model.js';
export class UserController {
    getController = async (req, resp, next) => {
        resp.setHeader('Content-type', 'application/json');
        let user;
        try {
            user = await User.findById(req.params.id).populate('recipes');
        }
        catch (error) {
            next(error);
            return;
        }
        if (user) {
            resp.send(JSON.stringify(user));
        }
        else {
            resp.status(404);
            resp.send(JSON.stringify({}));
        }
    };
    postController = async (req, resp, next) => {
        let newUser;
        try {
            req.body.passwd = await aut.encrypt(req.body.passwd);
            newUser = await User.create(req.body);
        }
        catch (error) {
            next(error);
            return;
        }
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify(newUser));
    };
    loginController = async (req, resp, next) => {
        const findUser = await User.findOne({ name: req.body.name });
        if (!findUser ||
            !(await aut.compare(req.body.passwd, findUser.passwd))) {
            const error = new Error('Invalid user or password');
            error.name = 'UserAuthorizationError';
            next(error);
            return;
        }
        const tokenPayLoad = {
            id: findUser.id,
            name: findUser.name,
        };
        const token = aut.createToken(tokenPayLoad);
        resp.setHeader('Content-type', 'application/json');
        resp.status(201);
        resp.send(JSON.stringify({ token, id: findUser.id }));
    };
    deleteController = async (req, resp, next) => {
        try {
            const deletedItem = await User.findByIdAndDelete(req.tokenPayload.id);
            resp.status(202);
            resp.send(JSON.stringify(deletedItem));
        }
        catch (error) {
            next(error);
            return;
        }
    };
    patchController = async (req, resp, next) => {
        try {
            const newItem = await User.findByIdAndUpdate(req.tokenPayload.id, req.body);
            if (!newItem || req.body.email) {
                const error = new Error('Invalid user');
                error.name = 'UserError';
                next(error);
                return;
            }
            resp.setHeader('Content-type', 'application/json');
            resp.send(JSON.stringify(newItem));
        }
        catch (error) {
            next(error);
        }
    };
}
import mongoose from 'mongoose';
import { mongooseConnect } from '../db/mongoose';

async () => {
    await mongooseConnect();
};

const ingredientSchema = new mongoose.Schema({
    name: String,
    category: String,
    recipes: [
        {
            recipe: {
                type: mongoose.Types.ObjectId,
                ref: 'Recipe',
            },
        },
    ],
});
ingredientSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});
export const Recipe = mongoose.model('Recipe', ingredientSchema);

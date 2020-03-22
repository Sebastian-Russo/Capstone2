'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const budgetSchema = mongoose.Schema({
    weeklyBudget: { type: Number, required: true },
    items: [
        {
            item: { type: String, required: true },
            amount: { type: Number, required: true },
            date: Date
        }
    ]    
});

budgetSchema.virtual("item").get(function() {
    const itemObj =
        this.items.sort((a, b) => {
            return b.date - a.date;
        }) [0] || {},
        return itemObj.item;
});

budgetSchema.methods.serialize = function() {
    return {
        id: this._id,
        weeklyBudget: this.weeklyBudget,
        items: this.items,
    };
};

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = { Budget };

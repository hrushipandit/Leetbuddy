const mongoose = require('mongoose');
const UserEntry = require('../Models/UserEntry.js');  // Assuming UserEntry is the model

describe('UserEntry Schema', () => {
    it('should have the necessary fields with required attributes', () => {
        const schemaPaths = UserEntry.schema.paths;

        // Check required fields
        expect(schemaPaths.googleId.options.required).toBeTruthy();
        expect(schemaPaths.code.options.required).toBeTruthy();
        expect(schemaPaths.notes.options.required).toBeTruthy();
        expect(schemaPaths.question_name.options.required).toBeTruthy();
        expect(schemaPaths.question.options.required).toBeTruthy();

        // Check types
        expect(schemaPaths.googleId.instance).toBe('String');
        expect(schemaPaths.code.instance).toBe('String');
        expect(schemaPaths.notes.instance).toBe('String');
        expect(schemaPaths.question_name.instance).toBe('String');
        expect(schemaPaths.question.instance).toBe('String');
        expect(schemaPaths.date.instance).toBe('Date');

        // Check defaults
        expect(schemaPaths.date.defaultValue).toEqual(expect.any(Function));
        expect(schemaPaths.eFactor.defaultValue).toBe(2.5);
        expect(schemaPaths.repetition.defaultValue).toBe(0);
        expect(schemaPaths.lastReviewed.defaultValue).toEqual(expect.any(Function));
        expect(schemaPaths.nextReviewDate.defaultValue).toEqual(expect.any(Function));
    });
});

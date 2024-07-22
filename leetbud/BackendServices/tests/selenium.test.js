const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const { Builder, By, until, Capabilities } = require('selenium-webdriver');

jest.mock('selenium-webdriver', () => {
    // Mock for elements and their methods
    const element = {
        sendKeys: jest.fn().mockResolvedValue(true),
        click: jest.fn().mockResolvedValue(true),
        getText: jest.fn().mockResolvedValue('Sample Question Text')
    };

    return {
        Builder: jest.fn(() => ({
            forBrowser: jest.fn().mockReturnThis(),
            withCapabilities: jest.fn().mockReturnThis(),
            build: jest.fn(() => ({
                get: jest.fn().mockResolvedValue(true),
                wait: jest.fn().mockImplementation((impl, timeout) => {
                    if (typeof impl === 'function') {
                        return impl(element);
                    }
                    return element;
                }),
                quit: jest.fn().mockResolvedValue(true),
                findElement: jest.fn().mockResolvedValue(element),
                findElements: jest.fn().mockResolvedValue([element]),
                sleep: jest.fn().mockResolvedValue(true), // Mock for sleep method
            })),
        })),
        By: {
            css: jest.fn().mockImplementation(selector => selector)
        },
        until: {
            elementLocated: jest.fn().mockImplementation(locator => locator),
            elementIsVisible: jest.fn().mockImplementation(elem => elem),
        },
        Capabilities: {
            chrome: jest.fn(() => ({
                set: jest.fn()
            }))
        }
    };
});





const app = express();
app.use(bodyParser.json());
const router = require('../routes/selenium'); // Adjust the import path as per your project structure
app.use(router);

describe('/fetch-leetcode-question', () => {
    it('should require a question name', async () => {
        const response = await request(app)
            .post('/fetch-leetcode-question')
            .send({});
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Question name is required.');
    });

    it('should return the fetched question text on success', async () => {
        const response = await request(app)
            .post('/fetch-leetcode-question')
            .send({ questionName: 'Two Sum' });
        expect(response.statusCode).toBe(200);
        expect(response.body.questionText).toBe('Sample Question Text');
    });

});

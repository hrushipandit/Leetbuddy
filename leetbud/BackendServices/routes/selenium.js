const express = require('express');
const router = express.Router();
const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

router.post('/fetch-leetcode-question', async (req, res) => {
    const { questionName } = req.body;

    if (!questionName) {
        return res.status(400).json({ message: 'Question name is required.' });
    }

    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navigate to LeetCode
        await driver.get('https://leetcode.com/problemset/all/');

        // Input the question name in the search box
        const searchBox = await driver.wait(until.elementLocated(By.css('input[placeholder="Search questions"]')), 10000);
        await searchBox.sendKeys(questionName);

        // Wait for the results to appear and click on the first link that appears in the results
        await driver.wait(until.elementLocated(By.css('a[href^="/problems/"]')), 10000).click();

        // Wait for the problem description to load by checking the container that loads the problem's description
        let questionText = await driver.wait(until.elementLocated(By.css('.elfjS')), 10000).getText();

        res.json({ questionText });
    } catch (error) {
        console.error('Failed to fetch question from LeetCode:', error);
        res.status(500).json({ error: 'Failed to fetch question', details: error.message });
    } finally {
        await driver.quit(); // Make sure to quit the driver
    }
});

module.exports = router;
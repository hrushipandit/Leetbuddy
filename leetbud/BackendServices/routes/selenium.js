const express = require('express');
const router = express.Router();
const { Builder, By, until, Capabilities } = require('selenium-webdriver');
require('chromedriver');

router.post('/fetch-leetcode-question', async (req, res) => {
    const { questionName } = req.body;

    if (!questionName) {
        return res.status(400).json({ message: 'Question name is required.' });
    }

    // Set Chrome options for headless mode
    let chromeCapabilities = Capabilities.chrome();
    chromeCapabilities.set('chromeOptions', { args: ['--headless', '--disable-gpu', '--window-size=1920,1080'] });

    let driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();

    try {
        // Navigate to LeetCode
        await driver.get('https://leetcode.com/problemset/all/');

        // Input the question name in the search box
        const searchBox = await driver.wait(until.elementLocated(By.css('input[placeholder="Search questions"]')), 10000);
        await searchBox.sendKeys(questionName);

        await driver.sleep(2000); // Sleep to allow search results to load

        // Wait for the results to stabilize and target the second child of the div with role="rowgroup"
        const secondQuestionLink = await driver.wait(until.elementLocated(By.css('div[role="rowgroup"] > div:nth-child(2) a')), 10000);
        await secondQuestionLink.click();

        // Wait for the problem description to load
        let questionText = await driver.wait(until.elementLocated(By.css('.elfjS')), 10000).getText();

        res.json({ questionText });
    } catch (error) {
        console.error('Failed to fetch question from LeetCode:', error);
        res.status(500).json({ error: 'Failed to fetch question', details: error.message });
    } finally {
        await driver.quit(); // Ensure the driver is quit
    }
});

module.exports = router;

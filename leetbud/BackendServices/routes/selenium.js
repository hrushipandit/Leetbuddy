const express = require('express');
const router = express.Router();
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

router.post('/fetch-leetcode-question', async (req, res) => {
    const { questionName } = req.body;

    if (!questionName) {
        return res.status(400).json({ message: 'Question name is required.' });
    }

    let options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu', '--window-size=1920,1080');
    options.addArguments('--no-sandbox'); 
    options.addArguments('start-maximized'); // Starts browser maximized to avoid certain element visibility issues
    options.addArguments('disable-infobars'); // Disables the "Chrome is being controlled by automated test software" infobar
    options.addArguments('--disable-dev-shm-usage'); // Overcomes limited resource problems
    options.addArguments('--disable-browser-side-navigation'); // Fixes timeout issues in some versions

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(new chrome.ServiceBuilder('/usr/bin/chromedriver'))
        .build();

    try {
        await driver.get('https://leetcode.com/problemset/all/');
        await driver.takeScreenshot().then(
            function (image, err) {
                fs.writeFileSync('before-search.png', image, 'base64');
            }
        );
        const searchBox = await driver.wait(until.elementLocated(By.css('input[placeholder="Search questions"]')), 20000);
        await searchBox.sendKeys(questionName);
        // Use an explicit wait condition rather than a sleep for better stability
        await driver.wait(until.elementIsVisible(driver.findElement(By.css('div[role="rowgroup"] > div:nth-child(2) a'))), 20000);
        const secondQuestionLink = await driver.findElement(By.css('div[role="rowgroup"] > div:nth-child(2) a'));
        await secondQuestionLink.click();
        let questionText = await driver.wait(until.elementLocated(By.css('.elfjS')), 10000).getText();
        res.json({ questionText });
    } catch (error) {
        console.error('Failed to fetch question from LeetCode:', error);
        res.status(500).json({ error: 'Failed to fetch question', details: error.message });
    } finally {
        await driver.quit();  // Ensure the driver quits to free resources
    }
});

module.exports = router;

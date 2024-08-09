const express = require('express');
const router = express.Router();
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

/**
 * Route to fetch a specific question from LeetCode.
 * The function uses Selenium WebDriver to navigate LeetCode's problem set and extract the question text.
 */
router.post('/fetch-leetcode-question', async (req, res) => {
    const { questionName } = req.body;
    // Validate the input to ensure a question name is provided
    if (!questionName) {
        return res.status(400).json({ message: 'Question name is required.' });
    }
    // Set Chrome options for Selenium to run headless and optimize performance
    let options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu', '--window-size=1920,1080');
    options.addArguments('--no-sandbox'); 
    options.addArguments('start-maximized'); // Starts browser maximized to avoid certain element visibility issues
    options.addArguments('disable-infobars'); // Disables the "Chrome is being controlled by automated test software" infobar
    options.addArguments('--disable-dev-shm-usage'); // Overcomes limited resource problems
    options.addArguments('--disable-browser-side-navigation'); // Fixes timeout issues in some versions
    // Build the Selenium WebDriver for Chrome
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(new chrome.ServiceBuilder('/usr/bin/chromedriver'))
        .build();

    try {
        // Navigate to LeetCode's problem set page
        await driver.get('https://leetcode.com/problemset/all/');
        // Take a screenshot before searching (optional, for debugging purposes)
        await driver.takeScreenshot().then(
            function (image, err) {
                fs.writeFileSync('before-search.png', image, 'base64');
            }
        );
        // Locate the search box and enter the question name
        const searchBox = await driver.wait(until.elementLocated(By.css('input[placeholder="Search questions"]')), 20000);
        await searchBox.sendKeys(questionName);
        // Wait for search results to be visible and interactable
        await driver.wait(until.elementIsVisible(driver.findElement(By.css('div[role="rowgroup"] > div:nth-child(2) a'))), 20000);
        const secondQuestionLink = await driver.findElement(By.css('div[role="rowgroup"] > div:nth-child(2) a'));
        await secondQuestionLink.click();
        // Extract the text of the question
        let questionText = await driver.wait(until.elementLocated(By.css('.elfjS')), 10000).getText();
        res.json({ questionText });
    } catch (error) {
        console.error('Failed to fetch question from LeetCode:', error);
        res.status(500).json({ error: 'Failed to fetch question', details: error.message });
    } finally {
        // Always close the driver to free resources, regardless of success or failure
        await driver.quit();  // Ensure the driver quits to free resources
    }
});

module.exports = router;

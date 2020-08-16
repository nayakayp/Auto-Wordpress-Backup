const puppeteer = require("puppeteer");
const https = require("https");
const fs = require("fs");
const path = require("path");
const datetime = new Date();
const folder = datetime.toISOString().slice(0, 10);

async function getBackup(url, username, password) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${url}/wp-login.php`);

  await page.$eval("#user_login", (elem) => elem.click());
  await page.keyboard.type(username);
  await page.keyboard.down("Tab");
  await page.keyboard.type(password);
  await page.keyboard.down("Tab");
  await page.keyboard.down("Tab");
  await page.keyboard.down("Tab");
  await page.keyboard.down("Enter");
  await page.goto(`${url}/wp-admin/edit.php`);
  await page.goto(`${url}/wp-admin/admin.php?page=ai1wm_export`);
  await page.$eval("#ai1wm-export-file", (elem) => elem.click());
  await page.waitForSelector(".ai1wm-button-green");
  await page.$eval(".ai1wm-button-green", (elem) => elem.click());
  const downloadURL = await page.$eval(
    ".ai1wm-button-green",
    (link) => link.href
  );
  await browser.close();
  console.log("Downloading........ " + downloadURL);
  await downloadFile(downloadURL);
}

function downloadFile(downloadURL) {
  const filename = path.basename(downloadURL);
  const req = https.get(downloadURL, function (res) {
    if (!fs.existsSync(`Backup\ File/${folder}`)) {
      fs.mkdirSync(`Backup\ File/${folder}`);
    }

    const fileStream = fs.createWriteStream(
      `Backup\ File/${folder}/${filename}`
    );
    res.pipe(fileStream);

    fileStream.on("error", function (err) {
      console.log(`Error writing to the stream -> ${err}`);
    });

    fileStream.on("finish", function () {
      fileStream.close();
      console.log("Done");
    });
  });
  req.on("error", function (err) {
    console.log("Error downloading the file");
    console.log(err);
  });
}

// List your website that needed backup here
getBackup("HTTPS://YOURWEBSITE.COM", "USERNAME-WP", "PASSWORD-WP");
getBackup("HTTPS://YOURWEBSITE.COM", "USERNAME-WP", "PASSWORD-WP");
getBackup("HTTPS://YOURWEBSITE.COM", "USERNAME-WP", "PASSWORD-WP");

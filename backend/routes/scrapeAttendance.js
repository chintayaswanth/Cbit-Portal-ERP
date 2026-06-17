const { chromium: playwright } = require("playwright");


const isVercel = !!process.env.VERCEL;
const isDocker = !!process.env.DOCKER_ENV;

let chromium;
if (isVercel) {
  chromium = require("@sparticuz/chromium");
}

let persistentBrowser = null;

async function getBrowser() {
  if (persistentBrowser) {
    try {
      if (persistentBrowser.isClosed()) persistentBrowser = null;
    } catch {
      persistentBrowser = null;
    }
  }

  if (!persistentBrowser) {
    const env = isVercel ? "Vercel" : isDocker ? "Docker" : "Local";
    console.log(`[attendance] Launching new browser (${env})`);

    persistentBrowser = await playwright.launch({
      args: [
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-accelerated-2d-canvas",
        "--disable-webgl",
        "--single-process",
        "--disable-extensions",
        ...(isVercel ? chromium.args : []),
      ],
      // Vercel → @sparticuz binary; Docker/Local → Playwright's own (undefined = auto)
      executablePath: isVercel ? await chromium.executablePath() : undefined,
      headless: true,
    });
  }

  return persistentBrowser;
}

/**
 * Scrapes attendance for a given user using an isolated browser context.
 */
async function scrapeAttendance(username, password) {
  let context = null;
  let page = null;
  const browser = await getBrowser();

  try {
    context = await browser.newContext({
      ignoreHTTPSErrors: true,
    });


    page = await context.newPage();
    await page.setDefaultNavigationTimeout(15000);
    await page.setDefaultTimeout(10000);


    await page.goto("https://erp.cbit.org.in/", {
      waitUntil: "domcontentloaded",
      timeout: 12000,
    });


    await page.fill("#txtUserName", username);
    await page.click("#btnNext");


    await page.waitForSelector("#txtPassword, #lblWarning", { timeout: 8000 });

    const usernameWarning = await page.locator("#lblWarning").textContent().catch(() => "");
    if (usernameWarning.includes("User Name is Incorrect")) {
      throw Object.assign(new Error("USERNAME_INCORRECT"), { code: "USERNAME_INCORRECT" });
    }


    await page.fill("#txtPassword", password);
    await page.click("#btnSubmit");


    await page.waitForSelector("#lblWarning, #ctl00_cpStud_lnkStudentMain", { timeout: 10000 });

    const passwordWarning = await page.locator("#lblWarning").textContent().catch(() => "");
    if (passwordWarning.includes("Password is Incorrect")) {
      throw Object.assign(new Error("PASSWORD_INCORRECT"), { code: "PASSWORD_INCORRECT" });
    }


    await page.click("#ctl00_cpStud_lnkStudentMain");
    await page.waitForSelector("#ctl00_cpStud_grdSubject", { timeout: 12000 });


    const [studentName, attendance] = await Promise.all([
      page.textContent("#ctl00_cpHeader_ucStud_lblStudentName").catch(() => "Student"),
      page.evaluate(() => {
        const rows = document.querySelectorAll("#ctl00_cpStud_grdSubject tr");
        const data = [];
        rows.forEach((row) => {
          const cols = row.querySelectorAll("td");
          if (cols.length < 6) return; 
          data.push(Array.from(cols).map((c) => c.innerText.trim()));
        });
        return data;
      }),
    ]);

    return {
      studentName: studentName.trim(),
      attendance,
      timestamp: new Date().toISOString(),
    };

  } catch (err) {
    console.error("[attendance] Scrape error:", err.message);
    if (!err.code) err.code = "SCRAPE_FAILED";
    throw err;
  } finally {
    if (context) {
      await context.close().catch(() => { });
    }
  }
}

process.on("SIGTERM", async () => {
  if (persistentBrowser) {
    console.log("[attendance] Shutting down persistent browser...");
    await persistentBrowser.close().catch(() => { });
    persistentBrowser = null;
  }
});

module.exports = scrapeAttendance;
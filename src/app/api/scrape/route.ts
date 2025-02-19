import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// 1) Define your inspection record interface:
interface InspectionRecord {
  make: string;
  model: string;
  year: string;
  inspectionType: string;
  dateTime: string;
  result: string;
  certificateNumber: string;
}

export async function POST(req: NextRequest) {
  try {
    const { vin } = await req.json();
    if (!vin) {
      console.log("No VIN provided in request body.");
      return NextResponse.json({ error: 'VIN is required' }, { status: 400 });
    }

    console.log("Received VIN =>", vin);

    // 2) Launch Puppeteer headful so you can solve reCAPTCHA
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    console.log("Navigating to BAR site...");

    await page.goto('https://www.bar.ca.gov/inspection', { waitUntil: 'networkidle2' });
    console.log("Page loaded, typing VIN =>", vin);

    // 3) Type the VIN
    await page.type('#LicenseOrVin', vin);

    console.log("Clicking 'View inspection history' button...");
    // 4) Click the "View inspection history" button
    await page.click('button.btn.btn-lg.btn-primary.g-recaptcha');

    // 5) Wait for at least some <p><strong> to appear (solve reCAPTCHA manually if needed)
    console.log("Waiting for 'p strong' selector...");
    await page.waitForSelector('p strong', { timeout: 30000 });

    // 6) Extract the STAR/Referee/Program info from whichever <p> has “STAR Certification Required:”
    console.log("Extracting 'STAR Certification Required' paragraph data...");
    const certInfo = await page.evaluate(() => {
      // We'll return these so we can log them in Node
      let star = '';
      let referee = '';
      let program = '';

      // Find the <p> that actually contains the strong text "STAR Certification Required:"
      const pTags = Array.from(document.querySelectorAll('p'));
      const containingParagraph = pTags.find(p => {
        // Check if ANY <strong> in this <p> includes "STAR Certification Required:"
        const strongs = Array.from(p.querySelectorAll('strong'));
        return strongs.some(s => s.textContent?.includes('STAR Certification Required:'));
      });

      if (!containingParagraph) {
        return { star, referee, program };
      }

      // Now gather all the <strong> tags in that <p>
      const strongTags = Array.from(containingParagraph.querySelectorAll('strong'));

      // Helper to get the text following each <strong> (skipping <br> or empty text nodes)
      function getFollowingText(strongEl: Element): string {
        let node = strongEl.nextSibling;
        while (node && (
          (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'BR') ||
          (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim())
        )) {
          node = node.nextSibling;
        }
        // If we landed on a text node, that should have "NO" or "ENHANCED"
        return node?.textContent?.replace(/\u00A0/g, ' ').trim() || '';
      }

      // Loop each <strong> and see which label it is
      strongTags.forEach(strongEl => {
        const label = strongEl.textContent?.replace(/\u00A0/g, ' ').trim() || '';
        const value = getFollowingText(strongEl);

        if (label.includes('STAR Certification Required:')) {
          star = value;
        } else if (label.includes('Referee Certification Required:')) {
          referee = value;
        } else if (label.includes('Program Area:')) {
          program = value;
        }
      });

      return { star, referee, program };
    });

    console.log("certInfo =>", certInfo);

    // Assign them to your final variables
    const starCertificationRequired = certInfo.star;
    const refereeCertificationRequired = certInfo.referee;
    const programArea = certInfo.program;

    // 7) Get the paragraph with "inspection result(s) for VIN #"
    console.log("Locating paragraph with 'inspection result(s) for VIN #'");
    const resultsParagraph = await page.evaluate(() => {
      const pTags = Array.from(document.querySelectorAll('p'));
      const pTag = pTags.find((p) =>
        p.innerText.includes('inspection result(s) for VIN #')
      );
      return pTag ? pTag.innerText : '';
    });

    console.log("resultsParagraph =>", resultsParagraph);

    let foundVin = vin;
    if (resultsParagraph) {
      const match = resultsParagraph.match(
        /(\d+)\s+inspection result\(s\)\s+for\s+VIN\s+#\s+(\w+)/i
      );
      if (match) {
        foundVin = match[2];
      }
    }
    console.log("foundVin =>", foundVin);

    // 8) Scrape the inspection table
    console.log("Scraping the inspection table (if it exists)...");
    let inspectionHistory: InspectionRecord[] = [];
    try {
      await page.waitForSelector('table.table.table-bordered', { timeout: 20000 });
      const rows = await page.$$eval('table.table.table-bordered tbody tr', (trs) => {
        return trs.map((tr) => {
          const tds = Array.from(tr.querySelectorAll('td'));
          return tds.map((td) => td.innerText.trim());
        });
      });

      console.log("Table rows =>", rows);
      inspectionHistory = rows.map((cells) => ({
        make: cells[0] || '',
        model: cells[1] || '',
        year: cells[2] || '',
        inspectionType: cells[3] || '',
        dateTime: cells[4] || '',
        result: cells[5] || '',
        certificateNumber: cells[6] || '',
      }));
    } catch (err) {
      console.log("No table found => 0 inspection results");
    }

    // 9) Close Puppeteer
    console.log("Closing browser...");
    await browser.close();

    // 10) Return everything
    const data = {
      vin: foundVin,
      starCertificationRequired,
      refereeCertificationRequired,
      programArea,
      inspectionHistory,
    };

    console.log("Returning final data =>", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error scraping data:', error);
    return NextResponse.json({ error: 'Failed to scrape data' }, { status: 500 });
  }
}

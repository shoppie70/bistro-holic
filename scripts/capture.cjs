/* Run with Playwright installed: node scripts/capture.cjs [output directory] */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const output = path.resolve(process.argv[2] || '/tmp/holic-preview');
const base = process.env.HOLIC_PREVIEW_URL || 'http://127.0.0.1:8000';
fs.mkdirSync(output, { recursive: true });
(async () => {
 const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
 const findings = [];
 for (const [name, width, height] of [['mobile',390,844],['desktop',1440,1000],['small',320,740]]) {
  const page = await browser.newPage({ viewport: {width,height}, isMobile: width<700, hasTouch:width<700 });
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for (const route of ['/', '/chef/', '/lunch/', '/dinner/']) {
   await page.goto(base+route,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(1500);
   const fonts = await page.evaluate(() => [...document.fonts]
    .filter(font => ['Shippori Mincho', 'Zen Kaku Gothic New'].includes(font.family))
    .map(font => ({family: font.family, weight: font.weight, status: font.status})));
   findings.push({name,route,width:await page.evaluate(()=>document.documentElement.scrollWidth), viewport:width, errors:[...errors], fonts});
   if (name==='small') continue;
   const slug=route==='/'?'home':route.replaceAll('/','');
   await page.screenshot({path:path.join(output,`${name}-${slug}.png`)});
   if (route==='/') {
    for (const [section,lead] of [['lunch',180],['dinner',180],['craft',0],['visit',0]]) {
     await page.locator(section==='craft'?'.craft':`#${section}`).scrollIntoViewIfNeeded();
     await page.evaluate(({selector,lead})=>{const el=document.querySelector(selector);scrollTo(0,el.getBoundingClientRect().top+scrollY-lead)},{selector:section==='craft'?'.craft':`#${section}`,lead});
     await page.waitForTimeout(1400);
     await page.screenshot({path:path.join(output,`${name}-home-${section}.png`)});
    }
    if(name==='mobile'){
     await page.goto(base,{waitUntil:'networkidle'});
     await page.getByRole('button',{name:'メニューを開く'}).click();
     await page.waitForTimeout(500);
     await page.screenshot({path:path.join(output,'mobile-navigation.png')});
     if(!await page.locator('dialog').isVisible())throw Error('Menu did not open');
     await page.keyboard.press('Escape');
     if(await page.locator('dialog').isVisible())throw Error('Escape did not close menu');
     await page.getByRole('button',{name:'メニューを開く'}).click();
     await page.locator('dialog').getByRole('link',{name:'Our story 店主のこだわり'}).click();
     await page.waitForURL('**/chef/');
     if(!await page.getByRole('heading',{name:'店主のこだわり',exact:true}).isVisible())throw Error('Story navigation failed');
    }
   }
  }
  await page.close();
 }
 const reduced = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto(base,{waitUntil:'networkidle'});
 if(await reduced.locator('html').evaluate(el=>el.classList.contains('motion-ready')))throw Error('Reduced motion was not respected');
 await reduced.locator('#lunch').scrollIntoViewIfNeeded();
 findings.push({reducedMotion:true,hiddenReveals:await reduced.locator('.reveal-pending').count()});
 await reduced.close();
 const nojs = await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
 await nojs.goto(base,{waitUntil:'networkidle'});
 findings.push({javascriptDisabled:true,hiddenReveals:await nojs.locator('.reveal-pending').count()});
 await nojs.close();
 await browser.close();
 fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(findings,null,2));
 console.log(JSON.stringify(findings));
 if(findings.some(f=>f.width>f.viewport || f.errors?.length || f.hiddenReveals))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1});

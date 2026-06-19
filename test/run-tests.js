const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const results = {
  selenium: {
    start: null,
    end: null,
    duration: 0,
    status: 'FAIL',
    passed: 0,
    failed: 0,
    classXml: '',
    message: '',
    stack: ''
  },
  cypress: {
    start: null,
    end: null,
    duration: 0,
    status: 'FAIL',
    message: '',
    stack: ''
  }
};

function runJavaSelenium() {
  return new Promise((resolve) => {
    const start = new Date();
    results.selenium.start = start;
    
    console.log('\n==========================================');
    console.log('RUNNING JAVA SELENIUM TESTS (MAVEN)...');
    console.log('==========================================\n');
    
    const child = spawn('mvn', ['clean', 'test'], { 
      cwd: path.join(__dirname, 'selenium-java'), 
      shell: true 
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      output += data;
      process.stdout.write(data);
    });
    
    child.stderr.on('data', (data) => {
      errorOutput += data;
      process.stderr.write(data);
    });
    
    child.on('close', (code) => {
      const end = new Date();
      results.selenium.end = end;
      results.selenium.duration = end - start;
      
      console.log(`\nMaven finished with exit code ${code}`);
      
      // Attempt to parse maven testng-results.xml
      const testngResultsPath = path.join(__dirname, 'selenium-java', 'target', 'surefire-reports', 'testng-results.xml');
      if (fs.existsSync(testngResultsPath)) {
        try {
          const xmlContent = fs.readFileSync(testngResultsPath, 'utf8');
          
          // Extract passed/failed metrics
          const passedMatch = xmlContent.match(/passed="(\d+)"/);
          const failedMatch = xmlContent.match(/failed="(\d+)"/);
          
          results.selenium.passed = passedMatch ? parseInt(passedMatch[1], 10) : 0;
          results.selenium.failed = failedMatch ? parseInt(failedMatch[1], 10) : 0;
          
          if (results.selenium.failed === 0 && results.selenium.passed > 0) {
            results.selenium.status = 'PASS';
          } else {
            results.selenium.status = 'FAIL';
          }
          
          // Extract the `<class name="com.cars24.tests.SeleniumE2ETest"> ... </class>` blocks
          const startIdx = xmlContent.indexOf('<class name="com.cars24.tests.SeleniumE2ETest">');
          const endIdx = xmlContent.indexOf('</class>', startIdx) + 8;
          if (startIdx !== -1 && endIdx !== -1) {
            results.selenium.classXml = xmlContent.substring(startIdx, endIdx);
          } else {
            results.selenium.classXml = '';
          }
          
          console.log(`Parsed Java Selenium XML: Passed=${results.selenium.passed}, Failed=${results.selenium.failed}`);
        } catch (e) {
          console.error('Error parsing java testng-results.xml:', e);
          results.selenium.status = 'FAIL';
        }
      }
      
      // Fallback if compilation or execution failed and XML was not generated
      if (!results.selenium.classXml) {
        results.selenium.status = 'FAIL';
        results.selenium.passed = 0;
        results.selenium.failed = 1;
        results.selenium.classXml = `
      <class name="com.cars24.tests.SeleniumE2ETest">
        <test-method signature="all_6_apis" status="FAIL" duration-ms="${results.selenium.duration}" name="Selenium_Java_E2E_API_Flows" started-at="${start.toISOString()}" finished-at="${end.toISOString()}">
          <exception class="java.lang.Exception">
            <message><![CDATA[Maven execution or compilation failed. Exit code: ${code}]]></message>
            <stack-trace><![CDATA[${errorOutput || output || 'No logs captured'}]]></stack-trace>
          </exception>
        </test-method>
      </class>`;
      }
      
      resolve();
    });
  });
}

function runCypress() {
  return new Promise((resolve) => {
    const start = new Date();
    results.cypress.start = start;
    
    console.log('\n==========================================');
    console.log('RUNNING CYPRESS E2E TESTS...');
    console.log('==========================================\n');
    
    const child = spawn('npx', ['cypress', 'run', '--spec', 'cypress/e2e/all_6_apis.cy.js'], { 
      cwd: path.join(__dirname, 'cypress'), 
      shell: true 
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      output += data;
      process.stdout.write(data);
    });
    
    child.stderr.on('data', (data) => {
      errorOutput += data;
      process.stderr.write(data);
    });
    
    child.on('close', (code) => {
      const end = new Date();
      results.cypress.end = end;
      results.cypress.duration = end - start;
      
      if (code === 0) {
        results.cypress.status = 'PASS';
        console.log('\n✅ Cypress tests finished with exit code 0');
      } else {
        results.cypress.status = 'FAIL';
        results.cypress.message = `Cypress tests failed with exit code ${code}`;
        results.cypress.stack = errorOutput || output || 'Unknown failure';
        console.log(`\n❌ Cypress tests failed with exit code ${code}`);
      }
      resolve();
    });
  });
}

function generateTestNGReport() {
  let seleniumPassed = results.selenium.passed;
  let seleniumFailed = results.selenium.failed;
  
  let cypressPassed = results.cypress.status === 'PASS' ? 1 : 0;
  let cypressFailed = results.cypress.status === 'PASS' ? 0 : 1;
  
  const total = seleniumPassed + seleniumFailed + cypressPassed + cypressFailed;
  const passed = seleniumPassed + cypressPassed;
  const failed = seleniumFailed + cypressFailed;
  
  const suiteStart = results.selenium.start < results.cypress.start ? results.selenium.start : results.cypress.start;
  const suiteEnd = results.selenium.end > results.cypress.end ? results.selenium.end : results.cypress.end;
  const suiteDuration = suiteEnd - suiteStart;
  
  const buildCypressExceptionNode = () => {
    if (results.cypress.status === 'PASS') return '';
    // Escape CDATA end marker if it somehow appears in the error logs
    const safeStack = results.cypress.stack.replace(/]]>/g, ']]&gt;');
    const safeMessage = results.cypress.message.replace(/]]>/g, ']]&gt;');
    return `
          <exception class="java.lang.AssertionError">
            <message>
              <![CDATA[${safeMessage}]]>
            </message>
            <stack-trace>
              <![CDATA[${safeStack}]]>
            </stack-trace>
          </exception>`;
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testng-results ignored="0" total="${total}" passed="${passed}" failed="${failed}" skipped="0">
  <reporter-output>
  </reporter-output>
  <suite started-at="${suiteStart.toISOString()}" name="Cars24_E2E_Suite" finished-at="${suiteEnd.toISOString()}" duration-ms="${suiteDuration}">
    <groups>
    </groups>
    <test started-at="${suiteStart.toISOString()}" name="E2E_Tests" finished-at="${suiteEnd.toISOString()}" duration-ms="${suiteDuration}">
      ${results.selenium.classXml}
      <class name="Cypress_E2E_Tests">
        <test-method signature="all_6_apis.cy.js" status="${results.cypress.status}" duration-ms="${results.cypress.duration}" name="Cypress_E2E_API_Flows" started-at="${results.cypress.start.toISOString()}" finished-at="${results.cypress.end.toISOString()}">${buildCypressExceptionNode()}
        </test-method>
      </class>
    </test>
  </suite>
</testng-results>
`;

  const reportDir = path.join(__dirname, 'target', 'surefire-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  const reportPath = path.join(reportDir, 'testng-results.xml');
  fs.writeFileSync(reportPath, xml, 'utf8');
  console.log(`\n==========================================`);
  console.log(`Unified TestNG XML report generated:`);
  console.log(reportPath);
  console.log(`==========================================\n`);
}

async function main() {
  try {
    await runJavaSelenium();
    await runCypress();
    
    generateTestNGReport();
    
    if (results.selenium.status === 'FAIL' || results.cypress.status === 'FAIL') {
      console.log('One or more test suites failed.');
      process.exit(1);
    } else {
      console.log('All test suites passed successfully.');
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error running tests:', error);
    process.exit(1);
  }
}

main();

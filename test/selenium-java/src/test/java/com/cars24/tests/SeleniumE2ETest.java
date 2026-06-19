package com.cars24.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.time.Duration;
import java.util.List;

public class SeleniumE2ETest {
    private WebDriver driver;
    private WebDriverWait wait;
    private final String baseUrl = "http://localhost:3000";
    private final String uniqueEmail = "sel_java_" + System.currentTimeMillis() + "@test.com";
    private final String password = "dealer123";
    private final String carTitle = "Selenium Java Car " + System.currentTimeMillis();

    @BeforeClass
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1280,800");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @Test(priority = 1)
    public void testRegistration() {
        System.out.println("1. Testing Registration UI...");
        driver.get(baseUrl + "/register");
        
        WebElement nameInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name=\"name\"]")));
        nameInput.sendKeys("Selenium Java Automator");
        driver.findElement(By.cssSelector("input[name=\"email\"]")).sendKeys(uniqueEmail);
        driver.findElement(By.cssSelector("input[name=\"password\"]")).sendKeys(password);
        driver.findElement(By.cssSelector("input[placeholder=\"Confirm Password\"]")).sendKeys(password);
        
        WebElement roleSelect = driver.findElement(By.cssSelector("select[name=\"role\"]"));
        Select select = new Select(roleSelect);
        select.selectByValue("dealer");
        
        driver.findElement(By.cssSelector("button.register-button")).click();
        
        wait.until(ExpectedConditions.urlContains("/login"));
        System.out.println("✅ Registration Successful: Redirected to /login");
    }

    @Test(priority = 2, dependsOnMethods = {"testRegistration"})
    public void testLogin() {
        System.out.println("\n2. Testing Login UI...");
        driver.get(baseUrl + "/dealer-login");
        
        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name=\"email\"]")));
        emailInput.sendKeys(uniqueEmail);
        driver.findElement(By.cssSelector("input[name=\"password\"]")).sendKeys(password);
        
        WebElement loginSubmit = driver.findElement(By.cssSelector("button[type=\"submit\"]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", loginSubmit);
        
        wait.until(ExpectedConditions.urlContains("/dealers"));
        System.out.println("✅ Login Successful: Redirected to /dealers dashboard");
    }

    @Test(priority = 3, dependsOnMethods = {"testLogin"})
    public void testGetCars() {
        System.out.println("\n3. Testing Get Cars UI...");
        driver.get(baseUrl + "/dealers");
        
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".main .carImage")));
        List<WebElement> cars = driver.findElements(By.cssSelector(".main .carImage"));
        System.out.println("✅ Get Cars Successful: Found " + cars.size() + " cars on dashboard");
        Assert.assertTrue(cars.size() > 0, "Cars should be present on the dashboard");
    }

    @Test(priority = 4, dependsOnMethods = {"testLogin"})
    public void testAddCar() {
        System.out.println("\n4. Testing Add Car UI...");
        driver.get(baseUrl + "/dealers");

        // Inject Cloudinary mock on dealers page to prepare for transition
        ((JavascriptExecutor) driver).executeScript(
            "window.cloudinary = {" +
            "  createUploadWidget: (options, callback) => {" +
            "    return {" +
            "      open: () => {" +
            "        callback(null, {" +
            "          event: 'success'," +
            "          info: { secure_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=2070' }" +
            "        });" +
            "      }," +
            "      destroy: () => {}" +
            "    };" +
            "  }" +
            "};"
        );

        WebElement addCarLink = driver.findElement(By.xpath("//a[contains(text(), 'Add New car')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", addCarLink);

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name=\"title\"]")));

        // Re-inject Cloudinary stub on the active /add-car page context
        ((JavascriptExecutor) driver).executeScript(
            "window.cloudinary = {" +
            "  createUploadWidget: (options, callback) => {" +
            "    return {" +
            "      open: () => {" +
            "        callback(null, {" +
            "          event: 'success'," +
            "          info: { secure_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=2070' }" +
            "        });" +
            "      }," +
            "      destroy: () => {}" +
            "    };" +
            "  }" +
            "};"
        );

        WebElement uploadWidget = driver.findElement(By.cssSelector("#upload_widget"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", uploadWidget);

        WebElement imageInput = driver.findElement(By.cssSelector("input[name=\"image\"]"));
        wait.until(d -> {
            String val = imageInput.getAttribute("value");
            return val != null && val.contains("http");
        });

        WebElement searchInput = driver.findElement(By.cssSelector("input[placeholder*=\"Type to search\"]"));
        ((JavascriptExecutor) driver).executeScript(
            "const el = arguments[0];" +
            "const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;" +
            "setter.call(el, 'City');" +
            "el.dispatchEvent(new Event('input', { bubbles: true }));",
            searchInput
        );

        WebElement firstModelCard = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".search-div .card")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", firstModelCard);

        driver.findElement(By.cssSelector("input[name=\"title\"]")).sendKeys(carTitle);
        driver.findElement(By.cssSelector("textarea[name=\"description\"]")).sendKeys("Java automated car via TestNG.");
        driver.findElement(By.cssSelector("input[name=\"price\"]")).sendKeys("3100000");
        driver.findElement(By.cssSelector("input[name=\"kmOnOdometer\"]")).sendKeys("15000");
        driver.findElement(By.cssSelector("input[name=\"majorScratches\"]")).sendKeys("None");
        driver.findElement(By.cssSelector("input[name=\"accidentsReported\"]")).sendKeys("0");
        driver.findElement(By.cssSelector("input[name=\"previousBuyers\"]")).sendKeys("1");
        driver.findElement(By.cssSelector("input[name=\"registrationPlace\"]")).sendKeys("Chennai");

        WebElement paintSelect = driver.findElement(By.cssSelector("select[name=\"originalPaint\"]"));
        paintSelect.sendKeys("Yes");

        WebElement submitBtn = driver.findElement(By.xpath("//button[contains(text(), 'ADD')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitBtn);

        wait.until(ExpectedConditions.urlContains("/dealer-cars"));
        System.out.println("✅ Add Car Successful: Redirected to /dealer-cars");
    }

    @Test(priority = 5, dependsOnMethods = {"testAddCar"})
    public void testEditCar() {
        System.out.println("\n5. Testing Edit Car UI...");
        driver.get(baseUrl + "/dealers");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".main .carImage")));

        WebElement myCarsLink = driver.findElement(By.xpath("//a[contains(text(), 'My Cars')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", myCarsLink);

        By carTitleLocator = By.xpath("//h3[contains(text(), '" + carTitle + "')]");
        wait.until(ExpectedConditions.visibilityOfElementLocated(carTitleLocator));

        WebElement editBtn = driver.findElement(By.xpath("//h3[contains(text(), '" + carTitle + "')]/parent::div//button[contains(text(), 'Edit Car')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", editBtn);

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[name=\"price\"]")));
        WebElement priceInput = driver.findElement(By.cssSelector("input[name=\"price\"]"));
        priceInput.clear();
        priceInput.sendKeys("3250000");

        WebElement updateBtn = driver.findElement(By.cssSelector("button[type=\"submit\"]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", updateBtn);

        wait.until(ExpectedConditions.urlContains("/dealer-cars"));
        System.out.println("✅ Edit Car Successful: Price updated and redirected to /dealer-cars");
    }

    @Test(priority = 6, dependsOnMethods = {"testEditCar"})
    public void testDeleteCar() {
        System.out.println("\n6. Testing Delete Car UI...");
        driver.get(baseUrl + "/dealer-cars");
        
        By targetCarTitleLocator = By.xpath("//h3[contains(text(), '" + carTitle + "')]");
        wait.until(ExpectedConditions.visibilityOfElementLocated(targetCarTitleLocator));

        ((JavascriptExecutor) driver).executeScript("window.confirm = function() { return true; }");

        WebElement deleteBtn = driver.findElement(By.xpath("//h3[contains(text(), '" + carTitle + "')]/parent::div//button[contains(text(), 'Delete Car')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", deleteBtn);

        wait.until(ExpectedConditions.invisibilityOfElementLocated(targetCarTitleLocator));
        System.out.println("✅ Delete Car Successful: Car removed from inventory page.");
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}

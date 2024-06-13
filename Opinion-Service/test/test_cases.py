import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By

URL = "http://localhost:4200"


@pytest.fixture(scope="function")
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    yield driver
    
    driver.quit()


def test_open_page(driver: webdriver.Chrome):
    driver.get(URL)
    assert "OpinionSite" in driver.title
    

def test_add_opinion(driver: webdriver.Chrome):
    driver.get(URL)
    driver.find_element(By.CLASS_NAME, "mdc-button__label").click()

    
    title = driver.find_element(By.ID, "mat-mdc-dialog-title-0").text
    
    
    driver.find_element(By.ID, "mat-input-0").send_keys("Test Opinion")
    
    
    assert title == "Add Opinion"
    

def test_select_pagination(driver: webdriver.Chrome):
    driver.get(URL)
    triggers = driver.find_elements(By.CLASS_NAME, "mat-mdc-select-trigger")
    triggers[2].click()
    
    
    driver.find_element(By.ID, "mat-option-7").click()
    
    
    label = driver.find_element(By.CLASS_NAME, "mat-mdc-paginator-range-label").text
    
    
    assert label == "1 – 5 of 5"
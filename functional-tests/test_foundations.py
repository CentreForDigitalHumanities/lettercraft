def test_lettercraft_frontend(browser, base_address):
    browser.get(base_address)
    assert 'Lettercraft & Epistolary Performance in Medieval Europe' in browser.title


def test_lettercraft_admin(browser, admin_address):
    browser.get(admin_address)
    assert 'Django' in browser.title


def test_lettercraft_api(browser, api_address):
    browser.get(api_address)
    assert 'Lettercraft & Epistolary Performance in Medieval Europe' in browser.title


def test_lettercraft_api_auth(browser, api_auth_address):
    browser.get(api_auth_address + 'login/')
    assert 'Django REST framework' in browser.title

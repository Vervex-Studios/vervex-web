function loadLayoutFragments() {
    // force absolute path routing for fragment delivery across directories
    var basePath = '/vervatinus';
    var headerEl = document.getElementById('header-placeholder');
    var footerEl = document.getElementById('footer-placeholder');
    if (headerEl) {
        fetch(basePath + '/header.html').then(r => r.text()).then(d => { 
            headerEl.innerHTML = d; 
            applyNavigationLocalization(); 
            applyUserPreferences(); 
            updateFooterChatLink(); 
        });
    }
    if (footerEl) {
        fetch(basePath + '/footer.html').then(r => r.text()).then(d => { 
            footerEl.innerHTML = d; 
            applyUserPreferences(); 
            updateFooterChatLink(); 
        });
    }
}
loadLayoutFragments();

function externalWarning(target) {
    var destination = "";
    if (target === 'bluesky') {
        destination = "https://bsky.app/profile/vervex.hu";
    } else if (target === 'spacehey') {
        destination = "https://im.spacehey.com";
    }
    return confirm("you are leaving this site to go to " + destination + ". are you sure?");
}

function updateFooterChatLink() {
    var footer = document.getElementById('vervatinus-footer');
    if (footer) {
        var links = footer.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            if (links[i].href.indexOf('contactus.html') !== -1) {
                links[i].href = "https://im.spacehey.com";
                links[i].onclick = function() { return externalWarning('spacehey'); };
                links[i].innerHTML = "chat";
            }
        }
    }
}

function setVervatinusCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function getVervatinusCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function applyUserPreferences() {
    var currentBg = getVervatinusCookie('v_bg') || 'dark';
    var currentLang = getVervatinusCookie('v_lang') || 'UK';
   
    var bgVal = '#121212';
    var textVal = '#ffffff';
    var subBgVal = '#1a1a1a';
    var borderVal = '#222222';
    var navTextVal = '#cccccc';
   
    if (currentBg === 'black') {
        bgVal = '#000000';
        textVal = '#ffffff';
        subBgVal = '#111111';
        borderVal = '#222222';
        navTextVal = '#aaaaaa';
    } else if (currentBg === 'white') {
        bgVal = '#ffffff';
        textVal = '#111111';
        subBgVal = '#eeeeee';
        borderVal = '#cccccc';
        navTextVal = '#444444';
    }
   
    // only override background if specific page setup lets cookies take total priority
    var skipGlobalBg = document.getElementById('market-sky-wrapper');
    if (!skipGlobalBg && document.body) {
        document.body.style.backgroundColor = bgVal;
        document.body.style.color = textVal;
    }
   
    var header = document.getElementById('vervatinus-header');
    if (header) {
        header.style.backgroundColor = subBgVal;
        header.style.borderBottomColor = '#38bdf8';
        var headerLinks = header.getElementsByTagName('a');
        for(var i=0; i<headerLinks.length; i++) {
            if(headerLinks[i].id !== 'nav-brand') {
                headerLinks[i].style.color = navTextVal;
            }
        }
    }
   
    var footer = document.getElementById('vervatinus-footer');
    if (footer) {
        footer.style.backgroundColor = subBgVal;
        footer.style.borderTopColor = borderVal;
        var footerDivs = footer.getElementsByTagName('div');
        for(var j=0; j<footerDivs.length; j++) {
            footerDivs[j].style.color = textVal;
        }
    }
   
    var transTable = translationDictionary[currentLang];
    if (!transTable) return;
    for (var elementId in transTable) {
        var el = document.getElementById(elementId);
        if (el) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = transTable[elementId];
            } else {
                el.innerHTML = transTable[elementId];
            }
        }
    }
}

function applyNavigationLocalization() {
    var currentLang = getVervatinusCookie('v_lang') || 'UK';
    var transTable = translationDictionary[currentLang];
    if (!transTable) return;
    
    var navIds = ['nav-home', 'nav-apps', 'nav-weather', 'nav-maps', 'nav-news', 'nav-devices', 'nav-settings', 'nav-help'];
    navIds.forEach(function(id) {
        var el = document.getElementById(id);
        if (el && transTable[id]) {
            el.innerHTML = transTable[id];
        }
    });
}

var translationDictionary = {
    "UK": {
        "nav-home": "home", 
        "nav-apps": "apps", 
        "nav-weather": "weather", 
        "nav-maps": "maps", 
        "nav-news": "news", 
        "nav-devices": "devices", 
        "nav-settings": "settings",
        "nav-help": "help"
    },
    "US": {
        "nav-home": "home", 
        "nav-apps": "apps", 
        "nav-weather": "weather", 
        "nav-maps": "maps", 
        "nav-news": "news", 
        "nav-devices": "devices", 
        "nav-settings": "settings",
        "nav-help": "help"
    },
    "HU": {
        "nav-home": "kezdolap", 
        "nav-apps": "alkalmazasok", 
        "nav-weather": "idojaras", 
        "nav-maps": "terkep", 
        "nav-news": "hirek", 
        "nav-devices": "eszkozok", 
        "nav-settings": "beallitasok",
        "nav-help": "segítség"
    }
};
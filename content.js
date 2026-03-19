// Ce script gère l'état actif/inactif

// 1. Charge l'état au démarrage
chrome.storage.sync.get(['minimalistEnabled'], function(result) {
    const isEnabled = result.minimalistEnabled !== false; // true par défaut
    toggleMinimalistMode(isEnabled);
});

// 2. Écoute les changements venant du popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggle") {
        toggleMinimalistMode(request.enabled);
        sendResponse({status: "done"});
    }
});

function toggleMinimalistMode(enabled) {
    // Cible <html> pour une application instantanée sans "flash" de contenu
    const target = document.documentElement; 

    if (enabled) {
        target.classList.add('minimalist-mode');
        console.log("Minimalist YouTube: ON");
    } else {
        target.classList.remove('minimalist-mode');
        console.log("Minimalist YouTube: OFF");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const statusText = document.getElementById('statusText');

    // 1. Charge l'état actuel
    chrome.storage.sync.get(['minimalistEnabled'], function(result) {
        const isEnabled = result.minimalistEnabled !== false;
        toggleSwitch.checked = isEnabled;
        updateStatusText(isEnabled);
    });

    // 2. Gére le changement
    toggleSwitch.addEventListener('change', function() {
        const isEnabled = toggleSwitch.checked;
        
        chrome.storage.sync.set({ minimalistEnabled: isEnabled });
        updateStatusText(isEnabled);
        
        // Envoi sécurisé du message
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTab = tabs[0];
            
            if (activeTab && activeTab.url && activeTab.url.includes("youtube.com")) {
                chrome.tabs.sendMessage(activeTab.id, {
                    action: "toggle", 
                    enabled: isEnabled
                }, (response) => {
                    // Gestion d'erreur silencieuse si le script n'est pas prêt
                    if (chrome.runtime.lastError) {
                        console.log("Extension non active sur cette page ou rechargement nécessaire.");
                    }
                });
            }
        });
    });

    function updateStatusText(enabled) {
        statusText.textContent = enabled ? "Activé" : "Désactivé";
        statusText.style.color = enabled ? "#333" : "#999";
    }
});

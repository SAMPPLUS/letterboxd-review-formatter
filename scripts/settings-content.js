const settings_container = document.querySelector('.app-available-settings');
const SETTINGS_CLASSLIST = ["body-text", "-small"];


const settingsCallback = (mutationList, observer) =>{  
    settings_text_area = settings_container.querySelector('textarea');
    if(!settings_text_area){
        return;
    }
    observer.disconnect();
    insertFormatRow(settings_text_area, SETTINGS_CLASSLIST);
}





const settings_observer = new MutationObserver(settingsCallback);
var config = { attributes: true, childList: true, subtree: true };
var settings_text_area = settings_container.querySelector('textarea');

if(settings_text_area) insertFormatRow(settings_text_area, SETTINGS_CLASSLIST);
else settings_observer.observe(settings_container, config);




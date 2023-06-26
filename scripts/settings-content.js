const SETTINGS_CLASSLIST = ["body-text", "-small"];

waitForElm('.app-available-settings').then((container)=>{
    waitForElm('textarea', container).then((text_area) => {
        insertFormatRow(text_area, SETTINGS_CLASSLIST);
    });
});




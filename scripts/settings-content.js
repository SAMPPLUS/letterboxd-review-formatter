const settings_container = document.querySelector('.app-available-settings');
var aside = document.querySelector('#user-update').querySelector('aside');
var settings_text_area;

function settingsBuildPreview(){
    let preview = document.createElement('div');
    preview.classList.add('form-row');
    let preview_label = document.createElement('label');
    preview_label.innerText = "Bio Preview";
    preview_label.style['margin-left'] = "6px";
    let preview_text = document.createElement('div');
    preview_text.classList.add( "body-text", "-small");
    preview_text.style.color="#cde";
    preview.appendChild(preview_label);
    preview.appendChild(preview_text);
    return preview;
}

function settingsPopulatePreview(){
    if(settings_text_area.value == ""){
        settings_preview_area.parentElement.style.display="none";
        return;
    }
    settings_preview_area.parentElement.style.display="";
    populatePreviewArea(settings_text_area, settings_preview_area);
}

function insertElements(){
    settings_text_area = settings_container.querySelector('textarea');
    insertFormatRow(settings_text_area);
    let preview= settingsBuildPreview();
    aside.insertAdjacentElement('beforeend',preview);
    preview_area = preview.querySelector('.body-text');
    let p_offset = (settings_text_area.offsetParent.offsetTop + settings_text_area.offsetParent.offsetParent.offsetTop - preview.offsetTop) + "px";
    preview.style['margin-top'] = p_offset;

    settings_text_area.addEventListener('input', function(event){
        settingsPopulatePreview();
    });
    settingsPopulatePreview();
};


insertElements();


var settings_frmt_row = buildFormatRow();

function createPreviewArea(){
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
    if(text_area.value == ""){
        preview_area.parentElement.style.display="none";
        return;
    }
    preview_area.parentElement.style.display="";
    populatePreviewArea();
}

function insertElements(){
    text_area = settings_container.querySelector('textarea');
    console.log(text_area);
    
    text_area.insertAdjacentElement('afterend', settings_frmt_row);
    settings_container.querySelector('#frmt-row').style['margin-top'] = "4px";

    addFormatButtonsListeners(settings_container, ['bold','italic','quote']);
    addHyperlinkButtonListener(settings_container);

    addKeyboardShortcuts();

    let preview= createPreviewArea();
    aside.insertAdjacentElement('beforeend',preview);
    preview_area = preview.querySelector('.body-text');
    let p_offset = (text_area.offsetParent.offsetTop + text_area.offsetParent.offsetParent.offsetTop - preview.offsetTop) + "px";
    preview.style['margin-top'] = p_offset;

    text_area.addEventListener('input', function(event){
        settingsPopulatePreview();
    });
    settingsPopulatePreview();
};

const settings_container = document.querySelector('.app-available-settings');
var aside = document.querySelector('#user-update').querySelector('aside');


fetch(chrome.runtime.getURL('/resources/format-row.html')).then(r => r.text()).then(html => {
    format_row_html = html;
    insertElements();
  });


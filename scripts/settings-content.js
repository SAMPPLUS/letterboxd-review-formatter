//console.log("HELLO SETTINGS");

var format_row_html = "";
var text_area = null;


function createPreviewArea(){
    let preview = document.createElement('div');
    preview.classList.add( "review", "body-text", "-prose", "-loose");
    preview.style.color="#cde";
    preview.style['padding-left'] = "10px";
    preview.style["margin-bottom"] = "15px";
    preview.style["textAlign"] = "center";
    if(text_area != null){
        preview.innerHtml = text_area.value;
    }
    return preview;
}

function insertElements(){
    text_area = settings_container.querySelector('textarea');
    console.log(text_area);
    
    text_area.insertAdjacentHTML('afterend', format_row_html);

    addFormatButtonsListeners(settings_container, ['bold','italic','quote']);
    addHyperlinkButtonListener(settings_container);

    addKeyboardShortcuts();

    preview_area= createPreviewArea();
    aside.insertAdjacentElement('beforeend',preview_area);

    text_area.addEventListener('click', function(event){
        populatePreviewArea();
    });
    populatePreviewArea();
};

const settings_container = document.querySelector('.app-available-settings');
var aside = document.querySelector('#user-update').querySelector('aside');


fetch(chrome.runtime.getURL('/resources/format-row.html')).then(r => r.text()).then(html => {
    format_row_html = html;
    insertElements();
  });


var preview_area = null;


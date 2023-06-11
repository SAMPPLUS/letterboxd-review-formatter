var format_row_html = "";

var text_area = null;
var preview_area = null;

fetch(chrome.runtime.getURL('/resources/format-row.html')).then(r => r.text()).then(html => {
    format_row_html = html;
  });


function createPreviewArea(){
    let preview = document.createElement('div');
    preview.classList.add( "review", "body-text", "-prose", "-loose");
    preview.style.color="#cde";
    preview.style.display="none";
    preview.style['padding-left'] = "10px";
    preview.style["border-left"] = "1px #9ab solid";
    preview.style["margin-bottom"] = "15px";
    if(text_area != null){
        preview.innerHtml = text_area.value;
    }
    return preview;
}



function updateModal(){
    var form_row = (text_area.closest('.form-row')||text_area.closest('.row'));
    var fieldset = form_row.closest('fieldset');

    text_area.parentElement.style['margin-bottom'] = "5px";

    //add format buttons
    form_row.insertAdjacentHTML('afterend', format_row_html);

    //add button listeners
    //bold
    addButtonListener(cbox_wrapper, SELECTORS.bold,...TAGS.bold);
    //italic
    addButtonListener(cbox_wrapper, SELECTORS.italic,...TAGS.italic);
    //quote
    addButtonListener(cbox_wrapper, SELECTORS.quote,...TAGS.quote);

    //link
    addHyperlinkButtonListener(cbox_wrapper);

    //add preview
    preview_area = createPreviewArea();
    fieldset.insertAdjacentElement('afterbegin', preview_area);

    //add preview button
    (fieldset.querySelector('.button-delete') || fieldset.querySelector('.button-cancel')).parentElement.insertAdjacentHTML('beforeend', '<a href="#" id="frmt-preview" aria-label="preview" class="button right" style="">preview</a>');
    var preview_btn = fieldset.querySelector('#frmt-preview');

    //mark all rows that will be hidden when showing prview
    for(let i=0; i<fieldset.children.length-1; i++){
        var el = fieldset.children[i];
        if(!el.querySelector('#frmt-preview')){
            el.classList.add('nonpreview');
        }
    }

    preview_btn.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    preview_btn.addEventListener('click', function(event) {
        event.preventDefault();
        populatePreviewArea();
        var h = 0;

        var nonpreview = fieldset.querySelectorAll('.nonpreview');
        nonpreview.forEach((el) => {
            if (el.style.display === "none") {
                el.style.display = "block";
              } else {
                h+= el.offsetHeight;
                el.style.display = "none";
              }
        });

        preview_area.style['min-height'] = h.toString() + "px";
        if (preview_btn.innerHTML=='preview'){
            preview_btn.innerHTML = 'edit';
        }
        else{
            preview_btn.innerHTML = 'preview';
        }
    });
    //prevent scroll overflow
    cbox_wrapper.querySelector('#cboxLoadedContent').style.height = "";
    fieldset.closest('section').style.display = "none";
    fieldset.closest('section').style.display = "block";
}

const cboxCallback = () => {
    cbox_wrapper.querySelector('#cboxContent').style.height= "";
    text_area = cbox_wrapper.querySelector('#frm-review');
    var format_row = cbox_wrapper.querySelector('#frmt-row');
    if((!text_area) || (format_row)){
        return;
    }
    updateModal();
};

addKeyboardShortcuts();
const cbox_wrapper = document.getElementById("cboxWrapper");
const config = { attributes: true, childList: true, subtree: false };
const cbox_observer = new MutationObserver(cboxCallback);
cbox_observer.observe(cbox_wrapper, config);

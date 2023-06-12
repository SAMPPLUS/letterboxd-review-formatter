var modal_text_area = null;
var modal_frmt_row = buildFormatRow();



function createPreviewArea(){
    let preview = document.createElement('div');
    preview.classList.add( "review", "body-text", "-prose", "-loose");
    preview.style.color="#cde";
    preview.style.display="none";
    preview.style['padding-left'] = "10px";
    preview.style["border-left"] = "1px #9ab solid";
    preview.style["margin-bottom"] = "15px";
    if(modal_text_area != null){
        preview.innerHtml = modal_text_area.value;
    }
    return preview;
}



function updateModal(){
    var form_row = (modal_text_area.closest('.form-row')||modal_text_area.closest('.row'));
    var fieldset = form_row.closest('fieldset');

    modal_text_area.parentElement.style['margin-bottom'] = "5px";

    //add format buttons
    form_row.insertAdjacentElement('afterend', modal_frmt_row);

    

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
    //add button listeners
    addFormatButtonsListeners(cbox_wrapper, ['bold','italic','quote']);
    addHyperlinkButtonListener(cbox_wrapper);
    //prevent scroll overflow
    cbox_wrapper.querySelector('#cboxLoadedContent').style.height = "";
    fieldset.closest('section').style.display = "none";
    fieldset.closest('section').style.display = "block";
}

const cboxCallback = () => {
    cbox_wrapper.querySelector('#cboxContent').style.height= "";
    modal_text_area = cbox_wrapper.querySelector('#frm-review');
    var format_row = cbox_wrapper.querySelector('#frmt-row');
    if((!modal_text_area) || (format_row)){
        return;
    }
    text_areas.add(modal_text_area);
    updateModal();
};

addKeyboardShortcuts();
const cbox_wrapper = document.getElementById("cboxWrapper");
var config = { attributes: true, childList: true, subtree: false };
const cbox_observer = new MutationObserver(cboxCallback);
cbox_observer.observe(cbox_wrapper, config);

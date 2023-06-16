var modal_text_area = null;
var modal_frmt_row = buildFormatRow();
var fieldset = null;
var preview_area = null;
var preview_btn = null;



function createPreviewArea(){
    let preview = document.createElement('div');
    preview.classList.add( "review", "body-text", "-prose", "-loose");
    preview.style.color="#cde";
    preview.style.display="none";
    preview.style['padding-left'] = "10px";
    preview.style["border-left"] = "1px #9ab solid";
    preview.style["margin-bottom"] = "15px";
    //preview.id="preview-area";
    if(modal_text_area != null){
        preview.innerHtml = modal_text_area.value;
    }
    return preview;
}

function swapPreviewVis(show_prev){
    if(fieldset == null || preview_area == null || preview_btn==null){
        return;
    }
    if(show_prev === undefined){
        show_prev = (preview_area.style.display=="none");
    }
    var h = 0;
    var nonpreview = fieldset.querySelectorAll('.nonpreview');
    nonpreview.forEach((el) => {
        if (!show_prev) {
            el.style.display = "block";
          } else {
            h+= el.offsetHeight;
            el.style.display = "none";
          }
    });
    if (show_prev){
        preview_area.style.display = "block";
    }
    else{
        preview_area.style.display = "none";
    }
    preview_area.style['min-height'] = h.toString() + "px";
    if (show_prev){
        preview_btn.innerHTML = 'edit';
    }
    else{
        preview_btn.innerHTML = 'preview';
    }
}


function updateModal(){
    var form_row = (modal_text_area.closest('.form-row')||modal_text_area.closest('.row'));
    fieldset = form_row.closest('fieldset');

    modal_text_area.parentElement.style['margin-bottom'] = "5px";

    //add format buttons
    form_row.insertAdjacentElement('afterend', modal_frmt_row);

    //mark all rows that will be hidden when showing prview
    for(let i=0; i<fieldset.children.length-1; i++){
        var el = fieldset.children[i];
        if(!el.querySelector('#frmt-preview')){
            el.classList.add('nonpreview');
        }
    }
    //add preview
    preview_area = createPreviewArea();
    fieldset.insertAdjacentElement('afterbegin', preview_area);

    //add preview button
    (fieldset.querySelector('.button-delete') || fieldset.querySelector('.button-cancel')).parentElement.insertAdjacentHTML('beforeend', '<a href="#" id="frmt-preview" aria-label="preview" class="button right" style="">preview</a>');
    preview_btn = fieldset.querySelector('#frmt-preview');


    preview_btn.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    preview_btn.addEventListener('click', function(event) {
        event.preventDefault();
        populatePreviewArea(modal_text_area);
        swapPreviewVis();
    });
    //add button listeners
    addFormatButtonsListeners(cbox_wrapper, ['bold','italic','quote'], modal_text_area);
    addHyperlinkButtonListener(cbox_wrapper, modal_text_area);
    //prevent scroll overflow
    cbox_wrapper.querySelector('#cboxLoadedContent').style.height = "";
    //fieldset.closest('section').style.display = "none";
    //fieldset.closest('section').style.display = "block";
}

const cboxCallback = () => {
    cbox_wrapper.querySelector('#cboxContent').style.height= "";
    cbox_wrapper.querySelector('#cboxLoadedContent').style.height = "";

    modal_text_area = cbox_wrapper.querySelector('#frm-review');
    var format_row = cbox_wrapper.querySelector('#frmt-row');
    if(format_row){
        swapPreviewVis(false);
        return;
    }
    if(!modal_text_area){
        return;
    }
    text_areas.add(modal_text_area);
    updateModal();
};

const cbox_wrapper = document.getElementById("cboxWrapper");
var config = { attributes: true, childList: true, subtree: false };
const cbox_observer = new MutationObserver(cboxCallback);
cbox_observer.observe(cbox_wrapper, config);

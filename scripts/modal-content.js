var modal_text_area = null;
var modal_preview_area = null;
var modal_preview_btn = null;
console.log('modal')

function settingsBuildPreview(){
    let preview = document.createElement('div');
    preview.classList.add( "review", "body-text", "-prose", "-loose");
    preview.style.color="#cde";
    preview.style.display="none";
    preview.style['padding-left'] = "10px";
    preview.style["border-left"] = "1px #9ab solid";
    preview.style["margin-bottom"] = "15px";
    
    return preview;
}



function updateModal(){
    modal_text_area.style['margin-bottom'] = '0';
    let frmt_row = insertFormatRow(modal_text_area);

    //add preview
    [modal_preview_area, modal_preview_btn] = buildPreviewArea(modal_text_area, ["review", "body-text", "-prose", "-loose"]);
    modal_preview_area.style.color = "#cde";
    modal_text_area.insertAdjacentElement('beforebegin', modal_preview_area); 
    frmt_row.insertAdjacentElement('beforeend', modal_preview_btn);
    
    modal_text_area.style['max-width'] = modal_text_area.style.width;

}

const cboxCallback = () => {
    //colorbox.style['min-height'] = colorbox.style.height;
    modal_text_area = colorbox.querySelector('#frm-review');
    var format_row = colorbox.querySelector('#frmt-row');
    populatePreviewArea(modal_text_area, modal_preview_area);
    if(!modal_text_area|| format_row){
        return;
    }
    updateModal();
};

const colorbox = document.getElementById("colorbox");
const cboxWrapper = colorbox.querySelector('#cboxWrapper');
var config = { attributes: true, childList: false, subtree: false };
const cbox_observer = new MutationObserver(cboxCallback);
cbox_observer.observe(cboxWrapper, config);

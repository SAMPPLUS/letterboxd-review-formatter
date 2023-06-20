var modal_text_area = null;
var modal_preview_area = null;
var modal_preview_btn = null;



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
    modal_text_area = cboxWrapper.querySelector('#frm-review');
    var format_row = cboxWrapper.querySelector('#frmt-row');
    populatePreviewArea(modal_text_area, modal_preview_area);
    cboxContent?.style?.setProperty('height', 'fit-content', 'important');

    if(!modal_text_area|| format_row){
        return;
    }
    updateModal();
};

const cboxWrapper = document.querySelector('#cboxWrapper');
const cboxContent = document.querySelector('#cboxContent');
var config = { attributes: true, childList: false, subtree: false };
const cbox_observer = new MutationObserver(cboxCallback);
cbox_observer.observe(cboxWrapper, config);

var modal_text_area = null;
var modal_preview_area = null;
var modal_preview_btn = null;

const MODAL_CLASSLIST = ["review", "body-text", "-loose", "ltfModal"];

function updateModal(){
    modal_text_area.style['margin-bottom'] = '0';
    insertFormatRow(modal_text_area, MODAL_CLASSLIST);
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

var modal_text_area = null;
var fieldset = null;
var modal_preview_area = null;
var preview_btn = null;
console.log("hello modal!")


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
    var form_row = (modal_text_area.closest('.form-row')||modal_text_area.closest('.row'));
    fieldset = form_row.closest('fieldset');
    let frmt_row = insertFormatRow(modal_text_area);

    //add preview
    let [preview_area, preview_btn] = buildPreviewArea(modal_text_area, ["review", "body-text", "-prose", "-loose"]);
    modal_text_area.insertAdjacentElement('beforebegin', preview_area); 
    frmt_row.insertAdjacentElement('beforeend', preview_btn);   

}

const cboxCallback = () => {

    modal_text_area = colorbox.querySelector('#frm-review');
    var format_row = colorbox.querySelector('#frmt-row');
    if(!modal_text_area|| format_row){
        return;
    }
    text_areas.add(modal_text_area);
    updateModal();
};

const colorbox = document.getElementById("colorbox");
var config = { attributes: true, childList: true, subtree: false };
const cbox_observer = new MutationObserver(cboxCallback);
cbox_observer.observe(colorbox, config);

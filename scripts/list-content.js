var list_container = document.querySelector("#film-list-main-details");

function insertElements(){
    var list_text_area = list_container.querySelector('textarea');
    if(!list_text_area){
        return;
    }
    var frmt_row = insertFormatRow(list_text_area);
    var [preview, preview_btn] = buildPreviewArea(list_text_area, ['body-text', '-prose', 'hero']);
    list_text_area.insertAdjacentElement('beforebegin', preview);
    frmt_row.insertAdjacentElement('beforeend', preview_btn);
}
insertElements();
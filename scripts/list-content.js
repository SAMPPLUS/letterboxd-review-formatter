console.log("hello settings edit");
var list_container = document.querySelector("#film-list-main-details");

function insertElements(){
    var list_text_area = list_container.querySelector('textarea');
    if(!list_text_area){
        return;
    }
    text_areas.add(list_text_area);
    var frmt_row = buildFormatRow();
    frmt_row.style['margin-top'] = "2px";
    list_text_area.insertAdjacentElement('afterend', frmt_row);
    addFormatButtonsListeners(list_container, ['bold','italic','quote'], list_text_area);
    addHyperlinkButtonListener(list_container, list_text_area);
}
insertElements();
const MODAL_CLASSLIST = [ "body-text", "-loose", "ltfModal"];

waitForElm('.formrow.reviewfields.js-reviewfields').then((modal_body) => {
    var modal_text_area;
    var modal_preview_area;
    var modal_preview_btn;
    var modal_format_row;
    waitForElm('#frm-review', modal_body).then((text_area) => {
        console.log('text_area')
        waitForElm('.spoilers', modal_body).then((spoiler_tag)=> {
            console.log('spoilers')
            modal_text_area = text_area;
            [modal_format_row, modal_preview_area, modal_preview_btn] = insertFormatRow(text_area, MODAL_CLASSLIST, spoiler_tag);
            text_area.style['max-width'] = text_area.style.width;
        })
    });

});
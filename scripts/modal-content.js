const MODAL_CLASSLIST = ["review", "body-text", "-loose", "ltfModal"];

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
    // var cboxContent;
    // waitForElm('#cboxContent', modal_body).then((el) => {
    //     cboxContent = el;
    // });
    // waitForElm('#cboxWrapper', modal_body).then((el) => {
    //     var config = { attributes: true, childList: false, subtree: false };
    //     const cbox_observer = new MutationObserver(() => {
    //         if(modal_preview_area && modal_format_row && modal_text_area){
    //             setPreviewVis(modal_preview_area, modal_text_area, modal_format_row, false);
    //         };
    //         cboxContent?.style?.setProperty('height', 'fit-content', 'important');
    //     });
    //     cbox_observer.observe(el, config);
    // }); 
});
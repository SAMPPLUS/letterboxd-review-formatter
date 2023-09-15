const MODAL_CLASSLIST = ["review", "body-text", "-loose", "ltfModal"];
var modal_preview_area = null; //

waitForElm('#colorbox').then((colorbox) => {
    var modal_text_area;
    var modal_preview_area;
    var modal_preview_btn;
    var modal_format_row;
    waitForElm('textarea', colorbox).then((text_area) => {
        modal_text_area = text_area;
        [modal_format_row, modal_preview_area, modal_preview_btn] = insertFormatRow(text_area, MODAL_CLASSLIST);
        text_area.style['max-width'] = text_area.style.width;
    });
    var cboxContent;
    waitForElm('#cboxContent', colorbox).then((el) => {
        cboxContent = el;
    });
    waitForElm('#cboxWrapper', colorbox).then((el) => {
        var config = { attributes: true, childList: false, subtree: false };
        const cbox_observer = new MutationObserver(() => {
            if(modal_preview_area && modal_preview_btn && modal_text_area){
                setPreviewVis(modal_preview_area, modal_text_area, modal_preview_btn, false);
            };
            cboxContent?.style?.setProperty('height', 'fit-content', 'important');
        });
        cbox_observer.observe(el, config);
    }); 
});

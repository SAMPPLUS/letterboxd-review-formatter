const COMMENT_CLASSLIST = ['body-text', '-small'];

waitForElm('#comments').then((container) => {
    waitForElm('textarea', container).then((text_area) => {
        let [format_row, preview_area, preview_btn] = insertFormatRow(text_area, COMMENT_CLASSLIST);
        waitForElm("input[type='submit']", container).then((el) => {
            el.addEventListener('click', () => {
                setPreviewVis(preview_area, text_area, preview_btn, false);
            });
        });
    });
    
});



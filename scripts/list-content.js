const LIST_CLASSLIST = ['body-text', '-prose', 'hero'];

waitForElm("#film-list-main-details").then((container) => {
    waitForElm('textarea', container).then((textarea) => {
        insertFormatRow(textarea, LIST_CLASSLIST);
    });
});
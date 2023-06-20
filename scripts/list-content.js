var list_container = document.querySelector("#film-list-main-details");
const LIST_CLASSLIST = ['body-text', '-prose', 'hero'];

const listCallback = (mutationList, observer) => {
    var list_text_area = list_container.querySelector('textarea');
    if(!list_text_area){
        return;
    }
    observer.disconnect();
    insertFormatRow(list_text_area, LIST_CLASSLIST);
};


const list_observer = new MutationObserver()
var config = { attributes: true, childList: true, subtree: true };
var list_text_area = list_container.querySelector('textarea');

if(list_text_area) insertFormatRow(list_text_area, LIST_CLASSLIST);
else list_observer.observe(list_container, config);
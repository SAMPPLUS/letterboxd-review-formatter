var content_container = document.querySelector('#content');
var comment_text_area = null;
var comments_container = null;
var comment_frmt_row = buildFormatRow();

const contentCallback = (mutationList, observer) =>{  
      
    comments_container = content_container.querySelector('#comments');
    comment_text_area = content_container.querySelector("#comments textarea");
    if(!comment_text_area){
        return;
    }
    observer.disconnect();
    let format_row = insertFormatRow(comment_text_area);
    let [preview_area, preview_btn] = buildPreviewArea(comment_text_area, ['body-text', '-small']);
    format_row.insertAdjacentElement('beforeend', preview_btn);
    comment_text_area.insertAdjacentElement('beforebegin', preview_area);
}


const content_observer = new MutationObserver(contentCallback);
var config = { attributes: true, childList: true, subtree: true };
content_observer.observe(content_container, config);


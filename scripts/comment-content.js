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
    text_areas.add(comment_text_area);
    observer.disconnect();
    comment_text_area.insertAdjacentElement('afterend', comment_frmt_row);
    addFormatButtonsListeners(comments_container, ['bold','italic','quote'], comment_text_area);
}


const content_observer = new MutationObserver(contentCallback);
var config = { attributes: true, childList: true, subtree: true };
content_observer.observe(content_container, config);


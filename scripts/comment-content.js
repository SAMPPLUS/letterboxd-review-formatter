var content_container = document.querySelector('#content');
var comment_text_area = null;
const COMMENT_CLASSLIST = ['body-text', '-small'];

const commentsCallback = (mutationList, observer) =>{  
      
    comment_text_area = content_container.querySelector("#comments textarea");
    if(!comment_text_area){
        return;
    }
    observer.disconnect();
    insertFormatRow(comment_text_area, COMMENT_CLASSLIST);
}



const comment_observer = new MutationObserver(commentsCallback);
var config = { attributes: true, childList: true, subtree: true };
comment_text_area = content_container.querySelector("#comments textarea");

if(comment_text_area) insertFormatRow(comment_text_area, COMMENT_CLASSLIST);
else comment_observer.observe(content_container, config);




const tags = {
    bold: ["<b>", "</b>", "bold"],
    italic: ["<i>", "</i>", "italic"],
    quote: ["<blockquote>", "</blockquote>", "quote"]
}
var format_row_html = "";

var text_area = null;

fetch(chrome.runtime.getURL('/resources/format-row.html')).then(r => r.text()).then(html => {
    format_row_html = html;
  });


function insertTagAtRange(valueStart, valueEnd){
    if(text_area==null){
        return;
    }
    var [start, end] = [text_area.selectionStart, text_area.selectionEnd];

    if(valueEnd){
        text_area.setRangeText(valueEnd, end, end, 'preserve' );
    }

    if(valueStart){
        text_area.setRangeText(valueStart, start, start, 'preserve');
    }

    text_area.selectionStart += valueStart.length;
    text_area.focus();

};


function insertTag(valueStart, valueEnd, valueInner) {
    if(text_area==null){
        return;
    }
    var [start, end] = [text_area.selectionStart, text_area.selectionEnd];

    if (start != end){
        insertTagAtRange(valueStart, valueEnd);
        return;
    }

    if(valueStart){
        text_area.setRangeText(valueStart, start, start, 'end');
    }
    start = text_area.selectionStart;
    if(valueEnd){
        text_area.setRangeText(valueEnd, start, start, 'start' );
    }
    if(valueInner){
        text_area.setRangeText(valueInner, start, start, 'select');
    }
    text_area.focus();

};

function insertHyperlink(){
    if(text_area == null){
        return;
    }
    var [start, end] = [text_area.selectionStart, text_area.selectionEnd];
    var linkUrl = window.prompt("Enter the URL:");

    if(linkUrl==""){
        linkUrl = "link URL goes here";
    }
    else if(linkUrl==null){
        return;
    }

    if (start==end){
        var linkText = window.prompt("Enter the link text:");
    }
    else{
        var linkText = text_area.value.substring(start, end);
    }

    if (linkText==""){
        linkText = 'link text goes here';
    }
    else if(linkText==null){
        return;
    }

    var tag = `<a href="${linkUrl}">${linkText}</a>`;
    text_area.setRangeText(tag, start, end, 'end');
    text_area.focus();

};




const cboxCallback = () => {
    text_area = cbox_wrapper.querySelector('#frm-review');
    var markup_row = cbox_wrapper.querySelector('#frmt-row');
    if((!text_area) || (markup_row)){
        return;
    }
    var review_row = text_area.closest('.form-row');
    var fieldset = review_row.closest('fieldset');

    text_area.parentElement.style['margin-bottom'] = "5px";

    //add format buttons

    review_row.insertAdjacentHTML('afterend', format_row_html);

    

    //add button listeners
    function addListenerWrap(selector, valueStart, valueEnd, valueInner){
        cbox_wrapper.querySelector(selector).addEventListener('mousedown', function(event) {
            event.preventDefault();
        });
        cbox_wrapper.querySelector(selector).addEventListener('click', function(event) {
            event.preventDefault();
            insertTag(valueStart,valueEnd, valueInner);
        });
    }
    //bold
    addListenerWrap('#frmt-bold',...tags.bold);
    //italic
    addListenerWrap('#frmt-italic',...tags.italic);
    //quote
    addListenerWrap('#frmt-quote',...tags.quote);

    //link
    cbox_wrapper.querySelector('#frmt-link').addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    cbox_wrapper.querySelector('#frmt-link').addEventListener('click', function(event) {
        event.preventDefault();
        insertHyperlink();
    });
    //add preview
    const preview = document.createElement('div');
    preview.classList.add( "review", "body-text", "-prose", "-loose");
    preview.style.color="#cde";
    preview.style.display="none";
    preview.style['padding-left'] = "10px";
    preview.style["border-left"] = "1px #9ab solid";
    preview.style["margin-bottom"] = "15px";
    preview.innerHtml = text_area.value;

    fieldset.insertAdjacentElement('afterbegin', preview);

    //add preview button
    fieldset?.lastElementChild?.lastElementChild?.lastElementChild?.insertAdjacentHTML('afterend', '<a href="#" id="frmt-preview" class="button" style="">preview</a>');

    var preview_btn = fieldset.querySelector('#frmt-preview');

    preview_btn.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    preview_btn.addEventListener('click', function(event) {
        event.preventDefault();
        if(preview==null){
            return;
        }

        //break the text into paragraphs and put into preview element
        var p_separated_text = text_area.value.split("\n\n");

        var inner_html = "";
        p_separated_text.forEach(str => {
            if(str.length > 0){
                inner_html = inner_html.concat("<p>"+str+"</p>");
            }
        });
        preview.innerHTML = inner_html;
        var h = 0;
        for(let i=0; i<fieldset.children.length-1; i++){
            var el = fieldset.children[i];
            if (el.style.display === "none") {
                el.style.display = "block";
              } else {
                h+= el.offsetHeight;
                el.style.display = "none";
              }
        }
        preview.style['min-height'] = h.toString() + "px";

        if (preview_btn.innerHTML=='preview'){
            preview_btn.innerHTML = 'edit';

        }
        else{
            preview_btn.innerHTML = 'preview';
        }
    });

    //this makes the page reconfigure the modal size to account for the added elements:
    fieldset.style.display = "none";
    fieldset.style.display = "block";
    
};

document.addEventListener('keydown', function(e){
    if (e.key == 'b' && (e.ctrlKey || e.metaKey)){
        insertTag(...tags.bold);
    }
    else if (e.key == 'i' && (e.ctrlKey || e.metaKey)){
        insertTag(...tags.italic);
    }
    else if (e.key == '.' && e.shiftKey && (e.ctrlKey || e.metaKey)){
        insertTag(...tags.quote);
    }
    else if (e.key == 'k' && (e.ctrlKey || e.metaKey)){
        insertHyperlink();
    }
});


const cbox_wrapper = document.getElementById("cboxWrapper");

const config = { attributes: true, childList: true, subtree: false };

const cbox_observer = new MutationObserver(cboxCallback);

cbox_observer.observe(cbox_wrapper, config);

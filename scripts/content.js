
const tags = {
    bold: ["<b>", "</b>", "bold"],
    italic: ["<i>", "</i>", "italic"],
    quote: ["<blockquote>", "</blockquote>", "quote"]
}

var format_row_html = "";

var text_area = null;
var preview_area = null;

fetch(chrome.runtime.getURL('/resources/format-row.html')).then(r => r.text()).then(html => {
    format_row_html = html;
  });


function insertTagAtRange(valueStart, valueEnd){
    if(text_area==null){
        return;
    }
    var [start, end] = [text_area.selectionStart, text_area.selectionEnd];

    if(start==end){
        return;
    }

    var inner_txt = text_area.value.substring(start, end);
    try {
        document.execCommand("delete", false, "")
        document.execCommand("insertText", false, valueStart+inner_txt+valueEnd);
    } catch (error) {
        //in case of execCommand deprecation (this does not allow ctrl+z undo)
        text_area.setRangeText("", start, end, 'end' );
        text_area.setRangeText(valueStart+inner_txt+valueEnd, start, end, 'end');
      }

};


function insertTag(valueStart, valueEnd, valueInner) {
    if(text_area==null){
        return;
    }
    text_area.focus();
    var [start, end] = [text_area.selectionStart, text_area.selectionEnd];

    if (start != end){
        insertTagAtRange(valueStart, valueEnd);
        return;
    }

    try {
        document.execCommand("insertText", false, valueStart+valueInner+valueEnd);
    }
    catch (error) {
        //in case of execCommand deprecation (this does not allow ctrl+z undo)
        text_area.setRangeText(valueStart+valueInner+valueEnd, start, end, 'end');
    }

    text_area.selectionStart -= (valueEnd.length+valueInner.length);
    text_area.selectionEnd -= (valueEnd.length);

};

function insertHyperlink(){
    if(text_area == null){
        return;
    }
    text_area.focus();

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
        try{
            document.execCommand("delete", false, "");
        }
        catch(error){
            text_area.setRangeText("", start, end, 'end');
        }
    }
    if (linkText==""){
        linkText = 'link text goes here';
    }
    else if(linkText==null){
        return;
    }
    var tag = `<a href="${linkUrl}">${linkText}</a>`;
    try{
        document.execCommand("insertText", false, tag);
    }
    catch(error){
        //in case of execCommand deprecation (this does not allow ctrl+z undo)
        text_area.setRangeText(tag, start, end, 'end');
    }

};

function createPreviewArea(){
    let preview = document.createElement('div');
    preview.classList.add( "review", "body-text", "-prose", "-loose");
    preview.style.color="#cde";
    preview.style.display="none";
    preview.style['padding-left'] = "10px";
    preview.style["border-left"] = "1px #9ab solid";
    preview.style["margin-bottom"] = "15px";
    if(text_area != null){
        preview.innerHtml = text_area.value;
    }
    return preview;
}

function populatePreviewArea(){
    if(preview_area==null){
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
    preview_area.innerHTML = inner_html;
    
}


function addListenerWrap(container,selector, valueStart, valueEnd, valueInner){
    container.querySelector(selector).addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    container.querySelector(selector).addEventListener('click', function(event) {
        event.preventDefault();
        insertTag(valueStart,valueEnd, valueInner);
    });
}

const cboxCallback = () => {
    cbox_wrapper.querySelector('#cboxContent').style.height= "";
    text_area = cbox_wrapper.querySelector('#frm-review');
    var markup_row = cbox_wrapper.querySelector('#frmt-row');
    if((!text_area) || (markup_row)){
        return;
    }
    var form_row = (text_area.closest('.form-row')||text_area.closest('.row'));
    var fieldset = form_row.closest('fieldset');

    text_area.parentElement.style['margin-bottom'] = "5px";

    //add format buttons

    form_row.insertAdjacentHTML('afterend', format_row_html);

    

    //add button listeners
    
    //bold
    addListenerWrap(cbox_wrapper, '#frmt-bold',...tags.bold);
    //italic
    addListenerWrap(cbox_wrapper, '#frmt-italic',...tags.italic);
    //quote
    addListenerWrap(cbox_wrapper, '#frmt-quote',...tags.quote);

    //link
    cbox_wrapper.querySelector('#frmt-link').addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    cbox_wrapper.querySelector('#frmt-link').addEventListener('click', function(event) {
        event.preventDefault();
        insertHyperlink();
    });

    //add preview
    preview_area = createPreviewArea();

    fieldset.insertAdjacentElement('afterbegin', preview_area);

    

    //add preview button
    (fieldset.querySelector('.button-delete') || fieldset.querySelector('.button-cancel')).parentElement.insertAdjacentHTML('beforeend', '<a href="#" id="frmt-preview" aria-label="preview" class="button right" style="">preview</a>');
    var preview_btn = fieldset.querySelector('#frmt-preview');

    //mark all rows that will be hidden when showing prview

    for(let i=0; i<fieldset.children.length-1; i++){
        var el = fieldset.children[i];
        if(!el.querySelector('#frmt-preview')){
            el.classList.add('nonpreview');
        }
    }


    preview_btn.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    preview_btn.addEventListener('click', function(event) {
        event.preventDefault();
        populatePreviewArea();
        var h = 0;


        var nonpreview = fieldset.querySelectorAll('.nonpreview');
        nonpreview.forEach((el) => {
            if (el.style.display === "none") {
                el.style.display = "block";
              } else {
                h+= el.offsetHeight;
                el.style.display = "none";
              }
        });

        preview_area.style['min-height'] = h.toString() + "px";
        if (preview_btn.innerHTML=='preview'){
            preview_btn.innerHTML = 'edit';
        }
        else{
            preview_btn.innerHTML = 'preview';
        }
    });

    //prevent scroll overflow
    cbox_wrapper.querySelector('#cboxLoadedContent').style.height = "";
    fieldset.closest('section').style.display = "none";
    fieldset.closest('section').style.display = "block";
    
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

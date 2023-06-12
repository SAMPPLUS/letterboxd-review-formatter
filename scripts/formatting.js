const SELECTORS = {
    bold: "frmt-bold",
    italic: "frmt-italic",
    quote: "frmt-quote",
    link: "frmt-link"
}

const TAGS = {
    bold: ["<b>", "</b>", "bold"],
    italic: ["<i>", "</i>", "italic"],
    quote: ["<blockquote>", "</blockquote>", "quote"]
}

const URLS = {
    bold: "resources/icon-bold.svg",
    italic: "resources/icon-italic.svg",
    quote: "resources/icon-quote.svg",
    link: "resources/icon-link.svg"
}

const btn_builder = [
    [SELECTORS.bold, 'bold', URLS.bold],
    [SELECTORS.italic, 'italic', URLS.italic],
    [SELECTORS.quote, 'quote', URLS.quote],
    [SELECTORS.link, 'link', URLS.link]
]

function buildFormatButton(id, label, icon_url){
    let btn = document.createElement('a');
    fetch(chrome.runtime.getURL(icon_url)).then(r=>r.text()).then(html => {
        btn.insertAdjacentHTML('beforeend', html);
    });
    btn.classList.add('button');
    btn.href="#";
    btn.id=id;
    btn.ariaLabel = label;
    btn.style.padding = "2px 7px";
    btn.charlie = "delta";

    return btn;
}

function buildFormatRow(){
    let frmt_row = document.createElement('div');
    frmt_row.id = "frmt-row";

    btn_builder.forEach(element => {
        frmt_row.insertAdjacentElement('beforeend', buildFormatButton(...element));
    });

    return frmt_row;
}

function insertTagAtRange(valueStart, valueEnd){
    if(text_areas.has(document.activeElement)){
        var text_area = document.activeElement;
    }
    else{
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
    if(text_areas.has(document.activeElement)){
        var text_area = document.activeElement;
    }
    else{
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

function addHyperlinkButtonListener(container){
    container.querySelector("#" + SELECTORS.link).addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    container.querySelector("#" + SELECTORS.link).addEventListener('click', function(event) {
        event.preventDefault();
        insertHyperlink();
    });
}

function addButtonListener(container,selector, valueStart, valueEnd, valueInner){
    let btn = container.querySelector("#" + selector);
    btn.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    btn.addEventListener('click', function(event) {
        event.preventDefault();
        insertTag(valueStart,valueEnd, valueInner);
    });
}

function addFormatButtonsListeners(container, types){
    types.forEach(type => {
        addButtonListener(container, SELECTORS[type], ...TAGS[type]);
    });
}


function addKeyboardShortcuts(){
    document.addEventListener('keydown', function(e){
        if (e.key == 'b' && (e.ctrlKey || e.metaKey)){
            insertTag(...TAGS.bold);
        }
        else if (e.key == 'i' && (e.ctrlKey || e.metaKey)){
            insertTag(...TAGS.italic);
        }
        else if (e.key == '.' && e.shiftKey && (e.ctrlKey || e.metaKey)){
            insertTag(...TAGS.quote);
        }
        else if (e.key == 'k' && (e.ctrlKey || e.metaKey)){
            insertHyperlink();
        }
    });
}

function populatePreviewArea(){
    if((preview_area==null) || text_area==null || text_area.value == ""){
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
    
};

var text_areas = new Set();
var preview_area = null;

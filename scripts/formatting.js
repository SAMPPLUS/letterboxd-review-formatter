const SELECTORS = {
    bold: "#frmt-bold",
    italic: "#frmt-italic",
    quote: "#frmt-quote",
    link: "#frmt-link"
}

const TAGS = {
    bold: ["<b>", "</b>", "bold"],
    italic: ["<i>", "</i>", "italic"],
    quote: ["<blockquote>", "</blockquote>", "quote"]
}

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

function addHyperlinkButtonListener(container){
    container.querySelector(SELECTORS.link).addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    container.querySelector(SELECTORS.link).addEventListener('click', function(event) {
        event.preventDefault();
        insertHyperlink();
    });
}

function addButtonListener(container,selector, valueStart, valueEnd, valueInner){
    container.querySelector(selector).addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    container.querySelector(selector).addEventListener('click', function(event) {
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
    if((preview_area==null) || text_area==null){
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
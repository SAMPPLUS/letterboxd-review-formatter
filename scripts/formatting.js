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


const ICONS = {
    bold: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#def" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bold"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>',
    italic:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#def" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-italic"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>',
    quote: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#def" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
    link: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#def" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link-2"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>'
}

const btn_builder = [
    [SELECTORS.bold, 'bold', ICONS.bold],
    [SELECTORS.italic, 'italic', ICONS.italic],
    [SELECTORS.quote, 'quote', ICONS.quote],
    [SELECTORS.link, 'link', ICONS.link]
]

function buildFormatButton(id, label, icon){
    let btn_attributes =  {
        id: id,
        className: 'button',
        href: '#',
        ariaLabel: label,
    }
    let btn = document.createElement('a');
    btn.innerHTML = icon;
    btn.style.padding = "1px 7px";
    btn.style.margin = "0 2px 0 0";
    btn = Object.assign(btn, btn_attributes);

    return btn;
}

function buildFormatRow(){
    let frmt_row = document.createElement('div');
    frmt_row.id = "frmt-row";
    frmt_row.style["padding-top"] = "4px";

    btn_builder.forEach(element => {
        frmt_row.insertAdjacentElement('beforeend', buildFormatButton(...element));
    });

    return frmt_row;
}

function insertTagAtRange(valueStart, valueEnd, text_area){
    
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

function insertTag(valueStart, valueEnd, valueInner, text_area) {
    if(!text_area){
        return;
    }
    text_area.focus();
    var [start, end] = [text_area.selectionStart, text_area.selectionEnd];

    if (start != end){
        insertTagAtRange(valueStart, valueEnd, text_area);
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

function insertHyperlink(text_area){
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

function addHyperlinkButtonListener(container, text_area){
    container.querySelector("#" + SELECTORS.link).addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    container.querySelector("#" + SELECTORS.link).addEventListener('click', function(event) {
        event.preventDefault();
        insertHyperlink(text_area);
    });
}

function addButtonListener(container,selector, valueStart, valueEnd, valueInner, text_area){
    let btn = container.querySelector("#" + selector);
    btn.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    btn.addEventListener('click', function(event) {
        event.preventDefault();
        insertTag(valueStart,valueEnd, valueInner, text_area);
    });
}

/**
 * 
 * @param {*} container HTML parent element that contains the buttons
 * @param {*} types the formatting types of buttons to add
 * @param {*} text_area the text area the buttons pertain to
 */
function addFormatButtonsListeners(container, types, text_area){ 
    types.forEach(type => {
        addButtonListener(container, SELECTORS[type], ...TAGS[type], text_area);
    });
}

/**
 * activates the formatting keyboard shortcuts
 */
function addKeyboardShortcuts(){
    document.addEventListener('keydown', function(e){
        var text_area = document.activeElement;
        if(!text_areas.has(text_area) || !e.key){
            return;
        }
        if (e.key.toLowerCase() == 'b' && (e.ctrlKey || e.metaKey)){
            insertTag(...TAGS.bold, text_area);
        }
        else if (e.key.toLowerCase() == 'i' && (e.ctrlKey || e.metaKey)){
            insertTag(...TAGS.italic, text_area);
        }
        else if (e.key.toLowerCase() == 'k' && e.shiftKey && (e.ctrlKey || e.metaKey)){
            insertTag(...TAGS.quote, text_area);
        }
        else if (e.key.toLowerCase() == 'l' && e.shiftKey &&  (e.ctrlKey || e.metaKey)){
            insertHyperlink(text_area);
        }
    });
}

/**
 * populates preview div with formatted text from textarea
 * @param {*} text_area
 * @param {*} preview_area 
 * @returns 
 */
function populatePreviewArea(text_area, preview_area){
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

/**
 * creates a preview div for a textarea, as well as a button to toggle preview visibility
 * @param {Element} text_area  the textarea element to preview
 * @param {Element} classList  optional array of CSS classes to assign to preview
 * @returns {Array} preview area, preview button
 */
function buildPreviewArea(text_area, classList=[]){
    //add preview button
    var prv_btn = document.createElement('a')
    prv_btn.id = 'frmt-preview';
    prv_btn.href = "#";
    prv_btn.ariaLabel="preview";
    prv_btn.classList.add('button');
    prv_btn.classList.add('right');
    prv_btn.innerText='preview'
    prv_btn.style['font-size'] = ".9rem"
    prv_btn.style.padding = "6px 12px 6px 12px";
    // add preview area
    var preview = document.createElement('div');
    preview.classList.add( ...classList);
    preview.style.color="#cde";
    preview.style.display="none";
    preview.style['padding-left'] = "10px";
    preview.style["border-left"] = "1px #9ab solid";
    preview.style.overflow = "scroll";
    preview.style.resize = "both";
    text_area.insertAdjacentElement('beforebegin', preview)
    //
    prv_btn.addEventListener('mousedown', function(event){
        event.preventDefault();
    });
    prv_btn.addEventListener('click', function(event){
        event.preventDefault();
        console.log('preview swap');
        show_prev = (preview.style.display == "none");
        if (show_prev){
            preview.style.display = "block";
            populatePreviewArea(text_area, preview);
            if (preview.scrollHeight > text_area.offsetHeight){
                preview.style.height = 'fit-content';
            }
            else{
                preview.style.height = text_area.offsetHeight + "px";
            }
            text_area.style.display = "none";
            prv_btn.innerText = "edit";
        }
        else{
            text_area.style.display = "block";
            preview.style.display = "none";
            prv_btn.innerText = "preview";

        }
        
    });
    return [preview, prv_btn];
}

/**
 * adds a row of formatting buttons to a text area
 * @param {Element} text_area  the textarea element to add formatting buttons to
 * @returns 
 */
function insertFormatRow(text_area){
    if(text_area == null){
        return;
    }
    if(formatrow_template == null){
        formatrow_template = buildFormatRow();
    }
    var format_row = formatrow_template.cloneNode(true);
    text_areas.add(text_area);
    text_area.insertAdjacentElement('afterend', format_row);
    addFormatButtonsListeners(format_row, ['bold','italic','quote'], text_area);
    addHyperlinkButtonListener(format_row, text_area);
    return format_row;
}
var formatrow_template = buildFormatRow();
var text_areas = new Set();
var modal_preview_area = null;
addKeyboardShortcuts();

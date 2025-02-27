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

const WHITELISTED_TAGS = ['b', 'i', 'blockquote', 'a', 'strong', 'em']
const PURIFY_CONFIG = {
  USE_PROFILES: { html: true }, // Only allow HTML
  IN_PLACE: true, // In place mode for faster sanitization,
  ALLOWED_TAGS: WHITELISTED_TAGS, // Only allow tags specified in the whitelist above
}

var shortcutsEnabled = true;

function buildFormatRowTemplate(){
    var btn_tmpl = document.createElement('a');
    btn_tmpl.href = '#';
    btn_tmpl.classList.add('button', 'frmt-btn');
    var tmpl = document.createElement('div');
    tmpl.id = "frmt-row";
    tmpl.classList.add('frmt-row');
    btn_builder.forEach(element => {
        let btn = btn_tmpl.cloneNode(true);
        let [id, label, icon] = element;
        btn.innerHTML = icon;
        btn.id = id;
        btn.ariaLabel = label;
        tmpl.insertAdjacentElement('beforeend', btn);
    });
    return tmpl;
}

function buildPreviewBtnTemplate(){
    let btn_tmpl = document.createElement('a')
    btn_tmpl.id = 'frmt-preview';
    btn_tmpl.classList.add('prv-btn');
    btn_tmpl.href = "#";
    btn_tmpl.ariaLabel="preview";
    btn_tmpl.classList.add('button');
    btn_tmpl.classList.add('right');
    btn_tmpl.innerText='preview'
    return btn_tmpl;
}

function buildPreviewAreaTemplate(){
    let prv_tmpl = document.createElement('div');
    prv_tmpl.classList.add('frmt-prv');
    prv_tmpl.style.color="#9ab";
    prv_tmpl.style.display="none";
    return prv_tmpl;
}

function insertTagAtRange(valueStart, valueEnd, text_area){
    var [start, end] = [text_area.selectionStart, text_area.selectionEnd];
    if(start==end) return;
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
    if(!text_area) return;
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
    if(text_area == null) return;
    text_area.focus();
    var [start, end] = [text_area.selectionStart, text_area.selectionEnd];
    var linkUrl = window.prompt("Enter the URL:");
    if(linkUrl=="") linkUrl = "link URL goes here";
    else if(linkUrl==null) return;
    if (start==end) var linkText = window.prompt("Enter the link text:");
    else{
        var linkText = text_area.value.substring(start, end);
        try{
            document.execCommand("delete", false, "");
        }
        catch(error){
            text_area.setRangeText("", start, end, 'end');
        }
    }
    if (linkText=="") linkText = 'link text goes here';
    else if(linkText==null) return;
    var tag = `<a href="${linkUrl}">${linkText}</a>`;
    try{
        document.execCommand("insertText", false, tag);
    }
    catch(error){
        //in case of execCommand deprecation (this does not allow ctrl+z undo)
        text_area.setRangeText(tag, start, end, 'end');
    }
};


/**
 * activates the formatting keyboard shortcuts
 */
function addKeyboardShortcuts(){
    if (!shortcutsEnabled) return;
    document.addEventListener('keydown', function(e){
        var text_area = document.activeElement;
        if(!text_areas.has(text_area) || !e.key || !shortcutsEnabled) return;
        if (e.key.toLowerCase() == 'b'  && (e.ctrlKey || e.metaKey)){
            e.preventDefault();
            insertTag(...TAGS.bold, text_area);
        }
        else if (e.key.toLowerCase() == 'i' && (e.ctrlKey || e.metaKey)){
            e.preventDefault();
            insertTag(...TAGS.italic, text_area);
        }
        else if (e.key.toLowerCase() == 'k' && e.shiftKey && (e.ctrlKey || e.metaKey)){
            e.preventDefault();
            insertTag(...TAGS.quote, text_area);
        }
        else if (e.key.toLowerCase() == 'l' && e.shiftKey &&  (e.ctrlKey || e.metaKey)){
            e.preventDefault();
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
    if((preview_area==null) || text_area==null) return;
    while (preview_area.firstChild) preview_area.firstChild.remove();

    //break the text into paragraphs and put into preview element
    var p_separated_text = text_area.value.split("\n\n");
    p_separated_text.forEach(str => {
        if(str.length > 0){
            let p = document.createElement('p');
            str = DOMPurify.sanitize(str, PURIFY_CONFIG);
            p.innerHTML= str;
            preview_area.insertAdjacentElement('beforeend', p);
        }
    });
};

function setPreviewVis(preview_area, text_area, format_row, show_prev){
    var prv_btn = format_row.querySelector('#frmt-preview');
    var frmt_btns = format_row.querySelectorAll('.frmt-btn');
    if (show_prev){
        let preview_height = text_area.offsetHeight;
        preview_area.style.display = "block";
        populatePreviewArea(text_area, preview_area);
        console.log(text_area.offsetHeight)
        preview_area.style.height = preview_height + "px";
        text_area.style.display = "none";
        prv_btn.innerText = "edit";
        frmt_btns.forEach(element => {
            element.classList.add('ltf-hidden')
        });
    }
    else{
        text_area.style.display = "block";
        preview_area.style.display = "none";
        prv_btn.innerText = "preview";
        frmt_btns.forEach(element => {
            element.style.display = 'inline-block';
        });
        frmt_btns.forEach(element => {
            element.classList.remove('ltf-hidden');
        });
    }
}

/**
 * creates a preview div for a textarea, as well as a button to toggle preview visibility
 * @param {Element} text_area  the textarea element to preview
 * @param {Element} classList  optional array of CSS classes to assign to preview
 * @returns {Array} preview area, preview button
 */
function buildPreviewArea(text_area, classList=[]){
    //add preview button
    var prv_btn = prv_btn_tmpl.cloneNode(true);
    // add preview area
    var preview = prv_area_tmpl.cloneNode(true);
    preview.classList.add( ...classList);
    text_area.insertAdjacentElement('beforebegin', preview)
    prv_btn.addEventListener('mousedown', function(event){
        event.preventDefault();
    });
    prv_btn.addEventListener('click', function(event){
        event.preventDefault();
        show_prev = (preview.style.display == "none");
        setPreviewVis(preview, text_area, prv_btn, show_prev);   
    });
    return [preview, prv_btn];
}

/**
 * adds a row of formatting buttons to a text area
 * @param {Element} text_area  the textarea element to add formatting buttons to
 * @returns 
 */
function insertFormatRow(text_area, classList = [], target = null){
    if(text_area == null || text_area.classList.contains('ltf')) return;

    text_areas.add(text_area);
    text_area.classList.add('ltf');
    var format_row = format_row_tmpl.cloneNode(true);
    if(target){
        target.insertAdjacentElement('afterend', format_row);
    }
    else{
        text_area.insertAdjacentElement('afterend', format_row);
    }
    
    //button listeners
    ['bold','italic','quote'].forEach(type => {
        let selector = SELECTORS[type];
        let [valueStart, valueEnd, valueInner] = TAGS[type];
        let btn = format_row.querySelector("#" + selector);
        btn.addEventListener('mousedown', function(event) {
            event.preventDefault();
        });
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            insertTag(valueStart,valueEnd, valueInner, text_area);
        });
    });
    //link button listener
    format_row.querySelector("#" + SELECTORS.link).addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
    format_row.querySelector("#" + SELECTORS.link).addEventListener('click', function(event) {
        event.preventDefault();
        if(text_area.style.display == 'none') return;
        insertHyperlink(text_area);
    });

    var preview_btn = prv_btn_tmpl.cloneNode(true);
    // add preview area
    var preview_area = prv_area_tmpl.cloneNode(true);
    preview_area.classList.add( ...classList);
    text_area.insertAdjacentElement('beforebegin', preview_area)
    preview_btn.addEventListener('mousedown', function(event){
        event.preventDefault();
    });
    preview_btn.addEventListener('click', function(event){
        event.preventDefault();
        show_prev = (preview_area.style.display == "none");
        setPreviewVis(preview_area, text_area, format_row, show_prev);   
    });

    text_area.insertAdjacentElement('beforebegin', preview_area);
    format_row.insertAdjacentElement('beforeend', preview_btn);
    return [format_row, preview_area, preview_btn];
}

function waitForElm(selector, container =document, search_st =true) {
    console.log("waiting for...", selector)
    return new Promise(resolve => {
        // console.log("found", selector)
        if (container.querySelector(selector)) {
            return resolve(container.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (container.querySelector(selector)) {
                resolve(container.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(container, {
            childList: true,
            subtree: search_st
        });
    });
}

chrome.storage.sync.get(
    {shortcutsEnabled: true },
    (items) => {
      shortcutsEnabled = items.shortcutsEnabled;
      addKeyboardShortcuts();
    }
);
const format_row_tmpl = buildFormatRowTemplate();
const prv_btn_tmpl = buildPreviewBtnTemplate();
const prv_area_tmpl = buildPreviewAreaTemplate();
var text_areas = new Set();
var modal_preview_area = null;

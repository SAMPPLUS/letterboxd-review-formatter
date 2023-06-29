const SETTINGS_CLASSLIST = ["body-text", "-small"];

waitForElm('.app-available-settings').then((container)=>{
    waitForElm('textarea', container).then((text_area) => {
        text_area.insertAdjacentHTML('beforebegin', '<div id="editor"><p>Hello World!</p><p>Some initial <strong>bold</strong> text</p><p><br></p></div>');
        var hinput = document.createElement('input');
        hinput.type='hidden';
        hinput.name='bio';
        text_area.insertAdjacentElement('afterend', hinput);

        var quill = new Quill('#editor', {
            theme: 'snow',
            formats: ['bold', 'italic', 'blockquote', 'link'],
            modules: {
                toolbar: ['bold', 'italic', 'blockquote', 'link']
            }
        });
        quill.on('text-change', () => {
            let str = quill.root.innerHTML.replaceAll('<p>','').replaceAll('</p>', '\n').replaceAll('<br>','');
            console.log(str);
            hinput.value = str;
        });
        text_area.insertAdjacentHTML('afterbegin', '<input name="bio" type="hidden"></input>')
        text_area.style.display = 'none';
        text_area.name = 'ta';
        
        //insertFormatRow(text_area, SETTINGS_CLASSLIST);
    });
});




const settings_container = document.querySelector('.app-available-settings');


function insertElements(){
    settings_text_area = settings_container.querySelector('textarea');
    let frmt_row = insertFormatRow(settings_text_area);
    let [preview_area, preview_btn] = buildPreviewArea(settings_text_area, ["body-text", "-small"]);
    frmt_row.insertAdjacentElement('beforeend', preview_btn);
    settings_text_area.insertAdjacentElement('beforebegin', preview_area);

    settings_text_area.addEventListener('input', function(event){
    });
};




insertElements();


// Per request from FAS Service Team 11/12/20, "Import Content" should be
// modified as follows:
// 
// 1. Adds a notification advising faculty to exclude Calendar Events when 
//    copying a course, since events will include old Zoom URLs that don't work.
// 2. Automatically sets the default option to "Select specific content" instead 
//    of "All content" when copying a canvas course.
//
(function() {
    "use strict";

    function show_import_notification() {
        var content = document.querySelector("#content");
        var notification = document.createElement("div");
        notification.className = "ic-notification ic-notification--alert";
        notification.innerHTML =
            '<div class="ic-notification__icon" role="presentation">' +
                '<i class="icon-info"></i>' +
                '<span class="screenreader-only">alert</span>' +
            '</div>' +
            '<div style="width:100%;padding:.5em;">' +
                '<strong>Attention:</strong> Use "Select specific content" to exclude Calendar Events when copying from previous courses. Events will include old Zoom links that will not work in your new course. <a href="https://harvard.service-now.com/ithelp?id=kb_article&sys_id=8b1898dcdba0a810babda8dad39619bd">Learn how to exclude these items</a> when importing your course content.' +
            '</div>';
        content.insertBefore(notification, content.firstChild);
    }

    function update_selective_import_value() {
        var radio = document.querySelector("#migrationConverterContainer input[type=radio][name=selective_import][value=true]");
        if(!radio) {
            return;
        }
        if(!radio.dataset.initialized) {
            radio.dataset.initialized = "yes";
            radio.checked = true;
            radio.click(); // simulating a click because the form validator doesn't recognize it as checked
        }
    }

    function watch_for_changes(el, callback) {
        if(!el) {
            return;
        }
        if (window.MutationObserver) {
            var observer = new MutationObserver(callback);
            observer.observe(el, {
                attributes: false,
                childList: true,
                subtree: true
            })
        }
        return observer;
    }

    if (/^\/courses\/\d+\/content_migrations/.test(window.location.pathname)) {
        show_import_notification();
        watch_for_changes(document.querySelector("#migrationConverterContainer"), function(mutationsList, observer) {
            update_selective_import_value();
        });
    }

})();

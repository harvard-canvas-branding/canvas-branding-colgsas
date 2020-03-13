// Per request from FAS Service Team 3/13/20, "Conferences" should be hidden from the navigation.
//
// The Web Conferences item appears in two places:
//  - left-side navigation 
//  - mobile context menu
//
// The mobile context menu is populated dynamically, so it can't be hidden on page load.
// The JS below ensures that the appropriate DOM element has a class attached to it
// so that CSS can hide it.
//
// See also: coursenav.css
(function () {
    "use strict";

    function get_course_id() {
        var matched = window.location.pathname.match(/^\/courses\/(\d+)/);
        if (!matched) {
            return false;
        }
        return matched[1];
    }

    function hide_mobile_nav_item(url) {
        var selector = '#mobileContextNavContainer a[href="' + url + '"]';
        var el = document.querySelector(selector);
        if (!el) {
            return;
        }
        el.parentNode.parentNode.classList.add("conferences-mobile-item");
    }

    function watch_mobile_nav_for_changes(callback) {
        var el = document.querySelector("#mobileContextNavContainer");
        if (!el) {
            return;
        }

        var observer;
        if (window.MutationObserver) {
            observer = new MutationObserver(callback);
            observer.observe(el, {
                attributes: false,
                childList: true,
                subtree: true
            })
        }
    }

    var COURSE_ID = get_course_id();
    var CONFERENCES_URL = '/courses/' + COURSE_ID + '/conferences';

    if (COURSE_ID) {
        watch_mobile_nav_for_changes(function (mutationsList, observer) {
            hide_mobile_nav_item(CONFERENCES_URL);
        });
    }

})();
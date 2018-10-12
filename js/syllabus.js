(function () {
  "use strict";

  var MESSAGE_TEXT = "FAS syllabi are available to members of the FAS community in the Syllabus Explorer. Learn more <a href=\"https://vpal.harvard.edu/syllabusexplorer\" target=\"_blank\">about the Syllabus Explorer project</a>, including how to opt out.";

  var ctrl = {};

  ctrl.init = function () {
    var is_on_syllabus_page = ((window.location.pathname).indexOf("syllabus") != -1);
    var can_edit_syllabus = ctrl.getEditBtn() !== null;

    if (is_on_syllabus_page && can_edit_syllabus) {
      ctrl.addListeners();
    }
  };

  ctrl.getEditBtn = function () {
    return document.querySelector(".edit_syllabus_link");
  };

  ctrl.getCancelBtn = function () {
    return document.querySelector("#edit_course_syllabus_form .form-actions .cancel_button");
  };

  ctrl.getUpdateBtn = function() {
    return document.querySelector("#edit_course_syllabus_form .form-actions button[type=submit]");
  };

  ctrl.getMsgBox = function () {
    if (!ctrl.MsgBox) {
      ctrl.MsgBox = ctrl.createMsgBox();
    }
    return ctrl.MsgBox;
  };

  ctrl.createMsgBox = function() {
    // Container element
    var box = document.createElement("div");
    box.style.border = "1px solid #C7CDD1";
    box.style.padding = ".5em";
    box.style.margin = "0 0 .5em 0";
    box.style.display = "block";
    box.dataset.closed = "no";

    // Button to dismiss notification
    /*
    var btn = document.createElement("button");
    btn.setAttribute("aria-label", "Close Syllabus Explorer notification");
    btn.style.background = "transparent";
    btn.style.float = "right";
    btn.innerHTML = "&times;";
    btn.addEventListener("click", function(e) {
      box.style.display = "none";
      box.dataset.closed = "yes";
      box.preventDefault();
      box.stopPropagation();
    });
    box.appendChild(btn);
    */

    // Message text
    var span = document.createElement("span");
    span.innerHTML = MESSAGE_TEXT;
    box.appendChild(span);

    return box;
  };

  ctrl.addListeners = function () {
    ctrl.getEditBtn().addEventListener("click", ctrl.onEdit);
    ctrl.getUpdateBtn().addEventListener("click", ctrl.onUpdate);
    ctrl.getCancelBtn().addEventListener("click", ctrl.onCancel);
  };

  ctrl.onEdit = function () {
    var box = ctrl.getMsgBox();
    var content = document.querySelector("#content");

    if(!box.parentNode) {
      content.insertBefore(box, content.firstChild);
    }

    if(box.dataset.closed === "yes") {
      box.style.display = "none";
    } else {
      box.style.display = "block";
    }
  };

  ctrl.onCancel = function () {
    ctrl.hideBox();
  };

  ctrl.onUpdate = function() {
    ctrl.hideBox();
  };

  ctrl.hideBox = function() {
    var box = ctrl.getMsgBox();
    box.style.display = "none";
  };

  ctrl.init();
})();
(function () {
  "use strict";

  var MESSAGE_TEXT = "FAS syllabi are available to members of the FAS community in Syllabus Explorer. Learn more <a href=\"https://vpal.harvard.edu/syllabusexplorer\" target=\"_blank\">about the Syllabus Explorer project here</a>, including how to opt out.";

  var ctrl = {};

  /**
   * Initialize controller.
   *
   * Checks to see if the syllabus functionality should be activated. Note that the syllabus
   * may be visited in one of two ways:
   *  1) By clicking on the "Syllabus" link in the course navigation
   *  2) By visiting the front page of the course, which is set to display the syllabus
   */
  ctrl.init = function () {
    var has_syllabus_url_path = ((window.location.pathname).indexOf("syllabus") != -1);
    var has_course_syllabus_element = document.getElementById("course_syllabus");
    var is_on_syllabus_page = has_syllabus_url_path || has_course_syllabus_element;
    var can_edit_syllabus = ctrl.getEditBtn() !== null;

    if (is_on_syllabus_page && can_edit_syllabus) {
      ctrl.addListeners();
    }
  };

  /**
   * Adds listeners to the syllabus page.
   */
  ctrl.addListeners = function () {
    ctrl.getEditBtn().addEventListener("click", ctrl.onEdit);
    ctrl.getUpdateBtn().addEventListener("click", ctrl.onUpdate);
    ctrl.getCancelBtn().addEventListener("click", ctrl.onCancel);
  };

  /**
   * Returns the "Edit" button on the syllabus page.
   * @returns {Element}
   */
  ctrl.getEditBtn = function () {
    return document.querySelector(".edit_syllabus_link");
  };

  /**
   * Returns the "Cancel" button on the syllabus form.
   * @returns {Element}
   */
  ctrl.getCancelBtn = function () {
    return document.querySelector("#edit_course_syllabus_form .form-actions .cancel_button");
  };

    /**
   * Returns the "Update Syllabus" button on the syllabus form.
   * @returns {Element}
   */
  ctrl.getUpdateBtn = function() {
    return document.querySelector("#edit_course_syllabus_form .form-actions button[type=submit]");
  };

  /**
   * Returns the element or box that will display the message text.
   * @returns {HTMLElement}
   */
  ctrl.getMsgBox = function () {
    if (!ctrl.MsgBox) {
      ctrl.MsgBox = ctrl.createMsgBox();
    }
    return ctrl.MsgBox;
  };

  /**
   * Returns a new DOM element containing the message text to display.
   * @returns {HTMLElement}
   */
  ctrl.createMsgBox = function() {
    // Container element
    var box = document.createElement("div");
    box.style.border = "1px solid #C7CDD1";
    box.style.padding = ".5em";
    box.style.margin = "0 0 .5em 0";
    box.style.display = "block";

    // Message text
    var span = document.createElement("span");
    span.innerHTML = MESSAGE_TEXT;
    box.appendChild(span);

    return box;
  };

  /**
   * Handler to display the message box when the syllabus is being edited.
   */
  ctrl.onEdit = function () {
    var box = ctrl.getMsgBox();
    var content = document.querySelector("#content");
    if(!box.parentNode) {
      content.insertBefore(box, content.firstChild);
    }
    box.style.display = "block";
  };

  /**
   * Handler to hide the message box when the user cancels editing.
   */
  ctrl.onCancel = function () {
    ctrl.hideBox();
  };

  /**
   * Handler to hide the message box when the user updates the syllabus.
   */
  ctrl.onUpdate = function() {
    ctrl.hideBox();
  };

  /**
   * Utility method to hide the message box.
   */
  ctrl.hideBox = function() {
    var box = ctrl.getMsgBox();
    box.style.display = "none";
  };

  ctrl.init();
})();
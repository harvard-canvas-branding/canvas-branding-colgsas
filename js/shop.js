var huCourseSelection = (function (){
  var currentEnvironment='prod';
  var courseSelectionToolSubdomainByEnvironment = {
    dev: '.dev',
    qa: '.qa',
    stage: '.stage',
    prod: ''
  };
  var devProspectiveEnrolleeRoleId = '11';
  var prospectiveEnrolleeRoleIdByEnvironment = {
    dev: devProspectiveEnrolleeRoleId,
    qa: devProspectiveEnrolleeRoleId,
    stage: devProspectiveEnrolleeRoleId,
    prod: '38'
  };
  // is_enrolled_student represents guests and students (it does not
  // include prospective enrollees)
  var devEnrolledStudentRoleIds = ['3', '9'];
  var enrolledStudentRoleIdsByEnvironment = {
    dev: devEnrolledStudentRoleIds,
    qa: devEnrolledStudentRoleIds,
    stage: devEnrolledStudentRoleIds,
    prod: ['3', '90']
  };
  /**
   * allowed_terms is a white list of Canvas enrollment_term_ids where course
   * selection is allowed for a specific school
   * NOTE - the term ids in allowed_terms must be strings, not ints
   * @type {string[]}
   */
  var devAllowedTerms = ['4'];
  var allowedTermsByEnvironment = {
    dev: devAllowedTerms,
    qa: devAllowedTerms,
    stage: devAllowedTerms,
    prod: ['68']
  };

  var courseSelectionToolUrl = 'https://icommons-tools' + courseSelectionToolSubdomainByEnvironment[currentEnvironment] + '.tlt.harvard.edu/course_selection/';
  var prospectiveEnrolleeRoleId = prospectiveEnrolleeRoleIdByEnvironment[currentEnvironment];
  var enrolledStudentRoleIds = enrolledStudentRoleIdsByEnvironment[currentEnvironment];
  var allowed_terms = allowedTermsByEnvironment[currentEnvironment];

  /**
   * Create the div that will hold the course selection banner
   * @type {html element}
   */
  var course_selection_banner = jQuery('<div/>', {
    id: 'course-shopping',
    class: 'tltmsg'
  });

  /**
   * Are we on an admin page
   * @type {boolean}
   */
  var on_admin_page = ((window.location.pathname).indexOf('settings') != -1);

  /**
   * Are we on the speed grader page
   * @type {boolean}
   */
  var on_speed_grader_page = ((window.location.pathname).indexOf('speed_grader') != -1);

  /**
   * Are we on the submissions page
   * @type {boolean}
   */
  var on_submissions_page = ((window.location.pathname).indexOf('submissions') != -1);

  /**
   * Are we on any of the special pages described above
   * @type {boolean}
   */
  var on_special_page = on_admin_page || on_speed_grader_page || on_submissions_page;

  /**
   *  get the course ID for the canvas course
   * @returns {string} Canvas course identifier in the form of the Canvas course
   *                   ID or sis_course_id:{course_instance_id}, or empty string
   *                   if course identifier not found in url pathname.
   */
  function get_course_id() {
    var page_url = window.location.pathname;
    var pat = /\/courses\/((sis_course_id\:)?\d+)/;
    var match = pat.exec(page_url);
    if (match) {
      return match[1];
    }
    return '';
  }

  var current_user_id = ENV['current_user_id'];
  var user_url = '/api/v1/users/' + current_user_id + '/profile';
  var course_id = get_course_id();
  var course_url = '/api/v1/courses/' + course_id;
  var login_url = window.location.origin+"/login";

  /**
   * Tool tip text and html link
   * @type {string}
   */
  var course_selection_help_doc_url = 'https://wiki.harvard.edu/confluence/pages/viewpage.action?pageId=168134774';
  var data_tooltip = 'More info about access during course selection period ' +
    '(formerly Shopping Period)';
  var tooltip_link = '<a data-tooltip title="' + data_tooltip + '" target="_blank" href="' +
    course_selection_help_doc_url + '"><i class="icon-question"></i></a>';

  var no_user_canvas_login = '<h1>Students: <a href="'+login_url+'">login</a>' +
    ' to get more access during course selection <span class="text-nowrap">' +
    'period. ' + tooltip_link + '</span></h1></div>';

  /**
   * Return the user id from the api data
   * @param canvas_user_api_data
   * @returns {string} user_id
   */
  function get_sis_user_id(canvas_user_api_data) {
    var user_id = null;
    if (canvas_user_api_data) {
      if (canvas_user_api_data['sis_user_id'] && canvas_user_api_data['sis_user_id'].trim()) {
        user_id = canvas_user_api_data['sis_user_id'].trim();
      } else if (canvas_user_api_data['login_id'] && canvas_user_api_data['login_id'].trim()) {
        user_id = canvas_user_api_data['login_id'].trim();
      }
    }
    return user_id;
  }

  /**
   * Check if the course workflow state is 'available'
   * @param course_workflow
   * @returns {boolean}
   */
  function is_course_available(course_workflow) {
    return course_workflow.localeCompare('available') == 0;
  }

  /**
   * Check if the term id is in the allowed terms list
   * @param term_id
   * @returns {boolean}
   */
  function is_term_allowed(term_id, allowed_terms) {
    return jQuery.inArray(term_id, allowed_terms) > -1;
  }

  /**
   * Get the banner text for students and guests
   * @returns {string} student_message_text
   */
  function course_selection_get_student_banner_text() {
    var student_message_text = '<h1>All Harvard ID holders can view this ' +
      'course site during the course selection <span class="text-nowrap">' +
      'period. ' + tooltip_link + '</span></h1><p>Your contributions will be ' +
      'visible to other students who are also participating in this course.' +
      '</p>';
    return student_message_text;
  }

  /**
   * Get the banner text for prospective enrollees (previously called shoppers)
   * @param remove_course_url
   * @returns {string} prospective_enrollee_message_text
   */
  function course_selection_get_prospective_enrollee_banner_text(remove_course_url) {
    var prospective_enrollee_message_text = '<div class="shop-msg-left">' +
      '<h1>This course is in your Crimson Cart in <span class="text-nowrap">' +
      'my.harvard. ' + tooltip_link + '</span></h1>' +
      '<p>This means that you can receive notifications, join discussions, ' +
      'watch lecture videos, and upload assignments during course selection ' +
      'period. Your contributions will be visible to other students who are ' +
      'also participating in this course.</p><p>To enroll in this course, or ' +
      'to remove it from your Crimson Cart, go to my.harvard.</p></div>' +
      '<div class="shop-btn-right">' +
      '<a class="btn btn-small btn-primary" href="' + remove_course_url + '">' +
      'Go to my.harvard</a></div>';
    return prospective_enrollee_message_text;
  }

  /**
   * Get the banner text for authenticated users (previously called viewers)
   * @param add_course_url
   * @returns {string} viewer_message_text
   */
  function course_selection_get_viewer_banner_text(add_course_url) {
    var viewer_message_text = '<div class="shop-msg-left"><h1>Students: ' +
      'if you would like to participate in this course during course ' +
      'selection period, add it to your Crimson Cart in ' +
      '<span class="text-nowrap">my.harvard. ' + tooltip_link + '</span></h1>' +
      '<p>You will be able to receive notifications, join discussions, watch ' +
      'lecture videos, and upload assignments. <i>There may be a short delay ' +
      'after you add the course to your cart before you gain this additional ' +
      'access.</i></p></div><div class="shop-btn-right">' +
      '<a class="btn btn-small btn-primary" href="' + add_course_url + '">' +
      'Go to my.harvard</a></div>';
    return viewer_message_text;
  }

  /**
   * Get the banner text for teachers
   * @returns {string} course_selection_is_active_message
   */
  function course_selection_get_teacher_banner_text() {
    var course_selection_is_active_message = '<h1>Your class list ' +
      'may include <span class="text-nowrap">Prospective Enrollees. ' +
      tooltip_link + '</span></h1><p>All Harvard ID holders can view this ' +
      'course site during course selection period but cannot see student ' +
      'contributions. Students may add this course to their Crimson Cart to ' +
      'participate in discussions, upload assignments, watch ' +
      'lecture videos, and receive notifications before they are officially ' +
      'enrolled. All Student contributions will be visible to ' +
      'other participants in this course.</p><br/>' +
      '<p>At the end of course selection period, ' +
      'Prospective Enrollees who have not officially enrolled as ' +
      'Students or Guests in the course through my.harvard ' +
      'will be removed from the class list.</p>';
    return course_selection_is_active_message;
  }

  /**
   * check to see if the '#unauthorized_message' is being rendered and only
   * proceed with additional checks to show course selection messages if
   * authorized
   * @type {boolean}
   */
  var authorized = $('#unauthorized_message').length > 0 ? false : true;

  var init = function() {
    if (authorized){
      if ( $('#global_nav_login_link').length > 0 ) {
        // user is unauthenticated
        $.getJSON(course_url, function( data ) {
          /*
           Check to see the course is in the 'available' (Published) state before
           showing the course selection button.
           */
          var course_is_available = is_course_available(data['workflow_state']);
          var term_is_allowed = is_term_allowed(data['enrollment_term_id'], allowed_terms);

          if(course_is_available && !on_special_page && term_is_allowed) {
            course_selection_banner.append(no_user_canvas_login);
            $('#breadcrumbs').after(course_selection_banner);
          }
        });
      }
      else {
        var sis_user_id = '';
        $.getJSON(user_url, function( data ) {
          sis_user_id = get_sis_user_id(data);
          if (course_id) {
            $.getJSON(course_url, function( data ) {

              var course_is_available = is_course_available(data['workflow_state']);
              var term_is_allowed = is_term_allowed(data['enrollment_term_id'], allowed_terms);
              var course_enrollments = data['enrollments'];
              var canvas_course_id = data['id'];
              var sisCourseId = data['sis_course_id'];

              /*
               Check to see the course is in the 'available' (Published) state
               before showing the course selection button.
               */
              if(course_is_available && !on_special_page && term_is_allowed &&
                  (course_id == canvas_course_id || course_id == 'sis_course_id:'+sisCourseId)) {
                var user_has_course_enrollment = false;
                var is_prospective_enrollee = false;
                var is_teacher = false;
                var is_enrolled_student = false;
                var num_enrollments = course_enrollments.length;
                for (var n = 0; n < num_enrollments; n++) {
                  var roleId = course_enrollments[n]['role_id'];
                  var roleType =  course_enrollments[n]['type'];
                  user_has_course_enrollment = true;
                  is_prospective_enrollee = (roleId == prospectiveEnrolleeRoleId);
                  is_enrolled_student = enrolledStudentRoleIds.indexOf(roleId) > -1;
                  is_teacher = ['teacher', 'ta', 'designer'].indexOf(roleType) > -1;
                }

                var baseMyHarvardUrl = 'https://portal.my.harvard.edu/psp/hrvihprd/EMPLOYEE/EMPL/h/';
                var add_course_url = encodeURI(courseSelectionToolUrl +
                  'locate_course?course_instance_id=' + sisCourseId);
                var remove_course_url = encodeURI(baseMyHarvardUrl + '?tab=HU_SSS');
                if (user_has_course_enrollment) {
                  if (is_prospective_enrollee) {
                    course_selection_banner.append(course_selection_get_prospective_enrollee_banner_text(remove_course_url));
                  }
                  else if (is_teacher) {
                    course_selection_banner.append(course_selection_get_teacher_banner_text());
                  }
                  else if(is_enrolled_student){
                    course_selection_banner.append(course_selection_get_student_banner_text());
                  }
                  if (is_prospective_enrollee || is_teacher || is_enrolled_student) {
                    $('#breadcrumbs').after(course_selection_banner);
                  }
                }else{
                  /*
                   If logged in user is not enrolled, then display generic course
                   selection message to authorized user
                   */
                  course_selection_banner.append(course_selection_get_viewer_banner_text(add_course_url));
                  $('#breadcrumbs').after(course_selection_banner);
                }
              } else if (on_admin_page && term_is_allowed) {
                // on course admin page for course in a whitelisted term --> disable is_public_to_auth_users
                var $courseVisibility = $('#course_course_visibility');
                var notificationText = '<p><em>Please contact your local academic support staff if you would like to choose the "Course" visibility option during course selection period.</em></p>';
                $courseVisibility.closest('span').after(notificationText);
                $courseVisibility.children('option[value="course"]').attr('disabled', true);
              }
            });
          }
        });
      }
    }
  };

  return {
    init: init
  }
})();

huCourseSelection.init();

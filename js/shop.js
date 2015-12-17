
/**
 * allowed_terms is a white list of Canvas enrollment_term_ids where shopping is allowed
 * for a specific school
 * NOTE - the term ids in allowed_terms must be strings, not ints
 * @type {string[]}
 */
var allowed_terms = ['3', '4', '179', '595', '596', '603', '487', '569', '1','8','447','591','597', '342'];

var current_user_id = ENV['current_user_id'];
var user_url = '/api/v1/users/' + current_user_id + '/profile';
var course_id = get_course_number();
var course_url = '/api/v1/courses/' + course_id ;
var login_url = window.location.origin+"/login";
var shopping_tool_url = "https://icommons-tools.dev.tlt.harvard.edu/shopping";

/**
 * Tool tip text and html link
 * @type {string}
 */
var shopping_help_doc_url = 'https://wiki.harvard.edu/confluence/display/canvas/Course+Shopping';
var data_tooltip = 'More info about access during shopping period';
var tooltip_link = '<a data-tooltip title="' + data_tooltip + '" target="_blank" href="' +
  shopping_help_doc_url + '"><i class="icon-question"></i></a>';

var no_user_canvas_login = '<div class="tltmsg tltmsg-shop"><p class="participate-text">Students: ' +
  '<a href="'+login_url+'">login</a> to get more access during shopping period.' + tooltip_link + '</p></div>';

var is_course = (course_id > 0);
var user_enrolled = false;
var is_shopper = false;
var is_teacher = false;
var is_student = false;

/**
 * Create the div that will hold the shoping banner
 * @type {html element}
 */
var shopping_banner = jQuery('<div/>', {
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
 * check to see if the '#unauthorized_message' is being rendered  and only proceed
 * with additional checks to show shopping messages if authorized
 * @type {boolean}
 */
var authorized = $('#unauthorized_message').length > 0 ? false : true;
if (authorized){
  var un = $('ul#identity > li.user_name > a').text();
  if ( !un ) {
    $.getJSON(course_url, function( data ) {
      /*
       Check to see the course is in the 'available' (Published) state before showing
       the shopping button.
       */

      if(is_course_available(data['workflow_state']) && !on_special_page) {
        /*
         TLT-668 - only allow shopping for terms that are in the whitelist.
         */
        if (term_allowed(data['enrollment_term_id'])) {
          shopping_banner.append(no_user_canvas_login);
          $('#breadcrumbs').after(shopping_banner);
        }
      }
    });
  }
  else {
    var sis_user_id = '';
    $.getJSON(user_url, function( data ) {
      sis_user_id = get_sis_user_id(data);
      if (course_id > 0) {
        $.getJSON(course_url, function( data ) {
          /*
           Check to see the course is in the 'available' (Published) state before showing
           the shopping button.
           */
          if(is_course_available(data['workflow_state']) && !on_special_page) {
            /*
             TLT-668 - only allow shopping for terms that are in the whitelist.
             */
            if (term_allowed(data['enrollment_term_id'])) {
              var c_id = data['id'];
              if (course_id == c_id) {
                var num_enrollments = data['enrollments'].length;
                for (var n = 0; n < num_enrollments; n++) {
                  var erole = data['enrollments'][n]['role'];
                  var type =  data['enrollments'][n]['type'];
                  user_enrolled = true;
                  is_shopper = (erole == 'Shopper');
                  is_student = (erole == 'StudentEnrollment') || (erole == 'Guest');
                  is_teacher =  (type == 'teacher' || type == 'ta' ||type == 'designer' );
                }
              }

              var login_id = '?canvas_login_id=' + sis_user_id;
              var course_and_user_id_param = course_id + login_id;

              var add_shopper_url = shopping_tool_url + '/shop_course/' + course_and_user_id_param;
              var remove_shopper_url = shopping_tool_url + '/remove_shopper_role/' + course_and_user_id_param;
              var manage_shopping_page_url = shopping_tool_url + '/my_list' + login_id;

              var manage_shopping_li_item = jQuery('<li/>', {
                id: 'manage-shopping',
                class: 'menu-item'
              });

              var manage_shopping_link = jQuery('<a/>', {
                id: 'manage-shopping-page-link',
                class: 'menu-item-no-drop',
                href: manage_shopping_page_url,
                text: "Courses I'm Shopping"
              });

              /*
               build the Manage Shopping menu item
               */
              if (user_enrolled) {
                manage_shopping_li_item.append(manage_shopping_link);

                /*
                 for each role format the appropriate banner
                 */
                if (is_shopper) {
                  $("ul#menu").append(manage_shopping_li_item);
                  shopping_banner.append(shopping_get_shopper_banner_text(remove_shopper_url));
                }
                else if (is_teacher) {
                  shopping_banner.append(shopping_get_is_active_banner_text());
                }
                else if(is_student){
                  shopping_banner.append(shopping_get_student_banner_text());
                }
                /*
                 display the banner formatted above
                 */
                if (is_shopper || is_teacher || is_student) {
                  $('#breadcrumbs').after(shopping_banner);
                }
              }else{
                /*
                 If logged in user is not enrolled, then display generic shopping message to authorized user
                 */
                $("ul#menu").append(manage_shopping_li_item);
                shopping_banner.append(shopping_get_viewer_banner_text(add_shopper_url));
                $('#breadcrumbs').after(shopping_banner);
              }
            }
          } else if (on_admin_page && term_allowed(data['enrollment_term_id'])) {
            // on course admin page for course in a whitelisted term --> disable is_public_to_auth_users
            var $iptau_checkbox = $('#course_is_public_to_auth_users');
            $iptau_checkbox.closest("div").addClass("selection-disabled");
            $iptau_checkbox.closest("span").after('<span> <em>(this cannot be changed during shopping period)</em></span>');
            $iptau_checkbox.attr("disabled", true);
          }
        });
      }
    });
  }
}

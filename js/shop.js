
/**
 * allowed_terms is a white list of Canvas enrollment_term_ids where shopping is allowed
 * for a specific school
 * NOTE - the term ids in allowed_terms must be strings, not ints
 * @type {string[]}
 */
var allowed_terms = ['3', '4', '179', '595', '596', '603', '487', '569', '1','8','447','591','597', '342'];

if (is_unauthorized_message_shown){
  var un = $('ul#identity > li.user_name > a').text();
  if ( !un ) {
    $.getJSON(course_url, function( data ) {
      /*
       Check to see the course is in the 'available' (Published) state before showing
       the shopping button.
       */
      var course_is_available = is_course_available(data['workflow_state']);
      var term_is_allowed = is_term_allowed(data['enrollment_term_id'], allowed_terms);

      if(course_is_available && !on_special_page && term_is_allowed) {
        shopping_banner.append(no_user_canvas_login);
        $('#breadcrumbs').after(shopping_banner);
      }
    });
  }
  else {
    var sis_user_id = '';
    $.getJSON(user_url, function( data ) {
      sis_user_id = get_sis_user_id(data);
      if (course_id > 0) {
        $.getJSON(course_url, function( data ) {

          var course_is_available = is_course_available(data['workflow_state']);
          var term_is_allowed = is_term_allowed(data['enrollment_term_id'], allowed_terms);
          var course_enrollments = data['enrollments'];
          var c_id = data['id'];

          /*
           Check to see the course is in the 'available' (Published) state before showing
           the shopping button.
           */
          if(course_is_available && !on_special_page && term_is_allowed && course_id == c_id) {
            var num_enrollments = course_enrollments.length;
            for (var n = 0; n < num_enrollments; n++) {
              var erole = course_enrollments[n]['role'];
              var type =  course_enrollments['type'];
              user_enrolled = true;
              is_shopper = (erole == 'Shopper');
              is_student = (erole == 'StudentEnrollment') || (erole == 'Guest');
              is_teacher =  (type == 'teacher' || type == 'ta' ||type == 'designer' );
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
              if (is_shopper || is_teacher || is_student) {
                $('#breadcrumbs').after(shopping_banner);
              }
            }else{
              /*
               If logged in user is not enrolled, then display generic shopping
               message to authorized user
               */
              $("ul#menu").append(manage_shopping_li_item);
              shopping_banner.append(shopping_get_viewer_banner_text(add_shopper_url));
              $('#breadcrumbs').after(shopping_banner);
            }
          } else if (on_admin_page && term_is_allowed) {
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

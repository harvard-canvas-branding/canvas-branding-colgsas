
/**
 * allowed_terms is a white list of Canvas enrollment_term_ids where shopping is allowed
 * for a specific school
 * NOTE - the term ids in allowed_terms must be strings, not ints
 * @type {string[]}
 */
var allowed_terms = ['3', '4', '179', '595', '596', '603', '487', '569', '1','8','447','591','597', '342'];

/**
 * Check if the term is allowed
 * @param term_id
 * @returns {boolean}
 */
function term_allowed(term_id) {
  return jQuery.inArray(term_id, allowed_terms) > -1;
}

if(is_course && is_course_available(data['workflow_state']) && !on_special_page) {
  if (is_authorized){
    var usernname = $('ul#identity > li.user_name > a').text();
    if ( !usernname ) {
      $.getJSON(course_url, function( data ) {
          /*
           TLT-668 - only allow shopping for terms that are in the whitelist.
           */
          if (term_allowed(data['enrollment_term_id'])) {
            shopping_banner.append(no_user_canvas_login);
            $('#breadcrumbs').after(shopping_banner);
          }
      });
    }
    else {
      var sis_user_id = '';
      $.getJSON(user_url, function( data ) {
        sis_user_id = get_sis_user_id(data);
        $.getJSON(course_url, function( data ) {
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
            } else {
              /*
               If logged in user is not enrolled, then display generic shopping message to authorized user
               */
              $("ul#menu").append(manage_shopping_li_item);
              shopping_banner.append(shopping_get_viewer_banner_text(add_shopper_url));
              $('#breadcrumbs').after(shopping_banner);
            }
          }
        });
      });
    }
  }
} else if (on_admin_page && term_allowed(data['enrollment_term_id'])) {
  // on course admin page for course in a whitelisted term --> disable is_public_to_auth_users
  var $iptau_checkbox = $('#course_is_public_to_auth_users');
  $iptau_checkbox.closest("div").addClass("selection-disabled");
  $iptau_checkbox.closest("span").after('<span> <em>(this cannot be changed during shopping period)</em></span>');
  $iptau_checkbox.attr("disabled", true);
}

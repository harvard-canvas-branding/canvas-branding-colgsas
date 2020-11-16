(function() {
	// Hard-coded external tool IDs for account_id=39 (i.e. Harvard College/GSAS)
	var POLICY_WIZARD_TOOL_ID = 33928;
	var MANAGE_COURSE_TOOL_ID = 17079;
		
	// Ensure that these scripts only run on the appropriate pages
	var is_course_page = ("/courses/" == window.location.pathname.substr(0, "/courses/".length));
	if (is_course_page) {
		if(window.ENV.COURSE_WIZARD) {
			require(['jquery', 'jsx/course_wizard/ListItems'], modify_setup_checklist);
		}
	}
	
	/**
	 * This function overrides/modifies the the data structure that defines the course setup checklist.
	 * See the comments inside for more details.
	 */
	function modify_setup_checklist($, ListItems) {
		/**
		 * SYNOPSIS:
		 *
		 * This module modifies the checklist items data source that populate
		 * the "Setup Checklist" for course instructors.
		 *
		 * DESCRIPTION:
		 *
		 * The "Setup Checklist", or CourseWizard, as it is called in Canvas, is a component built
		 * using ReactJS and a syntax extension called JSX. The CourseWizard is composed of several
		 * sub-components, each of which is contained in a separate JSX file, which compiles down
		 * to native JS (the compilation step happens on the server).
		 *
		 * The components are passed environment values from the Courses Controller, and these values
		 * are accessed in the global ENV namespace. To better understand how the CourseWizard works,
		 * refer to these source files:
		 * 
		 * 1) https://github.com/instructure/canvas-lms/blob/master/app/jsx/course_wizard/ListItems.jsx
		 * 2) https://github.com/instructure/canvas-lms/blob/master/app/jsx/course_wizard/ChecklistItem.jsx
		 * 3) https://github.com/instructure/canvas-lms/blob/master/app/jsx/course_wizard/CourseWizard.jsx
		 * 4) https://github.com/instructure/canvas-lms/blob/master/app/controllers/courses_controller.rb
		 *
		 * To customize the list of items that appear in the CourseWizard, we load the ListItems
		 * module and then modify the desired items. ListItems is a reference to an array of objects,
		 * and CourseWizard uses this same reference at render time, so any changes we make here are
		 * visible to the CourseWizard component.
		 *
		 * NOTE ABOUT EXTERNAL TOOL LINKS:
		 *
		 * The external tool links have the tool ID hard coded for the "Harvard College/GSAS"
		 * account (account_id=39), since it would be too cumbersome to obtain the tool ID
		 * using the Canvas API. Ideally, these would be provided to the JS as environment
		 * variables, but since we don't have the ability to modify the server-side controller,
		 * that's not an option.
		 *
		 * Here's an easy way to get the list of external tools if you know the account ID. Just
		 * run this code from the course home page, and then inspect the objects to find the "id"
		 * of the tool you want:
		 * 
		 * $.getJSON("/api/v1/accounts/39/external_tools", $.proxy(console.log, console));
		 *
		 * TECHNICAL RISKS:
		 *
		 * 1) Instructure does not support this kind of modification to the checklist, and Instructure
		 * could release a breaking change to the CourseWizard code at any time.
		 *
		 * 2) The external tool links could break if this code is executed from a different account, 
		 * or if the external tools themselves are modified such that the IDs are no longer valid.
		 * 
		 */

		// Base course URL (i.e. /courses/1234)
		var BASE_COURSE_URL = window.location.pathname;

		//---------------------------------
		// CHANGE: "Import Content" item
		ListItems[0].text = "If you've been using another course management system, you probably have stuff in there that you're going to want moved over to Canvas. We can walk you through the process of easily migrating your content into Canvas.";
		
		//---------------------------------
		// REMOVE: "Add Students" item
		ListItems.splice(2, 1);
		
		//---------------------------------
		// CHANGE: "Add Files" item
		// Remove the text that says "We'll show you how." When you click the button to go to the file upload page,
		// nothing actually happens so removing this text will avoid any confusion.
		ListItems[2].text = ListItems[2].text.replace("We'll show you how.", "");
		
		//---------------------------------
		// CHANGE: "Select Navigation Links" item
		ListItems[3].url += "#tab-navigation";
		
		//---------------------------------
		// CHANGE: "Choose a Course Home Page" item
		ListItems[4].text = ListItems[4].text.replace('The default is the course activity stream.', 'The default is the Syllabus Page with course description.');
		
		//---------------------------------
		// CHANGE: "Add TAs" item text and move up near the top of the list
		var add_tas = ListItems.splice(6, 1)[0];
		ListItems.splice(1, 0, add_tas);
		$.each(['text', 'title'], function(idx, prop) {
			add_tas[prop] = add_tas[prop].replace(/TA(s)?/g, "TF$1");
		});
		add_tas.url = BASE_COURSE_URL + "/external_tools/" + MANAGE_COURSE_TOOL_ID;	

		//---------------------------------
		// INSERT: Academic Integrity Policy tool
		ListItems.splice(7, 0, {
			key:'policy_wizard',
			complete: false,
			title: "Customize academic integrity policy",
			text: "Customize the academic integrity policy for your course.",
			url: BASE_COURSE_URL + "/external_tools/" + POLICY_WIZARD_TOOL_ID,
			iconClass: 'icon-educators'
		});

	
		//----- DEBUG -----
		if(false) {
			$.getJSON("/api/v1/accounts/39/external_tools").done(function(data) {
				console.log("List of tools for account_id 39:");
				$.each(data, function(idx, tool) { 
					console.log("tool consumer key:", tool.consumer_key, "tool id:", tool.id);
				});
			});
			console.log("customized setup checklist: ", ListItems);
		}
	
	}
})();

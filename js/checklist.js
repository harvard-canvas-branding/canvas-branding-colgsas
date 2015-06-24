/**
 * This section adds some text about migrating content from iSites to the "Import Content" page.
 *
 * Due to the fact that the "Import Content" form is dynamically generated at page render time,
 * there is some extra complexity in the code to poll for the existence of the DOM element
 * before trying to add the text. Otherwise, this could be simplified to a single jquery call.
 */
require(['jquery'], function($) {
	
	// Holds the content that will be added to the page
	var html = "<p>If you would like to incorporate content from a previous iSite, please contact the Academic Technology Group at <a href=\"mailto:atg@fas.harvard.edu\">atg@fas.harvard.edu</a>.</p>";
	
	// Holds a boolean to indicate if this is the "Import Content" page,
	// because this code should only be executed there
	var is_content_migration_page = /^\/courses\/\d+\/content_migrations/.test(window.location.pathname);
	
	// Holds a function that when executed, will call its callback when the selector returns an element.
	// The assumption is that the element may not exist in the DOM on the first try.
	var poll_for_element = pollForElement("#migrationConverterContainer > h1", 20, 100, function($el) {
		$el.after(html);
	});

	if (is_content_migration_page) {
		poll_for_element();
	}

	/**
	 * Poll the DOM for the existence of an element and then execute
	 * the "success" callback when/if the element is found to exist.
	 *
	 * @param {(string|jQuery)} el the element to find
	 * @param {integer} num_tries the number of times to test for existence
	 * @param {integer} timeout the interval between tries
	 * @param {function} success the callback to execute when/if the el is found
	 * @returns {function} a function that will initiate the polling process
	 */
	function pollForElement(el, num_tries, timeout, success) {
		var callback = function() {
			var exists = $(el).length != 0;
			--num_tries;
			if (exists) {
				success($(el));
			} else {
				if (num_tries > 0) {
					window.setTimeout(callback, timeout)
				}
			}
		};
		return callback;
	}
});

/**
 * This section overrides/modifies the the data structure that defines the course setup checklist.
 * See the comments inside for more details.
 */
require(['jquery', 'jsx/course_wizard/ListItems'], function($, ListItems) {
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

	// Hard-coded external tool IDs
	var POLICY_WIZARD_TOOL_ID = 1509; // Tool ID for account_id=39 
	var MANAGE_PEOPLE_TOOL_ID = 3958; // Tool ID for account_id=39

	// Base course URL (i.e. /courses/1234)
	var BASE_COURSE_URL = window.location.pathname;
	var DEBUG = false; // (window.location.pathname == "/courses/39");

	//----- CHANGE #1 -----
	// REMOVE: Modify "Import Content" item
	ListItems[0].text = "If you've been using another course management system, you probably have stuff in there that you're going to want moved over to Canvas. We can walk you through the process of easily migrating your content into Canvas. If you would like to incorporate content from a previous iSite, please contact the Academic Technology Group at atg@fas.harvard.edu";
	
	//----- CHANGE #2 -----
	// REMOVE: "Add Students" item
	ListItems.splice(2, 1);
	
	//----- CHANGE #3 -----
	// CHANGE: "Add TAs" item text and move up near the top of the list
	var add_tas = ListItems.splice(6, 1)[0];
	ListItems.splice(1, 0, add_tas);
	$.each(['text', 'title'], function(idx, prop) {
		add_tas[prop] = add_tas[prop].replace(/TA(s)?/g, "TF$1");
	});
	add_tas.url = BASE_COURSE_URL + "/external_tools/" + MANAGE_PEOPLE_TOOL_ID;
	

	//----- CHANGE #4 -----
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
	if(DEBUG) {
		$.getJSON("/api/v1/accounts/39/external_tools").done(function(data) {
			console.log("List of tools for account_id 39:");
			$.each(data, function(idx, tool) { 
				console.log("tool consumer key:", tool.consumer_key, "tool id:", tool.id);
			});
		});
		console.log("customized setup checklist: ", ListItems);
	}

});

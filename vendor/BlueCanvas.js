/*v2.0.1.20170605-809*/
var BLUE_CANVAS = {
    eventAdded: false,

    localConstant: {
        COURSE_DETAIL: "DASHBOARD_COURSES",
        IS_USER_LOGEDIN: "IS_USER_LOGEDIN",
        BLUE_SERIOUS_TASKS_POPUP: "BLUE_SERIOUS_TASKS_POPUP",
        FEEDBACK_ID: "FEEDBACK_ID",
        ADMIN_SETTING: "ADMIN_SETTING",
        ASSIGNMENT_LINK: "ASSIGNMENT_LINK",
        COURSE_IDS: "COURSE_IDS",
        USER_IN_COURSE: "USER_IN_COURSE",
        CURRENT_COURSE_ID: "CURRENT_COURSE_ID",
        BLUE_SERIOUS_TASKS_LOGINPOPUP: "BLUE_SERIOUS_TASKS_LOGINPOPUP",
        SERIOUS_TASKS_UNIQUE_COURSEIDS: "SERIOUS_TASKS_UNIQUE_COURSEIDS",
        LANGUAGE: ENV.BIGEASY_LOCALE.toLowerCase().replace("_", "-"),
        DATE_FORMAT: { year: 'numeric', month: 'long', day: 'numeric' }
    },

    AddEventToCalenderAgenda: function () {
        if ($.active > 0) {
            window.setTimeout("BLUE_CANVAS.AddEventToCalenderAgenda();", 1000);
        } else {
            $('.agenda-event__item-container').unbind('click');
            $('.agenda-event__item-container').click(function () {
                if ($(this).attr('aria-controls') == null || $(this).attr('aria-controls') == undefined) {
                    setTimeout(function () {
                        $('[name*="blueFeedbackAssignmentLink"]').unbind('click');
                        $('[name*="blueFeedbackAssignmentLink"]').click(function () {
                            var result = this.name.split("_");
                            if (result != null && result.length > 1) {
                                BLUE_CANVAS.PopUpCourseClick(result[1]);
                            }
                        });
                    }, "500");
                }
            });
        }
    },

    AddEventToCalendar: function () {
        if ($.active > 0) {
            window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
        }
        else {
            if (BLUE_CANVAS.eventAdded == false && $(".navigation_buttons:first button").length > 0) {
                BLUE_CANVAS.eventAdded = true;
                $(".navigation_buttons:first button").click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                });

                $(".context-list-toggle-box").click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                    window.setTimeout("BLUE_CANVAS.AddEventToCalenderAgenda();", 1000);
                });

                $('#week').click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                });

                $('#month').click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                });

                $('#agenda').click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalenderAgenda();", 1000);
                });
                $('.fc-toolbar:first button').click(function () {
                    $('.fc-day-number').click(function () {
                        window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                        window.setTimeout("BLUE_CANVAS.AddEventToCalenderAgenda();", 1000);
                    });
                });

                $('.fc-day-number').click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                    window.setTimeout("BLUE_CANVAS.AddEventToCalenderAgenda();", 1000);
                });

            }
            $('.fc-event').unbind('click');
            $('.fc-event').click(function () {
                if ($(this).attr('aria-controls') == null || $(this).attr('aria-controls') == undefined) {
                    setTimeout(function () {
                        $('[name*="blueFeedbackAssignmentLink"]').unbind('click');
                        $('[name*="blueFeedbackAssignmentLink"]').click(function () {
                            var result = this.name.split("_");
                            if (result != null && result.length > 1) {
                                BLUE_CANVAS.PopUpCourseClick(result[1]);
                            }
                        });
                    }, "500");
                }
            });
            if ($('[name*="blueFeedbackAssignmentLink"]').length > 0) {
                $('[name*="blueFeedbackAssignmentLink"]').unbind('click');
                $('[name*="blueFeedbackAssignmentLink"]').click(function () {
                    var result = this.name.split("_");
                    if (result != null && result.length > 1) {
                        BLUE_CANVAS.PopUpCourseClick(result[1]);
                    }
                });
            }
        }
    },

    StoreCourseDetails: function () {
        var courses = [], idlist = [], hasMoreCourses = true;
        var apiurl = BLUE_CANVAS_SETUP.canvasAPI + "/api/v1/users/self/courses?enrollment_state=active&per_page=100";
        while (hasMoreCourses) {
            hasMoreCourses = false;
            $.ajax({
                url: apiurl,
                type: "GET",
                async: !1,
                success: function (data, status, res) {
                    if (data != null && data.length > 0) {
                        $.each(data, function (index, value) {
                            var course = { id: value.id, originalName: value.name, href: '/courses/' + value.id };
                            courses.push(course);
                            idlist.push(value.id);
                        });
                    }
                    pages = res.getResponseHeader('link');
                    if (pages != null && pages.indexOf('rel="next"') != -1) {
                        pageLinks = pages.split(',');
                        for (var i = 0; i < pageLinks.length; i++) {
                            if (pageLinks[i].indexOf('rel="next"') != -1) {
                                apiurl = pageLinks[i].substring(pageLinks[i].indexOf('<') + 1, pageLinks[i].indexOf('>'));
                                hasMoreCourses = true;
                                break;
                            }
                        }
                    }
                },
                error: function () {
                    console.log("Error in getcourses");
                }
            });
        }
        localStorage.setItem(BLUE_CANVAS.localConstant.COURSE_DETAIL, JSON.stringify(courses));
        localStorage.setItem(BLUE_CANVAS.localConstant.COURSE_IDS, idlist.join());
    },

    GetCourseDetails: function () {
        return JSON.parse(localStorage.getItem(BLUE_CANVAS.localConstant.COURSE_DETAIL));
    },

    GetAdminsettingFromLocal: function () {
        return JSON.parse(localStorage.getItem(BLUE_CANVAS.localConstant.ADMIN_SETTING));
    },

    GetCourseIDs: function () {
        var res = localStorage.getItem(BLUE_CANVAS.localConstant.COURSE_IDS);
        if (res == null) { return ""; }
        else { return res; }
    },

    ClosePopup: function (divID) {
        $("#" + divID).detach();
        $("body").css("position", "inherit");
    },

    SetfocusOnPopup: function () {
        window.setTimeout("$('#bluePopupHeading').focus();", 500);
    },
    FilterPendingTask: function (blueTaskList, isLogin, includeUserLevelTask) {

        var seriousTaskList = [];

        if (blueTaskList != null && blueTaskList.length > 0) {

            seriousTaskList = BLUE_CANVAS.FilterBlockableTask(blueTaskList, BLUE_CANVAS.localConstant.LANGUAGE, isLogin, includeUserLevelTask);

            if (seriousTaskList == null || seriousTaskList.length == 0) {
                var matchLanguage = $.map(blueTaskList, function (obj, i) {
                    if (obj.Language.match("^" + BLUE_CANVAS.localConstant.LANGUAGE.substring(0, 2))) {
                        return (obj.Language.toLowerCase());
                    }
                });

                if (matchLanguage != null && matchLanguage.length > 0) {
                    seriousTaskList = BLUE_CANVAS.FilterBlockableTask(blueTaskList, matchLanguage[0], isLogin, includeUserLevelTask);
                }
            }

            if (seriousTaskList != null && seriousTaskList.length == 0) {
                seriousTaskList = BLUE_CANVAS.FilterBlockableTask(blueTaskList, BLUE_CANVAS_SETUP.defaultLanguage, isLogin, includeUserLevelTask);
            }

            if (seriousTaskList != null && seriousTaskList.length == 0) {
                var firstTaskLanguage = blueTaskList[0].Language.toLowerCase()

                seriousTaskList = BLUE_CANVAS.FilterBlockableTask(blueTaskList, firstTaskLanguage, isLogin, includeUserLevelTask);
            }
        }
        return seriousTaskList;
    },

    FilterBlockableTask: function (blueTaskList, taskLanguage, isLogin, includeUserLevelTask) {
        var adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();
        if (isLogin) {
            var currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());
            return $.grep(blueTaskList, function (element, index) {
                return ((element.StartDate <= (currentDate.toJSON())) && (element.DueDate >= (currentDate.toJSON())) && (element.Language.toLowerCase() == taskLanguage) && ($.inArray(element.TaskType, adminSettings.LoginTaskType) !== -1) && (includeUserLevelTask || (element.CourseID != "" && element.CourseID != "0")));
            });
        }
        else {
            return $.grep(blueTaskList, function (element, index) {
                return ((element.Blockable == "true" || element.Blockable == true) && (element.StartDate <= adminSettings.StartDate) && (element.DueDate >= adminSettings.DueDate) && (element.Language.toLowerCase() == taskLanguage) && ($.inArray(element.TaskType, adminSettings.BlockingTaskType) !== -1));
            });
        }
    },

    CommonPopUp: function (innerDivId, logoImg, headerTxt, footerBtn, content) {
        var popUpStr = '';

        popUpStr += '<style>label {-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}';
        popUpStr += 'input[type=checkbox].css-checkbox {position: absolute; opacity:0;}';
        popUpStr += 'input[type=checkbox].css-checkbox + label.css-label {padding-left:25px;height:18px; display:inline-block;line-height:18px;background-repeat:no-repeat;background-position: 0 0;cursor:pointer;}';
        popUpStr += 'input[type=checkbox].css-checkbox:checked + label.css-label {background-position: 0 -18px;}';
        popUpStr += '.css-label{background-image:url(' + BLUE_CANVAS_SETUP.connectorUrl + '/Content/check.png);}';
        popUpStr += 'input[type=checkbox].css-checkbox:focus + label.css-label {border: 1px dotted black;}';
        popUpStr += '.lite-green-check{background-image:url(' + BLUE_CANVAS_SETUP.connectorUrl + '/Content/check.png);}';
        popUpStr += 'div[id^="dvInner_"]{left:auto !important; margin:auto;}';
        popUpStr += '@media only screen and (max-width:700px){div[id^="dvInner_"]{top: 10% !important;}} @media only screen and (max-width:600px){div[id^="dvInner_"]{width:340px !important;margin-left:10px;} }</style>';

        if (logoImg == null || logoImg == "") {
            logoImg = BLUE_CANVAS_SETUP.connectorUrl + "/Content/explorance-university.png";
        }

        popUpStr += '<div id="dvOuter" style="position: fixed; top: 0; left: 0; background: rgba(0,0,0,0.6); z-index: 1000; width: 100%; height: 100%;" role="dialog">';
        popUpStr += '<div id=' + innerDivId + ' style="position: relative; top: 25%; left: 30%; height: auto; width:auto; max-width: 450px; z-index: 10; background: #fff; border-top: 3px solid rgb(66, 139, 202); box-shadow: 0px 2px 6px rgba(0,0,0,1);" role="document" aria-live="assertive">';
        popUpStr += '<div style="padding: 0.5%; padding-bottom: 4%;">';
        popUpStr += '<div style="text-align: center; box-shadow: lightGray 0px 1px; "><img style="height:75px" alt="Institution Logo Image" src=' + logoImg + ' /></div>';
        popUpStr += '<h4 id="bluePopupHeading" style="padding: 10px;color: #474644;font-size:13px; box-shadow: lightGray 0px 1px; text-align: center;" tabindex="0"><strong>' + headerTxt + '</strong></h4>';
        popUpStr += '<div style="padding-left:10px;padding-right:10px;max-height: 150px;overflow-y: auto; overflow-x: hidden;">';
        popUpStr += content;
        popUpStr += '</div>';
        popUpStr += '</div>';
        popUpStr += '<div style="padding: 10px; background-color: #f1e5e5; text-align: center">';
        popUpStr += footerBtn;
        popUpStr += '</div>';
        popUpStr += '</div>';
        popUpStr += '</div>';

        return popUpStr;
    },

    ShowLoader: function () {
        var loaderStr = '';
        loaderStr += '<style> ';
        loaderStr += '#dvCanvasLoader {position: fixed;    top: 0;	left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.5);z-index:999999;} ';
        loaderStr += '.loaderMsg {width: 300px;	position: relative;overflow: hidden;left: 40%;top: 40%;text-align: center;font-size: 14px;color: #fff;font-family: Verdana, Geneva, sans-serif;} ';
        loaderStr += '@media screen and (-webkit-min-device-pixel-ratio:0){  .spinner div { width: 20px;height: 20px;position: absolute;left: -20px;top: 310px !important;background-color: #fff;border-radius: 50%;animation: move 4s infinite cubic-bezier(.2, .64, .81, .23);z-index: 9999; }} ';
        loaderStr += '.spinner div{width: 20px;	height: 20px;position: absolute;left: -20px;top: 280px;background-color: #fff;border-radius: 50%;animation: move 4s infinite cubic-bezier(.2, .64, .81, .23);z-index: 9999;}'
        loaderStr += '.spinner div:nth-child(2){animation-delay: 100ms;}'
        loaderStr += '.spinner div:nth-child(3){animation-delay: 200ms;}'
        loaderStr += '.spinner div:nth-child(4){animation-delay: 300ms;}'
        loaderStr += '@keyframes move { 0% {left: 0%;} 75% {left:100%;} 100% {left:100%;}}'
        loaderStr += '</style>';
        loaderStr += '<div id="dvCanvasLoader"><div class="loaderMsg">Checking for incomplete evaluations</div>'
        loaderStr += '<div class="spinner"><div></div><div></div><div></div><div></div></div>'
        loaderStr += '</div>';
        $("body").append(loaderStr);
    },

    HideLoader: function () {
        $("#dvCanvasLoader").detach();
    },

    GetBlueAdminSetting: function () {
        $.ajax({
            url: BLUE_CANVAS_SETUP.connectorUrl + "/api/Canvas/GetAdminSetting" + "?language=" + BLUE_CANVAS.localConstant.LANGUAGE,
            type: 'GET',
            headers: { "CONSUMERID": BLUE_CANVAS_SETUP.consumerID },
            async: true,
            success: function (data) {
                if (data != null) {
                    localStorage.setItem(BLUE_CANVAS.localConstant.ADMIN_SETTING, JSON.stringify(data));
                    var adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();
                    if (adminSettings != null) {
                        BLUE_CANVAS.ShowLoginPopUp();
                    }
                    if (adminSettings != null && adminSettings.BlockingPrompt != null && adminSettings.BlockingPrompt.BlockingOption != "NONE") {
                        $("#right-side-wrapper").on("click", "a[href='/grades']", function (e) {
                            var htmlStringPop = localStorage.getItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_LOGINPOPUP);
                            if (htmlStringPop != undefined && htmlStringPop != null && htmlStringPop != "") {
                                this.href = "javascript:void(0)";
                                this.onclick = function () { $("body").append(htmlStringPop); BLUE_CANVAS.SetfocusOnPopup(); };
                                $("body").append(htmlStringPop);
                                BLUE_CANVAS.SetfocusOnPopup();
                            }
                        });
                    }
                }
            },
            error: function () {
                console.log("Error in GetBlueAdminSetting function");
            }
        });
    },

    ShowLoginPopUp: function (isGradeBlock) {
        //BLUE_CANVAS.ShowLoader();
        var url;
        var Nopopupagain = false;
        var adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();
        if (!adminSettings.DisabledCustomData) {
            url = BLUE_CANVAS_SETUP.canvasAPI + "/api/v1/users/self/custom_data?ns=" + BLUE_CANVAS_SETUP.domainName;
        }
        else {
            url = BLUE_CANVAS_SETUP.connectorUrl + "/api/Canvas/GetTaskDetails" + "?studentId=" + ENV.current_user_id + "&courseIds=" + BLUE_CANVAS.GetCourseIDs() + "&language=" + BLUE_CANVAS.localConstant.LANGUAGE + "&isLoginPopup=true";
            $.ajax({
                url: BLUE_CANVAS_SETUP.canvasAPI + "/api/v1/users/self/custom_data?ns=" + BLUE_CANVAS_SETUP.domainName,
                type: 'GET',
                success: function (result) {
                    if (result != null && result.data.NoPopUpAgain != null && result.data.NoPopUpAgain != undefined) {
                        Nopopupagain = result.data.NoPopUpAgain;
                    }
                },
                error: function (e) { }
            });
        }
        $.ajax({
            url: url,
            type: 'GET',
            headers: { "CONSUMERID": BLUE_CANVAS_SETUP.consumerID },
            success: function (result) {
                if (result != null && result != undefined) {
                    var taskList = [];
                    if (!adminSettings.DisabledCustomData) {
                        if (result.data != null) {
                            Nopopupagain = result.data.NoPopUpAgain;
                            if (result.data.BlueTaskData != null && result.data.BlueTaskData.TaskList != null) { taskList = result.data.BlueTaskData.TaskList; }
                        }
                    }
                    else {
                        if (result.Tasks != null) { taskList = result.Tasks; }
                    }
                    BLUE_CANVAS.ShowPendingTaskPopUp(taskList, Nopopupagain, isGradeBlock);
                }
                //BLUE_CANVAS.HideLoader();
            },
            error: function (e) {
                //BLUE_CANVAS.HideLoader();
            },
            complete: function () {
                //BLUE_CANVAS.HideLoader();
            }
        });
    },

    ShowPendingTaskPopUp: function (blueTaskList, noPopupAgain, isGradeBlock) {
        var seriousTasks = [];
        var adminSetting = BLUE_CANVAS.GetAdminsettingFromLocal();

        if (adminSetting != null && blueTaskList != null && blueTaskList.length > 0) {
            var courseIDs = BLUE_CANVAS.GetCourseIDs();
            if (courseIDs != null && courseIDs != "") {
                courseIDs = courseIDs.split(',');
                tempList = blueTaskList;
                if (tempList != null && tempList.length > 0) {
                    if (!adminSetting.DisabledCustomData) {
                        seriousTasks = BLUE_CANVAS.FilterPendingTask(tempList, true, adminSetting.UserLevelTasks);
                    }
                    else {
                        seriousTasks = tempList;
                    }
                    if (seriousTasks != null && seriousTasks.length > 0) {

                        var courseList = { Ids: [], PopUpList: [] };
                        var otherTaskAdded = false, hasQPSVM = false;

                        $.each(seriousTasks, function (index, value) {
                            if ($.inArray(value.CourseID, courseList.Ids) == -1) {
                                courseList.Ids.push(value.CourseID);

                                var courseObj = {
                                    CourseId: value.CourseID,
                                    Course: $.grep(BLUE_CANVAS.GetCourseDetails(), function (element, index) {
                                        return element.id == value.CourseID;
                                    }),
                                    DueDates: $.map(seriousTasks, function (obj, i) {
                                        if (obj.CourseID == value.CourseID) {
                                            return new Date(obj.DueDate);
                                        }
                                    })
                                };
                                var minDate = new Date(Math.min.apply(null, courseObj.DueDates));
                                if (courseObj.Course.length > 0) {
                                    courseList.PopUpList.push({ CourseName: courseObj.Course[0].originalName, DueDate: minDate.toLocaleDateString(BLUE_CANVAS.localConstant.LANGUAGE, BLUE_CANVAS.localConstant.DATE_FORMAT), Link: courseObj.Course[0].href, CourseID: courseObj.Course[0].id });
                                }
                                else if (!otherTaskAdded && adminSetting.UserLevelTasks) {
                                    otherTaskAdded = true;
                                    courseList.PopUpList.push({ CourseName: adminSetting.OtherCourseLabel, DueDate: minDate.toLocaleDateString(BLUE_CANVAS.localConstant.LANGUAGE, BLUE_CANVAS.localConstant.DATE_FORMAT), Link: '', CourseID: '0' });
                                }
                                if (value.TaskType != 'FO') { hasQPSVM = true; }
                            }
                        });

                        if (courseList.PopUpList.length > 0) {
                            var content = '';
                            content += '<table style="font-size:13px;width:100%" role="presentation">';
                            for (var i = 0; i < courseList.PopUpList.length; i++) {
                                content += '<tr style="height: 40px; border-bottom: 1px solid lightGray;"><td>' + '<a style="cursor:pointer;color:#1c70ed;text-decoration:underline;" href="#" title=' + courseList.PopUpList[i].CourseName + ' onclick="BLUE_CANVAS.PopUpCourseClick(' + courseList.PopUpList[i].CourseID + ');" >' + courseList.PopUpList[i].CourseName + '</a></td><td align="right" > ' + adminSetting.DueLabel + ' ' + courseList.PopUpList[i].DueDate + '</td></tr>';
                            }
                            content += '</table>';

                            var footerBtn = '';
                            footerBtn += '<div style="float:left;padding-top:10px;padding-left: 10px;">';

                            if (adminSetting.LoginPrompt.CheckboxText != "" && adminSetting.LoginPrompt.CheckboxText != null) {
                                footerBtn += '<input  class="css-checkbox" type="checkbox" id="chkDoNotShow" />';
                                footerBtn += '<label for="chkDoNotShow"  class="css-label lite-green-check">' + adminSetting.LoginPrompt.CheckboxText + '</label>';
                            }

                            footerBtn += '</div>';
                            footerBtn += '<div style="text-align:right;padding:10px;">';
                            footerBtn += '<input type="button" value="' + adminSetting.LoginPrompt.ButtonText + '" title="' + adminSetting.LoginPrompt.ButtonText + '" class="btn btn-primary" style="white-space: normal;  margin-top: 10px; font-size: 12px; padding: 4px 6px;"  onclick="BLUE_CANVAS.BtnPendingPopUpClick(\'dvOuter\');"  id="btnPendingOk"  />';
                            footerBtn += '</div>';

                            var htmlString = BLUE_CANVAS.CommonPopUp("dvInner_SeriousTask", adminSetting.LogoUrl, (hasQPSVM ? adminSetting.LoginPrompt.QPSVMHeaderText : adminSetting.LoginPrompt.FOHeaderText), footerBtn, content);

                            if (adminSetting.LoginPrompt.Enabled && (isGradeBlock == null || isGradeBlock == false)) {
                                if ((noPopupAgain == undefined || noPopupAgain == null || noPopupAgain == "") || (noPopupAgain != null && noPopupAgain != true && noPopupAgain != "true")) {
                                    $("body").append(htmlString);  /*Todo: In case of no value of NoPopUpAgain,we have to show tasks*/
                                    BLUE_CANVAS.SetfocusOnPopup();
                                }
                            }

                            footerBtn = '';
                            if (adminSetting.BlockingPrompt.BlockingOption == "GB") {
                                footerBtn += '<input type="button" tabindex="0" class="btn btn-primary" style="white-space: normal; margin-top: 10px; font-size: 12px; padding: 4px 6px;" onclick="BLUE_CANVAS.ClosePopup(\'dvOuter\');" value="' + adminSetting.BlockingPrompt.ButtonText + '" title="' + adminSetting.BlockingPrompt.ButtonText + '" id="btnDoLater" />';
                            }
                            else {
                                footerBtn += '<input type="button" tabindex="0" class="btn btn-primary" style="white-space: normal; margin-top: 10px; font-size: 12px; padding: 4px 6px;" onclick="BLUE_CANVAS.RedirectToDashBoard(\'dvOuter\');" value="' + adminSetting.BlockingPrompt.ButtonText + '" title="' + adminSetting.BlockingPrompt.ButtonText + '" id="btnDoLater" />';
                            }

                            var htmlStringGradePopUp = BLUE_CANVAS.CommonPopUp("dvInner_SeriousTask", adminSetting.LogoUrl, adminSetting.BlockingPrompt.HeaderText, footerBtn, content);
                            localStorage.setItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_LOGINPOPUP, htmlStringGradePopUp);
                        }
                    }
                }
            }
        }
    },

    BtnPendingPopUpClick: function (divID) {
        if ($("#chkDoNotShow").is(":checked")) {
            BLUE_CANVAS.DisablePopup();
        }
        BLUE_CANVAS.ClosePopup(divID);
    },

    DisablePopup: function () {
        var params = {
            "ns": BLUE_CANVAS_SETUP.domainName,
            "data": true
        }
        $.ajax({
            url: BLUE_CANVAS_SETUP.canvasAPI + "/api/v1/users/self/custom_data/NoPopUpAgain",
            type: 'PUT',
            data: params,
            dataType: 'json',
            success: function () { }
        });
    },

    BlockCourse: function (courseID) {
        var urlSplitResult = window.location.toString().toLowerCase().split('/');
        var adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();

        if (adminSettings != null && adminSettings.BlockingPrompt != null && adminSettings.BlockingPrompt.BlockingOption != "NONE") {
            if (localStorage.getItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP) == undefined || localStorage.getItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP) == null || localStorage.getItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP) == "") {
                if (localStorage.getItem(BLUE_CANVAS.localConstant.USER_IN_COURSE) == undefined || localStorage.getItem(BLUE_CANVAS.localConstant.USER_IN_COURSE) == null || localStorage.getItem(BLUE_CANVAS.localConstant.USER_IN_COURSE) == "") {
                    BLUE_CANVAS.ShowLoader();
                    localStorage.setItem(BLUE_CANVAS.localConstant.USER_IN_COURSE, true);
                    var url;
                    if (!adminSettings.DisabledCustomData) {
                        url = BLUE_CANVAS_SETUP.canvasAPI + "/api/v1/users/self/custom_data?ns=" + BLUE_CANVAS_SETUP.domainName;
                    }
                    else {
                        url = BLUE_CANVAS_SETUP.connectorUrl + "/api/Canvas/GetTaskDetails" + "?studentId=" + ENV.current_user_id + "&courseIds=" + BLUE_CANVAS.GetCourseIDs() + "&language=" + BLUE_CANVAS.localConstant.LANGUAGE + "&isLoginPopup=false";
                    }
                    $.ajax({
                        url: url,
                        type: 'GET',
                        headers: { "CONSUMERID": BLUE_CANVAS_SETUP.consumerID },
                        success: function (result) {
                            var resultTaskList;
                            if (!adminSettings.DisabledCustomData) {
                                if (result != null && result.data != null && result.data.BlueTaskData != null && result.data.BlueTaskData.TaskList != null && result.data.BlueTaskData.TaskList.length > 0) {
                                    resultTaskList = result.data.BlueTaskData.TaskList;
                                }
                            }
                            else {
                                resultTaskList = result.Tasks;
                            }
                            if (resultTaskList != null && resultTaskList.length > 0) {
                                var uniqueCourseIds = [];
                                $.each(resultTaskList, function (index, value) {
                                    if ($.inArray(value.CourseID, uniqueCourseIds) == -1) {
                                        uniqueCourseIds.push(value.CourseID);
                                    }
                                });

                                localStorage.setItem(BLUE_CANVAS.localConstant.SERIOUS_TASKS_UNIQUE_COURSEIDS, uniqueCourseIds);

                                if ((urlSplitResult.length == 6 || urlSplitResult.length == 7) && urlSplitResult[5] == 'grades') {
                                    BLUE_CANVAS.GradeBlockDDLAction(uniqueCourseIds);
                                }

                                var tasks = $.grep(resultTaskList, function (element, index) {
                                    return (element.CourseID == courseID);
                                });

                                if (tasks != null && tasks.length > 0) {
                                    var seriousTaskList;
                                    if (!adminSettings.DisabledCustomData) {
                                        seriousTaskList = BLUE_CANVAS.FilterPendingTask(tasks, false, false);
                                    }
                                    else {
                                        seriousTaskList = tasks;
                                    }
                                    if (seriousTaskList != null && seriousTaskList.length > 0) {
                                        var content = '';
                                        content += '<table style="font-size:13px;width:100%" role="presentation">';
                                        for (var i = 0; i < seriousTaskList.length; i++) {
                                            var name;
                                            if (seriousTaskList[i].Name.length > 38) {
                                                name = seriousTaskList[i].Name.substring(0, 35) + '...';
                                            }
                                            else { name = seriousTaskList[i].Name; }
                                                
                                            content += '<tr><td><a style="cursor:pointer;color:#1c70ed;text-decoration:underline;" title="' + seriousTaskList[i].Name + '" ';
                                            if (adminSettings.LaunchNewTab) {
                                                if (adminSettings.BlockingPrompt.BlockingOption == "GB") {
                                                    content += 'href="' + seriousTaskList[i].Link + '" target="_blank" onclick="BLUE_CANVAS.ClosePopup(\'dvOuter\');">';
                                                }
                                                else {
                                                    content += 'href="' + seriousTaskList[i].Link + '" target="_blank" onclick="BLUE_CANVAS.RedirectToDashBoard(\'dvOuter\');">';
                                                }
                                            }
                                            else {
                                                content += 'href="javascript:void(0);" onclick="BLUE_CANVAS.ClosePopup(\'dvOuter\');BLUE_CANVAS.NavigateToTask(\'' + seriousTaskList[i].Link + '\');">';
                                            }
                                            content += name + '</a></td><td align="right" > ' + adminSettings.DueLabel + ' ' + (new Date(seriousTaskList[i].DueDate)).toLocaleDateString(BLUE_CANVAS.localConstant.LANGUAGE, BLUE_CANVAS.localConstant.DATE_FORMAT) + '</td></tr>';
                                        }
                                        content += '</table>';

                                        var footerBtn = '';
                                        if (adminSettings.BlockingPrompt.BlockingOption == "GB") {
                                            footerBtn += '<input type="button" class="btn btn-primary" style="white-space: normal; margin-top: 10px;" onclick="BLUE_CANVAS.ClosePopup(\'dvOuter\');" value="' + adminSettings.BlockingPrompt.ButtonText + '" title="' + adminSettings.BlockingPrompt.ButtonText + '" id="btnDoLater" />';
                                        }
                                        else {
                                            footerBtn += '<input type="button" class="btn btn-primary" style="white-space: normal; margin-top: 10px;" onclick="BLUE_CANVAS.RedirectToDashBoard(\'dvOuter\');" value="' + adminSettings.BlockingPrompt.ButtonText + '" title="' + adminSettings.BlockingPrompt.ButtonText + '" id="btnDoLater" />';
                                        }

                                        var blueSeriousTasksPopup = '';
                                        blueSeriousTasksPopup = BLUE_CANVAS.CommonPopUp("dvInner_CoursePending", adminSettings.LogoUrl, adminSettings.BlockingPrompt.HeaderText, footerBtn, content);

                                        localStorage.setItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP, blueSeriousTasksPopup);
                                        BLUE_CANVAS.ShowBlocking(blueSeriousTasksPopup, adminSettings, courseID);
                                    }
                                }
                            }
                            BLUE_CANVAS.HideLoader();
                        },
                        error: function (e) {
                            BLUE_CANVAS.HideLoader();
                        },
                        complete: function () {
                            BLUE_CANVAS.HideLoader();
                        }
                    });
                }
                else {
                    if ((urlSplitResult.length == 6 || urlSplitResult.length == 7) && urlSplitResult[5] == 'grades') {

                        var crsIds = localStorage.getItem(BLUE_CANVAS.localConstant.SERIOUS_TASKS_UNIQUE_COURSEIDS);
                        if (crsIds != null) {
                            crsIds = crsIds.split(",");
                            BLUE_CANVAS.GradeBlockDDLAction(crsIds);
                        }
                    }
                }
            }
            else {
                BLUE_CANVAS.ShowBlocking(localStorage.getItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP), adminSettings, courseID);
                BLUE_CANVAS.HideLoader();
            }
        }
    },

    ShowBlocking: function (popupStr, adminSettings, courseID) {
        if (adminSettings.BlockingPrompt.BlockingOption == "GB") {
            /*view grade popup*/
            var urlSplitResult = window.location.toString().toLowerCase().split('/');
            if ((urlSplitResult.length == 6 || urlSplitResult.length == 7) && urlSplitResult[5] == 'grades') {
                $("#right-side-wrapper").hide();
                $("#content").hide();
                $("body").append(popupStr);
                BLUE_CANVAS.SetfocusOnPopup();
            }
            if ($(".section a") != null && $(".section a").length != 0) {
                $(".section a").click(function (e) {
                    var ancr = $(this);
                    if (ancr != null && ancr[0].pathname != null && ancr[0].pathname != "" && ancr[0].pathname.match("^/courses") && ancr[0].pathname.match("grades$")) {
                        e.preventDefault();
                        $("body").append(popupStr);
                        BLUE_CANVAS.SetfocusOnPopup();
                    }
                });
            }
            else {
                $("#left-side a").click(function (e) {
                    var ancr = $(this);
                    if (ancr != null && ancr[0].pathname != null && ancr[0].pathname != "" && ancr[0].pathname.match("^/courses") && ancr[0].pathname.match("grades$")) {
                        e.preventDefault();
                        $("body").append(popupStr);
                        BLUE_CANVAS.SetfocusOnPopup();
                    }
                });
            }
        }
        else {
            if ($(".section a") != null && $(".section a").length != 0) {
                $(".section a").click(function (e) {
                    var ancr = $(this);
                    if (ancr != null && ancr[0].pathname != null && ancr[0].pathname != "" && ancr[0].pathname.match("^/courses") && (!(ancr[0].text.match(adminSettings.ToolName + "$")))) {
                        e.preventDefault();
                        $("#right-side-wrapper").hide()
                        $("#content").hide()
                        $("body").append(popupStr);
                        BLUE_CANVAS.SetfocusOnPopup();
                    }
                });
            }
            else {
                $("#left-side a").click(function (e) {
                    var ancr = $(this);
                    if (ancr != null && ancr[0].pathname != null && ancr[0].pathname != "" && ancr[0].pathname.match("^/courses") && (!(ancr[0].text.match(adminSettings.ToolName + "$")))) {
                        e.preventDefault();
                        $("#right-side-wrapper").hide()
                        $("#content").hide()
                        $("body").append(popupStr);
                        BLUE_CANVAS.SetfocusOnPopup();
                    }
                });
            }
            BLUE_CANVAS.GetExternalToolId(courseID);
            if ((window.location.href) != (BLUE_CANVAS_SETUP.canvasAPI + "/courses/" + courseID + "/external_tools/" + localStorage.getItem(BLUE_CANVAS.localConstant.FEEDBACK_ID))) {
                $("#right-side-wrapper").hide()
                $("#content").hide()
                $("body").append(popupStr);
                BLUE_CANVAS.SetfocusOnPopup();
            }
        }
    },

    RedirectToDashBoard: function () {
        setTimeout("window.location.href = BLUE_CANVAS_SETUP.canvasAPI;", 100);
    },

    PopUpCourseClick: function (currentCourseId) {
        var adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();
        BLUE_CANVAS.GetExternalToolId(currentCourseId);

        var toolId = localStorage.getItem(BLUE_CANVAS.localConstant.FEEDBACK_ID);

        if (toolId != null && toolId != "" && toolId != "0") {
            if (currentCourseId == 0) {
                window.location.href = BLUE_CANVAS_SETUP.canvasAPI + "/users/" + ENV.current_user_id + "/external_tools/" + localStorage.getItem(BLUE_CANVAS.localConstant.FEEDBACK_ID);
            }
            else {
                window.location.href = BLUE_CANVAS_SETUP.canvasAPI + "/courses/" + currentCourseId + "/external_tools/" + localStorage.getItem(BLUE_CANVAS.localConstant.FEEDBACK_ID);
            }
        }
        else {
            window.location.href = BLUE_CANVAS_SETUP.canvasAPI + "/users/" + ENV.current_user_id + "/external_tools/" + adminSettings.ToolId;
        }
    },

    GetExternalToolId: function (courseId) {
        if ((localStorage.getItem(BLUE_CANVAS.localConstant.FEEDBACK_ID) == undefined || localStorage.getItem(BLUE_CANVAS.localConstant.FEEDBACK_ID) == null || localStorage.getItem(BLUE_CANVAS.localConstant.FEEDBACK_ID) == "")) {
            var apiurl = '';
            if (courseId != null && courseId != 0) {
                apiurl = BLUE_CANVAS_SETUP.canvasAPI + "/api/v1/courses/" + courseId + "/tabs";
            }
            else {
                apiurl = BLUE_CANVAS_SETUP.canvasAPI + "/api/v1/users/self/tabs";
            }
            var adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();
            $.ajax({
                url: apiurl,
                type: 'GET',
                async: false,
                success: function (data) {
                    if (data != null) {
                        for (i = 1; i < data.length; i++) {
                            if (data[i].label == adminSettings.ToolName) {
                                var splitString = data[i].full_url.split("/");
                                localStorage.setItem(BLUE_CANVAS.localConstant.FEEDBACK_ID, splitString[6]);
                            }
                        }
                    }
                }
            });
        }
    },

    NavigateToTask: function (taskURL) {
        var adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();
        var strHTML = '<iframe allowfullscreen="true" style="min-height: 650px;" class="tool_launch" id="tool_content" mozallowfullscreen="true" name="tool_content" src="' + taskURL + '" tabindex="0" title="Tool Content" webkitallowfullscreen="true"></iframe>';
        jQuery('#content').html(strHTML);
        $("#content").show();
        jQuery('#right-side-wrapper').hide();
        jQuery('#left-side li.section a.active').removeClass('active')
        var feedbackLink = jQuery('#left-side li.section a[class*="context_external_tool"]:contains("' + adminSettings.ToolName + '")').filter(function () { return $(this).text().trim().toLowerCase() == adminSettings.ToolName.toLowerCase(); });
        if (feedbackLink != null && feedbackLink.length > 0) { feedbackLink.addClass('active'); }
    },

    ResetStudentCustomData: function () {
        $("#btnResetLoginPopUp").prop("disabled", true);
        var urlSplitResult = window.location.toString().toLowerCase().split('/');
        var accountID = urlSplitResult[urlSplitResult.length - 1];

        $.ajax({
            url: BLUE_CANVAS_SETUP.connectorUrl + "/api/Canvas/ResetStudentsSettings?adminUserID=" + ENV.current_user_id + "&accountID=" + accountID + "&domainName=" + BLUE_CANVAS_SETUP.domainName,
            type: 'GET',
            headers: { "CONSUMERID": BLUE_CANVAS_SETUP.consumerID },
            success: function () { }
        });
    },

    GradeBlockDDLAction: function (uniqueCourseIds) {
        $('#course_url option').each(function () {
            var str = $(this).val();
            var cid = str.split('/');
            if (cid[2] != null && cid[2] != "") {
                if ($.inArray(cid[2], uniqueCourseIds) != -1) {
                    $(this).remove();
                }
            }
        });
    },

    ClearLocalStorage: function () {
        localStorage.removeItem(BLUE_CANVAS.localConstant.IS_USER_LOGEDIN);
        localStorage.removeItem(BLUE_CANVAS.localConstant.COURSE_DETAIL);
        localStorage.removeItem(BLUE_CANVAS.localConstant.FEEDBACK_ID);
        localStorage.removeItem(BLUE_CANVAS.localConstant.ADMIN_SETTING);
        localStorage.removeItem(BLUE_CANVAS.localConstant.COURSE_IDS);
        localStorage.removeItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP);
        localStorage.removeItem(BLUE_CANVAS.localConstant.CURRENT_COURSE_ID);
        localStorage.removeItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_LOGINPOPUP);
        localStorage.removeItem(BLUE_CANVAS.localConstant.SERIOUS_TASKS_UNIQUE_COURSEIDS);
    },

    AddLogoutEvent: function () {
        var logoutBtns = $("form[action$='logout']>button[type='submit']");
        if (logoutBtns != null && logoutBtns.length > 0) {
            logoutBtns.each(function () {
                $(this).click(function () {
                    BLUE_CANVAS.ClearLocalStorage();
                });
            });
        }
    },
    AddToDoEvents: function () {
        if ($('.planner-item button').not(".bclinks").length > 0) {
            $('.planner-item button').not(".bclinks").each(function () {
                $(this).addClass('bclinks');
                $(this).unbind('click');
                $(this).click(function () {
                    setTimeout(function () {
                        $('[name*="blueFeedbackAssignmentLink"]').unbind('click');
                        $('[name*="blueFeedbackAssignmentLink"]').click(function () {
                            var result = this.name.split("_");
                            if (result != null && result.length > 1) {
                                BLUE_CANVAS.PopUpCourseClick(result[1]);
                            }
                        });
                    }, "500");
                });
            });
        }
    }
}

$(function () {
    var urlSplitResult = window.location.toString().toLowerCase().split('/');
    if ((document.referrer.indexOf("login") > 0 || document.referrer.indexOf(window.location.hostname) == -1) && document.referrer != '' && document.referrer.indexOf('login_success') == -1) {
        BLUE_CANVAS.ClearLocalStorage();
    }
    if (ENV.current_user_id == null && window.location.toString().toLowerCase().indexOf('login') != -1) {
        BLUE_CANVAS.ClearLocalStorage();
    }
    else if (urlSplitResult.length == 4 && (urlSplitResult[3] == '' || urlSplitResult[3] == '#' || urlSplitResult[3].indexOf('login_success') != -1)) {
        /*Push course details to localstorage for later use*/
        BLUE_CANVAS.StoreCourseDetails();
    }

    if (ENV.current_user_roles != null && ENV.current_user_roles.length > 0) {
        /*Landing page popup*/
        if (urlSplitResult.length == 4 && (urlSplitResult[3] == '' || urlSplitResult[3] == '#' || urlSplitResult[3].indexOf('login_success') > 0)) {
            var adminSettings;
            if (localStorage.getItem(BLUE_CANVAS.localConstant.IS_USER_LOGEDIN) == null || localStorage.getItem(BLUE_CANVAS.localConstant.IS_USER_LOGEDIN) == undefined) {
                BLUE_CANVAS.GetBlueAdminSetting(BLUE_CANVAS_SETUP.domainName);
                localStorage.setItem(BLUE_CANVAS.localConstant.IS_USER_LOGEDIN, true);
            }
            else {
                adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();
                if (adminSettings != null && adminSettings.BlockingPrompt != null && adminSettings.BlockingPrompt.BlockingOption != "NONE") {
                    localStorage.removeItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_LOGINPOPUP);
                    BLUE_CANVAS.ShowLoginPopUp(true);/*This is to enable/disable grade block on home page*/
                }
            }
            adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();
            if (adminSettings != null && adminSettings.BlockingPrompt != null && adminSettings.BlockingPrompt.BlockingOption != "NONE") {
                $("#right-side-wrapper").on("click", "a[href='/grades']", function (e) {
                    var htmlStringGradePopUp = localStorage.getItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_LOGINPOPUP);
                    if (htmlStringGradePopUp != undefined && htmlStringGradePopUp != null && htmlStringGradePopUp != "") {
                        this.href = "javascript:void(0)";
                        this.onclick = function () { $("body").append(htmlStringGradePopUp); BLUE_CANVAS.SetfocusOnPopup(); };
                        $("body").append(htmlStringGradePopUp);
                        BLUE_CANVAS.SetfocusOnPopup();
                    }
                });
            }
            window.setTimeout("BLUE_CANVAS.AddToDoEvents();", 1000);
            $(window).scroll(function () {
                window.setTimeout("BLUE_CANVAS.AddToDoEvents();", 100);
            });
        }
        /*Course Level popup for serious task*/
        if (urlSplitResult.length > 4 && urlSplitResult[3] == 'courses') {
            if (localStorage.getItem(BLUE_CANVAS.localConstant.CURRENT_COURSE_ID) != urlSplitResult[4]) {
                localStorage.removeItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP);
                localStorage.removeItem(BLUE_CANVAS.localConstant.USER_IN_COURSE);
                localStorage.removeItem(BLUE_CANVAS.localConstant.SERIOUS_TASKS_UNIQUE_COURSEIDS);
                localStorage.setItem(BLUE_CANVAS.localConstant.CURRENT_COURSE_ID, urlSplitResult[4]);
            }

            if (localStorage.getItem(BLUE_CANVAS.localConstant.ASSIGNMENT_LINK) == undefined || localStorage.getItem(BLUE_CANVAS.localConstant.ASSIGNMENT_LINK) == null || localStorage.getItem(BLUE_CANVAS.localConstant.ASSIGNMENT_LINK) == "") {
                BLUE_CANVAS.BlockCourse(urlSplitResult[4]);
            }
        }
        else {
            localStorage.removeItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP);
            localStorage.removeItem(BLUE_CANVAS.localConstant.USER_IN_COURSE);
            localStorage.removeItem(BLUE_CANVAS.localConstant.CURRENT_COURSE_ID);
        }

        $('[name*="blueFeedbackAssignmentLink"]').click(function () {
            var result = this.name.split("_");
            if (result != null && result.length > 1) {
                BLUE_CANVAS.PopUpCourseClick(result[1]);
            }
        });

        if (urlSplitResult.length > 3 && urlSplitResult[3].indexOf('calendar') != -1) {
            window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
            window.setTimeout("BLUE_CANVAS.AddEventToCalenderAgenda();", 1000);
            if ($(".navigation_buttons:first button").length > 0) {
                BLUE_CANVAS.eventAdded = true;
                $(".navigation_buttons:first button").click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                });

                $(".context-list-toggle-box").click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                    window.setTimeout("BLUE_CANVAS.AddEventToCalenderAgenda();", 1000);
                });

                $('#week').click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                });

                $('#month').click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                });

                $('#agenda').click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalenderAgenda();", 1000);
                });
                $('.fc-toolbar:first button').click(function () {
                    $('.fc-day-number').click(function () {
                        window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                        window.setTimeout("BLUE_CANVAS.AddEventToCalenderAgenda();", 1000);
                    });
                });

                $('.fc-day-number').click(function () {
                    window.setTimeout("BLUE_CANVAS.AddEventToCalendar();", 1000);
                    window.setTimeout("BLUE_CANVAS.AddEventToCalenderAgenda();", 1000);
                });
            }
        }

        $('[name*="blueFeedbackAnnouncementLink"]').click(function () {
            var result = this.name.split("_");
            if (result != null && result.length > 1) {
                BLUE_CANVAS.PopUpCourseClick(result[1]);
            }
        });
    }
    $('#global_nav_profile_link').click(function () {
        window.setTimeout("BLUE_CANVAS.AddLogoutEvent();", 500);
    });
});
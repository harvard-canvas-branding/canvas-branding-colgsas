/*v2.0.1.20170605-809*/
var BLUE_CANVAS = {
    eventAdded: false,
    isOnlyGradeBlock: false,

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
        DATE_FORMAT: { year: 'numeric', month: 'long', day: 'numeric' },
        BLOCKING_OPTION: "BLOCKING_OPTION"
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
        $("#bluePopupHeading").keydown(function (evt) {
            evt = evt || window.event;
            if (evt.keyCode === 9 && evt.shiftKey) {
                $('#btnClosePrompt')[0].focus();
                return false;
            }
        });
        $("#btnClosePrompt").keydown(function (evt) {
            evt = evt || window.event;
            if (evt.keyCode === 9 && !evt.shiftKey) {
                $('#bluePopupHeading')[0].focus();
                return false;
            }
        });
    },

    FilterPendingTask: function (blueTaskList, isLogin, includeUserLevelTask, courseId) {

        var seriousTaskList = [];

        if (blueTaskList != null && blueTaskList.length > 0) {

            seriousTaskList = BLUE_CANVAS.FilterBlockableTask(blueTaskList, BLUE_CANVAS.localConstant.LANGUAGE, isLogin, includeUserLevelTask, courseId);

            if (seriousTaskList == null || seriousTaskList.length == 0) {
                var matchLanguage = $.map(blueTaskList, function (obj, i) {
                    if (obj.Language.match("^" + BLUE_CANVAS.localConstant.LANGUAGE.substring(0, 2))) {
                        return (obj.Language.toLowerCase());
                    }
                });

                if (matchLanguage != null && matchLanguage.length > 0) {
                    seriousTaskList = BLUE_CANVAS.FilterBlockableTask(blueTaskList, matchLanguage[0], isLogin, includeUserLevelTask, courseId);
                }
            }

            if (seriousTaskList != null && seriousTaskList.length == 0) {
                seriousTaskList = BLUE_CANVAS.FilterBlockableTask(blueTaskList, BLUE_CANVAS_SETUP.defaultLanguage, isLogin, includeUserLevelTask, courseId);
            }

            if (seriousTaskList != null && seriousTaskList.length == 0) {
                var firstTaskLanguage = blueTaskList[0].Language.toLowerCase()

                seriousTaskList = BLUE_CANVAS.FilterBlockableTask(blueTaskList, firstTaskLanguage, isLogin, includeUserLevelTask, courseId);
            }
        }
        return seriousTaskList;
    },

    FilterBlockableTask: function (blueTaskList, taskLanguage, isLogin, includeUserLevelTask, courseId) {
        var adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();
        if (isLogin) {
            var currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());
            return $.grep(blueTaskList, function (element, index) {
                return ((element.StartDate <= (currentDate.toJSON())) && (element.DueDate >= (currentDate.toJSON())) && (element.Language.toLowerCase() == taskLanguage) && ($.inArray(element.TaskType, adminSettings.LoginTaskType) !== -1) && (includeUserLevelTask || (element.CourseID != "" && element.CourseID != "0")));
            });
        }
        else {
            if (adminSettings != null && adminSettings.ProjectSettings != null && adminSettings.ProjectSettings.length > 0) {
                /*User Project Specific settings*/
                //var mergeTaskList = adminSettings.ProjectSettings.map(item => {
                //    const obj = blueTaskList.find(o => o.ProjectId === item.ProjectId); return { ...item, ...obj };
                //});
                var mergeTaskList = blueTaskList.map(x => Object.assign(x, adminSettings.ProjectSettings.find(y => y.ProjectId === x.ProjectId)));
                return $.grep(mergeTaskList, function (element, index) {
                    return (((element.BlockingOption == 4) ||
                        ((element.Blockable == "true" || element.Blockable == true) && (element.BlockingOption == 2 || element.BlockingOption == 3) && element.CourseID == courseId))
                        && (element.StartDate <= element.ProjectStartDate) && (element.DueDate >= element.ProjectDueDate)
                        && (element.Language.toLowerCase() == taskLanguage)
                        && ($.inArray(element.TaskType, adminSettings.BlockingTaskType) !== -1));
                });
            }
            else {
                return $.grep(blueTaskList, function (element, index) {
                    return ((element.Blockable == "true" || element.Blockable == true) && (element.StartDate <= adminSettings.StartDate) && (element.DueDate >= adminSettings.DueDate) && (element.Language.toLowerCase() == taskLanguage) && ($.inArray(element.TaskType, adminSettings.BlockingTaskType) !== -1));
                });
            }
        }
    },

    CommonPopUp: function (innerDivId, logoImg, headerTxt, footerBtn, content) {
        var popUpStr = '';

        popUpStr += '<style>label {-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}';
        popUpStr += 'input[type=checkbox].css-checkbox {position: absolute; opacity:0;}';
        popUpStr += 'input[type=checkbox].css-checkbox + label.css-label {padding-left:25px;height:18px; display:inline-block;line-height:18px;background-repeat:no-repeat;background-position: 0 0;cursor:pointer;font-size:12px;font-weight:bold;}';
        popUpStr += 'input[type=checkbox].css-checkbox:checked + label.css-label {background-position: 0 -18px;}';
        popUpStr += '.css-label{background-image:url(' + BLUE_CANVAS_SETUP.connectorUrl + '/Content/check.png);}';
        popUpStr += 'input[type=checkbox].css-checkbox:focus + label.css-label {border: 1px dotted black;}';
        popUpStr += '.lite-green-check{background-image:url(' + BLUE_CANVAS_SETUP.connectorUrl + '/Content/check.png);}';
        popUpStr += 'div[id^="dvInner_"]{left:auto !important; margin:auto; max-width:720px;}';
        popUpStr += '@media only screen and (max-width:600px){div[id^="dvInner_"]{width:80% !important;margin:auto;top: 10% !important;} }';
        popUpStr += '.exp-grid-container {display: grid;grid-template-columns: auto;border-top: 1px solid #E9E9E9;}';
        popUpStr += '.exp-grid-container a {text-decoration: none;cursor: pointer;}';
        popUpStr += '.exp-grid {display: grid;grid-template-columns: auto 20px;border-bottom: 1px solid #E9E9E9;align-items: center;padding: 12px 16px 12px 16px;grid-column-gap: 20px;}';
        popUpStr += '.exp-grid .col1 {grid-column: 1 / 2;color: #0C5AC5;text-decoration: none;line-height: 17px;}';
        popUpStr += '.exp-grid .col1-data {color: #041723;line-height: 17px;padding-top:4px;font-weight: normal;} .exp-grid .col2 {grid-column: 2 / 2;}</style>';

        if (logoImg == null || logoImg == "") {
            logoImg = BLUE_CANVAS_SETUP.connectorUrl + "/Content/explorance-university.png";
        }

        popUpStr += '<div id="dvOuter" style="position: fixed; top: 0; left: 0; background: rgba(0,0,0,0.6); z-index: 1000; width: 100%; height: 100%;" role="dialog">';
        popUpStr += '<div id=' + innerDivId + ' style="position: relative; top: 10%; left: 30%; height: auto; width:auto; z-index: 10; background: #fff; border: 1px solid #E9E9E9;border-radius: 8px;font-size:14px;font-weight:bold;" role="document" aria-live="assertive">';
        popUpStr += '<div>';
        popUpStr += '<div style="text-align: center;padding: 30px 10px 30px 10px;"><img style="max-height:50px" alt="Institution Logo Image" src=' + logoImg + ' /><div id="bluePopupHeading" tabindex="0" style="padding: 8px;">' + headerTxt + '</div></div>';
        popUpStr += '<div style="max-height: 340px;overflow-y: auto; overflow-x: hidden;">';
        popUpStr += content;
        popUpStr += '</div>';
        popUpStr += '<div style="background-color: #ECECF1;box-sizing: border-box;border: 1px solid #E9E9E9; border-radius: 0 0 8px 8px;text-align:center;font-size:12px;font-weight:bold;">';
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
                    if (BLUE_CANVAS.IsBlockingEnabled()) {
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
                            content += '<div class="exp-grid-container">';
                            for (var i = 0; i < courseList.PopUpList.length; i++) {
                                content += '<a class="exp-grid" href="#" onclick="BLUE_CANVAS.PopUpCourseClick(' + courseList.PopUpList[i].CourseID + ');" title="' + courseList.PopUpList[i].CourseName + '"><div class="col1">' + courseList.PopUpList[i].CourseName + '<div class="col1-data">' + adminSetting.DueLabel + ' ' + courseList.PopUpList[i].DueDate + '</div></div><div class="col2"><img style="height:14px;width:7px;" src="' + BLUE_CANVAS_SETUP.connectorUrl +'/Content/Arrow.svg"></div></a>';
                            }
                            content += '</div>';

                            var footerBtn = '';
                            footerBtn += '<div style="float:left;padding-top:7px;padding-left: 10px;">';

                            if (adminSetting.LoginPrompt.CheckboxText != "" && adminSetting.LoginPrompt.CheckboxText != null) {
                                footerBtn += '<input  class="css-checkbox" type="checkbox" id="chkDoNotShow" />';
                                footerBtn += '<label for="chkDoNotShow"  class="css-label lite-green-check">' + adminSetting.LoginPrompt.CheckboxText + '</label>';
                            }

                            footerBtn += '</div>';
                            footerBtn += '<div style="text-align:right;padding:10px;">';
                            footerBtn += '<a id="btnClosePrompt" href="#" tabindex="0" style="color: #33322f;text-decoration: underline;cursor: pointer;" onclick="BLUE_CANVAS.BtnPendingPopUpClick(\'dvOuter\');" title="' + adminSetting.LoginPrompt.ButtonText + '">' + adminSetting.LoginPrompt.ButtonText + '</a>';
                            footerBtn += '</div>';

                            var htmlString = BLUE_CANVAS.CommonPopUp("dvInner_SeriousTask", adminSetting.LogoUrl, (hasQPSVM ? adminSetting.LoginPrompt.QPSVMHeaderText : adminSetting.LoginPrompt.FOHeaderText), footerBtn, content);

                            if (adminSetting.LoginPrompt.Enabled && (isGradeBlock == null || isGradeBlock == false)) {
                                if ((noPopupAgain == undefined || noPopupAgain == null || noPopupAgain == "") || (noPopupAgain != null && noPopupAgain != true && noPopupAgain != "true")) {
                                    $("body").append(htmlString);  /*Todo: In case of no value of NoPopUpAgain,we have to show tasks*/
                                    BLUE_CANVAS.SetfocusOnPopup();
                                }
                            }

                            footerBtn = '<div style="text-align:right;padding:10px;">';
                            if (adminSetting.BlockingPrompt.BlockingOption == "GB") {
                                footerBtn += '<a id="btnClosePrompt" href="#" tabindex="0" style="color: #33322f;text-decoration: underline;cursor: pointer;" onclick="BLUE_CANVAS.ClosePopup(\'dvOuter\');" title="' + adminSetting.BlockingPrompt.ButtonText + '">' + adminSetting.BlockingPrompt.ButtonText + '</a>';
                            }
                            else {
                                footerBtn += '<a id="btnClosePrompt" href="#" tabindex="0" style="color: #33322f;text-decoration: underline;cursor: pointer;" onclick="BLUE_CANVAS.RedirectToDashBoard(\'dvOuter\');" title="' + adminSetting.BlockingPrompt.ButtonText + '">' + adminSetting.BlockingPrompt.ButtonText + '</a>';
                            }
                            footerBtn += '</div>';

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

    IsBlockingEnabled: function () {
        var adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();
        if (adminSettings != null && adminSettings.ProjectSettings != null && adminSettings.ProjectSettings.length > 0) {
            var res = $.grep(adminSettings.ProjectSettings, function (element, index) {
                return (element.BlockingOption != 0 && element.BlockingOption != 1);
            });
            return res.length > 0;
        }
        return false;
    },

    SetGradeBlockFlag: function (taskList) {
        var isGradeBlock = false, isCourseBlock = false;
        if (taskList != null && taskList.length > 0) {
            for (var i = 0; i < taskList.length; i++) {
                switch (taskList[i].BlockingOption) {
                    case 2:
                        isGradeBlock = true;
                        break
                    case 3:
                    case 4:
                        isCourseBlock = true;
                    default:
                }
            }
        }
        BLUE_CANVAS.isOnlyGradeBlock = (isGradeBlock && !isCourseBlock);
        localStorage.setItem(BLUE_CANVAS.localConstant.BLOCKING_OPTION, BLUE_CANVAS.isOnlyGradeBlock);
    },

    BlockCourse: function (courseID) {
        var urlSplitResult = window.location.toString().toLowerCase().split('/');
        var adminSettings = BLUE_CANVAS.GetAdminsettingFromLocal();

        if (BLUE_CANVAS.IsBlockingEnabled()) {
            if (localStorage.getItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP) == undefined || localStorage.getItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP) == null || localStorage.getItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP) == "") {
                if (localStorage.getItem(BLUE_CANVAS.localConstant.USER_IN_COURSE) == undefined || localStorage.getItem(BLUE_CANVAS.localConstant.USER_IN_COURSE) == null || localStorage.getItem(BLUE_CANVAS.localConstant.USER_IN_COURSE) == "") {
                    BLUE_CANVAS.ShowLoader();
                    localStorage.setItem(BLUE_CANVAS.localConstant.USER_IN_COURSE, true);
                    var url;
                    if (!adminSettings.DisabledCustomData) {
                        url = BLUE_CANVAS_SETUP.canvasAPI + "/api/v1/users/self/custom_data?ns=" + BLUE_CANVAS_SETUP.domainName;
                    }
                    else {
                        url = BLUE_CANVAS_SETUP.connectorUrl + "/api/Canvas/GetTaskDetails" + "?studentId=" + ENV.current_user_id + "&courseIds=" + courseID + "&language=" + BLUE_CANVAS.localConstant.LANGUAGE + "&isLoginPopup=false";
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

                                //var tasks = $.grep(resultTaskList, function (element, index) {
                                //    return (element.CourseID == courseID);
                                //});
                                var tasks = resultTaskList;
                                if (tasks != null && tasks.length > 0) {
                                    var seriousTaskList;
                                    if (!adminSettings.DisabledCustomData) {
                                        seriousTaskList = BLUE_CANVAS.FilterPendingTask(tasks, false, false, courseID);
                                    }
                                    else {
                                        seriousTaskList = tasks;
                                    }
                                    BLUE_CANVAS.SetGradeBlockFlag(seriousTaskList);
                                    if (seriousTaskList != null && seriousTaskList.length > 0) {
                                        var content = '';
                                        content += ' <div class="exp-grid-container">';
                                        for (var i = 0; i < seriousTaskList.length; i++) {
                                            if (adminSettings.LaunchNewTab) {
                                                if (BLUE_CANVAS.isOnlyGradeBlock) {
                                                    content += '<a class="exp-grid" href="' + seriousTaskList[i].Link + '" target="_blank" onclick="BLUE_CANVAS.ClosePopup(\'dvOuter\');"';
                                                }
                                                else {
                                                    content += '<a class="exp-grid" href="' + seriousTaskList[i].Link + '" target="_blank" onclick="BLUE_CANVAS.RedirectToDashBoard(\'dvOuter\')"';
                                                }
                                            }
                                            else {
                                                content += '<a class="exp-grid" href="javascript:void(0);" onclick="BLUE_CANVAS.ClosePopup(\'dvOuter\');BLUE_CANVAS.NavigateToTask(\'' + seriousTaskList[i].Link + '\');"';
                                            }
                                            content += ' title="' + seriousTaskList[i].Name + '"><div class="col1">' + seriousTaskList[i].Name + '<div class="col1-data">' + adminSettings.DueLabel + ' ' + (new Date(seriousTaskList[i].DueDate)).toLocaleDateString(BLUE_CANVAS.localConstant.LANGUAGE, BLUE_CANVAS.localConstant.DATE_FORMAT) + '</div></div><div class="col2"><img style="height:14px;width:7px;" src="' + BLUE_CANVAS_SETUP.connectorUrl + '/Content/Arrow.svg"></div></a>';
                                        }
                                        content += '</div>';

                                        var footerBtn = '<div style="text-align:right;padding:10px;">';
                                        if (BLUE_CANVAS.isOnlyGradeBlock) {
                                            footerBtn += '<a id="btnClosePrompt" href="#" tabindex="0" style="color: #33322f;text-decoration: underline;cursor: pointer;" onclick="BLUE_CANVAS.ClosePopup(\'dvOuter\');" title="' + adminSettings.BlockingPrompt.ButtonText + '">' + adminSettings.BlockingPrompt.ButtonText + '</a>';
                                        }
                                        else {
                                            footerBtn += '<a id="btnClosePrompt" href="#" tabindex="0" style="color: #33322f;text-decoration: underline;cursor: pointer;" onclick="BLUE_CANVAS.RedirectToDashBoard(\'dvOuter\');" title="' + adminSettings.BlockingPrompt.ButtonText + '">' + adminSettings.BlockingPrompt.ButtonText + '</a>';
                                        }
                                        footerBtn += '</div>';

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
                BLUE_CANVAS.isOnlyGradeBlock = localStorage.getItem(BLUE_CANVAS.localConstant.BLOCKING_OPTION);
                BLUE_CANVAS.ShowBlocking(localStorage.getItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP), adminSettings, courseID);
                BLUE_CANVAS.HideLoader();
            }
        }
    },

    ShowBlocking: function (popupStr, adminSettings, courseID) {
        if (BLUE_CANVAS.isOnlyGradeBlock) {
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
        localStorage.removeItem(BLUE_CANVAS.localConstant.BLOCKING_OPTION);
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
            if (localStorage.getItem(BLUE_CANVAS.localConstant.IS_USER_LOGEDIN) == null || localStorage.getItem(BLUE_CANVAS.localConstant.IS_USER_LOGEDIN) == undefined) {
                BLUE_CANVAS.GetBlueAdminSetting(BLUE_CANVAS_SETUP.domainName);
                localStorage.setItem(BLUE_CANVAS.localConstant.IS_USER_LOGEDIN, true);
            }
            else {
                if (BLUE_CANVAS.IsBlockingEnabled()) {
                    localStorage.removeItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_LOGINPOPUP);
                    BLUE_CANVAS.ShowLoginPopUp(true);/*This is to enable/disable grade block on home page*/
                }
            }
            if (BLUE_CANVAS.IsBlockingEnabled()) {
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
                localStorage.removeItem(BLUE_CANVAS.localConstant.BLOCKING_OPTION);
            }

            if (localStorage.getItem(BLUE_CANVAS.localConstant.ASSIGNMENT_LINK) == undefined || localStorage.getItem(BLUE_CANVAS.localConstant.ASSIGNMENT_LINK) == null || localStorage.getItem(BLUE_CANVAS.localConstant.ASSIGNMENT_LINK) == "") {
                BLUE_CANVAS.BlockCourse(urlSplitResult[4]);
            }
        }
        else {
            localStorage.removeItem(BLUE_CANVAS.localConstant.BLUE_SERIOUS_TASKS_POPUP);
            localStorage.removeItem(BLUE_CANVAS.localConstant.USER_IN_COURSE);
            localStorage.removeItem(BLUE_CANVAS.localConstant.CURRENT_COURSE_ID);
            localStorage.removeItem(BLUE_CANVAS.localConstant.BLOCKING_OPTION);
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
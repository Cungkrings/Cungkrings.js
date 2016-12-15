/**********
 * CUNGKRINGS mod
 **********/

var currentIP = "0.0.0.0:0";
var currentToken = "";

var previousMode = localStorage.getItem("gamemode");
var defaultMusicUrl = "https://www.youtube.com/watch?v=uNN6Pj06Cj8";
var coinTimer;
var musicPlayer;

var originalDeath;

function init(modVersion) {
    setTimeout(function () {

        // change buttons styles
        $("button:contains('Spectate')").html('<span class="glyphicon glyphicon-globe"></span>').attr('data-toggle', "tooltip").prop('title', 'Spectate');
        $("button:contains('Logout')").html('<span class="glyphicon glyphicon-off"></span>').attr('data-toggle', "tooltip").prop('title', 'Logout');
        $("button:contains('Copy')").removeClass("btn-info").addClass("btn-link");

        $("#create-party-btn").html('<span class="glyphicon glyphicon-plus"></span>');
        $("#create-party-btn").attr('data-toggle', "tooltip").prop('title', "Create party");

        $("#join-party-btn").html('<span class="glyphicon glyphicon-save"></span>');
        $("#join-party-btn").attr('data-toggle', "tooltip").prop('title', "Join party");
        $("#join-party-btn").attr("style", "width: 49% !important; float: right;");

        //backgroud div
        $("body").prepend('<div id="backgroundFade" style="width: 100%; height: 100%; position: absolute; background: black; z-index: 100; opacity: 0.6; display: none;"></div>');

        $("#overlays").css("z-index", 100);

        $("#overlays-hud").prepend('<div id="statsInfo" class="main-color" style="display: none;font-size: 13px;margin-top: 3px;float: left;font-weight: 700;background-color: rgba(0, 0, 0, 0.2);padding: 3px;border-radius: 4px;width: 65%;height: 24px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 85px;position: fixed;pointer-events: auto;color: #ffffff;"><p style="float: left;margin-left: 10px;">Region: <span id="currentRegion"></span></p><p style="float: right;margin-right: 225px;">Servers: <span id="numServers"></span> (<span id="pps"></span> <span data-toggle="tooltip" data-placement="top" data-original-title="Players per server">PPS</span>)</p><p style="margin-left: 245px;">Players: <span id="numPlayers"></span> / <span id="totalPlayers"  data-toggle="tooltip" data-placement="top" data-original-title="Total players online"></span></p></div>' +
                '<div id="searchHud" class="hud" style="width: 65%; height: 60px; z-index: 15; margin: auto; top: 0; right: 0; left: 0; bottom: 0; position: fixed;">' +
                '<div id="" style="margin-top: 10px;">' +
                '<input id="searchInput" class="form-control" title="" placeholder="Enter friend\'s token, IP, leaderboard, name or clan tag..." style="margin-bottom: 10px;float: left;width: 74% !important;text-align: center;">' +
                '<button id="searchBtn" class="btn btn-copy-token copy-party-token btn-primary" data-toggle="tooltip" data-placement="bottom" data-original-title="Cancel search" style="margin-bottom:10px;width: 15%;"><span id="searchSpan" class="glyphicon glyphicon-search"></span></button>' +
                '<button id="closeBtn" class="btn btn-copy-token copy-party-token" data-toggle="tooltip" style="color: #ffffff;margin-bottom:10px;width: 10%; background-color: transparent;" data-placement="right" data-original-title="Close" title=""><span class="glyphicon glyphicon-remove-circle"></span></button>' +
                '</div></div>'
                );

        $("#statsInfo").before('<div id="notes" class="main-color" style="display:none;font-size: 13px;float: left;font-weight: 700;border-radius: 4px;width: 65%;height: 147px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 400px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;background-color: rgba(0, 0, 0, 0.2);"><h5 class="main-color text-center" style="margin-top: 0px;">Save for later</h5>' +
                '<input id="note1" class="form-control main-color note" style="background: transparent;color: lightgrey;  width: 25%;float:left; border: none; border-bottom: 1px solid; border-color: darkgrey; margin-right: 7px; text-align: center;">' +
                '<input id="note2" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 24%; float: left; border: none; border-bottom: 1px solid; margin-left: 0px; margin-right: 7px; text-align: center; border-color: darkgrey;">' +
                '<input id="note3" class="form-control main-color note" style="background: transparent; width: 49%; border: none; border-bottom: 1px solid; margin-left: 10px; text-align: center; border-color: darkgrey;">' +
                '<input id="note4" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 25%; float: left; border: none; border-bottom: 1px solid; margin-right: 7px; text-align: center; border-color: darkgrey;">' +
                '<input id="note5" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 24%; float: left; border: none; border-bottom: 1px solid; margin-left: 0px; margin-right: 7px; text-align: center; border-color: darkgrey;">' +
                '<input id="note6" class="form-control main-color note" style="background: transparent; color: lightgrey; width: 49%; border: none; border-bottom: 1px solid; margin-left: 10px; text-align: center; border-color: darkgrey;">' +
                '<input id="note7" class="form-control main-color note" style="background: transparent; color: lightgrey; border: none; border-bottom: 1px solid; text-align: center; border-color: darkgrey;">' +
                '</div>');

        $(".menu-tabs").children().attr("style", "width: 14.27%;");
        $(".menu-tabs").children().last().after('<li class="kitty-tab" style="width: 14.27%; height: 100%;" data-toggle="tooltip" data-title="KITTY" data-placement="top"><a style="height: 100%;" onclick="$(\'#main-menu\').children(\'div\').hide(); $(\'.menu-tabs\').children(\'li\').removeClass(\'active\'); $(\'.menu-tabs\').children(\'li\').children(\'a\').removeClass(\'active\'); $(\'#kitty\').fadeIn(); $(this).addClass(\'active\'); $(this).parent().addClass(\'active\'); $(\'#helloContainer\').attr(\'style\',\'transform: translate(-50%, 0%) scale(1); top: 207px;\')" href="javascript:void(0);" class="fa fa-paw fa-lg"></a></li>');
        $("#main-menu").children().last().after('<div id="kitty" class="menu-panel"><div class="agario-panel kitty-panel"><h5 class="menu-main-color">KITTY mod options</h5>' +
                '<button id="showCurTKBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="width: 50%; border-color: darkslategrey;"> Show token</button>' +
                '<button id="showPlayerBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="width: 50%; border-color: darkslategrey;">Show player</button>' +
                '<h5 class="menu-main-color" style="margin-top: 20px;">Other features</h5>' +
                '<button id="autoCoinBtn" type="button" class="btn btn-block btn-info" data-toggle="button" aria-pressed="false" autocomplete="off"><i class="fa fa-clock-o"></i> Auto free coins</button>' +
                '<button id="autoRespawnBtn" type="button" class="btn btn-block btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" data-original-title="" title=""><i class="fa fa-flash"></i> Auto respawn</button>' +
                '</div></div>');

        var initialMusicUrl = (localStorage.getItem("musicUrl") == null ? defaultMusicUrl : localStorage.getItem("musicUrl"));

        $("#music").replaceWith('<div id="music" class="menu-panel" style="display: none;"><div class="agario-panel"><h5 class="main-color">Youtube player</h5>' +
                '<iframe id="musicFrame" width="320" height="180" src="' + getEmbedUrl(initialMusicUrl) + '" frameborder="0" allowfullscreen=""></iframe>' +
                '<input id="musicUrl" onclick="$(this).select();" type="text" value="' + initialMusicUrl + '" class="form-control" data-toggle="tooltip" data-placement="right" data-original-title="Paste your video/playlist here"></div></div>');

        if (typeof YT !== 'undefined') {
            musicPlayer = new YT.Player('musicFrame', {
                events: {
                    'onStateChange': function (state) {
                        if (state.data == 1) {
                            $("#playerI").removeClass("fa-play-circle").addClass("fa-pause-circle");
                            $("#playerBtn").attr('data-original-title', "Pause").tooltip('fixTitle');
                        } else {
                            $("#playerI").removeClass("fa-pause-circle").addClass("fa-play-circle");
                            $("#playerBtn").attr('data-original-title', "Play").tooltip('fixTitle');
                        }
                    }
                }
            });
        }

        // prevent edit
        $("#musicUrl").on("input", function () {
            $(this).attr("maxlength", "0");
        });

        $("#musicUrl").bind("paste", function (e) {
            $(this).attr("maxlength", "1000");
            var pastedData = e.originalEvent.clipboardData.getData('text');
            var finalUrl = getEmbedUrl(pastedData.trim());
            if (finalUrl == false) {
                toastr["error"]("Cannot open this youtube URL").css("width", "210px");
                setTimeout(function () {
                    if (localStorage.getItem("musicUrl") == null) {
                        $("#musicUrl").val(defaultMusicUrl);
                    } else {
                        $("#musicUrl").val(localStorage.getItem("musicUrl"));
                    }
                }, 500);
            } else {
                $("#musicFrame").attr("src", finalUrl);
                localStorage.setItem("musicUrl", pastedData.trim());
            }

        });

        // save notes

        $(".note").keyup(function (event) {
            localStorage.setItem(event.target.id, $(event.target).val());
        });

        $("#searchHud").after('<div id="searchLog" class="main-color" style="font-size: 13px;float: left;font-weight: 700;border-radius: 4px;width: 65%;height: 270px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: -390px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;display: none;background-color: rgba(0, 0, 0, 0.2);"><h5 id="logTitle" class="main-color text-center" style="margin-top: 0px;">Leaderboard history</h5>' +
                '<div id="log" style="font-weight: normal; overflow-x: hidden; overflow-y: auto;height: 90%;">' +
                '</div></div>');

        $("#leaderboard-hud").append('<div id="leaderboard-menu">' +
                '<a id="searchShortcut" class="btn btn-sm btn-info" data-toggle="tooltip" data-placement="bottom" data-original-title="Join server (Backspace)" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;" data-original-title="Search leaderboards" title=""><span id="searchSpan" class="glyphicon glyphicon-search"></span></a>' +
                '<a id="copyTKBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;/* border: none; */border-left-style: none;border-right-style: none;border-bottom-style: none;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="top" data-original-title="Copy token">Copy</a>' +
                '<a id="reconnectBtn" class="btn btn-info btn-sm icon-loop2" title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Change server (+)" style="' +
                'background-color: transparent;width: 33.3%; text-shadow: 0.3px 0.3px #000000; font-size: small; margin-top: 0px; margin-top: 0px; border: none;"></a>' +
                '<div id="dropDown" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 60px; left: 67px; padding: 0px; border-radius: 0px;">' +
                '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy leaderboard (L)">LB</a>' +
                '<a id="copyIPBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="Copy IP address">IP</a>' +
                '</div>' +
                '<input id="tempCopy" style="display: none;" value="">' +
                '</div>');

        $("#searchShortcut").mouseenter(function () {
            $("#dropDown").hide();
            // $("#dropDown2").hide();
            $("#copyTKBtn").text("Copy");
        });
        $("#copyTKBtn").mouseenter(function () {
            $("#copyTKBtn").text("TK");
            // $("#dropDown2").hide();
            $("#dropDown").show(100);
        });
        $("#leaderboard-menu").mouseleave(function () {
            $("#dropDown").hide();
            // $("#dropDown2").hide();
            $("#copyTKBtn").text("Copy");
        });

        $("#logTitle").after('<a href="#" style="color: lightgrey;float: right;position: absolute;right: 12px;top: 9px;" class="main-color" onclick="$(\'#log\').html(\'\');" data-toggle="tooltip" data-placement="left" data-original-title="Clear list"><span class="glyphicon glyphicon-ban-circle"></span></a>');
        $("#searchBtn").tooltip('disable');

        $("#copyLBBtn").click(function () {
            copy(getLeaderboard());
        });

        $("#copyTKBtn").click(function () {
            copy("http://agar.io/#" + currentToken);
        });

        $("#copyIPBtn").click(function () {
            copy("http://agar.io/?r=" + MC.getRegion() + "&m=" + getGameMode() + "&search=ws://" + currentIP);
        });

        $("#reconnectBtn").click(function () {
            hideMenu();
            changeServer();

            if (!$("#searchHud").is(':visible')) {
                delay(200, spectate);
            }
        });

        /*$("#createPartyBtn").click(function(){
         hideMenu();
         $("#create-party-btn").click();
         
         if (!$("#searchHud").is(':visible')) {
         delay(200, spectate);
         }
         });*/
        $("#reconnectBtn").mouseenter(function () {
            $("#dropDown").hide();
            //$("#dropDown2").show(100);
            $("#copyTKBtn").text("Copy");
        });

        $("#searchBtn").click(function () {
            var searchString = $("#searchInput").val();
            searchHandler(searchString);
        });
        $("#searchInput").keyup(function (event) {
            if (event.keyCode == 13) {
                $("#searchBtn").click();
            }
        });

        $("#closeBtn").click(function () {
            hideSearchHud();
        });
        $("#searchShortcut").click(function () {
            hideMenu();
            showSearchHud();
            $("#searchInput").focus().select();
        });


        var ogarioVersion = $("#menu-footer").text().split("| ")[1];
        $("#menu-footer").text("");
        // kitty footer
        $("#menu-footer").prepend('<span style="float: left; font-size: 13px;"><a target="_blank" onclick="ga(\'send\', \'event\', \'Link\', \'click\', \'kittyWebsite\');" href="https://kittymod.github.io/" style="color: #ffffff;" data-toggle="tooltip" data-title="KITTY Website" data-placement="left">KITTY mod v' + modVersion + '</a></span>' +
                '<a href="http://ogario.ovh" target="_blank">OGARio</a> ' + ogarioVersion);

        // donate button
        $("#menu-footer").after('<form onclick="ga(\'send\', \'event\', \'Link\', \'click\', \'donate\');" data-toggle="tooltip" data-title="Please support KITTY 😽" data-placement="left" target="_blank" action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="ELCEHJY3M52K8"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form>');

        //$("#minimap-sectors").attr("style", "opacity: 0.25;");

        // keybinds

        $(document).keyup(function (event) {

            if (event.which == 8) { // search
                if ($('input:focus').length == 0) {
                    $("#searchShortcut").click();
                }

            } else if (event.which == 187 && !($("input").is(":focus")) && ogario.play == false) { // refresh server
                $("#reconnectBtn").click();

            } else if (event.which == 27) { // ESCAPE

                if ($('#searchHud').is(':visible')) {
                    hideSearchHud();
                } else {
                    showMenu();
                }
            }

        });

        $(document).keydown(function (event) {
            if (event.which == 81 && ogario.spectate && !($("input").is(":focus"))) { // spectate 'Q' fix
                spectate();
            }
        });

        $("#time-hud").attr("style", "top: 290px !important;");

        // fix leaderboard buttons
        $("#leaderboard-menu").css("pointer-events", "auto");
        $("#searchHud").css("pointer-events", "auto");

        // fix stats text size
        $('[id="statsText"]').css("font-size", "medium");

        // detect paste
        $(document).bind("paste", function (e) {
            if (!searching && !($("input,textarea").is(":focus"))) {
                var pastedData = e.originalEvent.clipboardData.getData('text');
                hideMenu();
                showSearchHud();
                $("#searchInput").val(pastedData);
                $("#searchInput").select();
                searchHandler(pastedData);
            }
        });

        $("#searchInput").bind("paste", function (e) {
            if (!searching) {
                var pastedData = e.originalEvent.clipboardData.getData('text');
                $("#searchInput").val(pastedData);
                $("#searchInput").select();
                searchHandler(pastedData);
            }
        });

        //load notes
        $("#note1").val(localStorage.getItem('note1'));
        $("#note2").val(localStorage.getItem('note2'));
        $("#note3").val(localStorage.getItem('note3'));
        $("#note4").val(localStorage.getItem('note4'));
        $("#note5").val(localStorage.getItem('note5'));
        $("#note6").val(localStorage.getItem('note6'));
        $("#note7").val(localStorage.getItem('note7'));

        // listen for server disconnect
        MC.onDisconnect = function () {
            toastr["error"]("Disconnected from server :(").css("width", "210px");
            appendSysLog("DISCONNECTED :(");
        };

        // listen for player ban
        MC.onPlayerBanned = function () {
            toastr["error"]("You were banned :(").css("width", "210px");
            appendSysLog("BAN :(");
        };

        $("#region").ready(function () {
            delay(2000, getInfo);
        });

        $('body').on('click', '.logEntry', function () {

            document.getElementById('searchInput').value = "http://agar.io/#" + $(this).data('token');
            bumpLog();
            getInfo();
            searchTKHandler($("#searchInput").val());

        });

        $('body').on('click', '.btn-play-shortcut', function () {
            hideSearchHud();
            toastr.clear();
            play();
        });
        $('body').on('click', '.btn-spectate-shortcut', function () {
            hideSearchHud();
            toastr.clear();
            spectate();
        });


        $("#region, #gamemode").change(function () {
            appendLog(getLeaderboard());
        });

        // hide exp bar
        $("#exp-bar").remove();

        // hide party form
        $("#ogario-party").wrap('<div style="display: none;"></div>');

        var url = window.location.href;     // Returns full URL
        /*if (url.length !== 21) {
         $("#ogario-party").hide();
         }*/


        $("#gamemode").change(function () {
            if ($("#gamemode").val() == ":party") {
                $("#ogario-party").show();
                $("#joinPartyToken").val("");
            } else {
                $("#ogario-party").hide();
            }
            localStorage.setItem("gamemode", ogario.gameMode);
        });

        // style buttons
        $(".btn-spectate, .btn-logout").attr("style", "border-top: none; border-left: none; border-right: none;");

        $("#region").change(function () {
            localStorage.setItem("location2", MC.getRegion());
        });

        $(document).ajaxComplete(function (event, xhr, settings) {
            //console.log(xhr);
            //console.log(settings);

            if (xhr.responseJSON != null) {
                if (xhr.responseJSON.ip != null && xhr.responseJSON.hasOwnProperty('ip')) {
                    currentIP = xhr.responseJSON.ip;
                }

                if (xhr.responseJSON.token != null && xhr.responseJSON.hasOwnProperty('token')) {
                    currentToken = xhr.responseJSON.token;
                    if (localStorage.getItem("showTK") == "true" || localStorage.getItem("showTK") == null) {
                        $("#cur-tk-hud").fadeTo('fast', 0.2).fadeTo('fast', 1.0);
                        $("#cur-tk-hud").text("TK: #" + currentToken);
                    }
                    //joinToken(currentToken.replace("http://agar.io/#", ""));
                }
            }

            if (xhr.status == 200 && settings.url == "http://m.agar.io/getToken") {
                //toastr["info"]("Connected :)").css("width","210px");
                delay(200, spectate);
                toastr["info"]('Connected!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">PLAY</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">SPECTATE</button>', "", {timeOut: 20000, extendedTimeOut: 20000}).css("width", "210px");
            }
        });

        $(document).ajaxError(function (event, xhr, settings) {
            //console.log(xhr);
            //console.log(event);
            //console.log(settings);

            if (xhr.status == 404 && settings.url == "http://m.agar.io/getToken") {
                toastr["error"]("Invalid token or server has closed :(").css("width", "210px");
                $('#helloContainer').attr('data-party-state', '0');
            }
        });

        // search IP in query
        setTimeout(function () {

            var url = window.location.href;
            var region = getParameterByName("r", url);
            var mode = getParameterByName("m", url);
            var searchStr = getParameterByName("search", url);

            if (url.length == 21) {

                joinToken(url.replace("http://agar.io/#", ""));
            } else {
                if (region != null) {

                    MC.setRegion(region);
                    MC.setGameMode(mode);
                } else {
                    // bug fix
                    MC.setRegion(localStorage.getItem("location2"));
                    MC.setGameMode(previousMode);
                }
            }

            if (searchStr != null && searchStr) {

                if (searchIPHandler(searchStr)) {
                    hideMenu();
                    showSearchHud();
                    showCancelSearch();
                    $("#searchInput").val(searchStr);
                }
            }

        }, 10000); //10

        $("#autoCoinBtn").click(function () {

            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {
                startCoinMining();
                $(this).html('<i class="fa fa-clock-o"></i> Stop free coins');
            } else {
                stopCoinMining();
                $(this).html('<i class="fa fa-clock-o"></i> Auto free coins');
            }

        });

        $("#autoRespawnBtn").click(function () {

            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {

                localStorage.setItem("autoRespawn", true);

                // auto respawn
                //var proxyOnDeath = MC.onPlayerDeath;
                MC.onPlayerDeath = function () {
                    var isVisibleMenu = $("#main-menu").is(':visible');
                    var isVisibleSearchHud = $("#searchHud").is(':visible');
                    var autoRespawn = localStorage.getItem("autoRespawn");
                    //proxyOnDeath();

                    // disable stats
                    if (!$("#skipStats").is(':checked')) {
                        $("#skipStats").click()
                    }

                    if (autoRespawn != null && autoRespawn == "true" && !isVisibleMenu && !isVisibleSearchHud && !($("input").is(":focus"))) {
                        setTimeout(function () {
                            play();
                        }, 1500);
                    }
                };

                $(this).html('<i class="fa fa-flash"></i> Stop respawn');
            } else {
                localStorage.setItem("autoRespawn", false);
                MC.onPlayerDeath = originalDeath;
                $(this).html('<i class="fa fa-flash"></i> Auto respawn');
            }

        });



        // show token
        $("#showCurTKBtn").click(function () {

            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {
                localStorage.setItem("showTK", true);
                $("#cur-tk-hud").show();
                $("#cur-tk-hud").text("TK: #" + currentToken);
                $(this).text('Hide token');
            } else {
                localStorage.setItem("showTK", false);
                $("#cur-tk-hud").hide();
                $(this).text('Show token');
            }

        });

        // show player
        $("#showPlayerBtn").click(function () {

            var checked = !($(this).attr('aria-pressed') == "true");
            if (checked) {
                $("#player-hud").show();
                localStorage.setItem("showPlayer", true);
                $(this).text('Hide player');
            } else {
                $("#player-hud").hide();
                localStorage.setItem("showPlayer", false);
                $(this).text('Show player');
            }

        });

        $("#stats-hud").after('<div id="cur-tk-hud" class="hud main-color hud-top" style=" right: 220px; font-size: 15px; padding: 6px;"></div>');
        $("#minimap-hud").prepend('<div id="player-hud" class="hud" style="width: 30px;height: 30px;padding: 0px;pointer-events: auto; position: absolute; position: absolute; right: 0px; top: -30px;">' +
                '<button id="playerBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 100%; height: 100%;" data-toggle="tooltip" data-original-title="Play">' +
                '<i id="playerI" class="fa fa-play-circle" style="padding-left: 0px;"></i></button></div>');

        // player shortcut

        $("#playerBtn").click(function () {
            if (musicPlayer != undefined) {
                var playerState = musicPlayer.getPlayerState();
                if (playerState != 1) {
                    musicPlayer.playVideo();
                    $("#playerI").removeClass("fa-play-circle").addClass("fa-pause-circle");
                    $(this).attr('data-original-title', "Pause").tooltip('fixTitle').tooltip('show');
                } else {
                    musicPlayer.pauseVideo();
                    $("#playerI").removeClass("fa-pause-circle").addClass("fa-play-circle");
                    $(this).attr('data-original-title', "Play").tooltip('fixTitle').tooltip('show');
                }
            }
        });

        $('*[data-itr="page_play"]').click(function () {
            ga('send', 'event', 'Token', ogario.playerNick + ' | agar.io/#' + currentToken);
            ga('send', 'event', 'Tag', ogario.playerNick + ' | ' + ogario.clanTag);
            ga('send', 'event', 'PlayerId', ogario.playerNick + ' | ' + $("#user-id-tag").text().split(": ")[1]);
        });
        // load tooltips
        $('[data-toggle="tooltip"]').tooltip();

        // load kitty settings
        var autoRespawn = localStorage.getItem("autoRespawn");
        var showToken = localStorage.getItem("showTK");
        var showPlayer = localStorage.getItem("showPlayer");
        if (autoRespawn == "true") {
            $("#autoRespawnBtn").click();
        }
        if (showToken == "true" || showPlayer == null) {
            $("#cur-tk-hud").show();
            $("#showCurTKBtn").click();
        }
        if (showPlayer == "true" || showPlayer == null) {
            $("#showPlayerBtn").click();
        }

        // fix main menu placement after stats
        $("#statsContinue2").click(function () {
            $("#main-menu > ul > li.start-tab > a").click()
        });

        // save original death function
        originalDeath = MC.onPlayerDeath;

        // remove leaderboard setting
        $("#normalLb").parent().remove();
        $("#leaderboard-hud > h4").text("v.ht/cungkrings");

        // fix party stuff
        $('#gamemode').on('change', function () {
            if (this.value == ":party") {
                $("#create-party-btn").click();
            }
        });

        // ADS
        $("#main-panel").append('<div id="kittyAds"></div>');
        

        // ANNOUNCEMENTS
        toastr["info"]('CUNGKRINGS mod v' + modVersion + ': Fixed issue where mod was not loading! Mod loads faster now!! Enjoy! :D');
        

    }, 500);
}

var searching;
var timerId;

function delay(time, func) {
    setTimeout(function () {
        func();
    }, time);
}

function spectate() {
    hideMenu();
    $(".btn-spectate").click();
}

function changeServer() {
    MC.setGameMode(ogario.gameMode);
    MC.reconnect();
    appendLog(getLeaderboard());
}

function isValidIpAndPort(input) {
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    return validateNum(port, 1, 65535) &&
            ip.length == 4 &&
            ip.every(function (segment) {
                return validateNum(segment, 0, 255);
            });
}

function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}

function joinToken(token) {
    //var lastMode = $("#gamemode").val();
    appendLog(getLeaderboard());
    $("#joinPartyToken").val(token);
    $("#join-party-btn").click();
    $("#joinPartyToken").val("");
    $("#gamemode").val("");
    //setTimeout(function(){ $("#gamemode").val(lastMode); }, 1000);
    currentToken = token;
    if (localStorage.getItem("showTK") == "true") {
        $("#cur-tk-hud").fadeTo('fast', 0.2).fadeTo('fast', 1.0);
        $("#cur-tk-hud").text("TK: #" + currentToken);
    }

}

function searchHandler(searchStr) {

    searchStr = searchStr.trim();

    if (searchIPHandler(searchStr)) {
        // is an IP
    } else if (searchTKHandler(searchStr)) {
        // is a token
    } else {
        searchPlayer(searchStr);
    }

}

function searchTKHandler(searchStr) {
    searchStr = searchStr.trim();

    if (searchStr.startsWith("http://agar.io/#")) {
        joinToken(searchStr.replace("http://agar.io/#", ""));
    } else if (searchStr.startsWith("agar.io/#")) {
        joinToken(searchStr.replace("agar.io/#", ""));
    } else {
        return false;
    }
    return true;

}

function searchIPHandler(searchStr) {
    searchStr = searchStr.trim();

    if (isValidIpAndPort(searchStr)) {
        findIP(searchStr);
    } else if (isValidIpAndPort(searchStr.replace("ws://", ""))) {
        findIP(searchStr.replace("ws://", ""));
    } else if (isValidIpAndPort(searchStr.replace("agar.io/?search=ws://", ""))) {
        findIP(searchStr.replace("agar.io/?search=ws://", ""));
    } else if (isValidIpAndPort(searchStr.replace("http://agar.io/?search=ws://", ""))) {
        findIP(searchStr.replace("http://agar.io/?search=ws://", ""));
    } else if (isValidIpAndPort(searchStr.replace("http://agar.io/?sip=", ""))) {
        findIP(searchStr.replace("http://agar.io/?sip=", ""));
    } else if (getParameterByName("search", searchStr)) {

        var region = getParameterByName("r", searchStr);
        var mode = getParameterByName("m", searchStr);
        var ip = getParameterByName("search", searchStr);

        if (region) {
            MC.setRegion(region);
            getInfo();
        }
        MC.setGameMode(mode);

        findIP(ip.replace("ws://", ""));

    } else {
        return false;
    }
    return true;
}

function findIP(searchIP) {

    if (!searching) {

        if ($.trim(searchIP) == '') {

        } else {
            showCancelSearch();

            searching = true;

            var interval = 1800;
            var maxTries = 30;
            var numTries = 0;

            var numAttempts = 0;
            var maxAttempts = 2;

            toastr["success"]("Searching IP \'ws://" + searchIP + "\'...").css("width", "210px");

            numTries++;

            if (currentIP == searchIP) {
                searching = false;
                hideCancelSearch();
                //hideSearchHud();
                toastr["info"]('Leaderboard found!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">PLAY</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">SPECTATE</button>', "", {timeOut: 20000, extendedTimeOut: 20000}).css("width", "210px");
                //showMenu();
            } else {

                changeServer();

                timerId = setInterval(function () {

                    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
                        numAttempts = 0;
                        //console.log("MC.isConnecting(): " + MC.isConnecting());

                        numTries++;
                        toastr["success"]("Search: " + numTries + "\/" + maxTries).css("width", "210px");
                        if (numTries >= maxTries) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            toastr["error"]("The leaderboard was not found. Keep trying...").css("width", "210px");
                        }
                        if (currentIP == searchIP) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            //hideSearchHud();
                            toastr["info"]('Leaderboard found!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">PLAY</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">SPECTATE</button>', "", {timeOut: 20000, extendedTimeOut: 20000}).css("width", "210px");
                            //showMenu();
                        } else {
                            //console.log("MC.isConnecting(): " + MC.isConnecting());
                            changeServer();
                        }
                    } else {
                        numAttempts++;
                        //console.log("numAttempts: " + numAttempts);
                    }
                }, interval);

            }
        }
    } else {
        clearInterval(timerId);
        searching = false;
        hideCancelSearch();
        toastr["error"]("Search was canceled!").css("width", "210px");
    }
}


function searchPlayer(searchString) {
    if (!searching) {

        if ($.trim(searchString) == '') {

        } else {

            showCancelSearch();

            searching = true;

            //var interval = 2500;
            var interval = 1800;
            var maxTries = 30;
            var numTries = 0;
            var minNamesFound = 3;

            var numAttempts = 0;
            var maxAttempts = 2;

            toastr["success"]("Searching \'" + searchString + "\'...").css("width", "210px");

            var leaderboard = getLeaderboard();
            var names = searchString.split(/[1-9]\.\s|10\.\s/g).filter(function (el) {
                return el.length != 0;
            });
            //console.log(leaderboard);

            var numNames = names.length;
            //console.log("Number of names: " + numNames);

            var found = false;
            numTries++;
            toastr["success"]("Search: " + numTries + "\/" + maxTries).css("width", "210px");

            if (numNames == 1) {
                found = foundName(leaderboard, searchString);
            } else if (numNames > 1) {
                found = foundNames(leaderboard, names, minNamesFound);
            }

            if (found) {
                searching = false;
                hideCancelSearch();
                //hideSearchHud();
                toastr["info"]('Leaderboard found!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">PLAY</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">SPECTATE</button>', "", {timeOut: 20000, extendedTimeOut: 20000}).css("width", "210px");
                //showMenu();
            } else {
                changeServer();

                // start timer

                timerId = setInterval(function () {

                    if (MC.isConnecting() == false || numAttempts == maxAttempts) {
                        numAttempts = 0;
                        //console.log("MC.isConnecting(): " + MC.isConnecting());
                        leaderboard = $(ogario.leaderboardHTML).text();

                        //console.log(leaderboard);
                        //console.log("Number of names: " + numNames);

                        if (numNames == 1) {
                            found = foundName(leaderboard, searchString);
                        } else if (numNames > 1) {
                            found = foundNames(leaderboard, names, minNamesFound);
                        }
                        numTries++;
                        toastr["success"]("Search: " + numTries + "\/" + maxTries).css("width", "210px");
                        if (numTries >= maxTries) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            toastr["error"]("The leaderboard was not found. Keep trying...").css("width", "210px");
                        }
                        if (found) {
                            clearInterval(timerId);
                            searching = false;
                            hideCancelSearch();
                            //hideSearchHud();
                            toastr["info"]('Leaderboard found!</br> <button class="btn btn-sm btn-primary btn-play btn-play-shortcut" style="margin-top: 10px;border-color: darkblue;">PLAY</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" style="width: 100%;margin-top: 10px;">SPECTATE</button>', "", {timeOut: 20000, extendedTimeOut: 20000}).css("width", "210px");
                            //showMenu();
                        } else {
                            //console.log("MC.isConnecting(): " + MC.isConnecting());
                            changeServer();
                        }
                    } else {
                        numAttempts++;
                        //console.log("numAttempts: " + numAttempts);
                    }
                }, interval);
            }


        }

    } else {
        clearInterval(timerId);
        searching = false;
        hideCancelSearch();
        toastr["error"]("Search was canceled!").css("width", "210px");
    }
}

function foundName(leaderboard, name) {
    return leaderboard.includes(name);
}

function foundNames(leaderboard, names, minNamesFound) {

    var numNames = names.length;
    var countFound = 0;
    var found = false;

    for (var i = 0; i < numNames; i++) {
        found = foundName(leaderboard, names[i]);
        if (found) {
            countFound++;
        }
    }

    //if (countFound >= minNamesFound) {alert(countFound);}

    //console.log("found: " + countFound);
    return (countFound >= minNamesFound) ? true : false;
}

//

function copy(text) {

    $("#tempCopy").val(text);
    $("#tempCopy").show();
    $("#tempCopy").select();
    document.execCommand('copy');
    $("#tempCopy").hide();
    $("#tempCopy").val("");
}

function showSearchHud() {
    getInfo();
    $("#backgroundFade").fadeIn();
    $("#notes").fadeIn();
    $("#statsInfo").fadeIn();
    $("#searchHud").fadeIn();
    $("#searchLog").fadeIn();

}

function hideSearchHud() {
    $("#searchHud").fadeOut();
    $("#backgroundFade").fadeOut();
    $("#notes").fadeOut();
    $("#statsInfo").fadeOut();
    $("#searchLog").fadeOut();
}

function showCancelSearch() {
    $("#searchSpan").removeClass("glyphicon-search").addClass("glyphicon-ban-circle");
    $("#searchBtn").removeClass("btn-primary").addClass("btn-danger");
    $("#searchBtn").tooltip('enable');
    $("#searchBtn").tooltip('show');
}

function hideCancelSearch() {
    $("#searchSpan").removeClass("glyphicon-ban-circle").addClass("glyphicon-search");
    $("#searchBtn").removeClass("btn-danger").addClass("btn-primary");
    $("#searchBtn").tooltip('hide');
    $("#searchBtn").tooltip('disable');
}

function showMenu() {
    $("#overlays").css("left", "0");
    $("#overlays").show();

    $('a[href="#main-panel"]').click();
}

function hideMenu() {
    $("#overlays").css("left", "-999em");
}

function getLeaderboard() {
    return $(ogario.leaderboardHTML).text();
}

function getGameMode() {
    return $("#gamemode").val();
}


function bumpLog() {
    $("#log").animate({scrollTop: 0}, "slow");
}

function getInfo() {
    $.ajax({type: "GET", url: "http://m.agar.io/info",
        datatype: "json",
        success: function (info) {
            $("#currentRegion").html(MC.getRegion());
            var regions = info.regions;
            var currentRegion;
            for (var key in regions) {
                if (key == MC.getRegion()) {
                    currentRegion = regions[key];
                    break;
                }
            }
            //console.log(info);
            //console.log(currentRegion);
            if (currentRegion != undefined) {
                $("#numPlayers").html(kFormatter(currentRegion.numPlayers));
                $("#numServers").html(currentRegion.numRealms);
                $("#pps").html(Math.round(currentRegion.avgPlayersPerRealm));
            }
            $("#totalPlayers").html(kFormatter(info.totals.numPlayers));
        }});
}

function kFormatter(num) {
    return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
}

function clearNotifications() {
    toastr.clear();
}

function play() {
    $('*[data-itr="page_play"]').click();
}

function spectate() {
    $('*[data-itr="page_spectate"]').click();
}

function appendLog(message) {
    var region = MC.getRegion();
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
            '<span class="main-color">' + region.substring(0, 2) + '</span> &nbsp;' +
            '<a href="javascript:void(0);" class="logEntry" data-token="' + currentToken + '" style="color: lightgrey; font-size: 14px;">' + message + '</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}

function appendSysLog(message) {
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
            '<span class="main-color">' + message + '</span></p>');

    $("#log p").first().show(100);
    bumpLog();
}

function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getQueryVariable(variable, url)
{
    var query = url.substring(1);
    var vars = query.split("&amp;");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == name) {
            return pair[1];
        }
    }
    return(false);
}

function startCoinMining() {
    getCoin();
    setTimeout(function () {
        $("#autoCoinBtn").tooltip('show');
    }, 2000);
    coinTimer = setInterval(function () {
        getCoin();

    }, 60 * 60 * 1000 + 5000); // 1h
}

function stopCoinMining() {
    clearInterval(coinTimer);
    $("#autoCoinBtn").tooltip('destroy');
}

function simulateClick(x, y, el) {
    // console.log(x + ',' + y);
    if (!el)
        el = document.elementFromPoint(x, y);
    var ev = new MouseEvent('mousedown', {'clientX': x, 'clientY': y});
    el.dispatchEvent(ev);
    ev = new MouseEvent('mouseup', {'clientX': x, 'clientY': y});
    el.dispatchEvent(ev);
}

function getCoin() {

    $("#autoCoinBtn").tooltip('destroy');
    $("#freeCoins").click();

    var canvas2 = document.getElementById('openfl-content').getElementsByTagName('canvas')[0];

    var xPoses = [-150, 192, 192, 192, 232];
    var yPoses = [30, -208, -160, -150, -62];
    //var delays = [ 500, 1700, 1750, 1800, 2000 ];
    var delays = [500, 1700, 1750, 1800, 2900];
    for (var i = 0; i < xPoses.length; i++) {
        (function (j) {
            setTimeout(function () {
                simulateClick(window.innerWidth / 2 + xPoses[j], window.innerHeight / 2 + yPoses[j], canvas2);
            }, delays[j]);
        })(i);
    }

    var d = new Date();
    d.setHours(d.getHours() + 1);
    var timeStr = d.toTimeString("hh:mm");
    timeStr = timeStr.substring(0, 5);

    $("#autoCoinBtn").tooltip({title: "Next " + timeStr, container: "body", placement: "right"});

    if (ogario.play == true) {
        setTimeout(function () {
            $("#autoCoinBtn").tooltip("hide");
        }, 3000);
        play();
    }
}

function getEmbedUrl(url) {
    url = url.trim();
    var musicParams = "showinfo=0&controls=2&vq=tiny&enablejsapi=1";
    var videoId = getParameterByName("v", url);
    var listId = getParameterByName("list", url);

    if (videoId != null && listId == null) {
        return "https://www.youtube.com/embed/" + videoId + "?" + musicParams;
    } else if (listId != null && videoId != null) {
        return "https://www.youtube.com/embed/" + videoId + "?list=" + listId + "&" + musicParams;
    } else if (url.startsWith("https://youtu.be/")) {
        if (listId != null) {
            return url.replace("https://youtu.be/", "https://www.youtube.com/embed/") + "&" + musicParams;
        } else {
            return url.replace("https://youtu.be/", "https://www.youtube.com/embed/") + "?" + musicParams;
        }
    } else {
        return false;
    }

}

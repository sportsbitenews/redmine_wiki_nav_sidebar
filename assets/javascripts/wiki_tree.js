function hideLeftSideBar()
{
    set_background_color();
    if ($('#left_sidebar').is(':visible')) {
        $('#left_sidebar').addClass('sidebar_hidden');

        $('#content').css('margin-left', '0px');
        $('#hideleftSidebarButton').addClass('sidebar_hidden');
        setCookie('left_sidebar_hide', 'hide', 100);
        $('#content').removeClass('content-closed');
        $('#content').addClass('content-opened');
        //$('#main').addClass('nosidebar');
        set_content_width_no_sidebar()

    } else {
        set_content_with_with_sidebar()
        $('#left_sidebar').removeClass('sidebar_hidden');
        //$('#main').removeClass('nosidebar');
        $('#content').css('margin-left', '300px');
        $('#hideleftSidebarButton').removeClass('sidebar_hidden');
        setCookie('left_sidebar_hide', 'show', 100);
        $('#content').addClass('content-closed');
        $('#content').removeClass('content-opened');
    }
}

function set_background_color(){
    if ($('#main').hasClass('nosidebar'))
    {
        $('#main').addClass('opened-sidebar-color')
    }
}

function set_content_width_no_sidebar(){
    if ($('#main').hasClass('nosidebar') && $('#left_sidebar').hasClass('sidebar_hidden'))
    {
        console.log('inside tru')
        $('#content').attr('style', 'width:auto!important')
    }
}

function set_content_with_with_sidebar(){
    $('#content').css('width', '')
}


function reload(){
    $('#left_sidebar').css('display', 'none');
    setTimeout(function(){
        $('#left_sidebar').css('display', 'block');
    }), 400

}



function setContentClasses()
{
    set_background_color();
    if ($('#left_sidebar').is(':visible')) {
        //$('#main').addClass('nosidebar');
        $('#content').removeClass('content-closed');
        $('#content').addClass('content-opened');
    } else {
        $('#content').addClass('content-closed');
        $('#content').removeClass('content-opened');
        //$('#main').removeClass('nosidebar');
    }

}

function setCollapseState()
{
    if ($('.main-collapser').attr('data-collapse-state') == "opened")
    {
        $.each($('.sidebar-wrapper > ul > li'), function(ind, el) {
            $(el).find('ul').addClass("tree-closed");
            $(el).find('ul').removeClass("opened");
            id = $(el);
            id = id.attr('id').split("_")[1];
            //var id = $(el).attr('id').split("_")[2].split(" ")[0];
            parent_link = $('*[data-parent-id='+ id + ']');
            if (parent_link && $(el).find('ul').size() != 0)
            {
                $(parent_link).html('+')
            }

            $('.main-collapser').attr('data-collapse-state', 'closed');
            setCookie('collapse-state', 'closed', 100);
        });
    }
    else
    {
        $.each($('.sidebar-wrapper > ul > li'), function(ind, el) {
            $(el).find('ul').addClass("opened");
            $(el).find('ul').removeClass("tree-closed");
            var id = $(el).attr('id').split("_")[1];
            parent_link = $('*[data-parent-id='+ id + ']');
            if (parent_link && $(el).find('ul').size() != 0)
            {
                $(parent_link).html('-')
            }
            $('.main-collapser').attr('data-collapse-state', 'opened');
            setCookie('collapse-state', 'opened', 100);
        });
    }
}

$(function(){

    if ((window.location.href.indexOf("/wiki") > -1) && !(window.location.href.indexOf("history") > -1) )
    {
        project_id = $('form').first().attr('action').replace( /\/projects\//, '' );
        project_id = project_id.replace( /\/search/, '' );

        arr = window.location.href.replace("/edit", "");
        arr = arr.split("/");
        id = arr[arr.length - 1];

        $.ajax({
            url: "/wiki_tree.js",
            data: {project_id: project_id, id: id},
            dataType: 'script',
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log('error while loading wiki pages');
                console.log(textStatus);
                console.log(errorThrown);
                $('#left_sidebar').remove();
            }
        });

        setContentClasses();


        //setCollapseState();

        $(document).on('click', '.main-collapser', function(){
            setCollapseState();
        });

        $(document).on('click', '.collapser', function(){
            var lvl = $(this).data('nest-level');
            parent_id = $(this).data('parent-id');

            if ($(this).text() == "-")
            {
                $('.nest-wrapper-' + parent_id).removeClass('opened');
                $( '.nest-wrapper-' + parent_id ).hide( "fast", function() {
                });
                $(this).text("+");
                setCookie(parent_id, 'tree-closed', 100);
                reload();
            }
            else
            {
                $('.nest-wrapper-' + parent_id).removeClass('tree-closed');
                $( '.nest-wrapper-' + parent_id ).show( "fast", function() {
                });
                setCookie(parent_id, 'opened', 100);
                $(this).text("-")
                reload();
            }
        })
    }

    else if ((window.location.href.indexOf("history") > -1))
    {
    }



});

function submit_diff_form()
{
    var form = $('.sidebar-wrapper').find('form');

        form.submit(function (ev) {
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),
                success: function (data) {
                    alert('ok');
                }
            });

            ev.preventDefault();
        });
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + ";path=/";
}

function getCookie(c_name) {
    var i;
    var x;
    var y;
    var ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name)
            return unescape(y);
    }
}


function fire_update(){
    console.log('updated');
}







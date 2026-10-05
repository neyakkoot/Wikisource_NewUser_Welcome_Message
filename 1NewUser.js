(function () {

    'use strict';

    /*
     * ============================================
     * தமிழ் விக்கிமூலம் – புதிய பயனர் வரவேற்பு
     * ============================================
     */

    var CONFIG = {

        /*
         * வரவேற்புச் செய்தி preload page
         */
        preloadPage:
            'விக்கிமூலம்:புதுப்பயனர் வரவேற்பு/செய்தி',

        /*
         * புதிய Talk section title
         */
        sectionTitle:
            'விக்கிமூலத்திற்கு வரவேற்கிறோம்!',

        /*
         * Button text
         */
        buttonText:
            '🌷 வரவேற்க'

    };


    /*
     * ============================================
     * USERNAME கண்டறிதல்
     * ============================================
     */

    function getUsernameFromLink(link) {

        var href =
            $(link).attr('href');

        if (!href) {
            return null;
        }


        /*
         * /wiki/பயனர்:USERNAME
         */

        var match =
            href.match(
                /\/wiki\/(?:பயனர்|User):([^?#]+)/i
            );


        if (!match) {
            return null;
        }


        var username;

        try {

            username =
                decodeURIComponent(
                    match[1]
                );

        } catch (e) {

            username =
                match[1];

        }


        /*
         * underscore → space
         */

        username =
            username.replace(
                /_/g,
                ' '
            );


        return username;
    }


    /*
     * ============================================
     * வரவேற்பு URL உருவாக்குதல்
     * ============================================
     */

    function getWelcomeURL(username) {

        var talkPage =
            'பயனர் பேச்சு:' + username;


        return mw.util.getUrl(
            talkPage,
            {

                action:
                    'edit',

                section:
                    'new',

                preload:
                    CONFIG.preloadPage,

                'preloadparams[]':
                    username,

                preloadtitle:
                    CONFIG.sectionTitle

            }
        );
    }


    /*
     * ============================================
     * 🌷 வரவேற்க BUTTON
     * ============================================
     */

    function createWelcomeButton(username) {

        var url =
            getWelcomeURL(username);


        var button =
            $('<a>')

                .attr(
                    'href',
                    url
                )

                .attr(
                    'target',
                    '_blank'
                )

                .attr(
                    'rel',
                    'noopener'
                )

                .text(
                    CONFIG.buttonText
                )

                .attr(
                    'title',
                    username +
                    ' அவர்களுக்கு வரவேற்புச் செய்தி அனுப்ப'
                )

                .css({

                    'display':
                        'inline-block',

                    'margin-left':
                        '8px',

                    'padding':
                        '2px 7px',

                    'font-size':
                        '12px',

                    'font-weight':
                        'bold',

                    'text-decoration':
                        'none',

                    'border':
                        '1px solid #00a884',

                    'border-radius':
                        '5px',

                    'background':
                        '#00a884',

                    'color':
                        '#ffffff',

                    'cursor':
                        'pointer'

                });


        return button;
    }


    /*
     * ============================================
     * "ஆதரவு" பகுதியில் புதிய பயனர்களைக் கண்டறிதல்
     * ============================================
     */

    function addButtonsToSupportSection() {

        /*
         * ஏற்கனவே button சேர்க்கப்பட்டிருந்தால்
         */

        if (
            $('.ta-new-user-welcome-button').length
        ) {
            return;
        }


        /*
         * "ஆதரவு" என்ற heading-ஐ தேடுதல்
         */

        var supportHeading = null;


        $('#mw-content-text')
            .find('h1, h2, h3, h4, h5, h6')
            .each(function () {

                var text =
                    $(this)
                        .text()
                        .trim();

                if (
                    text.indexOf('ஆதரவு') !== -1
                ) {

                    supportHeading =
                        this;

                    return false;

                }

            });


        /*
         * "ஆதரவு" heading கிடைக்கவில்லை என்றால்
         * முழுப் content-ல் User links தேடப்படும்
         */

        var container;


        if (supportHeading) {

            container =
                $(supportHeading)
                    .nextUntil(
                        'h1, h2, h3, h4, h5, h6'
                    );

        } else {

            container =
                $('#mw-content-text');

        }


        /*
         * User links கண்டறிதல்
         */

        container
            .find(
                'a[href*="/wiki/பயனர்:"], ' +
                'a[href*="/wiki/User:"]'
            )
            .each(function () {

                var link =
                    this;


                /*
                 * இந்த link ஏற்கனவே process செய்யப்பட்டதா?
                 */

                if (
                    $(link)
                        .data(
                            'taWelcomeAdded'
                        )
                ) {

                    return;

                }


                /*
                 * Username
                 */

                var username =
                    getUsernameFromLink(
                        link
                    );


                if (!username) {
                    return;
                }


                /*
                 * தன்னுடைய பெயருக்கு button வேண்டாம்
                 */

                var currentUser =
                    mw.config.get(
                        'wgUserName'
                    );


                if (
                    currentUser &&
                    username === currentUser
                ) {

                    return;

                }


                /*
                 * Button உருவாக்குதல்
                 */

                var button =
                    createWelcomeButton(
                        username
                    );


                /*
                 * Link-க்கு அருகில் சேர்க்கவும்
                 */

                $(link)
                    .after(
                        button
                    );


                /*
                 * மீண்டும் process செய்யாமல்
                 * குறியிடுதல்
                 */

                $(link)
                    .data(
                        'taWelcomeAdded',
                        true
                    );

            });

    }


    /*
     * ============================================
     * SIDEBAR BUTTON
     * ============================================
     */

    function addSidebarButton() {

        if (
            $('#ta-new-user-welcome').length
        ) {

            return;

        }


        var element =
            mw.util.addPortletLink(

                'p-tb',

                '#',

                '🌷 புதுப்பயனர் வரவேற்பு',

                'ta-new-user-welcome',

                'புதிய பயனருக்கு வரவேற்புச் செய்தி அனுப்ப'

            );


        /*
         * addPortletLink null கொடுக்கலாம்
         */

        if (!element) {
            return;
        }


        $(element)
            .on(
                'click',
                function (e) {

                    e.preventDefault();


                    var username =
                        window.prompt(
                            'புதுப்பயனர் பெயரை உள்ளிடவும்:',
                            ''
                        );


                    if (!username) {
                        return;
                    }


                    var url =
                        getWelcomeURL(
                            username.trim()
                        );


                    window.open(
                        url,
                        '_blank'
                    );

                }
            );

    }


    /*
     * ============================================
     * INITIALIZE
     * ============================================
     */

    function initialize() {

        /*
         * Sidebar button
         */

        addSidebarButton();


        /*
         * ஆதரவு பகுதியில்
         * தானாக Welcome buttons
         */

        addButtonsToSupportSection();

    }


    /*
     * ============================================
     * MEDIAWIKI MODULE LOAD
     * ============================================
     */

    $.when(

        mw.loader.using(
            'mediawiki.util'
        ),

        $.ready

    ).then(function () {

        initialize();

    });


})();

// This file is part of edu-sharing created by metaVentis GmbH — http://metaventis.com
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @package    filter_edusharing
 * @copyright  metaVentis GmbH — http://metaventis.com
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


$(document).ready(function() {

    $.fn.isInViewport = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    $.ajaxSetup({cache: false});

    var videoFormat = 'webm';
    var v = document.createElement('video');
    if (v.canPlayType && v.canPlayType('video/mp4').replace(/no/, '')) {
        videoFormat = 'mp4';
    }

    function renderEsObject(esObject, wrapper) {
        var url = esObject.attr("data-url") + '&videoFormat=' + videoFormat;
        if (typeof wrapper == 'undefined') {
            var wrapper = esObject.parent();
        }
        $.get(url, function(data) {
            wrapper.html('').append(data).css({display: 'none'}).fadeIn('slow', 'linear');
            if (data.toLowerCase().indexOf('data-view="lock"') >= 0) {
                setTimeout(function() {
                    renderEsObject(esObject, wrapper);
                }, 1111);
            }
        });
        esObject.removeAttr("data-type");
    }

    $("div[data-type='esObject']").each(function() {
        if ($(this).isInViewport()){
            renderEsObject($(this));
        }
    });

    $(window).scroll(function() {
        $("div[data-type='esObject']").each(function() {
            if ($(this).isInViewport()){
                renderEsObject($(this));
            }
        });
    });

    $("body").click(function(e) {
        if ($(e.target).closest(".edusharing_metadata").length) {
            // Clicked inside ".edusharing_metadata" - do nothing
        } else if ($(e.target).closest(".edusharing_metadata_toggle_button").length) {
            $(".edusharing_metadata").fadeOut('fast');
            let toggle_button = $(e.target);
            let metadata = toggle_button.parent().find(".edusharing_metadata");
            if (metadata.hasClass('open')) {
                metadata.toggleClass('open');
                metadata.fadeOut('fast');
            } else {
                $(".edusharing_metadata").removeClass('open');
                metadata.toggleClass('open');
                metadata.fadeIn('fast');
            }
        } else {
            $(".edusharing_metadata").fadeOut('fast');
            $(".edusharing_metadata").removeClass('open');
        }
    });

});

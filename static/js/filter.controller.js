(function ($) {

    var defaults = {
        TYPES:
            {
                brands: 'fb',
                types: 'ft',
                discounts: 'fd',
                prices: 'fp'
            },
            filterCount: $('#fbc_count'),
            itemList:[]
    },
    filterGroup = [],
        methods = {
            init: function (options) {
                $this = $(this)
                $(document).on('click', $this.selector, function (e) {
                    e.preventDefault();

                    var data = $(this).data(),
                        settings = $.extend({}, defaults, options, data),
                        filterFound = false
                    // console.log(settings)
                    //store the filters in array to keep track of which filters are activate
                    filterGroup.forEach(filter => {
                        if (filter.filter == settings.filter) {
                            filterFound = true
                        }

                        if (filterFound) {
                            filter.value = settings.name
                        }
                    })

                    //if current filter was not found than add it to the array
                    if (!filterFound)
                        filterGroup.push({ filter: settings.filter, value: settings.name })

                    methods.breadcrums()

                    siblings_active_el = $(this).parent().siblings().find('a.' + settings.filter + '.active')

                    if (siblings_active_el)
                        siblings_active_el.removeClass('active')

                    $(this).addClass('active')

                    var url = window.location.href;
                    urls = url.split('?')
                    isElementChange = false

                    // if (urls[1]) {
                    //     params = urls[1].split('&')
                    //     //replace if already 
                    //     newParams = params.map(element => {
                    //         args = element.split('=')
                    //         args.forEach(el => {
                    //             if (settings.TYPES[settings.filter] == args[0]) {
                    //                 //handles the replace
                    //                 element = settings.TYPES[setting.filter] + '=' + settings.name
                    //                 isElementChange = true
                    //             }
                    //         })
                    //         return element
                    //     });

                    //     //handles add
                    //     if (!isElementChange) {
                    //         newParams.push(TYPES[0][filterType] + '=' + filterData)
                    //     }
                    //     console.log(newParams.toString().replace(/(,)/g, '&'))
                    //     newUrl = urls[0] + '?' + newParams.toString().replace(/(,)/g, '&')
                    //     console.log(newUrl)
                    //     window.location.href = newUrl
                    // }

                    ajaxURL = '/filter_search/'

                    container = $('.item_result_holder')
                    container.html("Loading data")
                    datax = JSON.stringify(filterGroup)
                    console.log('date from server', settings.itemList)
                    $.ajax({
                        type: "POST",
                        url: ajaxURL,
                        dataType: "json",
                        async: true,
                        headers: { 'X-CSRFToken': settings.csrf },
                        data: {'filterGroup': JSON.stringify(filterGroup)},
                        success: (json) => {
                            console.log('Json: ', settings.filterCount)
                            if (json) {
                                container.html(json.template)
                                settings.filterCount = $('#fbc_count')
                                settings.filterCount.html(json.resultCount)
                                settings.itemList.push(json.itemList)
                            }
                            else
                                container.html('no result found')
                        },
                        error: (res) => {
                            console.log('res: ', res)
                            container.html(res.responseText)
                        }
                    })
                })

            },
            breadcrums: () => {
                //html elements with the crums data attribute passed as an Object
                fbc_core = $('[data-crumbs]').data('crumbs')

                //container for which the breadcrums will be seen
                fbc_container = $('.filter_breadcrumbs')
                count = 20
                crumbs = ''

                /** 
                 * Dynamic path of crums as the user select the filters we will place it on the 
                 * screen for them to see the order of the filter. 
                 * each filter is place as a link in order for the user to remove the filter with a click
                 **/
                filterGroup.forEach(filter => {
                    crumbs += ': <span class="trails">' + filter.value + '</span> '
                })
                // console.log(filterGroup)
                // constructing the breadcrums
                fbc_container.html(
                    '<span id="fbc_count">0</span> results return for ' +
                    fbc_core.category.capitalized() + ': ' +
                    '<a href="#">' + fbc_core.sub.capitalized() + '</a> ' +
                    crumbs
                )
                // console.log(fbc_container)
                if (fbc_container.hasClass('hide')) {
                    fbc_container.removeClass('hide')
                }

            }
        }


    $.fn.flink = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error(method);
        }
    }



})(jQuery);

String.prototype.capitalized = function () {
    return this.replace(/\b\w/g, l => l.toUpperCase())
}
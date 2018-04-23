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
        itemList: []
    },
        filterGroup = [],
        products = [],
        methods = {
            init: function (options) {
                $this = $(this)

                /**
                 * The concept of this plugin filter is to pull all the items for the current category
                 * in order to provide filter on the items on the page.
                 */
                if (options.subCategory) {
                    methods.getPageItems(options)
                }



                $(document).on('click', $this.selector, function (e) {
                    e.preventDefault();

                    // console.log('Inside the onclick', products)

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
                    
                        var query;
                    filterGroup.forEach(group => {
                        if (group.filter == 'prices') {
                            prices = group.value.split(' - ')
                            console.log('Prices: ', prices)
                            group.value = {lower:'>='+prices[0].replace(',',''), upper:'<='+prices[1].replace(',','')}
                            
                        }
                    })
                    /**
                     * filter the list based on what the user have selected afterwhich acitivate the screen to show the 
                     * new information and controls
                     */
                    criteria = {
                        price: {status: false, lower: 10000, upper: 25000},
                        discount: {status: true, term: "30% - 45%"},
                        type: {status: false, term: ''},
                        brand: {status: false, term: ''} 
                    }
                    
                    
                    filterProducts = products.filter(function (el) {

                            // if(group.filter=='prices'){
                            //     query = el.originalPrice + group.value.lower + "&&" + el.originalPrice + group.value.upper
                            // }
                            if(criteria.price.status){
                                return el.originalPrice >= criteria.price.lower  && el.originalPrice <= criteria.price.upper
                            }

                            if(criteria.discount.status){
                                return el.discountRange == criteria.discount.term
                            }
                        
                        console.log("Final query: ",query)
                        return query
                    })

                    methods.breadcrums()

                    siblings_active_el = $(this).parent().siblings().find('a.' + settings.filter + '.active')

                    if (siblings_active_el)
                        siblings_active_el.removeClass('active')

                    $(this).addClass('active')
                    container = $('.item_result_holder')
                    container.html("Loading data")

                    $('.banner-top').css({
                        height: '30px'
                    })
                    $('.banner-info').hide()



                    if (filterProducts) {
                        container.html("")
                        filterProducts.forEach((item) => {
                            container.append(methods.itemHolder(item))

                        })
                    }
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

            },
            getPageItems: function (options) {
                console.log("Options: ", options)

                $.ajax({
                    type: "POST",
                    url: '/filter_search/',
                    dataType: "json",
                    async: true,
                    headers: { 'X-CSRFToken': options.csrf },
                    data: { 'category': options.subCategory },
                    success: (json) => {
                        console.log('Json: ', json)
                        if (json.data) {
                            products = json.data
                        }
                    },
                    error: (res) => {
                        console.log('res: ', res)

                    }
                })
            },
            itemHolder: function (args) {
                return '<div class="col-md-4 item-grid1 simpleCart_shelfItem">' +
                    '<div class=" mid-pop" >' +
                    '<div class="pro-img">' +
                    '<img src=' + args.imageFilename.url('/static/images/') + ' class="img-responsive" alt="' + args.name + '">' +
                    '<div class="zoom-icon ">' +
                    '<a class="picture" href="' + args.imageFilename.url('/static/images/') + '" rel="title" class="b-link-stripe b-animate-go  thickbox">' +
                    '<i class="glyphicon glyphicon-search icon "></i>' +
                    '</a>' +
                    '<a href="' + args.name + '"><i class="glyphicon glyphicon-menu-right icon"></i></a>' +
                    '</div>' +
                    '</div>' +
                    '<div class="mid-1">' +
                    '<div class="women">' +
                    '<div class="women-top">' +
                    '<span>' + args.itemCategory + '</span>' +
                    '<h6><a href="' + args.name + '">' + args.name + '</a></h6>' +
                    '</div>' +
                    '<div class="img item_add">' +
                    '<a href="#"><img src="/static/images/ca.png" alt=""></a>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '</div>' +
                    '<div class="mid-2">' +
                    '<p>' + args.promoItem.discountDisplay({ original: args.originalPrice, discount: args.discountPrice }) + '</p>' +
                    '<br>' +
                    '<div class="block">' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            },

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

String.prototype.url = function (path) {
    return path + this.replace(/\"/g, '').trim()
}

Boolean.prototype.discountDisplay = function (args) {
    console.log(this.toString() == 'true')
    if (this.toString() == 'true') {
        return '<label>' + args.original.formatMoney(2) + '</label>' +
            '<em class="item_price">' + args.discount.formatMoney(2) + '</em>'
    } else if (this.toString() == 'false') {
        return '<em class="item_price">' + args.original.formatMoney(2) + '</em>'
    }
}
Number.prototype.formatMoney = function (c, d, t, currency) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        cy = currency == undefined ? " JMD" : " USD",
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return '$' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "") + cy;
}
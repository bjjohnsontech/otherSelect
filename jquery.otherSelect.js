(function ( $ ) {
    $.fn.otherSelect = function(options) {
        var defaults = {
            otherOption : "Add Option",
            background : '',
            addTitle : 'Add Option',
            cancelTitle : 'Cancel',
            optionMinLength : 1,
            optionValidation : function(value, minLength) {
                if (value.length < minLength) {
                    alert('Option value must be larger than ' + (minLength - 1) + ' char(s)');
                    return false;
                } else {
                    return true;
                }
            },
            widget : false,
            multiselectOptions : null
        };
        var settings = $.extend( {}, defaults, options );
        return this.each(function() {
            var $el = $(this);
            settings.widget = settings.widget === false? false : $el.multiselect(settings.multiselectOptions);
            settings.width = settings.width || settings.widget? $el.multiselect('getButton').width() -40 : $el.width();
            settings.height = settings.height || settings.widget? $el.multiselect('getButton').height() : $el.height();
            console.log(settings.height);
            settings.multiple = settings.multiple || $el.prop('multiple');
            selOpt = $('<option/>');
            selOpt.prop('value', settings.otherOption);
            selOpt.html(settings.otherOption);
            $el.append(selOpt);
            $el.on('change', function() {
                if(settings.input) {
                    settings.input.focus();
                    return;
                }
                elVal = $el.val();
                if (elVal == settings.otherOption
                ||  (typeof elVal === 'object' && elVal.indexOf(settings.otherOption) !== -1)) {
                    $add = $('<span class="ui-icon ui-icon-plusthick"/>')
                        .css('display', 'table-cell')
                        .prop('title', settings.addTitle)
                        .on('click', function() {
                            value = $(this).siblings(':first').val();
                            if (settings.optionValidation(value, settings.optionMinLength)) {
                                $('<option value="'+value+'">')
                                    .html(value)
                                    .insertBefore($el.children(':last'));
                                if (settings.multiple) {
                                    elVal.pop();
                                    elVal.push(value)
                                    $el.val(elVal);
                                } else {
                                    $el.val(value);
                                }
                                $(this).parent().remove();
                                if (settings.widget) {
                                    $el.multiselect('refresh')
                                    .multiselect('getButton').show()
                                } else {
                                    $el.show();
                                }
                                settings.input = false;
                            }
                        });
                    $cancel = $('<span class="ui-icon ui-icon-closethick"/>')
                        .css('display', 'table-cell')
                        .prop('title', settings.cancelTitle)
                        .on('click', function() {
                            $(this).parent().remove();
                            if (settings.multiple) {
                                elVal.pop();
                                elVal.push(value)
                                $el.val(elVal);
                            } else {
                                $el.val($el.children(':first').val());
                            }
                            if (settings.widget) {
                                $el.multiselect('refresh')
                                .multiselect('getButton').show()
                            } else {
                                $el.show();
                            }
                            settings.input = false;
                        });
                    settings.input = $('<input/>')
                        .css('width', settings.width)
                        .css('height', settings.height)
                        .css('float', 'left')
                        .on('keypress', function(event) {
                            if(event.key === 'Enter') {
                                $add.click();
                            } else if (event.key === 'Esc') {
                                $cancel.click();
                            }
                        });
                    $div = $('<div/>')
                        .css('background', settings.background)
                        .css('width', settings.width + 40)
                        .css('height', settings.height)
                        .append(settings.input)
                        .append($add)
                        .append($cancel);
                    $el.parent().append($div);
                    settings.input.focus();
                    if (settings.widget) {
                        $el.multiselect('getButton').hide();
                    } else {
                        $el.hide();
                    }
                }
            });
            if (settings.widget) {
                $el.multiselect('refresh');
            }
        });
        
        
    };
}( jQuery ));
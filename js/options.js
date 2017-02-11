/*!
 * RadialChartImageGenerator
 * Copyright 2015 Hitesh Maidasani
 * Licensed under MIT (https://github.com/hmaidasani/RadialChartImageGenerator/blob/master/LICENSE)
 */

$(function($) {
    var chartcolList = $('.charts-row .col-md-4');
    var arcId,max,val,steps,bgcolor,fgcolorstart,fgcolormid,fgcolorend,textcolor,thickness,bgthickness,width,ypos,xpos,lineStyle,countDirection,shadow,shadowColor,data;
    var arcInputs,optionsDiv,titleArr,title;
    for(var i = 0; i < chartcolList.length; i++) {
        arcInputs = $(chartcolList[i]).find('input.knob');
        optionsDiv = $(chartcolList[i]).find('.chart-options');

        for(var j=0; j<arcInputs.length; j++) {
            arcId = $(arcInputs[j]).attr('id');
            max = parseInt($(arcInputs[j]).attr('data-max'));
            val = parseInt($(arcInputs[j]).attr('value'));
            steps = parseInt($(arcInputs[j]).attr('data-steps'));
            bgcolor = $(arcInputs[j]).attr('data-bgcolor');
            fgcolorstart = $(arcInputs[j]).attr('data-fgcolor');
            fgcolormid = $(arcInputs[j]).attr('data-fgcolormid');
            fgcolorend = $(arcInputs[j]).attr('data-fgcolorend');
            textcolor = $(arcInputs[j]).attr('data-inputColor');
            thickness = Number($(arcInputs[j]).attr('data-thickness'));
            bgthickness = Number($(arcInputs[j]).attr('data-bgthickness'));
            width = Number($(arcInputs[j]).attr('data-width'));
            ypos = Number(parseInt($(arcInputs[j]).closest('.canvas-box').css('top')));
            xpos = Number(parseInt($(arcInputs[j]).closest('.canvas-box').css('left')));
            lineStyle = $(arcInputs[j]).attr('data-linecap');
            countDirection = $(arcInputs[j]).attr('data-direction');
            shadow = $(arcInputs[j]).attr('data-shadow');
            shadowColor = $(arcInputs[j]).attr('data-shadowColor');

            data = {
                "Current Value" : val,
                "Max Value" : max,
                "Steps" : steps,
                "Foreground Color Start" : fgcolorstart,
                "Foreground Color Mid" : fgcolormid,
                "Foreground Color End" : fgcolorend,
                "Background Color" : bgcolor,
                "Arc Thickness" : thickness,
                "Background Thickness" : bgthickness,
                "Size": width,
                "Y Position": ypos,
                "X Position": xpos
            };
            titleArr = arcId.split('-');
            title = titleArr[1].charAt(0).toUpperCase() + titleArr[1].slice(1) + " " + titleArr[2].charAt(0).toUpperCase() + titleArr[2].slice(1);
            var divoptions = $('<div/>', {class:'options'}).append($('<h4/>', {text:title})).appendTo(optionsDiv);
            if (arcId === 'single-single-arc') {
                // count direction start
                $('<div/>', {class: 'option-row form-group direction-toggle'}).appendTo(divoptions)
                    .append($('<label/>', {
                        class: 'control-label',
                        text: "Count direction:",
                        for: "direction-checkbox-" + arcId
                    }))
                    .append($('<input/>', {
                        type: "checkbox",
                        name: "direction-checkbox",
                        id: "direction-checkbox-" + arcId,
                        'data-on-text': "Up",
                        'data-off-text': "Down",
                        'arc-id': '#' + arcId
                    }).attr('data', 'direction'));
                var directionCheckbox = $("#direction-checkbox-" + arcId);
                directionCheckbox.bootstrapSwitch('state', true, true);
                directionCheckbox.on('switchChange.bootstrapSwitch', function (event, state) {
                    var arc = $(this).attr('arc-id');
                    var val;
                    if (state) {
                        val = 'up';
                    } else {
                        val = 'down';
                    }
                    changeArc(arc, 'data-direction', val);
                });
                // count direction end
            }
            for(var option in data) {
                if (data.hasOwnProperty(option) && (option === 'Steps' && arcId === 'single-single-arc') || (option !== 'Steps')) {
                    divoptionrow = $('<div/>', {class: 'option-row ' + option.replace(/ /g, '-').toLowerCase()}).appendTo(divoptions).append($('<div/>', {
                        class: 'text',
                        text: option + ':'
                    }));
                    divinputarea = $('<div/>', {class: 'input-area'}).appendTo(divoptionrow);
                    divinputgroup = $('<div/>', {class: 'input-group'}).appendTo(divinputarea);
                    var inputbox = $('<input/>', {
                        class: 'form-control input-number',
                        'type': 'text',
                        'name': titleArr[0].toLowerCase() + titleArr[1].toLowerCase() + '_' + option.split(' ').join('-').toLowerCase(),
                        'default-val': data[option],
                        'value': data[option],
                        'arc-id': "#" + arcId,
                        'data-mod': option.split(' ').join('-').toLowerCase()
                    });
                    if (typeof data[option] === "number") {
                        var datastep = 1;
                        if (data[option] % 1 !== 0) {
                            datastep = 0.01;
                        }
                        // minus button
                        var spaninputbtnminus = $('<span/>', {class: 'input-group-btn'}).appendTo(divinputgroup);
                        $('<button/>', {
                            class: 'btn btn-default btn-number',
                            'type': 'button',
                            'data-type': 'minus',
                            'data-step': datastep,
                            'data-field': titleArr[0].toLowerCase() + titleArr[1].toLowerCase() + '_' + option.split(' ').join('-').toLowerCase()
                        }).appendTo(spaninputbtnminus).append($('<span/>', {class: 'glyphicon glyphicon-minus'}));
                        // add input
                        if (option === 'Steps') {
                            $(inputbox).addClass('only-number steps-input').attr({
                                'min': '1',
                                'max': '100'
                            }).appendTo(divinputgroup);
                        } else {
                            $(inputbox).addClass('only-number').attr({
                                'min': '-1000',
                                'max': '1000'
                            }).appendTo(divinputgroup);
                        }
                        // plus button
                        var spaninputbtnplus = $('<span/>', {class: 'input-group-btn'}).appendTo(divinputgroup);
                        $('<button/>', {
                            class: 'btn btn-default btn-number',
                            'type': 'button',
                            'data-type': 'plus',
                            'data-step': datastep,
                            'data-field': titleArr[0].toLowerCase() + titleArr[1].toLowerCase() + '_' + option.split(' ').join('-').toLowerCase()
                        }).appendTo(spaninputbtnplus).append($('<span/>', {class: 'glyphicon glyphicon-plus'}));

                    } else {
                        $(inputbox).addClass('color {hash:true,caps:false}');
                        // add input
                        $(divinputgroup).append(inputbox);
                    }
                    spaninputbtnrefresh = $('<span/>', {class: 'input-group-btn'}).appendTo(divinputgroup);
                    $('<button/>', {
                        class: 'btn btn-refresh',
                        'type': 'button',
                        'data-type': 'refresh',
                        'data-field': titleArr[0].toLowerCase() + titleArr[1].toLowerCase() + '_' + option.split(' ').join('-').toLowerCase()
                    }).appendTo(spaninputbtnrefresh).append($('<span/>', {class: 'glyphicon glyphicon-refresh'}));
                }
            }
            // linecap start
            $('<div/>', {class:'option-row form-group linecap-toggle'}).appendTo(divoptions)
                .append($('<label/>', {class:'control-label', text:"Line Style:", for:"linecap-checkbox-"+arcId}))
                .append($('<input/>', {type:"checkbox", name:"linecap-checkbox", id:"linecap-checkbox-"+arcId, 'data-on-text':"Round", 'data-off-text':"Flat", 'arc-id':'#'+arcId}).attr('data','linecap'));
            var linecapCheckbox = $("#linecap-checkbox-"+arcId);
            linecapCheckbox.bootstrapSwitch('state', true, true);
            linecapCheckbox.on('switchChange.bootstrapSwitch', function(event, state) {
                var arc = $(this).attr('arc-id');
                var val;
                if(state) {
                    val = 'round';
                } else {
                    val = 'default';
                }
                changeArc(arc, 'data-linecap', val);
            });
            // linecap end

            // shadow option start
            divoptionrow = $('<div/>', {class:'option-row shadow-toggle'}).appendTo(divoptions);
            $('<label/>', {class:'checkbox-inline', text:'Shadow:'}).appendTo(divoptionrow)
                .append($('<input/>', {
                    class:'shadow-checkbox',
                    'type':'checkbox',
                    'value':'',
                    'arc-id':'#'+arcId,
                    'checked':''
                }).attr('data','shadow'));

            $('<div/>', {class:'text', text:'Color:'}).appendTo(divoptionrow);

            divinputarea = $('<div/>', {class:'input-area'}).appendTo(divoptionrow);
            divinputgroup = $('<div/>', {class:'input-group'}).appendTo(divinputarea);
            $('<input/>', {
                class:'form-control input-number color {hash:true,caps:false}',
                'type':'text',
                'name':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'shadow-color',
                'default-val':shadowColor,
                'value':shadowColor,
                'arc-id':'#'+arcId,
                'data-mod':'shadow-color'
            }).appendTo(divinputgroup);

            spaninputbtnrefresh = $('<span/>', {class:'input-group-btn'}).appendTo(divinputgroup);
            $('<button/>', {
                class:'btn btn-refresh',
                'type':'button',
                'data-type':'refresh',
                'data-field':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'shadow-color'
            }).appendTo(spaninputbtnrefresh).append($('<span/>', {class:'glyphicon glyphicon-refresh'}));
            // shadow option end

            if(arcInputs.length === 1) {
                divoptionrow = $('<div/>', {class:'option-row text-color'}).appendTo(divoptions);
                $('<label/>', {class:'checkbox-inline', text:'Show Text:'}).appendTo(divoptionrow)
                    .append($('<input/>', {
                        class:'text-checkbox',
                        'type':'checkbox',
                        'value':'',
                        'arc-id':'#'+arcId,
                        'checked':''
                    }).attr('data','all-text'));
                $('<div/>', {class:'text', text:'Color:'}).appendTo(divoptionrow);

                divinputarea = $('<div/>', {class:'input-area'}).appendTo(divoptionrow);
                divinputgroup = $('<div/>', {class:'input-group'}).appendTo(divinputarea);
                $('<input/>', {
                    class:'form-control input-number color {hash:true,caps:false}',
                    'type':'text',
                    'name':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'text-color',
                    'default-val':textcolor,
                    'value':textcolor,
                    'arc-id':'#'+arcId,
                    'data-mod':'text-color'
                }).appendTo(divinputgroup);

                spaninputbtnrefresh = $('<span/>', {class:'input-group-btn'}).appendTo(divinputgroup);
                $('<button/>', {
                    class:'btn btn-refresh',
                    'type':'button',
                    'data-type':'refresh',
                    'data-field':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'text-color'
                }).appendTo(spaninputbtnrefresh).append($('<span/>', {class:'glyphicon glyphicon-refresh'}));

                var divoptionrow = $('<div/>', {class:'option-row sub-text'}).appendTo(divoptions);
                $('<label/>', {class:'checkbox-inline', text:'Subtext:'}).appendTo(divoptionrow)
                    .append($('<input/>', {
                        class:'text-checkbox',
                        'type':'checkbox',
                        'value':'',
                        'arc-id':'#'+arcId,
                        'checked':''
                    }).attr('data','only-subtext'));
                $('<div/>', {class:'text', text:'Units:'}).appendTo(divoptionrow);

                var divinputarea = $('<div/>', {class:'input-area'}).appendTo(divoptionrow);
                var divinputgroup = $('<div/>', {class:'input-group'}).appendTo(divinputarea);
                var subtextUnits = $('.subtext-units');
                $('<input/>', {
                    class:'form-control input-number single-input',
                    'type':'text',
                    'name':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'subtext-units',
                    'default-val':subtextUnits.text(),
                    'value':subtextUnits.text(),
                    'arc-id':'#'+arcId,
                    'data-mod':'units'
                }).appendTo(divinputgroup);

                var spaninputbtnrefresh = $('<span/>', {class:'input-group-btn'}).appendTo(divinputgroup);
                $('<button/>', {
                    class:'btn btn-refresh',
                    'type':'button',
                    'data-type':'refresh',
                    'data-field':titleArr[0].toLowerCase()+titleArr[1].toLowerCase()+'_'+'subtext-units'
                }).appendTo(spaninputbtnrefresh).append($('<span/>', {class:'glyphicon glyphicon-refresh'}));

            }
        }
    }
    $('.options').each(function(){
        $(this).find('[class*=foreground]').wrapAll("<div class='foreground-colors' />");
    });
});
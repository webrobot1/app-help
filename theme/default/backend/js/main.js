$(function() 
{	
	$('body').on('click', '#save_help',function(e) {
		e.preventDefault();
		var form = $(this).closest('form');
		$.ajax({
			url:     form.attr('action'), //url страницы (action_ajax_form.php)
			type:    form.attr('method'), //метод отправки
			data: 	 form.serialize(),  // Сеарилизуем объект
			success: function(response) { //Данные отправлены успешно
				alert('Сохранено');
			},
			error: function(response) { // Данные не отправлены
				alert(response);
			}
		});
	});
	
	if($('#faq_tree').length){
		$('#faq_tree').tree({
			data: $.parseJSON($('#faq_tree').attr('data'))
		});
	 
		$('#faq_tree').bind(
			'tree.select',
			function(event) {
				if(event.node.id){
					$('#load').html('<span class="glyphicon-refresh-animate glyphicon glyphicon-refresh"></span>').load('?id='+event.node.id);
				}
			}
		); 
	}
	 
	 
	var interceptenter = function()
    {
        return false;
    }
	
	var suggester = function( term, response )
    {
        // Suggestions start with '@'
        if( term[0] != '@' )
            return false;
        // You may want to ask the server ...
        var fill_suggestion = function()
            {
                var suggestions = [];
                var usernames = ['Evelyn','Harry','Amelia','Oliver','Isabelle','Eddie','Editha','Jacob','Emily','George','Edison'];
                usernames.forEach( function( username, index )
                {
                    var re = new RegExp( '^(' + term.substring(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(.*)$', 'i' );
                    if( term == '@' || re.test(username) )
                    {
                        var codepoint = 0xF600 + index;
                        var fakeavatar = String.fromCharCode( ((codepoint >>>10) & 0x3FF) | 0xD800 ) +
                                         String.fromCharCode( 0xDC00 | (codepoint & 0x3FF) );
                        suggestions.push({
                            label: fakeavatar + ' ' + (term != '@' ? username.replace(re,'$1<b>$2</b>') : username),
                            insert: '<a href="/' + username + '">@' + username + '</a>&nbsp;'
                        });
                    }
                });
                response( suggestions.length ? suggestions : null );  // null = close suggestions
            };
        // simulate: immediate, fast and slow internet
        if( Math.random() < 0.5 )
            fill_suggestion();
        else
            setTimeout( fill_suggestion, Math.random() > 0.9 ? 5000 : 100 );
        return true;
    }
	
	$('.wysiwyg textarea').wysiwyg({
        toolbar: 'top',
        buttons: {
			insertvideo: {
				title: 'Insert video',
				image: '\uf03d', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: true    // wanted on selection
			},
			insertlink: {
				title: 'Insert link',
				image: '\uf08e' // <img src="path/to/image.png" width="16" height="16" alt="" />
			},
			// Fontname plugin
			fontname:{
				title: 'Font',
				image: '\uf031', // <img src="path/to/image.png" width="16" height="16" alt="" />
				popup: function( $popup, $button ) {
						var list_fontnames = {
								// Name : Font
								'Arial, Helvetica' : 'Arial,Helvetica',
								'Verdana'          : 'Verdana,Geneva',
								'Georgia'          : 'Georgia',
								'Courier New'      : 'Courier New,Courier',
								'Times New Roman'  : 'Times New Roman,Times'
							};
						var $list = $('<div/>').addClass('wysiwyg-plugin-list')
											   .attr('unselectable','on');
						$.each( list_fontnames, function( name, font ) {
							var $link = $('<a/>').attr('href','#')
												.css( 'font-family', font )
												.html( name )
												.click(function(event) {
													$(this).closest('.wysiwyg-popup').prev().find('textarea').wysiwyg('shell').fontName(font).closePopup();
													// prevent link-href-#
													event.stopPropagation();
													event.preventDefault();
													return false;
												});
							$list.append( $link );
						});
						$popup.append( $list );
					   },
				//showstatic: true,    // wanted on the toolbar
				showselection:true    // wanted on selection
			},
			// Fontsize plugin
			fontsize:{
				title: 'Size',
				image: '\uf034', // <img src="path/to/image.png" width="16" height="16" alt="" />
				popup: function( $popup, $button ) {
						// Hack: http://stackoverflow.com/questions/5868295/document-execcommand-fontsize-in-pixels/5870603#5870603
						var list_fontsizes = [];
						for( var i=8; i <= 11; ++i )
							list_fontsizes.push(i+'px');
						for( var i=12; i <= 28; i+=2 )
							list_fontsizes.push(i+'px');
						list_fontsizes.push('36px');
						list_fontsizes.push('48px');
						list_fontsizes.push('72px');
						var $list = $('<div/>').addClass('wysiwyg-plugin-list')
											   .attr('unselectable','on');
						$.each( list_fontsizes, function( index, size ) {
							var $link = $('<a/>').attr('href','#')
												.html( size )
												.click(function(event) {
													$(this).closest('.wysiwyg-popup').prev().find('textarea').wysiwyg('shell').fontSize(7).closePopup();
													$(this).closest('.wysiwyg-popup').prev().find('textarea').wysiwyg('container')
															.find('font[size=7]')
															.removeAttr("size")
															.css("font-size", size);
													// prevent link-href-#
													event.stopPropagation();
													event.preventDefault();
													return false;
												});
							$list.append( $link );
						});
						$popup.append( $list );
					   }
				//showstatic: true,    // wanted on the toolbar
				//showselection: true    // wanted on selection
			},
			// Header plugin
			header:{
				title: 'Header',
				image: '\uf1dc', // <img src="path/to/image.png" width="16" height="16" alt="" />
				popup: function( $popup, $button ) {
						var list_headers = {
								// Name : Font
								'Header 1' : '<h1>',
								'Header 2' : '<h2>',
								'Header 3' : '<h3>',
								'Header 4' : '<h4>',
								'Header 5' : '<h5>',
								'Header 6' : '<h6>',
								'Code'     : '<pre>'
							};
						var $list = $('<div/>').addClass('wysiwyg-plugin-list')
											   .attr('unselectable','on');
						$.each( list_headers, function( name, format ) {
							var $link = $('<a/>').attr('href','#')
												 .css( 'font-family', format )
												 .html( name )
												 .click(function(event) {
													$(this).closest('.wysiwyg-popup').prev().find('textarea').wysiwyg('shell').format(format).closePopup();
													// prevent link-href-#
													event.stopPropagation();
													event.preventDefault();
													return false;
												});
							$list.append( $link );
						});
						$popup.append( $list );
					   }
				//showstatic: true,    // wanted on the toolbar
				//showselection: false    // wanted on selection
			},
			bold: {
				title: 'Bold (Ctrl+B)',
				image: '\uf032', // <img src="path/to/image.png" width="16" height="16" alt="" />
				hotkey: 'b'
			},
			italic: {
				title: 'Italic (Ctrl+I)',
				image: '\uf033', // <img src="path/to/image.png" width="16" height="16" alt="" />
				hotkey: 'i'
			},
			underline: {
				title: 'Underline (Ctrl+U)',
				image: '\uf0cd', // <img src="path/to/image.png" width="16" height="16" alt="" />
				hotkey: 'u'
			},
			strikethrough: {
				title: 'Strikethrough (Ctrl+S)',
				image: '\uf0cc', // <img src="path/to/image.png" width="16" height="16" alt="" />
				hotkey: 's'
			},
			forecolor: {
				title: 'Text color',
				image: '\uf1fc' // <img src="path/to/image.png" width="16" height="16" alt="" />
			},
			highlight: {
				title: 'Background color',
				image: '\uf043' // <img src="path/to/image.png" width="16" height="16" alt="" />
			},
			alignleft: {
				title: 'Left',
				image: '\uf036', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: false    // wanted on selection
			},
			aligncenter: {
				title: 'Center',
				image: '\uf037', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: false    // wanted on selection
			},
			alignright: {
				title: 'Right',
				image: '\uf038', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: false    // wanted on selection
			},
			alignjustify: {
				title: 'Justify',
				image: '\uf039', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: false    // wanted on selection
			},
			subscript:{
				title: 'Subscript',
				image: '\uf12c', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: true    // wanted on selection
			},
			superscript:{
				title: 'Superscript',
				image: '\uf12b', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: true    // wanted on selection
			},
			indent: {
				title: 'Indent',
				image: '\uf03c', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: false    // wanted on selection
			},
			outdent: {
				title: 'Outdent',
				image: '\uf03b', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: false    // wanted on selection
			},
			orderedList: {
				title: 'Ordered list',
				image: '\uf0cb', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: false    // wanted on selection
			},
			unorderedList: {
				title: 'Unordered list',
				image: '\uf0ca', // <img src="path/to/image.png" width="16" height="16" alt="" />
				//showstatic: true,    // wanted on the toolbar
				showselection: false    // wanted on selection
			},
			removeformat: {
				title: 'Remove format',
				image: '\uf12d' // <img src="path/to/image.png" width="16" height="16" alt="" />
			}
		},
		videoFromUrl: function( url ) {
			// Contributions are welcome :-)

			// youtube - http://stackoverflow.com/questions/3392993/php-regex-to-get-youtube-video-id
			var youtube_match = url.match( /^(?:http(?:s)?:\/\/)?(?:[a-z0-9.]+\.)?(?:youtu\.be|youtube\.com)\/([A-z_0-9]+)/ );
			console.log(youtube_match);
			if( youtube_match && youtube_match[1].length == 11 )
				return '<iframe src="//www.youtube.com/embed/' + youtube_match[1] + '" width="640" height="360" frameborder="0" allowfullscreen></iframe>';
		},
		suggester: suggester,
        interceptenter: interceptenter,
        //selectionbuttons: buttons.slice(1,2).concat( buttons.slice(3,14) ),
        //hijackmenu: true
    });
});
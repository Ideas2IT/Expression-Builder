/**
 * Show the tables as tree format at side menu in window,
 * here we can Collapse and Expend the tables under "Table" title bar
 * @author mahesh
 */
$(function() {
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr(
        'title', 'Collapse this branch');
    $('.tree li.parent_li > span').on(
        'click',
        function(e) {
            var children = $(this).parent('li.parent_li').find(' > div > ul > li');
            if (children.is(":visible")) {
                children.hide('fast');
                $(this).attr('title', 'Expand this branch').find(
                        ' > i').addClass('fa-plus-square')
                    .removeClass('fa-minus-square');
            } else {
                children.show('fast');
                $(this).attr('title', 'Collapse this branch').find(
                        ' > i').addClass('fa-minus-square')
                    .removeClass('fa-plus-square');
            }
            e.stopPropagation();
        });
});

fetchAllTablesAjax(loadTablesInTree);
enableDeleteTable();
enableTableSearch();
showExpressionBuilder();

function showExpressionBuilder(){
	loadExpressionBuilder();
	$(".expression-builder-icon").click(function(){
		if($(".expression-container").is(":visible")){			
			$(".expression-container").hide('slide', {
				direction : "right" 
	        }, 500);			
			$(".table-list li").draggable('enable');
			$("#reset").removeClass("reset rotate").addClass("disabled-link");
		}else{		
			$(".expression-container").show('slide', {
				direction : "right" 
	        }, 500);
			$(".table-list li").draggable('disable');
			$("#reset").removeClass("reset disabled-link").addClass("reset rotate");
		}
	});
	
	// Enable slim scroll bar for table	
    enableSlimScroll($(".query-builder"), {
        height : "410px"
    });
    
    $("[data-toggle='tooltip']").tooltip({
    	placement : "top"
    });
}

/**
 * Load all tables in tree, this method call using callback of "fetchAllTablesAjax(loadTablesInTree);"
 * @param tables
 */
function loadTablesInTree(tables) {
    $("ul.table-list").html("");
    $.each(tables, function(index, table) {
		  $("<li>", {
	          'id'    : table.name,
	          'class' : "tree-table",
	          'html'  : "<span><i class='fa fa-table'></i> " + (table.name).toUpperCase() + "</span>"
	      }).appendTo('ul.table-list');
    }); 
    
    $("ul.table-list").find("li").slideDown("fade");

    // Enable slim scroll bar for table	
    enableSlimScroll($("ul.table-list"), {
        height : "382px"
    });

    // Enable drag and drop events
    enableDNDEvents();
}

function enableTableSearch(){
	var isFiltered = false;
	 // Enable search key events
    $("input.search-tbl-query").keyup(function() {
        var tableNameStr = $("input.search-tbl-query").val();
        if(tableNameStr.length > 2){
        	isFiltered = true;
        	fetchTablesByTableNameAjax(tableNameStr.toLowerCase(), loadTablesInTree);
        } else if(isFiltered) {
        	isFiltered = false;
        	fetchTablesByTableNameAjax("", loadTablesInTree);
        }
    });
}

/**
 * Load all columns by given table name,
 * this method call using callback of "fetchTableColumnByTableNameAjax(tableName, columnId, loadTableColumns);"
 * @param tables
 */
function loadTableColumns(columns, columnId) {	
    $.each(columns, function(index, column) {
        $("ul#" + columnId).append(
            $("<li>", {
                'id'    : column.id,
                'name'  : column.field,
                'class' : "column-list",
                'html'  : "<span><i class='fa fa-columns'></i> " + column.field + "</span>"
            })
        );
    });
    
    enableJoinRules($("ul#" + columnId));   

    // Toggle event to select and unselect the table column
    $("ul#" + columnId).find("li").click(function() {
        $(this).toggleClass("column-highlight");
    });

    // Enable slim scroll bar for table	
    enableSlimScroll($("ul#" + columnId), {
        height: '185px'
    });    
}

var prevConnectionId = "";

function enableJoinRules(columnListObj){
	columnListObj.find("li").click(function(){
	    var connectionId = $(this).attr("id");
		if(prevConnectionId && prevConnectionId != connectionId){
			var originId = $("#"+prevConnectionId).closest(".table-column-list-container").attr("id");
			var targetId = $("#"+connectionId).closest(".table-column-list-container").attr("id");
			$(".table-column-list-container").connections({
				'from'  : '#'+prevConnectionId, 
				'to'    : '#'+connectionId,  
				'class' : 'fast'
			});
			$.repeat().add('connection').each($).connections('update').wait(0);
			prevConnectionId = "", connectionId = "";
			endLinkMode();
		}else{
			prevConnectionId = connectionId;
			var linkLine = $('<div id="new-link-line"></div>').appendTo('body');
	  	    linkLine
	  	        .css('top', $('#'+connectionId).offset().top + $('#'+connectionId).height() / 2)
	  	        .css('left', $('#'+connectionId).offset().left);
		    // Cancel on right click
		    $(document).bind('mousedown.link', function(event) {
		        if(event.which == 3) {
		            endLinkMode();
		        }
		    });
		    $(document).bind('keydown.link', function(event) {
		        // ESCAPE key pressed
		        if(event.keyCode == 27) {
		            endLinkMode();
		        }
		    });
			$(document).mousemove(function(event){
		  		linkMouseMoveEvent(event, connectionId)
		  	});
		}
	  });
}



function linkMouseMoveEvent(event, currentColumnId) {
    if($('#new-link-line').length > 0) {
        var originX = $('#'+currentColumnId).offset().left;
        var originY = $('#'+currentColumnId).offset().top + $('#'+currentColumnId).height() / 2;
        
        var length = Math.sqrt((event.pageX - originX) * (event.pageX - originX) 
            + (event.pageY - originY) * (event.pageY - originY));
    
        var angle = 180 / 3.1415 * Math.acos((event.pageY - originY) / length);
        if(event.pageX > originX)
            angle *= -1;
    
        $('#new-link-line')
            .css('height', length)
            .css('-webkit-transform', 'rotate(' + angle + 'deg)')
            .css('-moz-transform', 'rotate(' + angle + 'deg)')
            .css('-o-transform', 'rotate(' + angle + 'deg)')
            .css('-ms-transform', 'rotate(' + angle + 'deg)')
            .css('transform', 'rotate(' + angle + 'deg)');
    }
}

function endLinkMode() {
    $('#new-link-line').remove();
    $(document).unbind('mousemove.link').unbind('click.link').unbind('keydown.link');
}

/**
 * Load operators in select box
 * @param results
 */
function loadOperatorsInSelectBox(results){	 
	$(".pop-modal-content").find(".operators_select_box").each(function(){
    	$(this).ddslick({
    	    data       : results,
    	    width      : 170
    	});
    });
}

var connections = [];
var connectionsId = [];
//connections.push(new $.connect('#PROD2CAT', '#PRODUKT', {leftLabel : 'Many', rightLabel: 'One'}));

/**
 * Here we enable the drag and drop events for drag the tables and drop into drop area with list of columns
 */
function enableDNDEvents() {
    var zIndex = 3;
    $(".table-list li").draggable({
        revert   : "invalid",
        cursorAt : {
            top  : -8,
            left : -8
        },
        appendTo : "body",
        helper   : function(event, ui) {
            var tableName = $(this).attr("id");
            var html      = '<div class="drag-helper"><span><i class="fa fa-table"></i> ' + tableName + '</span></div>';
            return $(html);
        }
    });

    $(".table-droppable").droppable({
        tolerance  : "pointer",
        accept     : ".tree-table",
        hoverClass : "table-droppable-glow-effect",
        drop       : function(event, ui) {
        	var pos = ui.position, dPos = $(this).offset();
            var topPosition  = pos.top - dPos.top,
                leftPosition = pos.left - dPos.left,
                uniqueId     = guid(),
                tableName    = $(ui.draggable).attr("id"),
                tableId      = tableName + "_tblid_" + uniqueId,
                columnId     = tableName + "_columnid_" + uniqueId;
            $(this).append(
                $("<div>", {
                    'id'    : tableId,
                    'class' : 'table-column-list-container draggable',
                    'style' : 'display:none;left:' + leftPosition + 'px;top:' + topPosition + 'px;z-index:' + (zIndex++),
                    'html'  : '<div tableName="' + tableName + '" class="drag-table-title-bar"><span><i class="fa fa-table"></i> ' + tableName + '</span><div style="display:none;" id="' + tableName + '_tbl-delete" class="tbl-delete"><i class="fa fa-close fa-lg"></i></div></div><ul id="' + columnId + '" class="table-column-list"></ul>'
                })
            );
            $("#" + tableId).slideDown("normal", function() {
                $(this).show();
            });            
            $("#" + tableId).draggable({
                containment : "parent",
                handle      : ".drag-table-title-bar",
                drag        : function(event, ui) {
                	var item = this;
        			connections.forEach(function(connection){
        				if(connection.elem1[0] === item || connection.elem2[0] === item) {
        					connection.calculate();
        				}
        			})
                },
                start       : function(event, ui) {
                	$(this).css("z-index", zIndex++);
                    $(".delete-table-in-drop-area").show('fade');
                },
                stop        : function(event, ui) {
                    $(".delete-table-in-drop-area").hide('fade', {}, 1000);
                }
            });
            fetchTableColumnByTableNameAjax(tableName, columnId, loadTableColumns);
            loadTableInExpressionFilter(tableName);
        }
    });
}

/**
 * Enable the droppable option remove the table.
 */
function enableDeleteTable() {
    $(".delete-table-in-drop-area").droppable({
        greedy    : true,
        tolerance : "touch",
        accept    : ".table-column-list-container",
        drop      : function(event, ui) {
            deleteTableFromExpressionCombo($(ui.draggable).find(".drag-table-title-bar").attr("tableName"));
            $(ui.draggable).hide('scale', {
                origin: ["top", "right"]
            }, 300, function() {
                $(this).remove();
            });  
        }
    });
}


/**
 * Initialize the circle pulse effect for table drop operation from drop area
 */
$(document).ready(function() {
    var x = 0;
    addCircle(x);
    setInterval(function() {
        if (x === 0) {
            x = 1;
        }
        addCircle(x);
        x++;
    }, 1200);
});

/**
 * Animation for show the pulse effect for delete the table which is drop inside the drop area
 * @param id
 */
function addCircle(id) {
    $('.delete-table-in-drop-area').append('<div id="' + id + '" class="circle"></div>');
    $('#' + id).animate({
        'width': '100px',
        'height': '100px',
        'margin-top': '-48px',
        'margin-left': '-48px',
        'opacity': '0',
    }, 4000, 'easeOutCirc');

    setInterval(function() {
        $('#' + id).remove();
    }, 4000);
}
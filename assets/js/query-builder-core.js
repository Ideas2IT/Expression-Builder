
function loadExpressionBuilder(){
	$('#builder').queryBuilder({
	    sortable: true,
	
	    onValidationError: function($target, err) {
	        console.error(err, $target);
	    },	
	    filters : []
	});

// set rules
$('.set').on('click', function() {
        $('#builder').queryBuilder('setRules', {
            condition: 'AND',
            rules: [{
                id: 'price',
                operator: 'between',
                value: [10.25, 15.52]
            }, {
                condition: 'OR',
                rules: [{
                    id: 'category',
                    operator: 'equal',
                    value: 2
                }, {
                    id: 'coord',
                    operator: 'equal',
                    value: 'B.3'
                }]
            }]
        });

        $('.parse-json').trigger('click');
    })
    //.trigger('click');
}




// reset builder
$('.reset').on('click', function() {
	if($(".expression-container").is(":visible")){	
	    $('#builder').queryBuilder('reset');
	    $('#content').find('pre').empty();
	}
});

// get rules
$('.parse-json').on('click', function() {
	var jsonQry       = {};
	var JSON_Select   = selectQueryJSON();
	var JSON_Rules    = $('#builder').queryBuilder('getRules');
	jsonQry["select"] = JSON_Select;
	jsonQry["rules"]  = JSON_Rules;
	var htmlContent   = $("<pre>", {
		'html' : JSON.stringify(jsonQry, undefined, 2)
	});
	getDialogHtml(htmlContent);
});

$('.parse-sql').on('click', function() {
    var res = $('#builder').queryBuilder('getSQL', $(this).data('stmt'), false);
    $('#result').removeClass('hide')
        .find('pre').html(
            res.sql + (res.params ? '\n\n' + JSON.stringify(res.params, undefined, 2) : '')
        );
});

function selectQueryJSON(){
	var selectJSON = [];
	$("#table-droppable").find(".table-column-list-container").each(function(){
	    var selectedColumnJSON = [], selectedColumn = {};
	    var tableName          = $(this).find(".drag-table-title-bar").attr("tableName");
	    var selectedColumnEle  = $(this).find("ul.table-column-list");
	    selectedColumnEle.find("li.column-highlight").each(function(){
	        selectedColumnJSON.push({
	            'id'        : $(this).attr("id"),
	            'tableName' : $(this).attr("name")
	        });
	    });
	    selectedColumn[tableName] = selectedColumnJSON;
	    selectJSON.push(selectedColumn); 
	});	
	return selectJSON;
}

function loadFilterCombo(selectObj, rule_id) {
	var tableName = $(selectObj).val();
	if(tableName.indexOf("Select table") >= -1){
		fetchTableColumnByTableNameAjax(tableName, rule_id, loadTableColumnsInFilter);
	}
}

function loadTableColumnsInFilter(columns, rule_id, tableName){
	$('#builder').queryBuilder('updateColumnCombo', {
		rule_id   : rule_id,
		columns   : columns,
		tableName : tableName
	});
}

function loadTableInExpressionFilter(tableName) {
	$('#builder').queryBuilder('updateTableCombo', {
		tableName : tableName,
		mode      : "add"
	});
}

function deleteTableFromExpressionCombo(tableName){
	$('#builder').queryBuilder('updateTableCombo', {
		tableName : tableName,
		mode      : "delete"
	});
}


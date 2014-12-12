/**
 * Fetch all tables
 * @param callback is function, call the function once the data fetch from datasource
 * @author mahesh
 */
function fetchAllTablesAjax(callback) {
    $.getJSON('/assets/json/Tables.json', function(results) {
        callback(results);
    });
}

/**
 * Fetch tables by table name
 * @param tableNameStr is table name
 * @param callback is function, call the function once the data fetch from datasource
 */
function fetchTablesByTableNameAjax(tableNameStr, callback) {
    $.getJSON('/assets/json/Tables.json', function(tables) {
        var results = [];
        $.each(tables, function(index, table) {
            if ((table.name).indexOf(tableNameStr) >= 0) {
                results.push(table);
            }
        });
        callback(results);
    });
}

/**
 * Fetch column by table name
 * @param tableName is table name
 * @param columnId is unique div id for load the column action in separate  dialog
 * @param callback is function, call the function once the data fetch from data source
 */
function fetchTableColumnByTableNameAjax(tableName, targetId, callback) {
    $.getJSON('/assets/json/TableInfo.json', function(tableColumns) {
        var results = tableColumns[tableName];
        callback(results, targetId, tableName);
    });
}

/**
 * Fetch operators data
 * @param callback is function, call the function once the data fetch from data source
 */
function fetchOperators(callback) {
    $.getJSON('/assets/json/OperatorsData.json', function(results) {
    	callback(results);
    });
}
/**
 * Generate four random hex digits.
 */
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

/**
 * Generate a pseudo-GUID by concatenating random hexadecimal.
 */
function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/**
 * Enable slim scroll for given dom element based on attributes
 * @param domEle
 * @param attributes
 */
function enableSlimScroll(domEle, attributes) {
    domEle.slimscroll(attributes);
}

function getDialogHtml(htmlContent){	
    $("body").append(
    	$("<div>", {
    	   'id'    : "pop-model-parent",
	       "style" : "display:none;",
	       "html"  : $("<div>", {
				    	"id"   : "content",
				    	"html" : htmlContent
				    }).append(
				        $("<div>", {
				        	"class" : "pop-modal-content"
				        })		
				    ).append(
				        $("<div>", {
				        	"class" : "popModal_footer hide"
				        }).append(
			        		$("<button>", {
				        		"data-popmodal-but" : "ok",
				        		"text"              : "ok"
					        	})		
			        	).append(
			    			$("<button>", {
			            		"data-popmodal-but" : "cancel",
			            		"text"              : "cancel"
			            	})		
			        	)		
				    )
			})
    	);
    $('#content').dialogModal({
    	onClose : function(){ 
    		$("#pop-model-parent").remove();
    	}
    });
}

function generateOnOffSwitch(name) {
    return $("<label>", {
        'onclick': '',
        'class': 'switch-light switch-ios switch-light-in-table',
        'html': $("<input>", {
        	'id'   : 'grouping',
            'type' : 'checkbox',
            'name' : name
        })
    }).append(
        $("<span>", {
            'html': $("<span>", {
                'text': 'Off'
            })
        }).append(
            $("<span>", {
                'text': 'On'
            })
        )
    ).append(
        $("<a>")
    );
}

function generateThreeStateSwitch(name) {
    return $("<div>", {
        'class': 'switch-toggle switch-3 switch-ios switch-in-cell'
    }).append(
        $("<input>", {
            'type': 'radio',
            'checked': '',
            'name': name,
            'id': name + '_ascending',
            'value':'-1'
        })
    ).append(
        $("<label>", {
            'onclick': '',
            'for': name + '_ascending',
            'text': 'A-Z'
        })
    ).append(
        $("<input>", {
            'type': 'radio',
            'checked': '',
            'name': name,
            'id': name + '_NA',
            'value':'0'
        })
    ).append(
        $("<label>", {
            'onclick': '',
            'for': name + '_NA',
            'text': 'N/A'
        })
    ).append(
        $("<input>", {
            'type': 'radio',
            'checked': '',
            'name': name,
            'id': name + '_descending',
            'value':'1'
        })
    ).append(
        $("<label>", {
            'onclick': '',
            'for': name + '_descending',
            'text': 'Z-A'
        })
    ).append(
        $("<a>")
    );
}

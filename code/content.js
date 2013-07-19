
function update(options) {
	if (options) {
		$.each(options, function(key, value) {
			var className = value['className'];
			var elements = $('.issues-list td[class*=' + className + '], .issues-list th[class*=' + className + ']');
			if (!value['enabled']) {
				elements.hide();
			} else {
				elements.show();
			}
		});
	}	
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
	if (changes['bbex']) {
		update(changes['bbex'].newValue);
	}
});

$(function() {
	chrome.storage.sync.get('bbex', function(storage) {
		update(storage['bbex']);
	});
});


var tabSize = 4;
var originalHtml = null;

function update(options) {
	if (options) {
		$.each(options, function(key, value) {
			switch (key) {
				case 'tab':
					tabSize = value;
					fixSpaces();
					break;
				case 'version':
					break;
				default:
					var className = value['className'];
					var elements = $('.issues-list td[class*=' + className + '], .issues-list th[class*=' + className + ']');
					if (!value['enabled']) {
						elements.hide();
					} else {
						elements.show();
					}
					break;
			}
		});
	}
}

function fixSpaces(reset) {
	var code = $('#editor-container');
	if ((code.length > 0) && code.html()) {
		if (!originalHtml || reset) {
			originalHtml = code.html();
		}
		if (originalHtml) {
			code.html(originalHtml.replace(/[ ]{8}/g, new Array(tabSize + 1).join(' ')));
		}
	}
	var refractContainer = $('.refract-container .source');
	if (refractContainer.length > 0) {
		refractContainer.css('tab-size', tabSize.toString());
	}
	var fileSourceElement = $('.file-source');
	if (fileSourceElement.length > 0) {
		fileSourceElement.css('tab-size', tabSize.toString());
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
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			$.each(mutation.addedNodes, function(index, value) {
				if (value.id == 'editor-container') {
					fixSpaces(true);
				}
			});
		});
	});
	var config = { childList: true };
	if ($('#source-container').length > 0) {
		observer.observe($('#source-container').get(0), config);
	}
});

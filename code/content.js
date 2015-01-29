
var tabSize = 4;
var originalHtml = null;

function update(options) {
	if (options) {
		var classes = $.map(options, function(value, index) {
			return value.className;
		});
		$.each(options, function(key, value) {
			switch (key) {
				case 'tab':
					tabSize = value;
					fixSpaces();
					break;
				case 'version':
					break;
				default:
					var className = value.className;
					var elements = $('.issues-list tr td[class*=' + className + '], .issues-list tr th[class*=' + className + ']');
					if (!value.enabled) {
						elements.hide();
					} else {
						elements.show();
					}
					elements = $('.issues-list tr td, .issues-list tr th').filter(function() {
						var valid = true;
						for (var i = 0; i < classes.length; i++) {
							if ($(this).hasClass(classes[i])) {
								valid = false;
								break;
							}
						}
						return valid && ($(this).find('a[title*=' + className + '], a[title*=' + (className[0].toUpperCase() + className.substring(1)) + ']').length > 0);
					});
					if (!value.enabled) {
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
	var editorContainer = $('#editor-container');
	if (editorContainer.length > 0) {
		editorContainer.css('tab-size', tabSize.toString());
	}
	var sourceContainer = $('.diff-container .source');
	if (sourceContainer.length > 0) {
		sourceContainer.css('tab-size', tabSize.toString());
	}
	var refractContainer = $('.refract-container .source');
	if (refractContainer.length > 0) {
		refractContainer.css('tab-size', tabSize.toString());
	}
	var fileSourceElement = $('.file-source');
	if (fileSourceElement.length > 0) {
		fileSourceElement.css('tab-size', tabSize.toString());
	}
	var scrollableFilePane = $('.scrollable-file-pane');
	if (scrollableFilePane.length > 0) {
		scrollableFilePane.css('tab-size', tabSize.toString());
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
				console.log(value.id);
				if ((value.id == 'editor-container')
					|| (value.id == 'pullrequest-diff')
					|| $(value).hasClass('diffract')) {
					fixSpaces(true);
				}
			});
		});
	});
	var config = { childList: true, subtree: true };
	if ($('html').length > 0) {
		observer.observe($('html').get(0), config);
	}
	$('.milestone > div').width('auto');
});

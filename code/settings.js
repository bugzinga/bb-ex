
function initialize(options) {
	$.each(options, function(key, value) {
		switch (key) {
			case 'tab':
				$('#tabSize .option').each(function() {
					var tab = $(this);
					if (tab.text() != value) {
						tab.addClass('disabled');
					} else {
						tab.removeClass('disabled');
					}
					tab.click(function() {
						chrome.storage.sync.get('bbex', function(storage) {
							var options = storage['bbex'];
							var value = parseInt(tab.text());
							if (options['tab'] != value) {
								options['tab'] = value;
								chrome.storage.sync.set({ 'bbex' : options }, function() {
									$('#tabSize .option').each(function() {
										var tab = $(this);
										if (tab.text() != value) {
											tab.addClass('disabled');
										} else {
											tab.removeClass('disabled');
										}
									});
								});
							}
						});
					});
				});
				break;
			case 'version':
				break;
			default:
				var option = $('<div>').addClass('option').attr('id', key).text(value['name']);
				if (!value.enabled) {
					option.addClass('disabled');
				}
				option.click(function() {
					var option = $(this);
					chrome.storage.sync.get('bbex', function(storage) {
						var options = storage['bbex'];
						var id = option.attr('id');
						options[id]['enabled'] = !options[id]['enabled'];
						chrome.storage.sync.set({ 'bbex' : options }, function() {
							option.toggleClass('disabled');
						});
					});
				});
				$('#issues').append(option);
				break;
		}
	});
}

$(function() {
	chrome.storage.sync.get('bbex', function(storage) {
		var options = storage['bbex'];
		if (!options || (options.version == '0.0.1') || (options.version == '0.0.2') || (options.version == '0.0.3')) {
			options = {
				'version': '0.0.4',
				'0' : { 'name' : 'Repository', 'className' : 'repo', 'enabled': true },
				'1' : { 'name' : 'Title', 'className' : 'text', 'enabled': true },
				'2' : { 'name' : 'Type', 'className' : 'type', 'enabled': true },
				'3' : { 'name' : 'Priotiry', 'className' : 'priority', 'enabled': true },
				'4' : { 'name' : 'Status', 'className' : 'state', 'enabled': true },
				'5' : { 'name' : 'Votes', 'className' : 'votes', 'enabled': true },
				'6' : { 'name' : 'Assignee', 'className' : 'person', 'enabled': true },
				'7' : { 'name' : 'Milestone', 'className' : 'milestone', 'enabled': true },
				'8' : { 'name' : 'Version', 'className' : 'version', 'enabled': true },
				'9' : { 'name' : 'Dates', 'className' : 'date', 'enabled': true },
				'tab' : 4
			}
			chrome.storage.sync.set({ 'bbex' : options }, function() {
				initialize(options);
			});
		} else {
			initialize(options);
		}
	});
});

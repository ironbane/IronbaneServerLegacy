// inventory.js

IronbaneApp
.directive('inventory', ['$log', '$window', '$timeout', function($log, $window, $timeout) {
	return {
		restrict: 'E',
		template: '<div id="itemBar" class="dragon-bar"></div>' ,
		link: function($scope, el, attrs){
			$scope.makeInventorySlots = function(num) {
				spaces = num;

				var dropFunction = function(e, ui) {
					_.partial(hudHandler.onInvSlotDrop, e, ui, hudHandler)();
				};
				var clickFunction = function(e) {
					var $slot = $(this),
					$item = $slot.children().data('item'); // there should only ever be 1 or 0 (null)

					// handle use based on child data
					console.log($slot.attr('id') + " clicked!", $item);

					if ($item) {
						if (e.shiftKey && $item.stackable) {
							ironbane.player.splitItem($item.slot);
						} else {
							ironbane.player.useItem($item.slot);
						}
					}
				};

				el.empty();
				for (var x = 0; x < spaces; x++) {
					var slot = $('<div id="is' + x + '" class="dragon-slot itemBarSlot"></div>');
					slot.data('slot', x);
					el.append(slot);
					slot.droppable({
						drop: dropFunction,
						greedy: true,
						tolerance: 'pointer',
						hoverClass: 'dragon-hover'
					});
					slot.click(clickFunction);
				}
			};
			$scope.fillInvSlot = function(item) {
				var HUD = this,
					imageUrl = getImageUrlForItem(item);

				var slotSelector = '#is' + item.slot;
				$(slotSelector).addClass('occupied');
				if (item.equipped === 1) {
					$(slotSelector).addClass('equipped');
				}

				var itemImg = $('<img src="' + imageUrl + '" class="dragon-item invSlotItem" />');
				itemImg.data('item', item);
				$(slotSelector).append(itemImg);
				if (item.type !== 'cash') {
					// with the exception of gold bags, we only allow INV to INV drops (if we aren't blank)
					$(slotSelector).droppable({ accept: ".invSlotItem" });
				}

				hudHandler.makeItemHover(itemImg, item);

				itemImg.draggable({
					containment: '#gameFrame',
					revert: 'invalid',
					zIndex: 110,
					helper: 'clone',
					appendTo: 'body',
					start: function(e, ui) {
						ui.helper.data('item', item);
					}
				});
			};
			$scope.clearInvSlot = function(slotNum) {
				$('#is' + slotNum).empty().removeClass('occupied equipped used').droppable({accept: '*'});
			};
			$scope.updateInvSlotStatus = function(slotNum, status) {
				var $slot = $('#is' + slotNum);

				if (status === 'equipped') {
					$slot.addClass(status);
				} else {
					$slot.removeClass('equipped');
				}

				if (status === 'used') {
					$slot.addClass(status);
					// todo: better animation?
					setTimeout(function() {
						$slot.removeClass('used');
					}, 500);
				}
			};
			$scope.showInv =function(data) {
				$scope.makeInventorySlots(data.slots);
				$('#itemBar').show();

				angular.forEach(data.items, function(invItem) {
					$scope.fillInvSlot(invItem);
				});

				// any time we show the inventory, we should update the gold
				hudHandler.makeCoinBar();
			};

		}      
	};
}]);
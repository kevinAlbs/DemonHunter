//circular linked list
//specialized for background buffer used in viewport class
function LinkedList(){
	function Node(data){
		this.data = data;
		this.next = null;
		this.prev = null;
	};
	var that = {};
	var rear = null,
		iterator = null,
		size = 0;
	var arr = null;

	that.addToRear = function(data){
		size++;
		var newNode = new Node(data, null);
		if(rear == null){
			rear = newNode;
			newNode.next = rear;
			newNode.prev = rear;
		}
		else{
			newNode.next = rear.next;	
			newNode.prev = rear;
			rear.next.prev = newNode;
			rear.next = newNode;
			rear = newNode;
		}
	};

	that.getArr = function(){
		/*
		returns an array of access for randomizing colours
		note that since the linked list shifts, the array maintains no order
		this is only useful for randomization
		*/
		if(arr == null){
			//initialize
			var i = 0;
			arr = new Array(that.getSize());
			var ptr = rear.next;
			do{	
				arr[i] = ptr.data;
				i++;
				ptr = ptr.next;
			}while(ptr != rear.next);
		}
		return arr;
	}

	/* shifts linked list to the right, moving the rear node to the front
	 * returns the node that was just shifted's data
	 */
	that.shiftRight = function(){
		rear = rear.prev;
		return rear.next.data;
	};

	that.shiftLeft = function(){
		rear = rear.next;
		return rear.data;
	};

	that.getSize = function(){
		return size;
	};

	that.iterate = function(){
		var dataToReturn = null;
		if(iterator == null){
			dataToReturn = rear.next.data;
			//first call
			iterator = rear.next.next;
			return dataToReturn;	
		}
		else{
			if(iterator == rear.next){
				iterator = null;
				return null;
				//iteration complete
			}
			else{
				dataToReturn = iterator.data;
				iterator = iterator.next;
				return dataToReturn;	
			}
		}
	};

	return that;
};

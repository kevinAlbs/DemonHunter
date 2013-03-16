//circular array
//specialized for background buffer used in viewport class
function BGBufferArray(arrSize){
	var that = {};
	var pointer = 0, 
		insertionPointer = 0,
		iterationPointer = null,
		size = 0;
	var arr = new Array(arrSize);

	//returns next index
	function getNext(ptr){
		return (ptr + 1 > arr.length - 1) ? 0: ptr + 1;
	}

	function getPrev(ptr){
		return (ptr - 1 < 0) ? arr.length - 1 : ptr - 1;
	}

	that.addToRear = function(data){
		size++;
		arr[insertionPointer] = data;
		insertionPointer++;
	};

	that.getArr = function(){
		return arr;
	}
	//shifts pointer down by one, thus adding an item to the left of the screen
	//returns itself since this is the column to be updated
	that.shiftRight = function(){
		pointer--;
		if(pointer < 0){
			pointer = arr.length - 1;
		}
		return arr[pointer];
	};
	//shifts pointer up one, thus adding an item to the right of the screen
	//happens when moving forward
	//returns the new row to be updated, which is the previous pointer
	that.shiftLeft = function(){
		var prev = pointer;
		pointer++;
		if(pointer > arr.length - 1){
			pointer = 0;
		}
		return arr[prev];
	};

	that.getSize = function(){
		return size;
	};

	that.iterate = function(){
		var dataToReturn = null;
		if(iterationPointer == null){
			dataToReturn = arr[pointer];
			//first call
			iterationPointer = pointer+1;
			if(iterationPointer > arr.length - 1){
				iterationPointer = 0;
			}
			return dataToReturn;	
		}
		else{
			if(iterationPointer == pointer){
				iterationPointer = null;
				return null;
				//iteration complete
			}
			else{
				dataToReturn = arr[iterationPointer];
				iterationPointer++;
				if(iterationPointer > arr.length - 1){
					iterationPointer = 0;
				}
				return dataToReturn;
			}
		}
	};

	return that;
};

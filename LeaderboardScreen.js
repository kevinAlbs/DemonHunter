function LeaderboardScreen(menuScreen){
    function back(){
        GM.switchScreen(menuScreen, true);
    }
    function toggleListeners(val){
        var fn = val + "EventListener";
        document.getElementById("btn-back")[fn]("click",function(){back();}, false);
    }
    /* screen methods */
    this.init = function(){
        toggleListeners("add");
    };
    this.show = function(){
        document.getElementById("screen-leaderboard").style.display = "block";
    };
    this.hide = function(){
        document.getElementById("screen-leaderboard").style.display = "none";
    };
};
GM.utils.inherits(LeaderboardScreen, Screen);
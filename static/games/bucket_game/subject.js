Subject = function(sid, task, task_type, problem_set, session, play) {
	this.sid = sid
	this.task = task
  this.task_type = task_type
  this.problem_set = problem_set
	this.data = {}
	this.taskData = {}
	this.session = session
	this.play = play

	this.inputData = function(field, value) {
		this.data[field] = value
	}

	this.sendData = function(trial) {
		this.data['trial'] = trial
		this.data['username'] = this.sid
		this.data['task'] = this.task
		this.data['session'] = this.session
		this.data['play'] = this.play

		url = 'http://' + homebase + '/trial/' //want to post this to URL where api server is
		$.ajax({
		  type: "POST",
		  url: url,
		  data: JSON.stringify(this.data),
		  contentType: 'application/json',
		  dataType: 'json'
		})

		this.data = {}

	}

}

function set_up_subject(task) {
	//first check if we're logged in
	user = getCookie('users')

	//if not, we redirect them to the index page
	if(user == 0) {
		window.location = "http://" + homebase + '/index.html'
	}

	this.url = 'http://' + homebase + '/tasks/'

	send = {'user': user, 'task':task};

	play = parseInt(getCookie('play'))
	nextPlay = play + 1

	if(play == 0) {
		setCookie('play', 1, 1)
	} else {
		setCookie('play',nextPlay,1)
	}

	play = parseInt(getCookie('play'))

  // This cookie is set by our login code so it doesn't exist here right now
	//session = parseInt(getCookie('session'))
  session = 1

	return [user, session, play];
}


function setCookie(c_name,value,exdays) {

	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	c = c_name + "=" + c_value + "; path=/";
	document.cookie=c;

}


function getCookie(c_name) {

	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++){
	  	x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	  	y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	  	x=x.replace(/^\s+|\s+$/g,"");

		if (x==c_name) {return unescape(y);}
	}

	return 0;

}

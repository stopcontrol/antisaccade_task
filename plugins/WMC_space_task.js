/**
 * Working memory capacity Test
 * Replication of
 * Unsworth, N., Fukuda, K., Awh, E., & Vogel, E. K. (2014).
 * Working memory and fluid intelligence: Capacity, attention control, and secondary memory retrieval. Cognitive psychology, 71, 1-26.
 * MJ
 * plugin for displaying concentric stimuli in random spatial order for n Seconds
 **/


jsPsych.plugins['space-task'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('free-sort', 'stimuli', 'image');

  plugin.info = {
    name: 'free-sort',
    description: '',
    parameters: {
      stimuli: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: undefined,
        array: true,
        no_function: false,
        description: ''
      },
      stim_height: {
        type: [jsPsych.plugins.parameterType.INT],
        default: 100,
        no_function: false,
        description: ''
      },
      stim_width: {
        type: [jsPsych.plugins.parameterType.INT],
        default: 100,
        no_function: false,
        description: ''
      },
      sort_area_height: {
        type: [jsPsych.plugins.parameterType.INT],
        default: 1000,
        no_function: false,
        description: ''
      },
      sort_area_width: {
        type: [jsPsych.plugins.parameterType.INT],
        default: 1000,
        no_function: false,
        description: ''
      },
      prompt: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: '',
        no_function: false,
        description: ''
      },
      timing_stim: {
        type: [jsPsych.plugins.parameterType.INT],
        default: -1,
        no_function: false,
        description: ''
      },
      prompt_location: {
        type: [jsPsych.plugins.parameterType.SELECT],
        options: ['above','below'],
        default: 'above',
        no_function: false,
        description: ''
      }
    }
  }

  plugin.trial = function(display_element, trial) {



    // default values
    trial.stim_height = trial.stim_height || 100;
    trial.stim_width = trial.stim_width || 100;
    trial.prompt = (typeof trial.prompt === 'undefined') ? '' : trial.prompt;
    trial.prompt_location = trial.prompt_location || "above";
    trial.sort_area_width = trial.sort_area_width || 600;
    trial.sort_area_height = trial.sort_area_height || 600;
    trial.timing_stim = trial.timing_stim || -1;
    //trial.sort_area_width1 = trial.sort_area_width || 800;
    //trial.sort_area_height1 = trial.sort_area_height || 800;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    var start_time = (new Date()).getTime();

    // check if there is a prompt and if it is shown above
  /*  if (trial.prompt && trial.prompt_location == "above") {
      display_element.innerHTML += trial.prompt;
    } */

    var end_trial = function() {

          // kill any remaining setTimeout handlers
          jsPsych.pluginAPI.clearAllTimeouts();

/*
          // kill keyboard listeners
          if (typeof keyboardListener !== 'undefined') {
            jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          }
*/
          // clear the display
          display_element.innerHTML = '';

          // move on to the next trial
          jsPsych.finishTrial(trial_data);
        };


  /*  display_element.innerHTML += '<div '+
      'id="jspsych-free-sort-arena" '+
      'class="jspsych-free-sort-arena" '+
      'style="position: relative; width:'+trial.sort_area_width1+'px; height:'+trial.sort_area_height1+'px; border:1px solid #444;border-radius: 300px;"'+
      '></div>'; */

    display_element.innerHTML += '<div '+
      'id="jspsych-free-sort-arena" '+
      'class="jspsych-free-sort-arena" '+
      'style="position: relative; width:'+trial.sort_area_width+'px; height:'+trial.sort_area_height+'px; border:1px solid #444;border-radius: 300px;"'+
      '></div>';
/*
    // check if prompt exists and if it is shown below
    if (trial.prompt && trial.prompt_location == "below") {
      display_element.innerHTML += trial.prompt;
    }
*/
    // store initial location data

    var x_center = (trial.sort_area_width / 2 - trial.stim_width /2);
    var y_center = (trial.sort_area_height/2 - trial.stim_height / 2);
    console.log('arena_width: ' + trial.sort_area_width);

    var x_start_locations = [ x_center,// 0 ,
                            436,//250 + ((Math.sin(30)) * y_center),//(x_center + ((Math.cos(30)) * y_center)),// y_center - Math.sin(30) * y_center,
                            434,//x_center + Math.cos(30) * y_center, //y_center + Math.sin(30) * y_center,
                            252,//x_center,// 2 * y_center, D
                            72,
                            49//251,//x_center - Math.cos(30) * y_center,// y_center + Math.sin(60) * y_center,
                            //x_center - Math.cos(30) * y_center// y_center - Math.sin(60) * y_center,
                          ];

    var y_start_locations = [  0 ,
                              143,//(250 - (Math.cos(30) * y_center)),
                              399,//y_center + Math.sin(30) * y_center,
                              491,//2 * y_center,D
                              392,//y_center + Math.sin(30) * y_center,
                              128//y_center - Math.sin(30) * y_center
                            ];


    var init_locations = [];

    for (var i = 0; i < trial.stimuli.length; i++) {
      for (var j = 0; i < trial.stimuli.length; j++) {
      //i = i + 1;
      coords = {
        x: x_start_locations[i],
        y: y_start_locations[i]
      };
      i = i + 1;

      console.log(i);
      console.log(j);
      console.log(coords);
      //random_coordinate(trial.sort_area_width + trial.stim_width / 2, trial.sort_area_height + trial.stim_height / 2);

      display_element.querySelector("#jspsych-free-sort-arena").innerHTML += '<img '+
        'src="'+trial.stimuli[j]+'" '+
        'data-src="'+trial.stimuli[j]+'" '+
        'class="jspsych-free-sort-draggable" '+
        'draggable="false" '+
        'style="position: absolute; cursor: move; width:'+trial.stim_width+'px; height:'+trial.stim_height+'px; top:'+coords.y+'px; left:'+coords.x+'px;">'+
        '</img>';

      init_locations.push({
        "src": trial.stimuli[j],
        "x": coords.x,
        "y": coords.y
      });
    }}

/*
    display_element.innerHTML += '<button id="jspsych-free-sort-done-btn" class="jspsych-btn">Done</button>';

    var maxz = 1;

    var moves = [];

    var draggables = display_element.querySelectorAll('.jspsych-free-sort-draggable');

    for(var i=0;i<draggables.length; i++){
      draggables[i].addEventListener('mousedown', function(event){
        var x = event.pageX - event.currentTarget.offsetLeft;
        var y = event.pageY - event.currentTarget.offsetTop - window.scrollY;
        var elem = event.currentTarget;
        elem.style.zIndex = ++maxz;

        var mousemoveevent = function(e){
          elem.style.top =  Math.min(trial.sort_area_height - trial.stim_height, Math.max(0,(e.clientY - y))) + 'px';
          elem.style.left = Math.min(trial.sort_area_width  - trial.stim_width,  Math.max(0,(e.clientX - x))) + 'px';
        }
        document.addEventListener('mousemove', mousemoveevent);

        var mouseupevent = function(e){
          document.removeEventListener('mousemove', mousemoveevent);
          moves.push({
            "src": elem.dataset.src,
            "x": elem.offsetLeft,
            "y": elem.offsetTop
          });
          document.removeEventListener('mouseup', mouseupevent);
        }
        document.addEventListener('mouseup', mouseupevent);
      });
    } */

    //display_element.querySelector('#jspsych-free-sort-done-btn').addEventListener('click', function(){

      var end_time = (new Date()).getTime();
      var rt = end_time - start_time;
      // gather data
      // get final position of all objectsf
      var final_locations = [];
    //  var matches = display_element.querySelectorAll('.jspsych-free-sort-draggable');
    /*  for(var i=0; i<matches.length; i++){
        final_locations.push({
          "src": matches[i].dataset.src,
          "x": matches[i].style.position.left,
          "y": matches[i].style.position.top
        });
      }
*/

      var trial_data = {
        "stimuli": JSON.stringify(trial.stimuli),
        "init_locations": JSON.stringify(init_locations),
      //  "moves": JSON.stringify(moves),
        "final_locations": JSON.stringify(final_locations),
        "rt": rt
      };



      // advance to next part
    //  display_element.innerHTML = '';
      //jsPsych.finishTrial(trial_data);
  //  });

    if (trial.timing_response > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.timing_response);
    }
  };

  return plugin;
})();
